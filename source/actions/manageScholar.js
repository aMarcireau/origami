import {ipcRenderer} from 'electron'
import htmlparser from 'htmlparser2'
import cssSelect from 'css-select'
import {publicationFromCiterMetadata} from './manageCrossref'
import {levenshteinDistance} from '../libraries/utilities'
import {
    FETCH_SCHOLAR_REQUEST,
    RESOLVE_SCHOLAR_INITIAL_REQUEST,
    RESOLVE_SCHOLAR_CITERS_REQUEST,
    REJECT_SCHOLAR_CITERS_REQUEST,
    REJECT_SCHOLAR_CITER_PARSING,
    REJECT_SCHOLAR_CONNECTION,
    SCHOLAR_REQUEST_REFRACTORY_PERIOD_DONE,
    SET_SCHOLAR_REQUEST_REFRACTORY_PERIOD,
    BLOCK_SCHOLAR,
    UNBLOCK_SCHOLAR,
    RESET_SCHOLAR,
    CHANGE_RECAPTCHA_VISIBILITY,
    SCHOLAR_DISCONNECT,
} from '../constants/actionTypes'
import {
    SCHOLAR_REQUEST_TYPE_INITIALIZE,
    SCHOLAR_REQUEST_TYPE_CITERS,
    SCHOLAR_STATUS_BLOCKED_HIDDEN,
    SCHOLAR_STATUS_BLOCKED_VISIBLE,
} from '../constants/enums'

export function fetchScholarRequest() {
    return {type: FETCH_SCHOLAR_REQUEST};
}

export function rejectScholarConnection() {
    return {type: REJECT_SCHOLAR_CONNECTION};
}

export function setScholarRequestRefractoryPeriod(minimum, maximum) {
    return {
        type: SET_SCHOLAR_REQUEST_REFRACTORY_PERIOD,
        minimum,
        maximum,
    };
}

export function unblockScholar() {
    return {type: UNBLOCK_SCHOLAR};
}

export function changeRecaptchaVisibility() {
    return {type: CHANGE_RECAPTCHA_VISIBILITY};
}

export function scholarDisconnect() {
    return {type: SCHOLAR_DISCONNECT};
}

const firstCategoryRecaptchaQuery = cssSelect.compile('#gs_captcha_c');
const secondCategoryRecaptchaQuery = cssSelect.compile('.g-recaptcha');
const titleQuery = cssSelect.compile('head title');
const publicationsQuery = cssSelect.compile('.gs_r.gs_or.gs_scl .gs_ri');
const titleFromPublicationQuery = cssSelect.compile('.gs_rt a');
const citersLinkFromPublicationQuery = cssSelect.compile('.gs_fl a');
const metadataFromPublicationQuery = cssSelect.compile('.gs_a');

export function resolveHtml(url, text) {
    return (dispatch, getState) => {
        const dispatchAndEcho = (action, refractoryPeriod) => {
            if (action != null) {
                const now = Date.now();
                dispatch({
                    ...action,
                    beginOfRefractoryPeriod: now,
                    endOfRefractoryPeriod: now + refractoryPeriod,
                });
            }
            setTimeout(() => {
                dispatch({type: SCHOLAR_REQUEST_REFRACTORY_PERIOD_DONE});
            }, refractoryPeriod);
        }
        new Promise((resolve, reject) => {
            const parser = new htmlparser.Parser(new htmlparser.DomHandler((error, dom) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(dom);
                }
            }));
            parser.write(text);
            parser.end();
        })
            .then(dom => {
                const state = getState();
                const blocked = state.scholar.status === SCHOLAR_STATUS_BLOCKED_HIDDEN || state.scholar.status === SCHOLAR_STATUS_BLOCKED_VISIBLE;
                if (
                    cssSelect(firstCategoryRecaptchaQuery, dom).length > 0
                    || cssSelect(secondCategoryRecaptchaQuery, dom).length > 0
                ) {
                    if (!blocked) {
                        dispatch({
                            type: BLOCK_SCHOLAR,
                            url,
                        });
                    }
                } else if (
                    decodeURIComponent(url) === 'https://ipv4.google.com/sorry/index'
                    || (cssSelect(titleQuery, dom).length > 0
                        && cssSelect(titleQuery, dom)[0].children
                        && cssSelect(titleQuery, dom)[0].children[0].data === 'Sorry...'
                    )
                ) {
                    ipcRenderer.once('cookies-cleared', () => {
                        dispatchAndEcho({type: RESET_SCHOLAR}, 0);
                    });
                    ipcRenderer.send('clear-cookies');
                } else {
                    const refractoryPeriod = Math.floor(
                        Math.random() * (1 + state.scholar.maximumRefractoryPeriod - state.scholar.minimumRefractoryPeriod)
                    ) + state.scholar.minimumRefractoryPeriod;
                    if (!state.publications.has(state.scholar.requests[0].doi)) {
                        switch (state.scholar.requests[0].type) {
                            case SCHOLAR_REQUEST_TYPE_INITIALIZE:
                                dispatchAndEcho({
                                    type: RESOLVE_SCHOLAR_INITIAL_REQUEST,
                                    numberOfCiters: 0,
                                    scholarId: null,
                                }, refractoryPeriod);
                                break;
                            case SCHOLAR_REQUEST_TYPE_CITERS:
                                dispatchAndEcho({type: RESOLVE_SCHOLAR_CITERS_REQUEST}, refractoryPeriod);
                                break;
                            default:
                                console.error(`Unexpected Scholar request type ${state.scholar.requests[0].type}`);
                                dispatchAndEcho(null, refractoryPeriod);
                                break;
                        }
                    } else {
                        switch (state.scholar.requests[0].type) {
                            case SCHOLAR_REQUEST_TYPE_INITIALIZE: {
                                const publications = cssSelect(publicationsQuery, dom);
                                const candidates = [];
                                for (const publication of publications) {
                                    const titleCandidates = cssSelect(titleFromPublicationQuery, publication);
                                    if (
                                        titleCandidates.length === 0
                                        || !titleCandidates[0].children
                                        || titleCandidates[0].children.length === 0
                                        || titleCandidates[0].children[0].type !== 'text'
                                    ) {
                                        continue;
                                    }
                                    for (let citersLinkCandidate of cssSelect(citersLinkFromPublicationQuery, publication)) {
                                        if (
                                            citersLinkCandidate.children
                                            && citersLinkCandidate.children.length > 0
                                            && citersLinkCandidate.children[0].type === 'text'
                                            && citersLinkCandidate.attribs
                                            && citersLinkCandidate.attribs.href
                                        ) {
                                            const numberOfCitersMatch = citersLinkCandidate.children[0].data.match(/^Cited by (\d+)$/);
                                            const scholarIdMatch = citersLinkCandidate.attribs.href.match(/^\/scholar\?cites=(\d+)/);
                                            if (numberOfCitersMatch && scholarIdMatch) {
                                                candidates.push({
                                                    title: titleCandidates[0].children[0].data,
                                                    numberOfCiters: Math.min(parseInt(numberOfCitersMatch[1]), 999),
                                                    scholarId: scholarIdMatch[1],
                                                });
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (candidates.length === 0) {
                                    dispatchAndEcho({
                                        type: RESOLVE_SCHOLAR_INITIAL_REQUEST,
                                        numberOfCiters: 0,
                                        scholarId: null,
                                    }, refractoryPeriod);
                                } else {
                                    const bestCandidate = candidates.reduce((best, candidate) => {
                                        const distance = levenshteinDistance(
                                            candidate.title,
                                            state.publications.get(state.scholar.requests[0].doi).title
                                        );
                                        if (!best || distance < best.distance) {
                                            return {
                                                ...candidate,
                                                distance,
                                            };
                                        }
                                        return best;
                                    }, null);
                                    dispatchAndEcho({
                                        type: RESOLVE_SCHOLAR_INITIAL_REQUEST,
                                        numberOfCiters: bestCandidate.numberOfCiters,
                                        scholarId: bestCandidate.scholarId,
                                    }, refractoryPeriod);
                                }
                                break;
                            }
                            case SCHOLAR_REQUEST_TYPE_CITERS: {
                                const publications = cssSelect(publicationsQuery, dom);
                                if (publications.length > 0) {
                                    for (const publication of publications) {
                                        const titleCandidates = cssSelect(titleFromPublicationQuery, publication);
                                        if (
                                            titleCandidates.length === 0
                                            || !titleCandidates[0].children
                                            || titleCandidates[0].children.length === 0
                                            || titleCandidates[0].children[0].type !== 'text'
                                        ) {
                                            dispatch({
                                                type: REJECT_SCHOLAR_CITER_PARSING,
                                                doi: state.scholar.requests[0].doi,
                                                title: `Parsing a citer's metadata for ${state.scholar.requests[0].doi} failed`,
                                                subtitle: 'Tags with the class \'gs_rt\' and link children could not be found',
                                            });
                                            continue;
                                        }
                                        const metadataCandidates = cssSelect(metadataFromPublicationQuery, publication);
                                        if (
                                            metadataCandidates.length === 0
                                            || !metadataCandidates[0].children
                                        ) {
                                            dispatch({
                                                type: REJECT_SCHOLAR_CITER_PARSING,
                                                doi: state.scholar.requests[0].doi,
                                                title: `Parsing a citer's metadata for ${state.scholar.requests[0].doi} failed`,
                                                subtitle: 'Tags with the class \'gs_a\' could not be found',
                                            });
                                            continue;
                                        }
                                        let metadata = '';
                                        for (let child of metadataCandidates[0].children) {
                                            if (child.type === 'text') {
                                                metadata += child.data.replace(/&nbsp;/g, ' ');
                                            } else if (
                                                child.type === 'tag'
                                                && child.name === 'a'
                                                && child.children
                                                && child.children.length > 0
                                                && child.children[0].type === 'text'
                                            ) {
                                                metadata += child.children[0].data.replace(/&nbsp;/g, ' ');
                                            } else {
                                                metadata = '';
                                                break;
                                            }
                                        }
                                        const matchedMetadata = metadata.match(/^\s*(.+?)\s+-\s+(.+?)\s*,\s+(\d{4})\s+-\s+(.+?)\s*$/);
                                        if (!matchedMetadata) {
                                            dispatch({
                                                type: REJECT_SCHOLAR_CITER_PARSING,
                                                doi: state.scholar.requests[0].doi,
                                                title: `Parsing a citer's metadata for ${state.scholar.requests[0].doi} failed`,
                                                subtitle: `Parsing '${metadata}' failed`,
                                            });
                                            continue;
                                        }
                                        dispatch(publicationFromCiterMetadata(
                                            state.scholar.requests[0].doi,
                                            titleCandidates[0].children[0].data,
                                            matchedMetadata[1].replace(/\s*(&hellip;|…)\s*$/, '').split(/\s*,\s*/),
                                            matchedMetadata[3]
                                        ));
                                    }
                                    dispatchAndEcho({type: RESOLVE_SCHOLAR_CITERS_REQUEST}, refractoryPeriod);
                                } else {
                                    const request = state.scholar.requests[0];
                                    dispatchAndEcho({
                                        type: REJECT_SCHOLAR_CITERS_REQUEST,
                                        title: `An empty citers page was retrieved for ${request.doi}`,
                                        subtitle: `No publications were found in the page ${request.number} / ${request.total}`,
                                    }, refractoryPeriod);
                                }
                                break;
                            }
                            default: {
                                console.error(`Unexpected page type ${state.scholar.requests[0].type}`);
                                dispatchAndEcho(null, refractoryPeriod);
                                break;
                            }
                        }
                    }
                }
            })
        ;
    }
}

import {ipcRenderer} from 'electron'
import htmlparser from 'htmlparser2'
import cssSelect from 'css-select'
import {doiFromMetadata} from './getDoiFromMetadata'
import {
    FETCH_SCHOLAR_PAGE,
    RESOLVE_SCHOLAR_INITIAL_PAGE,
    RESOLVE_SCHOLAR_CITERS_PAGE,
    REJECT_SCHOLAR_CITERS_PAGE,
    REJECT_SCHOLAR_CITER_PARSING,
    REJECT_SCHOLAR_CONNECTION,
    SCHOLAR_PAGE_REFRACTORY_PERIOD_DONE,
    SET_SCHOLAR_PAGE_REFRACTORY_PERIOD,
    BLOCK_SCHOLAR,
    UNBLOCK_SCHOLAR,
    RESET_SCHOLAR,
    CHANGE_RECAPTCHA_VISIBILITY,
    SCHOLAR_DISCONNECT,
} from '../constants/actionTypes'
import {
    PAGE_TYPE_INITIALIZE,
    PAGE_TYPE_CITERS,
    SCHOLAR_STATUS_BLOCKED_HIDDEN,
    SCHOLAR_STATUS_BLOCKED_VISIBLE,
} from '../constants/enums'

export function fetchScholarPage() {
    return {type: FETCH_SCHOLAR_PAGE};
}

export function rejectScholarConnection() {
    return {type: REJECT_SCHOLAR_CONNECTION};
}

export function setPageRefractoryPeriod(minimum, maximum) {
    return {
        type: SET_SCHOLAR_PAGE_REFRACTORY_PERIOD,
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
const citersLinkCandidatesQuery = cssSelect.compile('.gs_r.gs_or.gs_scl:first-child .gs_fl a');
const publicationsQuery = cssSelect.compile('.gs_r.gs_or.gs_scl .gs_ri');
const titleFromPublicationQuery = cssSelect.compile('.gs_rt a');
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
                dispatch({type: SCHOLAR_PAGE_REFRACTORY_PERIOD_DONE});
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
                    if (!state.publications.has(state.scholar.pages[0].doi)) {
                        switch (state.scholar.pages[0].type) {
                            case PAGE_TYPE_INITIALIZE:
                                dispatchAndEcho({
                                    type: RESOLVE_SCHOLAR_INITIAL_PAGE,
                                    numberOfCiters: 0,
                                    scholarId: null,
                                }, refractoryPeriod);
                                break;
                            case PAGE_TYPE_CITERS:
                                dispatchAndEcho({type: RESOLVE_SCHOLAR_CITERS_PAGE}, refractoryPeriod);
                                break;
                            default:
                                console.error(`Unexpected page type ${state.scholar.pages[0].type}`);
                                dispatchAndEcho(null, refractoryPeriod);
                                break;
                        }
                    } else {
                        switch (state.scholar.pages[0].type) {
                            case PAGE_TYPE_INITIALIZE: {
                                const citersLinkCandidates = cssSelect(citersLinkCandidatesQuery, dom);
                                let found = false;
                                for (let citersLinkCandidate of citersLinkCandidates) {
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
                                            dispatchAndEcho({
                                                type: RESOLVE_SCHOLAR_INITIAL_PAGE,
                                                numberOfCiters: Math.min(parseInt(numberOfCitersMatch[1]), 999),
                                                scholarId: scholarIdMatch[1],
                                            }, refractoryPeriod);
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                                if (!found) {
                                    dispatchAndEcho({
                                        type: RESOLVE_SCHOLAR_INITIAL_PAGE,
                                        numberOfCiters: 0,
                                        scholarId: null,
                                    }, refractoryPeriod);
                                }
                                break;
                            }
                            case PAGE_TYPE_CITERS: {
                                const publications = cssSelect(publicationsQuery, dom);
                                if (publications.length > 0) {
                                    for (let publication of publications) {
                                        const titleCandidates = cssSelect(titleFromPublicationQuery, publication);
                                        if (
                                            titleCandidates.length === 0
                                            || !titleCandidates[0].children
                                            || titleCandidates[0].children.length === 0
                                            || titleCandidates[0].children[0].type !== 'text'
                                        ) {
                                            dispatch({
                                                type: REJECT_SCHOLAR_CITER_PARSING,
                                                doi: state.scholar.pages[0].doi,
                                                message: `Parsing a citer's title for ${state.scholar.pages[0].doi} failed`,
                                                timestamp: new Date().getTime(),
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
                                                doi: state.scholar.pages[0].doi,
                                                message: `Parsing a citer's metadata for ${state.scholar.pages[0].doi} failed`,
                                                timestamp: new Date().getTime(),
                                            });
                                            continue;
                                        }
                                        let metadata = '';
                                        for (let child of metadataCandidates[0].children) {
                                            if (child.type === 'text') {
                                                metadata += child.data;
                                            } else if (
                                                child.type === 'tag'
                                                && child.name === 'a'
                                                && child.children
                                                && child.children.length > 0
                                                && child.children[0].type === 'text'
                                            ) {
                                                metadata += child.children[0].data;
                                            } else {
                                                metadata = '';
                                                break;
                                            }
                                        }
                                        const matchedMetadata = metadata.match(/^\s*(.+?)\s+-\s+([^,]+?)\s*,\s+(\d{4})\s+-\s+([^,]+?)\s*$/);
                                        if (!matchedMetadata) {
                                            dispatch({
                                                type: REJECT_SCHOLAR_CITER_PARSING,
                                                doi: state.scholar.pages[0].doi,
                                                message: `Parsing a citer's metadata for ${state.scholar.pages[0].doi} failed`,
                                                timestamp: new Date().getTime(),
                                            });
                                            continue;
                                        }
                                        const bytes = new Uint8Array(64);
                                        window.crypto.getRandomValues(bytes);
                                        dispatch(doiFromMetadata(
                                            Array.from(bytes).map(byte => byte.toString(16)).join(''),
                                            state.scholar.pages[0].doi,
                                            titleCandidates[0].children[0].data,
                                            matchedMetadata[1].replace(/\s*&hellip;\s*$/, '').split(/\s*,\s*/),
                                            matchedMetadata[3]
                                        ));
                                    }
                                    dispatchAndEcho({type: RESOLVE_SCHOLAR_CITERS_PAGE}, refractoryPeriod);
                                } else {
                                    const page = state.scholar.pages[0];
                                    dispatchAndEcho({
                                        type: REJECT_SCHOLAR_CITERS_PAGE,
                                        message: `No publications found in page ${page.number} / ${page.total} of ${page.doi}`,
                                        timestamp: new Date().getTime(),
                                    }, refractoryPeriod);
                                }
                                break;
                            }
                            default: {
                                console.error(`Unexpected page type ${state.scholar.pages[0].type}`);
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

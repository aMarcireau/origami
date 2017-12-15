import scholarQueue from '../queues/scholarQueue'

import {
    ADD_PUBLICATION_TO_COLLECTION,
    REMOVE_PUBLICATION,
    UPDATE_PUBLICATION,
    UPDATE_ALL_PUBLICATIONS,
    PUBLICATION_FROM_DOI,
    RESOLVE_PUBLICATION_FROM_DOI,
    RESOLVE_SCHOLAR_INITIAL_REQUEST,
    RESOLVE_SCHOLAR_CITERS_REQUEST,
    REJECT_SCHOLAR_CITERS_REQUEST,
    REJECT_SCHOLAR_CONNECTION,
    SCHOLAR_REQUEST_REFRACTORY_PERIOD_DONE,
    SET_SCHOLAR_REQUEST_REFRACTORY_PERIOD,
    BLOCK_SCHOLAR,
    UNBLOCKING_SCHOLAR,
    UNBLOCK_SCHOLAR,
    RESET_SCHOLAR,
    CHANGE_RECAPTCHA_VISIBILITY,
    SCHOLAR_DISCONNECT,
    RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
    RESOLVE_IMPORT_DOIS,
} from '../constants/actionTypes'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
    SCHOLAR_REQUEST_TYPE_INITIALIZE,
    SCHOLAR_REQUEST_TYPE_CITERS,
    SCHOLAR_STATUS_IDLE,
    SCHOLAR_STATUS_FETCHING,
    SCHOLAR_STATUS_BLOCKED_HIDDEN,
    SCHOLAR_STATUS_BLOCKED_VISIBLE,
    SCHOLAR_STATUS_UNBLOCKING,
} from '../constants/enums'
import {doiPattern} from '../libraries/utilities'

export default function scholar(
    state = {
        requests: [],
        status: SCHOLAR_STATUS_IDLE,
        beginOfRefractoryPeriod: null,
        endOfRefractoryPeriod: null,
        minimumRefractoryPeriod: 2000,
        maximumRefractoryPeriod: 8000,
        url: null,
    },
    action,
    appState
) {
    state = scholarQueue.reduce(state, action);
    switch (action.type) {
        case ADD_PUBLICATION_TO_COLLECTION:
            if (!appState.publications.has(action.doi) || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            return {
                ...state,
                requests: [...state.requests, {
                    type: SCHOLAR_REQUEST_TYPE_INITIALIZE,
                    doi: action.doi,
                    url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(action.doi)}`,
                }],
            };
        case RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA: {
            const doi = action.crossrefMessage.DOI.toLowerCase();
            if (appState.publications.has(doi) && appState.publications.get(doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            return {
                ...state,
                requests: [...state.requests, {
                    type: SCHOLAR_REQUEST_TYPE_INITIALIZE,
                    doi: doi,
                    url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(doi)}`,
                }],
            };
        }
        case REMOVE_PUBLICATION:
            return {
                ...state,
                requests: state.requests.filter((request, index) => (
                    request.doi !== action.doi
                    || (index === 0 && state.status !== SCHOLAR_STATUS_IDLE)
                )),
            };
        case UPDATE_PUBLICATION:
            if (
                !appState.publications.has(action.doi)
                || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_IN_COLLECTION
                || state.requests.some(request => request.doi === action.doi)
            ) {
                return state;
            }
            return {
                ...state,
                requests: [...state.requests, {
                    type: SCHOLAR_REQUEST_TYPE_INITIALIZE,
                    doi: action.doi,
                    url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(action.doi)}`,
                }],
            };
        case UPDATE_ALL_PUBLICATIONS:
            const updatableDois = new Set(Array.from(appState.publications.entries()).filter(
                ([doi, publication]) => publication.status === PUBLICATION_STATUS_IN_COLLECTION
            ).map(
                ([doi, publication]) => doi
            ));
            for (const request of state.requests) {
                updatableDois.delete(request.doi);
            }
            for (const crossrefRequest of appState.crossref.requests.values()) {
                if (crossrefRequest.type === CROSSREF_REQUEST_TYPE_CITER_METADATA) {
                    updatableDois.delete(crossrefRequest.parentDoi);
                }
            }
            for (const doiRequest of appState.doi.requests) {
                updatableDois.delete(doiRequest.doi);
            }
            return {
                ...state,
                requests: [
                    ...state.requests,
                    ...Array.from(updatableDois.values()).map(doi => {
                        return {
                            type: SCHOLAR_REQUEST_TYPE_INITIALIZE,
                            doi,
                            url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(doi)}`,
                        }
                    }),
                ],
            }
        case PUBLICATION_FROM_DOI: {
            const doi = action.doi.toLowerCase();
            if (!appState.publications.has(doi) || appState.publications.get(doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            return {
                ...state,
                requests: [...state.requests, {
                    type: SCHOLAR_REQUEST_TYPE_INITIALIZE,
                    doi,
                    url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(doi)}`,
                }],
            };
        }
        case RESOLVE_PUBLICATION_FROM_DOI:
            if (!appState.publications.has(action.doi) || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_UNVALIDATED) {
                return state;
            }
            return {
                ...state,
                requests: [...state.requests, {
                    type: SCHOLAR_REQUEST_TYPE_INITIALIZE,
                    doi: action.doi,
                    url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(action.doi)}`,
                }],
            };
        case RESOLVE_SCHOLAR_INITIAL_REQUEST:
            if (action.numberOfCiters === 0) {
                return {
                    ...state,
                    requests: state.requests.slice(1),
                    status: (state.status === SCHOLAR_STATUS_BLOCKED_HIDDEN || state.status === SCHOLAR_STATUS_BLOCKED_VISIBLE ?
                        SCHOLAR_STATUS_UNBLOCKING
                        : SCHOLAR_STATUS_IDLE
                    ),
                    beginOfRefractoryPeriod: action.beginOfRefractoryPeriod,
                    endOfRefractoryPeriod: action.endOfRefractoryPeriod,
                };
            }
            return {
                ...state,
                requests: [
                    ...state.requests.slice(1),
                    ...new Array(Math.ceil(action.numberOfCiters / 10)).fill().map((_, index) => {return {
                        type: SCHOLAR_REQUEST_TYPE_CITERS,
                        doi: state.requests[0].doi,
                        url: `https://scholar.google.com/scholar?cites=${action.scholarId}&start=${index * 10}&hl=en`,
                        number: index + 1,
                        total: Math.ceil(action.numberOfCiters / 10),
                    }}),
                ],
                status: (state.status === SCHOLAR_STATUS_BLOCKED_HIDDEN || state.status === SCHOLAR_STATUS_BLOCKED_VISIBLE ?
                    SCHOLAR_STATUS_UNBLOCKING
                    : SCHOLAR_STATUS_IDLE
                ),
                beginOfRefractoryPeriod: action.beginOfRefractoryPeriod,
                endOfRefractoryPeriod: action.endOfRefractoryPeriod,
            };
        case RESOLVE_SCHOLAR_CITERS_REQUEST:
            return {
                ...state,
                requests: state.requests.slice(1),
                status: (state.status === SCHOLAR_STATUS_BLOCKED_HIDDEN || state.status === SCHOLAR_STATUS_BLOCKED_VISIBLE ?
                    SCHOLAR_STATUS_UNBLOCKING
                    : SCHOLAR_STATUS_IDLE
                ),
                beginOfRefractoryPeriod: action.beginOfRefractoryPeriod,
                endOfRefractoryPeriod: action.endOfRefractoryPeriod,
            };
        case REJECT_SCHOLAR_CITERS_REQUEST:
            return {
                ...state,
                requests: state.requests.slice(1),
                status: (state.status === SCHOLAR_STATUS_BLOCKED_HIDDEN || state.status === SCHOLAR_STATUS_BLOCKED_VISIBLE ?
                    SCHOLAR_STATUS_UNBLOCKING
                    : SCHOLAR_STATUS_IDLE
                ),
                beginOfRefractoryPeriod: action.beginOfRefractoryPeriod,
                endOfRefractoryPeriod: action.endOfRefractoryPeriod,
            };
        case REJECT_SCHOLAR_CONNECTION:
            return {
                ...state,
                status: SCHOLAR_STATUS_IDLE,
            };
        case SCHOLAR_REQUEST_REFRACTORY_PERIOD_DONE:
            return {
                ...state,
                beginOfRefractoryPeriod: null,
                endOfRefractoryPeriod: null,
            }
        case SET_SCHOLAR_REQUEST_REFRACTORY_PERIOD:
            return {
                ...state,
                minimumRefractoryPeriod: action.minimum,
                maximumRefractoryPeriod: action.maximum,
            };
        case BLOCK_SCHOLAR:
            return {
                ...state,
                status: SCHOLAR_STATUS_BLOCKED_HIDDEN,
                beginOfRefractoryPeriod: null,
                endOfRefractoryPeriod: null,
                url: action.url,
            };
        case UNBLOCK_SCHOLAR:
            return {
                ...state,
                status: SCHOLAR_STATUS_IDLE,
                url: null,
            };
        case RESET_SCHOLAR:
            return {
                ...state,
                status: (state.status === SCHOLAR_STATUS_BLOCKED_HIDDEN || state.status === SCHOLAR_STATUS_BLOCKED_VISIBLE ?
                    SCHOLAR_STATUS_UNBLOCKING
                    : SCHOLAR_STATUS_IDLE
                ),
                beginOfRefractoryPeriod: null,
                endOfRefractoryPeriod: null,
                url: null,
            };
        case CHANGE_RECAPTCHA_VISIBILITY:
            if (state.status === SCHOLAR_STATUS_BLOCKED_HIDDEN) {
                return {
                    ...state,
                    status: SCHOLAR_STATUS_BLOCKED_VISIBLE,
                };
            }
            if (state.status === SCHOLAR_STATUS_BLOCKED_VISIBLE) {
                return {
                    ...state,
                    status: SCHOLAR_STATUS_BLOCKED_HIDDEN,
                };
            }
            return state;

        case SCHOLAR_DISCONNECT:
            if (state.status === SCHOLAR_STATUS_BLOCKED_HIDDEN || state.status === SCHOLAR_STATUS_BLOCKED_VISIBLE) {
                return {
                    ...state,
                    status: SCHOLAR_STATUS_UNBLOCKING,
                };
            }
            return state;
        case RESOLVE_IMPORT_DOIS: {
            const foundDois = new Set();
            const newState = {
                ...state,
                requests: [
                    ...state.requests,
                    ...action.dois.map(
                        rawDoi => doiPattern.exec(rawDoi)
                    ).filter(
                        match => match != null
                    ).map(
                        match => match[1].toLowerCase()
                    ).filter(
                        doi => (
                            !foundDois.has(doi)
                            && appState.publications.has(doi)
                            && appState.publications.get(doi).status === PUBLICATION_STATUS_DEFAULT
                        )
                    ).map(
                        doi => {
                            foundDois.add(doi);
                            return {
                                type: SCHOLAR_REQUEST_TYPE_INITIALIZE,
                                doi,
                                url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(doi)}`,
                            };
                        }
                    ),
                ],
            };
        }
        default:
            return state;
    }
}

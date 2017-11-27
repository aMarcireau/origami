import {
    ADD_PUBLICATION_TO_COLLECTION,
    REMOVE_PUBLICATION,
    UPDATE_PUBLICATION,
    UPDATE_ALL_PUBLICATIONS,
    RESOLVE_PUBLICATION_FROM_DOI,
    FETCH_SCHOLAR_PAGE,
    RESOLVE_SCHOLAR_INITIAL_PAGE,
    RESOLVE_SCHOLAR_CITERS_PAGE,
    REJECT_SCHOLAR_CITERS_PAGE,
    REJECT_SCHOLAR_CONNECTION,
    SCHOLAR_PAGE_REFRACTORY_PERIOD_DONE,
    SET_SCHOLAR_PAGE_REFRACTORY_PERIOD,
    BLOCK_SCHOLAR,
    UNBLOCKING_SCHOLAR,
    UNBLOCK_SCHOLAR,
    RESET_SCHOLAR,
    CHANGE_RECAPTCHA_VISIBILITY,
    SCHOLAR_DISCONNECT,
    RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
} from '../constants/actionTypes'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
    PAGE_TYPE_INITIALIZE,
    PAGE_TYPE_CITERS,
    SCHOLAR_STATUS_IDLE,
    SCHOLAR_STATUS_FETCHING,
    SCHOLAR_STATUS_BLOCKED_HIDDEN,
    SCHOLAR_STATUS_BLOCKED_VISIBLE,
    SCHOLAR_STATUS_UNBLOCKING,
} from '../constants/enums'

export default function scholar(
    state = {
        pages: [],
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
    switch (action.type) {
        case ADD_PUBLICATION_TO_COLLECTION:
            if (!appState.publications.has(action.doi) || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            return {
                ...state,
                pages: [...state.pages, {
                    type: PAGE_TYPE_INITIALIZE,
                    doi: action.doi,
                    url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(action.doi)}`,
                }],
            };
        case RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA:
            const doi = action.crossrefMessage.DOI.toLowerCase();
            if (appState.publications.has(doi) && appState.publications.get(doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            return {
                ...state,
                pages: [...state.pages, {
                    type: PAGE_TYPE_INITIALIZE,
                    doi: doi,
                    url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(doi)}`,
                }],
            };
        case REMOVE_PUBLICATION:
            return {
                ...state,
                pages: state.pages.filter((page, index) => (
                    page.doi !== action.doi
                    || (index === 0 && state.status !== SCHOLAR_STATUS_IDLE)
                )),
            };
        case UPDATE_PUBLICATION:
            if (
                !appState.publications.has(action.doi)
                || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_IN_COLLECTION
                || state.pages.some(page => page.doi === action.doi)
            ) {
                return state;
            }
            return {
                ...state,
                pages: [...state.pages, {
                    type: PAGE_TYPE_INITIALIZE,
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
            for (const page of state.pages) {
                updatableDois.delete(page.doi);
            }
            for (const publicationRequest of appState.publicationRequests.values()) {
                updatableDois.delete(publicationRequest.parentDoi);
            }
            return {
                ...state,
                pages: [
                    ...state.pages,
                    ...Array.from(updatableDois.values()).map(doi => {
                        return {
                            type: PAGE_TYPE_INITIALIZE,
                            doi,
                            url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(doi)}`,
                        }
                    }),
                ],
            }
        case RESOLVE_PUBLICATION_FROM_DOI:
            if (!appState.publications.has(action.doi) || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_UNVALIDATED) {
                return state;
            }
            return {
                ...state,
                pages: [...state.pages, {
                    type: PAGE_TYPE_INITIALIZE,
                    doi: action.doi,
                    url: `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(action.doi)}`,
                }],
            };
        case FETCH_SCHOLAR_PAGE:
            return {
                ...state,
                status: SCHOLAR_STATUS_FETCHING,
            };
        case RESOLVE_SCHOLAR_INITIAL_PAGE:
            if (action.numberOfCiters === 0) {
                return {
                    ...state,
                    pages: state.pages.slice(1),
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
                pages: [
                    ...state.pages.slice(1),
                    ...new Array(Math.ceil(action.numberOfCiters / 10)).fill().map((_, index) => {return {
                        type: PAGE_TYPE_CITERS,
                        doi: state.pages[0].doi,
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
        case RESOLVE_SCHOLAR_CITERS_PAGE:
            return {
                ...state,
                pages: state.pages.slice(1),
                status: (state.status === SCHOLAR_STATUS_BLOCKED_HIDDEN || state.status === SCHOLAR_STATUS_BLOCKED_VISIBLE ?
                    SCHOLAR_STATUS_UNBLOCKING
                    : SCHOLAR_STATUS_IDLE
                ),
                beginOfRefractoryPeriod: action.beginOfRefractoryPeriod,
                endOfRefractoryPeriod: action.endOfRefractoryPeriod,
            };
        case REJECT_SCHOLAR_CITERS_PAGE:
            return {
                ...state,
                pages: state.pages.slice(1),
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
        case SCHOLAR_PAGE_REFRACTORY_PERIOD_DONE:
            return {
                ...state,
                beginOfRefractoryPeriod: null,
                endOfRefractoryPeriod: null,
            }
        case SET_SCHOLAR_PAGE_REFRACTORY_PERIOD:
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
        default:
            return state;
    }
}

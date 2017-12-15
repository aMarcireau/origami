import doiQueue from '../queues/doiQueue'
import {
    RESOLVE_PUBLICATION_FROM_DOI,
    ADD_PUBLICATION_TO_COLLECTION,
    FETCH_BIBTEX_FROM_DOI,
    RESOLVE_BIBTEX_FROM_DOI,
    REJECT_BIBTEX_FROM_DOI_CONNECTION,
    REMOVE_PUBLICATION,
    RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
} from '../constants/actionTypes'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
} from '../constants/enums'

export default function doi(
    state = {
        requests: [],
        status: doiQueue.status.IDLE,
    },
    action,
    appState
) {
    state = doiQueue.reduce(state, action);
    switch (action.type) {
        case RESOLVE_PUBLICATION_FROM_DOI:
            if (
                !appState.publications.has(action.doi)
                || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_UNVALIDATED
            ) {
                return state;
            }
            return {
                ...state,
                requests: [
                    ...state.requests,
                    {
                        doi: action.doi,
                    },
                ],
            };
        case ADD_PUBLICATION_TO_COLLECTION: {
            if (
                !appState.publications.has(action.doi)
                || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_DEFAULT
            ) {
                return state;
            }
            return {
                ...state,
                requests: [
                    ...state.requests,
                    {
                        doi: action.doi,
                    },
                ],
            };
        }
        case RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA: {
            const doi = action.crossrefMessage.DOI.toLowerCase();
            if (appState.publications.has(doi) && appState.publications.get(doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            return {
                ...state,
                requests: [
                    ...state.requests,
                    {
                        doi,
                    },
                ],
            };
        }
        case REJECT_BIBTEX_FROM_DOI_CONNECTION:
            return {
                ...state,
                status: doiQueue.status.IDLE,
            };
        case REMOVE_PUBLICATION:
            return {
                ...state,
                requests: state.requests.filter(request => request.doi !== action.doi),
            };
        default:
            return state;
    }
}

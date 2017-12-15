import doiQueue from '../queues/doiQueue'
import {
    RESOLVE_PUBLICATION_FROM_DOI,
    ADD_PUBLICATION_TO_COLLECTION,
    REMOVE_PUBLICATION,
    UPDATE_PUBLICATION,
    UPDATE_ALL_PUBLICATIONS,
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
        case REMOVE_PUBLICATION:
            return {
                ...state,
                requests: state.requests.filter(request => request.doi !== action.doi),
            };
        case UPDATE_PUBLICATION:
            if (!appState.publications.has(action.doi) || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_IN_COLLECTION) {
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
        case UPDATE_ALL_PUBLICATIONS: {
            const updatableDois = new Set(Array.from(appState.publications.entries()).filter(
                ([doi, publication]) => publication.status === PUBLICATION_STATUS_IN_COLLECTION
            ).map(
                ([doi, publication]) => doi
            ));
            for (const scholarRequest of appState.scholar.requests) {
                if (scholarRequest.type === SCHOLAR_REQUEST_TYPE_CITERS) {
                    updatableDois.delete(scholarRequest.doi);
                }
            }
            for (const crossrefRequest of appState.crossref.requests) {
                if (crossrefRequest.type === CROSSREF_REQUEST_TYPE_CITER_METADATA) {
                    updatableDois.delete(crossrefRequest.parentDoi);
                }
            }
            for (const doiRequest of state.requests) {
                updatableDois.delete(doiRequest.doi);
            }
            return {
                ...state,
                requests: [
                    ...state.requests,
                    ...Array.from(updatableDois.values()).map(doi => {
                        return {
                            doi,
                        };
                    }),
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
        default:
            return state;
    }
}

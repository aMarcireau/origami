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

export default function bibtexRequests(state = new Map(), action, appState) {
    switch (action.type) {
        case RESOLVE_PUBLICATION_FROM_DOI: {
            if (!appState.publications.has(action.doi) || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_UNVALIDATED) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.bibtexRequestId, {
                doi: action.doi,
                fetching: false,
            });
            return newState;
        }
        case ADD_PUBLICATION_TO_COLLECTION: {
            if (!appState.publications.has(action.doi) || appState.publications.get(action.doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.bibtexRequestId, {
                doi: action.doi,
                fetching: false,
            });
            return newState;
        }
        case RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA: {
            const doi = action.crossrefMessage.DOI.toLowerCase();
            if (appState.publications.has(doi) && appState.publications.get(doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.bibtexRequestId, {
                doi,
                fetching: false,
            });
            return newState;
        }
        case FETCH_BIBTEX_FROM_DOI: {
            if (!state.has(action.id)) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.id, {
                ...state.get(action.id),
                fetching: true,
            });
            return newState;
        }
        case RESOLVE_BIBTEX_FROM_DOI: {
            const newState = new Map(state);
            newState.delete(action.id);
            return newState;
        }
        case REJECT_BIBTEX_FROM_DOI_CONNECTION: {
            if (!state.has(action.id)) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.id, {
                ...state.get(action.id),
                fetching: false,
            });
            return newState;
        }
        case REMOVE_PUBLICATION: {
            return new Map(Array.from(state.entries()).filter(
                ([id, bibtexRequest]) => bibtexRequest.doi !== action.doi
            ));
        }
        default:
            return state;
    }
}

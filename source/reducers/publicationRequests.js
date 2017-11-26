import {
    PUBLICATION_FROM_CITER_METADATA,
    PUBLICATION_FROM_IMPORTED_METADATA,
    FETCH_PUBLICATION_FROM_METADATA,
    RESOLVE_PUBLICATION_FROM_CITER_METADATA,
    RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
    REJECT_PUBLICATION_FROM_METADATA,
    REJECT_PUBLICATION_FROM_METADATA_CONNECTION,
    REMOVE_PUBLICATION,
} from '../constants/actionTypes'
import {
    PUBLICATION_REQUEST_TYPE_CITER_METADATA,
    PUBLICATION_REQUEST_TYPE_IMPORTED_METADATA,
} from '../constants/enums'

export default function publicationRequests(state = new Map(), action) {
    switch (action.type) {
        case PUBLICATION_FROM_CITER_METADATA: {
            const newState = new Map(state);
            newState.set(action.id, {
                type: PUBLICATION_REQUEST_TYPE_CITER_METADATA,
                parentDoi: action.parentDoi,
                title: action.title,
                authors: action.authors,
                dateAsString: action.dateAsString,
                fetching: false,
            });
            return newState;
        }
        case PUBLICATION_FROM_IMPORTED_METADATA: {
            const newState = new Map(state);
            newState.set(action.id, {
                type: PUBLICATION_REQUEST_TYPE_IMPORTED_METADATA,
                title: action.title,
                authors: action.authors,
                dateAsString: action.dateAsString,
                fetching: false,
            });
            return newState;
        }
        case FETCH_PUBLICATION_FROM_METADATA: {
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
        case RESOLVE_PUBLICATION_FROM_CITER_METADATA:
        case RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA:
        case REJECT_PUBLICATION_FROM_METADATA: {
            const newState = new Map(state);
            newState.delete(action.id);
            return newState;
        }
        case REJECT_PUBLICATION_FROM_METADATA_CONNECTION:
            if (!state.has(action.id)) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.id, {
                ...state.get(action.id),
                fetching: false,
            });
            return newState;
        case REMOVE_PUBLICATION: {
            return new Map(Array.from(state.entries()).filter(
                ([id, publicationRequest]) => publicationRequest.parentDoi !== action.doi
            ));
        }
        default:
            return state;
    }
}

import {
    DOI_FROM_METADATA,
    FETCH_DOI_FROM_METADATA,
    RESOLVE_DOI_FROM_METADATA,
    REJECT_DOI_FROM_METADATA,
    REJECT_DOI_FROM_METADATA_CONNECTION,
    REMOVE_PUBLICATION,
} from '../constants/actionTypes'

export default function doiRequests(state = new Map(), action) {
    switch (action.type) {
        case DOI_FROM_METADATA: {
            const newState = new Map(state);
            newState.set(action.id, {
                parentDoi: action.parentDoi,
                title: action.title,
                authors: action.authors,
                dateAsString: action.dateAsString,
                fetching: false,
            });
            return newState;
        }
        case FETCH_DOI_FROM_METADATA: {
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
        case RESOLVE_DOI_FROM_METADATA:
        case REJECT_DOI_FROM_METADATA: {
            const newState = new Map(state);
            newState.delete(action.id);
            return newState;
        }
        case REJECT_DOI_FROM_METADATA_CONNECTION:
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
                ([id, doiRequest]) => doiRequest.parentDoi !== action.doi
            ));
        }
        default:
            return state;
    }
}

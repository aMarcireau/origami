import {
    RESOLVE_PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI,
    REJECT_SCHOLAR_CITERS_PAGE,
    REJECT_SCHOLAR_CITER_PARSING,
    REJECT_PUBLICATION_FROM_METADATA,
    REJECT_SAVE,
    REJECT_OPEN,
    REJECT_IMPORT_PUBLICATIONS,
    REMOVE_WARNING,
    REMOVE_ALL_WARNINGS,
} from '../constants/actionTypes'

export default function warnings(state = {list: [], hash: 0}, action, appState) {
    switch (action.type) {
        case RESOLVE_PUBLICATION_FROM_DOI:
            if (!appState.publications.has(action.doi) || !appState.publications.get(action.doi).isInCollection) {
                return state;
            }
            return {
                ...state,
                list: [
                    {
                        message: `${action.doi} is already in the collection`,
                        timestamp: action.timestamp,
                        level: 'warning',
                    },
                    ...state.list,
                ],
            };
        case REJECT_PUBLICATION_FROM_DOI:
            return {
                ...state,
                list: [
                    {
                        message: `${action.doi} is not referenced by Crossref`,
                        timestamp: action.timestamp,
                        level: 'error',
                    },
                    ...state.list,
                ],
            };
        case REJECT_SCHOLAR_CITERS_PAGE:
        case REJECT_SCHOLAR_CITER_PARSING:
        case REJECT_PUBLICATION_FROM_METADATA:
            return {
                ...state,
                list: [
                    {
                        message: action.message,
                        timestamp: action.timestamp,
                        level: 'warning',
                    },
                    ...state.list,
                ],
            };
        case REJECT_SAVE:
            return {
                ...state,
                list: [
                    {
                        message: `Writting to ${action.filename} failed`,
                        timestamp: action.timestamp,
                        level: 'error',
                    },
                    ...state.list,
                ],
            };
        case REJECT_OPEN:
            return {
                ...state,
                list: [
                    {
                        message: `Opening ${action.filename} failed`,
                        timestamp: action.timestamp,
                        level: 'error',
                    },
                    ...state.list,
                ],
            };
        case REJECT_IMPORT_PUBLICATIONS:
            return {
                ...state,
                list: [
                    {
                        message: `Importing publications from ${action.filename} failed`,
                        timestamp: action.timestamp,
                        level: 'error',
                    },
                    ...state.list,
                ],
            };
        case REMOVE_WARNING:
            return {
                ...state,
                list: [
                    ...state.list.slice(0, action.warningIndex),
                    ...state.list.slice(action.warningIndex + 1),
                ],
            }
        case REMOVE_ALL_WARNINGS:
            return {
                list: [],
                hash: state.hash + 1,
            };
        default:
            return state;
    }
}

import {
    RESOLVE_PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI,
    REJECT_SCHOLAR_CITERS_PAGE,
    REJECT_SCHOLAR_CITER_PARSING,
    REJECT_PUBLICATION_FROM_METADATA,
    REJECT_SAVE,
    REJECT_OPEN,
    REJECT_IMPORT_PUBLICATIONS,
    REJECT_IMPORT_BIBTEX,
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
                        title: 'The publication was not added to the collection',
                        subtitle: `${action.doi} is already in the collection`,
                        level: 'warning',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };
        case REJECT_PUBLICATION_FROM_DOI:
            return {
                ...state,
                list: [
                    {
                        title: 'The publication was not added to the collection',
                        subtitle: `${action.doi} is not referenced by Crossref`,
                        level: 'error',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };
        case REJECT_SCHOLAR_CITERS_PAGE:
        case REJECT_SCHOLAR_CITER_PARSING:
            return {
                ...state,
                list: [
                    {
                        title: action.title,
                        subtitle: action.subtitle,
                        level: 'warning',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };
        case REJECT_PUBLICATION_FROM_METADATA:
            return {
                ...state,
                list: [
                    {
                        title: `The Crossref request for '${action.title}' failed`,
                        subtitle: action.message,
                        level: 'warning',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };
        case REJECT_SAVE:
            return {
                ...state,
                list: [
                    {
                        title: 'Saving the collection failed',
                        subtitle: `'${action.filename}' could not be written to`,
                        level: 'error',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };
        case REJECT_OPEN:
            return {
                ...state,
                hash: state.hash + 1,
                list: [
                    {
                        title: `Opening '${action.filename}' failed`,
                        subtitle: action.message,
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
                        title: `Importing JSON from '${action.filename}' failed`,
                        subtitle: action.message,
                        level: 'error',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };

        case REJECT_IMPORT_BIBTEX:
            return {
                ...state,
                list: [
                    {
                        title: `Importing BibTeX from '${action.filename}' failed`,
                        subtitle: action.message,
                        level: 'error',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };
        case REMOVE_WARNING:
            return {
                ...state,
                list: [
                    ...state.list.slice(0, action.warningIndex),
                    ...state.list.slice(action.warningIndex + 1),
                ],
                hash: state.hash + 1,
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

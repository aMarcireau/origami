import {
    PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI,
    REJECT_SCHOLAR_CITERS_PAGE,
    REJECT_SCHOLAR_CITER_PARSING,
    REJECT_PUBLICATION_FROM_METADATA,
    REJECT_SAVE,
    REJECT_OPEN,
    REJECT_IMPORT_PUBLICATIONS,
    RESOLVE_IMPORT_DOIS,
    REJECT_IMPORT_DOIS,
    REJECT_IMPORT_BIBTEX,
    REMOVE_WARNING,
    REMOVE_ALL_WARNINGS,
} from '../constants/actionTypes'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
} from '../constants/enums'
import {doiPattern} from '../actions/managePublication'

export default function warnings(state = {list: [], hash: 0}, action, appState) {
    switch (action.type) {
        case PUBLICATION_FROM_DOI: {
            const doi = action.doi.toLowerCase();
            if (!appState.publications.has(doi) || appState.publications.get(doi).status === PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            return {
                ...state,
                list: [
                    {
                        title: 'The publication was not added to the collection',
                        subtitle: `${doi} is already in the collection`,
                        level: 'warning',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };
        }
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
                        title: `Importing from save from '${action.filename}' failed`,
                        subtitle: action.message,
                        level: 'error',
                    },
                    ...state.list,
                ],
                hash: state.hash + 1,
            };
        case RESOLVE_IMPORT_DOIS: {
            const newState = {
                ...state,
                list: [...state.list],
                hash: state.hash + 1,
            };
            for (const rawDoi of action.dois) {
                if (!doiPattern.test(rawDoi)) {
                    newState.list.push({
                        title: 'Importing one of the DOIs failed',
                        subtitle: `'${rawDoi}' does not match the expected format`,
                        level: 'warning',
                    });
                }
            }
            return newState;
        }
        case REJECT_IMPORT_DOIS:
            return {
                ...state,
                list: [
                    {
                        title: `Importing DOIs from '${action.filename}' failed`,
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

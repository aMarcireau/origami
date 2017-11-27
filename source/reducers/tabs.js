import {
    REJECT_PUBLICATION_FROM_DOI,
    REJECT_SAVE,
    REJECT_OPEN,
    REJECT_IMPORT_PUBLICATIONS,
    REJECT_IMPORT_BIBTEX,
    SELECT_INFORMATION_TAB,
    SELECT_WARNINGS_TAB,
    UPDATE_ALL_PUBLICATIONS,
} from '../constants/actionTypes'

export default function tabs (state = {index: 0, hash: 0}, action) {
    switch (action.type) {
        case SELECT_INFORMATION_TAB:
            return {
                index: 0,
                hash: state.hash + 1,
            };
        case REJECT_SAVE:
        case REJECT_OPEN:
        case REJECT_IMPORT_PUBLICATIONS:
        case REJECT_IMPORT_BIBTEX:
        case REJECT_PUBLICATION_FROM_DOI:
        case SELECT_WARNINGS_TAB:
            return {
                index: 1,
                hash: state.hash + 1,
            };
        case UPDATE_ALL_PUBLICATIONS:
            return {
                ...state,
                hash: state.hash + 1,
            };
        default:
            return state;
    }
}

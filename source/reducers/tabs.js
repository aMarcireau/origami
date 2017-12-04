import {
    REJECT_PUBLICATION_FROM_DOI,
    REJECT_SAVE,
    REJECT_OPEN,
    REJECT_IMPORT_PUBLICATIONS,
    REJECT_IMPORT_BIBTEX,
    SELECT_TAB,
    UPDATE_ALL_PUBLICATIONS,
    SELECT_PUBLICATION,
} from '../constants/actionTypes'

export default function tabs(state = {index: 0, hash: 0}, action) {
    switch (action.type) {
        case SELECT_TAB:
            return {
                index: action.index,
                hash: state.hash + 1,
            };
        case REJECT_SAVE:
        case REJECT_OPEN:
        case REJECT_IMPORT_PUBLICATIONS:
        case REJECT_IMPORT_BIBTEX:
        case REJECT_PUBLICATION_FROM_DOI:
            return {
                index: 2,
                hash: state.hash + 1,
            };
        case UPDATE_ALL_PUBLICATIONS:
            return {
                ...state,
                hash: state.hash + 1,
            };
        case SELECT_PUBLICATION:
            return {
                index: 0,
                hash: state.hash + 1,
            };
        default:
            return state;
    }
}

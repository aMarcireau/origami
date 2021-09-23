import {
    OPEN_MENU_ITEM,
    CLOSE_MENU,
    RESOLVE_SAVE,
    REJECT_SAVE,
    SELECT_GRAPH_DISPLAY,
    SELECT_LIST_DISPLAY,
} from "../constants/actionTypes";

export default function menu(
    state = {
        activeItem: null,
        hash: 0,
        saveFilename: null,
        savedVersion: 0,
        display: 0,
    },
    action
) {
    switch (action.type) {
        case OPEN_MENU_ITEM:
            return {
                ...state,
                activeItem: action.id,
            };
        case CLOSE_MENU:
            return {
                ...state,
                activeItem: null,
                hash: state.hash + 1,
            };

        case RESOLVE_SAVE:
            return {
                ...state,
                saveFilename: action.filename,
                savedVersion: action.version,
            };
        case REJECT_SAVE:
            return {
                ...state,
                saveFilename: null,
            };
        case SELECT_GRAPH_DISPLAY:
            return {
                ...state,
                display: 0,
            };
        case SELECT_LIST_DISPLAY:
            return {
                ...state,
                display: 1,
            };
        default:
            return state;
    }
}

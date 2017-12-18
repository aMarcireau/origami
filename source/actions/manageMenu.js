import {ipcRenderer} from 'electron'
import {
    RESET,
    OPEN_MENU_ITEM,
    CLOSE_MENU,
    RESOLVE_SAVE,
    REJECT_SAVE,
    REJECT_OPEN,
    RESOLVE_IMPORT_PUBLICATIONS,
    REJECT_IMPORT_PUBLICATIONS,
    RESOLVE_IMPORT_DOIS,
    REJECT_IMPORT_DOIS,
    RESOLVE_IMPORT_BIBTEX,
    REJECT_IMPORT_BIBTEX,
    SELECT_GRAPH_DISPLAY,
    SELECT_LIST_DISPLAY,
} from '../constants/actionTypes'

export function reset(state) {
    return {
        type: RESET,
        state,
    };
}

export function openMenuItem(id) {
    return {
        type: OPEN_MENU_ITEM,
        id,
    };
}

export function closeMenu() {
    return {type: CLOSE_MENU};
}

export function resolveSave(filename, version) {
    return {
        type: RESOLVE_SAVE,
        filename,
        version,
    };
}

export function rejectSave(filename, timestamp) {
    return {
        type: REJECT_SAVE,
        filename,
        timestamp,
    };
}

export function rejectOpen(filename, message) {
    return {
        type: REJECT_OPEN,
        filename,
        message,
    };
}

export function resolveImportPublications(publications) {
    return {
        type: RESOLVE_IMPORT_PUBLICATIONS,
        publications,
    };
}

export function rejectImportPublications(filename, message) {
    return {
        type: REJECT_IMPORT_PUBLICATIONS,
        filename,
        message,
    };
}

export function resolveImportDois(dois, timestamp) {
    return {
        type: RESOLVE_IMPORT_DOIS,
        dois,
        timestamp,
    };
}

export function rejectImportDois(filename, message) {
    return {
        type: REJECT_IMPORT_DOIS,
        filename,
        message,
    };
}

export function resolveImportBibtex(publications) {
    return {
        type: RESOLVE_IMPORT_BIBTEX,
        publications,
    };
}

export function rejectImportBibtex(filename, message) {
    return {
        type: REJECT_IMPORT_BIBTEX,
        filename,
        message,
    };
}

export function selectGraphDisplay() {
    return {type: SELECT_GRAPH_DISPLAY};
}

export function selectListDisplay() {
    return {type: SELECT_LIST_DISPLAY};
}

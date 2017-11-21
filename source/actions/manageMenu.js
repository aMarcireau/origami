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
    SELECT_GRAPH_DISPLAY,
    SELECT_LIST_DISPLAY,
} from '../constants/actionTypes'
import {SCHOLAR_STATUS_IDLE} from '../constants/enums'

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

export function rejectOpen(filename, timestamp) {
    return {
        type: REJECT_OPEN,
        filename,
        timestamp,
    };
}

export function resolveImportPublications(publications) {
    return {
        type: RESOLVE_IMPORT_PUBLICATIONS,
        publications,
    };
}

export function rejectImportPublications(filename, timestamp) {
    return {
        type: REJECT_IMPORT_PUBLICATIONS,
        filename,
        timestamp,
    };
}

export function selectGraphDisplay() {
    return {type: SELECT_GRAPH_DISPLAY};
}

export function selectListDisplay() {
    return {type: SELECT_LIST_DISPLAY};
}

export function stateToJson(state, expand) {
    return `${JSON.stringify({
        display: state.menu.display,
        doiRequests: Array.from(state.doiRequests.entries()).map(
            ([id, doiRequest]) => {
                const savableDoiRequest = {...doiRequest};
                delete savableDoiRequest.fetching;
                return [id, savableDoiRequest];
            }
        ).filter(
            ([id, doiRequest]) => state.publications.has(doiRequest.parentDoi)
        ),
        graph: state.graph,
        saveFilename: expand ? undefined : state.menu.saveFilename,
        savable: expand ? undefined : state.menu.savedVersion < state.version,
        publications: Array.from(state.publications.entries()).map(
            ([doi, publication]) => {
                const savablePublication = {...publication};
                delete publication.validating;
                return [doi, savablePublication];
            }
        ),
        scholar: {
            pages: state.scholar.pages.filter(page => state.publications.has(page.doi)),
            minimumRefractoryPeriod: state.scholar.minimumRefractoryPeriod,
            maximumRefractoryPeriod: state.scholar.maximumRefractoryPeriod,
        },
        tabs: state.tabs.index,
        warnings: state.warnings.list,
    }, null, expand ? '    ' : null)}${expand ? '\n' : ''}`;
}

export function jsonToState(json, saveFilename, previousState) {
    try {
        const state = JSON.parse(new TextDecoder('utf-8').decode(json));
        state.colors = previousState ? previousState.colors : undefined;
        state.connected = previousState ? previousState.connected : undefined;
        state.doiRequests = new Map(state.doiRequests.map(
            ([id, doiRequest]) => [id, {
                ...doiRequest,
                fetching: false,
            }]
        ));
        state.menu = {
            activeItem: null,
            hash: previousState ? previousState.menu.hash + 1 : 0,
            saveFilename: saveFilename ? saveFilename : state.saveFilename,
            savedVersion: previousState ? previousState.version + 1 : 0,
            display: state.display,
        };
        delete state.saveFilename;
        delete state.display;
        state.publications = new Map(state.publications.map(
            ([doi, publication]) => [doi, {
                ...publication,
                validating: false,
            }]
        ));
        state.scholar.status = SCHOLAR_STATUS_IDLE;
        state.scholar.beginOfRefractoryPeriod = null;
        state.scholar.endOfRefractoryPeriod = null;
        state.scholar.url = null;
        state.tabs = {
            index: state.tabs,
            hash: previousState ? previousState.tabs.hash + 1 : 0,
        };
        state.version = (previousState ?
            previousState.version + 1
            : (state.savable ?
                1
                : 0
            )
        );
        delete state.savable;
        state.warnings = {
            list: state.warnings,
            hash: previousState ? previousState.warnings.hash + 1 : 0,
        };
        return [null, state];
    } catch(error) {
        return [error, null];
    }
}

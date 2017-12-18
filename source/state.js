import crossrefQueue from './queues/crossrefQueue'
import doiQueue from './queues/doiQueue'
import scholarQueue from './queues/scholarQueue'
import {
    SCHOLAR_STATUS_IDLE,
    SCHOLAR_STATUS_FETCHING,
    SCHOLAR_STATUS_BLOCKED_HIDDEN,
    SCHOLAR_STATUS_BLOCKED_VISIBLE,
    SCHOLAR_STATUS_UNBLOCKING,
    CROSSREF_REQUEST_TYPE_VALIDATION,
    CROSSREF_REQUEST_TYPE_CITER_METADATA,
    CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
} from './constants/enums'

/// stateToJson generates a JSON string from an app state.
/// expand must be a boolean:
///    if true, a user-save JSON is generated (pretty-printed)
///    otherwise, an auto-save JSON is generated
export function stateToJson(state, expand) {
    return `${JSON.stringify({
        appVersion: state.appVersion,
        display: state.menu.display,
        knownDois: Array.from(state.knownDois),
        crossref: state.crossref.requests.filter(crossrefRequest => (
            crossrefRequest.type !== CROSSREF_REQUEST_TYPE_CITER_METADATA
            || state.publications.has(crossrefRequest.parentDoi)
        )),
        doi: state.doi.requests.filter(doiRequest => state.publications.has(doiRequest.doi)),
        graph: state.graph,
        saveFilename: expand ? undefined : state.menu.saveFilename,
        savable: expand ? undefined : state.menu.savedVersion < state.version,
        publications: Array.from(state.publications.entries()),
        scholar: {
            requests: state.scholar.requests.filter(request => state.publications.has(request.doi)),
            minimumRefractoryPeriod: state.scholar.minimumRefractoryPeriod,
            maximumRefractoryPeriod: state.scholar.maximumRefractoryPeriod,
        },
        search: state.search,
        tabs: state.tabs.index,
        warnings: state.warnings.list,
    }, null, expand ? '    ' : null)}${expand ? '\n' : ''}`;
}

/// jsonToState generates an app state from a JSON buffer.
/// saveFilename must be a string:
///     if null (typically, for an auto-save JSON), the JSON's saveFilename is used
/// previousState must be an object:
///     if null (typically, for an auto-save JSON), some state parameters are left empty (and must be added manually)
export function jsonToState(json, saveFilename, previousState) {
    try {
        const state = JSON.parse(new TextDecoder('utf-8').decode(json));
        state.appVersion = previousState ? previousState.appVersion : undefined;
        state.colors = previousState ? previousState.colors : undefined;
        state.connected = previousState ? previousState.connected : undefined;
        state.crossref = {
            status: crossrefQueue.status.IDLE,
            requests: state.crossref,
        };
        state.doi = {
            status: doiQueue.status.IDLE,
            requests: state.doi,
        };
        state.knownDois = new Set(state.knownDois);
        state.menu = {
            activeItem: null,
            hash: previousState ? previousState.menu.hash + 1 : 0,
            saveFilename: saveFilename ? saveFilename : state.saveFilename,
            savedVersion: previousState ? previousState.version + 1 : 0,
            display: state.display,
        };
        delete state.saveFilename;
        delete state.display;
        state.publications = new Map(state.publications);
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

/// resetState generates a reset state with incremented hashes.
/// state must be an app state.
export function resetState(state) {
    return {
        appVersion: state.appVersion,
        colors: state.colors,
        connected: state.connected,
        menu: {
            activeItem: null,
            hash: state.menu.hash + 1,
            saveFilename: null,
            savedVersion: state.version + 1,
            display: 0,
        },
        tabs: {
            index: 0,
            hash: state.tabs.hash + 1,
        },
        version: state.version + 1,
        warnings: {
            list: [],
            hash: state.warnings.hash + 1,
        },
    };
}

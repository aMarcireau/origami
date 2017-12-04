import {ipcRenderer} from 'electron'
import {convertLaTeX, stringifyLaTeX} from '../libraries/latex-to-unicode-converter'
import {
    RESET,
    OPEN_MENU_ITEM,
    CLOSE_MENU,
    RESOLVE_SAVE,
    REJECT_SAVE,
    REJECT_OPEN,
    RESOLVE_IMPORT_PUBLICATIONS,
    REJECT_IMPORT_PUBLICATIONS,
    RESOLVE_IMPORT_BIBTEX,
    REJECT_IMPORT_BIBTEX,
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

export function stateToJson(state, expand) {
    return `${JSON.stringify({
        appVersion: state.appVersion,
        display: state.menu.display,
        knownDois: Array.from(state.knownDois),
        publicationRequests: Array.from(state.publicationRequests.entries()).map(
            ([id, publicationRequest]) => {
                const savableDoiRequest = {...publicationRequest};
                delete savableDoiRequest.fetching;
                return [id, savableDoiRequest];
            }
        ).filter(
            ([id, publicationRequest]) => state.publications.has(publicationRequest.parentDoi)
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
        search: state.search,
        tabs: state.tabs.index,
        warnings: state.warnings.list,
    }, null, expand ? '    ' : null)}${expand ? '\n' : ''}`;
}

export function jsonToState(json, saveFilename, previousState) {
    try {
        const state = JSON.parse(new TextDecoder('utf-8').decode(json));
        state.appVersion = previousState ? previousState.appVersion : undefined;
        state.colors = previousState ? previousState.colors : undefined;
        state.connected = previousState ? previousState.connected : undefined;
        state.knownDois = new Set(state.knownDois);
        state.publicationRequests = new Map(state.publicationRequests.map(
            ([id, publicationRequest]) => [id, {
                ...publicationRequest,
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

export function bibtexToPublications(bibtex) {
    const bibtexAsString = bibtex.toString('utf8');
    const publications = [];
    let line = 1;
    let position = 0;
    let status = 'root';
    let nesting = 0;
    let publication = {};
    let key = '';
    const throwError = character => {
        throw new Error(`Unexpected character '${character}' on line ${line}:${position}`);
    };
    const addPublication = () => {
        if (publication.title != null && publication.author != null && publication.year != null) {
            publications.push({
                title: convertLaTeX({
                    onError: (error, latex) => stringifyLaTeX(latex)
                }, publication.title),
                authors: convertLaTeX({
                    onError: (error, latex) => stringifyLaTeX(latex)
                }, publication.author).split(' and ').map(
                    author => author.split(',').reverse().filter(name => name.length > 0).map(name => name.trim()).join(' ')
                ),
                dateAsString: convertLaTeX({
                    onError: (error, latex) => stringifyLaTeX(latex)
                }, publication.year),
            });
        }
        key = '';
        publication = {};
        status = 'root';
        nesting = 0;
    }
    try {
        for (const character of bibtexAsString) {
            ++position;
            switch (status) {
                case 'root':
                    if (character === '@') {
                        status = 'type';
                    } else if (/\S/.test(character)) {
                        status = 'comment';
                    }
                    break;
                case 'comment':
                    if (character === '\n') {
                        status = 'root';
                    }
                    break;
                case 'type':
                    if (/(\w|\s)/.test(character)) {
                        break;
                    } else if (character === '{') {
                        status = 'label';
                        nesting = 1;
                    } else {
                        throwError(character);
                    }
                    break;
                case 'label':
                    if (character === ',') {
                        status = 'beforeKey';
                    } else if (character === '{' || character === '}') {
                        throwError(character);
                    }
                    break;
                case 'beforeKey':
                    if (character === '}') {
                        addPublication();
                    } else if (/\w/.test(character)) {
                        status = 'key';
                        key += character;
                    } else if (/\S/.test(character)) {
                        throwError(character);
                    }
                    break;
                case 'key':
                    if (/(\w|:)/.test(character)) {
                        key += character;
                    } else if (character === '=') {
                        publication[key] = '';
                        status = 'beforeValue';
                    } else if (/\s/.test(character)) {
                        status = 'afterKey';
                    } else {
                        throwError(character);
                    }
                    break;
                case 'afterKey':
                    if (character === '=') {
                        publication[key] = '';
                        status = 'beforeValue';
                    } else if (/\S/.test(character)) {
                        throwError(character);
                    }
                    break;
                case 'beforeValue':
                    if (/\s/.test(character)) {
                        break;
                    } else if (character === '}') {
                        throwError(character);
                    } else {
                        if (character === '{') {
                            ++nesting;
                        }
                        publication[key] += character;
                        status = 'value';
                    }
                    break;
                case 'value':
                    if (character === '}') {
                        --nesting;
                        if (nesting === 0) {
                            throwError(character);
                        }
                        publication[key] += character;
                    } else if (character === '{') {
                        ++nesting;
                        publication[key] += character;
                    } else if (nesting === 1) {
                        if (character === ',') {
                            key = '';
                            status = 'beforeKey';
                        } else if (/(\s)/.test(character)) {
                            status = 'afterValue';
                        } else {
                            publication[key] += character;
                        }
                    } else {
                        publication[key] += character;
                    }
                    break;
                case 'afterValue': {
                    if (character === ',') {
                        key = '';
                        status = 'beforeKey';
                    } else if (character === '}') {
                        addPublication();
                    } else if (/\S/.test(character)) {
                        throwError(character);
                    }
                    break;
                }
                default:
                    break;
            }
            if (character === '\n') {
                ++line;
                position = 0;
            }
        }
        return [null, publications];
    } catch (error) {
        return [error, null];
    }
}

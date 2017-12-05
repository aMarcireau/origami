import {
    PUBLICATION_FROM_DOI,
    FETCH_PUBLICATION_FROM_DOI,
    RESOLVE_PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI_CONNECTION,
    ADD_PUBLICATION_TO_COLLECTION,
    SELECT_PUBLICATION,
    UNSELECT_PUBLICATION,
    REMOVE_PUBLICATION,
    UPDATE_PUBLICATION,
    UPDATE_ALL_PUBLICATIONS,
    RESOLVE_BIBTEX_FROM_DOI,
    RESOLVE_PUBLICATION_FROM_CITER_METADATA,
    RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
    RESOLVE_IMPORT_PUBLICATIONS,
    RESOLVE_IMPORT_DOIS,
    STORE_GRAPH_NODES,
    LOCK_GRAPH_NODE,
    RELEASE_GRAPH_NODE,
} from '../constants/actionTypes'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
    PAGE_TYPE_INITIALIZE,
} from '../constants/enums'
import {
    isOlderThan,
    doiPattern,
} from '../libraries/utilities'

export default function publications(state = new Map(), action, appState) {
    switch (action.type) {
        case PUBLICATION_FROM_DOI: {
            const doi = action.doi.toLowerCase();
            if (state.has(doi)) {
                if (state.get(doi).status === PUBLICATION_STATUS_DEFAULT) {
                    const newState = new Map(state);
                    newState.set(doi, {
                        ...state.get(doi),
                        status: PUBLICATION_STATUS_IN_COLLECTION,
                        updated: action.timestamp,
                    });
                    return newState;
                }
                return state;
            }
            const newState = new Map(state);
            newState.set(doi, {
                status: PUBLICATION_STATUS_UNVALIDATED,
                title: null,
                authors: null,
                journal: null,
                date: null,
                citers: [],
                updated: null,
                selected: false,
                validating: false,
                bibtex: null,
                x: null,
                y: null,
                locked: false,
            });
            return newState;
        }
        case FETCH_PUBLICATION_FROM_DOI: {
            if (!state.has(action.doi) || state.get(action.doi).status !== PUBLICATION_STATUS_UNVALIDATED) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.doi, {
                ...state.get(action.doi),
                validating: true,
            });
            return newState;
        }

        case REJECT_PUBLICATION_FROM_DOI: {
            if (!state.has(action.doi) || state.get(action.doi).status !== PUBLICATION_STATUS_UNVALIDATED) {
                return state;
            }
            const newState = new Map(state);
            newState.delete(action.doi);
            return newState;
        }
        case REJECT_PUBLICATION_FROM_DOI_CONNECTION: {
            if (!state.has(action.doi) || state.get(action.doi).status !== PUBLICATION_STATUS_UNVALIDATED) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.doi, {
                ...state.get(action.doi),
                validating: false,
            });
            return newState;
        }
        case RESOLVE_PUBLICATION_FROM_DOI: {
            if (!state.has(action.doi) || state.get(action.doi).status !== PUBLICATION_STATUS_UNVALIDATED) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.doi, {
                ...state.get(action.doi),
                title: action.crossrefMessage.title[0] == null ? '' : action.crossrefMessage.title[0],
                authors: action.crossrefMessage.author.filter(
                    author => author.given != null || author.family != null
                ).map(
                    author => {
                        if (author.given == null) {
                            return author.family;
                        }
                        if (author.family == null) {
                            return author.given;
                        }
                        return `${author.given} ${author.family}`;
                    }
                ),
                journal: action.crossrefMessage.publisher,
                date: (isOlderThan(action.crossrefMessage.created['date-parts'][0], action.crossrefMessage.issued['date-parts'][0]) ?
                    action.crossrefMessage.created['date-parts'][0]
                    : action.crossrefMessage.issued['date-parts'][0]
                ),
                status: PUBLICATION_STATUS_IN_COLLECTION,
                updated: action.timestamp,
                validating: false,
            });
            return newState;
        }
        case ADD_PUBLICATION_TO_COLLECTION: {
            if (!state.has(action.doi) || state.get(action.doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.doi, {
                ...state.get(action.doi),
                status: PUBLICATION_STATUS_IN_COLLECTION,
                updated: action.timestamp,
            });
            return newState;
        }
        case SELECT_PUBLICATION: {
            if (!state.has(action.doi) || state.get(action.doi).status === PUBLICATION_STATUS_UNVALIDATED) {
                return state;
            }
            return new Map(Array.from(state.entries()).map(([doi, publication]) => [
                doi,
                {
                    ...publication,
                    selected: doi === action.doi,
                },
            ]));
        }
        case UNSELECT_PUBLICATION: {
            return new Map(Array.from(state.entries()).map(([doi, publication]) => [
                doi,
                {
                    ...publication,
                    selected: false,
                },
            ]));
        }
        case REMOVE_PUBLICATION: {
            if (!state.has(action.doi) || state.get(action.doi).status !== PUBLICATION_STATUS_IN_COLLECTION) {
                return state;
            }
            const doisToRemove = new Set([
                ...state.get(action.doi).citers.filter(citer => state.get(citer).status === PUBLICATION_STATUS_DEFAULT),
                action.doi,
            ]);
            const newState = new Map(state);
            newState.set(action.doi, {
                ...state.get(action.doi),
                status: PUBLICATION_STATUS_DEFAULT,
                bibtex: null,
                locked: false,
                citers: [],
            });
            for (const publication of newState.values()) {
                if (publication.status === PUBLICATION_STATUS_IN_COLLECTION) {
                    for (const citer of publication.citers) {
                        doisToRemove.delete(citer);
                    }
                }
            }
            for (const doi of doisToRemove.values()) {
                newState.delete(doi);
            }
            return newState;
        }
        case UPDATE_PUBLICATION: {
            if (!state.has(action.doi) || state.get(action.doi).status !== PUBLICATION_STATUS_IN_COLLECTION) {
                return state;
            }
            return new Map(Array.from(state.entries()).filter(
                ([doi, publication]) => (
                    publication.status !== PUBLICATION_STATUS_DEFAULT
                    || !state.get(action.doi).citers.includes(doi)
                    || Array.from(state.entries()).some(
                        ([otherDoi, otherPublication]) => otherDoi !== action.doi && otherPublication.citers.includes(doi)
                    )
                )
            ).map(
                ([doi, publication]) => [
                    doi,
                    {
                        ...publication,
                        citers: doi === action.doi ? [] : publication.citers,
                        updated: doi === action.doi ? action.timestamp : publication.updated,
                        bibtex: doi === action.doi ? null : publication.bibtex,
                    },
                ]
            ));
        }
        case UPDATE_ALL_PUBLICATIONS: {
            const updatableDois = new Set(Array.from(state.entries()).filter(
                ([doi, publication]) => publication.status === PUBLICATION_STATUS_IN_COLLECTION
            ).map(
                ([doi, publication]) => doi
            ));
            for (const page of appState.scholar.pages) {
                if (page.type !== PAGE_TYPE_INITIALIZE) {
                    updatableDois.delete(page.doi);
                }
            }
            for (const bibtexRequest of appState.bibtexRequests.values()) {
                updatableDois.delete(bibtexRequest.doi);
            }
            for (const publicationRequest of appState.publicationRequests.values()) {
                updatableDois.delete(publicationRequest.parentDoi);
            }
            const newState = new Map(state);
            for (const doi of updatableDois.values()) {
                const publication = {
                    ...newState.get(doi),
                    updated: action.timestamp,
                    bibtex: null,
                };
                for (const citer of publication.citers) {
                    if (newState.get(citer).status !== PUBLICATION_STATUS_IN_COLLECTION) {
                        newState.delete(citer);
                    }
                }
                publication.citers = [];
                newState.set(doi, publication);
            }
            return newState;
        }
        case RESOLVE_BIBTEX_FROM_DOI: {
            if (!state.has(action.doi)) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.doi, {
                ...newState.get(action.doi),
                bibtex: action.bibtex,
            });
            return newState;
        }
        case RESOLVE_PUBLICATION_FROM_CITER_METADATA: {
            if (!state.has(action.parentDoi)) {
                return state;
            }
            const newState = new Map(state);
            const doi = action.crossrefMessage.DOI.toLowerCase();
            if (newState.has(doi)) {
                newState.set(doi, {
                    ...newState.get(doi),
                    title: action.crossrefMessage.title[0],
                    authors: action.crossrefMessage.author.filter(
                        author => author.given != null || author.family != null
                    ).map(
                        author => {
                            if (author.given == null) {
                                return author.family;
                            }
                            if (author.family == null) {
                                return author.given;
                            }
                            return `${author.given} ${author.family}`;
                        }
                    ),
                    journal: action.crossrefMessage.publisher,
                    date: (isOlderThan(action.crossrefMessage.created['date-parts'][0], action.crossrefMessage.issued['date-parts'][0]) ?
                        action.crossrefMessage.created['date-parts'][0]
                        : action.crossrefMessage.issued['date-parts'][0]
                    ),
                });
            } else {
                newState.set(doi, {
                    status: PUBLICATION_STATUS_DEFAULT,
                    title: action.crossrefMessage.title[0],
                    authors: action.crossrefMessage.author.filter(
                        author => author.given != null || author.family != null
                    ).map(
                        author => {
                            if (author.given == null) {
                                return author.family;
                            }
                            if (author.family == null) {
                                return author.given;
                            }
                            return `${author.given} ${author.family}`;
                        }
                    ),
                    journal: action.crossrefMessage.publisher,
                    date: (isOlderThan(action.crossrefMessage.created['date-parts'][0], action.crossrefMessage.issued['date-parts'][0]) ?
                        action.crossrefMessage.created['date-parts'][0]
                        : action.crossrefMessage.issued['date-parts'][0]
                    ),
                    citers: [],
                    updated: null,
                    selected: false,
                    validating: false,
                    bibtex: null,
                    x: null,
                    y: null,
                    locked: false,
                });
            }
            if (!newState.get(action.parentDoi).citers.includes(doi)) {
                newState.set(action.parentDoi, {
                    ...newState.get(action.parentDoi),
                    citers: [
                        ...newState.get(action.parentDoi).citers,
                        doi,
                    ],
                });
            }
            return newState;
        }
        case RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA: {
            const doi = action.crossrefMessage.DOI.toLowerCase();
            if (state.has(doi) && state.get(doi).status !== PUBLICATION_STATUS_DEFAULT) {
                return state;
            }
            const newState = new Map(state);
            if (state.has(doi)) {
                newState.set(doi, {
                    ...newState.get(doi),
                    status: PUBLICATION_STATUS_IN_COLLECTION,
                    title: action.crossrefMessage.title[0],
                    authors: action.crossrefMessage.author.filter(
                        author => author.given != null || author.family != null
                    ).map(
                        author => {
                            if (author.given == null) {
                                return author.family;
                            }
                            if (author.family == null) {
                                return author.given;
                            }
                            return `${author.given} ${author.family}`;
                        }
                    ),
                    journal: action.crossrefMessage.publisher,
                    date: (isOlderThan(action.crossrefMessage.created['date-parts'][0], action.crossrefMessage.issued['date-parts'][0]) ?
                        action.crossrefMessage.created['date-parts'][0]
                        : action.crossrefMessage.issued['date-parts'][0]
                    ),
                    updated: action.timestamp,
                });
            } else {
                newState.set(doi, {
                    status: PUBLICATION_STATUS_IN_COLLECTION,
                    title: action.crossrefMessage.title[0],
                    authors: action.crossrefMessage.author.filter(
                        author => author.given != null || author.family != null
                    ).map(
                        author => {
                            if (author.given == null) {
                                return author.family;
                            }
                            if (author.family == null) {
                                return author.given;
                            }
                            return `${author.given} ${author.family}`;
                        }
                    ),
                    journal: action.crossrefMessage.publisher,
                    date: (isOlderThan(action.crossrefMessage.created['date-parts'][0], action.crossrefMessage.issued['date-parts'][0]) ?
                        action.crossrefMessage.created['date-parts'][0]
                        : action.crossrefMessage.issued['date-parts'][0]
                    ),
                    citers: [],
                    updated: action.timestamp,
                    selected: false,
                    validating: false,
                    bibtex: null,
                    x: null,
                    y: null,
                    locked: false,
                });
            }
            return newState;
        }
        case RESOLVE_IMPORT_PUBLICATIONS: {
            const newState = new Map(state);
            for (const [doi, publication] of action.publications.entries()) {
                if (newState.has(doi)) {
                    const existingPublication = newState.get(doi);
                    if (
                        (existingPublication.status !== publication.status && existingPublication.status !== PUBLICATION_STATUS_IN_COLLECTION)
                        || (publication.status === PUBLICATION_STATUS_IN_COLLECTION && publication.updated > existingPublication.updated)
                    ) {
                        newState.set(doi, publication);
                    }
                } else {
                    newState.set(doi, publication);
                }
            }
            const doisToRemove = new Set(Array.from(state.entries()).filter(
                ([doi, publication]) => publication.status === PUBLICATION_STATUS_DEFAULT
            ).map(
                ([doi, publication]) => doi
            ));
            for (const publication of newState.values()) {
                for (const citer of publication.citers) {
                    doisToRemove.delete(citer);
                }
            }
            for (const doi of doisToRemove.values()) {
                newState.delete(doi);
            }
            return newState;
        }
        case RESOLVE_IMPORT_DOIS: {
            const newState = new Map(state);
            const foundDois = new Set();
            for (const rawDoi of action.dois) {
                const match = doiPattern.exec(rawDoi);
                if (match) {
                    const doi = match[1].toLowerCase();
                    if (foundDois.has(doi)) {
                        continue;
                    }
                    if (state.has(doi)) {
                        if (state.get(doi).status === PUBLICATION_STATUS_DEFAULT) {
                            const newState = new Map(state);
                            newState.set(doi, {
                                ...state.get(doi),
                                status: PUBLICATION_STATUS_IN_COLLECTION,
                                updated: action.timestamp,
                            });
                        }
                        continue;
                    }
                    newState.set(doi, {
                        status: PUBLICATION_STATUS_UNVALIDATED,
                        title: null,
                        authors: null,
                        journal: null,
                        date: null,
                        citers: [],
                        updated: null,
                        selected: false,
                        validating: false,
                        bibtex: null,
                        x: null,
                        y: null,
                        locked: false,
                    });
                }
            }
            return newState;
        }
        case STORE_GRAPH_NODES: {
            const newState = new Map(state);
            for (const node of action.nodes) {
                if (newState.has(node.doi)) {
                    newState.set(node.doi, {
                        ...newState.get(node.doi),
                        x: node.x,
                        y: node.y,
                    });
                }
            }
            return newState;
        }
        case LOCK_GRAPH_NODE: {
            if (!state.has(action.doi)) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.doi, {
                ...newState.get(action.doi),
                x: action.x,
                y: action.y,
                locked: true,
            });
            return newState;
        }
        case RELEASE_GRAPH_NODE: {
            if (!state.has(action.doi)) {
                return state;
            }
            const newState = new Map(state);
            newState.set(action.doi, {
                ...newState.get(action.doi),
                locked: false,
            });
            return newState;
        }
        default: {
            return state;
        }
    }
}

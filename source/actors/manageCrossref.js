import {
    fetchBibtexFromDoi,
    resolveBibtexFromDoi,
    rejectBibtexFromDoiConnection,
} from '../actions/getBibtexFromDoi'
import {
    fetchPublicationFromDoi,
    resolvePublicationFromDoi,
    rejectPublicationFromDoi,
    rejectPublicationFromDoiConnection,
} from '../actions/getPublicationFromDoi'
import {
    fetchPublicationFromMetadata,
    resolvePublicationFromCiterMetadata,
    resolvePublicationFromImportedMetadata,
    rejectPublicationFromMetadata,
    rejectPublicationFromMetadataConnection,
} from '../actions/getPublicationFromMetadata'
import {
    isOlderThan,
    levenshteinDistance,
} from '../libraries/utilities'
import {
    PUBLICATION_STATUS_UNVALIDATED,
    PUBLICATION_STATUS_DEFAULT,
    PUBLICATION_STATUS_IN_COLLECTION,
    PUBLICATION_REQUEST_TYPE_CITER_METADATA,
    PUBLICATION_REQUEST_TYPE_IMPORTED_METADATA,
} from '../constants/enums'

export default function manageCrossref(store) {
    const state = store.getState();
    if (state.connected) {
        for (const [doi, publication] of state.publications.entries()) {
            if (publication.status === PUBLICATION_STATUS_UNVALIDATED && !publication.validating) {
                store.dispatch(fetchPublicationFromDoi(doi));
                fetch(`http://api.crossref.org/works/${doi}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new SyntaxError(response.statusText);
                        }
                        return response;
                    })
                    .then(response => response.json())
                    .then(json => {
                        const bytes = new Uint8Array(64);
                        window.crypto.getRandomValues(bytes);
                        store.dispatch(resolvePublicationFromDoi(
                            doi,
                            json.message,
                            Array.from(bytes).map(byte => byte.toString(16)).join(''),
                            new Date().getTime()
                        ));
                    })
                    .catch(error => {
                        if (error instanceof SyntaxError) {
                            store.dispatch(rejectPublicationFromDoi(doi));
                        } else {
                            store.dispatch(rejectPublicationFromDoiConnection(doi));
                        }
                    })
                ;
                break;
            }
        }
        for (const [id, bibtexRequest] of state.bibtexRequests) {
            if (!bibtexRequest.fetching) {
                store.dispatch(fetchBibtexFromDoi(id));
                fetch(`https://dx.doi.org/${bibtexRequest.doi}`, {headers: new Headers({
                    'Accept': 'text/bibliography; style=bibtex',
                })})
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response;
                    })
                    .then(response => response.text())
                    .then(rawText => {
                        const text = rawText.trim();
                        let bibtex = '';
                        let nesting = 0;
                        for (const character of text) {
                            switch (character) {
                                case '{':
                                    ++nesting;
                                    bibtex += character;
                                    break;
                                case '}':
                                    --nesting;
                                    if (nesting === 0) {
                                        bibtex += ',\n}';
                                    } else {
                                        bibtex += character;
                                    }
                                    break;
                                case ',':
                                    if (nesting < 2) {
                                        bibtex += ',\n    ';
                                    } else {
                                        bibtex += character;
                                    }
                                    break;
                                default:
                                    bibtex += character;
                                    break;
                            }
                        }
                        store.dispatch(resolveBibtexFromDoi(
                            id,
                            bibtexRequest.doi,
                            bibtex + '\n'
                        ));
                    })
                    .catch(error => {
                        store.dispatch(rejectBibtexFromDoiConnection(id));
                    })
                ;
                break;
            }
        }
        for (const [id, publicationRequest] of state.publicationRequests) {
            if (!publicationRequest.fetching) {
                store.dispatch(fetchPublicationFromMetadata(id));
                fetch(`https://api.crossref.org/works?${[
                    ...publicationRequest.authors.map(author => `query.author=${encodeURIComponent(author)}`),
                    `query.title=${encodeURIComponent(publicationRequest.title)}`,
                    `filter=from-pub-date:${encodeURIComponent(publicationRequest.dateAsString)}`,
                    'sort=score',
                    'order=desc',
                    'rows=5',
                ].join('&').replace(/\s/g, '+')}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response;
                    })
                    .then(response => response.json())
                    .then(json => {
                        const state = store.getState();
                        if (publicationRequest.type === PUBLICATION_REQUEST_TYPE_CITER_METADATA && !state.publications.has(publicationRequest.parentDoi)) {
                            store.dispatch(resolvePublicationFromCiterMetadata(
                                id,
                                publicationRequest.parentDoi,
                                null
                            ));
                        } else {
                            if (json.message.items.length === 0) {
                                store.dispatch(rejectPublicationFromMetadata(
                                    id,
                                    publicationRequest.title,
                                    'Corssref returned an empty list'
                                ));
                            } else {
                                const bestPublicationAndDistance = json.message.items.map((publication, index) => {
                                    return {
                                        publication,
                                        distance: (
                                            levenshteinDistance(
                                                publication.title[0].toLowerCase(),
                                                publicationRequest.title.toLowerCase()
                                            )
                                            + index / json.message.items.length
                                        ),
                                    };
                                }).reduce((accumulator, current) => {
                                    if (!accumulator || current.distance < accumulator.distance) {
                                        return current;
                                    }
                                    return accumulator;
                                }, null);
                                if (publicationRequest.type === PUBLICATION_REQUEST_TYPE_CITER_METADATA && isOlderThan(
                                    bestPublicationAndDistance.publication.created['date-parts'][0],
                                    state.publications.get(publicationRequest.parentDoi).date
                                )) {
                                    store.dispatch(rejectPublicationFromMetadata(
                                        id,
                                        publicationRequest.title,
                                        `The returned article was older than the cited one (${publicationRequest.parentDoi})`
                                    ));
                                } else if (bestPublicationAndDistance.distance > 10) {
                                    store.dispatch(rejectPublicationFromMetadata(
                                        id,
                                        publicationRequest.title,
                                        `The returned title '${bestPublicationAndDistance.publication.title[0]}' did not match the given one`
                                    ));
                                } else {
                                    if (publicationRequest.type === PUBLICATION_REQUEST_TYPE_CITER_METADATA) {
                                        store.dispatch(resolvePublicationFromCiterMetadata(
                                            id,
                                            publicationRequest.parentDoi,
                                            bestPublicationAndDistance.publication
                                        ));
                                    } else {
                                        const bytes = new Uint8Array(64);
                                        window.crypto.getRandomValues(bytes);
                                        store.dispatch(resolvePublicationFromImportedMetadata(
                                            id,
                                            bestPublicationAndDistance.publication,
                                            new Date().getTime(),
                                            Array.from(bytes).map(byte => byte.toString(16)).join('')
                                        ));
                                    }
                                }
                            }
                        }
                    })
                    .catch(error => {
                        if (error instanceof SyntaxError) {
                            store.dispatch(rejectPublicationFromMetadata(
                                id,
                                publicationRequest.title,
                                `Parsing failed: ${error.message}`
                            ));
                        } else {
                            store.dispatch(rejectPublicationFromMetadataConnection(id));
                        }
                    })
                ;
                break;
            }
        }
    }
}

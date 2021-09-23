import queue from "../libraries/queue";
import { levenshteinDistance, isOlderThan } from "../libraries/utilities";
import {
    RESOLVE_PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI,
    RESOLVE_PUBLICATION_FROM_CITER_METADATA,
    RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
    REJECT_PUBLICATION_FROM_METADATA,
} from "../constants/actionTypes";
import {
    resolvePublicationFromDoi,
    rejectPublicationFromDoi,
    resolvePublicationFromCiterMetadata,
    resolvePublicationFromImportedMetadata,
    rejectPublicationFromMetadata,
} from "../actions/manageCrossref";
import {
    CROSSREF_REQUEST_TYPE_VALIDATION,
    CROSSREF_REQUEST_TYPE_CITER_METADATA,
    CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
} from "../constants/enums";

const crossrefQueue = queue(
    "CROSSREF",
    "crossref",
    state => state.connected,
    (request, store) => {
        switch (request.type) {
            case CROSSREF_REQUEST_TYPE_VALIDATION:
                fetch(`https://api.crossref.org/works/${request.doi}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new SyntaxError(response.statusText);
                        }
                        return response;
                    })
                    .then(response => response.json())
                    .then(json => {
                        store.dispatch(
                            resolvePublicationFromDoi(
                                request.doi,
                                json.message,
                                new Date().getTime()
                            )
                        );
                    })
                    .catch(error => {
                        console.error(error);
                        if (error instanceof SyntaxError) {
                            store.dispatch(
                                rejectPublicationFromDoi(request.doi)
                            );
                        } else {
                            store.dispatch(
                                crossrefQueue.actions.rejectConnection()
                            );
                        }
                    });
                break;
            case CROSSREF_REQUEST_TYPE_CITER_METADATA:
            case CROSSREF_REQUEST_TYPE_IMPORTED_METADATA:
                fetch(
                    `https://api.crossref.org/works?${[
                        ...request.authors.map(
                            author =>
                                `query.author=${encodeURIComponent(author)}`
                        ),
                        `query.bibliographic=${encodeURIComponent(
                            request.title.toLowerCase()
                        )}`,
                        `filter=from-pub-date:${encodeURIComponent(
                            request.dateAsString
                        )}`,
                        "sort=score",
                        "order=desc",
                        "rows=5",
                    ]
                        .join("&")
                        .replace(/\s/g, "+")}`
                )
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response;
                    })
                    .then(response => response.json())
                    .then(json => {
                        const state = store.getState();
                        if (
                            request.type ===
                                CROSSREF_REQUEST_TYPE_CITER_METADATA &&
                            !state.publications.has(request.parentDoi)
                        ) {
                            store.dispatch(
                                resolvePublicationFromCiterMetadata(
                                    request.parentDoi,
                                    null
                                )
                            );
                        } else {
                            if (json.message.items.length === 0) {
                                store.dispatch(
                                    rejectPublicationFromMetadata(
                                        request.title,
                                        "Corssref returned an empty list"
                                    )
                                );
                            } else {
                                const bestPublicationAndDistance =
                                    json.message.items
                                        .map((publication, index) => {
                                            return {
                                                publication,
                                                distance:
                                                    levenshteinDistance(
                                                        publication.title[0].toLowerCase(),
                                                        request.title.toLowerCase()
                                                    ) +
                                                    index /
                                                        json.message.items
                                                            .length,
                                            };
                                        })
                                        .reduce((accumulator, current) => {
                                            if (
                                                !accumulator ||
                                                current.distance <
                                                    accumulator.distance
                                            ) {
                                                return current;
                                            }
                                            return accumulator;
                                        }, null);
                                if (
                                    request.type ===
                                        CROSSREF_REQUEST_TYPE_CITER_METADATA &&
                                    isOlderThan(
                                        bestPublicationAndDistance.publication
                                            .created["date-parts"][0],
                                        state.publications.get(
                                            request.parentDoi
                                        ).date
                                    )
                                ) {
                                    store.dispatch(
                                        rejectPublicationFromMetadata(
                                            request.title,
                                            `The returned article was older than the cited one (${request.parentDoi})`
                                        )
                                    );
                                } else if (
                                    bestPublicationAndDistance.distance > 10
                                ) {
                                    store.dispatch(
                                        rejectPublicationFromMetadata(
                                            request.title,
                                            `The returned title '${bestPublicationAndDistance.publication.title[0]}' did not match the given one`
                                        )
                                    );
                                } else {
                                    if (
                                        request.type ===
                                        CROSSREF_REQUEST_TYPE_CITER_METADATA
                                    ) {
                                        store.dispatch(
                                            resolvePublicationFromCiterMetadata(
                                                request.parentDoi,
                                                bestPublicationAndDistance.publication
                                            )
                                        );
                                    } else {
                                        store.dispatch(
                                            resolvePublicationFromImportedMetadata(
                                                bestPublicationAndDistance.publication,
                                                new Date().getTime()
                                            )
                                        );
                                    }
                                }
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        if (error instanceof SyntaxError) {
                            store.dispatch(
                                rejectPublicationFromMetadata(
                                    request.title,
                                    `Parsing failed: ${error.message}`
                                )
                            );
                        } else {
                            store.dispatch(
                                crossrefQueue.actions.rejectConnection()
                            );
                        }
                    });
                break;
            default:
                throw new Error(
                    `Unknown Crossref request type '${request.type}'`
                );
        }
    },
    [
        RESOLVE_PUBLICATION_FROM_DOI,
        REJECT_PUBLICATION_FROM_DOI,
        RESOLVE_PUBLICATION_FROM_CITER_METADATA,
        RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
        REJECT_PUBLICATION_FROM_METADATA,
    ]
);

export default crossrefQueue;

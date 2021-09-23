import {
    PUBLICATION_FROM_DOI,
    RESOLVE_PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI,
    PUBLICATION_FROM_CITER_METADATA,
    PUBLICATION_FROM_IMPORTED_METADATA,
    RESOLVE_PUBLICATION_FROM_CITER_METADATA,
    RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
    REJECT_PUBLICATION_FROM_METADATA,
} from "../constants/actionTypes";

export function publicationFromDoi(doi, timestamp) {
    return {
        type: PUBLICATION_FROM_DOI,
        doi,
        timestamp,
    };
}

export function resolvePublicationFromDoi(doi, crossrefMessage, timestamp) {
    return {
        type: RESOLVE_PUBLICATION_FROM_DOI,
        doi,
        crossrefMessage,
        timestamp,
    };
}

export function rejectPublicationFromDoi(doi) {
    return {
        type: REJECT_PUBLICATION_FROM_DOI,
        doi,
    };
}

export function publicationFromCiterMetadata(
    parentDoi,
    title,
    authors,
    dateAsString
) {
    return {
        type: PUBLICATION_FROM_CITER_METADATA,
        parentDoi,
        title,
        authors,
        dateAsString,
    };
}

export function publicationFromImportedMetadata(title, authors, dateAsString) {
    return {
        type: PUBLICATION_FROM_IMPORTED_METADATA,
        title,
        authors,
        dateAsString,
    };
}

export function resolvePublicationFromCiterMetadata(
    parentDoi,
    crossrefMessage
) {
    return {
        type: RESOLVE_PUBLICATION_FROM_CITER_METADATA,
        parentDoi,
        crossrefMessage,
    };
}

export function resolvePublicationFromImportedMetadata(
    crossrefMessage,
    timestamp,
    bibtexRequestId
) {
    return {
        type: RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
        crossrefMessage,
        timestamp,
        bibtexRequestId,
    };
}

export function rejectPublicationFromMetadata(title, message) {
    return {
        type: REJECT_PUBLICATION_FROM_METADATA,
        title,
        message,
    };
}

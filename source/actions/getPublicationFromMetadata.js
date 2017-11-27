import {
    PUBLICATION_FROM_CITER_METADATA,
    PUBLICATION_FROM_IMPORTED_METADATA,
    FETCH_PUBLICATION_FROM_METADATA,
    RESOLVE_PUBLICATION_FROM_CITER_METADATA,
    RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
    REJECT_PUBLICATION_FROM_METADATA,
    REJECT_PUBLICATION_FROM_METADATA_CONNECTION,
} from '../constants/actionTypes'

export function publicationFromCiterMetadata(id, parentDoi, title, authors, dateAsString) {
    return {
        type: PUBLICATION_FROM_CITER_METADATA,
        id,
        parentDoi,
        title,
        authors,
        dateAsString,
    }
}

export function publicationFromImportedMetadata(id, title, authors, dateAsString) {
    return {
        type: PUBLICATION_FROM_IMPORTED_METADATA,
        id,
        title,
        authors,
        dateAsString,
    }
}

export function fetchPublicationFromMetadata(id) {
    return {
        type: FETCH_PUBLICATION_FROM_METADATA,
        id,
    }
}

export function resolvePublicationFromCiterMetadata(id, parentDoi, crossrefMessage) {
    return {
        type: RESOLVE_PUBLICATION_FROM_CITER_METADATA,
        id,
        parentDoi,
        crossrefMessage,
    }
}

export function resolvePublicationFromImportedMetadata(id, crossrefMessage, timestamp, bibtexRequestId) {
    return {
        type: RESOLVE_PUBLICATION_FROM_IMPORTED_METADATA,
        id,
        crossrefMessage,
        timestamp,
        bibtexRequestId,
    }
}

export function rejectPublicationFromMetadata(id, title, message) {
    return {
        type: REJECT_PUBLICATION_FROM_METADATA,
        id,
        title,
        message,
    };
}

export function rejectPublicationFromMetadataConnection(id) {
    return {
        type: REJECT_PUBLICATION_FROM_METADATA_CONNECTION,
        id,
    };
}

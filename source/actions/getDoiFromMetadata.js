import {
    DOI_FROM_METADATA,
    FETCH_DOI_FROM_METADATA,
    RESOLVE_DOI_FROM_METADATA,
    REJECT_DOI_FROM_METADATA,
    REJECT_DOI_FROM_METADATA_CONNECTION,
} from '../constants/actionTypes'

export function doiFromMetadata(id, parentDoi, title, authors, dateAsString) {
    return {
        type: DOI_FROM_METADATA,
        id,
        parentDoi,
        title,
        authors,
        dateAsString,
    }
}

export function fetchDoiFromMetadata(id) {
    return {
        type: FETCH_DOI_FROM_METADATA,
        id,
    }
}

export function resolveDoiFromMetadata(id, parentDoi, crossrefMessage) {
    return {
        type: RESOLVE_DOI_FROM_METADATA,
        id,
        parentDoi,
        crossrefMessage,
    }
}

export function rejectDoiFromMetadata(id, message, timestamp) {
    return {
        type: REJECT_DOI_FROM_METADATA,
        id,
        message,
        timestamp,
    };
}

export function rejectDoiFromMetadataConnection(id) {
    return {
        type: REJECT_DOI_FROM_METADATA_CONNECTION,
        id,
    };
}

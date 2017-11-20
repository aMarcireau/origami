import {
    PUBLICATION_FROM_DOI,
    FETCH_PUBLICATION_FROM_DOI,
    RESOLVE_PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI,
    REJECT_PUBLICATION_FROM_DOI_CONNECTION,
} from '../constants/actionTypes'

export function publicationFromDoi(doi, timestamp) {
    return {
        type: PUBLICATION_FROM_DOI,
        doi,
        timestamp,
    };
}

export function fecthPublicationFromDoi(doi) {
    return {
        type: FETCH_PUBLICATION_FROM_DOI,
        doi,
    };
}

export function resolvePublicationFromDoi(doi, crossrefMessage, timestamp, bibtexRequestId) {
    return {
        type: RESOLVE_PUBLICATION_FROM_DOI,
        doi,
        crossrefMessage,
        timestamp,
        bibtexRequestId,
    };
}

export function rejectPublicationFromDoi(doi, timestamp) {
    return {
        type: REJECT_PUBLICATION_FROM_DOI,
        doi,
        timestamp,
    };
}

export function rejectPublicationFromDoiConnection(doi) {
    return {
        type: REJECT_PUBLICATION_FROM_DOI_CONNECTION,
        doi,
    };
}

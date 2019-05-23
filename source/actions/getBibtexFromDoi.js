import {
    FETCH_BIBTEX_FROM_DOI,
    RESOLVE_BIBTEX_FROM_DOI,
} from '../constants/actionTypes'

export function fetchBibtexFromDoi(id) {
    return {
        type: FETCH_BIBTEX_FROM_DOI,
        id,
    };
}

export function resolveBibtexFromDoi(id, doi, bibtex) {
    return {
        type: RESOLVE_BIBTEX_FROM_DOI,
        id,
        doi,
        bibtex,
    };
}

import {
    FETCH_BIBTEX_FROM_DOI,
    RESOLVE_BIBTEX_FROM_DOI,
    REJECT_DOI_ORG_CONNECTION,
} from '../constants/actionTypes'

export function fetchDoiOrg() {
    return {type: FETCH_BIBTEX_FROM_DOI};
}

export function resolveBibtexFromDoi(doi, bibtex) {
    return {
        type: RESOLVE_BIBTEX_FROM_DOI,
        doi,
        bibtex,
    };
}

export function rejectDoiOrgConnection() {
    return {type: REJECT_DOI_ORG_CONNECTION};
}

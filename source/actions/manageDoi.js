import { RESOLVE_BIBTEX_FROM_DOI } from "../constants/actionTypes";

export function resolveBibtexFromDoi(doi, bibtex) {
    return {
        type: RESOLVE_BIBTEX_FROM_DOI,
        doi,
        bibtex,
    };
}

import crossrefQueue from "../queues/crossrefQueue";
import { doiPattern } from "../libraries/utilities";
import {
    RESOLVE_IMPORT_DOIS,
    PUBLICATION_FROM_DOI,
    PUBLICATION_FROM_CITER_METADATA,
    PUBLICATION_FROM_IMPORTED_METADATA,
    REMOVE_PUBLICATION,
    RESOLVE_IMPORT_BIBTEX,
} from "../constants/actionTypes";
import {
    CROSSREF_REQUEST_TYPE_VALIDATION,
    CROSSREF_REQUEST_TYPE_CITER_METADATA,
    CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
} from "../constants/enums";

export default function crossref(
    state = {
        requests: [],
        status: crossrefQueue.status.IDLE,
    },
    action,
    appState
) {
    state = crossrefQueue.reduce(state, action);
    switch (action.type) {
        case RESOLVE_IMPORT_DOIS: {
            const foundDois = new Set();
            return {
                ...state,
                requests: [
                    ...state.requests,
                    ...action.dois
                        .map(rawDoi => doiPattern.exec(rawDoi))
                        .filter(match => match != null)
                        .map(match => match[1].toLowerCase())
                        .filter(
                            doi =>
                                !foundDois.has(doi) &&
                                !appState.publications.has(doi)
                        )
                        .map(doi => {
                            foundDois.add(doi);
                            return {
                                type: CROSSREF_REQUEST_TYPE_VALIDATION,
                                doi,
                            };
                        }),
                ],
            };
        }
        case PUBLICATION_FROM_DOI: {
            const doi = action.doi.toLowerCase();
            if (appState.publications.has(doi)) {
                return state;
            }
            return {
                ...state,
                requests: [
                    ...state.requests,
                    {
                        type: CROSSREF_REQUEST_TYPE_VALIDATION,
                        doi,
                    },
                ],
            };
        }
        case PUBLICATION_FROM_CITER_METADATA:
            return {
                ...state,
                requests: [
                    ...state.requests,
                    {
                        type: CROSSREF_REQUEST_TYPE_CITER_METADATA,
                        parentDoi: action.parentDoi,
                        title: action.title,
                        authors: action.authors,
                        dateAsString: action.dateAsString,
                    },
                ],
            };
        case PUBLICATION_FROM_IMPORTED_METADATA:
            return {
                ...state,
                requests: [
                    ...state.requests,
                    {
                        type: CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
                        title: action.title,
                        authors: action.authors,
                        dateAsString: action.dateAsString,
                    },
                ],
            };
        case REMOVE_PUBLICATION:
            return {
                ...state,
                requests: state.requests.filter(
                    (request, index) =>
                        request.type !== CROSSREF_REQUEST_TYPE_CITER_METADATA ||
                        request.parentDoi !== action.doi ||
                        (index === 0 &&
                            state.status !== crossrefQueue.status.IDLE)
                ),
            };
        case RESOLVE_IMPORT_BIBTEX:
            return {
                ...state,
                requests: [
                    ...state.requests,
                    ...action.publications.map(publication => {
                        return {
                            type: CROSSREF_REQUEST_TYPE_IMPORTED_METADATA,
                            title: publication.title,
                            authors: publication.authors,
                            dateAsString: publication.dateAsString,
                        };
                    }),
                ],
            };
        default:
            return state;
    }
}

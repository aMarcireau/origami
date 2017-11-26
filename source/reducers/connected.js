import {
    CONNECT,
    DISCONNECT,
    REJECT_SCHOLAR_CONNECTION,
    REJECT_PUBLICATION_FROM_DOI_CONNECTION,
    REJECT_PUBLICATION_FROM_METADATA_CONNECTION,
    REJECT_BIBTEX_FROM_DOI_CONNECTION,
    SCHOLAR_DISCONNECT,
} from '../constants/actionTypes'

export default function connected(state = false, action) {
    switch (action.type) {
        case CONNECT:
            return true;
        case DISCONNECT:
        case REJECT_SCHOLAR_CONNECTION:
        case REJECT_PUBLICATION_FROM_DOI_CONNECTION:
        case REJECT_PUBLICATION_FROM_METADATA_CONNECTION:
        case REJECT_BIBTEX_FROM_DOI_CONNECTION:
        case SCHOLAR_DISCONNECT:
            return false;
        default:
            return state;
    }
}

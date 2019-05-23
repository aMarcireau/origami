import {
    CONNECT,
    DISCONNECT,
    REJECT_SCHOLAR_CONNECTION,
    SCHOLAR_DISCONNECT,
} from '../constants/actionTypes'

export default function connected(state = false, action) {
    switch (action.type) {
        case CONNECT:
            return true;
        case DISCONNECT:
        case REJECT_SCHOLAR_CONNECTION:
        case SCHOLAR_DISCONNECT:
            return false;
        default:
            return state;
    }
}

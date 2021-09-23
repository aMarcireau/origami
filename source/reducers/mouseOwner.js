import { ACQUIRE_MOUSE, RELEASE_MOUSE } from "../constants/actionTypes";

export default function mouseOwner(state = null, action) {
    switch (action.type) {
        case ACQUIRE_MOUSE:
            return action.id;
        case RELEASE_MOUSE:
            return null;
        default:
            return state;
    }
}

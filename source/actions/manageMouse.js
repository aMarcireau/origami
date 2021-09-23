import { ACQUIRE_MOUSE, RELEASE_MOUSE } from "../constants/actionTypes";

export function acquireMouse(id) {
    return {
        type: ACQUIRE_MOUSE,
        id,
    };
}

export function releaseMouse() {
    return { type: RELEASE_MOUSE };
}

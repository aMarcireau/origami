import { SELECT_PUBLICATION } from "../constants/actionTypes";

export default function knownDois(state = new Set(), action) {
    switch (action.type) {
        case SELECT_PUBLICATION:
            if (state.has(action.doi)) {
                return state;
            }
            const newState = new Set(state);
            newState.add(action.doi);
            return newState;
        default:
            return state;
    }
}

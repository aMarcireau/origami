import { SET_SEARCH } from "../constants/actionTypes";

export default function search(state = "", action) {
    switch (action.type) {
        case SET_SEARCH:
            return action.search;
        default:
            return state;
    }
}

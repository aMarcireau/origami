import { SELECT_TAB } from "../constants/actionTypes";

export function selectTab(index) {
    return {
        type: SELECT_TAB,
        index,
    };
}

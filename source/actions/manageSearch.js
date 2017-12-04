import {
    SET_SEARCH
} from '../constants/actionTypes'

export function setSearch(search) {
    return {
        type: SET_SEARCH,
        search,
    };
}

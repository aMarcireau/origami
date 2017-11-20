import {
    REMOVE_WARNING,
    REMOVE_ALL_WARNINGS,
} from '../constants/actionTypes'

export function removeWarning(warningIndex) {
    return {
        type: REMOVE_WARNING,
        warningIndex,
    };
}

export function removeAllWarnings() {
    return {type: REMOVE_ALL_WARNINGS};
}

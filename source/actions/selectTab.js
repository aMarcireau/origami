import {
    SELECT_INFORMATION_TAB,
    SELECT_WARNINGS_TAB,
} from '../constants/actionTypes'

export function selectInformationTab() {
    return {type: SELECT_INFORMATION_TAB};
}

export function selectWarningsTab() {
    return {type: SELECT_WARNINGS_TAB};
}

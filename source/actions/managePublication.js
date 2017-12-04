import {
    ADD_PUBLICATION_TO_COLLECTION,
    SELECT_PUBLICATION,
    UNSELECT_PUBLICATION,
    REMOVE_PUBLICATION,
    UPDATE_PUBLICATION,
    UPDATE_ALL_PUBLICATIONS,
} from '../constants/actionTypes'

export function addPublicationToCollection(doi, timestamp, bibtexRequestId) {
    return {
        type: ADD_PUBLICATION_TO_COLLECTION,
        doi,
        timestamp,
        bibtexRequestId,
    };
}

export function selectPublication(doi) {
    return {
        type: SELECT_PUBLICATION,
        doi,
    };
}

export function unselectPublication() {
    return {type: UNSELECT_PUBLICATION};
}

export function removePublication(doi) {
    return {
        type: REMOVE_PUBLICATION,
        doi,
    };
}

export function updatePublication(doi, timestamp) {
    return {
        type: UPDATE_PUBLICATION,
        doi,
        timestamp,
    };
}

export function updateAllPublications(timestamp) {
    return {
        type: UPDATE_ALL_PUBLICATIONS,
        timestamp,
    };
}

export function isOlderThan(firstDate, secondDate) {
    const firstIsNull = firstDate == null || firstDate.length == 0 || (firstDate.length == 1 && firstDate[0] == null);
    const secondIsNull = secondDate == null || secondDate.length == 0 || (secondDate.length == 1 && secondDate[0] == null);
    if (firstIsNull && secondIsNull) {
        throw new Error('isOlderThan was called with two null dates');
    }
    if (firstIsNull) {
        return false;
    }
    if (secondIsNull) {
        return true;
    }
    let isOlder = false;
    firstDate.every((part, index) => {
        if (index >= secondDate.length) {
            return false;
        }
        if (part != secondDate[index]) {
            isOlder = (part < secondDate[index]);
            return false;
        }
        return true;
    });
    return isOlder;
}

export function pad(number) {
    return (number < 10 ? '0' + number.toString() : number.toString());
}

export const doiPattern = /^\s*(?:https?:\/\/doi\.org\/)?(10\.[0-9]{4,}(?:\.[0-9]+)*\/(?:(?![%"#? ])\S)+)\s*$/;

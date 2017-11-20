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

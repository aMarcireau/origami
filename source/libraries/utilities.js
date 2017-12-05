/// smallestOfThreePlusOne is used to calculate the Levenshtein distance.
export function smallestOfThreePlusOne(first, second, third, incrementSecondIfSmallest) {
    return (first < second || third < second ?
        (first > third ? third + 1 : first + 1)
        : (incrementSecondIfSmallest ? second : second + 1)
    );
}

/// levenshteinDistance returns the levenshteinDistance between the given strings.
/// first and second must be strings.
export function levenshteinDistance(first, second) {
    if (first === second) {
        return 0;
    }
    if (first.length > second.length) {
        [first, second] = [second, first];
    }
    let firstLength = first.length;
    let secondLength = second.length;
    while (firstLength > 0 && (first.charCodeAt(firstLength - 1) === second.charCodeAt(secondLength - 1))) {
        firstLength--;
        secondLength--;
    }
    let offset = 0;
    while (offset < firstLength && (first.charCodeAt(offset) === second.charCodeAt(offset))) {
        offset++;
    }
    firstLength -= offset;
    secondLength -= offset;
    if (firstLength === 0 || secondLength === 1) {
        return secondLength;
    }
    const distances = new Array(firstLength << 1);
    for (let y = 0; y < firstLength;) {
        distances[firstLength + y] = first.charCodeAt(offset + y);
        distances[y] = ++y;
    }
    let temporary0;
    let temporary1;
    let temporary2;
    let temporary3;
    let result;
    let x;
    for (x = 0; (x + 3) < secondLength;) {
        let secondX0 = second.charCodeAt(offset + (temporary0 = x));
        let secondX1 = second.charCodeAt(offset + (temporary1 = x + 1));
        let secondX2 = second.charCodeAt(offset + (temporary2 = x + 2));
        let secondX3 = second.charCodeAt(offset + (temporary3 = x + 3));
        result = (x += 4);
        for (let y = 0; y < firstLength;) {
            let firstY = first.charCodeAt(offset + y);
            let distanceY = distances[y];
            temporary0 = smallestOfThreePlusOne(distanceY, temporary0, temporary1, secondX0 === firstY);
            temporary1 = smallestOfThreePlusOne(temporary0, temporary1, temporary2, secondX1 === firstY);
            temporary2 = smallestOfThreePlusOne(temporary1, temporary2, temporary3, secondX2 === firstY);
            result = smallestOfThreePlusOne(temporary2, temporary3, result, secondX3 === firstY);
            distances[y++] = result;
            temporary3 = temporary2;
            temporary2 = temporary1;
            temporary1 = temporary0;
            temporary0 = distanceY;
        }
    }
    for (; x < secondLength;) {
        let secondX0 = second.charCodeAt(offset + (temporary0 = x));
        result = ++x;
        for (let y = 0; y < firstLength; y++) {
            let distanceY = distances[y];
            distances[y] = result = smallestOfThreePlusOne(distanceY, temporary0, result, secondX0 === distances[firstLength + y]);
            temporary0 = distanceY;
        }
    }
    return result;
}

/// isOlderThan returns true if the first date is strictly older than the second.
/// firstDate and secondDate must be arrays of one, two or three integers (year, month, date in that order).
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

/// pad properly formats a number for dates.
/// number must be an integer.
export function pad(number) {
    return (number < 10 ? '0' + number.toString() : number.toString());
}

/// doiPattern matches a Digital Object Identifier, with an optionnal 'https://doi.org/' prefix.
export const doiPattern = /^\s*(?:https?:\/\/doi\.org\/)?(10\.[0-9]{4,}(?:\.[0-9]+)*\/(?:(?![%"#? ])\S)+)\s*$/;

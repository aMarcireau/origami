import {
    CONNECT,
    DISCONNECT,
} from '../constants/actionTypes'

export function connect() {
    return {type: CONNECT};
}

export function disconnect() {
    return {type: DISCONNECT};
}

import {combineReducers} from 'redux'
import bibtexRequests from './bibtexRequests'
import connected from './connected'
import publicationRequests from './publicationRequests'
import graph from './graph'
import menu from './menu'
import mouseOwner from './mouseOwner'
import publications from './publications'
import scholar from './scholar'
import tabs from './tabs'
import version from './version'
import warnings from './warnings'
import {RESET} from '../constants/actionTypes'

function reduceReducers(...reducers) {
    return (state, action) => reducers.reduce(
        (newState, reducer) => reducer(newState, action),
        state
    );
}

export default function(state, action) {
    if (action.type === RESET) {
        if (action.state == null) {
            state = {
                appVersion: state.appVersion,
                colors: state.colors,
                connected: state.connected,
                menu: {
                    activeItem: null,
                    hash: state.menu.hash + 1,
                    saveFilename: null,
                    savedVersion: state.version + 1,
                    display: 0,
                },
                tabs: {
                    index: 0,
                    hash: state.tabs.hash + 1,
                },
                version: state.version + 1,
                warnings: {
                    list: [],
                    hash: state.warnings.hash + 1,
                },
            };
        } else {
            state = action.state;
        }
    }
    return reduceReducers(
        (state = {}, action) => {
            return {
                ...state,
                warnings: warnings(state.warnings, action, state),
            }
        },
        (state = {}, action) => {
            return {
                ...state,
                scholar: scholar(state.scholar, action, state),
            }
        },
        (state = {}, action) => {
            return {
                ...state,
                bibtexRequests: bibtexRequests(state.bibtexRequests, action, state),
            }
        },
        (state = {}, action) => {
            return {
                ...state,
                publicationRequests: publicationRequests(state.publicationRequests, action, state),
            }
        },
        (state = {}, action) => {
            return {
                ...state,
                publications: publications(state.publications, action, state),
            }
        },
        combineReducers({
            appVersion: (state = '0.0.0') => state,
            bibtexRequests: (state = new Map()) => state,
            colors: (state = {}) => state,
            connected,
            publicationRequests: (state = new Map()) => state,
            graph,
            menu,
            mouseOwner,
            publications: (state = new Map()) => state,
            scholar: (state = {}) => state,
            tabs,
            version,
            warnings: (state = {}) => state,
        }),
    )(state, action);
}

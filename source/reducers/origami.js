import {combineReducers} from 'redux'
import connected from './connected'
import crossref from './crossref'
import doi from './doi'
import knownDois from './knownDois'
import graph from './graph'
import menu from './menu'
import mouseOwner from './mouseOwner'
import publications from './publications'
import scholar from './scholar'
import search from './search'
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
            };
        },
        (state = {}, action) => {
            return {
                ...state,
                crossref: crossref(state.crossref, action, state),
            };
        },
        (state = {}, action) => {
            return {
                ...state,
                doi: doi(state.doi, action, state),
            };
        },
        (state = {}, action) => {
            return {
                ...state,
                scholar: scholar(state.scholar, action, state),
            };
        },
        (state = {}, action) => {
            return {
                ...state,
                publications: publications(state.publications, action, state),
            };
        },
        combineReducers({
            appVersion: (state = '0.0.0') => state,
            colors: (state = {}) => state,
            connected,
            crossref: (state = {}) => state,
            doi: (state = {}) => state,
            knownDois,
            graph,
            menu,
            mouseOwner,
            publications: (state = new Map()) => state,
            scholar: (state = {}) => state,
            search,
            tabs,
            version,
            warnings: (state = {}) => state,
        }),
        (state = {}, action) => {
            if (process.env.ORIGAMI_ENV === 'development') {
                console.log(action.type, action, state);
            }
            return state;
        }
    )(state, action);
}

import { resetState } from "../state";
import { combineReducers } from "redux";
import connected from "./connected";
import crossref from "./crossref";
import doi from "./doi";
import knownDois from "./knownDois";
import graph from "./graph";
import menu from "./menu";
import mouseOwner from "./mouseOwner";
import publications from "./publications";
import scholar from "./scholar";
import search from "./search";
import tabs from "./tabs";
import version from "./version";
import warnings from "./warnings";
import { RESET } from "../constants/actionTypes";

function reduceReducers(...reducers) {
    return (state, action) =>
        reducers.reduce(
            (newState, reducer) => reducer(newState, action),
            state
        );
}

export default function (state, action) {
    if (action.type === RESET) {
        if (action.state == null) {
            state = resetState(state);
        } else {
            state = action.state;
        }
    }
    const appState = state;
    return reduceReducers(
        (state = {}, action) => {
            return {
                ...state,
                crossref: crossref(state.crossref, action, appState),
            };
        },
        (state = {}, action) => {
            return {
                ...state,
                doi: doi(state.doi, action, appState),
            };
        },
        (state = {}, action) => {
            return {
                ...state,
                publications: publications(
                    state.publications,
                    action,
                    appState
                ),
            };
        },
        (state = {}, action) => {
            return {
                ...state,
                scholar: scholar(state.scholar, action, appState),
            };
        },
        (state = {}, action) => {
            return {
                ...state,
                warnings: warnings(state.warnings, action, appState),
            };
        },
        combineReducers({
            appVersion: (state = "0.0.0") => state,
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
            if (process.env.ORIGAMI_ENV === "development") {
                console.log(action.type, appState, action, state);
            }
            return state;
        }
    )(state, action);
}

import {ipcRenderer} from 'electron'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {
    createStore,
    applyMiddleware,
} from 'redux'
import thunk from 'redux-thunk'
import origamiReducers from './reducers/origami'
import origamiActors from './actors/origami'
import Origami from './containers/Origami'
import {disconnect} from './actions/setConnection'
import {jsonToState} from './actions/manageMenu'
import {SCHOLAR_STATUS_IDLE} from './constants/enums'

ipcRenderer.once('startWithState', (event, json, appVersion, colors) => {

    // retrieve the preloaded state
    let [error, preloadedState] = jsonToState(json, null, null);
    if (error != null && json != null) {
        console.error(error);
    }
    if (preloadedState == null) {
        preloadedState = {};
    }
    preloadedState.appVersion = appVersion;
    preloadedState.colors = JSON.parse(colors);

    // create the store
    const store = createStore(
        origamiReducers,
        preloadedState,
        applyMiddleware(thunk)
    );

    // bind the actors to the store
    origamiActors(store);

    // render the app
    render(
        <Provider store={store}>
            <Origami />
        </Provider>,
        document.getElementById('root')
    );

    // dispatch the disconnect action to initialize the app
    store.dispatch(disconnect());
});

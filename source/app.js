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

ipcRenderer.once('startWithState', (event, data) => {

    // retrieve the preloaded state
    const [error, preloadedState] = jsonToState(data, null, null);
    if (error != null && data != null) {
        console.error(error);
    }

    // create the store
    const store = createStore(
        origamiReducers,
        preloadedState == null ? {} : preloadedState,
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

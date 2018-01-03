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
import {
    jsonToState,
    stateToJson
} from './state'
import {SCHOLAR_STATUS_IDLE} from './constants/enums'

/// boot starts the app with the given default state.
function boot(preloadedState) {

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
}

ipcRenderer.once('startWithState', (event, json, appVersion, colors) => {
    if (json) {
        const [error, modified, preloadedState] = jsonToState(json, null, null);
        if (error) {
            ipcRenderer.once('backedup', (event, moveFailed, saveFailed, filename) => {
                if (moveFailed) {
                    boot({
                        appVersion,
                        colors: JSON.parse(colors),
                        warnings: {
                            list: [
                                {
                                    title: 'Loading the auto-save failed',
                                    subtitle: 'Creating a backup failed as well',
                                    level: 'error',
                                },
                            ],
                            hash: 0,
                        },
                        tab: 2,
                    });
                } else {
                    boot({
                        appVersion,
                        colors: JSON.parse(colors),
                        warnings: {
                            list: [
                                {
                                    title: 'Loading the auto-save failed',
                                    subtitle: `A backup was saved to '${filename}'`,
                                    level: 'error',
                                },
                            ],
                            hash: 0,
                        },
                        tabs: 2,
                    });
                }
            });
            ipcRenderer.send('backup', null, JSON.stringify({publications: []}));
        } else if (modified) {
            ipcRenderer.once('backedup', (event, moveFailed, saveFailed, filename) => {
                if (moveFailed) {
                    boot({
                        ...preloadedState,
                        appVersion,
                        colors: JSON.parse(colors),
                        warnings: {
                            ...preloadedState.warnings,
                            list: [
                                ...preloadedState.warnings.list,
                                {
                                    title: 'The auto-save was updated',
                                    subtitle: 'Creating a backup failed',
                                    level: 'error',
                                },
                            ],
                        },
                        tabs: 2,
                    });
                } else {
                    boot({
                        ...preloadedState,
                        appVersion,
                        colors: JSON.parse(colors),
                        warnings: {
                            ...preloadedState.warnings,
                            list: [
                                ...preloadedState.warnings.list,
                                {
                                    title: 'The auto-save was updated',
                                    subtitle: `A backup was saved to '${filename}'`,
                                    level: 'warning',
                                },
                            ],
                        },
                    });
                }
            });
            ipcRenderer.send('backup', null, stateToJson(preloadedState, false));
        } else {
            boot({
                ...preloadedState,
                appVersion,
                colors: JSON.parse(colors),
            });
        }
    } else {
        boot({
            appVersion,
            colors: JSON.parse(colors),
        });
    }
});

/// queue returns a new request queue manager, with custom actions.
///    name (string): the queue manager name (capital letters)
///    stateKey (string): the reducer's key in the combined state
///    enabled (state object) => bool: function returning true if fetching is allowed
///    fetch (request object) => null: function handling the next request
///    popActions (strings enumerable): actions types triggering the removal of the current request
export default function queue(name, stateKey, enabled, fetch, popActions) {
    const popActionsSet = new Set(popActions);
    const generatedQueue = {
        status: {
            IDLE: `${name}_STATUS_IDLE`,
            FETCHING: `${name}_STATUS_FETCHING`,
        },
        actionTypes: {
            FETCH: `${name}_FETCH`,
            REJECT_CONNECTION: `${name}_REJECT_CONNECTION`,
        },
        actions: {
            fetch: () => {
                return {type: generatedQueue.actionTypes.FETCH};
            },
            rejectConnection: () => {
                return {type: generatedQueue.actionTypes.REJECT_CONNECTION};
            },
        },
        actor: store => {
            const state = store.getState();
            if (
                state[stateKey].status === generatedQueue.status.IDLE
                && state[stateKey].requests.length > 0
                && enabled(state)
            ) {
                store.dispatch(generatedQueue.actions.fetch());
                fetch(state[stateKey].requests[0], store);
            }
        },
        reduce: (state, action) => {
            if (popActionsSet.has(action.type)) {
                return {
                    ...state,
                    status: generatedQueue.status.IDLE,
                    requests: state.requests.slice(1),
                };
            }
            switch (action.type) {
                case generatedQueue.actionTypes.FETCH:
                    return {
                        ...state,
                        status: generatedQueue.status.FETCHING,
                    };
                case generatedQueue.actionTypes.REJECT_CONNECTION:
                    return {
                        ...state,
                        status: generatedQueue.status.IDLE,
                    };
                default:
                    return state;
            }
        },
    };
    return generatedQueue;
}

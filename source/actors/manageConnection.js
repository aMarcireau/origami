import {
    connect,
} from '../actions/setConnection'

let polling = false;

export default function manageConnection(store) {
    const state = store.getState();
    if (!state.connected && !polling) {
        polling = true;
        const poll = () => {
            fetch('https://scholar.google.com/favicon.ico', {
                method: 'GET',
                headers: new Headers({
                    'pragma': 'no-cache',
                    'cache-control': 'no-cache',
                }),
            })
                .then(response => {
                    polling = false;
                    store.dispatch(connect());
                })
                .catch(() => {
                    window.setTimeout(poll, 1000);
                })
            ;
        };
        window.setTimeout(poll, 1000);
    }
}

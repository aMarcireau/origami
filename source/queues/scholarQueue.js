import queue from '../libraries/queue'
import {
    resolveHtml,
    rejectScholarConnection,
} from '../actions/manageScholar'

const scholarQueue = queue(
    'SCHOLAR',
    'scholar',
    state => state.connected && state.scholar.endOfRefractoryPeriod === null,
    (request, store) => {
        fetch(request.url, {credentials: 'include'})
            .then(response => {
                response.text()
                    .then(text => {
                        store.dispatch(resolveHtml(response.url, text));
                    })
                ;
            })
            .catch(error => {
                store.dispatch(scholarQueue.actions.rejectConnection());
            })
        ;
    },
    []
);

export default scholarQueue;

import {
    fetchScholarPage,
    resolveHtml,
    rejectScholarConnection,
} from '../actions/manageScholarPage'
import {
    SCHOLAR_STATUS_IDLE,
} from '../constants/enums'

export default function manageScholar(store) {
    const state = store.getState();
    if (
        state.connected
        && state.scholar.status === SCHOLAR_STATUS_IDLE
        && state.scholar.endOfRefractoryPeriod === null
        && state.scholar.pages.length > 0
    ) {
        store.dispatch(fetchScholarPage());
        fetch(state.scholar.pages[0].url, {credentials: 'include'})
            .then(response => {
                response.text()
                    .then(text => {
                        store.dispatch(resolveHtml(response.url, text));
                    })
                ;
            })
            .catch(error => {
                store.dispatch(rejectScholarConnection());
            })
        ;
    }
}

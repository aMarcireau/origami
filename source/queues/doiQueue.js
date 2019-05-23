import queue from '../libraries/queue'
import {RESOLVE_BIBTEX_FROM_DOI} from '../constants/actionTypes'
import {resolveBibtexFromDoi} from '../actions/manageDoi'

const doiQueue = queue(
    'DOI',
    'doi',
    state => state.connected,
    (request, store) => {
        fetch(
            `https://dx.doi.org/${request.doi}`,
            {
                headers: new Headers({
                    'Accept': 'text/bibliography; style=bibtex',
                })
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response;
            })
            .then(response => response.text())
            .then(rawText => {
                const text = rawText.trim();
                let bibtex = '';
                let nesting = 0;
                for (const character of text) {
                    switch (character) {
                        case '{':
                            ++nesting;
                            bibtex += character;
                            break;
                        case '}':
                            --nesting;
                            if (nesting === 0) {
                                bibtex += ',\n}';
                            } else {
                                bibtex += character;
                            }
                            break;
                        case ',':
                            if (nesting < 2) {
                                bibtex += ',\n   ';
                            } else {
                                bibtex += character;
                            }
                            break;
                        case '%':
                            bibtex += '\\%';
                            break;
                        default:
                            bibtex += character;
                            break;
                    }
                }
                store.dispatch(resolveBibtexFromDoi(
                    request.doi,
                    bibtex + '\n'
                ));
            })
            .catch(error => {
                console.error(error);
                store.dispatch(doiQueue.actions.rejectConnection());
            })
        ;
    },
    [RESOLVE_BIBTEX_FROM_DOI],
);

export default doiQueue;

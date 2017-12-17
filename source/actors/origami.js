import crossrefQueue from '../queues/crossrefQueue'
import doiQueue from '../queues/doiQueue'
import scholarQueue from '../queues/scholarQueue'
import manageConnection from './manageConnection'
import managePlaceholderColor from './managePlaceholderColor'
import manageVersion from './manageVersion'

export default function origami(store) {
    for (const actor of [
        crossrefQueue.actor,
        doiQueue.actor,
        scholarQueue.actor,
        manageConnection,
        managePlaceholderColor,
        manageVersion,
    ]) {
        store.subscribe(() => {
            actor(store);
        });
    }
}

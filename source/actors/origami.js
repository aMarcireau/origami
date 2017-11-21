import manageScholar from './manageScholar'
import manageConnection from './manageConnection'
import manageCrossref from './manageCrossref'
import managePlaceholderColor from './managePlaceholderColor'
import manageVersion from './manageVersion'

export default function origami(store) {
    for (const actor of [
        manageScholar,
        manageConnection,
        manageCrossref,
        managePlaceholderColor,
        manageVersion,
    ]) {
        store.subscribe(() => {
            actor(store);
        });
    }
}

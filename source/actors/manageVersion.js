import {ipcRenderer} from 'electron'
import {stateToJson} from '../state'

let inhibited = false;
let bufferedState = null;
let autosaveVersion = 0;
let autosaveFilename = null;
let titleFilename = null;
let titleEdited = true;

function saveState(state) {
    if (inhibited) {
        bufferedState = state;
    } else {
        inhibited = true;
        ipcRenderer.once('saved', () => {
            inhibited = false;
            if (bufferedState !== null) {
                saveState(bufferedState);
                bufferedState = null;
            }
        });
        ipcRenderer.send('save', stateToJson(state, false));
    }
}

export default function manageVersion(store) {
    const state = store.getState();
    if (state.version > autosaveVersion || state.menu.saveFilename !== autosaveFilename) {
        autosaveVersion = state.version;
        autosaveFilename = state.menu.saveFilename;
        saveState(state);
    }
    const newTitleEdited = state.version > state.menu.savedVersion;
    if (
        titleFilename != state.menu.saveFilename
        || titleEdited != newTitleEdited
    ) {
        ipcRenderer.send('set-title', state.menu.saveFilename, newTitleEdited);
        titleFilename = state.menu.saveFilename;
        titleEdited = newTitleEdited;
    }
}

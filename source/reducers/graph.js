import {
    SET_GRAPH_THRESHOLD,
    SET_GRAPH_ZOOM_AND_OFFSET,
    ENABLE_STICKY_GRAPH,
    DISABLE_STICKY_GRAPH,
} from '../constants/actionTypes'

export default function graphZoom(state = {
    threshold: 1,
    zoom: 0,
    xOffset: 0,
    yOffset: 0,
    sticky: false,
}, action) {
    switch (action.type) {
        case SET_GRAPH_THRESHOLD:
            return {
                ...state,
                threshold: action.threshold,
            }
        case SET_GRAPH_ZOOM_AND_OFFSET:
            return {
                ...state,
                zoom: action.zoom,
                xOffset: action.xOffset,
                yOffset: action.yOffset,
            };
        case ENABLE_STICKY_GRAPH:
            return {
                ...state,
                sticky: true,
            };
        case DISABLE_STICKY_GRAPH:
            return {
                ...state,
                sticky: false,
            };
        default:
            return state;
    }
}

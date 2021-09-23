import {
    SET_GRAPH_THRESHOLD,
    SET_GRAPH_ZOOM_AND_OFFSET,
    ENABLE_STICKY_GRAPH,
    DISABLE_STICKY_GRAPH,
    STORE_GRAPH_NODES,
    LOCK_GRAPH_NODE,
    RELEASE_GRAPH_NODE,
} from "../constants/actionTypes";

export function setGraphThreshold(threshold) {
    return {
        type: SET_GRAPH_THRESHOLD,
        threshold,
    };
}

export function setGraphZoomAndOffset(zoom, xOffset, yOffset) {
    return {
        type: SET_GRAPH_ZOOM_AND_OFFSET,
        zoom,
        xOffset,
        yOffset,
    };
}

export function enableStickyGraph() {
    return { type: ENABLE_STICKY_GRAPH };
}

export function disableStickyGraph() {
    return { type: DISABLE_STICKY_GRAPH };
}

export function storeGraphNodes(nodes) {
    return {
        type: STORE_GRAPH_NODES,
        nodes,
    };
}

export function lockGraphNode(doi, x, y) {
    return {
        type: LOCK_GRAPH_NODE,
        doi,
        x,
        y,
    };
}

export function releaseGraphNode(doi) {
    return {
        type: RELEASE_GRAPH_NODE,
        doi,
    };
}

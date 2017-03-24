
const GRAPH = {
  ADD_NODE: 'GRAPH_ADD_NODE',
  MOVE_NODE: 'GRAPH_MOVE_NODE',
  UPDATE_NODE: 'GRAPH_UPDATE_NODE',
  DELETE_NODE: 'GRAPH_DELETE_NODE',
  UPDATE_VARIABLE: 'GRAPH_UPDATE_VARIABLE',
  REMOVE_VARIABLE: 'GRAPH_REMOVE_VARIABLE',
  ADD_LINK: 'GRAPH_ADD_LINK',
  REMOVE_LINK: 'GRAPH_REMOVE_LINK',
  ADD_SELECTED: 'GRAPH_ADD_SELECTED_$',
  REMOVE_SELECTED: 'GRAPH_REMOVE_SELECTED_$',
  PAN: 'GRAPH_PAN_$',
  ZOOM: 'GRAPH_ZOOM_$',
  ZOOM_IN: 'GRAPH_ZOOM_IN_$',
  ZOOM_OUT: 'GRAPH_ZOOM_OUT_$',
  COPY: 'GRAPH_COPY_$',
  PASTE: 'GRAPH_PASTE'
};
export default GRAPH;

export const addNode = (nodeObject) => {
  return {
    type: GRAPH.ADD_NODE,
    payload: nodeObject
  }
};

export const updateNode = (nodeObject) => {
  return {
    type: GRAPH.UPDATE_NODE,
    payload: nodeObject
  }
};

export const addLink = (linkObject, targetNid, targetPort) => {
  return {
    type: GRAPH.ADD_LINK,
    payload: {
      linkObject,
      targetNid,
      targetPort
    }
  }
};

export const removeLink = (linkId, targetNid, targetPort) => {
  return {
    type: GRAPH.REMOVE_LINK,
    payload: {
      linkId,
      targetNid,
      targetPort
    }
  }
};

export const updateVariable = (nid, newVariableName) => {
  return {
    type: GRAPH.UPDATE_VARIABLE,
    payload: { nid, newVariableName}
  }
};

export const removeVariable = (nid) => {
  return {
    type: GRAPH.REMOVE_VARIABLE,
    payload: { nid }
  }
};

export const moveNode = (nid, x, y) => {
  return {
    type: GRAPH.MOVE_NODE,
    nid,
    x,
    y
  }
};

export const pan = (x, y) => {
  return {
    type: GRAPH.PAN,
    payload: {
      x,
      y
    }
  }
};

export const zoom = (scale, panX, panY) => {
  return {
    type: GRAPH.ZOOM,
    payload: {scale, panX, panY}
  }
};

export const zoomIn = () => {
  return {
    type: GRAPH.ZOOM_IN
  }
};

export const zoomOut = () => {
  return {
    type: GRAPH.ZOOM_OUT
  }
};

export const addSelected = (nid) => {
  return {
    type: GRAPH.ADD_SELECTED,
    payload: { nid }
  }
};

export const removeSelected = (nid) => {
  return {
    type: GRAPH.REMOVE_SELECTED,
    payload: { nid }
  }
};

export const copy = () => {
  return {
    type: GRAPH.COPY
  }
};

export const paste = () => {
  return {
    type: GRAPH.PASTE
  }
};


/**
 * Remove node from graph
 * @param id
 * @returns {{type: string, payload: *: *}}
 */
export const deleteNode = (id) => {
  return {
    type: GRAPH.DELETE_NODE,
    payload: id
  }
};

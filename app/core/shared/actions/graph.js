
const GRAPH = {
  ADD_NODE: 'GRAPH_ADD_NODE',
  ADD_NODE_AND_UPDATE_VARIABLES: 'GRAPH_ADD_NODE_AND_UPDATE_VARIABLES',
  MOVE_NODE: 'GRAPH_MOVE_NODE',
  MOVE_NODES: 'GRAPH_MOVE_NODES',
  UPDATE_NODE: 'GRAPH_UPDATE_NODE',
  DELETE_NODE: 'GRAPH_DELETE_NODE',
  DELETE_NODES: 'GRAPH_DELETE_NODES',
  UPDATE_VARIABLE: 'GRAPH_UPDATE_VARIABLE',
  UPDATE_VARIABLES: 'GRAPH_UPDATE_VARIABLES',
  REMOVE_VARIABLE: 'GRAPH_REMOVE_VARIABLE',
  ADD_LINK: 'GRAPH_ADD_LINK',
  ADD_LINK_AND_UPDATE_VARIABLES: 'GRAPH_ADD_LINK_AND_UPDATE_VARIABLES',
  REMOVE_LINK: 'GRAPH_REMOVE_LINK',
  REMOVE_LINK_AND_VARIABLES: 'GRAPH_REMOVE_LINK_AND_VARIABLES',
  ADD_SELECTED: 'GRAPH_ADD_SELECTED_$',
  REMOVE_SELECTED: 'GRAPH_REMOVE_SELECTED_$',
  PAN: 'GRAPH_PAN_$',
  ZOOM: 'GRAPH_ZOOM_$',
  ZOOM_IN: 'GRAPH_ZOOM_IN_$',
  ZOOM_OUT: 'GRAPH_ZOOM_OUT_$',
  COPY: 'GRAPH_COPY_$',
  CUT: 'GRAPH_CUT_$',
  PASTE: 'GRAPH_PASTE'
};
export default GRAPH;

export const addNode = (nodeObject) => {
  return {
    type: GRAPH.ADD_NODE,
    payload: nodeObject
  }
};

export const addNodeAndUpdateVariables = (variables, nodeObject) => {
  return {
    type: GRAPH.ADD_NODE_AND_UPDATE_VARIABLES,
    payload: {
      nodeObject,
      variables
    }
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

export const onLinkAddAndUpdateVariables = (variables, linkObject, targetNid, targetPort) => {
  return {
    type: GRAPH.ADD_LINK_AND_UPDATE_VARIABLES,
    payload: {
      variables,
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

/**
 * Batch action for removing multiple variables and link.
 *
 * @param {array} variables
 * @param {string} linkId
 * @param {string} targetNid
 * @param {string} targetPort
 * @returns {{type: string, payload: {variables: array, linkId: string, targetNid: string, targetPort: string}}}
 */
export const removeLinkAndVariables = (variables, linkId, targetNid, targetPort) => {
  return {
    type: GRAPH.REMOVE_LINK_AND_VARIABLES,
    payload: {
      variables,
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

/**
 * Batch action for updating variables on multiple nodes
 *
 * @param {Object[]} nodes List of objects {nid, newVariableName}
 * @returns {{type: string, payload: *}}
 */
export const updateVariables = (nodes) => {
  return {
    type: GRAPH.UPDATE_VARIABLES,
    payload: nodes
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
    payload: {
      nid,
      x,
      y
    }
  }
};

/**
 * Batch action which move multiple nodes
 * @param {Object[]} nodes - List of objects {nid, x, y}
 */
export const moveNodes = (nodes) => {
  return {
    type: GRAPH.MOVE_NODES,
    payload: {
      nodes
    }
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

export const cut = () => {
  return {
    type: GRAPH.CUT
  }
};

export const paste = () => {
  return {
    type: GRAPH.PASTE
  }
};


/**
 * Remove node from graph
 * @param nid
 * @returns {{type: string, payload: *: *}}
 */
export const deleteNode = (nid) => {
  return {
    type: GRAPH.DELETE_NODE,
    payload: {
      nid
    }
  }
};

export const deleteNodes = (nodes) => {
  return {
    type: GRAPH.DELETE_NODES,
    payload: {
      nodes
    }
  }
};

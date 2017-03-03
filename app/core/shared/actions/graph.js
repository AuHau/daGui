
const GRAPH = {
  ADD_NODE: 'GRAPH_ADD_NODE',
  MOVE_NODE: 'GRAPH_MOVE_NODE',
  UPDATE_NODE: 'GRAPH_UPDATE_NODE',
  DELETE_NODE: 'GRAPH_DELETE_NODE',
  UPDATE_VARIABLE: 'GRAPH_UPDATE_VARIABLE',
  REMOVE_VARIABLE: 'GRAPH_REMOVE_VARIABLE',
  ADD_LINK: 'GRAPH_ADD_LINK',
  REMOVE_LINK: 'GRAPH_REMOVE_LINK',
  PAN: 'GRAPH_PAN',
  ZOOM: 'GRAPH_ZOOM'
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

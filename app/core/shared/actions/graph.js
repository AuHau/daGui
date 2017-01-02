
const GRAPH = {
  ADD_NODE: 'GRAPH_ADD_NODE',
  MOVE_NODE: 'GRAPH_MOVE_NODE',
  UPDATE_NODE: 'GRAPH_UPDATE_NODE',
  DELETE_NODE: 'GRAPH_DELETE_NODE',
  UPDATE_VARIABLE: 'GRAPH_UPDATE_VARIABLE',
  REMOVE_VARIABLE: 'GRAPH_REMOVE_VARIABLE'
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

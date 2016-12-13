
const GRAPH = {
  ADD_NODE: 'GRAPH_ADD_NODE',
  MOVE_NODE: 'GRAPH_MOVE_NODE',
  UPDATE_NODE: 'GRAPH_UPDATE_NODE',
  UPDATE_LINK: 'GRAPH_UPDATE_LINK',
  DELETE_NODE: 'GRAPH_DELETE_NODE',
  DELETE_LINK: 'GRAPH_DELETE_LINK'
};
export default GRAPH;

export const addNode = (nodeObject) => {
  return {
    type: GRAPH.ADD_NODE,
    payload: nodeObject
  }
};

export const updateNode = (nid, nodeObject) => {
  return {
    type: GRAPH.UPDATE_NODE,
    payload: nodeObject,
    nid
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
 * Update link and if it is not exisiting it creates a new one
 * @param linkObject
 * @returns {{type: string, payload: *: *}}
 */
export const updateLink = (linkObject) => {
  return {
    type: GRAPH.UPDATE_LINK,
    payload: linkObject
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

/**
 * Remove link from graph
 * @param id
 * @returns {{type: string, payload: *: *}}
 */
export const deleteLink = (id) => {
  return {
    type: GRAPH.DELETE_LINK,
    payload: id
  }
};

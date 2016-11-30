
const GRAPH = {
  ADD_NODE: 'GRAPH_ADD_NODE',
  MOVE_NODE: 'GRAPH_MOVE_NODE',
  UPDATE_LINK: 'GRAPH_UPDATE_LINK',
  DELETE_LINK: 'GRAPH_DELETE_LINK'
};
export default GRAPH;

export const addNode = (nodeObject, activeFile) => {
  return {
    type: GRAPH.ADD_NODE,
    payload: nodeObject,
    activeFile
  }
};

export const moveNode = (nid, x, y, activeFile) => {
  return {
    type: GRAPH.MOVE_NODE,
    nid,
    x,
    y,
    activeFile
  }
};

/**
 * Update link and if it is not exisiting it creates a new one
 * @param linkObject
 * @param activeFile
 * @returns {{type: string, payload: *, activeFile: *}}
 */
export const updateLink = (linkObject, activeFile) => {
  return {
    type: GRAPH.UPDATE_LINK,
    payload: linkObject,
    activeFile
  }
};

/**
 * Remove link from graph
 * @param lid
 * @param activeFile int
 * @returns {{type: string, payload: *, activeFile: *}}
 */
export const deleteLink = (lid, activeFile) => {
  return {
    type: GRAPH.DELETE_LINK,
    payload: lid,
    activeFile
  }
};

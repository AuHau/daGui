
const GRAPH = {
  ADD_NODE: 'GRAPH_ADD_NODE',
  MOVE_NODE: 'GRAPH_MOVE_NODE'
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



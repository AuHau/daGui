
const GRAPH = {
  ADD_NODE: 'GRAPH_ADD_NODE'
};
export default GRAPH;

export const addNode = (nodeObject) => {
  return {
    type: GRAPH.ADD_NODE,
    nodeObject
  }
};

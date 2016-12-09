import md5 from 'js-md5';

export const normalizeGraph = (graphObject) => {
  const newGraphObject = {};

  graphObject['cells'].forEach((element) => {
    if (element.type == 'link') {
      newGraphObject[element.source.id].nextNodes.push(element.target.id);
    }else{
      newGraphObject[element.id] = {
        id: element.id,
        type: element.type,
        parameters: element.dfGui.parameters,
        nextNodes: []
      };
    }
  });

  return newGraphObject;
};

export function hashGraph(normalizedGraph) {
  if(normalizedGraph.hasOwnProperty('cells')){
    throw new TypeError("hashGraph has to get normalized graph from 'normalizeGraph' function!");
  }

  const filteredGraph = Object.values(normalizedGraph);
  // Order by IDs, so we have consistence string for hashing, as changed order would
  // change the hash
  filteredGraph.sort((a, b) => a.id.localeCompare(b.id));
  return md5(JSON.stringify(filteredGraph));
}

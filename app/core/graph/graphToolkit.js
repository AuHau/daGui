import md5 from 'js-md5';

export const normalizeGraph = (graphObject, isInputFnc) => {
  const normalizedGraph = {};
  const inputs = [];

  for(let element of graphObject['cells']) {
    if (element.type == 'link') {
      normalizedGraph[element.source.id].nextNodes.push(element.target.id);
      normalizedGraph[element.target.id].prevNodes.push({
        id: element.source.id,
        port: element.target.port,
        variable: null
      });
    } else {
      normalizedGraph[element.id] = {
        id: element.id,
        type: element.type,
        parameters: element.dfGui.parameters,
        variableName: element.dfGui.variableName,
        nextNodes: [],
        prevNodes: []
      };

      if (isInputFnc(element.type)) {
        inputs.push(normalizedGraph[element.id]);
      }
    }
  }

  return {
    normalizedGraph,
    inputs
  };
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

export function hashRawGraph(rawGraph){
  return md5(JSON.stringify(rawGraph));
}

export function serializeGraph($file){
  let output = '';

  output += 'adapter:' + $file.get('adapter').getId() + ':' + $file.get('adapterTarget');
  output += ';language:' + $file.get('language').getId() + ':' + $file.get('languageTarget');
  output += ';' + JSON.stringify($file.getIn(['history', 'present', 'cells']).toJS()).replace('\n', '');
  // TODO: [Optimalization] Filter out non-necessary data from cells (groups definitions, ports definitions etc).

  return output;
}

export function countInPorts(element){
  let count = 0;
  for(let port of element.portData.ports){
    if(port.group == 'in') count++;
  }

  return count;
}

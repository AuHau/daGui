import md5 from 'js-md5';
import ErrorType from 'shared/enums/ErrorType';
import ErrorLevel from 'shared/enums/ErrorLevel';
import joint from 'jointjs';

export function generateCode(codeBuilder, $currentFile, currentHash=null, regenerateOnlyOnChange=false){
  const language = $currentFile.get('language');
  const languageVersion = $currentFile.get('languageVersion');
  const adapter = $currentFile.get('adapter');
  const adapterVersion = $currentFile.get('adapterVersion');
  const graph = {cells: $currentFile.getIn(['history', 'present', 'cells']).toJS()};
  const usedVariables = $currentFile.getIn(['history', 'present', 'usedVariables']).toJS();

  const {normalizedGraph, inputs} = normalizeGraph(graph, adapter.isTypeInput);
  const newHash = hashGraph(normalizedGraph);
  const isGraphEmpty = !Object.keys(normalizedGraph).length;
  if(isGraphEmpty || (currentHash && regenerateOnlyOnChange && currentHash == newHash)){
    if (isGraphEmpty){
      codeBuilder.reset();
    }

    return null; // No graph's changes which are connected with code ===> don't re-generate the code OR there are no nodes...
  }
  currentHash = newHash;

  // TODO: Optimalization - drop JointJS graph dependency (use only normalized graph)
  const jointGraph = new joint.dia.Graph();
  jointGraph.fromJSON(graph);
  const errors = adapter.validateGraph(jointGraph, normalizedGraph, inputs, language);

  if(errors && errors.length){
    return {
      hash: currentHash,
      success: false,
      errors
    };
  }

  // TODO: Limit when the actual generation of code happens? App.js => generate only when showCodeView (Maybe splitting validation&generation)

  try {
    adapter.generateCode(codeBuilder, normalizedGraph, inputs, usedVariables, language, languageVersion,adapterVersion);
  } catch (e) {
    if (e.name == 'CircularDependency') {
      return {
        hash: currentHash,
        success: false,
        errors: [
          {
            id: null,
            type: ErrorType.DEPENDENCIES_CYCLE,
            description: e.message,
            level: ErrorLevel.ERROR,
            importance: 10
          }
        ]
      }
    } else {
      throw e;
    }
  }

  return {
    hash: currentHash,
    success: true
  }
}

export function normalizeGraph(graphObject, isInputFnc){
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
  // Filtering out unnecessary info
  const graph = $file.getIn(['history', 'present', 'cells']).toJS();
  for(let i = 0; i < graph.length; i++){
    delete graph[i].ports;

    if(graph[i].target)
      delete graph[i].target.selector;
    if(graph[i].source)
      delete graph[i].source.selector;
  }

  let output = '';
  output += 'adapter:' + $file.get('adapter').getId() + ':' + $file.get('adapterVersion');
  output += ';language:' + $file.get('language').getId() + ':' + $file.get('languageVersion');
  output += ';' + JSON.stringify(graph).replace('\n', '');

  return output;
}

export function countInPorts(element){
  let count = 0;
  for(let port of element.portData.ports){
    if(port.group == 'in') count++;
  }

  return count;
}

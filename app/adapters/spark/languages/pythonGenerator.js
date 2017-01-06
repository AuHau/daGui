import Python from 'languages/Python';
import CodeMarker from 'shared/enums/CodeMarker';
import detectDependencies from '../../utils/detectDependencies';

const IMPORT = 'from pyspark import SparkConf, SparkContext';
const INIT = ['conf = SparkConf()', 'sc = SparkContext(\'local\', \'test\', conf=conf)']; // TODO: SparkContext and SparkConf based on Running configuration

const INDENTATION = '    '; // TODO: Load from user's settings

export function processNode(output, node, prevNode, templates, graph, variableStack, afterOutBreak = false) {
  let generatedCode;

  if(node.prevNodes.length > 1){
    node.prevNodes.find(node => node.id == prevNode.id)['variable'] = variableStack.pop();

    if(node.prevNodes.find(node => !node.variable)){
      return; // Not all in-break dependencies are satisfied => backtrack
    }

    generatedCode = templates[node.type].generateCode(node.parameters, Python, node.prevNodes);

    output
      .breakLine()
      .startMarker()
      .add(node.variableName)
      .marker(node.id, CodeMarker.VARIABLE)
      .add(' = ' + generatedCode)
      .finishMarker(node.id)
      .breakLine();

    variableStack.push(node.variableName);

  }else{
    generatedCode = templates[node.type].generateCode(node.parameters, Python);

    if(afterOutBreak){
      output
        .breakLine()
        .startMarker()
        .add(node.variableName)
        .marker(node.id, CodeMarker.VARIABLE)
        .add(' = ' + variableStack.pop() + '.' + generatedCode)
        .finishMarker(node.id)
        .breakLine();

      variableStack.push(node.variableName);
    }else{
      output
        .add((prevNode ? INDENTATION : ''), '.' + generatedCode)
        .marker(node.id)
        .breakLine();
    }
  }

  // In case of out-break multiply the top var on variableStack
  if(node.nextNodes.length > 1){
    const multipliedVar = variableStack.pop();
    for(let i = 0; i < node.nextNodes.length; i++) variableStack.push(multipliedVar);

    output
      .add(INDENTATION, '.cache()')
      .breakLine();
  }

  if(!node.nextNodes.length){
    variableStack.pop();
    return;
  }

  for(let nextNode of node.nextNodes){
    processNode(output, graph[nextNode], node, templates, graph, variableStack, node.nextNodes.length > 1);
  }
}

export default function generatePython(output, adapter, normalizedGraph, inputs, usedVariables) {
  let {sortedInputs, dependencies} = detectDependencies(normalizedGraph, inputs, usedVariables, Python);
  const templates = adapter.getNodeTemplates();
  const variableStack = [];
  output.reset();

  output
    .add(IMPORT)
    .breakLine()
    .breakLine();

  output
    .add(INIT[0])
    .breakLine()
    .add(INIT[1])
    .breakLine()
    .breakLine();

  let markerIndex;
  for(let input of sortedInputs) {
    variableStack.push(input.variableName);

    markerIndex = output
      .startMarker()
      .add(input.variableName)
      .marker(input.id, CodeMarker.VARIABLE)
      .add(' = sc')
      .finishMarker(input.id)
      .getLastMarkerIndex();

    processNode(output, input, null, templates, normalizedGraph, variableStack);
    output.mergeMarkers(markerIndex, markerIndex+1);

    output.breakLine();
  }
};

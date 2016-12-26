import _ from 'lodash';
import Python from 'languages/Python';

const IMPORT = 'from pyspark import SparkConf, SparkContext';
const INIT = 'conf = SparkConf() \nsc = SparkContext(\'local\', \'test\', conf=conf)'; // TODO: SparkContext and SparkConf based on Running configuration

export function processNode(node, prevNode, templates, graph, variableStack, usedVariables, afterOutBreak = false) {
  let newNodeName, generatedCode, output = '';

  if(node.prevNodes.length > 1){
    node.prevNodes.find(node => node.id == prevNode.id)['variable'] = variableStack.pop();

    if(node.prevNodes.find(node => !node.variable)){
      return ''; // Not all in-break dependencies are satisfied => backtrack
    }

    generatedCode = templates[node.type].generateCode(node.parameters, Python, node.prevNodes);
    output = '\n' + node.variableName + ' = ' + generatedCode + '\n';
    variableStack.push(node.variableName);

  }else{
    generatedCode = templates[node.type].generateCode(node.parameters, Python);

    if(afterOutBreak){
      output = '\n' + node.variableName + ' = ' + variableStack.pop() + '.' + generatedCode + '\n';
      variableStack.push(node.variableName);
    }else{
      output = (prevNode ? '\t.' : '.') + generatedCode + '\n';
    }
  }

  // In case of out-break multiply the top var on variableStack
  if(node.nextNodes.length > 1){
    const multipliedVar = variableStack.pop();
    for(let i = 0; i < node.nextNodes.length; i++) variableStack.push(multipliedVar);
    output += '\t.cache()\n';
  }

  if(!node.nextNodes.length){
    variableStack.pop();
    return output;
  }

  for(let nextNode of node.nextNodes){
    output += processNode(graph[nextNode], node, templates, graph, variableStack, usedVariables, node.nextNodes.length > 1);
  }

  return output;
}

export default function generatePython(adapter, normalizedGraph, inputs) {
  const templates = adapter.getNodeTemplates();
  const variableStack = [];
  const usedVariables = {};
  let output = '';

  output += IMPORT + '\n\n';
  output += INIT + '\n\n';

  for(let input of inputs) {
    variableStack.push(input.variableName);

    output += input.variableName + ' = sc' + processNode(input, null, templates, normalizedGraph, variableStack, usedVariables) + '\n';
  }

  return output;
};

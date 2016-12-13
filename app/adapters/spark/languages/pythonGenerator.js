import _ from 'lodash';

const IMPORT = 'from pyspark import SparkConf, SparkContext';

const INIT = 'conf = SparkConf() \nsc = SparkContext(\'local\', \'test\', conf=conf)'; // TODO: SparkContext and SparkConf based on Running configuration


export function nameNode(node, templates, usedVariables){
  const baseName = _.snakeCase(templates[node.type].getName());
  const num = (usedVariables[baseName] || 0) + 1;
  usedVariables[baseName] = num;

  return baseName + num;
}

export function processNode(node, templates, graph, variableStack, usedVariables, afterBreak = false) {
  if(!node.nextNodes.length) return '.' + templates[node.type].generateCode(node.parameters) + '\n\n';

  const code = templates[node.type].generateCode(node.parameters) + '\n';

  return '.' + code + processNode(graph[node.nextNodes[0]], templates, graph, variableStack, usedVariables);
}

export default function generatePython(adapter, normalizedGraph, inputs) {
  const templates = adapter.getNodeTemplates();
  const variableStack = [];
  const usedVariables = {};
  let output = '';

  output += IMPORT + '\n\n';
  output += INIT + '\n\n';

  for(let input of inputs) {
    const inputName = nameNode(input, templates, usedVariables);
    variableStack.push(inputName);

    output += inputName + ' = sc' + processNode(input, templates, normalizedGraph, variableStack, usedVariables) + '\n\n';
  }

  return output;
};

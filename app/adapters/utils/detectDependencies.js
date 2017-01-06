import topsort from 'topsort';

let variablesComponent = {};
let componentVariables = {};

function processNode(node, component, graph, usedVariables, language, afterOutBreak = false) {
  if (node.component) {
    return; // Node visited ==> backtrack
  }

  node.component = component;
  if (node.variableName) {
    variablesComponent[node.variableName] = component;
  }

  let variables = language.parseVariables(node.parameters, usedVariables); // TODO: Should parse all variables or just those related to graph variables?
  for (let variable of variables) {
    componentVariables[component] = (componentVariables[component] || new Set()).add(variable);
  }

  for (let nextNode of node.nextNodes) {
    processNode(graph[nextNode], component, graph, usedVariables, language, node.nextNodes.length > 1);
  }
}


/**
 * Detects dependencies between variables in the graph.
 * Return sorted inputs based on dependencies between different graphs and for each node
 * list of future dependencies, to decide which branch iterate first.
 *
 * @param {Object} graph - Normalized graph
 * @param {Array} inputs - all inputs nodes
 * @param {Object} usedVariables - all generated variables in the graph
 * @param {BaseLanguage} language
 */
export default function detectDependencies(graph, inputs, usedVariables, language) {
  variablesComponent = {};
  componentVariables = {};
  let componentCounter = 1;

  for (let input of inputs) {
    processNode(input, componentCounter, graph, usedVariables, language);
    componentCounter++;
  }

  let dependencyGraph = [];
  for (let component in componentVariables) {
    if (!componentVariables.hasOwnProperty(component)) continue;

    for (let variable of componentVariables[component]) {
      if(component != variablesComponent[variable])
        dependencyGraph.push([component, variablesComponent[variable]]);
    }
  }

  if(!dependencyGraph.length){
    return {
      sortedInputs: inputs,
      dependencies: null
    }
  }

  // Group inputs by components
  let componentInputs = {};
  for (let input of inputs) {
    componentInputs[input.component] = input;
  }

  let sortedDependencies;
  try{
    sortedDependencies = topsort(dependencyGraph);
  }catch (e){
    throw {name: 'CircularDependency', message: 'The code contains circular dependency between variables!'}; // TODO: Find out where is the cycle.
  }


  let sortedInputs = [];
  for(let component of sortedDependencies){
    sortedInputs.unshift(componentInputs[component]);
  }

  return {
    sortedInputs,
    dependencies: null
  }
}

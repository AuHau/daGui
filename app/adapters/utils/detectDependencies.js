import topsort from 'topsort';

let variablesComponent = {};

Set.prototype.concat = function(setB) {
  for (let elem of setB) {
    this.add(elem);
  }
  return this;
};

function findSubdependencies(subcomponent, subcomponents, dependenciesList){
    for(let dependency of subcomponents[subcomponent].dependencies){
      for(let otherSubcomponent in subcomponents){
        if(!subcomponents.hasOwnProperty(otherSubcomponent) || otherSubcomponent == subcomponent) continue;

        if(subcomponents[otherSubcomponent].variables.has(dependency))
          dependenciesList.push([subcomponent, otherSubcomponent]);
      }
    }
}

/**
 * Recursive function for DFS of dependencies
 *
 * @param node
 * @param component
 * @param graph
 * @param usedVariables
 * @param language
 * @returns {{variables: Set, dependencies: Set}}
 */
function processNode(node, component, graph, usedVariables, language) {
  if (node.component) { // Node visited ==> backtrack
    return {
      variables: new Set(),
      dependencies: new Set()
    };
  }

  node.component = component;

  let output = {
    variables: new Set(),
    dependencies: new Set()
  };

  // Node has definition of variable ==> mark its origin in this node
  if (node.variableName) {
    output.variables.add(node.variableName);
    variablesComponent[node.variableName] = component;
  }

  // Parse all variables from parameter of this node and mark it as dependencies
  let variables = language.parseVariables(node.parameters, usedVariables); // TODO: [Q] Should parse all variables or just those related to graph variables?
  for (let variable of variables) {
    output.dependencies.add(variable);
  }

  // The last node ==> backtrack
  if (!node.nextNodes.length) return output;

  // Iterate over next nodes and store their dependencies for topsort
  // Moreover already merge their dependencies into current nodes dependencies, which is
  // eventually passed back
  let subcomponentCounter = 1;
  let subcomponents = {};
  let nextNodesComponents = {};
  for (let nextNode of node.nextNodes) {
    let nextNodeDependencies = processNode(graph[nextNode], component, graph, usedVariables, language, node.nextNodes.length > 1);
    subcomponents[subcomponentCounter] = nextNodeDependencies;
    nextNodesComponents[subcomponentCounter] = nextNode;

    output.variables.concat(nextNodeDependencies.variables);
    output.dependencies.concat(nextNodeDependencies.dependencies);
    subcomponentCounter++;
  }

  // There is just one next node ==> skip all dependency resolution and backtrack
  if(subcomponentCounter == 2) return output;

  // Build a dependency graph between next branches of the graph (= subcomponents)
  let subdependenciesGraph = [];
  for(let subcomponent in subcomponents){
    if(!subcomponents.hasOwnProperty(subcomponent)) continue;
    findSubdependencies(subcomponent, subcomponents, subdependenciesGraph);
  }

  let sortedSubdependencies;
  try{
    sortedSubdependencies = topsort(subdependenciesGraph);
  }catch (e){
    throw {name: 'CircularDependency', message: 'The code contains circular dependency between variables!'}; // TODO: [Low] Find out where is the cycle.
  }

  // Create new array with sorted dependencies + branches without dependencies
  let sortedNextNodes = [];
  let tmpNextNodes = node.nextNodes;
  for(let subcomponent of sortedSubdependencies){
    let tmpNode = nextNodesComponents[subcomponent];
    tmpNextNodes.splice(tmpNextNodes.indexOf(tmpNode), 1);
    sortedNextNodes.unshift(tmpNode);
  }

  node.nextNodes = [...sortedNextNodes, ...tmpNextNodes];

  return output;
}


/**
 * Detects dependencies between variables in the graph.
 * Return sorted inputs based on dependencies between different graphs.
 * Moreover it sorts nextNode lists in graph based on their sub-dependencies between graph's branches
 * (this is done in-place!)
 *
 * @param {Object} graph - Normalized graph
 * @param {Array} inputs - all inputs nodes
 * @param {Object} usedVariables - all generated variables in the graph
 * @param {BaseLanguage} language
 */
export default function detectDependencies(graph, inputs, usedVariables, language) {
  variablesComponent = {};
  let componentDependencies = {};
  let componentCounter = 1;
  let componentInputs = {};
  let component;

  for (let input of inputs) {
    component = processNode(input, componentCounter, graph, usedVariables, language);
    componentDependencies[componentCounter] = component.dependencies;
    componentInputs[componentCounter] = input;
    componentCounter++;
  }

  let dependencyGraph = [];
  for (let component in componentDependencies) {
    if (!componentDependencies.hasOwnProperty(component)) continue;

    for (let variable of componentDependencies[component]) {
      if(component != variablesComponent[variable])
        dependencyGraph.push([component, variablesComponent[variable]]);
    }
  }

  if(!dependencyGraph.length){
    return inputs;
  }

  let sortedDependencies;
  try{
    sortedDependencies = topsort(dependencyGraph);
  }catch (e){
    throw {name: 'CircularDependency', message: 'The code contains circular dependency between variables!'}; // TODO: [Low] Find out where is the cycle.
  }


  let sortedInputs = [];
  for(let component of sortedDependencies){
    sortedInputs.unshift(componentInputs[component]);
  }

  return sortedInputs
}

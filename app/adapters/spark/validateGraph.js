import ErrorLevel from 'graph/ErrorLevel';
import ErrorType from 'graph/ErrorType';

const createError = (id, type, description, level = ErrorLevel.ERROR, importance = 10) => {
  return {
    id,
    type,
    description,
    level,
    importance
  }
};

const checkParameters = (node, lang, adapter, nodeTemplate) => {
  const parametersErrors = [];
  const parametersDefinitions = nodeTemplate.getCodeParameters(lang);
  const parameters = node.attributes.dfGui.parameters;

  if (!parametersDefinitions || parametersDefinitions == []) return [];

  parametersDefinitions.forEach((definition, index) => {
    if (definition.required && (!parameters[index] || parameters[index] == "" || parameters[index] == definition.template)) {
      parametersErrors.push(createError(node.id, ErrorType.MISSING_PARAMETER, 'Missing required parameter "' + definition.name + '" on node ' + nodeTemplate.getName()));
    }
  });

  return parametersErrors;
};

const isNodeTypeInGroup = (adapter, nodeType, groupName) => {
  const group = adapter.getGroupedNodeTemplates().find(group => group.name == groupName);
  return group.templates.find(template => template.getType() == nodeType) != undefined;
};

/**
 * Implements topological ordering to check if graph contains cycles ==> O(|E|+|V|)
 * Inspiried from: https://simplapi.wordpress.com/2015/08/19/detect-graph-cycle-in-javascript/
 *
 * @param normalizedGraph
 * @param adapter
 * @returns {{id, type, description, level, importance}}
 */
const checkCycles = (normalizedGraph, adapter) => {
  normalizedGraph = JSON.parse(JSON.stringify(normalizedGraph)); // Deep copy
  const nodes = Object.values(normalizedGraph).filter(node => isNodeTypeInGroup(adapter, node.type, 'Input'));

  if (!nodes.length)
    return createError(null, ErrorType.NO_INPUTS, 'There are no inputs nodes in the graph!');

  const hasIncomingEdge = (node) => {
    for (let nodeId in normalizedGraph) {
      if (!normalizedGraph.hasOwnProperty(nodeId)) continue;

      if (normalizedGraph[nodeId].nextNodes.includes(node.id))
        return true;
    }

    return false;
  };

  let currentNode, nextNode, i, visitedNodes = new Set;
  while (nodes.length) {
    currentNode = nodes.pop();
    visitedNodes.add(currentNode.id);

    i = normalizedGraph[currentNode.id].nextNodes.length;
    while (i--) {
      // Getting the node associated to the current stored id in nextNodes
      nextNode = normalizedGraph[currentNode.nextNodes[i]];
      visitedNodes.add(nextNode.id);

      // Remove edge e from the graph
      normalizedGraph[currentNode.id].nextNodes.pop();

      if (!hasIncomingEdge(nextNode)) {
        nodes.push(nextNode);
      }
    }
  }

  for (let nodeId of visitedNodes) {
    if (normalizedGraph[nodeId].nextNodes.length)
      return createError(null, ErrorType.HAS_CYCLE, 'Graph is not valid! It contains a cycle!');
  }

  return;
};

const checkLinks = (graph, node, nodeTemplate) => {
  const portsMap = {};

  for (let port of node.getPorts()) {
    portsMap[port.id] = false;
  }

  for (let link of graph.getConnectedLinks(node)) {
    if (link.attributes.source.id == node.id)
      portsMap[link.attributes.source.port] = true;

    if (link.attributes.target.id == node.id)
      portsMap[link.attributes.target.port] = true;
  }

  if (Object.values(portsMap).includes(false)) {
    return [createError(node.id, ErrorType.NOT_CONNECTED_PORTS, 'Node "' + nodeTemplate.getName() + '" does not have all ports connected!')]
  }

  return [];
};

export default function validateGraph(graph, normalizedGraph, lang, adapter) {
  const nodes = graph.getElements();

  let errors = [];
  let parametersErrors, linksErrors, nodeTemplate;
  for (let node of nodes) {
    nodeTemplate = adapter.getNodeTemplates()[node.get('type')];
    parametersErrors = checkParameters(node, lang, adapter, nodeTemplate);
    linksErrors = checkLinks(graph, node, nodeTemplate);

    errors = [...errors, ...parametersErrors, ...linksErrors];
  }

  const cycles = checkCycles(normalizedGraph, adapter);
  if(cycles) return [cycles, ...errors];

  return errors;
}

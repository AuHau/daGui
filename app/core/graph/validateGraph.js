import ErrorLevel from 'shared/enums/ErrorLevel.js';
import ErrorType from 'shared/enums/ErrorType.js';
import ValidationCriteria from 'shared/enums/ValidationCriteria';
import toposort from 'toposort';

function createError(id, type, description, importance = 10, level = ErrorLevel.ERROR){
  return {
    id,
    type,
    description,
    level,
    importance
  }
}

function checkParameters(node, lang, nodeTemplate){
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
}

/**
 * Checks if the graph contains a cycle.
 *
 * @param graph
 * @returns {{id, type, description, level, importance}|null}
 */
function checkCycles(graph){
  const dependencies = [];

  for(let node of Object.values(graph)){
    for(let nextNode of node.nextNodes){
      dependencies.push([node.id, nextNode]);
    }
  }

  try{
    toposort(dependencies);
  }catch (e){
    return createError(null, ErrorType.HAS_CYCLE, 'Graph is not valid! It contains a cycle!', 20);
  }

  return null;
}

/**
 * Validate that all ports present on node has at least one link attached to it.
 *
 * @param {function} graph JointJs graph's objet
 * @param {function} node JointJs node's object
 * @param {function} nodeTemplate Adapter's node template for the node.
 * @return {Array} Array of detected errors.
 */
function checkPorts(graph, node, nodeTemplate){
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
}

// TODO: [Medium] Implement algorithm for searching Strongly connected component to identify cycles (not just its presents)
// TODO: [Optimisation/High] Get rid of jointjs graph dependency and use only normalizedGraph
export default function validateGraph(graph, normalizedGraph, lang, inputs, adapter, adapterVersion) {
  const nodes = graph.getElements();
  const checks = adapter.getValidationCriteria(adapterVersion);

  let errors = [];
  if(checks.has(ValidationCriteria.HAS_REQUIRED_PARAMETERS_FILLED) || checks.has(ValidationCriteria.HAS_PORTS_CONNECTED)){
    const templates = adapter.getNodeTemplates();
    let parametersErrors, linksErrors, nodeTemplate;
    for (let node of nodes) {
      parametersErrors = linksErrors = [];
      nodeTemplate = templates[node.get('type')];

      if(checks.has(ValidationCriteria.HAS_REQUIRED_PARAMETERS_FILLED))
        parametersErrors = checkParameters(node, lang, nodeTemplate);

      if(checks.has(ValidationCriteria.HAS_PORTS_CONNECTED))
        linksErrors = checkPorts(graph, node, nodeTemplate);

      errors = [...errors, ...parametersErrors, ...linksErrors];
    }
  }

  if(checks.has(ValidationCriteria.HAS_INPUT_NODES) && !inputs.length){
    return [createError(null, ErrorType.NO_INPUTS, 'There are no inputs nodes in the graph!', 15), ...errors];
  }

  if(checks.has(ValidationCriteria.NO_CYCLES)){
    const cycles = checkCycles(normalizedGraph, inputs);
    if(cycles) return [cycles, ...errors];
  }

  return errors;
}

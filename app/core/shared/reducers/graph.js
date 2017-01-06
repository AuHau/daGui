import Immutable from 'immutable';
import GRAPH from '../actions/graph';

const getActive = (state) => {
  return state.get('active');
};

const findIndex = (state, id) => {
  return state.getIn(['opened', getActive(state), 'graph', 'cells']).findIndex(node => node.get('id') == id);
};

export default (state, action) => {
  let index, cells;

  switch (action.type) {
    case GRAPH.UPDATE_NODE:
      index = findIndex(state, action.payload.id);
      // New link
      if (index == -1) {
        return state.updateIn(['opened', getActive(state), 'graph', 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));
      }
      return state.setIn(['opened', getActive(state), 'graph', 'cells', index], Immutable.fromJS(action.payload));

    case GRAPH.MOVE_NODE:
      const newPosition = Immutable.Map({x: action.x, y: action.y});
      index = findIndex(state, action.nid);
      return state.setIn(['opened', getActive(state), 'graph', 'cells', index, 'position'], newPosition);

    case GRAPH.ADD_NODE:
      return state.updateIn(['opened', getActive(state), 'graph', 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));

    case GRAPH.DELETE_NODE:
      cells = state.getIn(['opened', getActive(state), 'graph', 'cells']);
      let filtered = cells.filter(node => node.get('id') != action.payload && node.getIn(['source', 'id']) != action.payload && node.getIn(['target', 'id']) != action.payload );
      return state.setIn(['opened', getActive(state), 'graph', 'cells'], filtered);

    case GRAPH.UPDATE_VARIABLE:
      index = findIndex(state, action.payload.nid);
      const oldVariableName = state.getIn(['opened', getActive(state), 'graph', 'cells', index, 'dfGui', 'variableName']);
      return state.setIn(['opened', getActive(state), 'graph', 'cells', index, 'dfGui', 'variableName'], action.payload.newVariableName)
                .deleteIn(['opened', getActive(state), 'usedVariables', oldVariableName])
                .setIn(['opened', getActive(state), 'usedVariables', action.payload.newVariableName], action.payload.nid);

    case GRAPH.REMOVE_VARIABLE:
      index = findIndex(state, action.payload.nid);
      const variableName = state.getIn(['opened', getActive(state), 'graph', 'cells', index, 'dfGui', 'variableName']);
      return state.deleteIn(['opened', getActive(state), 'graph', 'cells', index, 'dfGui', 'variableName'])
        .deleteIn(['opened', getActive(state), 'usedVariables', variableName]);


    default:
      return state;
  }
};

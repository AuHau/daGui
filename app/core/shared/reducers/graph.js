import Immutable from 'immutable';
import GRAPH from '../actions/graph';

const getActive = (state) => {
  return state.get('active');
};

export default (state, action) => {
  let index;

  switch (action.type) {
    case GRAPH.UPDATE_NODE:
      index = state.getIn(['opened', getActive(state), 'graph', 'cells']).findIndex(node => node.get('id') == action.nid);
      return state.setIn(['opened', getActive(state), 'graph', 'cells', index], Immutable.fromJS(action.payload));

    case GRAPH.MOVE_NODE:
      const newPosition = Immutable.Map({x: action.x, y: action.y});
      index = state.getIn(['opened', getActive(state), 'graph', 'cells']).findIndex(node => node.get('id') == action.nid);
      return state.setIn(['opened', getActive(state), 'graph', 'cells', index, 'position'], newPosition);

    case GRAPH.ADD_NODE:
      return state.updateIn(['opened', getActive(state), 'graph', 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));

    case GRAPH.UPDATE_LINK:
      index = state.getIn(['opened', getActive(state), 'graph', 'cells']).findIndex(node => node.get('id') == action.payload.id);
      // New link
      if (index == -1) {
        return state.updateIn(['opened', getActive(state), 'graph', 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));
      }
      return state.setIn(['opened', getActive(state), 'graph', 'cells', index], Immutable.fromJS(action.payload));

    case GRAPH.DELETE_ELEMENT:
      index = state.getIn(['opened', getActive(state), 'graph', 'cells']).findIndex(node => node.get('id') == action.payload);
      return index == -1 ? state : state.deleteIn(['opened', getActive(state), 'graph', 'cells', index]);

    default:
      return state;
  }
};

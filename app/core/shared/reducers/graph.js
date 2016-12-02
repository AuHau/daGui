import Immutable from 'immutable';
import GRAPH from '../actions/graph';

const getActive = (state) => {
  return state.get('active');
};

export default (state, action) => {
  let linkIndex;

  switch (action.type) {
    case GRAPH.MOVE_NODE:
      const newPosition = Immutable.Map({x: action.x, y: action.y});
      const nodeIndex = state.getIn(['opened', getActive(state), 'graph', 'cells']).findIndex(node => node.get('id') == action.nid);
      return state.setIn(['opened', getActive(state), 'graph', 'cells', nodeIndex, 'position'], newPosition);

    case GRAPH.ADD_NODE:
      return state.updateIn(['opened', getActive(state), 'graph', 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));

    case GRAPH.UPDATE_LINK:
      linkIndex = state.getIn(['opened', getActive(state), 'graph', 'cells']).findIndex(node => node.get('id') == action.payload.id);
      // New link
      if (linkIndex == -1) {
        return state.updateIn(['opened', getActive(state), 'graph', 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));
      }
      return state.setIn(['opened', getActive(state), 'graph', 'cells', linkIndex], Immutable.fromJS(action.payload));

    case GRAPH.DELETE_LINK:
      linkIndex = state.getIn(['opened', getActive(state), 'graph', 'cells']).findIndex(node => node.get('id') == action.payload);
      return linkIndex == -1 ? state : state.deleteIn(['opened', getActive(state), 'graph', 'cells', linkIndex]);

    default:
      return state;
  }
};

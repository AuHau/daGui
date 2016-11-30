import Immutable from 'immutable';
import GRAPH from '../actions/graph';

export default (state, action) => {
  let linkIndex;

  switch (action.type) {
    case GRAPH.MOVE_NODE:
      const newPosition = Immutable.Map({x: action.x, y: action.y});
      const nodeIndex = state.getIn([action.activeFile, 'cells']).findIndex(node => node.get('id') == action.nid);
      return state.setIn([action.activeFile, 'cells', nodeIndex, 'position'], newPosition);

    case GRAPH.ADD_NODE:
      return state.updateIn([action.activeFile, 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));

    case GRAPH.UPDATE_LINK:
      linkIndex = state.getIn([action.activeFile, 'cells']).findIndex(node => node.get('id') == action.payload.id);
      // New link
      if (linkIndex == -1) {
        return state.updateIn([action.activeFile, 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));
      }
      return state.setIn([action.activeFile, 'cells', linkIndex], Immutable.fromJS(action.payload));

    case GRAPH.DELETE_LINK:
      linkIndex = state.getIn([action.activeFile, 'cells']).findIndex(node => node.get('id') == action.payload);
      return linkIndex == -1 ? state : state.deleteIn([action.activeFile, 'cells', linkIndex]);

    default:
      return state;
  }
};

import Immutable from 'immutable';
import GRAPH from '../actions/graph';

export default (state, action) => {

  switch (action.type) {
    case GRAPH.MOVE_NODE:
      const newPosition = Immutable.Map({x: action.x, y: action.y});
      let nodeIndex;
      state.getIn([action.activeFile, 'cells']).find((cell, index) => {
        if (cell.get('id') == action.nid){
          nodeIndex = index;
          return true;
        }else return false;
      });

      return state.setIn([action.activeFile, 'cells', nodeIndex, 'position'], newPosition);
    case GRAPH.ADD_NODE:
      return state.updateIn([action.activeFile, 'cells'], nodes => nodes.push(Immutable.fromJS(action.payload)));
    default:
      return state;
  }
};

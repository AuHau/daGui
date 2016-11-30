import GRAPH from '../actions/graph';

export default (state, action) => {

  switch (action.type){
    case GRAPH.ADD_NODE:
      return state.updateIn([ action.activeFile, 'cells'], nodes => nodes.push(action.payload));
    default:
      return state;
  }
};

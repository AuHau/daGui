import GRAPH from '../actions/graph';

export default (state, action) => {

  switch (action.type){
    case GRAPH.ADD_NODE:
      // TODO: Better way how to find out about currently active file?
      const activeFile = state.files.active;
      return state.updateIn(['graphs', activeFile, 'cells'], nodes => nodes.push(action.nodeObject));
    default:
      return state;
  }
};

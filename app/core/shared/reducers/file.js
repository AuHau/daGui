import graphReducer from './graph';

export default (state, action) => {
  if(action.type.startsWith('GRAPH_')){
    return graphReducer(state, action);
  }else{
    return state;
  }
};


import FILE from 'shared/actions/file';

import graphReducer from './graph';

export default (state, action) => {
  if(action.type.startsWith('GRAPH_')){
    return graphReducer(state, action);
  }else{

    switch (action.type){
      case FILE.SWITCH_TAB:
        return state.set('active', action.payload);

      default:
        return state;
    }
  }
};

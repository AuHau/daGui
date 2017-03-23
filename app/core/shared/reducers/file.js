
import FILE from 'shared/actions/file';

import graphReducer from './graph';

export default (state, action, wholeState) => {
  if(action.type.startsWith('GRAPH_')){
    return graphReducer(state, action, wholeState);
  }else{
    switch (action.type){
      case FILE.SWITCH_TAB:
        return wholeState.set('active', action.payload);

      default:
        return wholeState;
    }
  }
};


import FILE from 'shared/actions/file';

import graphReducer from './graph';

const getActive = (state) => {
  return state.get('active');
};

export default (state, action, wholeState) => {
  if(action.type.startsWith('GRAPH_')){
    return graphReducer(state, action, wholeState);
  }else{
    switch (action.type){
      case FILE.SWITCH_TAB:
        return wholeState.set('active', action.payload);

      case FILE.SET_PATH:
        return wholeState
          .setIn(['opened', getActive(wholeState), 'path'], action.payload.path)
          .setIn(['opened', getActive(wholeState), 'name'], action.payload.fileName);

      default:
        return wholeState;
    }
  }
};

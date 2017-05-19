import Immutable from 'immutable';

/*
 * Inspired by http://redux.js.org/docs/recipes/ImplementingUndoHistory.html
 */

const getActive = (state) => {
  return state.get('active');
};

export default function undoable(reducer, config) {
  return function (state, action) {

    // Init of store
    if(state == undefined){
      return reducer(undefined, action, undefined)
    }

    // No files are opened
    if(getActive(state) < 0){
      return reducer(null, action, state);
    }

    const graphHistory = state.getIn(['opened', getActive(state), 'history']);
    const past = graphHistory.get('past');
    const present = graphHistory.get('present');
    const future = graphHistory.get('future');

    switch (action.type) {
      case 'UNDO':
        if(past.isEmpty()){
          return state;
        }

        const previous = past.last();
        const newPast = past.pop();
        return state.setIn(['opened', getActive(state), 'history'],
          Immutable.Map({
            'past': newPast,
            'present': previous,
            'future': future.unshift(present)
          }));
      case 'REDO':
        if(future.isEmpty()){
          return state;
        }

        const next = future.first();
        const newFuture = future.shift();
        return state.setIn(['opened', getActive(state), 'history'],
          Immutable.Map({
            'past': past.push(present),
            'present': next,
            'future': newFuture
          }));
      default:
        if(config.ignore && config.ignore(action)){
          return reducer({}, action, state);
        }else{

          let newPresent = reducer(present, action, state);
          if (present === newPresent) {
            return state
          }

          newPresent = newPresent.set('historyId', newPresent.get('historyId') + 1);

          return state.setIn(['opened', getActive(state), 'history'],
            Immutable.Map({
              'past': past.push(present),
              'present': newPresent,
              'future': Immutable.List()
            }));
        }
    }
  }
}

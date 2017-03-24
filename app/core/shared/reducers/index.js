// @flow
import {combineReducers} from 'redux-immutable';
import undoable from 'shared/utils/undoable'
import GRAPH from 'shared/actions/graph';

// Custom reducers
import files from './file';
import ui from './ui';

const rootReducer = combineReducers({
  files: undoable(files, {
    ignore: (action) => !action.type.startsWith('GRAPH_') || action.type.endsWith('_$')
  }),
  ui
});

export default rootReducer;

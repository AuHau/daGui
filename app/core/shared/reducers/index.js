// @flow
import {combineReducers} from 'redux-immutable';
import undoable from 'shared/utils/undoable'
import GRAPH from 'shared/actions/graph';

// Custom reducers
import files from './file';
import ui from './ui';

const rootReducer = combineReducers({
  files: undoable(files, {
    ignore: (action) => !action.type.startsWith('GRAPH_') || [GRAPH.ZOOM_IN, GRAPH.ZOOM, GRAPH.ZOOM_OUT, GRAPH. PAN].includes(action.type)
  }),
  ui
});

export default rootReducer;

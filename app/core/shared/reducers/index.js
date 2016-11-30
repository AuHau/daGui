// @flow
import {combineReducers} from 'redux-immutable';

// Custom reducers
import files from './file';
import graphs from './graph';
import ui from './ui';

const rootReducer = combineReducers({
  files,
  graphs,
  ui
});

export default rootReducer;

// @flow
import {combineReducers} from 'redux-immutable';

// Custom reducers
import files from './file';
import ui from './ui';

const rootReducer = combineReducers({
  files,
  ui
});

export default rootReducer;

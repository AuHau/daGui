// @flow
import reduceReducers from 'reduce-reducers';

// Custom reducers
import file from './file';
import graph from './graph';
import ui from './ui';

const rootReducer = reduceReducers(
  file,
  graph,
  ui
);

export default rootReducer;

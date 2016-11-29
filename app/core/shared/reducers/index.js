// @flow
import reduceReducers from 'reduce-reducers';

// Custom reducers
import file from './file';
import graph from './graph';

const rootReducer = reduceReducers(
  file,
  graph
);

export default rootReducer;

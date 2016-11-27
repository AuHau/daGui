// @flow
import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import reduceReducers from 'reduce-reducers';

// Custom reducers
import file from './file';
import graph from './graph';

const rootReducer = reduceReducers(
  combineReducers({
    routing
  }),
  file,
  graph
);

export default rootReducer;

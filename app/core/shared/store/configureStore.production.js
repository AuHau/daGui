// @flow
import { createStore, compose } from 'redux';
import { batchedSubscribe } from 'redux-batched-subscribe';


import rootReducer from '../reducers';

const enhancers = compose(
  batchedSubscribe(fn => fn())
);

export default function configureStore(initialState: Object) {
  return createStore(rootReducer, initialState, enhancers);
}

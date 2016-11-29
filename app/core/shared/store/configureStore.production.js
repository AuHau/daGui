// @flow
import { createStore } from 'redux';
import rootReducer from '../reducers';

export default function configureStore(initialState: Object) {
  return createStore(rootReducer, initialState);
}

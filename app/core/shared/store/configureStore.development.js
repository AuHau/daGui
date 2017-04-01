import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import { batchedSubscribe } from 'redux-batched-subscribe';
import reduxMulti from 'redux-multi'
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux';

const actionCreators = {};

const logger = createLogger({
  level: 'info',
  collapsed: true
});


// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
//   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//     // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
//     actionCreators,
//   }) :
//   compose;
/* eslint-enable no-underscore-dangle */
const enhancer = compose(
  applyMiddleware(logger, reduxMulti, thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop,
  batchedSubscribe(notify => notify())
);

export default function configureStore(initialState: Object) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return store;
}

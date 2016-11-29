import { createStore } from 'redux';
import rootReducer from '../reducers';
import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux';

export default function configureStore(initialState: Object) {
  const store = createStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return store;
}

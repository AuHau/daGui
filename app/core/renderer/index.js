// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'shared/store/configureStore';
import './app.global.scss';
import Config from '../../config/index';
import localForage from 'localforage';

import App from './containers/App';

// localForage configuration
localForage.config(Config.localForageConfig);

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

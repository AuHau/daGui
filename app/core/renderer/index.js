// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../shared/store/configureStore';
import Immutable from 'immutable';
import './app.global.scss';

// Containers
import App from './containers/App';
import Startup from './containers/Startup';

// TODO: Not hardcoded
import SparkAdapter from '../../adapters/spark';
import Python from '../languages/Python';

const initState = Immutable.fromJS({
  files: {
    active: 0, // Index of active file
    opened: [
      {
        name: 'Test.scala',
        adapter: SparkAdapter,
        language: Python,
        graph: {
          cells: [// Array of cells (ie. links and elements).
          ]
        }
      }
    ]
  },
  ui: {
    canvasContainerSpec: {},
    detailNodeId: null,
    showSettingsWindow: false,
    showCodeView: false
  }
});

const store = configureStore(initState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

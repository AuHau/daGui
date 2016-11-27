// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from '../shared/store/configureStore';
import './app.global.scss';

// TODO: Not hardcoded
import SparkAdapter from '../../adapters/spark';
import Scala from '../languages/Scala';
const initState = {
  routing: {},
  files: {
    active: 0, // Index of active file
    opened: [
      {
        name: 'Test.scala',
        adapter: SparkAdapter,
        language: Scala
      }
    ]
  },
  graphs: [
    []
  ]
};

const store = configureStore(initState);
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

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
    {
      cells: [// Array of cells (ie. links and elements).
        {
          id: '3d90f661-fe5f-45dc-a938-bca137691eeb',// Some randomly generated UUID.
          type: 'basic.Rect',
          attrs: {
            'stroke': '#000'
          },
          position: {
            x: 0,
            y: 50
          },
          angle: 90,
          size: {
            width: 100,
            height: 50
          },
          z: 2
        }
      ]
    }
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

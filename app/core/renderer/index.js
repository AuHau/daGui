// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../shared/store/configureStore';
import './app.global.scss';

// Containers
import App from './containers/App';
import Startup from './containers/Startup';

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

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

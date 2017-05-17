// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'shared/store/configureStore';
import Immutable from 'immutable';
import './app.global.scss';
import CursorMode from 'shared/enums/CursorMode';


// Containers
import App from './containers/App';
import Startup from './containers/Startup';

// Testing data
import blank from '../../../test/data/graphs/blank'
import simpleSingleSubgraph from '../../../test/data/graphs/simpleSingleSubgraph'
import oneGraphWithBranchAndDependency from '../../../test/data/graphs/oneGraphWithBranchAndDependency'
import threeSimpleDependantGraphs from '../../../test/data/graphs/threeSimpleDependantGraphs'
import oneGraphWithUnionAndDependencies from '../../../test/data/graphs/oneGraphWithUnionAndDependencies'

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

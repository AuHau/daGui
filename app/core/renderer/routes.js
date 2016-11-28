// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Startup from './containers/Startup';
import Graph from './components/editor/Canvas';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Graph} />
    <Route path="/:fileId" component={Graph} />
  </Route>
);

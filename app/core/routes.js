// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Startup from './containers/Startup';
import Editor from './containers/Editor';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Startup} />
    <Route path="/:fileId" component={Editor} />
  </Route>
);

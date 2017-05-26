// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'shared/store/configureStore';
import './app.global.scss';
import Config from '../../config/index';
import localForage from 'localforage';

import cssVariables from '!!sass-variable-loader!renderer/variables.scss';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import App from './containers/App';

// localForage configuration
localForage.config(Config.localForageConfig);

darkBaseTheme.fontFamily = cssVariables.fontFamily;
darkBaseTheme.palette.textColor = cssVariables.fontColor;
darkBaseTheme.palette.accent1Color = cssVariables.materialUiAccentColor;
darkBaseTheme.palette.accent2Color = cssVariables.materialUiAccentColor;
darkBaseTheme.palette.accent3Color = cssVariables.materialUiAccentColor;

const store = configureStore();

render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);

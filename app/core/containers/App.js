// @flow
import React, {Component, PropTypes} from 'react';

import Menu from '../components/layout/Menu'
import Sidebar from '../components/layout/Sidebar'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        <Menu />
        <Sidebar />
        {this.props.children}
      </div>
    );
  }
}

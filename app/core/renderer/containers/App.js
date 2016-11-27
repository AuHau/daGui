// @flow
import React, {Component, PropTypes} from 'react';

import Menu from '../components/layout/Menu'
import NodesSidebar from '../components/sidebar_node/NodesSidebar'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        <Menu />
        <NodesSidebar />
        {this.props.children}
      </div>
    );
  }
}

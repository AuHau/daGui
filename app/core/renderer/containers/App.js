// @flow
import React, {Component, PropTypes} from 'react';

import Menu from '../components/layout/Menu'
import NodesSidebar from '../components/sidebar_node/NodesSidebar'
import Canvas from '../components/editor/Canvas';

export default class App extends Component {
  render() {
    return (
      <div>
        <Menu />
        <NodesSidebar />
        <Canvas/>
      </div>
    );
  }
}

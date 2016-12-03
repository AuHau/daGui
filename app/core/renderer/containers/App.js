// @flow
import React, {Component} from 'react';
import { connect } from 'react-redux';

import {updateNode} from '../../shared/actions/graph';

import Menu from '../components/layout/Menu';
import Footer from '../components/layout/Footer';
import NodesSidebar from '../components/sidebar_node/NodesSidebar';
import DetailSidebar from '../components/sidebar_detail/DetailSidebar';
import Canvas from '../components/editor/Canvas';

class App extends Component {
  render() {
    return (
      <div>
        <Menu />
        <NodesSidebar adapter={this.props.file.get('adapter')} />
        <Canvas/>
        {this.props.nodeDetail && <DetailSidebar node={this.props.nodeDetail.toJS()} adapter={this.props.file.get('adapter')} onNodeChange={this.props.onNodeChange}/>}
        <Footer framework={this.props.file.get('adapter').getName()} language={this.props.file.get('language').getName()}/>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const nodeId = state.getIn(['ui', 'detailNodeId']);
  const activeFile = state.getIn(['files', 'active']);

  return {
    file: state.getIn(['files', 'opened', state.getIn(['files', 'active'])]),
    nodeDetail: (nodeId ? state.getIn(['files', 'opened', activeFile, 'graph', 'cells']).find(node => node.get('id') == nodeId) : null),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNodeChange: (node) => {
        dispatch(updateNode(node.id, node));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

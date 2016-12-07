// @flow
import React, {Component} from 'react';
import { connect } from 'react-redux';

import {updateNode} from '../../shared/actions/graph';

import Menu from '../components/layout/Menu';
import Footer from '../components/layout/Footer';
import NodesSidebar from '../components/sidebar_node/NodesSidebar';
import DetailSidebar from '../components/sidebar_detail/DetailSidebar';
import Canvas from '../components/editor/Canvas';
import CodeView from '../components/editor/CodeView';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      highlightNodeId: null
    };

    this.generatedCode = null;
    this.graphErrors = null;
    this.onHighlight = this.onHighlight.bind(this);
  }

  onHighlight(nid){
    this.setState({highlightNodeId: nid});
  }

  componentWillUpdate(nextProps){
    const adapter = nextProps.file.get('adapter');
    const graph = nextProps.file.get('graph').toJS();
    this.graphErrors = adapter.validateGraph(graph);

    if(nextProps.showCodeView && !this.graphErrors){
      this.generatedCode = adapter.generateCode(graph);
    }
  }

  render() {
    const adapter = this.props.file.get('adapter');
    const language = this.props.file.get('language');

    return (
      <div>
        <Menu />
        <NodesSidebar adapter={adapter} />
        <Canvas onHighlight={this.onHighlight} highlight={this.state.highlightNodeId}/>
        {this.props.nodeDetail && <DetailSidebar node={this.props.nodeDetail.toJS()} language={language} adapter={adapter} onNodeChange={this.props.onNodeChange}/>}
        {this.props.showCodeView && <CodeView code={this.generatedCode} onHighlight={this.onHighlight} highlight={this.state.highlightNodeId}/>}
        <Footer framework={adapter.getName()} language={this.props.file.get('language').getName()}/>
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
    showCodeView: state.getIn('ui.showCodeView'.split('.')),
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

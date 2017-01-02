// @flow
import React, {Component} from 'react';
import { connect } from 'react-redux';
import joint from 'jointjs';
import {hashGraph, normalizeGraph} from 'graph/graphToolkit.js';
import CodeBuilder from 'graph/CodeBuilder';

import {updateNode, updateVariable} from '../../shared/actions/graph';

// Components
import ToggleDisplay from 'react-toggle-display';
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

    this.codeBuilder = new CodeBuilder();
    this.graphErrors = [];
    this.graphHash = null;
    this.onHighlight = this.onHighlight.bind(this);
  }

  onHighlight(nid){
    this.setState({highlightNodeId: nid});
  }

  componentWillUpdate(nextProps){
    const adapter = nextProps.file.get('adapter');
    const language = nextProps.file.get('language');
    const graph = nextProps.file.get('graph').toJS();

    const {normalizedGraph, inputs}= normalizeGraph(graph, adapter.isTypeInput);
    const newHash = hashGraph(normalizedGraph);
    if(this.graphHash == newHash)
      return; // No graph's changes which are connected with code ===> don't re-generate the code

    // TODO: Optimalization - drop JointJS graph dependency (use only normalized graph)
    const jointGraph = new joint.dia.Graph();
    jointGraph.fromJSON(graph);
    this.graphErrors = adapter.validateGraph(jointGraph, normalizedGraph, inputs, language);

    if(!nextProps.showCodeView)
      return; // Generation will only happen when has to (eq. when CodeView is active)

    if (!this.graphErrors.length) {
      adapter.generateCode(this.codeBuilder, normalizedGraph, inputs, language);
    }

    this.graphHash = newHash;
  }

  render() {
    const adapter = this.props.file.get('adapter');
    const language = this.props.file.get('language');

    // TODO: Convert toggeling visibility for DetailSidebar also into ToggleDisplay component
    return (
      <div>
        <Menu />
        <NodesSidebar adapter={adapter} />
        <Canvas onHighlight={this.onHighlight} highlight={this.state.highlightNodeId}/>
        {this.props.nodeDetail && <DetailSidebar node={this.props.nodeDetail.toJS()} language={language} adapter={adapter} onNodeChange={this.props.onNodeChange}/>}
        <ToggleDisplay show={this.props.showCodeView}><CodeView language={language} codeBuilder={this.codeBuilder} errors={this.graphErrors} onVariableNameChange={this.props.onVariableChange} onHighlight={this.onHighlight} highlight={this.state.highlightNodeId}/></ToggleDisplay>
        <Footer messages={this.graphErrors} framework={adapter.getName()} language={this.props.file.get('language').getName()}/>
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
    onNodeChange: (node) => dispatch(updateNode(node)),
    onVariableChange: (nid, newVariableName) => dispatch(updateVariable(nid, newVariableName))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

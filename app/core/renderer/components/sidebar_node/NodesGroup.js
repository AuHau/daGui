import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';
import joint from 'jointjs';
import { connect } from 'react-redux'
import Config from '../../../../config/index.js';
import {countInPorts} from 'graph/graphToolkit';

import cssVariables from '!!sass-variable-loader!renderer/variables.scss';
import styles from './NodesGroup.scss';

import {addNode, addNodeAndUpdateVariables} from 'shared/actions/graph';

const nodeMargin = parseInt(cssVariables.nodesSidebarMargin);

class NodesGroup extends Component {
  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
    this.state = {isDragging: false};
    this.lastSearch = '';
    this.lastDisplayHiddenNodes = props.displayHiddenNodes;
  }

  onDrag(cellView, e, x, y) {
    const dragElem = findDOMNode(this.refs.flyPaper);

    const flyGraph = new joint.dia.Graph;
    new joint.dia.Paper({
      el: dragElem,
      model: flyGraph,
      interactive: false
    });
    const flyShape = cellView.model.clone();
    const offset = {
      x: x - cellView.model.position().x,
      y: y - cellView.model.position().y
    };

    flyShape.position(0, 0);
    flyGraph.addCell(flyShape);
    dragElem.style.left = e.pageX - offset.x + 'px';
    dragElem.style.top = e.pageY - offset.y + 'px';

    // Moving flyPaper
    const moveHandler = (e) => {
      dragElem.style.left = e.clientX - offset.x + 'px';
      dragElem.style.top = e.clientY - offset.y + 'px';
    };

    // Dropping element
    const dropHandler = (e) => {
      const x = e.clientX,
        y = e.clientY,
        canvas = this.props.canvasContainerSpec;

      // Dropped over paper ?
      if (x > canvas.get('left') && x < canvas.get('left') + canvas.get('width') && y > canvas.get('top') && y < canvas.get('top') + canvas.get('height')) {
        const s = flyShape.clone();
        s.position(x - canvas.get('left') - offset.x, y - canvas.get('top') - offset.y);

        // Redux action
        if(countInPorts(s) > 1
          || this.props.adapter.isTypeInput(s.attributes.type)
          || this.props.adapter.getNodeTemplates(this.props.adapterVersion)[s.attributes.type].requiresBreakChaining()){

          const sJson = s.toJSON();
          const variableName = this.props.language.nameNode(this.props.adapter.getNodeTemplates(this.props.adapterVersion)[s.attributes.type], this.props.usedVariables);
          sJson.dfGui.variableName = variableName;
          this.props.addNodeAndVariable(sJson, variableName);
        }else{
          this.props.addNode(s.toJSON());
        }
      }

      // Cleap up
      flyShape.remove();
      document.body.removeEventListener('mousemove', moveHandler);
      document.body.removeEventListener('mouseup', dropHandler);
      this.setState({isDragging: false})
    };

    document.body.addEventListener('mousemove', moveHandler);
    document.body.addEventListener('mouseup', dropHandler);
  }

  filterOutNodes(){
    if(!this.props.searchedText || this.props.searchedText == '')
      return this.props.nodeTemplates.filter(node => this.props.displayHiddenNodes || !Config.isNodeHidden(node.getType()));

    return this.props.nodeTemplates.filter(node => node.getName().match(new RegExp(this.props.searchedText, 'i')));
  }

  renderNodes(nodes){
    const nodeTemplates = nodes.map((nodeTemplate, index) => {
      const model = nodeTemplate.getModel();
      return new model({
        position: { x: (this.wrapperElem.offsetWidth - nodeTemplate.getWidth())/2, y: (nodeTemplate.getHeight()+nodeMargin)*index },
         // TODO: [High] Let Adaptor's authors decide the size ==> Figure out centering & scaling to fit
      })
    });

    nodeTemplates.forEach(nodeTemplate => this.graph.addCell(nodeTemplate));
  }

  componentDidMount() {
    this.wrapperElem = findDOMNode(this.refs.placeholder);

    const nodes = this.filterOutNodes();
    let nodesHeight = 0; nodes.forEach(nodeTemplate => nodesHeight += nodeTemplate.getHeight());
    const totalHeight = nodesHeight + (nodes.length - 1) * nodeMargin;
    this.paper = new joint.dia.Paper({
      el: this.wrapperElem,
      width: this.wrapperElem.offsetWidth,
      height: totalHeight,
      model: this.graph,
      interactive: false
    });

    // TODO: [Q] setTimeout - Any better solution?
    setTimeout(() => {
      this.paper.setDimensions(this.wrapperElem.offsetWidth, totalHeight);

      // Drag&drop of nodes with hack for props to propagate and create dragged div
      this.paper.on('cell:pointerdown', function(cellView, e, x, y) {
        this.setState({isDragging: true});
        this.onDrag(cellView, e, x, y);
      }.bind(this));

      this.renderNodes(nodes);
    }, 0);
  }

  componentDidUpdate() {
    // Rerender nodes only when there is searching ongoing
    if(this.lastSearch != this.props.searchedText
        || this.lastDisplayHiddenNodes != this.props.displayHiddenNodes) {
      this.lastSearch = this.props.searchedText;
      this.lastDisplayHiddenNodes = this.props.displayHiddenNodes;

      const nodes = this.filterOutNodes();
      if(nodes.length == 0){
        this.paper.el.style.display = 'none';
      }else{
        this.paper.el.style.display = 'block';
        this.graph.clear();
        const totalHeight = nodes.length * nodeHeight + (nodes.length - 1) * nodeMargin;
        this.paper.setDimensions(this.wrapperElem.offsetWidth, totalHeight);
        this.renderNodes(nodes);
      }
    }
  }


  render(){
    return (
      <div className={styles.container}>
        <div className={styles.groupName}>{this.props.name}</div>
        <div ref="placeholder"></div>
        {this.state.isDragging && <div ref="flyPaper" style={{cursor: 'default', position:'fixed', zIndex:100, opacity:.7, pointerEvent:'none'}}></div>}
      </div>
    )
  }
}

NodesGroup.propTypes = {
  name: React.PropTypes.string.isRequired,
  nodeTemplates: React.PropTypes.array.isRequired,
  searchedText: React.PropTypes.string,
  displayHiddenNodes: React.PropTypes.bool
};

const mapStateToProps = (state) => {
  const activeFile = state.getIn(['files', 'active']);
  return {
    canvasContainerSpec: state.getIn(['ui', 'canvasContainerSpec']),
    language: state.getIn(['files', 'opened', activeFile, 'language']),
    usedVariables: state.getIn(['files', 'opened', activeFile, 'history', 'present', 'usedVariables']).toJS(),
    adapter: state.getIn(['files', 'opened', activeFile, 'adapter']),
    adapterVersion: state.getIn(['files', 'opened', activeFile, 'adapterVersion']),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNodeAndVariable: (nodeObject, variableName) => dispatch(
      addNodeAndUpdateVariables([{nid: nodeObject.id, newVariableName: variableName}], nodeObject)
    ),
    addNode: (node) => {
      dispatch(addNode(node));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NodesGroup);


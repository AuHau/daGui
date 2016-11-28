import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';
import joint from 'jointjs';

import cssVariables from '!!sass-variable-loader!../../variables.scss';
import styles from './NodesGroup.scss';

const nodeWidth = parseInt(cssVariables.nodesSidebarNodeWidth);
const nodeHeight = parseInt(cssVariables.nodesSidebarNodeHeight);
const nodeMargin = parseInt(cssVariables.nodesSidebarMargin);

export default class NodesGroup extends Component {
  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
  }

  filterOutNodes(){
    if(!this.props.searchedText || this.props.searchedText == '') return this.props.nodes;

    return this.props.nodes.filter(node => node.getName().includes(this.props.searchedText));
  }

  renderNodes(nodes){
    const centeredPositionX = (this.wrapperElem.offsetWidth - nodeWidth)/2;
    const nodeTemplates = nodes.map((nodeTemplate, index) => {
      const model = nodeTemplate.getModel();
      const margin = (index == 0? 0: nodeMargin);
      return new model({
        position: { x: centeredPositionX, y: nodeHeight*index + margin },
        size: { width: nodeWidth, height: nodeHeight },
        attrs: { text : { text: nodeTemplate.getName() }}
      })
    });

    nodeTemplates.forEach(nodeTemplate => this.graph.addCell(nodeTemplate));
  }

  componentDidMount() {
    this.wrapperElem = findDOMNode(this.refs.placeholder);

    // TODO: setTimeout - Any better solution?
    setTimeout(() => {
      const nodes = this.filterOutNodes();
      const totalHeight = nodes.length * nodeHeight + (nodes.length - 1) * nodeMargin;
      this.paper = new joint.dia.Paper({
        el: this.wrapperElem,
        width: this.wrapperElem.offsetWidth,
        height: totalHeight,
        model: this.graph,
        interactive: false
      });

      this.renderNodes(nodes);
    }, 0);
  }

  componentDidUpdate(){
    this.graph.clear();
    const nodes = this.filterOutNodes();
    const totalHeight = nodes.length * nodeHeight + (nodes.length - 1) * nodeMargin;
    this.paper.setDimensions(this.wrapperElem.offsetWidth, totalHeight);
    this.renderNodes(nodes);
  }


  render(){
    return (
      <div className={styles.container}>
        <div className={styles.groupName}>{this.props.name}</div>
        <div ref="placeholder"></div>
      </div>
    )
  }
}

NodesGroup.propTypes = {
  name: React.PropTypes.string.isRequired,
  nodes: React.PropTypes.array.isRequired,
  searchedText: React.PropTypes.string
};

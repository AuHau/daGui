import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';
import joint from 'jointjs';

import cssVariables from '!!sass-variable-loader!../../variables.scss';
import styles from './NodesGroup.scss';

const nodeHeight = parseInt(cssVariables.nodesSidebarNodeHeight);

export default class NodesGroup extends Component {
  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
  }

  componentDidMount() {
    const wrapperElem = findDOMNode(this.refs.placeholder);

    let totalHeight = this.props.nodes.length * nodeHeight;
    this.paper = new joint.dia.Paper({
      el: wrapperElem,
      width: wrapperElem.offsetWidth,
      height: totalHeight,
      model: this.graph,
      gridSize: 1
    });

    const nodeTemplates = this.props.nodes.map((nodeTemplate, index) => {
      const model = nodeTemplate.getModel();
      return new model({
        position: { x: 0, y: nodeHeight*index },
        size: { width: 60, height: nodeHeight },
        attrs: { text : { text: nodeTemplate.getName() }}
      })
    });

    nodeTemplates.forEach(nodeTemplate => {
      this.graph.addCell(nodeTemplate)
    });
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
  name: React.PropTypes.string,
  nodes: React.PropTypes.array
};

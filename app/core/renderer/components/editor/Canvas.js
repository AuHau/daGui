// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'

import joint from 'jointjs';
import styles from "./Canvas.scss";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
  }

  onResize(){
    const wrapperElem = findDOMNode(this.refs.placeholder);
    this.paper.setDimensions(wrapperElem.offsetWidth, wrapperElem.offsetHeight);
  }

  componentDidMount() {
    const wrapperElem = findDOMNode(this.refs.placeholder);

    this.paper = new joint.dia.Paper({
      el: wrapperElem,
      width: wrapperElem.offsetWidth,
      height: 1000,
      model: this.graph,
      gridSize: 1
    });
    setTimeout(this.onResize.bind(this), 10);

    this.graph.fromJSON(this.props.graphJson);
  }

  componentDidUpdate(){
    this.graph.fromJSON(this.props.graphJson);
  }

  render() {
    return <div ref="placeholder" className={styles.container}></div>;
  }
}

const mapStateToProps = (state) => {
  return {
    graphJson: state.graphs[state.files.active]
  };
};

export default connect(mapStateToProps)(Canvas);

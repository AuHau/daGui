// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'

import joint from 'jointjs';
import styles from "./Canvas.scss";

import {canvasResize} from '../../../shared/actions/ui';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
  }

  onResize(){
    const wrapperElem = findDOMNode(this.refs.placeholder);
    this.paper.setDimensions(wrapperElem.offsetWidth, wrapperElem.offsetHeight);
    this.props.onCanvasResize(wrapperElem.getBoundingClientRect());
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
    graphJson: state.getIn(['graphs', state.getIn(['files', 'active'])]).toJS()
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      onCanvasResize: (dimensions) => {
        dispatch(canvasResize(dimensions));
      }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

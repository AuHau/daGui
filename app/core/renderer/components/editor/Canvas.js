// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'

import joint from 'jointjs';
import styles from "./Canvas.scss";

import {canvasResize} from '../../../shared/actions/ui';
import {moveNode} from '../../../shared/actions/graph';

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

    this.graph.fromJSON(this.props.graphJson.toJS());
    this.paper.on('cell:pointerup', (cellView, e, x, y) => this.props.onNodeMove(cellView.model.id, x, y, this.props.activeFile));
  }

  componentDidUpdate(){
    // TODO: Optimalization - don't update when the action was created by graph's event
    this.graph.fromJSON(this.props.graphJson.toJS());
  }

  render() {
    return <div ref="placeholder" className={styles.container}></div>;
  }
}

const mapStateToProps = (state) => {
  const activeFile = state.getIn(['files', 'active']);
  return {
    graphJson: state.getIn(['graphs', activeFile]),
    activeFile
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      onCanvasResize: (dimensions) => {
        dispatch(canvasResize(dimensions));
      },
      onNodeMove: (nid, x, y, activeFile) => {
        dispatch(moveNode(nid, x, y, activeFile));
      }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

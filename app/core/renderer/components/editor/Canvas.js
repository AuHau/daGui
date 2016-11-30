// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'

import joint from 'jointjs';
import styles from "./Canvas.scss";

import {canvasResize} from '../../../shared/actions/ui';
import * as graphActions from '../../../shared/actions/graph';

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

  onNodeMove(cellView, e, x, y){
    this.props.onNodeMove(cellView.model.id, x, y, this.props.activeFile);
  }

  onLinkUpdate(cellView, e, magnet, arrowhead){
    const link = cellView.model;

    // Don't allow link which are not connecting nodes
    if(!link.getTargetElement() || !link.getSourceElement()){
      this.props.onLinkDelete(link.id, this.props.activeFile);
      link.remove();
      return;
    }

    this.props.onLinkUpdate(link.toJSON(), this.props.activeFile);
  }

  componentDidMount() {
    const wrapperElem = findDOMNode(this.refs.placeholder);

    this.paper = new joint.dia.Paper({
      el: wrapperElem,
      width: wrapperElem.offsetWidth,
      height: 1000,
      model: this.graph,
      gridSize: 1,

      markAvailable: true,
      snapLinks: { radius: 40 },
      defaultLink: new joint.dia.Link({
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
      }),
      validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
        if (cellViewS === cellViewT) return false;
        return magnetT && magnetT.getAttribute('port-group') === 'in';
      }
    });
    setTimeout(this.onResize.bind(this), 10);

    this.graph.fromJSON(this.props.graphJson.toJS());
    this.paper.on('cell:pointerup', this.onNodeMove.bind(this));
    this.paper.on('link:connect link:disconnect', this.onLinkUpdate.bind(this));
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
        dispatch(graphActions.moveNode(nid, x, y, activeFile));
      },
      onLinkUpdate: (linkObject, activeFile) => {
        dispatch(graphActions.updateLink(linkObject, activeFile));
      },
      onLinkDelete: (lid, activeFile) => {
        dispatch(graphActions.deleteLink(lid, activeFile));
      }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

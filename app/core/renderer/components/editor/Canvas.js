// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'

import joint from 'jointjs';
import styles from "./Canvas.scss";

import {changeNodeDetail, canvasResize} from '../../../shared/actions/ui';
import * as graphActions from '../../../shared/actions/graph';

const CLICK_TRESHOLD = 10;

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
    this.currentDetailCell = null;
    this.startingPointerPosition = null;
  }

  onResize(){
    const wrapperElem = findDOMNode(this.refs.placeholder);
    this.paper.setDimensions(wrapperElem.offsetWidth, wrapperElem.offsetHeight);
    this.props.onCanvasResize(wrapperElem.getBoundingClientRect());
  }

  onNodeMove(cellView){
    if(cellView.model.attributes.type != 'link'){
      const newPosition = cellView.model.attributes.position;
      this.props.onNodeMove(cellView.model.id, newPosition.x, newPosition.y);
    }
  }

  onLinkUpdate(cellView){
    this.props.onLinkUpdate(cellView.model.toJSON());
  }

  onDelete(element){
    this.props.onElementDelete(element.id);
  }

  onNodeDetail(cellView){
    // blank:pointerclick event
    if(cellView.originalEvent){
      if(this.currentDetailCell){
        this.currentDetailCell.unhighlight();
        this.props.onNodeDetail(null);
        this.currentDetailCell = null;
      }
      return;
    }

    if(cellView === this.currentDetailCell
        || cellView.model.attributes.type == 'link'){
      return;
    }

    cellView.highlight();
    if(this.currentDetailCell) this.currentDetailCell.unhighlight();
    this.currentDetailCell = cellView;

    this.props.onNodeDetail(cellView.model.id);
  }


  componentDidMount() {
    const wrapperElem = findDOMNode(this.refs.placeholder);

    this.paper = new joint.dia.Paper({
      el: wrapperElem,
      width: wrapperElem.offsetWidth,
      height: 1000,
      model: this.graph,
      gridSize: 1,

      clickThreshold: 1,
      linkPinning: false,
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
    this.paper.on('cell:pointerdown', this.onPointerDown.bind(this));
    this.paper.on('cell:pointerup', this.onPointerUp.bind(this));
    this.paper.on('blank:pointerclick', this.onNodeDetail.bind(this));
    this.paper.on('link:connect', this.onLinkUpdate.bind(this));
    this.graph.on('remove', this.onDelete.bind(this));
  }

  componentDidUpdate(){
    // TODO: Optimalization - don't update when the action was created by graph's event
    this.graph.fromJSON(this.props.graphJson.toJS());

    if(this.props.detailNodeId){
      const detailNode = this.graph.getCell(this.props.detailNodeId);
      this.paper.findViewByModel(detailNode).highlight();
    }
  }

  render() {
    return <div ref="placeholder" className={styles.container}></div>;
  }

  onPointerDown(cellView, e, x, y){
    this.startingPointerPosition = {x, y};
  }

  onPointerUp(cellView, e, x, y){
    if(Math.abs(this.startingPointerPosition.x - x) < CLICK_TRESHOLD
        && Math.abs(this.startingPointerPosition.y - y) < CLICK_TRESHOLD) {
      // Click
      this.onNodeDetail(cellView);
    }else{
      // Drag
      this.onNodeMove(cellView);
    }

    this.startingPointerPosition = null;
  }
}

const mapStateToProps = (state) => {
  const activeFile = state.getIn(['files', 'active']);
  return {
    graphJson: state.getIn(['files', 'opened', activeFile, 'graph']),
    detailNodeId: state.getIn('ui.detailNodeId'.split('.'))
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      onCanvasResize: (dimensions) => {
        dispatch(canvasResize(dimensions));
      },
      onNodeMove: (nid, x, y) => {
        dispatch(graphActions.moveNode(nid, x, y));
      },
      onLinkUpdate: (linkObject) => {
        dispatch(graphActions.updateLink(linkObject));
      },
      onElementDelete: (lid) => {
        dispatch(graphActions.deleteElement(lid));
      },
      onNodeDetail: (nid) => {
        dispatch(changeNodeDetail(nid));
      }
    }
};

Canvas.propTypes = {
  highlight: React.PropTypes.string,
  onHighlight: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

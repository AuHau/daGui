// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'

import joint from 'jointjs';
import {countInPorts} from '../../../graph/graphToolkit';
import styles from "./Canvas.scss";

import {changeNodeDetail, canvasResize} from '../../../shared/actions/ui';
import * as graphActions from '../../../shared/actions/graph';

const CLICK_TRESHOLD = 5;
const VARIABLE_NAME_MAX_WIDTH = 150;
const VARIABLE_NAME_MIN_WIDTH = 30;

const getTextWidth = (text, font = '14px helvetica') => {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};


class Canvas extends Component {

  constructor(props) {
    super(props);
    this.graph = new joint.dia.Graph();
    this.currentDetailCell = null;
    this.startingPointerPosition = null;
    this.currentNidToHighlight = null;
    this.occupiedPorts = {};

    // TODO: Find better place to place this
    joint.setTheme('modern');
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
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } },
        smooth: true
      }),
      validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
        if (cellViewS === cellViewT) return false;
        if (!magnetT || magnetT.getAttribute('port-group') !== 'in') return false;

        const ports = this.occupiedPorts[cellViewT.model.id];
        return !ports || !ports.has(magnetT.getAttribute('port'));
      }.bind(this)
    });
    setTimeout(this.onResize.bind(this), 10);

    this.graph.fromJSON(this.props.graphJson.toJS());

    // Event listeners
    this.paper.on('cell:mouseout', this.onMouseOut.bind(this));
    this.paper.on('cell:mouseover', this.onMouseOver.bind(this));
    this.paper.on('cell:pointerdown', this.onPointerDown.bind(this));
    this.paper.on('cell:pointerup', this.onPointerUp.bind(this));
    this.paper.on('blank:pointerclick', this.onNodeDetail.bind(this));
    this.paper.el.addEventListener('input', this.onInput.bind(this));
    this.graph.on('remove', this.removeLink.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  componentDidUpdate(){
    // TODO: Optimalization - don't update when the action was created by graph's event or graph can be just modified
    this.graph.fromJSON(this.props.graphJson.toJS());
    this.variableNameIterator(this.graph.getElements());

    // On Blur/Focus of variable name input
    this.paper.el.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', this.onFocus.bind(this));
      input.addEventListener('blur', this.onBlur.bind(this));
      input.addEventListener('change', this.onVariableNameChange.bind(this));
    });

    if(this.props.detailNodeId){ // TODO: Fix - on DetailNode change double highlighting
      this.highlightNode(this.props.detailNodeId, styles.nodeDetail);
    }

    if(this.props.highlight){
      this.highlightNode(this.props.highlight, styles.nodeHover);
    }
  }

  highlightNode(nid, className = styles.nodeDetail){
    const detailNode = this.graph.getCell(nid);
    const view = this.paper.findViewByModel(detailNode);
    view.highlight(view.el.querySelectorAll('rect'), {     // TODO: Delegate returning element for highlightint to Node Template
      highlighter: {
        name: 'addClass',
        options: {
          className: className
        }
      }
    });
  }

  render() {
    return <div ref="placeholder" className={styles.container}></div>;
  }

  setVariableName(element, name){
    const parentNode = element.findView(this.paper).el;
    const input = parentNode.querySelectorAll('input')[0];
    input.value = name;

    const classList = parentNode.querySelectorAll('.variableName')[0].classList;
    classList.add.apply(classList, styles.active.split(' '));

    this.recalculateWidthOfVariableName(input);
  }

  variableNameIterator(elements){
    for(let elem of elements) {
      if(elem.attributes.dfGui.variableName){
        this.setVariableName(elem, elem.attributes.dfGui.variableName);
      }
    }
  }

  recalculateWidthOfVariableName(input){
    const width = getTextWidth(input.value) + 13;

    if(width < VARIABLE_NAME_MIN_WIDTH){
      input.parentNode.parentNode.setAttribute('width', VARIABLE_NAME_MIN_WIDTH);
    }else if(width > VARIABLE_NAME_MAX_WIDTH){
      input.parentNode.parentNode.setAttribute('width', VARIABLE_NAME_MAX_WIDTH);
    }else{
      input.parentNode.parentNode.setAttribute('width', width);
    }
  }

  addLink(cellView){
    const sourceElement = this.graph.getCell(cellView.model.attributes.source.id);
    const sourcesChildren = this.graph.getConnectedLinks(sourceElement, {outbound: true});
    if(sourcesChildren.length > 1){
      let childrenElement;
      for(let children of sourcesChildren) {
        childrenElement = this.graph.getCell(children.attributes.target.id);
        if(!childrenElement.attributes.dfGui.variableName){
          const variableName = this.props.language.nameNode(this.props.adapter.getNodeTemplates()[childrenElement.attributes.type], this.props.usedVariables);
          this.props.onUpdateVariable(childrenElement.id, variableName); // TODO: Batch adding the variable and adding link
        }
      }
      this.props.onNodeUpdate(cellView.model.toJSON());
    }else{
      this.props.onNodeUpdate(cellView.model.toJSON());
    }
    this.occupiedPorts[cellView.model.attributes.target.id] = (this.occupiedPorts[cellView.model.attributes.target.id] || new Set()).add(cellView.model.attributes.target.port);
  }

  removeLink(link){
    if(link.attributes.target.id){
      const sourceElement = this.graph.getCell(link.attributes.source.id);
      const targetElement = this.graph.getCell(link.attributes.target.id);
      const sourcesChildren = this.graph.getConnectedLinks(sourceElement, {outbound: true});
      if(sourcesChildren.length == 1){ // Delete variable only when going from 2 links to 1 link
        this.props.onRemoveVariable(sourcesChildren[0].attributes.target.id);
        this.props.onRemoveVariable(targetElement.id); // TODO: Batch deleting variables
        this.props.onLinkDelete(link.id);
      }else if(targetElement.attributes.dfGui.variableName && countInPorts(targetElement) == 1) {
        this.props.onLinkDeleteAndVariable(link.id, targetElement.id);
      }else{
        this.props.onLinkDelete(link.id);
      }

      this.occupiedPorts[link.attributes.target.id].delete(link.attributes.target.port);
    }
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

  onNodeDetail(cellView){
    // blank:pointerclick event
    if(cellView.originalEvent){
      if(this.currentDetailCell){
        this.props.onNodeDetail(null);
        this.currentDetailCell = null;
      }

      document.querySelectorAll('input').forEach(input => input.blur());
      return;
    }

    if(cellView === this.currentDetailCell
      || cellView.model.attributes.type == 'link'){
      return;
    }

    this.currentDetailCell = cellView;
    this.props.onNodeDetail(cellView.model.id);
  }

  onInput(e){
    this.recalculateWidthOfVariableName(e.target);
  }

  onVariableNameChange(e){
    const nodeId = e.target.closest('.joint-cell').getAttribute('model-id');
    this.props.onUpdateVariable(nodeId, e.target.value)
  }

  onFocus(e){
    const node = e.target.parentNode.parentNode.parentNode;
    node.classList.add.apply(node.classList, styles.focused.split(' '));
  }

  onBlur(e){
    const node = e.target.parentNode.parentNode.parentNode;
    node.classList.remove.apply(node.classList, styles.focused.split(' '));
  }

  onMouseOut(cellView, e){
    this.props.onHighlight(null);
  }

  onMouseOver(cellView, e){
    if(!this.props.showCodeView || cellView.model.isLink()) return;

    this.props.onHighlight(cellView.model.id);
  }

  onPointerDown(cellView, e, x, y){
    this.startingPointerPosition = {x, y};
  }

  onPointerUp(cellView, e, x, y){
    if(Math.abs(this.startingPointerPosition.x - x) < CLICK_TRESHOLD
        && Math.abs(this.startingPointerPosition.y - y) < CLICK_TRESHOLD) {
      // Click
      if(e.target && e.target.type == 'text'){
        e.target.focus();
      }else if(cellView.model.isElement()){
        this.onNodeDetail(cellView);
      }else if(
        cellView.model.isLink()
        && cellView.model.graph  // Needs to verify, that the click was not on remove button
      ) this.addLink(cellView)
    }else{
      // Drag node
      if(cellView.model.isElement()){
        this.onNodeMove(cellView);
      }else if(
        cellView.model.isLink()
        && cellView.model.attributes.target.id // Needs to verify, that the link is not left hanging in middle of nowhere
      ) this.addLink(cellView);
    }

    this.startingPointerPosition = null;
  }

  onKeyUp(e){
    if(e.keyCode == 46 && this.props.detailNodeId &&
      !(e.target.matches('input') || e.target.matches('[contenteditable]') || e.target.matches('textarea'))){
      const model = this.graph.getCell(this.props.detailNodeId);
      this.graph.getConnectedLinks(model, {outbound: true}).forEach(link => this.occupiedPorts[link.attributes.target.id].delete(link.attributes.target.port));

      this.props.onNodeDelete(this.props.detailNodeId);
    }
  }
}

const mapStateToProps = (state) => {
  const activeFile = state.getIn(['files', 'active']);
  return {
    language: state.getIn(['files', 'opened', activeFile, 'language']),
    usedVariables: state.getIn(['files', 'opened', activeFile, 'usedVariables']).toJS(),
    adapter: state.getIn(['files', 'opened', activeFile, 'adapter']),
    graphJson: state.getIn(['files', 'opened', activeFile, 'graph']),
    detailNodeId: state.getIn('ui.detailNodeId'.split('.')),
    showCodeView: state.getIn('ui.showCodeView'.split('.'))
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      addLinkAndVariable: (linkObject, nid, variableName) => {
        dispatch([
          graphActions.updateVariable(nid, variableName),
          graphActions.updateNode(linkObject)
        ]);
      },
      onUpdateVariable: (nid, newVariableName) => dispatch(graphActions.updateVariable(nid, newVariableName)),
      onRemoveVariable: (nid) => dispatch(graphActions.removeVariable(nid)),
      onCanvasResize: (dimensions) => dispatch(canvasResize(dimensions)),
      onNodeMove: (nid, x, y) => dispatch(graphActions.moveNode(nid, x, y)),
      onNodeUpdate: (elementObject) => dispatch(graphActions.updateNode(elementObject)),
      onNodeDelete: (id) => {
        dispatch([
          changeNodeDetail(null),
          graphActions.deleteNode(id)
        ]);
      },
      onLinkDelete: (id) => dispatch(graphActions.deleteNode(id)),
      onLinkDeleteAndVariable: (lid, nid) => dispatch([
        graphActions.removeVariable(nid),
        graphActions.deleteNode(lid)
      ]),
      onNodeDetail: (nid) => dispatch(changeNodeDetail(nid))
    }
};

Canvas.propTypes = {
  highlight: React.PropTypes.string,
  onHighlight: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

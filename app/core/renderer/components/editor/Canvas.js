// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'
import joint from 'jointjs';

import styles from "./Canvas.scss";

import CursorMode, {classTranslation as CursorClass} from 'shared/enums/CursorMode';
import {changeNodeDetail, canvasResize} from 'shared/actions/ui';
import * as graphActions from 'shared/actions/graph';

// Canvas components
import PanAndZoom from './canvas_components/PanAndZoom';
import Grid from './canvas_components/Grid';
import Link from './canvas_components/Link';
import Nodes from './canvas_components/Nodes';
import Highlights from './canvas_components/Highlights';
import Variables from './canvas_components/Variables';
import Selecting from './canvas_components/Selecting';

class Canvas extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cursorMode: props.cursorMode
    };

    this.CLICK_TRESHOLD = 2;

    // Canvas components
    this.canvasComponents = {};
    this.canvasComponents['grid'] = new Grid(this);
    this.canvasComponents['panAndZoom'] = new PanAndZoom(this);
    this.canvasComponents['link'] = new Link(this);
    this.canvasComponents['nodes'] = new Nodes(this);
    this.canvasComponents['highlights'] = new Highlights(this);
    this.canvasComponents['variables'] = new Variables(this);
    this.canvasComponents['selecting'] = new Selecting(this);

    this.graph = new joint.dia.Graph();
    this.currentDetailCell = null;
    this.startingPointerPosition = null;
    this.freezed = false;
    this.ignoreAction = false;
    this.dontReloadGraph = false;

    // TODO: [Low] Find better place to place this
    joint.setTheme('modern');
  }

  iterateComponents(callMethod){
    for(let name in this.canvasComponents){
      if(!this.canvasComponents.hasOwnProperty(name)) continue;

      this.canvasComponents[name][callMethod]();
    }
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

        const ports = this.props.$occupiedPorts.get(cellViewT.model.id);
        return !ports || !ports.has(magnetT.getAttribute('port'));
      }.bind(this)
    });
    this.graph.fromJSON(this.props.graphJson);

    setTimeout(this.onResize.bind(this), 10);
    window.addEventListener('resize', this.onResize.bind(this));

    document.addEventListener('keydown', this.spaceKeyStart.bind(this));
    document.addEventListener('keyup', this.spaceKeyEnd.bind(this));

    // Init of Canvas components
    this.iterateComponents('init');
  }

  spaceKeyStart(e){
    if (e.keyCode == '32'
        && !(e.target.matches('input') || e.target.matches('[contenteditable]') || e.target.matches('textarea'))) {
      this.spaceKey = true;
      this.dontReloadGraph = true;
      this.setState({cursorMode: CursorMode.PAN});
    }
  }

  spaceKeyEnd(e){
    if (e.keyCode == '32'
      && !(e.target.matches('input') || e.target.matches('[contenteditable]') || e.target.matches('textarea'))) {
      this.spaceKey = false;
      this.dontReloadGraph = true;
      this.setState({cursorMode: this.props.cursorMode});
    }
  }

  componentDidUpdate(){
    // TODO: [Low] Optimalization - don't update when the action was created by graph's event or graph can be just modified
    if(!this.dontReloadGraph){
      this.graph.fromJSON(this.props.graphJson);
    }else{
      this.dontReloadGraph = false;
    }

    // Update Canvas components
    this.iterateComponents('afterUpdate');
  }

  componentWillReceiveProps(nextProps){
    if(this.props.cursorMode != nextProps.cursorMode){
      this.setState({cursorMode: nextProps.cursorMode});
    }
  }

  shouldComponentUpdate(){
    if(this.ignoreAction){
      this.ignoreAction = false;
      return false;
    }

    return !this.freezed;
  }

  render() {
    let cursorClass = styles[CursorClass[this.state.cursorMode]];

    return <div ref="placeholder" className={styles.container + ' ' + cursorClass}></div>;
  }

  onResize(){
    const wrapperElem = findDOMNode(this.refs.placeholder);
    this.paper.setDimensions(wrapperElem.offsetWidth, wrapperElem.offsetHeight);
    this.props.onCanvasResize(wrapperElem.getBoundingClientRect());
  }
}

const mapStateToProps = (state) => {
  const activeFile = state.getIn(['files', 'active']);
  return {
    language: state.getIn(['files', 'opened', activeFile, 'language']),
    usedVariables: state.getIn(['files', 'opened', activeFile, 'history', 'present', 'usedVariables']).toJS(),
    adapter: state.getIn(['files', 'opened', activeFile, 'adapter']),
    graphJson: {'cells': state.getIn(['files', 'opened', activeFile,  'history', 'present', 'cells']).toJS()},
    detailNodeId: state.getIn('ui.detailNodeId'.split('.')),
    showCodeView: state.getIn('ui.showCodeView'.split('.')),
    cursorMode: state.getIn('ui.cursorMode'.split('.')),
    $occupiedPorts: state.getIn(['files', 'opened', activeFile, 'history', 'present', '$occupiedPorts']),
    zoom: state.getIn(['files', 'opened', activeFile, 'zoom']),
    $pan: state.getIn(['files', 'opened', activeFile, '$pan'])
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
      onLinkAdd: (linkObject, targetNid, targetPort) => dispatch(graphActions.addLink(linkObject, targetNid, targetPort)),
      onLinkDelete: (lid, targetNid, targetPort) => dispatch(graphActions.removeLink(lid, targetNid, targetPort)),
      onLinkDeleteAndVariable: (nid, lid, targetNid, targetPort) => dispatch([
        graphActions.removeVariable(nid),
        graphActions.removeLink(lid, targetNid, targetPort)
      ]),
      onNodeDetail: (nid) => dispatch(changeNodeDetail(nid)),
      onPan: (x,y) => dispatch(graphActions.pan(x,y)),
      onZoom: (scale, x, y) => dispatch(graphActions.zoom(scale, x, y))
    }
};

Canvas.propTypes = {
  onAddHighlight: React.PropTypes.func.isRequired,
  onRemoveHighlight: React.PropTypes.func.isRequired,
  onSwitchHighlight: React.PropTypes.func.isRequired,
  highlights: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object])
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'
import joint from 'jointjs';

import styles from "./Canvas.scss";

import {defaultLink} from 'graph/DefaultShape';
import CursorMode, {classTranslation as CursorClass} from 'shared/enums/CursorMode';
import {changeNodeDetail, canvasResize, resetSaveImage} from 'shared/actions/ui';
import * as graphActions from 'shared/actions/graph';

// Canvas components
import PanAndZoom from './canvas_components/PanAndZoom';
import Grid from './canvas_components/Grid';
import Link from './canvas_components/Link';
import Nodes from './canvas_components/Nodes';
import Highlights from './canvas_components/Highlights';
import Variables from './canvas_components/Variables';
import Selecting from './canvas_components/Selecting';
import SaveImage from './canvas_components/SaveImage';

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
    this.canvasComponents['saveImage'] = new SaveImage(this);

    this.graph = new joint.dia.Graph();
    this.currentDetailCell = null;
    this.startingPointerPosition = null;
    this.freezed = false;
    this.ignoreAction = false;
    this.dontReloadGraph = false;
    this.interactivity = true;

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
    const link = new defaultLink({
      smooth: true
    });
    link.attr({
      '.connection': {
        'stroke': {
          type: 'linearGradient',
          stops: [
            {offset: '0%', color: '#e74c3c'},
            {offset: '100%', color: '#1ab899'}
          ]
        }
      }
    });


    this.paper = new joint.dia.Paper({
      el: this.canvasWrapper,
      width: this.canvasWrapper.offsetWidth,
      height: 1000,
      model: this.graph,
      gridSize: 1,

      clickThreshold: 1,
      linkPinning: false,
      markAvailable: true,
      snapLinks: { radius: 40 },
      defaultLink: link,
      validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
        if (cellViewS === cellViewT) return false;
        if (!magnetT || magnetT.getAttribute('port-group') !== 'in') return false;

        const nodeDataOutput = this.props.adapter.getNodeTemplates()[cellViewS.model.attributes.type].getOutputDataType(this.props.language.getId());
        if (!this.props.adapter.getNodeTemplates()[cellViewT.model.attributes.type].isInputDataTypeValid(nodeDataOutput)){
          return false;
        }

        const ports = this.props.$occupiedPorts.get(cellViewT.model.id);
        return !ports || !ports.has(magnetT.getAttribute('port'));
      }.bind(this)
    });

    if (this.props.graphJson){
      this.graph.fromJSON(this.props.graphJson);
    }else{
      this.interactivity = false;
      this.paper.setInteractivity(false);
    }

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
    // No file to display ==> suspend the interactivity
    if(!this.props.graphJson){
      this.graph.fromJSON({cells: []});
      this.interactivity = false;
      this.paper.setInteractivity(false);
      return
    }else{
      if(!this.interactivity){
        this.paper.setInteractivity(true);
      }
    }

    // TODO: [Low] Optimalization - don't update when the action was created by graph's event or graph can be just modified
    if(!this.dontReloadGraph){
      if(!this.props.saveImage){ // When saving image, the graph does not need to be reloaded.
        this.graph.fromJSON(this.props.graphJson);
      }
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

    return <div ref={(e) => this.canvasWrapper = e} className={styles.container + ' ' + cursorClass}></div>;
  }

  onResize(){
    this.paper.setDimensions(this.canvasWrapper.offsetWidth, this.canvasWrapper.offsetHeight);
    this.props.onCanvasResize(this.canvasWrapper.getBoundingClientRect());
  }
}

const mapStateToProps = (state) => {
  const activeFile = state.getIn(['files', 'active']);

  if(activeFile < 0){
    return {
      detailNodeId: state.getIn('ui.detailNodeId'.split('.')),
      showCodeView: state.getIn('ui.showCodeView'.split('.')),
      cursorMode: state.getIn('ui.cursorMode'.split('.')),
    };
  }

  return {
    language: state.getIn(['files', 'opened', activeFile, 'language']),
    usedVariables: state.getIn(['files', 'opened', activeFile, 'history', 'present', 'usedVariables']).toJS(),
    adapter: state.getIn(['files', 'opened', activeFile, 'adapter']),
    adapterVersion: state.getIn(['files', 'opened', activeFile, 'adapterVersion']),
    name: state.getIn(['files', 'opened', activeFile, 'name']),
    graphJson: {'cells': state.getIn(['files', 'opened', activeFile,  'history', 'present', 'cells']).toJS()},
    detailNodeId: state.getIn('ui.detailNodeId'.split('.')),
    saveImage: state.getIn('ui.saveImage'.split('.')),
    showCodeView: state.getIn('ui.showCodeView'.split('.')),
    cursorMode: state.getIn('ui.cursorMode'.split('.')),
    $occupiedPorts: state.getIn(['files', 'opened', activeFile, 'history', 'present', '$occupiedPorts']),
    zoom: state.getIn(['files', 'opened', activeFile, 'zoom']),
    $pan: state.getIn(['files', 'opened', activeFile, '$pan'])
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      onUpdateVariable: (nid, newVariableName) => dispatch(graphActions.updateVariable(nid, newVariableName)),
      onUpdateVariables: (nodes) => dispatch(graphActions.updateVariables(nodes)),
      onRemoveVariable: (nid) => dispatch(graphActions.removeVariable(nid)),
      onCanvasResize: (dimensions) => dispatch(canvasResize(dimensions)),
      onNodesMove: (nodes) => dispatch(graphActions.moveNodes(nodes)),
      onNodeMove: (nid, x, y) => dispatch(graphActions.moveNode(nid, x, y)),
      onNodeUpdate: (elementObject) => dispatch(graphActions.updateNode(elementObject)),
      onNodeDelete: (id) => {
        dispatch([ // Batching these actions is OK as changeNodeDetail does not manipulate with history (there is only one history-manipulation action)
          changeNodeDetail(null),
          graphActions.deleteNode(id)
        ]);
      },
      onNodesDelete: (nodes) => {dispatch(graphActions.deleteNodes(nodes))},
      onLinkAddAndUpdateVariables: (variables, linkObject, targetNid, targetPort) => dispatch(graphActions.onLinkAddAndUpdateVariables(variables, linkObject, targetNid, targetPort)),
      onLinkAdd: (linkObject, targetNid, targetPort) => dispatch(graphActions.addLink(linkObject, targetNid, targetPort)),
      onLinkDelete: (lid, targetNid, targetPort) => dispatch(graphActions.removeLink(lid, targetNid, targetPort)),
      onLinkDeleteAndVariables: (nid, lid, targetNid, targetPort) => dispatch(graphActions.removeLinkAndVariables(Array(nid), lid, targetNid, targetPort)),
      onNodeDetail: (nid) => dispatch(changeNodeDetail(nid)),
      onPan: (x,y) => dispatch(graphActions.pan(x,y)),
      onZoom: (scale, x, y) => dispatch(graphActions.zoom(scale, x, y)),
      onAddSelected: (nid) => dispatch(graphActions.addSelected(nid)),
      onRemoveSelected: (nid) => dispatch(graphActions.removeSelected(nid)),
      onSaveImageReset: () => dispatch(resetSaveImage()),
    }
};

Canvas.propTypes = {
  onAddHighlight: React.PropTypes.func.isRequired,
  onRemoveHighlight: React.PropTypes.func.isRequired,
  onSwitchHighlight: React.PropTypes.func.isRequired,
  highlights: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object])
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

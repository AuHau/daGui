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
    this.state = {isDragging: false};
    this.lastSearch = '';
  }

  onDrag(cellView, e, x, y) {
    const dragElem = findDOMNode(this.refs.flyPaper);

    const flyGraph = new joint.dia.Graph;
    new joint.dia.Paper({
      el: dragElem,
      model: flyGraph,
      interactive: false
    });
    const flyShape = cellView.model.clone();
    const offset = {
      x: x - cellView.model.position().x,
      y: y - cellView.model.position().y
    };

    flyShape.position(0, 0);
    flyGraph.addCell(flyShape);
    dragElem.style.left = e.pageX - offset.x + 'px';
    dragElem.style.top = e.pageY - offset.y + 'px';

    // Moving flyPaper
    const moveHandler = (e) => {
      dragElem.style.left = e.clientX - offset.x + 'px';
      dragElem.style.top = e.clientY - offset.y + 'px';
    };

    // Dropping element
    const dropHandler = (e) => {
      var x = e.clientX,
        y = e.clientY,
        canvas = this.props.canvasContainerSpec;

      // Dropped over paper ?
      if (x > canvas.left && x < canvas.left + canvas.width && y > canvas.top && y < canvas.top + canvas.height) {
        var s = flyShape.clone();
        s.position(x - canvas.left - offset.x, y - canvas.top - offset.y);

        // TODO: Redux send action
        console.log(s.toJSON());
      }

      // Cleap up
      flyShape.remove();
      document.body.removeEventListener('mousemove', moveHandler);
      document.body.removeEventListener('mouseup', dropHandler);
      this.setState({isDragging: false})
    };

    document.body.addEventListener('mousemove', moveHandler);
    document.body.addEventListener('mouseup', dropHandler);
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

    const nodes = this.filterOutNodes();
    const totalHeight = nodes.length * nodeHeight + (nodes.length - 1) * nodeMargin;
    this.paper = new joint.dia.Paper({
      el: this.wrapperElem,
      width: this.wrapperElem.offsetWidth,
      height: totalHeight,
      model: this.graph,
      interactive: false
    });

    // TODO: setTimeout - Any better solution?
    setTimeout(() => {
      this.paper.setDimensions(this.wrapperElem.offsetWidth, totalHeight);

      // Drag&drop of nodes with hack for props to propagate and create dragged div
      this.paper.on('cell:pointerdown', function(cellView, e, x, y) {
        this.setState({isDragging: true});
        this.onDrag(cellView, e, x, y);
      }.bind(this));

      this.renderNodes(nodes);
    }, 0);
  }

  componentDidUpdate(){
    // Rerender nodes only when there is searching ongoing
    if(this.lastSearch != this.props.searchedText){
      this.graph.clear();
      const nodes = this.filterOutNodes();
      const totalHeight = nodes.length * nodeHeight + (nodes.length - 1) * nodeMargin;
      this.paper.setDimensions(this.wrapperElem.offsetWidth, totalHeight);
      this.renderNodes(nodes);
      this.lastSearch = this.props.searchedText;
    }
  }


  render(){
    return (
      <div className={styles.container}>
        <div className={styles.groupName}>{this.props.name}</div>
        <div ref="placeholder"></div>
        {this.state.isDragging && <div ref="flyPaper" style={{cursor: 'default', position:'fixed', zIndex:100, opacity:.7, pointerEvent:'none'}}></div>}
      </div>
    )
  }
}

NodesGroup.propTypes = {
  name: React.PropTypes.string.isRequired,
  nodes: React.PropTypes.array.isRequired,
  canvasContainerSpec: React.PropTypes.object.isRequired,
  searchedText: React.PropTypes.string
};

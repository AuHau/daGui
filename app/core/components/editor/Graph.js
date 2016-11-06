// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import joint from 'jointjs';
import styles from "./Graph.scss";

const State = joint.shapes.basic.Circle.extend({
  defaults: Object.assign({
    type: 'fsa.State',
    attrs: {
      circle: { 'stroke-width': 3 },
      text: { 'font-weight': '800' }
    }
  }, joint.shapes.basic.Circle.prototype.defaults)
});

const StartState = joint.dia.Element.extend({

  markup: '<g class="rotatable"><g class="scalable"><circle/></g></g>',

  defaults: Object.assign({

    type: 'fsa.StartState',
    size: { width: 20, height: 20 },
    attrs: {
      circle: {
        transform: 'translate(10, 10)',
        r: 10,
        fill: '#000000'
      }
    }

  }, joint.dia.Element.prototype.defaults)
});

const EndState = joint.dia.Element.extend({

  markup: '<g class="rotatable"><g class="scalable"><circle class="outer"/><circle class="inner"/></g></g>',

  defaults: Object.assign({

    type: 'fsa.EndState',
    size: { width: 20, height: 20 },
    attrs: {
      '.outer': {
        transform: 'translate(10, 10)',
        r: 10,
        fill: '#ffffff',
        stroke: '#000000'
      },

      '.inner': {
        transform: 'translate(10, 10)',
        r: 6,
        fill: '#000000'
      }
    }

  }, joint.dia.Element.prototype.defaults)
});

const Arrow = joint.dia.Link.extend({

  defaults: Object.assign({
    type: 'fsa.Arrow',
    attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }},
    smooth: true
  }, joint.dia.Link.prototype.defaults)
});

export default class Graph extends Component {
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
    console.log(wrapperElem.offsetHeight);

    this.paper = new joint.dia.Paper({
      el: wrapperElem,
      width: wrapperElem.offsetWidth,
      height: 1000,
      model: this.graph,
      gridSize: 1
    });
    setTimeout(this.onResize.bind(this), 10);


    const state = function(graph, x, y, label) {

      var cell = new State({
        position: { x: x, y: y },
        size: { width: 60, height: 60 },
        attrs: { text : { text: label }}
      });
      graph.addCell(cell);
      return cell;
    };

    const link = function(graph, source, target, label, vertices) {

      var cell = new Arrow({
        source: { id: source.id },
        target: { id: target.id },
        labels: [{ position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],
        vertices: vertices || []
      });
      graph.addCell(cell);
      return cell;
    };

    var start = new StartState({ position: { x: 50, y: 530 } });
    this.graph.addCell(start);

    var code  = state(this.graph, 180, 390, 'code');
    var slash = state(this.graph, 340, 220, 'slash');
    var star  = state(this.graph, 600, 400, 'star');
    var line  = state(this.graph, 190, 100, 'line');
    var block = state(this.graph, 560, 140, 'block');

    link(this.graph, start, code,  'start');
    link(this.graph, code,  slash, '/');
    link(this.graph, slash, code,  'other', [{x: 270, y: 300}]);
    link(this.graph, slash, line,  '/');
    link(this.graph, line,  code,  'new\n line');
    link(this.graph, slash, block, '*');
    link(this.graph, block, star,  '*');
    link(this.graph, star,  block, 'other', [{x: 650, y: 290}]);
    link(this.graph, star,  code,  '/',     [{x: 490, y: 310}]);
    link(this.graph, line,  line,  'other', [{x: 115,y: 100}, {x: 250, y: 50}]);
    link(this.graph, block, block, 'other', [{x: 485,y: 140}, {x: 620, y: 90}]);
    link(this.graph, code,  code,  'other', [{x: 180,y: 500}, {x: 305, y: 450}]);

  }

  render() {
    return <div ref="placeholder" className={styles.container}></div>;
  }
}

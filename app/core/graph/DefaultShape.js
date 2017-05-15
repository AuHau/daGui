import joint from 'jointjs';

import styles from './DefaultShape.scss';
import cssVariables from '!!sass-variable-loader!renderer/variables.scss';

const PORT_DEFINITION = {
  'in': {
    position: {
      name: 'left'
    },
    attrs: {
      '.port-body': {
        fill: cssVariables.portInColor,
        r: 4,
        magnet: 'passive'
      }
    }
  },
  'out': {
    position: {
      name: 'right',
      args: {
        dx: 40
      }
    },
    attrs: {
      '.port-body': {
        fill: cssVariables.portOutColor,
        r: 4,
        magnet: true
      }
    }
  }
};

const NAME = 'DefaultShape';
const NODE_TYPE = 'dfGui.defaultShape';
const MODEL = joint.shapes.basic.Generic.extend({
  markup: '<g class="rotatable"><rect/><text/><g class="variableName ' + styles.variableNameWrapper + '"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml"><input type="text"/></div></foreignObject></g></g>',
  portMarkup: '<circle class="port-body"/>',

  defaults: joint.util.deepSupplement({
    type: NODE_TYPE,
    size: {
      width: 130,
      height: 30
    },
    attrs: {
      '.': {
        magnet: false
      },
      'rect': {
        fill: cssVariables.nodeBackground,
        stroke: cssVariables.nodeBackground,
        width: 100,
        height: 30,
        rx: 2,
        ry: 2
      },
      'text': {
        fill: cssVariables.nodeColor,
        text: NAME,
        'font-size': 14,
        'ref-x': .5,
        'ref-y': .5,
        'ref': 'rect',
        'text-anchor': 'middle',
        'y-alignment': 'middle',
        'font-family': 'Montserrat, sans-serif'
      },
      foreignObject: {
        width: 30,
        height: 26,
        ref: 'rect',
        "ref-dx": 10,
        y: -37
      }
    },
    dfGui: {
      description: NAME,
      variableName: null,
      parameters: [],
    },
    ports: {
      groups: PORT_DEFINITION
    }
  }, joint.shapes.basic.Generic.prototype.defaults)
});

if(!joint.shapes['dfGui']) joint.shapes['dfGui'] = {};
joint.shapes['dfGui']['defaultShape'] = MODEL;

export default MODEL;

// Link definition
export const defaultLink = joint.dia.Link.extend({
  markup: [
    '<path class="connection" stroke="orange" stroke-width="3" d="M 0 0 0 0"/>',
    '<path class="marker-source" fill="black" stroke="black" d="M 0 0 0 0"/>',
    '<path class="marker-target" fill="black" stroke="black" d="M 0 0 0 0"/>',
    '<path class="connection-wrap" stroke-width="5px" d="M 0 0 0 0"/>',
    '<g class="labels"/>',
    '<g class="marker-vertices"/>',
    '<g class="marker-arrowheads"/>',
    '<g class="link-tools"/>'
  ].join(''),

  arrowheadMarkup: [
    '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
    '</g>'
  ].join('')
});


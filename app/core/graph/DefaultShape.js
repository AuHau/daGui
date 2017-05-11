import joint from 'jointjs';

import portDefinition from './portDefinition';
import styles from './DefaultShape.scss';
import cssVariables from '!!sass-variable-loader!renderer/variables.scss';

const NAME = 'DefaultShape';
const NODE_TYPE = 'dfGui.defaultShape';
const MODEL = joint.shapes.basic.Generic.extend({
  markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/><g class="variableName ' + styles.variableNameWrapper + '"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml"><input type="text"/></div></foreignObject></g></g>',
  portMarkup: '<circle class="port-body"/>',

  defaults: joint.util.deepSupplement({
    type: NODE_TYPE,
    size: {
      width: 170,
      height: 30
    },
    attrs: {
      '.': {
        magnet: false
      },
      'rect': {
        fill: cssVariables.nodeBackground,
        stroke: cssVariables.nodeBackground,
        width: 170,
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
        'text-anchor': 'middle',
        'y-alignment': 'middle',
        'font-family': 'Montserrat, sans-serif'
      },
      foreignObject: {
        width: 30,
        height: 26,
        x: 70,
        y: -33
      }
    },
    dfGui: {
      description: NAME,
      variableName: null,
      parameters: [],
    },
    ports: {
      groups: portDefinition
    }
  }, joint.shapes.basic.Generic.prototype.defaults)
});

if(!joint.shapes['dfGui']) joint.shapes['dfGui'] = {};
joint.shapes['dfGui']['defaultShape'] = MODEL;

export default MODEL;

// Link definition
export const link = joint.dia.Link.extend({
    arrowheadMarkup: [
  '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
  '<circle class="marker-arrowhead" cx="20" cy="20" r="15"></circle>',
  '</g>'
].join('')
});


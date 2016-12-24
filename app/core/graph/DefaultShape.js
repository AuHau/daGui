import joint from 'jointjs';

import portDefinition from './portDefinition';
import styles from './DefaultShape.scss';

const NAME = 'DefaultShape';
const NODE_TYPE = 'dfGui.defaultShape';
const MODEL = joint.shapes.basic.Generic.extend({
  markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/><g class="variableName ' + styles.variableNameWrapper + '"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml"><input type="text"/></div></foreignObject></g></g>',
  portMarkup: '<circle class="port-body"/>',

  defaults: joint.util.deepSupplement({
    type: NODE_TYPE,
    size: {
      width: 100,
      height: 60
    },
    attrs: {
      '.': {
        magnet: false
      },
      'rect': {
        fill: '#ffffff',
        stroke: '#000000',
        width: 100,
        height: 60
      },
      'text': {
        fill: '#000000',
        text: NAME,
        'font-size': 14,
        'ref-x': .5,
        'ref-y': .5,
        'text-anchor': 'middle',
        'y-alignment': 'middle',
        'font-family': 'Arial, helvetica, sans-serif'
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

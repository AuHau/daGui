import joint from 'jointjs';

import portDefinition from './portDefinition';

const NAME = 'DefaultShape';
const NODE_TYPE = 'dfGui.defaultShape';
const MODEL = joint.shapes.basic.Generic.extend({
  markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',
  portMarkup: '<circle class="port-body"/>',

  defaults: joint.util.deepSupplement({
    type: NODE_TYPE,
    size: {
      width: 80,
      height: 80
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
      }
    },
    dfGui: {
      description: NAME,
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

import joint from 'jointjs';
import _ from 'lodash';

import portDefinition from '../../../core/graph/portDefinition';
import NodeTemplate from '../../../core/graph/NodeTemplate';

const NAME = 'Parallelize';
const NODE_TYPE = 'spark.parallelize';
const MODEL = joint.shapes.basic.Rect.extend({
  portMarkup: '<circle class="port-body"/>',
  defaults: _.defaultsDeep({
    type: NODE_TYPE,
    size: {
      width: 80,
      height: 80
    },
    attrs: {
      '.': {
        magnet: false
      },
      text : { text: NAME }
    },
    dfGui: {
      description: NAME,
      parameters: [],
    },
    ports: {
      items: [
        {
          id: 'out',
          group: 'out'
        }
      ],
      groups: portDefinition
    }
  }, joint.shapes.basic.Rect.prototype.defaults)
});

if(!joint.shapes['spark']) joint.shapes['spark'] = {};
joint.shapes['spark']['parallelize'] = MODEL;

export default class Parallelize extends NodeTemplate{

  static getType(){
    return NODE_TYPE;
  }

  static getName(){
    return NAME;
  }

  static getModel(){
    return MODEL.bind(joint);
  }

  static isNodeHidden(){
    return false;
  }

  static hasCodeToFill(lang){
    return true;
  }

  static getCodePrefix(lang){
    return "parallelize(";
  }

  static getCodeSuffix(lang){
    return ")";
  }

  static getCodeParameters(lang){
    return [
      {
        name: 'c',
        description: 'Collection which will be converted to RDD.',
        required: true,
        template: '[]',
        selectionStart: '1',
        selectionEnd: '1'
      },
      {
        name: 'numSlices',
        description: 'Determine number of partitions the RDD will be split into.',
        required: false,
        template: 'numSlices=None',
        selectionStart: 10,
        selectionEnd: 'all'
      }
    ];
  }
}

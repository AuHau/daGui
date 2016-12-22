import joint from 'jointjs';

import DefaultShape from '../../../core/graph/DefaultShape';
import NodeTemplate from '../../../core/graph/NodeTemplate';

const NAME = 'Map';
const NODE_TYPE = 'spark.map';
const MODEL = DefaultShape.extend({
  defaults: joint.util.deepSupplement({
    type: NODE_TYPE,
    attrs: {
      text : { text: NAME }
    },
    dfGui: {
      description: NAME,
    },
    ports: {
      items: [
        {
          id: 'in',
          group: 'in'
        },
        {
          id: 'out',
          group: 'out'
        }
      ]
    }
  }, DefaultShape.prototype.defaults)
});

if(!joint.shapes['spark']) joint.shapes['spark'] = {};
joint.shapes['spark']['map'] = MODEL;

export default class Map extends NodeTemplate{

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
    return "map(";
  }

  static getCodeSuffix(lang){
    return ")";
  }

  static getCodeParameters(lang){
    return [
      {
        name: 'f',
        description: 'Function which accepts one parameter (element) and return modified element',
        required: true,
        template: 'lambda x: ',
        selectionStart: 'all',
        selectionEnd: 'all'
      },
      {
        name: 'preservesPartitioning',
        description: 'If set True, map elements per partition',
        required: false,
        template: 'preservesPartitioning=False',
        selectionStart: 22,
        selectionEnd: 'all'
      }
    ];
  }
}

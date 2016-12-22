import joint from 'jointjs';

import DefaultShape from '../../../core/graph/DefaultShape';
import NodeTemplate from '../../../core/graph/NodeTemplate';

const NAME = 'Filter';
const NODE_TYPE = 'spark.filter';
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
joint.shapes['spark']['filter'] = MODEL;

export default class Filter extends NodeTemplate{

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
    return "filter(";
  }

  static getCodeSuffix(lang){
    return ")";
  }

  static getCodeParameters(lang){
    return [
      {
        description: 'Function which accepts one parameter (element) and return true if if the value should be present in the outcome RDD or false if not',
        required: true,
        template: 'lambda x: '
      }
    ];
  }
}

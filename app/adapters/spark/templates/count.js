import joint from 'jointjs';

import DefaultShape from '../../../core/graph/DefaultShape';
import NodeTemplate from '../../../core/graph/NodeTemplate';

const NAME = 'Count';
const NODE_TYPE = 'spark.count';
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
        }
      ]
    }
  }, DefaultShape.prototype.defaults)
});

if(!joint.shapes['spark']) joint.shapes['spark'] = {};
joint.shapes['spark']['count'] = MODEL;

export default class Count extends NodeTemplate{

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
    return false;
  }

  static getCodePrefix(lang){
    return "count(";
  }

  static getCodeSuffix(lang){
    return ")";
  }

  static getCodeParameters(lang){
    return null;
  }

}

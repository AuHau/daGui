import joint from 'jointjs';

import DefaultShape from '../../../../core/graph/DefaultShape';
import NodeTemplate from '../../../../core/graph/NodeTemplate';
import * as config from '../../config';

const NAME = 'Sum';
const NODE_TYPE = 'spark.sum';
const MODEL = DefaultShape.extend({
  defaults: joint.util.deepSupplement({
    type: NODE_TYPE,
    attrs: {
      text : { text: NAME },
      rect : {
        fill: config.RDD_NODES_FILL
      }
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
joint.shapes['spark']['sum'] = MODEL;

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

  static getCodePrefix(lang){
    return "sum(";
  }

  static getCodeSuffix(lang){
    return ")";
  }

  static getCodeParameters(lang){
    return null;
  }

  static getOutputDataType(langId){
    return 'rdd';
  }

  static isInputDataTypeValid(dataType, langId){
    return dataType == 'rdd';
  }

}

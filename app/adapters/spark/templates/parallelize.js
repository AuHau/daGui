import joint from 'jointjs';

import DefaultShape from '../../../core/graph/DefaultShape';
import NodeTemplate from '../../../core/graph/NodeTemplate';

const NAME = 'Parallelize';
const NODE_TYPE = 'spark.parallelize';
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
          id: 'out',
          group: 'out'
        }
      ]
    }
  }, DefaultShape.prototype.defaults)
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

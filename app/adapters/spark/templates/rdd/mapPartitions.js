import joint from 'jointjs';

import DefaultShape from '../../../../core/graph/DefaultShape';
import NodeTemplate from '../../../../core/graph/NodeTemplate';
import * as config from '../../config';

const NAME = 'Map Partitions';
const NODE_TYPE = 'spark.mapPartitions';
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
      title: NAME,
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
joint.shapes['spark']['mapPartitions'] = MODEL;

export default class MapPartitions extends NodeTemplate{

  static getType(){
    return NODE_TYPE;
  }

  static getName(){
    return NAME;
  }

  static getModel(){
    return MODEL.bind(joint);
  }

  static changeTitle(nodeObject, newTitle){
    nodeObject.attrs = nodeObject.attrs || {};
    nodeObject.attrs.text = nodeObject.attrs.text || {};
    return nodeObject.attrs.text.text = newTitle;
  }

  static isNodeHidden(){
    return true;
  }

  static getCodePrefix(lang){
    return "mapPartitions(";
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


  static getOutputDataType(langId){
    return 'rdd';
  }

  static isInputDataTypeValid(dataType, langId){
    return dataType == 'rdd';
  }

}

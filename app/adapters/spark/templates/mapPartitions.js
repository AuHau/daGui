import joint from 'jointjs';
import _ from 'lodash';

import portDefinition from '../../../core/graph/portDefinition';
import NodeTemplate from '../../../core/graph/NodeTemplate';

const NAME = 'Map Partitions';
const NODE_TYPE = 'spark.mapPartitions';
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
      title: NAME,
      parameters: [],
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
      ],
      groups: portDefinition
    }
  }, joint.shapes.basic.Rect.prototype.defaults)
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

  static hasCodeToFill(lang){
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
        description: 'Function which accepts one parameter (element) and return modified element',
        required: true,
        template: 'lambda x: ',
        selectionStart: 'all',
        selectionEnd: 'all'
      },
      {
        description: 'If set True, map elements per partition',
        required: false,
        template: 'preservesPartitioning=False',
        selectionStart: 22,
        selectionEnd: 'all'
      }
    ];
  }
}

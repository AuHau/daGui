import joint from 'jointjs';

import DefaultShape from '../../../core/graph/DefaultShape';
import NodeTemplate from '../../../core/graph/NodeTemplate';

const NAME = 'Union';
const NODE_TYPE = 'spark.union';
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
          id: 'in1',
          group: 'in'
        },
        {
          id: 'in2',
          group: 'in'
        },
        {
          id: 'out',
          group: 'out'
        }
      ],
    }
  }, DefaultShape.prototype.defaults)
});

if(!joint.shapes['spark']) joint.shapes['spark'] = {};
joint.shapes['spark']['union'] = MODEL;

export default class Union extends NodeTemplate{

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

  static generateCode(parameters, lang, prevNodes){
    let output = this.getCodePrefix(lang);

    for(let [index, node] of prevNodes.entries()){
      output += node.variable + (index < prevNodes.length - 1 ? ', ' : '');
    }

    return 'sc.' + output + this.getCodeSuffix(lang);
  }

  static hasCodeToFill(lang){
    return this.getCodeParameters(lang).length;
  }

  static getCodePrefix(lang){
    return "union([";
  }

  static getCodeSuffix(lang){
    return "])";
  }

  static getCodeParameters(lang){
    return [];
  }
}

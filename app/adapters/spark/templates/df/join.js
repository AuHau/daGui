import joint from 'jointjs';

import DefaultShape, {generatePorts} from '../../../../core/graph/DefaultShape';
import NodeTemplate from '../../../../core/graph/NodeTemplate';
import * as config from '../../config';

const NAME = 'Join';
const NODE_TYPE = 'dfJoin';
const NO_INPUT_NODES = 2;
const NO_OUTPUT_NODES = 1;
const INPUT_DATA_TYPE = 'df';
const OUTPUT_DATA_TYPE = 'df';
const IS_NODE_HIDEN = false;
const PREFIX = 'join(';
const PARAMS = [
  {
    name: 'on',
    description: 'a string for the join column name, a list of column names, a join expression (Column), or a list of Columns. If on is a string or a list of strings indicating the name of the join column(s), the column(s) must exist on both sides, and this performs an equi-join.',
    required: false,
  },
  {
    name: 'how',
    description: 'str, default ‘inner’. One of inner, outer, left_outer, right_outer, leftsemi.',
    required: false,
  }
];

///////////////////////////////////////////////////////////
const FULL_NODE_TYPE = 'spark.' + NODE_TYPE;
const ports = [
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
];
const MODEL = DefaultShape.extend({
  defaults: joint.util.deepSupplement({
    type: FULL_NODE_TYPE,
    attrs: {
      text : { text: NAME },
      rect : {
        fill: config.DF_NODES_FILL
      }
    },
    dfGui: {
      description: NAME,
    },
    ports: {
      items: ports
    }
  }, DefaultShape.prototype.defaults)
});

if(!joint.shapes['spark']) joint.shapes['spark'] = {};
joint.shapes['spark'][NODE_TYPE] = MODEL;

export default class CreateDataFrame extends NodeTemplate{

  static getType(){
    return FULL_NODE_TYPE;
  }

  static getName(){
    return NAME;
  }

  static getModel(){
    return MODEL.bind(joint);
  }

  static isNodeHidden(){
    return IS_NODE_HIDEN;
  }

  static getCodePrefix(langId){
    return PREFIX;
  }

  static getCodeSuffix(langId){
    return ")";
  }

  static getCodeParameters(langId){
    return PARAMS;
  }

  static getOutputDataType(langId){
    return OUTPUT_DATA_TYPE;
  }

  static isInputDataTypeValid(dataType, langId){
    if(INPUT_DATA_TYPE){
      if(typeof INPUT_DATA_TYPE == 'string')
        return dataType == INPUT_DATA_TYPE;

      return INPUT_DATA_TYPE.has(dataType);
    }

    return false;
  }

  static generateCode(parameters, lang, prevNodes){
    let output = this.getCodePrefix(lang);

    if(prevNodes.length != 2){
      throw Error("DF Join node has to have only 2 previous nodes!")
    }

    output += prevNodes[1].variable + ', ';

    for(let [index, parameter] of parameters.entries()){
      if(!templateParams[index].template
        || parameter.trim() != templateParams[index].template.trim()
        || templateParams[index].required){

        output += parameter + ', ';
      }
    }

    output = output.substring(0, output.length - 2);

    return prevNodes[0].variable + '.' + output + this.getCodeSuffix(lang);
  }
}

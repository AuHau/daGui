import joint from 'jointjs';

import DefaultShape, {generatePorts} from '../../../../core/graph/DefaultShape';
import NodeTemplate from '../../../../core/graph/NodeTemplate';
import * as config from '../../config';

const NAME = 'Order By';
const NODE_TYPE = 'dfOrderBy';
const NO_INPUT_NODES = 1;
const NO_OUTPUT_NODES = 1;
const INPUT_DATA_TYPE = 'df';
const OUTPUT_DATA_TYPE = 'df';
const IS_NODE_HIDEN = false;
const PREFIX = 'orderBy(';
const PARAMS = [
  {
    name: '*cols',
    description: 'List of Column or column names to sort by.',
    required: true,
    template: '[]',
    selectionStart: 1,
    selectionEnd: 1,
  },
  {
    name: 'ascending',
    description: 'Boolean or list of boolean (default True). Sort ascending vs. descending. Specify list for multiple sort orders. If a list is specified, length of the list must equal length of the cols.',
    required: false,
    template: 'ascending=[]',
    selectionStart: 11,
    selectionEnd: 11,
  }
];

///////////////////////////////////////////////////////////
const FULL_NODE_TYPE = 'spark.' + NODE_TYPE;
const ports = [...generatePorts('in', NO_INPUT_NODES), ...generatePorts('out', NO_OUTPUT_NODES)];
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
}

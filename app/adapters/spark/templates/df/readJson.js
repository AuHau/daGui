import joint from 'jointjs';

import DefaultShape, {generatePorts} from '../../../../core/graph/DefaultShape';
import NodeTemplate from '../../../../core/graph/NodeTemplate';
import * as config from '../../config';

const NAME = 'Read JSON';
const NODE_TYPE = 'dfReadJson';
const NO_INPUT_NODES = 0;
const NO_OUTPUT_NODES = 1;
const INPUT_DATA_TYPE = null;
const OUTPUT_DATA_TYPE = 'df';
const IS_NODE_HIDEN = false;
const PREFIX = 'read.json(';
const PARAMS = [
  {
    name: 'path',
    description: 'String represents path to the JSON dataset, or RDD of Strings storing JSON objects.',
    required: true,
  },
  {
    name: 'schema',
    description: 'an optional pyspark.sql.types.StructType for the input schema..',
    required: false,
    template: 'schema=None',
    selectionStart: '7',
    selectionEnd: 'all'
  },
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

export default class ReadJson extends NodeTemplate{

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
      return INPUT_DATA_TYPE.has(dataType);
    }

    return false;
  }
}

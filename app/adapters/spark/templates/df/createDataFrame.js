import joint from 'jointjs';

import DefaultShape, {generatePorts} from '../../../../core/graph/DefaultShape';
import NodeTemplate from '../../../../core/graph/NodeTemplate';

const NAME = 'Create Data Frame';
const NODE_TYPE = 'dfCreateDataFrame';
const NO_INPUT_NODES = 0;
const NO_OUTPUT_NODES = 1;
const INPUT_DATA_TYPE = null;
const OUTPUT_DATA_TYPE = 'df';
const IS_NODE_HIDEN = false;
const PREFIX = 'createDataFrame(';
const PARAMS = [
  {
    name: 'data',
    description: 'An RDD of any kind of SQL data representation(e.g. row, tuple, int, boolean, etc.), or list, or pandas.DataFrame.',
    required: true,
  },
  {
    name: 'schema',
    description: 'A pyspark.sql.types.DataType or a datatype string or a list of column names, default is None. The data type string format equals to pyspark.sql.types.DataType.simpleString, except that top level struct type can omit the struct<> and atomic types use typeName() as their format, e.g. use byte instead of tinyint for pyspark.sql.types.ByteType. We can also use int as a short name for IntegerType.',
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
      text : { text: NAME }
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
      return INPUT_DATA_TYPE.has(dataType);
    }

    return false;
  }
}

import NodeTemplate from '../../../core/graph/NodeTemplate';
import joint from 'jointjs';

const MODEL = joint.shapes.basic.Circle.extend({
  defaults: Object.assign({
    type: 'spark.filter',
    attrs: {
      circle: { 'stroke-width': 3 },
      text: { 'font-weight': '800' }
    }
  }, joint.shapes.basic.Circle.prototype.defaults)
});

export default class Filter extends NodeTemplate{

  static getNodeType(){
    return 'spark.filter';
  }

  static getName(){
    return 'Filter';
  }

  static getModel(){
    return MODEL.bind(joint);
  }
}

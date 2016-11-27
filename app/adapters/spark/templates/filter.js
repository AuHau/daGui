import NodeTemplate from '../../../core/graph/NodeTemplate';
import joint from 'jointjs';

const MODEL = joint.shapes.basic.Circle.extend({
  defaults: Object.assign({
    type: 'spark.Filter',
    attrs: {
      circle: { 'stroke-width': 3 },
      text: { 'font-weight': '800' }
    }
  }, joint.shapes.basic.Circle.prototype.defaults)
});

export default class Filter extends NodeTemplate{

  static getNID(){
    return 1;
  }

  static getName(){
    return 'Filter';
  }

  static getModel(){
    return MODEL.bind(joint);
  }
}

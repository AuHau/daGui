import NodeTemplate from '../../../core/graph/NodeTemplate';

export default class Filter extends NodeTemplate{
  static getName(){
    return 'Filter';
  }

  static getModel(){
    return joint.shapes.basic.Circle.extend({
      defaults: Object.assign({
        type: 'spark.Filter',
        attrs: {
          circle: { 'stroke-width': 3 },
          text: { 'font-weight': '800' }
        }
      }, joint.shapes.basic.Circle.prototype.defaults)
    });
  }
}

import BaseAdapter from '../BaseAdapter';

// Languages
import Python from '../../core/languages/Python';

// NodeTemplates
import Filter from './templates/filter';
import Count from './templates/count';
import Map from './templates/map';

export default class SparkAdapter extends BaseAdapter{

  static getName(){
    return 'Spark'
  }

  static getSupportedLanguages(){
    return [
        Python
    ];
  }

  static getNodeTemplates(){
    const nodeMap = {};

    nodeMap[Filter.getNodeType()] = Filter;
    nodeMap[Map.getNodeType()] = Map;
    nodeMap[Count.getNodeType()] = Count;

    return nodeMap
  }

  static getGroupedNodeTemplates(){
    return [
      {
        name: 'Transformations',
        nodes: [
          Filter,
          Map
        ]
      },
      {
        name: 'Actions',
        nodes: [
          Count
        ]
      }
    ]
  }

  static validateGraph(graph){
    return null;
  }

  static generateCode(graph){
    return {'asd' : 'asd'};
  }
}

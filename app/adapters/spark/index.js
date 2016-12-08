import BaseAdapter from '../BaseAdapter';

// Languages
import Python from '../../core/languages/Python';

// NodeTemplates
import Filter from './templates/filter';
import Count from './templates/count';
import Map from './templates/map';
import MapPartitions from './templates/mapPartitions';

export default class SparkAdapter extends BaseAdapter{

  static getId(){
    return 'spark';
  }

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

    nodeMap[Filter.getType()] = Filter;
    nodeMap[Map.getType()] = Map;
    nodeMap[Count.getType()] = Count;
    nodeMap[MapPartitions.getType()] = MapPartitions;

    return nodeMap
  }

  static getGroupedNodeTemplates(){
    return [
      {
        name: 'Transformations',
        templates: [
          Filter,
          Map,
          MapPartitions
        ]
      },
      {
        name: 'Actions',
        templates: [
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

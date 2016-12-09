import BaseAdapter from '../BaseAdapter';
import validateGraph from './validateGraph';

// Languages
import Python from '../../core/languages/Python';

// NodeTemplates
import Filter from './templates/filter';
import Count from './templates/count';
import Map from './templates/map';
import MapPartitions from './templates/mapPartitions';
import Parallelize from './templates/parallelize';
import Union from './templates/union';

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
    nodeMap[Parallelize.getType()] = Parallelize;
    nodeMap[Union.getType()] = Union;

    return nodeMap
  }

  static getGroupedNodeTemplates(){
    return [
      {
        name: 'Transformations',
        templates: [
          Filter,
          Map,
          MapPartitions,
          Union
        ]
      },
      {
        name: 'Actions',
        templates: [
          Count
        ]
      },
      {
        name: 'Input',
        templates: [
          Parallelize
        ]
      }
    ]
  }

  static validateGraph(graph, normalizedGraph, lang){
    return validateGraph(graph, normalizedGraph, lang, SparkAdapter);
  }

  static generateCode(graph, lang){
    return {'asd' : 'asd'};
  }
}

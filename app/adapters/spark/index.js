import BaseAdapter from '../BaseAdapter';

// Languages
import Scala from '../../core/languages/Scala';

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
        Scala
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
}

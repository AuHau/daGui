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
    return [
      Filter
    ]
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

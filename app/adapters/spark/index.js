import BaseAdapter from '../BaseAdapter';
import validateGraph from './validateGraph';
import pythonGenerator from './languages/pythonGenerator';

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

  static isTypeInput(type){
    return SparkAdapter.getGroupedNodeTemplates()
      .find(group => group.name == 'Input')['templates']
      .find(template => template.getType() == type) != undefined;
  }

  static validateGraph(graph, normalizedGraph, inputs, language){
    return validateGraph(graph, normalizedGraph, language, inputs, SparkAdapter);
  }

  static generateCode(output, normalizedGraph, inputs, usedVariables, language){
    switch (language.getName()){
      case 'Python':
        return pythonGenerator(output, SparkAdapter, normalizedGraph, inputs, usedVariables);
      default:
        throw new Error("Not supported language!");
    }
  }
}

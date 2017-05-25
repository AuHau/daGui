import BaseAdapter from '../BaseAdapter';
import validateGraph from './validateGraph';
import pythonGenerator from './languages/pythonGenerator';

// Languages
import Python from '../../core/languages/Python';
import Scala from '../../core/languages/Scala';

// NodeTemplates
import Filter from './templates/filter';
import Count from './templates/count';
import Map from './templates/map';
import MapPartitions from './templates/mapPartitions';
import Parallelize from './templates/parallelize';
import Union from './templates/union';

// Components
import ExecutionConfigurationForm from './components/ExecutionConfigurationForm';

export default class SparkAdapter extends BaseAdapter{

  static getId(){
    return 'spark';
  }

  static getName(){
    return 'Spark'
  }

  static getSupportedLanguages(adaptersVersion){
    return [
      Python,
      Scala
    ];
  }

  static getSupportedLanguageVersions(langId, adaptersVersion){
    const versions = {
      [Python.getId()]: Python.getSupportedVersions(),
      [Scala.getId()]: [
        '2.11'
      ]
    };

    return versions[langId];
  }

  static getSupportedVersions(){
    return [
      '2.1.0',
      '2.0.2',
    ]
  }

  static getNodeTemplates(adaptersVersion){
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

  static getValidationCriteria(adapterVersion){
    throw new TypeError("Method 'getValidationCriteria' has to be implemented!");
  }

  static isTypeInput(type, adapterVersion){
    return SparkAdapter.getGroupedNodeTemplates()
      .find(group => group.name == 'Input')['templates']
      .find(template => template.getType() == type) != undefined;
  }

  static validateGraph(graph, normalizedGraph, inputs, language){
    return validateGraph(graph, normalizedGraph, language, inputs, SparkAdapter);
  }

  static generateCode(output, normalizedGraph, inputs, usedVariables, language, languageVersion, adaptersVersion){
    switch (language.getId()){
      case 'py':
        return pythonGenerator(output, SparkAdapter, normalizedGraph, inputs, usedVariables, languageVersion, adaptersVersion);
      default:
        throw new Error("Not supported language!");
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // Components

  static getExecutionConfigurationForm(){
    return ExecutionConfigurationForm;
  }

  static getSettingsForm(){

  }
}

import BaseAdapter from '../BaseAdapter';
import validateGraph from './validateGraph';
import pythonGenerator from './languages/pythonGenerator';
import ValidationCriteria from 'shared/enums/ValidationCriteria';

// Languages
import Python from '../../core/languages/Python';
import Scala from '../../core/languages/Scala';
import Java from '../../core/languages/Java';

// NodeTemplates
import {allNodeTemplates, groupedTemplates} from './templates';

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
      // Scala,
      // Java
    ];
  }

  static getSupportedLanguageVersions(langId, adaptersVersion){
    const versions = {
      // [Java.getId()]: Java.getSupportedVersions(),
      [Python.getId()]: Python.getSupportedVersions(),
      // [Scala.getId()]: Scala.getSupportedVersions(),
    };

    return versions[langId];
  }

  static getSupportedVersions(){
    return [
      '2.1.1',
      '2.1.0',
    ]
  }

  static getNodeTemplates(adaptersVersion){
    return allNodeTemplates;
  }

  static getGroupedNodeTemplates(){
    return groupedTemplates;
  }

  static getValidationCriteria(adapterVersion){
    return [
      ValidationCriteria.NO_CYCLES,
      ValidationCriteria.HAS_INPUT_NODES,
      ValidationCriteria.HAS_PORTS_CONNECTED,
      ValidationCriteria.HAS_REQUIRED_PARAMETERS_FILLED,
    ]
  }

  static isTypeInput(type, adapterVersion){
    return SparkAdapter.getGroupedNodeTemplates()
      .find(group => group.name == 'RDD Input')['templates']
      .find(template => template.getType() == type) != undefined
      ||
      SparkAdapter.getGroupedNodeTemplates()
        .find(group => group.name == 'DF Input')['templates']
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

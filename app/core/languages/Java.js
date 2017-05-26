import BaseLanguage from './BaseLanguage';
import _ from "lodash";

export default class Java extends BaseLanguage {
  static getName() {
    return 'Java';
  }

  static getId() {
    return 'java';
  }

  static getCommentChar(){
    return '//';
  }

  static getAceName(){
    return 'java';
  }

  static getFileExtension(){
    return '.java';
  }

  static getSupportedVersions(){
    return [
      '7',
      '8'
    ]
  }
  static nameNode(nodeTemplate, usedVariables){
    // TODO: [Optimisation/Medium] Implement camelCase generator to drop lodash depedendency
    const baseName = _.camelCase(nodeTemplate.getName());

    let num;
    for(num = 1; usedVariables[baseName + num]; num++ ){}

    return baseName + num;
  }

  // TODO: [Critical] Implement intelligent Java parsing (ignoring scope variables, keywords etc)
  static parseVariables(parameters, usedVariables){
    let variables = [];

    let splittedParameter;
    for(let parameter of parameters){
      splittedParameter = parameter.split(' ');

      for(let word of splittedParameter){
        if(usedVariables[word]){
          variables.push(word);
        }
      }
    }

    return variables;
  }
}

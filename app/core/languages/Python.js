import BaseLanguage from './BaseLanguage';
import _ from "lodash";

export default class Python extends BaseLanguage {
  static getName() {
    return 'Python';
  }

  static getId() {
    return 'py';
  }

  static getCommentChar(){
    return '#';
  }

  static getAceName(){
    return 'python';
  }

  static getFileExtension(){
    return 'py';
  }

  static getSupportedVersions(){
    return [
      '2.7',
      '3.5'
    ]
  }

  static nameNode(nodeTemplate, usedVariables){
    // TODO: [Medium] Implement SnakeCase generator to drop lodash depedendency
    const baseName = _.snakeCase(nodeTemplate.getName());

    let num;
    for(num = 1; usedVariables[baseName + num]; num++ ){}

    return baseName + num;
  }

  // TODO: [Critical] Implement intelligent Python parsing (ignoring scope variables, keywords etc)
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

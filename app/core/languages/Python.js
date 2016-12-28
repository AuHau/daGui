import BaseLanguage from './BaseLanguage';
import _ from "lodash";

export default class Python extends BaseLanguage {
  static getName() {
    return 'Python';
  }

  static getLID() {
    return 2;
  }

  static getAceName(){
    return 'python';
  }

  static nameNode(nodeTemplate, usedVariables){
    // TODO: Implement SnakeCase generator to drop lodash depdendency
    const baseName = _.snakeCase(nodeTemplate.getName());

    let num;
    for(num = 1; usedVariables[baseName + num]; num++ ){}

    return baseName + num;
  }
}

import BaseLanguage from './BaseLanguage';
import _ from "lodash";

export default class Python extends BaseLanguage {
  static getName() {
    return 'Python';
  }

  static getLID() {
    return 2;
  }

  static nameNode(nodeTemplate, usedVariables){
    // TODO: Implement SnakeCase generator to drop lodash depdendency
    const baseName = _.snakeCase(nodeTemplate.getName());
    const num = (usedVariables[baseName] || 0) + 1;
    usedVariables[baseName] = num;

    return baseName + num;
  }
}

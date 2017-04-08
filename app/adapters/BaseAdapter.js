export default class BaseAdapter {

  static getName(){
    throw new TypeError("Method 'getName' has to be implemented!");
  }

  static getId(){
    throw new TypeError("Method 'getUniqId' has to be implemented!");
  }

  static getSupportedLanguages(){
    throw new TypeError("Method 'getSupportedLanguages' has to be implemented!");
  }

  static getSupportedLanguageVersions(){
    throw new TypeError("Method 'getSupportedLanguageVersions' has to be implemented!");
  }

  static getSupportedVersions(){
    throw new TypeError("Method 'getSupportedVersions' has to be implemented!");
  }

  static getNodeTemplates(){
    throw new TypeError("Method 'getNodeTemplates' has to be implemented!");
  }

  static isTypeInput(){
    throw new TypeError("Method 'isTypeInput' has to be implemented!");
  }

  static getGroupedNodeTemplates(){
    throw new TypeError("Method 'getGroupedNodeTemplates' has to be implemented!");
  }

  static validateGraph(graph){
    throw new TypeError("Method 'validateGraph' has to be implemented!");
  }

  static generateCode(graph){
    throw new TypeError("Method 'generateCode' has to be implemented!");
  }
}

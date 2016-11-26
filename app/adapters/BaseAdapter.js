export default class BaseAdapter {

  static getName(){
    throw new TypeError("Method 'getName' has to be implemented!");
  }

  static getSupportedLanguages(){
    throw new TypeError("Method 'getSupportedLanguages' has to be implemented!");
  }

  static getNodeTemplates(){
    throw new TypeError("Method 'getNodeTemplates' has to be implemented!");
  }

  static getGroupedNodeTemplates(){
    throw new TypeError("Method 'getGroupedNodeTemplates' has to be implemented!");
  }
}

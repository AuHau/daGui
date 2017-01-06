export default class BaseLanguage {

  constructor() {
    throw new TypeError("Language class is not supposed to be instantiated");
  }

  static getName() {
    throw new TypeError("Method 'getName' has to be implemented!");
  }

  static getAceName() {
    throw new TypeError("Method 'getAceName' has to be implemented!");
  }

  static getLID(){
    throw new TypeError("Method 'getLID' has to be implemented!");
  }

  static nameNode(){
    throw new TypeError("Method 'nameNode' has to be implemented!");
  }

  static parseVariables(){
    throw new TypeError("Method 'parseExternalVariables' has to be implemented!");
  }

};


export default class NodeTemplate {
  static getNodeType() {
    throw new TypeError("Method 'getNodeType' has to be implemented!");
  }

  static getName() {
    throw new TypeError("Method 'getName' has to be implemented!");
  }

  static getModel() {
    throw new TypeError("Method 'getModel' has to be implemented!");
  }

  static changeTitle() {
    throw new TypeError("Method 'changeTitle' has to be implemented!");
  }

  // Code generation
  static hasCodeToFill(){
    throw new TypeError("Method 'hasCodeToFill' has to be implemented!");
  }

  static getCodePrefix(){
    throw new TypeError("Method 'getCodePrefix' has to be implemented!");
  }

  static getCodeSuffix(){
    throw new TypeError("Method 'getCodeSuffix' has to be implemented!");
  }

  static getCodeParameters(){
    throw new TypeError("Method 'getCodeTemplate' has to be implemented!");
  }
}


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

}

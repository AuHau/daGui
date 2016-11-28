
export default class NodeTemplate{
  static getNodeType(){
    throw new TypeError("Method 'getNodeType' has to be implemented!");
  }

  static getName(){
    throw new TypeError("Method 'getGroupedNodeTemplates' has to be implemented!");
  }

  static getModel(){
    throw new TypeError("Method 'getGroupedNodeTemplates' has to be implemented!");
  }
}

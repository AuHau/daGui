
export default class NodeTemplate {
  static getType() {
    throw new TypeError("Method 'getType' has to be implemented!");
  }

  static getName() {
    throw new TypeError("Method 'getName' has to be implemented!");
  }

  static getModel() {
    throw new TypeError("Method 'getModel' has to be implemented!");
  }

  static isNodeHidden(){
    throw new TypeError("Method 'isNodeHidden' has to be implemented!");
  }

  // Code generation
  static generateCode(parameters, lang){
    const templateParams = this.getCodeParameters(lang);
    let output = this.getCodePrefix(lang);

    for(let [index, parameter] of parameters.entries()){
      if(parameter.trim() != templateParams[index].template.trim() || templateParams[index].required){
        output += parameter + ', ';
      }
    }

    if(parameters.length >= 1){
      output = output.substring(0, output.length - 2);
    }

    return output + this.getCodeSuffix(lang);
  }

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

  static hasMandatoryParameters(){
    for(let param of this.getCodeParameters()){
      if(param.required) return true;
    }

    return false;
  }
}

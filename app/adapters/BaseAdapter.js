export default class BaseAdapter {

  /**
   * Returns string that names the framework which the adapter is written for.
   * The string is displayed to the users as the name of the adapter.
   *
   * @return {string}
   */
  static getName(){
    throw new TypeError("Method 'getName' has to be implemented!");
  }

  /**
   * Returns string that uniquely identifies the adapter. It should consists
   * of short string only with alphanumerical values without any spaces.
   *
   * @return {string}
   */
  static getId(){
    throw new TypeError("Method 'getId' has to be implemented!");
  }

  /**
   * Returns a path to an image which represents the framework. Usually it should
   * be an icon of the framework. Can return null if there is no icon, in such a
   * cases, only name will be displayed.
   *
   * @return {string|null}
   */
  static getIcon(){
    throw new TypeError("Method 'getIcon' has to be implemented!");
  }

  /**
   * Returns an arrays of strings that represents the versions of the framework
   * which the adapter supports.
   */
  static getSupportedVersions(){
    throw new TypeError("Method 'getSupportedVersions' has to be implemented!");
  }

  /**
   * Return an array of supported languages for given adaptersVersion.
   * The language in the array should be a functions imported from /app/core/languages.
   *
   * @param {string} adapterVersion
   * @return {Array}
   */
  static getSupportedLanguages(adapterVersion){
    throw new TypeError("Method 'getSupportedLanguages' has to be implemented!");
  }

  /**
   * Return an array of strings that represents the supported versions of specified
   * language ID and adapters version. These version should be included in the
   * language's supported version (lang.getSupportedVersions())
   *
   * @param {string} langId
   * @param {string} adapterVersion
   * @return {Array}
   */
  static getSupportedLanguageVersions(langId, adapterVersion){
    throw new TypeError("Method 'getSupportedLanguageVersions' has to be implemented!");
  }

  /**
   * Return an object which consists all supported node templates for given adaptersVersion.
   * The keys of the object should be the node's types and values the node's template class.
   *
   * @param {string} adapterVersion
   * @return {Array}
   */
  static getNodeTemplates(adapterVersion){
    throw new TypeError("Method 'getNodeTemplates' has to be implemented!");
  }

  /**
   * Return an array of objects where each object represents a group of nodes. The object
   * has structure {name: String, templates: Array<NodeTemplates>}.
   * Can return an null if there should not be any groups, in such a case daGui uses
   * getNodeTemplates().
   *
   * @param {string} adapterVersion
   * @return {Array|null}
   */
  static getGroupedNodeTemplates(adapterVersion){
    throw new TypeError("Method 'getGroupedNodeTemplates' has to be implemented!");
  }

  /**
   * Return an array of criteria which the graph created by user have to fulfill in
   * order to be called a valid graph from the adaptor's point of view.
   * The criteria are specified in ValidationCriteria enum and the array
   * have to consists only of its values.
   *
   * @param {string} adapterVersion
   * @return {Array}
   */
  static getValidationCriteria(adapterVersion){
    throw new TypeError("Method 'getValidationCriteria' has to be implemented!");
  }

  /**
   * Method which check if the node template specified by 'type' is for given
   * adapter's version an input node.
   *
   * @param {string} type
   * @param {string} adapterVersion
   * @return {boolean}
   */
  static isTypeInput(type, adapterVersion){
    throw new TypeError("Method 'isTypeInput' has to be implemented!");
  }


  static validateGraph(graph){
    throw new TypeError("Method 'validateGraph' has to be implemented!");
  }

  static generateCode(graph){
    throw new TypeError("Method 'generateCode' has to be implemented!");
  }

  //////////////////////////////////////////////////////////////////////////////////
  // Components

  /**
   * Retrieves a React component which serves as Execution Configuration form.
   * The component has to have four properties: configuration, onUpdate, onClose and isNameValid.
   */
  static getExecutionConfigurationForm(){
    throw new TypeError("Method 'getExecutionConfigurationForm' has to be implemented!");
  }

  /**
   *
   */
  static getSettingsForm(){

  }
}

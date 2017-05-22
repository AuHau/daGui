import BaseLanguage from './BaseLanguage';

export default class Scala extends BaseLanguage {
  static getName() {
    return 'Scala';
  }

  static getId() {
    return 'scala';
  }

  static getCommentChar(){
    return '//';
  }

  static getAceName(){
    return 'scala';
  }

  static getFileExtension(){
    return '.scala';
  }

  static getSupportedVersions(){
    return [
      '2.11'
    ]
  }
}

import BaseLanguage from './BaseLanguage';

export default class Python extends BaseLanguage {
  static getName() {
    return 'Python';
  }

  static getLID() {
    return 2;
  }
}

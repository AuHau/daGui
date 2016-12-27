const definition = {
  VARIABLE: 'ERROR',
  NODE: 'WARNING',
  INFO: 'INFO'
};
export default definition;

const classTranslation = {};
classTranslation[definition.VARIABLE] = 'errorMessage';
classTranslation[definition.NODE] = 'warningMessage';
classTranslation[definition.INFO] = 'infoMessage';

export {classTranslation};

const textTranslation = {};
textTranslation[definition.VARIABLE] = 'Error';
textTranslation[definition.NODE] = 'Warning';
textTranslation[definition.INFO] = 'Info';

export {textTranslation};

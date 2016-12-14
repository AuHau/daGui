const definition = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO'
};
export default definition;

const classTranslation = {};
classTranslation[definition.ERROR] = 'errorMessage';
classTranslation[definition.WARNING] = 'warningMessage';
classTranslation[definition.INFO] = 'infoMessage';

export {classTranslation};

const textTranslation = {};
textTranslation[definition.ERROR] = 'Error';
textTranslation[definition.WARNING] = 'Warning';
textTranslation[definition.INFO] = 'Info';

export {textTranslation};

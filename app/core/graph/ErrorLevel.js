const definition = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO'
};
export default definition;

const classTranslation = {};
classTranslation[definition.ERROR] = 'error';
classTranslation[definition.WARNING] = 'warning';
classTranslation[definition.INFO] = 'info';

export {classTranslation};

const textTranslation = {};
textTranslation[definition.ERROR] = 'Error';
textTranslation[definition.WARNING] = 'Warning';
textTranslation[definition.INFO] = 'Info';

export {textTranslation};

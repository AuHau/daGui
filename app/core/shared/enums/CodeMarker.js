const definition = {
  VARIABLE: 'VARIABLE',
  NODE: 'NODE'
};
export default definition;

const classTranslation = {};
classTranslation[definition.VARIABLE] = 'variableMarker';
classTranslation[definition.NODE] = 'nodeMarker';

export {classTranslation};

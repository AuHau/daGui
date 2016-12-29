const definition = {
  VARIABLE: 'VARIABLE',
  NODE: 'NODE'
};
export default definition;
export const values = [definition.VARIABLE, definition.NODE];

const classTranslation = {};
classTranslation[definition.VARIABLE] = 'variableMarker';
classTranslation[definition.NODE] = 'nodeMarker';

export {classTranslation};

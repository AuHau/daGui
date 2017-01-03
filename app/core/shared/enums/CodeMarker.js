const definition = {
  VARIABLE: 'VARIABLE',
  NODE: 'NODE',
  HOVER: 'HOVER',
  ACTIVE: 'ACTIVE'
};
export default definition;
export const values = [definition.VARIABLE, definition.NODE, definition.HOVER];

const classTranslation = {};
classTranslation[definition.VARIABLE] = 'variableMarker';
classTranslation[definition.NODE] = 'nodeMarker';

export {classTranslation};

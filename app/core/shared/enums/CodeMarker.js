const definition = {
  VARIABLE: 'VARIABLE',
  NODE: 'NODE',
  HIGHLIGHT: 'HIGHLIGHT'
};
export default definition;
export const values = [definition.VARIABLE, definition.NODE, definition.HIGHLIGHT];

const classTranslation = {};
classTranslation[definition.VARIABLE] = 'variableMarker';
classTranslation[definition.NODE] = 'nodeMarker';

export {classTranslation};

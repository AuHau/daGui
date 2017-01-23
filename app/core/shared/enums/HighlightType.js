const definition = {
  ERROR: 'ERROR',
  HOVER: 'HOVER',
  ACTIVE: 'ACTIVE'
};
export default definition;
export const values = [definition.ERROR, definition.ACTIVE, definition.HOVER];

const classTranslation = {};
classTranslation[definition.ERROR] = 'nodeError';
classTranslation[definition.HOVER] = 'nodeHover';
classTranslation[definition.ACTIVE] = 'nodeActive';

export {classTranslation};

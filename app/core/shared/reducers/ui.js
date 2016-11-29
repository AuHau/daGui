import UI from '../actions/ui';

export default (state, action) => {

  switch (action.type){
    case UI.CANVAS_RESIZE:
      return state.setIn(['ui', 'canvasContainerSpec'], action.dimensions);
    default:
      return state;
  }
};

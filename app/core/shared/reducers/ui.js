import UI from '../actions/ui';

export default (state, action) => {

  switch (action.type){
    case UI.CANVAS_RESIZE:
      return Object.assign({}, state, {ui: {canvasContainerSpec: action.dimensions}});
      break;
    default:
      return state;
  }
};

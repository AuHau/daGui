import Immutable from 'immutable';
import CursorMode from 'shared/enums/CursorMode';

import UI from 'shared/actions/ui';

export default (state, action) => {

  switch (action.type){
    case UI.CANVAS_RESIZE:
      const rect = action.payload;
      return state.set('canvasContainerSpec', Immutable.Map({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      }));

    case UI.CHANGE_NODE_DETAIL:
      return state.set('detailNodeId', action.nid);

    case UI.SHOW_SETTINGS:
      return state.set('showSettingsWindow', true);

    case UI.SET_MULTISELECT_MODE:
      return state.set('cursorMode', CursorMode.MULTISELECT);

    case UI.SET_PAN_MODE:
      return state.set('cursorMode', CursorMode.PAN);

    case UI.TOGGLE_CODE_VIEW:
      return state.update('showCodeView', (value) => !value);

    default:
      return state;
  }
};

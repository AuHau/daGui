import Immutable from 'immutable';
import CursorMode from 'shared/enums/CursorMode';
import {REHYDRATE} from 'redux-persist/constants'

import UI from 'shared/actions/ui';

const defaultState = {
  canvasContainerSpec: {},
  detailNodeId: null,
  showSettingsWindow: false,
  cursorMode: CursorMode.MULTISELECT,
  showCodeView: false,
  isExecutionRunning: false,
};

export default (state, action) => {

  if(state == undefined){
    return Immutable.fromJS(defaultState);
  }

  switch (action.type){
    case REHYDRATE:
      return (action.payload.ui ? action.payload.ui : state);

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

    case UI.SHOW_NEW_FILE_MODAL:
      return state.set('displayNewFileModal', true);

    case UI.HIDE_NEW_FILE_MODAL:
      return state.set('displayNewFileModal', false);

    case UI.SHOW_EXEC_CONFS_MODAL:
      return state.set('displayExecConfsModal', true);

    case UI.HIDE_EXEC_CONFS_MODAL:
      return state.set('displayExecConfsModal', false);

    case UI.START_EXECUTION:
      return state.set('isExecutionRunning', true).set('showCodeView', false);

    case UI.TERMINATE_EXECUTION:
      return state.set('isExecutionRunning', false);

    default:
      return state;
  }
};

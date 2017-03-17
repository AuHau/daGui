
const UI = {
  CANVAS_RESIZE: 'UI_CANVAS_RESIZE',
  CHANGE_NODE_DETAIL: 'UI_CHANGE_NODE_DETAIL',
  SHOW_SETTINGS: 'UI_SHOW_SETTINGS',
  TOGGLE_CODE_VIEW: 'UI_CODE_VIEW_TOGGLE',
  SET_MULTISELECT_MODE: 'UI_SET_MULTISELECT_MODE',
  SET_PAN_MODE: 'UI_SET_PAN_MODE',
};
export default UI;

export const canvasResize = (dimensions) => {
  return {
    type: UI.CANVAS_RESIZE,
    payload: dimensions
  }
};

export const changeNodeDetail = (nid) => {
  return {
    type: UI.CHANGE_NODE_DETAIL,
    nid: nid
  }
};

export const codeViewToggle = () => {
  return {
    type: UI.TOGGLE_CODE_VIEW
  }
};

export const showSettings = () => {
  return {
    type: UI.SHOW_SETTINGS
  }
};

export const setMultiselectMode = () => {
  return {
    type: UI.SET_MULTISELECT_MODE
  }
};

export const setPanMode = () => {
  return {
    type: UI.SET_PAN_MODE
  }
};

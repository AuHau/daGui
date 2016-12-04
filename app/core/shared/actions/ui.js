
const UI = {
  CANVAS_RESIZE: 'UI_CANVAS_RESIZE',
  CHANGE_NODE_DETAIL: 'UI_CHANGE_NODE_DETAIL',
  SHOW_SETTINGS: 'UI_SHOW_SETTINGS',
  TOGGLE_CODE_VIEW: 'UI_CODE_VIEW_TOGGLE'
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

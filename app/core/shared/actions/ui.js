
const UI = {
  CANVAS_RESIZE: 'UI_CANVAS_RESIZE',
  CHANGE_NODE_DETAIL: 'UI_CHANGE_NODE_DETAIL'
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

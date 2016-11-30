
const UI = {
  CANVAS_RESIZE: 'UI_CANVAS_RESIZE'
};
export default UI;

export const canvasResize = (dimensions) => {
  return {
    type: UI.CANVAS_RESIZE,
    payload: dimensions
  }
};

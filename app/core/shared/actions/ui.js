
const UI = {
  CANVAS_RESIZE: 'CANVAS_RESIZE'
};
export default UI;

export const canvasResize = (dimensions) => {
  return {
    type: UI.CANVAS_RESIZE,
    dimensions
  }
};

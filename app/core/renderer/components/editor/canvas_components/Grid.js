import CanvasComponentBase from './CanvasComponentBase'

export default class Grid extends CanvasComponentBase{
  constructor(canvas) {
    super(canvas);
    this.renderCanvas = document.createElement("canvas");
    this.gridSize = 15;
  }

  init() {
    this.svgElement = this.canvas.paper.el.childNodes[0];
    this.setGrid(1)
  }

  clearCanvas() {
    const context = this.renderCanvas.getContext('2d');
    context.clearRect(0, 0, this.renderCanvas.width, this.renderCanvas.height);
  }

  setGrid(scale, offset, color = '#808080') {
    this.clearCanvas();

    this.renderCanvas.setAttribute('width', this.gridSize*scale);
    this.renderCanvas.setAttribute('height', this.gridSize*scale);

    const context = this.renderCanvas.getContext('2d');
    context.beginPath();
    context.rect(1, 1, 1, 1);
    context.fillStyle = color;
    context.fill();

    // Finally, set the grid background image of the paper container element.
    const gridBackgroundImage = this.renderCanvas.toDataURL('image/png');
    this.svgElement.style['background-image'] = 'url("' + gridBackgroundImage + '")';
    if (offset) {
      this.svgElement.style['background-position'] = offset.x + 'px ' + offset.y + 'px';
    }
  }

}

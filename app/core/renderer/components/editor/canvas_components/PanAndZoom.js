import svgPanZoom from 'svg-pan-zoom'
import CanvasComponentBase from './CanvasComponentBase'

export default class PanAndZoom extends CanvasComponentBase {
  constructor(canvas) {
    super(canvas);

    this.currentScale = 1;
  }

  onZoom(scale) {
    this.currentScale = scale;
    this.ignoreAction();
    const pan = this.panAndZoom.getPan();
    this.call('onZoom', scale, pan.x, pan.y);
    this.canvasComponents.grid.setGrid(this.currentScale);
  }

  beforePan(oldpan, newpan) {
    this.canvasComponents.grid.setGrid(this.currentScale, newpan);
  }

  mouseUp() {
    if (!this.isPanning) return;

    this.ignoreAction();
    const pan = this.panAndZoom.getPan();
    this.call('onPan', pan.x, pan.y);
    this.panAndZoom.disablePan();
    this.isPanning = false;
  }

  mouseBlankDown() {
    this.panAndZoom.enablePan();
    this.isPanning = true;
  }

  init() {
    this.panAndZoom = svgPanZoom(this.canvas.paper.el.childNodes[0],
      {
        viewportSelector: this.canvas.paper.el.childNodes[0].childNodes[0],
        fit: false,
        zoomScaleSensitivity: 0.2,
        panEnabled: false,
        maxZoom: 1.4,
        dblClickZoomEnabled: false,
        onZoom: this.onZoom.bind(this),
        beforePan: this.beforePan.bind(this)
      }
    );

    this.canvas.paper.on('blank:pointerdown', this.mouseBlankDown.bind(this));
    this.canvas.paper.on('cell:pointerup blank:pointerup', this.mouseUp.bind(this));

    this.panAndZoom.zoom(this.get('zoom'));
    this.panAndZoom.enablePan().pan({x: this.get('$pan').get('x'), y: this.get('$pan').get('y')}).disablePan();

  }

  afterUpdate() {
    this.panAndZoom.zoom(this.get('zoom'));
    this.panAndZoom.enablePan().pan({
      x: this.get('$pan').get('x'),
      y: this.get('$pan').get('y')
    }).disablePan();
  }
}

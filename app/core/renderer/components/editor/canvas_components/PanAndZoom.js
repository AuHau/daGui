import svgPanZoom from 'svg-pan-zoom'
import CanvasComponentBase from './CanvasComponentBase'
import Config from '../../../../../config/';
import CursorMode from 'shared/enums/CursorMode';

export default class PanAndZoom extends CanvasComponentBase {
  constructor(canvas) {
    super(canvas);

    this.currentScale = 1;
  }

  init() {
    this.panAndZoom = svgPanZoom(this.canvas.paper.el.childNodes[0],
      {
        viewportSelector: this.canvas.paper.el.childNodes[0].childNodes[0],
        fit: false,
        zoomScaleSensitivity: Config.canvas.zoomStep,
        panEnabled: false,
        maxZoom: 1.4,
        dblClickZoomEnabled: false,
        onZoom: this.onZoom.bind(this),
        beforePan: this.beforePan.bind(this)
      }
    );

    this.canvas.paper.on('blank:pointerdown', this.mouseBlankDown.bind(this));
    this.canvas.paper.on('cell:pointerup blank:pointerup', this.mouseUp.bind(this));
    this.canvas.paper.el.addEventListener('mousemove', this.mouseMove.bind(this));

    this.panAndZoom.zoom(this.get('zoom'));
    this.panAndZoom.enablePan().pan({x: this.get('$pan').get('x'), y: this.get('$pan').get('y')}).disablePan();

  }

  afterUpdate() {
    const panX = this.get('$pan').get('x');
    const panY = this.get('$pan').get('y');

    if(panX == 'contain' || panY == 'contain'){
      this.panAndZoom.fit();
      // this.panAndZoom.center();

      this.ignoreAction();
      const pan = this.panAndZoom.getPan();
      this.call('onPan', pan.x, pan.y);
      return;
    }

    this.ignoreOnZoom = true;
    this.panAndZoom.zoom(this.get('zoom'));
    this.panAndZoom.enablePan().pan({
      x: panX,
      y: panY
    }).disablePan();
  }

  onZoom(scale) {
    if(this.ignoreOnZoom){
      this.ignoreOnZoom = false;
      return;
    }

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
    this.startingPointerPosition = null;
    if (!this.isSelecting) return;

    this.ignoreAction();
    const pan = this.panAndZoom.getPan();
    this.call('onPan', pan.x, pan.y);
    this.panAndZoom.disablePan();
    this.isSelecting = false;
    this.dontReloadGraph();
    this.canvas.setState({cursorMode: CursorMode.PAN});
  }

  mouseBlankDown(e, x, y) {
    if(this.canvas.state.cursorMode != CursorMode.MULTISELECT) {
      this.startingPointerPosition = {x, y};
      this.dontReloadGraph();
      this.canvas.setState({cursorMode: CursorMode.PANNING});
    }
  }

  mouseMove(e){
    if(!this.startingPointerPosition || this.isSelecting) return;

    if(Math.abs(this.startingPointerPosition.x - e.clientX) > this.canvas.CLICK_TRESHOLD
      && Math.abs(this.startingPointerPosition.y - e.clientY) > this.canvas.CLICK_TRESHOLD) {
      this.isSelecting = true;
      this.panAndZoom.enablePan();
    }
  }

}

import CanvasComponentBase from './CanvasComponentBase'
import CursorMode from 'shared/enums/CursorMode';

import joint from 'jointjs';

export default class Selecting extends CanvasComponentBase {
  constructor(canvas) {
    super(canvas);
    this.canvas.selected = new Set();
    this.selected = this.canvas.selected;
  }

  init() {
    super.init();

    // Multiselection handlers
    this.paper.on('blank:pointerdown', this.multiselectionStart.bind(this));
    this.paper.on('cell:pointerup blank:pointerup', this.multiselectionEnd.bind(this));
    this.paper.el.addEventListener('mousemove', this.multiselectionProgress.bind(this));

    // Detail handlers
    this.paper.on('cell:pointerup', this.detailEnd.bind(this));
    this.paper.on('cell:pointerdown blank:pointerdown', this.detailStart.bind(this));

    // Reseting any selection
    this.paper.on('blank:pointerdown', this.resetSelectionStart.bind(this));
    this.paper.on('blank:pointerup', this.resetSelectionEnd.bind(this));

    // Keyboard handlers for Shift key (selective multiselect)
    document.addEventListener('keydown', this.shiftKeyStart.bind(this));
    document.addEventListener('keyup', this.shiftKeyEnd.bind(this));
  }

  onNodeDetail(cellView) {
    if (cellView === this.currentDetailCell
      || cellView.model.attributes.type == 'link') {
      return;
    }

    this.currentDetailCell = cellView;
    this.call('onNodeDetail', cellView.model.id);
  }

  onNodeDetailEnd() {
    this.call('onNodeDetail', null);
    this.currentDetailCell = null;
  }

  shiftKeyStart(e) {
    if (e.keyCode == '16'
      && !(e.target.matches('input') || e.target.matches('[contenteditable]') || e.target.matches('textarea'))) {
      this.shiftKey = true;
    }
  }

  shiftKeyEnd(e) {
    if (e.keyCode == '16') {
      this.shiftKey = false;
    }
  }

  detailStart(cellView, e, x, y) {
    this.startingPointerPosition = {x, y};
  }

  detailEnd(cellView, e, x, y) {
    if (cellView.model.isElement()
      && Math.abs(this.startingPointerPosition.x - x) < this.canvas.CLICK_TRESHOLD
      && Math.abs(this.startingPointerPosition.y - y) < this.canvas.CLICK_TRESHOLD) {
      if (this.shiftKey) {
        if (this.currentDetailCell) {
          const nid = this.currentDetailCell.model.id;
          this.onNodeDetailEnd();
          this.addNode(nid);
        }

        const nid = cellView.model.id;
        if (this.selected.has(nid)) {
          this.removeNode(nid);
        } else {
          this.addNode(nid);
        }
      } else {
        if(this.selected.size > 0){
          for (let nid of this.selected){
            this.removeNode(nid);
          }
        }

        this.onNodeDetail(cellView);
      }
    }
    this.startingPointerPosition = null;
  }

  resetSelectionStart(e, x, y) {
    if (this.canvas.state.cursorMode == CursorMode.MULTISELECT) {
      this.startingPointerPosition = {x, y};
    }
  }

  resetSelectionEnd(e, x, y) {
    if (!this.startingPointerPosition || this.shiftKey) return;

    // Was it panning/multiselect or click on canvas?
    if (Math.abs(this.startingPointerPosition.x - x) < this.canvas.CLICK_TRESHOLD
      && Math.abs(this.startingPointerPosition.y - y) < this.canvas.CLICK_TRESHOLD) {

      if (this.currentDetailCell) {
        this.onNodeDetailEnd();
      }

      if (this.selected.size > 0) {
        for (let selectedNid of this.selected) {
          this.removeNode(selectedNid);
        }
      }

      document.querySelectorAll('input').forEach(input => input.blur());
    }
  }

  multiselectionEnd(cellView, e, x, y) {
    if (this.startingSelectionPosition) {
      this.startingSelectionPosition = null;
      if (!this.isSelecting) return;

      this.isSelecting = false;
      this.selectRect.remove();
      this.unfreeze();
    }
  }

  multiselectionStart(e, x, y) {
    if (this.canvas.state.cursorMode == CursorMode.MULTISELECT) {
      this.startingSelectionPosition = {x, y};
      this.diff = {x: e.clientX - x, y: e.clientY - y};
    }
  }

  multiselectionProgress(e) {
    if (!this.startingSelectionPosition) return;

    if (!this.isSelecting
      && Math.abs(this.startingSelectionPosition.x - e.clientX) > this.canvas.CLICK_TRESHOLD
      && Math.abs(this.startingSelectionPosition.y - e.clientY) > this.canvas.CLICK_TRESHOLD) {
      this.isSelecting = true;

      if (this.currentDetailCell) {
        this.onNodeDetailEnd();
      }

      this.selectRect = new joint.shapes.basic.Rect({
        position: {x: this.startingSelectionPosition.x, y: this.startingSelectionPosition.y},
        size: {width: 1, height: 1},
        attrs: {
          '.': {
            magnet: false
          },
          'rect': {
            'fill-opacity': 0.3,
            style:{'pointer-events':'none'}
          }
        }
      });
      this.graph.addCell(this.selectRect);
      this.freeze();
    }

    if (this.isSelecting) {
      const newWidth = (e.clientX - this.startingSelectionPosition.x - this.diff.x) / this.get('zoom');
      const newHeight = (e.clientY - this.startingSelectionPosition.y - this.diff.y) / this.get('zoom');
      this.selectRect.resize(newWidth, newHeight);

      const rect = {
        x: this.startingSelectionPosition.x,
        y: this.startingSelectionPosition.y,
        width: newWidth,
        height: newHeight
      };
      if (newWidth < 0) {
        rect.x += newWidth;
        rect.width = Math.abs(newWidth);
      }
      if (newHeight < 0) {
        rect.y += newHeight;
        rect.height = Math.abs(newHeight);
      }

      const views = this.paper.findViewsInArea(rect);

      const tmp = new Set();
      let nid;
      for (let view of views) {
        nid = view.model.id;
        if (this.selectRect.id == nid) continue;
        tmp.add(nid);

        if (!this.selected.has(nid))
          this.addNode(nid);
      }

      if (!this.shiftKey) {
        for (let selectedNid of this.selected) {
          if (this.selectRect.id == selectedNid) continue;
          if (!tmp.has(selectedNid))
            this.removeNode(selectedNid);
        }
      }
    }
  }

  addNode(nid) {
    this.selected.add(nid);
    this.canvasComponents.highlights.highlightNode(nid);

    this.ignoreAction();
    this.call('onAddSelected', nid);
  }

  removeNode(nid) {
    this.selected.delete(nid);
    this.canvasComponents.highlights.removeHighlight(nid);

    this.ignoreAction();
    this.call('onRemoveSelected', nid);
  }
}

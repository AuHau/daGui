import CanvasComponentBase from './CanvasComponentBase'

export default class Nodes extends CanvasComponentBase{
  constructor(canvas) {
    super(canvas);
  }

  init() {
    super.init();
    this.selected = this.canvas.selected;

    this.canvas.paper.on('cell:pointerdown', this.onPointerDown.bind(this));
    this.canvas.paper.on('cell:pointerup', this.onPointerUp.bind(this));
    this.canvas.paper.el.addEventListener('mousemove', this.onMultipleDrag.bind(this));
    document.addEventListener('keyup', this.onDeleteKey.bind(this));
  }

  onMultipleDrag(e){
    if(!this.startingPointerPosition || !this.startingElement || this.cellsEmbedded) return;

    if(this.selected.size > 1 && this.selected.has(this.startingElement.id)) {
      for(let selectedNid of this.selected){
        if(this.startingElement.id == selectedNid) continue;
        this.startingElement.embed(this.graph.getCell(selectedNid))
      }

      this.cellsEmbedded = true;
    }
  }

  // TODO: [BUG/Medium] When dragging node Z value should be the highest in graph
  onPointerDown(cellView, e, x, y) {
    this.startingPointerPosition = {x: e.clientX, y: e.clientY};
    this.freeze();
    this.startingElement = cellView.model;
  }

  onPointerUp(cellView, e, x, y){
    if(!e.target || e.target.type != 'text') this.unfreeze();

    if(Math.abs(this.startingPointerPosition.x - e.clientX) < this.canvas.CLICK_TRESHOLD
      && Math.abs(this.startingPointerPosition.y - e.clientY) < this.canvas.CLICK_TRESHOLD) {
      // Click
      if(e.target && e.target.type == 'text'){
        e.target.focus(); // Variable input
      }
    }else{
      // Drag node
      if(cellView.model.isElement()){
        const embeddedCells = this.startingElement.getEmbeddedCells();
        if(embeddedCells && embeddedCells.length > 0){
          const nodesArray = [];
          for(let cell of embeddedCells){
            if(cell.attributes.type == 'link') continue;
            nodesArray.push({
              nid: cell.id,
              x: cell.attributes.position.x,
              y: cell.attributes.position.y
            });

            this.startingElement.unembed(cell);
          }

          nodesArray.push({
            nid: this.startingElement.id,
            x: this.startingElement.attributes.position.x,
            y: this.startingElement.attributes.position.y
          });

          this.ignoreAction();
          this.call('onNodesMove', nodesArray);
        }else{
          this.onNodeMove(cellView.model);
        }
      }
    }

    this.cellsEmbedded = false;
    this.startingPointerPosition = null;
  }

  onDeleteKey(e){
    if(e.keyCode == 46 && (this.get('detailNodeId') || this.canvas.selected.size > 0) &&
      !(e.target.matches('input') || e.target.matches('[contenteditable]') || e.target.matches('textarea'))){

      if(this.canvas.selected.size > 0){
        this.call('onNodesDelete', this.canvas.selected);
      }else{
        this.call('onNodeDelete', this.get('detailNodeId'));
      }
    }
  }

  onNodeMove(cell){
    if(cell.attributes.type != 'link'){
      this.ignoreAction();
      this.call('onNodeMove', cell.id, cell.attributes.position.x, cell.attributes.position.y);
    }
  }
}

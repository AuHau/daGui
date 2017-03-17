import CanvasComponentBase from './CanvasComponentBase'

export default class Nodes extends CanvasComponentBase{
  constructor(canvas) {
    super(canvas);
  }

  init() {
    this.graph = this.canvas.graph;
    this.canvas.paper.on('cell:pointerdown blank:pointerdown', this.onPointerDown.bind(this));
    this.canvas.paper.on('cell:pointerup', this.onPointerUp.bind(this));
    document.addEventListener('keyup', this.onDeleteKey.bind(this));
  }


  // TODO: [BUG/Medium] When dragging node Z value should be the highest in graph
  onPointerDown(cellView, e, x, y){
    if(!y){ // blank click
      this.startingPointerPosition = {x: cellView.clientX, y: cellView.clientY};
    }else{ // cell click
      this.startingPointerPosition = {x, y};
      this.freeze();
    }
  }

  onPointerUp(cellView, e, x, y){
    if(!e.target || e.target.type != 'text') this.unfreeze();

    if(Math.abs(this.startingPointerPosition.x - x) < this.canvas.CLICK_TRESHOLD
      && Math.abs(this.startingPointerPosition.y - y) < this.canvas.CLICK_TRESHOLD) {
      // Click
      if(e.target && e.target.type == 'text'){
        e.target.focus(); // Variable input
      }
    }else{
      // Drag node
      if(cellView.model.isElement()){
        this.onNodeMove(cellView);
      }
    }

    this.startingPointerPosition = null;
  }

  onDeleteKey(e){
    if(e.keyCode == 46 && (this.get('detailNodeId') || this.canvas.selected.size > 0) &&
      !(e.target.matches('input') || e.target.matches('[contenteditable]') || e.target.matches('textarea'))){

      if(this.canvas.selected.size > 0){
        for(let nid of this.canvas.selected){
          this.call('onNodeDelete', nid); // TODO: [Medium] Batch node deletion
        }
      }else{
        this.call('onNodeDelete', this.get('detailNodeId'));
      }
    }
  }

  onNodeMove(cellView){
    if(cellView.model.attributes.type != 'link'){
      const newPosition = cellView.model.attributes.position;
      this.call('onNodeMove', cellView.model.id, newPosition.x, newPosition.y);
    }
  }
}

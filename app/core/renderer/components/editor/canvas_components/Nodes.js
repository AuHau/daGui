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
    this.canvas.paper.on('blank:pointerup', this.resetNodeDetail.bind(this));
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
      if(e.target && e.target.type == 'text'){ // Variable input
        e.target.focus();
      }else if(cellView.model.isElement()){
        this.onNodeDetail(cellView);
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
    if(e.keyCode == 46 && this.get('detailNodeId') &&
      !(e.target.matches('input') || e.target.matches('[contenteditable]') || e.target.matches('textarea'))){

      this.call('onNodeDelete', this.get('detailNodeId'));
    }
  }

  onNodeMove(cellView){
    if(cellView.model.attributes.type != 'link'){
      const newPosition = cellView.model.attributes.position;
      this.call('onNodeMove', cellView.model.id, newPosition.x, newPosition.y);
    }
  }

  onNodeDetail(cellView){
    if(cellView === this.currentDetailCell
      || cellView.model.attributes.type == 'link'){
      return;
    }

    this.currentDetailCell = cellView;
    this.call('onNodeDetail', cellView.model.id);
  }

  resetNodeDetail(e, x, y){
    if(!this.startingPointerPosition) return;

    // Was it panning/multiselect or click on canvas?
    if(Math.abs(this.startingPointerPosition.x - e.clientX) < this.canvas.CLICK_TRESHOLD
      && Math.abs(this.startingPointerPosition.y - e.clientY) < this.canvas.CLICK_TRESHOLD) {

      if(this.currentDetailCell){
        this.call('onNodeDetail', null);
        this.currentDetailCell = null;
      }

      document.querySelectorAll('input').forEach(input => input.blur());
    }
  }

}

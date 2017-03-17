export default class CanvasComponentBase{
  constructor(canvas){
    this.canvas = canvas;
    this.canvasComponents = canvas.canvasComponents;
  }

  init(){
    this.graph = this.canvas.graph;
    this.paper = this.canvas.paper;
  }

  beforeUpdate(){

  }

  afterUpdate(){

  }

  get(key){
    return this.canvas.props[key];
  }

  call(actionFunction, ...args){
    return this.canvas.props[actionFunction].apply(null, args);
  }

  ignoreAction(){
    this.canvas.ignoreAction = true;
  }

  dontReloadGraph(){
    this.canvas.dontReloadGraph = true;
  }

  freeze(){
    this.canvas.freezed = true;
  }

  unfreeze(){
    this.canvas.freezed = false;
  }
}

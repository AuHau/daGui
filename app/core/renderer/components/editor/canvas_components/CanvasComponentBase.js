export default class CanvasComponentBase{
  constructor(canvas){
    this.canvas = canvas;
    this.canvasComponents = canvas.canvasComponents;
  }

  init(){

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
}

import CanvasComponentBase from './CanvasComponentBase'
import styles from "../Canvas.scss";

const VARIABLE_NAME_MAX_WIDTH = 150;
const VARIABLE_NAME_MIN_WIDTH = 30;

const getTextWidth = (text, font = '14px Montserrat, sans-serif') => {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

export default class Variables extends CanvasComponentBase{
  constructor(canvas) {
    super(canvas);
    this.renderCanvas = document.createElement("canvas");
    this.gridSize = 15;
  }

  init() {
    super.init();
    this.paper.el.addEventListener('input', this.onInput.bind(this));
  }

  afterUpdate(){
    this.variableNameIterator(this.graph.getElements());

    // On Blur/Focus of variable name input
    this.paper.el.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', this.onFocus.bind(this));
      input.addEventListener('blur', this.onBlur.bind(this));
      input.addEventListener('change', this.onVariableNameChange.bind(this));
    });

  }

  onInput(e){
    this.recalculateWidthOfVariableName(e.target);
  }

  setVariableName(element, name){
    const parentNode = element.findView(this.paper).el;
    const input = parentNode.querySelectorAll('input')[0];
    input.value = name;

    const classList = parentNode.querySelectorAll('.variableName')[0].classList;
    classList.add.apply(classList, styles.active.split(' '));

    this.recalculateWidthOfVariableName(input);
  }

  variableNameIterator(elements){
    for(let elem of elements) {
      if(elem.attributes.dfGui.variableName){
        this.setVariableName(elem, elem.attributes.dfGui.variableName);
      }
    }
  }

  recalculateWidthOfVariableName(input){
    const width = getTextWidth(input.value) + 49;

    if(width < VARIABLE_NAME_MIN_WIDTH){
      input.parentNode.parentNode.setAttribute('width', VARIABLE_NAME_MIN_WIDTH);
    }else if(width > VARIABLE_NAME_MAX_WIDTH){
      input.parentNode.parentNode.setAttribute('width', VARIABLE_NAME_MAX_WIDTH);
    }else{
      input.parentNode.parentNode.setAttribute('width', width);
    }
  }

  onVariableNameChange(e){
    const nodeId = e.target.closest('.joint-cell').getAttribute('model-id');
    this.call('onUpdateVariable', nodeId, e.target.value);
  }

  onFocus(e){
    const node = e.target.parentNode.parentNode.parentNode;
    node.classList.add.apply(node.classList, styles.focused.split(' '));
    this.freeze();
  }

  onBlur(e){
    const node = e.target.parentNode.parentNode.parentNode;
    node.classList.remove.apply(node.classList, styles.focused.split(' '));
    this.unfreeze();
  }
}

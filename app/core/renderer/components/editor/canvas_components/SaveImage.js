import CanvasComponentBase from './CanvasComponentBase'
import {svgAsPngUri} from 'save-svg-as-png';
import {saveImage} from 'renderer/platformConnector';
import canvg from 'canvg-browser';

export default class SaveImage extends CanvasComponentBase{
  afterUpdate(){
    if(this.get('saveImage')){
      svgAsPngUri(this.canvas.paper.el.childNodes[0], {canvg: canvg}, (uri) => {
        saveImage(this.get('name'), uri);
        this.call('onSaveImageReset');
      });
    }
  }
}

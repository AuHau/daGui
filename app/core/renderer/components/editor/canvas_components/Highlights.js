import HighlightTypes, {classTranslation as highlightTypeClasses} from 'shared/enums/HighlightType';
import HighlightDestination from 'shared/enums/HighlightDestination';
import CanvasComponentBase from './CanvasComponentBase'
import styles from "../Canvas.scss";

export default class Highlights extends CanvasComponentBase{
  constructor(canvas) {
    super(canvas);
    this.renderCanvas = document.createElement("canvas");
    this.gridSize = 15;
  }

  init() {
    super.init();
    this.paper.on('cell:mouseout', this.onMouseOut.bind(this));
    this.paper.on('cell:mouseover', this.onMouseOver.bind(this));
  }

  afterUpdate(){
    if(!this.get('highlights').isEmpty()){
      this.highlightNodes(this.get('highlights'));
    }

    if(this.get('detailNodeId')){
      this.highlightNode(this.get('detailNodeId'), styles.nodeDetail);
    }
  }

  onMouseOut(cellView, e){
    if(!this.get('showCodeView') || this.canvas.freezed) return;

    this.call('onRemoveHighlight', this.currentHoveredNid, HighlightTypes.HOVER, HighlightDestination.CODE_VIEW);
    this.removeHighlight(this.currentHoveredNid, styles.nodeHover);
    this.currentHoveredNid = null;
  }

  onMouseOver(cellView, e){
    if(!this.get('showCodeView') || cellView.model.isLink() || this.canvas.freezed) return;

    if(this.currentHoveredNid != cellView.model.id){
      // There is active Node highlighted ==> for switch have to remove the old one
      if(this.currentHoveredNid !== null) this.call('onRemoveHighlight', this.currentHoveredNid, HighlightTypes.HOVER, HighlightDestination.CODE_VIEW);

      this.call('onAddHighlight', cellView.model.id, HighlightTypes.HOVER, HighlightDestination.CODE_VIEW);
      this.highlightNode(cellView.model.id, styles.nodeHover);
      this.currentHoveredNid = cellView.model.id;
    }
  }

  highlightNodes(highlights) {
    highlights.forEach(highlight => {
      this.highlightNode(highlight.nid, styles[highlightTypeClasses[highlight.type]])
    });
  }

  highlightNode(nid, className = styles.nodeDetail){
    const detailNode = this.graph.getCell(nid);
    if(!detailNode) return; // nid doesn't exists in graph ==> abort highlighting

    const view = this.paper.findViewByModel(detailNode);
    view.highlight(view.el.querySelectorAll('rect'), {     // TODO: [Medium] Delegate returning element for highlighting to Node Template
      highlighter: {
        name: 'addClass',
        options: {
          className: className
        }
      }
    });
  }

  removeHighlight(nid, className = styles.nodeDetail){
    const detailNode = this.graph.getCell(nid);
    if(!detailNode) return; // nid doesn't exists in graph ==> abort highlighting

    const view = this.paper.findViewByModel(detailNode);
    view.unhighlight(view.el.querySelectorAll('rect'), {     // TODO: [Medium] Delegate returning element for highlighting to Node Template
      highlighter: {
        name: 'addClass',
        options: {
          className: className
        }
      }
    });
  }
}

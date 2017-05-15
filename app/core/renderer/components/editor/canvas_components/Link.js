import CanvasComponentBase from './CanvasComponentBase'
import {countInPorts} from 'graph/graphToolkit';

export default class Link extends CanvasComponentBase {
  constructor(canvas) {
    super(canvas);
  }

  onPointerDown(cellView, e, x, y) {
    this.startingPointerPosition = {x, y};
    this.freeze();
  }

  onPointerUp(cellView, e, x, y) {
    if(!e.target || e.target.type != 'text') this.unfreeze();

    if (
      Math.abs(this.startingPointerPosition.x - x) < this.canvas.CLICK_TRESHOLD // Is it click?
      && Math.abs(this.startingPointerPosition.y - y) < this.canvas.CLICK_TRESHOLD // Is it click?
      && cellView.model.isLink()
    ) {
      this.addLink(cellView)
    } else if ( // It is drag
      cellView.model.isLink()
      && cellView.model.attributes.target.id // Needs to verify, that the link is not left hanging in middle of nowhere
    ){
      this.addLink(cellView);
    }

    this.startingPointerPosition = null;
  }

  init() {
    this.graph = this.canvas.graph;
    this.canvas.paper.on('cell:pointerdown', this.onPointerDown.bind(this));
    this.canvas.paper.on('cell:pointerup', this.onPointerUp.bind(this));
    this.graph.on('remove', this.removeLink.bind(this));
  }

  addLink(cellView) {
    if(!cellView.model.graph) return; // Needs to verify, that the click was not on remove button

    const sourceElement = this.graph.getCell(cellView.model.attributes.source.id);
    const sourcesChildren = this.graph.getConnectedLinks(sourceElement, {outbound: true});

    // Source node has multiple children ==> add an variables to them
    if (sourcesChildren.length > 1) {
      let childrenElement;
      const batchUpdate = [];
      for (let children of sourcesChildren) {
        childrenElement = this.graph.getCell(children.attributes.target.id);
        if (!childrenElement.attributes.dfGui.variableName) {
          const variableName = this.get('language').nameNode(this.get('adapter').getNodeTemplates()[childrenElement.attributes.type], this.get('usedVariables'));
          batchUpdate.push({nid: childrenElement.id, newVariableName: variableName});
        }
      }

      this.call('onLinkAddAndUpdateVariables', batchUpdate, cellView.model.toJSON(), cellView.model.attributes.target.id, cellView.model.attributes.target.port);
    }else{
      this.call('onLinkAdd', cellView.model.toJSON(), cellView.model.attributes.target.id, cellView.model.attributes.target.port);
    }
  }

  removeLink(link) {
    this.unfreeze();
    if (link.attributes.target && link.attributes.target.id) {
      const sourceElement = this.graph.getCell(link.attributes.source.id);
      const targetElement = this.graph.getCell(link.attributes.target.id);
      const sourcesChildren = this.graph.getConnectedLinks(sourceElement, {outbound: true});

      if (sourcesChildren.length == 1) { // Delete variable only when going from 2 links to 1 link
        this.call('onLinkDeleteAndVariables', [sourcesChildren[0].attributes.target.id, targetElement.id], link.id, link.attributes.target.id, link.attributes.target.port);
      } else if (targetElement.attributes.dfGui.variableName && countInPorts(targetElement) == 1) {
        this.call('onLinkDeleteAndVariables', [targetElement.id], link.id, link.attributes.target.id, link.attributes.target.port);
      } else {
        this.call('onLinkDelete', link.id, link.attributes.target.id, link.attributes.target.port);
      }
    }
  }

}

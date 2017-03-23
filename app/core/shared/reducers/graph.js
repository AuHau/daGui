import Immutable from 'immutable';
import GRAPH from 'shared/actions/graph';
import Config from '../../../config/';

const getActive = (state) => {
  return state.get('active');
};

const findIndex = (state, id) => {
  return state.get('cells').findIndex(node => node.get('id') == id);
};

export default (state, action, wholeState) => {
  let index, cells, tmp;

  switch (action.type) {
    case GRAPH.ADD_LINK:
      tmp = state.update('cells', nodes => nodes.push(Immutable.fromJS(action.payload.linkObject)));
      tmp = tmp.update('$occupiedPorts', nodes => nodes.update(action.payload.targetNid, ports => (ports ? ports.add(action.payload.targetPort) : Immutable.Set([action.payload.targetPort])) ));
      return tmp;

    case GRAPH.REMOVE_LINK:
      cells = state.get('cells');
      tmp = cells.filter(node => node.get('id') != action.payload.linkId && node.getIn(['source', 'id']) != action.payload.linkId && node.getIn(['target', 'id']) != action.payload.linkId );
      tmp = state.set('cells', tmp);

      return tmp.update('$occupiedPorts', nodes => nodes.update(action.payload.targetNid, ports => ports.delete(action.payload.targetPort) ));

    case GRAPH.UPDATE_NODE:
      index = findIndex(state, action.payload.id);

      return state.setIn(['cells', index], Immutable.fromJS(action.payload));

    case GRAPH.MOVE_NODE:
      const newPosition = Immutable.Map({x: action.x, y: action.y});
      index = findIndex(state, action.nid);
      return state.setIn(['cells', index, 'position'], newPosition);

    case GRAPH.ADD_NODE:
      const zoom = wholeState.getIn(['opened', getActive(wholeState), 'zoom']);
      tmp = action.payload;
      tmp.position.x = (tmp.position.x - wholeState.getIn(['opened', getActive(wholeState), '$pan', 'x']) + (tmp.size.width / 2)) / zoom;
      tmp.position.y = (tmp.position.y - wholeState.getIn(['opened', getActive(wholeState), '$pan', 'y']) + (tmp.size.height / 2)) / zoom;
      return state.update('cells', nodes => nodes.push(Immutable.fromJS(tmp)));

    case GRAPH.DELETE_NODE:
      cells = state.get('cells');
      let filtered = cells.filter(node => node.get('id') != action.payload && node.getIn(['source', 'id']) != action.payload && node.getIn(['target', 'id']) != action.payload );
      return state.set('cells', filtered);

    case GRAPH.UPDATE_VARIABLE:
      index = findIndex(state, action.payload.nid);
      const oldVariableName = state.getIn(['cells', index, 'dfGui', 'variableName']);
      return state.setIn(['cells', index, 'dfGui', 'variableName'], action.payload.newVariableName)
                .deleteIn(['usedVariables', oldVariableName])
                .setIn(['usedVariables', action.payload.newVariableName], action.payload.nid);

    case GRAPH.REMOVE_VARIABLE:
      index = findIndex(state, action.payload.nid);
      const variableName = state.getIn(['cells', index, 'dfGui', 'variableName']);
      return state.deleteIn(['cells', index, 'dfGui', 'variableName'])
        .deleteIn(['usedVariables', variableName]);

    case GRAPH.PAN:
      return wholeState.updateIn(['opened', getActive(wholeState), '$pan'], pan => pan.set('x', action.payload.x).set('y', action.payload.y));

    case GRAPH.ZOOM:
      tmp = wholeState.setIn(['opened', getActive(wholeState), 'zoom'], action.payload.scale);
      return tmp.updateIn(['opened', getActive(wholeState), '$pan'], pan => pan.set('x', action.payload.panX).set('y', action.payload.panY));

    case GRAPH.ZOOM_IN:
      // TODO: [Low] Calculate center of the screen to zoom to middle
      return wholeState.updateIn(['opened', getActive(wholeState), 'zoom'], zoom => zoom + Config.canvas.zoomStep);

    case GRAPH.ZOOM_OUT:
      return wholeState.updateIn(['opened', getActive(wholeState), 'zoom'], zoom => zoom - Config.canvas.zoomStep);

    default:
      return state;
  }
};

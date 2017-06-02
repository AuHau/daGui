import Immutable from 'immutable';
import jointjs from 'jointjs';
import GRAPH from 'shared/actions/graph';
import Config from '../../../config/';

const getActive = (state) => {
  return state.get('active');
};

const findIndex = (state, id) => {
  return state.get('cells').findIndex(node => node.get('id') == id);
};

const newPresent = (wholeState, newPresent) => {
  const past = wholeState.getIn(['opened', getActive(wholeState), 'history', 'past']);
  const present = wholeState.getIn(['opened', getActive(wholeState), 'history', 'present']);

  return wholeState.setIn(['opened', getActive(wholeState), 'history'],
    Immutable.Map({
      'past': past.push(present),
      'present': newPresent,
      'future': Immutable.List()
    }));
};

export default (state, action, wholeState) => {
  let tmp;

  switch (action.type) {
    case GRAPH.ADD_LINK:
      return addLinkReducer(state, action.payload, wholeState);

    case GRAPH.REMOVE_LINK:
      return removeLinkReducer(state, action.payload, wholeState);

    case GRAPH.UPDATE_NODE:
      return updateNodeReducer(state, action.payload, wholeState);

    case GRAPH.MOVE_NODE:
      return moveNodeReducer(state, action.payload, wholeState);

    case GRAPH.ADD_NODE:
      return addNodeReducer(state, action.payload, wholeState);

    case GRAPH.DELETE_NODE:
      return deleteNodeReducer(state, action.payload, wholeState);

    case GRAPH.UPDATE_VARIABLE:
      return updateVariableReducer(state, action.payload, wholeState);

    case GRAPH.REMOVE_VARIABLE:
      return removeVariableReducer(state, action.payload, wholeState);

    case GRAPH.PAN$:
      return panReducer$(state, action.payload, wholeState);

    case GRAPH.ZOOM$:
      return zoomReducer$(state, action.payload, wholeState);

    case GRAPH.ZOOM_IN$:
      return zoomInReducer$(state, null, wholeState);

    case GRAPH.ZOOM_OUT$:
      return zoomOutReducer$(state, null, wholeState);

    case GRAPH.ADD_SELECTED:
      return addSelectedReducer$(state, action.payload, wholeState);

    case GRAPH.REMOVE_SELECTED:
      return removeSelectedReducer$(state, action.payload, wholeState);

    case GRAPH.COPY$:
      return copyReducer$(state, null, wholeState);

    case GRAPH.CUT$:
      return cutReducer$(state, null, wholeState);

    case GRAPH.PASTE$:
      return pasteReducer$(state, null, wholeState);

    ////////////////////////////////////////////////////////////
    // BATCH ACTIONS
    case GRAPH.REMOVE_LINK_AND_VARIABLES:
      tmp = state;
      for(let variable of action.payload.variables){
        tmp = removeVariableReducer(tmp, {nid: variable}, wholeState);
      }

      return removeLinkReducer(tmp, action.payload, wholeState);

    ////////////////////////////
    case GRAPH.ADD_LINK_AND_UPDATE_VARIABLES:
      tmp = state;
      for(let variable of action.payload.variables){
        tmp = updateVariableReducer(tmp, variable, wholeState);
      }

      return addLinkReducer(tmp, action.payload, wholeState);

    ////////////////////////////
    case GRAPH.ADD_NODE_AND_UPDATE_VARIABLES:
      tmp = addNodeReducer(state, action.payload.nodeObject, wholeState);
      for(let variable of action.payload.variables){
        tmp = updateVariableReducer(tmp, variable, wholeState);
      }

      return tmp;

    ////////////////////////////
    case GRAPH.MOVE_NODES:
      tmp = state;
      for(let node of action.payload.nodes){
        tmp = moveNodeReducer(tmp, node, wholeState);
      }

      return tmp;

    ////////////////////////////
    case GRAPH.DELETE_NODES:
      tmp = state;
      for(let node of action.payload.nodes){
        tmp = deleteNodeReducer(tmp, {nid: node}, wholeState);
      }

      return tmp;

    ////////////////////////////
    case GRAPH.UPDATE_VARIABLES:
      tmp = state;
      for(let variable of action.payload.nodes){
        tmp = updateVariableReducer(tmp, variable, wholeState);
      }

      return tmp;

    default:
      return state;
  }
};

function addLinkReducer(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  let tmp = state.update('cells', nodes => nodes.push(Immutable.fromJS(payload.linkObject)));
  tmp = tmp.update('$occupiedPorts', nodes => nodes.update(payload.targetNid, ports => (ports ? ports.add(payload.targetPort) : Immutable.Set([payload.targetPort])) ));
  return tmp;
}

function removeLinkReducer(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  const cells = state.get('cells');
  let tmp = cells.filter(node => node.get('id') != payload.linkId && node.getIn(['source', 'id']) != payload.linkId && node.getIn(['target', 'id']) != payload.linkId );
  tmp = state.set('cells', tmp);

  return tmp.update('$occupiedPorts', nodes => nodes.update(payload.targetNid, ports => ports.delete(payload.targetPort) ));
}

function updateNodeReducer(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  const index = findIndex(state, payload.id);
  return state.setIn(['cells', index], Immutable.fromJS(payload));
}

function moveNodeReducer(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  const newPosition = Immutable.Map({x: payload.x, y: payload.y});
  const index = findIndex(state, payload.nid);
  return state.setIn(['cells', index, 'position'], newPosition);
}

function addNodeReducer(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  const zoom = wholeState.getIn(['opened', getActive(wholeState), 'zoom']);
  const tmp = payload;
  tmp.position.x = (tmp.position.x - wholeState.getIn(['opened', getActive(wholeState), '$pan', 'x']) + (tmp.size.width / 2)) / zoom;
  tmp.position.y = (tmp.position.y - wholeState.getIn(['opened', getActive(wholeState), '$pan', 'y']) + (tmp.size.height / 2)) / zoom;
  return state.update('cells', nodes => nodes.push(Immutable.fromJS(tmp)));
}

function deleteNodeReducer(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  const cells = state.get('cells');
  const nid = payload.nid;

  // If the nodes had associated variableName ==> delete it from usedVariables
  let usedVariables = state.get('usedVariables');
  const variableName = usedVariables.findKey(tempNid => nid == tempNid);
  if (variableName) {
    usedVariables = usedVariables.delete(variableName);
  }

  // Remove any associated links presence in occupiedPorts
  const linkOriginatingFromNid = cells.filter(node => node.getIn(['source', 'id']) == nid);
  const newOccupiedPorts = state.get('$occupiedPorts')
    .mapEntries(([occupiedNid, ports]) => {
      const link = linkOriginatingFromNid.find(node => node.getIn(['target', 'id']) == occupiedNid);
      if(link && ports.has(link.getIn(['target', 'port']))){
        return [occupiedNid, ports.delete(link.getIn(['target', 'port']))];
      }

      return [occupiedNid, ports];
    });

  // Remove the node + all the links incoming/outgoing from the node
  const filtered = cells.filter(node => node.get('id') != nid && node.getIn(['source', 'id']) != nid && node.getIn(['target', 'id']) != nid );

  return state
    .set('cells', filtered)
    .set('$occupiedPorts', newOccupiedPorts)
    .set('usedVariables', usedVariables);
}

function updateVariableReducer(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  const index = findIndex(state, payload.nid);
  const oldVariableName = state.getIn(['cells', index, 'dfGui', 'variableName']);
  return state.setIn(['cells', index, 'dfGui', 'variableName'], payload.newVariableName)
    .deleteIn(['usedVariables', oldVariableName])
    .setIn(['usedVariables', payload.newVariableName], payload.nid);

}

function removeVariableReducer(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  const index = findIndex(state, payload.nid);
  const variableName = state.getIn(['cells', index, 'dfGui', 'variableName']);
  return state.deleteIn(['cells', index, 'dfGui', 'variableName'])
    .deleteIn(['usedVariables', variableName]);
}

function panReducer$(state, payload, wholeState){
  if(getActive(wholeState) < 0) return wholeState; // No opened files ==> terminate

  return wholeState.updateIn(['opened', getActive(wholeState), '$pan'], pan => pan.set('x', payload.x).set('y', payload.y));
}

function zoomReducer$(state, payload, wholeState){
  if(getActive(wholeState) < 0) return wholeState; // No opened files ==> terminate

  const tmp = wholeState.setIn(['opened', getActive(wholeState), 'zoom'], payload.scale);
  return tmp.updateIn(['opened', getActive(wholeState), '$pan'], pan => pan.set('x', payload.panX).set('y', payload.panY));
}

function zoomInReducer$(state, payload, wholeState){
  if(getActive(wholeState) < 0) return wholeState; // No opened files ==> terminate

  // TODO: [Low] Calculate center of the screen to zoom to middle
  return wholeState.updateIn(['opened', getActive(wholeState), 'zoom'], zoom => zoom + Config.canvas.zoomStep);
}

function zoomOutReducer$(state, payload, wholeState){
  if(getActive(wholeState) < 0) return wholeState; // No opened files ==> terminate

  return wholeState.updateIn(['opened', getActive(wholeState), 'zoom'], zoom => zoom - Config.canvas.zoomStep);
}

function addSelectedReducer$(state, payload, wholeState){
  if(getActive(wholeState) < 0) return wholeState; // No opened files ==> terminate

  return wholeState.updateIn(['opened', getActive(wholeState), '$selected'], selected => selected.push(payload.nid));
}

function removeSelectedReducer$(state, payload, wholeState){
  if(getActive(wholeState) < 0) return wholeState; // No opened files ==> terminate

  return wholeState.updateIn(['opened', getActive(wholeState), '$selected'], selected => selected.filter(nid => nid != payload.nid));
}

function copyReducer$(state, payload, wholeState){
  if(getActive(wholeState) < 0) return wholeState; // No opened files ==> terminate

  return wholeState.set('copied_from', getActive(wholeState)).set('$copied', wholeState.getIn(['opened', getActive(wholeState), '$selected']));
}

function cutReducer$(state, payload, wholeState){
  if(getActive(wholeState) < 0) return wholeState; // No opened files ==> terminate

  const selected = wholeState.getIn(['opened', getActive(wholeState), '$selected']);
  const cuttedNodes = wholeState.getIn(['opened', getActive(wholeState), 'history', 'present', 'cells'])
    .filter(cell =>
      selected.includes(cell.get('id'))
      || (
        selected.includes(cell.getIn(['source', 'id']))
        && selected.includes(cell.getIn(['target', 'id']))
      )
    );

  return newPresent(wholeState,
    wholeState.getIn(['opened', getActive(wholeState), 'history', 'present'])
      .update('cells', cells =>
        cells.filter(cell =>
          !selected.includes(cell.get('id'))
          && !selected.includes(cell.getIn(['source', 'id']))
          && !selected.includes(cell.getIn(['target', 'id']))
        )
      )
  ).set('$copied', cuttedNodes);
}

function pasteReducer$(state, payload, wholeState){
  if(state === null) return wholeState; // No opened files ==> terminate

  if(wholeState.get('$copied').isEmpty())
    return state;

  // Copied contains full node's objects not just their IDs ==> Copy them into the cells
  if(typeof wholeState.get('$copied').first() == "object"){
    return state.set('cells', state.get('cells').concat(wholeState.get('$copied')));
  }

  const copiedCells = new Set();
  const idTranslation = {};
  wholeState.get('$copied').forEach(nid => copiedCells.add(nid));

  const pastingCells = [];
  wholeState.getIn(['opened', wholeState.get('copied_from'), 'history', 'present', 'cells']).forEach(cell => {
    if(copiedCells.has(cell.get('id'))){
      let newId = jointjs.util.uuid();
      idTranslation[cell.get('id')] = newId;
      pastingCells.push(cell.update('position', position => position.set('x', position.get('x') + 20).set('y',  position.get('y') + 20)).set('id', newId));
    }
  });

  wholeState.getIn(['opened', wholeState.get('copied_from'), 'history', 'present', 'cells']).forEach(cell => {
    if(cell.get('type') == 'link' && copiedCells.has(cell.getIn(['source', 'id'])) && copiedCells.has(cell.getIn(['target', 'id']))){
      pastingCells.push(cell.setIn(['source', 'id'], idTranslation[cell.getIn(['source', 'id'])]).setIn(['target', 'id'], idTranslation[cell.getIn(['target', 'id'])]).set('id', jointjs.util.uuid()))
    }
  });

  return newPresent(wholeState,
    wholeState.getIn(['opened', getActive(wholeState), 'history', 'present'])
      .update('cells', nodes => {
        let outNodes = nodes;
        for (let cell of pastingCells) {
          outNodes = outNodes.push(cell);
        }
        return outNodes;
      })
  );
}

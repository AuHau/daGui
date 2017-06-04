
import FILE from 'shared/actions/file';
import Immutable from 'immutable';
import {REHYDRATE} from 'redux-persist/constants'

import graphReducer from './graph';

const getActive = (state) => {
  return state.get('active');
};

const defaultState = {
  active: -1, // Index of active file
  opened: [
  ]
};

export default (state, action, wholeState) => {

  if (state === undefined){
    return Immutable.fromJS(defaultState);
  }

  if(action.type.startsWith('GRAPH_')){
    return graphReducer(state, action, wholeState);
  }

  switch (action.type) {
    case REHYDRATE:
      // On Rehydrate return the persisted state, in case of empty persisted state don't make any changes
      return (action.payload.files ? action.payload.files : wholeState);

    case FILE.NEW:
      return wholeState.update('opened', files => files.push(
        Immutable.fromJS({
          name: action.payload.name,
          path: '',
          lastHistorySaved: -1,
          adapter: action.payload.adapter,
          language: action.payload.language,
          adapterVersion: action.payload.adapterVersion,
          languageVersion: action.payload.languageVersion,
          $selected: [],
          $pan: {
            x: 0,
            y: 0
          },
          zoom: 1,
          "history": {
            past: [],
            future: [],
            present: {
              historyId: 0,
              "usedVariables": {},
              $occupiedPorts: {},
              "cells": []
            }
          }
        })
      )).set('active', wholeState.get('opened').size);

    case FILE.CLOSE:
      let newIndex = action.payload.index;
      const numberOfOpenedFiles = wholeState.get('opened').size;
      if (numberOfOpenedFiles == 1){
        newIndex = -1;
      }else if (newIndex === 0) {
        newIndex = 0; // Don't change the index
      } else {
        newIndex--;
      }

      return wholeState
        .update('opened', files => files.delete(action.payload.index))
        .set('active', newIndex);

    case FILE.SWITCH_TAB:
      return wholeState.set('active', action.payload);

    case FILE.SET_PATH:
      if(getActive(wholeState) < 0) return wholeState;

      return wholeState
        .setIn(['opened', getActive(wholeState), 'path'], action.payload.path)
        .setIn(['opened', getActive(wholeState), 'name'], action.payload.fileName);

    case FILE.FREEZE_SAVED_HISTORY_ID:
      if(getActive(wholeState) < 0) return wholeState;

      return wholeState
        .setIn(
          ['opened', getActive(wholeState), 'lastHistorySaved'],
          wholeState.getIn(['opened', getActive(wholeState), 'history', 'present', 'historyId'])
        );
    case FILE.LOAD:
      return loadFile(wholeState, action);

    default:
      return wholeState;
  }
};

// TODO: [BUG/Middle] After loading the Canvas should be centered to contain the whole graph (linked with "contain" function)
function loadFile(state, action){
  const data = action.payload;
  data['lastHistorySaved'] = 0;
  data['$selected'] = [];
  data['$pan'] = {x: 0, y:0};
  data['zoom'] = 1;
  data['history'] = {
    past: [],
    future: [],
    present: {
      historyId: 0,
      cells: JSON.parse(data.cells),
    }
  };

  const usedVariables = {};
  const $occupiedPorts = Immutable.Map().asMutable();
  for (let node of data.history.present.cells) {
    if(node.dfGui && node.dfGui.variableName){
      usedVariables[node.id] = node.dfGui.variableName;
    }

    if(node.type == "link"){
      if (!$occupiedPorts.get(node.target.id)) $occupiedPorts.set(node.target.id, Immutable.Set());
      $occupiedPorts.set(node.target.id, $occupiedPorts.get(node.target.id).add(node.target.port));
    }
  }

  data.history.present['usedVariables'] = usedVariables;

  delete data.cells;

  const indexOfNewFile = state.get('opened').size;

  let serializedData = Immutable.fromJS(data);
  serializedData = serializedData.setIn(['history', 'present', '$occupiedPorts'], $occupiedPorts.asImmutable());

  return state
    .update('opened', opened => opened.push(serializedData))
    .set('active', indexOfNewFile)
}

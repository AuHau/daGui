
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

  if (state == undefined){
    return Immutable.fromJS(defaultState);
  }

  if(action.type.startsWith('GRAPH_')){
    return graphReducer(state, action, wholeState);
  }

  switch (action.type) {
    case REHYDRATE:
      return action.payload.files;

    case FILE.NEW:
      return wholeState.update('opened', files => files.push(
        Immutable.fromJS({
          name: action.payload.name,
          path: '',
          lastHistorySaved: 0,
          adapter: action.payload.adapter,
          language: action.payload.language,
          adapterTarget: action.payload.adapterVersion,
          languageTarget: action.payload.languageVersion,
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
      ));

    case FILE.CLOSE:
      let newIndex = action.payload.index;
      if (wholeState.get('opened').size == 1){
        newIndex = -1;
      }else if (newIndex === 0) {
        newIndex++;
      } else {
        newIndex--;
      }

      return wholeState
        .update('opened', files => files.delete(action.payload.index))
        .set('active', newIndex);

    case FILE.SWITCH_TAB:
      return wholeState.set('active', action.payload);

    case FILE.SET_PATH:
      return wholeState
        .setIn(['opened', getActive(wholeState), 'path'], action.payload.path)
        .setIn(['opened', getActive(wholeState), 'name'], action.payload.fileName);

    case FILE.FREEZE_SAVED_HISTORY_ID:
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
  const $occupiedPorts = {};
  for(let node of data.cells){
    if(node.dfGui && node.dfGui.variableName){
      usedVariables[node.id] = node.dfGui.variableName;
    }

    if(node.type == "link"){
      if(!$occupiedPorts[node.target.id]) $occupiedPorts[node.target.id] = [];
      $occupiedPorts[node.target.id].push(node.target.port)
    }
  }

  data.history.present['usedVariables'] = usedVariables;
  data.history.present['$occupiedPorts'] = $occupiedPorts;

  delete data.cells;

  const indexOfNewFile = state.get('opened').size;

  return state
    .update('opened', opened => opened.push(Immutable.fromJS(data)))
    .set('active', indexOfNewFile)
}

import * as platformConnector from 'renderer/platformConnector';
import {generateCode, serializeGraph} from 'graph/graphToolkit.js';
import CodeBuilder from 'graph/CodeBuilder';
import SaveMode from "../enums/SaveMode";

const FILE = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  SAVE_DONE: 'SAVE_DONE',
  SWITCH_TAB: 'SWITCH_TAB',
  SET_PATH: 'SET_PATH',
  FREEZE_SAVED_HISTORY_ID: 'FREEZE_SAVED_HISTORY_ID'
};

export default FILE;

export function save(){
  return async (dispatch, getState) => {
    const state = getState();

    const codeBuilder = new CodeBuilder();
    const $currentFile = state.getIn(['files', 'opened', state.getIn(['files', 'active'])]);
    const language = $currentFile.get('language');
    let path = $currentFile.get('path');

    const result = generateCode(codeBuilder, $currentFile);

    if(result && !result.success){
      const reply = platformConnector.confirmDialog(
        "The graph contains errors!",
        "The graph contains errors and therefore the valid code can not be generated. Do you want to save just the graph representation while keep the old version of code in the file?"
      );

      if(reply == 1){ // No
        return Promise.resolve();
      }else{ // Yes
        if(!path){
          const [newPath, fileName] = platformConnector.saveDialog(language);
          path = newPath;
          dispatch(setPath(newPath, fileName));
        }
        //
        const serializedGraph = serializeGraph($currentFile);
        await platformConnector.save(path, "", serializedGraph, language.getCommentChar(), SaveMode.ONLY_GRAPH_DATA);
        dispatch(freezeCurrentSavedHistoryId());
        return Promise.resolve();
      }
    }

    if(!path){
      const [newPath, fileName] = platformConnector.saveDialog(language);
      path = newPath;
      dispatch(setPath(newPath, fileName));
    }
    const serializedGraph = serializeGraph($currentFile);
    platformConnector.save(path, codeBuilder.getCode(), serializedGraph, language.getCommentChar());
    dispatch(freezeCurrentSavedHistoryId());
  }
};

export function setPath(path, fileName){
    return {
      type: FILE.SET_PATH,
      payload: {
        path,
        fileName
      }
    }
}

export function switchTab(newFileIndex){
  return {
    type: FILE.SWITCH_TAB,
    payload: newFileIndex
  }
};

export function freezeCurrentSavedHistoryId(){
  return {
    type: FILE.FREEZE_SAVED_HISTORY_ID
  }
};

import * as platformConnector from 'renderer/platformConnector';
import {generateCode, serializeGraph} from 'graph/graphToolkit.js';
import CodeBuilder from 'graph/CodeBuilder';
import SaveMode from "../enums/SaveMode";
import config from "../../../config/index";

const FILE = {
  NEW: 'NEW',
  LOAD: 'LOAD',
  CLOSE: 'CLOSE',
  SAVE_DONE: 'SAVE_DONE',
  SWITCH_TAB: 'SWITCH_TAB',
  SET_PATH: 'SET_PATH',
  FREEZE_SAVED_HISTORY_ID: 'FREEZE_SAVED_HISTORY_ID'
};

export default FILE;

export function open(){
  return async (dispatch, getState) => {
    const path = await platformConnector.openDialog();
    if(!path){
      return Promise.resolve();
    }

    const state = getState();
    const indexOfTheFile = state.getIn(['files', 'opened']).findKey(file => file.get('path') == path);
    if(indexOfTheFile !== undefined){
      dispatch(switchTab(indexOfTheFile));
      return;
    }

    const fileData = await platformConnector.open(path);
    if(!fileData){
      return Promise.resolve();
    }

    const [name, adapterId, adapterVersion, languageId, languageVersion, cells] = fileData;
    const adapter = config.adapters[adapterId];
    const language = config.languages[languageId];

    dispatch(load(name, path, adapter, adapterVersion, language, languageVersion, cells));
  }
}

export function save(index){
  return async (dispatch, getState) => {
    const state = getState();

    if(!index){
      index = state.getIn(['files', 'active'])
    }

    const codeBuilder = new CodeBuilder();
    const $currentFile = state.getIn(['files', 'opened', index]);
    const language = $currentFile.get('language');
    let path = $currentFile.get('path');
    let name = $currentFile.get('name');

    const result = generateCode(codeBuilder, $currentFile);

    if(result && !result.success){
      if(!platformConnector.confirmDialog(
          "The graph contains errors!",
          "The graph contains errors and therefore the valid code can not be generated. Do you want to save just the graph representation while keep the old version of code in the file?"
        )){ // No
        return Promise.resolve();
      }else{ // Yes
        if(!path){
          const [newPath, fileName] = platformConnector.saveDialog(language, name);
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
      const [newPath, fileName] = platformConnector.saveDialog(language, name);
      path = newPath;
      dispatch(setPath(newPath, fileName));
    }
    const serializedGraph = serializeGraph($currentFile);
    await platformConnector.save(path, codeBuilder.getCode(), serializedGraph, language.getCommentChar());
    dispatch(freezeCurrentSavedHistoryId());
  }
}

export function load(name, path, adapter, adapterVersion, language, languageVersion, cells) {
  return {
    type: FILE.LOAD,
    payload: {
      name,
      path,
      adapter,
      adapterVersion,
      language,
      languageVersion,
      cells
    }
  }
}

export function close(index){
  return async (dispatch, getState) => {
    const state = getState();
    const file = state.getIn(['files', 'opened', index]);

    if(file.get('lastHistorySaved') != file.getIn(['history', 'present', 'historyId'])){
      const result = await platformConnector.messageDialog({
        type: "warning",
        title: "The file contains unsaved changes!",
        message: "The file contains unsaved changes, sooo what do you want me to do?",
        buttons: ["Save the file", "Discard the changes", "Nothing"],
        cancelId: 2
      });

      if(result === 0){
        await save(index)(dispatch, getState)
      }else if(result === 2){
        return Promise.resolve();
      }
    }

    dispatch({
      type: FILE.CLOSE,
      payload: {
        index
      }
    });
  }
}

export function newFile(name, adapter, adapterVersion, language, languageVersion){
    return {
      type: FILE.NEW,
      payload: {
        name,
        adapter,
        adapterVersion,
        language,
        languageVersion
      }
    }
}

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
}

export function freezeCurrentSavedHistoryId(){
  return {
    type: FILE.FREEZE_SAVED_HISTORY_ID
  }
}

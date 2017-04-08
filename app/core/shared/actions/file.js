import * as platformConnector from 'renderer/platformConnector';
import {generateCode, serializeGraph} from 'graph/graphToolkit.js';
import CodeBuilder from 'graph/CodeBuilder';
import SaveMode from "../enums/SaveMode";
import config from "../../../config/index";

const FILE = {
  NEW: 'NEW',
  LOAD: 'LOAD',
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

export function save(){
  return async (dispatch, getState) => {
    const state = getState();

    const codeBuilder = new CodeBuilder();
    const $currentFile = state.getIn(['files', 'opened', state.getIn(['files', 'active'])]);
    const language = $currentFile.get('language');
    let path = $currentFile.get('path');

    const result = generateCode(codeBuilder, $currentFile);

    if(result && !result.success){
      if(!platformConnector.confirmDialog(
          "The graph contains errors!",
          "The graph contains errors and therefore the valid code can not be generated. Do you want to save just the graph representation while keep the old version of code in the file?"
        )){ // No
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
    await platformConnector.save(path, codeBuilder.getCode(), serializedGraph, language.getCommentChar());
    dispatch(freezeCurrentSavedHistoryId());
  }
}

export function load(name, path, adapter, adapterTarget, language, languageTarget, cells) {
  return {
    type: FILE.LOAD,
    payload: {
      name,
      path,
      adapter,
      adapterTarget,
      language,
      languageTarget,
      cells
    }
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

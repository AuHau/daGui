import * as platformConnector from 'renderer/platformConnector';
import {hashRawGraph, normalizeGraph, serializeGraph} from 'graph/graphToolkit.js';
import CodeBuilder from 'graph/CodeBuilder';
import SaveMode from "../enums/SaveMode";
import joint from 'jointjs';

const FILE = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  SAVE_DONE: 'SAVE_DONE',
  SWITCH_TAB: 'SWITCH_TAB',
  SET_PATH: 'SET_PATH',
};

export default FILE;

export function save(){
  return async (dispatch, getState) => {
    const state = getState();

    const codeBuilder = new CodeBuilder();
    const $currentFile = state.getIn(['files', 'opened', state.getIn(['files', 'active'])]);
    const adapter = $currentFile.get('adapter');
    let path = $currentFile.get('path');
    const currentHash = $currentFile.get('lastSavedHash');
    const language = $currentFile.get('language');
    const graph = {cells: $currentFile.getIn(['history', 'present', 'cells']).toJS()};
    const usedVariables = $currentFile.getIn(['history', 'present', 'usedVariables']).toJS();

    const {normalizedGraph, inputs} = normalizeGraph(graph, adapter.isTypeInput);
    const hash = hashRawGraph(normalizedGraph);
    if (currentHash == hash) return Promise.resolve(); // Nothing to save ==> ignore

    // TODO: Optimalization - drop JointJS graph dependency (use only normalized graph)
    const jointGraph = new joint.dia.Graph();
    jointGraph.fromJSON(graph);
    const errors = adapter.validateGraph(jointGraph, normalizedGraph, inputs, language);

    if(errors && errors.length){
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
        // TODO: Saving new savedHash
        return Promise.resolve();
      }
    }

    try {
      adapter.generateCode(codeBuilder, normalizedGraph, inputs, usedVariables, language);
    } catch (e) {
      if (e.name == 'CircularDependency') {
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

          const serializedGraph = serializeGraph($currentFile);
          await platformConnector.save(path, "", serializedGraph, language.getCommentChar(), SaveMode.ONLY_GRAPH_DATA);
          // TODO: Saving new savedHash
          return Promise.resolve();
        }
      } else {
        throw e;
      }
    }

    if(!path){
      const [newPath, fileName] = platformConnector.saveDialog(language);
      path = newPath;
      dispatch(setPath(newPath, fileName));
    }
    const serializedGraph = serializeGraph($currentFile);
    platformConnector.save(path, codeBuilder.getCode(), serializedGraph, language.getCommentChar());
    // TODO: Saving new savedHash
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

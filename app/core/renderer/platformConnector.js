import {remote} from 'electron'
import SaveMode from "../shared/enums/SaveMode";
import electronConfig from "../../config/electron";
import config from "../../config/index";
import md5 from 'js-md5';
import {ipcRenderer} from 'electron';

function passData(cb){
    return (event, data) => {
      data = (typeof data == 'object' ? Utf8ArrayToStr(data) : data);
      // const args = Array.prototype.slice.call(arguments, 1);
      // cb.apply(null, args);
      cb(data); // TODO: [Very low] Make the passData general with arguments variable, not sure why it is not working as it is above.
    }
}

export function bindExecutorCallbacks(onExecutionStdout, onExecutionStderr, onExecutionFinish){
  ipcRenderer.on('execution:stdout', passData(onExecutionStdout));
  ipcRenderer.on('execution:stderr', passData(onExecutionStderr));
  ipcRenderer.on('execution:done', passData(onExecutionFinish));
}

export function startExecution(adapterId, code, execConf, settings){
  ipcRenderer.send(adapterId + ':launchExec', code, execConf, settings);
}

export function terminateExecution(adapterId){
  ipcRenderer.send(adapterId + ':terminateExec')
}

export function save(path, code, graph, commentChar, saveMode = SaveMode.FULL_SAVE) {
  return remote.require('./toolkit').save(path, code, graph, commentChar, saveMode);
}

export function open(path){
  return remote.require('./toolkit').open(path)
    .then(data => {
      const extension = path.match(/\.([a-zA-Z]+)$/)[1];

      let language;
      for(let lng of Object.values(config.languages)){
        if(lng.getFileExtension() == extension){
          language = lng;
          break;
        }
      }

      if(!language){
        throw new Error("It is funny, but I don't know this file extension :( I am soooorry!")
      }

      const daguiMetadataRegex = new RegExp(
        language.getCommentChar() + electronConfig.daguiTags.start + "\\n"
        + language.getCommentChar() + "version:([0-9.]*);hash:([a-zA-Z0-9]+);adapter:([a-zA-Z0-9]+):([0-9.x]*);language:([a-zA-Z0-9]+):([0-9.x]*);(\\[.*?\\])\\n"
        + language.getCommentChar() + electronConfig.daguiTags.end, "gm");

      const daguiData = daguiMetadataRegex.exec(data);
      if(!daguiData || daguiData.length != 7){
        throw new Error("The file does not contain valid daGui metadata. I am sorry but I can't open this file, I know it is really sad :(")
      }

      const pureCode = data.replace(daguiMetadataRegex, '');
      if(md5(pureCode) != daguiData[1] && !confirmDialog("The hashes of the file does not match!", "You were bad boy and you have modified the code, haven't you?! Well I can load the file, but your changes will not be applied to the graph and eventually they will be overwritten if you save the file!\nAre you REALLY (like REALLY) sure you want to continue?")){
        return null;
      }

      const name = remote.require('path').basename(path);

      // return [name, adapter, adapterVersion, language, languageVersion, cells]
      return [name, daguiData[2], daguiData[3], daguiData[4], daguiData[5], daguiData[6]];
    }).catch(err => {
      remote.dialog.showErrorBox("Error while openning file!", err.message);
    });
}

export function openDialog() {

  const fileFilters = Object.values(config.languages).map(lang => {
    return {name: lang.getName(), extensions: [lang.getFileExtension()]}
  });
  fileFilters.unshift({
    name: "daGui supported languages",
    extensions: Object.values(config.languages).map(lang => lang.getFileExtension())
  });

  const [path] = remote.dialog.showOpenDialog({
    title: "Open graph",
    defaultPath: localStorage.getItem("platform.lastPath"),
    filters: fileFilters,
    properties: ['openFile']
  });

  const pathModule = remote.require('path');
  const basedir = pathModule.dirname(path);

  localStorage.setItem("platform.lastPath", basedir);
  return path;
}

export function saveDialog(language, name) {
  let prefilledPath;
  if(localStorage.getItem("platform.lastPath") && name){
    prefilledPath = remote.require('path').join(localStorage.getItem("platform.lastPath"), name)
  }

  const path = remote.dialog.showSaveDialog({
    title: "Save the graph",
    defaultPath: prefilledPath,
    filters: [{name: language.getName(), extensions: [language.getFileExtension()]}]
  });

  const pathModule = remote.require('path');
  const basedir = pathModule.dirname(path);
  const fileName =  pathModule.basename(path);

  localStorage.setItem("platform.lastPath", basedir);
  return [path, fileName];
}

export function confirmDialog(title, message, type = "warning") {
  return remote.dialog.showMessageBox({
    type,
    title,
    message,
    buttons: ["Yes", "No"],
    cancelId: 1
  }) == 0
}

export function messageDialog(options) {
  return remote.dialog.showMessageBox(options)
}

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

function Utf8ArrayToStr(array) {
  if (array == null) {
    return null;
  }

  let out, i, len, c;
  let char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
    c = array[i++];
    switch(c >> 4)
    {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
      // 0xxxxxxx
      out += String.fromCharCode(c);
      break;
      case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = array[i++];
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }

  return out;
}

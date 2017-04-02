import {remote} from 'electron'
import SaveMode from "../shared/enums/SaveMode";

export function save(path, code, graph, commentChar, saveMode=SaveMode.FULL_SAVE){
  return remote.require('./toolkit').save(path, code, graph, commentChar, saveMode);
}

export function saveDialog(language){
    const [path, basedir, fileName] = remote.require('./toolkit').showSaveDialog({
      title: "Save the graph",
      defaultPath: localStorage.getItem("platform.lastPath"),
      filters: [{name: language.getName(), extensions: [language.getFileExtension()]}]
    });

    localStorage.setItem("platform.lastPath", basedir);
    return [path, fileName];
}

export function confirmDialog(title, message, type="warning"){
  return remote.dialog.showMessageBox({
    type,
    title,
    message,
    buttons: ["Yes", "No"],
    cancelId: 1
  })
}

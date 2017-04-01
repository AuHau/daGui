import {remote} from 'electron'
import SaveMode from "../shared/enums/SaveMode";

export function save(path, code, graph, commentChar, saveMode=SaveMode.FULL_SAVE){
  return remote.require('./toolkit').save(path, code, graph, commentChar, saveMode);
}

export function saveDialog(){
    return remote.dialog.showSaveDialog();
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

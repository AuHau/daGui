
const UI = {
  CANVAS_RESIZE: 'UI_CANVAS_RESIZE',
  CHANGE_NODE_DETAIL: 'UI_CHANGE_NODE_DETAIL',
  SHOW_SETTINGS: 'UI_SHOW_SETTINGS',
  TOGGLE_CODE_VIEW: 'UI_CODE_VIEW_TOGGLE',
  SET_MULTISELECT_MODE: 'UI_SET_MULTISELECT_MODE',
  SET_PAN_MODE: 'UI_SET_PAN_MODE',
  SHOW_NEW_FILE_MODAL: 'UI_SHOW_NEW_FILE_MODAL',
  HIDE_NEW_FILE_MODAL: 'UI_HIDE_OPEN_MODAL',
  SHOW_EXEC_CONFS_MODAL: 'UI_SHOW_EXEC_CONFS_MODAL',
  HIDE_EXEC_CONFS_MODAL: 'UI_HIDE_EXEC_CONFS_MODAL',
  START_EXECUTION: 'UI_START_EXECUTION',
  TERMINATE_EXECUTION: 'UI_TERMINATE_EXECUTION',
  SHOW_EXECUTION_REPORTER: 'UI_SHOW_EXECUTION_REPORTER',
  HIDE_EXECUTION_REPORTER: 'UI_HIDE_EXECUTION_REPORTER',
  TOGGLE_EXECUTION_REPORTER: 'UI_TOGGLE_EXECUTION_REPORTER',
  UNDO: 'UNDO',
  REDO: 'REDO'
};
export default UI;

export const canvasResize = (dimensions) => {
  return {
    type: UI.CANVAS_RESIZE,
    payload: dimensions
  }
};

export const changeNodeDetail = (nid) => {
  return {
    type: UI.CHANGE_NODE_DETAIL,
    nid: nid
  }
};

export const codeViewToggle = () => {
  return {
    type: UI.TOGGLE_CODE_VIEW
  }
};

export const showSettings = () => {
  return {
    type: UI.SHOW_SETTINGS
  }
};

export const setMultiselectMode = () => {
  return {
    type: UI.SET_MULTISELECT_MODE
  }
};

export const setPanMode = () => {
  return {
    type: UI.SET_PAN_MODE
  }
};

export const showNewFileModal = () => {
  return {
    type: UI.SHOW_NEW_FILE_MODAL
  }
};

export const hideNewFileModal = () => {
  return {
    type: UI.HIDE_NEW_FILE_MODAL
  }
};

export const showExecConfsModal = () => {
  return {
    type: UI.SHOW_EXEC_CONFS_MODAL
  }
};

export const hideExecConfsModal = () => {
  return {
    type: UI.HIDE_EXEC_CONFS_MODAL
  }
};

export const showEXecutionReporter = () => {
  return {
    type: UI.SHOW_EXECUTION_REPORTER
  }
};

export const hideEXecutionReporter = () => {
  return {
    type: UI.HIDE_EXECUTION_REPORTER
  }
};

export const toggleEXecutionReporter = () => {
  return {
    type: UI.TOGGLE_EXECUTION_REPORTER
  }
};

export const startExecution = () => {
  return {
    type: UI.START_EXECUTION
  }
};

export const terminateExecution = (closeReporter) => {
  return {
    type: UI.TERMINATE_EXECUTION,
    payload: {
      closeReporter
    }
  }
};

export const undo = () => {
  return {
    type: UI.UNDO
  }
};

export const redo = () => {
  return {
    type: UI.REDO
  }
};

const FILE = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  SAVE: 'SAVE',
  SWITCH_TAB: 'SWITCH_TAB',
};

export default FILE;

export const switchTab = (newFileIndex) => {
  return {
    type: FILE.SWITCH_TAB,
    payload: newFileIndex
  }
};

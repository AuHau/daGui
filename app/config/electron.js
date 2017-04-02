/**
 * SPECIAL CONFIG FOR ELECTRON'S MAIN PROCESS
 *
 * No imports of renderer part must not be included here!
 */

const daguiTags = {
  start: '@@@daGuiStart@@@',
  end: '@@@daGuiEnd@@@'
};

export default {
  daguiTags
};

/**
 * SPECIAL CONFIG FOR ELECTRON'S MAIN PROCESS
 *
 * No imports of renderer part must not be included here!
 */

import SparkAdapter from '../adapters/spark/execution';

const daguiTags = {
  start: '@@@daGuiStart@@@',
  end: '@@@daGuiEnd@@@'
};

const adapters = {
  [SparkAdapter.getId()]: SparkAdapter
};

export default {
  daguiTags,
  adapters
};

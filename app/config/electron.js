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

const version = "0.5.0";

export default {
  version,
  daguiTags,
  adapters
};

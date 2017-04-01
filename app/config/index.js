// Adapters
import SparkAdapter from '../adapters/spark/';

// Languages
import Scala from '../core/languages/Scala';

const adapters = {};
adapters[SparkAdapter.getId()] = SparkAdapter;

const languages = {};
languages[Scala.getId()] = Scala;

const canvas = {
  zoomStep: 0.2
};

const daguiTags = {
  start: '@@@daGuiStart@@@',
  end: '@@@daGuiEnd@@@'
};

export default {
  adapters,
  languages,
  canvas,
  daguiTags,
  isNodeHidden: (nodeType) =>{
    return SparkAdapter.getNodeTemplates()[nodeType].isNodeHidden();
  }
}

let initilizied = false;
export function init(){
  if(initilizied) return;

  let data = {};
  // TODO: Load data from Local Storage
}

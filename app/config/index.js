// Adapters
import SparkAdapter from '../adapters/spark/';

// Languages
import Java from '../core/languages/Java';
import Scala from '../core/languages/Scala';
import Python from '../core/languages/Python';

const adapters = {};
adapters[SparkAdapter.getId()] = SparkAdapter;

const languages = {};
languages[Java.getId()] = Java;
languages[Scala.getId()] = Scala;
languages[Python.getId()] = Python;

const canvas = {
  zoomStep: 0.2
};

const version = "0.5.0";

const localForageConfig = {
  name        : 'daGui',
  version     : version,
};


export default {
  version,
  adapters,
  languages,
  canvas,
  localForageConfig,
  isNodeHidden: (nodeType) =>{
    return SparkAdapter.getNodeTemplates()[nodeType].isNodeHidden();
  },
}

let initilizied = false;
export function init(){
  if(initilizied) return;

  let data = {};
  // TODO: Load data from Local Storage
}

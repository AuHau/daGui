import localForage from 'localforage';

const KEYS = {
  CONFIGS: 'execConfs_confs',
  ACTIVE: 'execConfs_active'
};

export default class ExecutionConfigurationsWell{

  static async getConfigurations(adapterId){
    const allConfs = await localForage.getItem(KEYS.CONFIGS) || {};

    return allConfs.hasOwnProperty(adapterId) ? allConfs[adapterId] : {};
  }

  static async setConfigurations(adapterId, confs){
    const allConfs = await localForage.getItem(KEYS.CONFIGS) || {};
    allConfs[adapterId] = confs;
    return localForage.setItem(KEYS.CONFIGS, allConfs);
  }

  static async getActiveConfiguration(adapterId){
    const activeName = await ExecutionConfigurationsWell.getActive(adapterId);
    if(activeName === null) return null;

    const adapterConfs = await ExecutionConfigurationsWell.getConfigurations(adapterId);
    return adapterConfs.hasOwnProperty(activeName) ? adapterConfs[activeName] : null;
  }

  static async getActive(adapterId){
    const allActives = await localForage.getItem(KEYS.ACTIVE) || {};
    return allActives.hasOwnProperty(adapterId) ? allActives[adapterId] : null;
  }

  static async setActive(adapterId, active){
    const allActives = await localForage.getItem(KEYS.ACTIVE) || {};
    allActives[adapterId] = active;
    return localForage.setItem(KEYS.ACTIVE, allActives);
  }
}

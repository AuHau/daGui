import { createTransform } from 'redux-persist-immutable';
import config from '../../../config/index';

function serialize(state, key){
  if(key != 'files'){
    return state;
  }

  const files = state.get('opened').map(file => file.set('language', file.get('language').getId()).set('adapter', file.get('adapter').getId()));

  return state.set('opened', files);
};

function deserialize(state, key){
  if(key != 'files'){
    return state;
  }

  const files = state.get('opened').map(file => file.set('language', config.languages[file.get('language')]).set('adapter', config.adapters[file.get('adapter')]));
  return state.set('opened', files);
}

export default createTransform(
  serialize,
  deserialize,
  {}
)

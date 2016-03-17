import { isArray } from './utils';

const store = {

  prefix: '_whoami.',

  set: (name, value) => {
    let existent = store.get(name);
    if (existent) {
      existent = isArray(existent) ? existent : [existent];
      existent.push(value);
    }
    window.localStorage.setItem(`${store.prefix}${name}`, JSON.stringify(existent || value));
  },

  get: name => {
    if (name) { return JSON.parse(window.localStorage.getItem(`${store.prefix}${name}`), 'null'); }
    let output = {};
    for (let key in window.localStorage) {
      if (key.indexOf(store.prefix) === 0) {
        key = key.replace(store.prefix, '');
        output[key] = store.get(key);
      }
    }
    return output;
  },

  clear: () => {
    for (const key in window.localStorage) {
      if (key.indexOf(store.prefix) === 0) { window.localStorage.removeItem(key); }
    }
  }

}

export default store;

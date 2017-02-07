import { postRequest, isFunction, callCallback } from './utils';
import store from './store';

class whoami {

  constructor(apiUrl, options, callback) {
    if (typeof(apiUrl) === 'object') {
      callback = options;
      options = apiUrl;
      apiUrl = undefined;
    } else if (isFunction(options)) {
      callback = options;
      options = {};
    } else if (isFunction(apiUrl)) {
      callback = apiUrl;
      options = {};
    }

    options = Object.assign({
      basic: true,
      shortcut: true,
      functionsTimeout: 5000
    }, options);

    this.options = options;
    this.filters = Object.keys(this.options).filter(k => this.options[k]);
    this._modules = {};
    this._apiUrl = apiUrl;
    this._callback = callback;

    // Storage Manager
    this.store = store;

    // binds
    this.execute = this.execute.bind(this);
    this.__init = this.__init.bind(this);
    this.__executeModules = this.__executeModules.bind(this);

    // start
    this.__init();
  }

  __init() {
    // load modules
    const req = require.context('./modules', true, /\.js$/);
    req.keys().map(function(path) {
      const mod = req(path);
      const name = path.replace('./', '').replace('.js', '');

      if (mod.init && this.filters.indexOf(name) >= 0) {
        mod.init(this);
      }

      this._modules[name] = mod;
    }.bind(this));
  }

  execute(callback) {
    this.store.clear();

    this.__executeModules(() => {
      const output = this.store.get();

      // post to whoami.js server
      if (this._apiUrl) {

        postRequest(this._apiUrl, output, function(err, data) {
          try {
            data = JSON.parse(data || '{}');
          } catch(e) {
            throw new Error('Failed to parse whoami response', data);
          }

          callCallback(callback, err, data);
          callCallback(this._callback, err, data);
        }.bind(this));

        return;
      }

      // pass to callback
      callCallback(callback, output);
      callCallback(this._callback, output);

    });
  }

  __executeModules(done) {
    let finished = 0;
    const executableFilters = this.filters.filter(f => {
      return f in this._modules && isFunction(this._modules[f].execute);
    });

    // TODO: Promise.all
    executableFilters.map(filter => {
      const fn = this._modules[filter].execute;

      fn(this, () => {
        finished++;

        if (executableFilters.length === finished) {
          done();
        }
      });
    });
  }

}


module.exports = whoami;

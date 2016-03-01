import { postRequest, isArray, isFunction } from './utils';


class whoami {

  constructor(apiUrl, options, callback) {
    if (typeof(apiUrl) === 'object') {
      callback = options;
      options = apiUrl;
      apiUrl = undefined;
    } else if (typeof(options) === 'function') {
      callback = options;
      options = {};
    }

    options = Object.assign({
      basic: true
    }, options);

    this.options = options;
    this.output = {};
    this.filters = Object.keys(this.options).filter(k => this.options[k]);
    this._modules = {};
    this._apiUrl = apiUrl;
    this._callback = callback;

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

  execute() {
    this.output = {};

    this.__executeModules(() => {

      // post to whoami.js server
      if (this._apiUrl) {

        postRequest(this._apiUrl, this.output, function(err, data) {
          try {
            data = JSON.parse(data || '{}');
          } catch(e) {}

          if (typeof this._callback === 'function') {
            this._callback(err, data)
          }
        }.bind(this));

        return;
      }

      // pass to callback
      if (this._callback) {
        this._callback(this.output);
      }

    });
  }

  store(name, value) {
    let existent = this.output[name];
    if (existent) {
      existent = isArray(existent) ? existent : [existent];
      existent.push(value);
    }
    this.output[name] = existent || value;
  }

  __executeModules(done) {
    let finished = 0;
    const enabled = this.filters;

    // TODO: Promise.all
    enabled.map(filter => {
      if (!(filter in this._modules)) { return; }

      const fn = this._modules[filter].execute;

      if (isFunction(fn)) {
        fn(this, () => {
          finished++;

          if (enabled.length === finished) {
            done();
          }
        });
      }
    });
  }

}


module.exports = whoami;

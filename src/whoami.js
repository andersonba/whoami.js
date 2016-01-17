import { isArray, isFunction } from './utils';


class whoami {

  constructor(options = {}, callback) {
    if (typeof(options) === 'function') {
      callback = options;
      options = {};
    }

    options.filters = Object.assign({
      basic: true,
      context: true,
      screenshot: true,
      functions: false
    }, options.filters);

    this.options = options;
    this.output = {};
    this.filters = Object.keys(this.options.filters).filter(f => this.options.filters[f]);
    this._callback = callback;
    this._modules = {};

    // binds
    this.execute = this.execute.bind(this);
    this.__init = this.__init.bind(this);
    this.__runModules = this.__runModules.bind(this);

    // start
    this.__init();
  }

  __init() {
    // load modules
    const req = require.context('./modules', true, /\.js$/);
    req.keys().map(function(name) {
      const mod = req(name);

      if (mod.init) {
        mod.init(this);
      }

      this._modules[name.replace('./', '').replace('.js', '')] = mod;
    }.bind(this));
  }

  execute() {
    this.output = {};

    this.__showLoading();

    this.__runModules(() => {

      // execute actions
      // TODO: Promise.all
      Object.keys(this._modules).map(mod => {
        const fn = this._modules[mod].action;

        if (!!this.options[mod] && isFunction(fn)) {
          fn(this, Object.assign({}, this.output));
        }
      });

      // pass to callback
      if (this._callback) {
        this._callback(this.output);
      }

      this.__hideLoading();
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

  __runModules(done) {
    let finished = 0;
    const enabled = this.filters;

    // TODO: Promise.all
    enabled.map(filter => {
      if (!filter in this._modules) { return; }

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

  __showLoading() {
    console.log('Loading: start');
  }

  __hideLoading() {
    console.log('Loading: done');
  }

}


module.exports = whoami;

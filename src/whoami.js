import { isFunction, isArray } from './utils';

const MODULES = [
  'basic',
  'clipboard',
  'console',
  'context',
  'cookie',
  'exception',
  'feedback',
  'function',
  'localStorage',
  'screenshot',
  'shortcut'
];


class whoami {

  constructor(options = {}, callback) {
    if (typeof(options) === 'function') {
      callback = options;
      options = {};
    }

    options.filters = Object.assign({
      basic: true,
      customData: true,
      screenshot: true,
      tasks: false
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
    const self = this;

    // load modules
    const req = require.context('./modules', true, /\.js$/);
    MODULES.map(name => {
      const mod = req(name);

      if (mod.init) {
        mod.init(self);
      }

      self.modules[name] = mod;
    });
  }

  execute() {
    this.output = {};

    this.__showLoading();

    this.__runModules(() => {

      // execute actions
      // TODO: Promise.all
      this.modules.map(mod => {
        const fn = mod.action;

        if (isFunction(fn)) {
          fn(this, this.output);
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
      const fn = this.modules[filter].execute;

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

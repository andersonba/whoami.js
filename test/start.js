window.requirejs.config({

  paths: {
    'utils': '/base/test/utils'
  },

  deps: Object.keys(window.__karma__.files).filter(RegExp.prototype.test.bind(/\.spec\.js$/)),

  callback: function () {
    window.__karma__.start();
  }

});

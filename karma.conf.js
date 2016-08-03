module.exports = function(config) {

  var defaultLauncher = 'Chrome';

  var customLaunchers = {
    firefox_win: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '43.0',
      os: 'Windows',
      os_version: '8.1'
    },
    chrome_win: {
      base: 'BrowserStack',
      browser: 'chrome',
      browser_version: '47.0',
      os: 'Windows',
      os_version: '8.1'
    },
    edge_win: {
      base: 'BrowserStack',
      browser: 'edge',
      browser_version: '12.0',
      os: 'Windows',
      os_version: '10'
    },
    ie11_win: {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '11.0',
      os: 'Windows',
      os_version: '8.1'
    },
    ie10_win: {
      base: 'BrowserStack',
      browser: 'ie',
      browser_version: '10.0',
      os: 'Windows',
      os_version: '8'
    },
    // ie9_win: {
    //   base: 'BrowserStack',
    //   browser: 'ie',
    //   browser_version: '9.0',
    //   os: 'Windows',
    //   os_version: '7'
    // },
    safari_mac: {
      base: 'BrowserStack',
      browser: 'safari',
      browser_version: '9.0',
      os: 'OS X',
      os_version: 'El Capitan'
    },
    firefox_mac: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '38.0',
      os: 'OS X',
      os_version: 'Yosemite'
    },
    chrome_mac: {
      base: 'BrowserStack',
      browser: 'chrome',
      browser_version: '44.0',
      os: 'OS X',
      os_version: 'Mavericks'
    }
  };

  config.set({

    browsers: function(){
      if (!process.env.CI) { return [defaultLauncher]; }
      return Object.keys(customLaunchers);
    }(),


    browserStack: {
      project: 'whoami.js',
      build: process.env.CI_BUILD_NUMBER || 'dev'
    },


    customLaunchers: customLaunchers,


    browserNoActivityTimeout: 70000,


    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'dist/whoami.min.js',
      'test/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': ['babel']
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015']
      }
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: !process.env.CI,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: process.env.CI,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 2
  })
}

module.exports = function(config) {
  config.set({

    // global config of your BrowserStack account
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY
    },

    // define browsers
    customLaunchers: {
      firefox_win: {
        base: 'BrowserStack',
        browser: 'Firefox',
        browser_version: '43',
        os: 'Windows',
        os_version: '8.1'
      },
      chrome_win: {
        base: 'BrowserStack',
        browser: 'Chrome',
        browser_version: '47',
        os: 'Windows',
        os_version: '8.1'
      },
      edge_win: {
        base: 'BrowserStack',
        browser: 'Edge',
        browser_version: '12',
        os: 'Windows',
        os_version: '10'
      },
      ie11_win: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '11',
        os: 'Windows',
        os_version: '8.1'
      },
      ie10_win: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '10',
        os: 'Windows',
        os_version: '8'
      },
      ie9_win: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '9',
        os: 'Windows',
        os_version: '7'
      },
      ie8_win: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '8',
        os: 'Windows',
        os_version: '7'
      },
      safari_mac: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '9',
        os: 'OS X',
        os_version: 'El Capitan'
      }
    },


    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai', 'sinon', 'jquery-2.1.0'],


    // list of files / patterns to load in the browser
    files: [
      'dist/whoami.min.js',
      'test/start.js',
      {pattern: 'test/**/*.js', included: false},
      {pattern: 'dist/*.js', included: false}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': ['babel']
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
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['firefox_win', 'chrome_win', 'edge_win', 'ie11_win', 'ie10_win', 'ie9_win', 'ie8_win', 'safari_mac']


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

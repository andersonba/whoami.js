var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  context: __dirname,

  entry: './src/whoami.js',

  output: {
    path: './dist',
    filename: 'whoami.js',
    libraryTarget: 'var',
    library: 'whoami'
  },

  module: {

    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]

  },

  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: {
        baseDir: ['dist'],
        index: "demo.html"
      }
    })
  ],

  resolve: {
    extensions: ['', '.js']
  }
}

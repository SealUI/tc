const path = require('path')
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const cwd = process.cwd()
const pkg = require(`${cwd}/package`)

module.exports = {
  mode: 'production',
  entry: {
    app: `${cwd}/src/app.js`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },
  output: {
    filename: '[name].js',
    library: 'TC',
    libraryTarget: 'umd',
    path: `${cwd}/dist/mp`
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(`${pkg.version}`),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      '@': `${cwd}/src`
    }
  }
}

// const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MpPlugin = require('mp-webpack-plugin')
const utils = require('../lib/util/util')

const cwd = process.cwd()
const outputDir = `${cwd}/dist/mp/common`
const isOptimize = process.env.NODE_ENV === 'production'
const miniprogramConfig = merge(require(cwd + '/miniprogram.config.js'), { router: utils.getRouters() })

module.exports = {
  mode: 'production',
  entry: utils.getEntrys(),
  output: {
    path: outputDir, // 放到小程序代码目录中的 common 目录下
    filename: '[name].js', // 必需字段，不能修改
    library: 'createApp', // 必需字段，不能修改
    libraryExport: 'default', // 必需字段，不能修改
    libraryTarget: 'window' // 必需字段，不能修改
  },

  optimization: {
    runtimeChunk: false, // 必需字段，不能修改
    splitChunks: {
      // 代码分隔配置，不建议修改
      chunks: 'all',
      minSize: 1000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 100,
      maxInitialRequests: 100,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },

    minimizer: isOptimize
      ? [
          // 压缩CSS
          new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.(css|wxss)$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true
                  },
                  minifySelectors: false // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
                }
              ]
            },
            canPrint: false
          }),
          // 压缩 js
          new TerserPlugin({
            terserOptions: {
              compress: {
                // turn off flags with small gains to speed up minification
                arrows: false,
                collapse_vars: false, // 0.3kb
                comparisons: false,
                computed_props: false,
                hoist_funs: false,
                hoist_props: false,
                hoist_vars: false,
                inline: false,
                loops: false,
                negate_iife: false,
                properties: false,
                reduce_funcs: false,
                reduce_vars: false,
                switches: false,
                toplevel: false,
                typeofs: false,

                // a few flags with noticable gains/speed ratio
                // numbers based on out of the box vendor bundle
                booleans: true, // 0.7kb
                if_return: true, // 0.4kb
                sequences: true, // 0.7kb
                unused: true, // 2.3kb

                // required features to drop conditional branches
                conditionals: true,
                dead_code: true,
                evaluate: true
              },
              output: {
                ecma: 5,
                comments: /^\**!|@preserve|@license|@cc_on/,
                ascii_only: true
              },
              mangle: {
                safari10: true
              }
            },
            parallel: true,
            cache: true,
            sourceMap: false
          })
        ]
      : []
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.vue$/,
        loader: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      '@': `${cwd}/src`
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      // __VERSION__: JSON.stringify(`${pkg.version}`),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.isMiniprogram': process.env.isMiniprogram // 注入环境变量，用于业务代码判断
    }),
    new MiniCssExtractPlugin({
      filename: '[name].wxss'
    }),
    new VueLoaderPlugin(),
    new ProgressBarPlugin(),
    new CopyWebpackPlugin([
      {
        from: `${cwd}/src/images`,
        to: `${cwd}/dist/mp/images`,
        force: true,
        ignore: ['.*']
      }
    ]),
    new MpPlugin(miniprogramConfig)
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 800000
  }
}

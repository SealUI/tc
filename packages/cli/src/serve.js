process.on('exit', () => {
  console.log()
})

process.env.NODE_ENV = 'development'

const fs = require('fs-extra')
const webpack = require('webpack')
const merge = require('webpack-merge')
const chalk = require('chalk')
const basePageWebpackConfig = require('../config/page.webpack.config')
const baseAppConfig = require('../config/app.webpack.config')
const utils = require('../lib/util/util')

const cwd = process.cwd()

// 获取是否有自定义配置文件
const getCustomConfig = async () => {
  let pageWebpackConfig
  const file = `${cwd}/tc.config.js`
  const hasCustomFile = await fs.pathExists(file)

  if (hasCustomFile) {
    let customWebpackConfig = require(file)
    pageWebpackConfig = merge(basePageWebpackConfig, customWebpackConfig)
    pageWebpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin(), new webpack.NamedModulesPlugin())
    pageWebpackConfig.stats = 'errors-only'
  } else {
    pageWebpackConfig = basePageWebpackConfig
  }
  return pageWebpackConfig
}

// 启动开发环境
const startServe = async (config, proc) => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)
    compiler.watch({}, (err, stats) => {
      if (err) {
        reject(err)
      }
      utils.logStats(proc, stats)
      resolve()
    })
  })
}

const serve = async () => {
  const customConfig = await getCustomConfig()
  await startServe(customConfig, 'page')
  await startServe(baseAppConfig, 'app.js')
  return 'success'
}

module.exports = (...args) => {
  serve(...args)
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
    .then(() => {
      utils.clearConsole('TC MinApp 开始编译开发环境...\n')
      console.log(chalk.green('\n  ✔ 编译完成. 请在微信开发者工具中预览.\n  文件监听中...'))
    })
}

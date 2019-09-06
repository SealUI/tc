process.on('exit', () => {
  console.log()
})

process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const webpack = require('webpack')
const merge = require('webpack-merge')
const del = require('del')
const utils = require('../lib/util/util')

const basePageWebpackConfig = require('../config/page.webpack.config')
const baseAppConfig = require('../config/app.webpack.config')
const cwd = process.cwd()

const clean = async () => {
  await del([`${cwd}/dist/mp/*`, `!${cwd}/dist/mp/miniprogram_npm`, `!${cwd}/dist/mp/package.json`])
}

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

const pack = async (config, proc) => {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err.stack || err)
      } else if (stats.hasErrors()) {
        let errs = ''
        stats
          .toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
          })
          .split(/\r?\n/)
          .forEach(line => {
            errs += `    ${line}\n`
          })

        reject(errs)
      } else {
        utils.logStats(proc, stats)
        resolve()
      }
    })
  })
}

const build = async () => {
  utils.clearConsole('TC MinApp 开始编译线上环境...\n')
  const customConfig = await getCustomConfig()
  await clean()
  await pack(customConfig, 'page')
  await pack(baseAppConfig, 'app.js')
}

module.exports = (...args) => {
  build(...args)
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
    .then(() => {
      utils.successLog()
      process.exit(0)
    })
}

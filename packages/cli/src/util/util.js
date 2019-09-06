const path = require('path')
const glob = require('glob')
const readline = require('readline')
const chalk = require('chalk')
const cwd = process.cwd()
const pagesEntry = `${cwd}/src/pages/**/**.js`

/**
 * 获取入口列表
 *
 * @Author 听着情歌流泪
 * @Date   2019-09-02T14:43:05+0800
 * @return {[type]}                 [description]
 */
exports.getEntrys = () => {
  const entries = glob.sync(pagesEntry).reduce((result, entry) => {
    const moduleName = path.basename(path.dirname(entry)) // 获取模块名称
    result[moduleName] = `${entry}`
    return result
  }, {})
  return entries
}

/**
 * 获取路由列表
 *
 * @Author 听着情歌流泪
 * @Date   2019-09-02T14:43:15+0800
 * @return {[type]}                 [description]
 */
exports.getRouters = () => {
  const routers = glob.sync(pagesEntry).reduce((result, router) => {
    const moduleName = path.basename(path.dirname(router)) // 获取模块名称
    result[moduleName] = `/${new Array(moduleName)}`
    return result
  }, {})
  return routers
}

exports.clearConsole = title => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}

exports.logStats = (proc, data) => {
  let log = ''
  log += chalk.yellow.bold(`┏ ${new Array((19 - proc.length + 1) / 2).join('-')} ${proc} 编译详情 ${new Array((19 - proc.length + 1) / 2).join('-')} ┓`)
  log += '\n'

  if (typeof data === 'object') {
    data
      .toString({
        assets: false,
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        errorsOnly: true,
        entrypoints: false
      })
      .split(/\r?\n/)
      .forEach(line => {
        log += '  ' + line + '\n'
      })
  } else {
    log += `  ${data}\n`
  }

  log += chalk.yellow.bold(`┗ ${new Array(28 + 2).join('-')} ┛`)

  console.log(chalk.green.bold(log))
}

exports.successLog = () => {
  let log = ''
  log += '\n\n'
  log += chalk.green.bold(`┏ ${new Array(10).join('-')} TC MinApp ${new Array(10).join('-')} ┓`)
  log += '\n\n'
  log += '  ☞  编译成功... ✔ \n\n'
  log += chalk.green.bold(`┗ ${new Array(28 + 2).join('-')} ┛`)
  log += '\n\n'
  console.log(chalk.green.bold(log))
}

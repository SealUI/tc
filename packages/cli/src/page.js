process.on('exit', () => {
  console.log()
})

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')

const { logWithSpinner, stopSpinner } = require('./util/spinner')
const { log, error } = require('./util/logger')
const { clearConsole } = require('./util/clearConsole')
const { exit } = require('./util/exit')

const Creator = require('./Creator')

async function create(pageName, options) {
  const cwd = options.cwd || process.cwd()
  const targetDir = path.resolve(cwd, './src/pages/', pageName || './src/pages')
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      await clearConsole()
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `页面 ${chalk.cyan(pageName)} 已经存在. 选择一个操作:`,
          choices: [{ name: '覆盖安装', value: 'overwrite' }, { name: '取消创建', value: false }]
        }
      ])
      if (!action) {
        await clearConsole()
        log('👋 Good Bye.')
        log()
        exit(0)
      } else if (action === 'overwrite') {
        logWithSpinner('🗃', '正在移除页面 ${chalk.cyan(pageName)}...')
        await fs.remove(targetDir)
        stopSpinner()
      }
    }
  }
  const creator = new Creator(pageName, targetDir)
  await creator.create(options)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false)
    // error(err)
    process.exit(0)
  })
}

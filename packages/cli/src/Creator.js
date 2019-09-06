const fs = require('fs-extra')
// const os = require('os')
// const path = require('path')
const chalk = require('chalk')
const execa = require('execa')
// const inquirer = require('inquirer')
// const semver = require('semver')
const EventEmitter = require('events')

const { log } = require('./util/logger')
const { clearConsole } = require('./util/clearConsole')
const { logWithSpinner, stopSpinner } = require('./util/spinner')
const writeFile = require('./util/writeFile')

module.exports = class Creator extends EventEmitter {
  constructor(name, context) {
    super()
    this.name = name
    this.context = process.env.CHN_CLI_CONTEXT = context
    this.run = this.run.bind(this)
  }

  async create() {
    const { name, context } = this
    await clearConsole()
    logWithSpinner('✨', '创建模块 ${chalk.yellow(name)}.')
    log()

    log('📂  创建文件夹...')
    await clearConsole()
    fs.mkdirSync(context)
    // stopSpinner()

    logWithSpinner('⚓', '写入文件内容...')
    log()
    await clearConsole()
    await writeFile(name, this.context)
    stopSpinner()
    await clearConsole()
    log()
    logWithSpinner(`页面 ${chalk.greenBright(name)} 创建成功.`)
    stopSpinner()
    log()
  }

  run(command, args) {
    if (!args) {
      ;[command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, { cwd: this.context })
  }
}

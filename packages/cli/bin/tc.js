#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node
const didYouMean = require('didyoumean')

didYouMean.threshold = 0.6

const checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red('You are using Node ' + process.version + ', but this version of ' + id + ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'tc-cli')

if (semver.satisfies(process.version, '8.x')) {
  console.log(chalk.red(`你使用的是 Node ${process.version}.\n请升级Node`))
}

const program = require('commander')

const camelize = str => {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

const cleanArgs = cmd => {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

const suggestCommands = cmd => {
  const availableCommands = program.commands.map(cmd => {
    return cmd._name
  })

  const suggestion = didYouMean(cmd, availableCommands)
  if (suggestion) {
    console.log('  ' + chalk.red(`你是要运行 ${chalk.yellow(suggestion)} 吗?`))
  }
}

program.version(require('../package').version).usage('<command> [options]')

// 创建一个新页面
program
  .command('add <page-name>')
  .description('生成新文件')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/page')(name, options)
  })

// 启动开发环境
program
  .command('serve')
  .description('启动开发环境')
  .allowUnknownOption()
  .action(cmd => {
    require('../lib/serve')()
  })

program
  .command('build')
  .description('启动开发环境')
  .allowUnknownOption()
  .action(() => {
    require('../lib/build')()
  })

program.arguments('<command>').action(cmd => {
  program.outputHelp()
  console.log('  ' + chalk.red(`未知的命令 ${chalk.yellow(cmd)}.`))
  console.log()
  suggestCommands(cmd)
})

program
  .command('info')
  .description('打印系统环境信息')
  .action(() => {
    console.log(chalk.bold('\n环境信息:'))
    require('envinfo')
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'Yarn', 'npm'],
          Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
          npmPackages: '/**/{typescript,*vue*,@vue/*/}'
        },
        {
          showNotFound: true,
          duplicates: true,
          fullTree: true
        }
      )
      .then(console.log)
  })

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan('tc <command> --help')} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// 解析命令行参数
program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

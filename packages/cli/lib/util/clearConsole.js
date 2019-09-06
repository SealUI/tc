const chalk=require("chalk"),semver=require("semver"),{clearConsole}=require("./logger");exports.generateTitle=async function(a){// const { current, latest } = await getVersions()
let b=chalk.bold.blue(`TC CLI`);return a&&(b+=chalk.green(`
┌────────────────────${`─`.repeat(latest.length)}──┐
│  Update available: ${latest}  │
└────────────────────${`─`.repeat(latest.length)}──┘`)),b},exports.clearConsole=async function(a){const b=await exports.generateTitle(a);clearConsole(b)};
const fs=require("fs-extra"),chalk=require("chalk"),execa=require("execa"),EventEmitter=require("events"),{log}=require("./util/logger"),{clearConsole}=require("./util/clearConsole"),{logWithSpinner,stopSpinner}=require("./util/spinner"),writeFile=require("./util/writeFile");// const os = require('os')
// const path = require('path')
module.exports=class extends EventEmitter{constructor(a,b){super(),this.name=a,this.context=process.env.CHN_CLI_CONTEXT=b,this.run=this.run.bind(this)}async create(){const{name:a,context:b}=this;// stopSpinner()
await clearConsole(),logWithSpinner("\u2728","\u521B\u5EFA\u6A21\u5757 ${chalk.yellow(name)}."),log(),log("\uD83D\uDCC2  \u521B\u5EFA\u6587\u4EF6\u5939..."),await clearConsole(),fs.mkdirSync(b),logWithSpinner("\u2693","\u5199\u5165\u6587\u4EF6\u5185\u5BB9..."),log(),await clearConsole(),await writeFile(a,this.context),stopSpinner(),await clearConsole(),log(),logWithSpinner(`页面 ${chalk.greenBright(a)} 创建成功.`),stopSpinner(),log()}run(a,b){return b||([a,...b]=a.split(/\s+/)),execa(a,b,{cwd:this.context})}};
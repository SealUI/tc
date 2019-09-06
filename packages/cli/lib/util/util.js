const path=require("path"),glob=require("glob"),readline=require("readline"),chalk=require("chalk"),cwd=process.cwd(),pagesEntry=`${cwd}/src/pages/**/**.js`;/**
 * 获取入口列表
 *
 * @Author 听着情歌流泪
 * @Date   2019-09-02T14:43:05+0800
 * @return {[type]}                 [description]
 */ /**
 * 获取路由列表
 *
 * @Author 听着情歌流泪
 * @Date   2019-09-02T14:43:15+0800
 * @return {[type]}                 [description]
 */exports.getEntrys=()=>{const a=glob.sync(pagesEntry).reduce((a,b)=>{const c=path.basename(path.dirname(b));// 获取模块名称
return a[c]=`${b}`,a},{});return a},exports.getRouters=()=>{const a=glob.sync(pagesEntry).reduce((a,b)=>{const c=path.basename(path.dirname(b));// 获取模块名称
return a[c]=`/${Array(c)}`,a},{});return a},exports.clearConsole=a=>{if(process.stdout.isTTY){const b="\n".repeat(process.stdout.rows);console.log(b),readline.cursorTo(process.stdout,0,0),readline.clearScreenDown(process.stdout),a&&console.log(a)}},exports.logStats=(a,b)=>{let c="";c+=chalk.yellow.bold(`┏ ${Array((19-a.length+1)/2).join("-")} ${a} 编译详情 ${Array((19-a.length+1)/2).join("-")} ┓`),c+="\n","object"==typeof b?b.toString({assets:!1,colors:!0,modules:!1,children:!1,chunks:!1,chunkModules:!1,chunkOrigins:!1,errorsOnly:!0,entrypoints:!1}).split(/\r?\n/).forEach(a=>{c+="  "+a+"\n"}):c+=`  ${b}\n`,c+=chalk.yellow.bold(`┗ ${Array(30).join("-")} ┛`),console.log(chalk.green.bold(c))},exports.successLog=()=>{let a="";a+="\n\n",a+=chalk.green.bold(`┏ ${Array(10).join("-")} TC MinApp ${Array(10).join("-")} ┓`),a+="\n\n",a+="  \u261E  \u7F16\u8BD1\u6210\u529F... \u2714 \n\n",a+=chalk.green.bold(`┗ ${Array(30).join("-")} ┛`),a+="\n\n",console.log(chalk.green.bold(a))};
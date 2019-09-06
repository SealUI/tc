const path=require("path"),fs=require("fs-extra"),uppercamelcase=require("uppercamelcase"),{log}=require("./logger"),writeFile=async(a,b)=>{const c=uppercamelcase(a);log("\u5199\u5165\u9875\u9762\u6587\u4EF6"),[{filename:`${c}.vue`,content:`<template>
  <div class="tc-${a}">
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
const TC = wx.TC
export default {
  name: 'TC${c}',
  data() {
    return {
      // code
    }
  },
  created() {
    // code
  },
  mounted() {
    // code
  },
  methods: {
    // code
  }
}
</script>

<style lang="scss">
  page {
    height: 100%;
  }
  .tc-demo3{

  }
</style>
`}].forEach(a=>{try{fs.outputFileSync(path.join(b,a.filename),a.content)}catch(a){console.error(a)}}),log("\u5199\u5165\u5165\u53E3\u6587\u4EF6"),[{filename:"main.mp.js",content:`import Vue from 'vue'
import App from './${c}.vue'
export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)
  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
`}].forEach(a=>{try{fs.outputFileSync(path.join(b,a.filename),a.content)}catch(a){console.error(a)}})};module.exports=writeFile;
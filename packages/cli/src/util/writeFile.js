const path = require('path')
const fs = require('fs-extra')
const uppercamelcase = require('uppercamelcase')
const { log } = require('./logger')

const writeFile = async (pageName, pagePath) => {
  const PageName = uppercamelcase(pageName)
  const pageFiles = [
    {
      filename: `${PageName}.vue`,
      content: `<template>
  <div class="tc-${pageName}">
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
const TC = wx.TC
export default {
  name: 'TC${PageName}',
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
`
    }
  ]

  const entryFile = [
    {
      filename: 'main.mp.js',
      content: `import Vue from 'vue'
import App from './${PageName}.vue'
export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)
  return new Vue({
    el: '#app',
    render: h => h(App)
  })
}
`
    }
  ]
  log('写入页面文件')
  pageFiles.forEach(file => {
    try {
      fs.outputFileSync(path.join(pagePath, file.filename), file.content)
    } catch (err) {
      console.error(err)
    }
  })

  log('写入入口文件')
  entryFile.forEach(file => {
    try {
      fs.outputFileSync(path.join(pagePath, file.filename), file.content)
    } catch (err) {
      console.error(err)
    }
  })
}

module.exports = writeFile

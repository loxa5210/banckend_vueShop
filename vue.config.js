module.exports = {
  lintOnSave: false
  // 指定開發與部署時要執行的main
  // chainWebpack: config => {
  //   config.when(process.env.NODE_ENV === 'build', config => {
  //     config.entry('app').clean().add('./src/main-prod.js')
  //   })
  //   config.when(process.env.NODE_ENV === 'dev', config => {
  //     config.entry('app').clean().add('./src/main-dev.js')
  //   })
  // },

  // 發布模式 因打包後容量過大可在此指定會使用到的套件，但需要再main引入css檔案 和js
  // config.set('externals', {
  //   vue: 'Vue',
  //   'vue-router': 'VueRouter',
  //   axios: 'axios',
  //   echarts: 'echarts',
  //   nprogress: 'NProgress',
  //   'vue-quill-editor': 'VueQuillEditor'
  //
  // })
}

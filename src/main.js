import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 導入全局css
import './assets/css/global.css'
import './assets/font/iconfont.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 導入編輯器
import VueQuillEditor from 'vue-quill-editor'
// 導入編輯器 樣式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import moment from 'moment'

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  return moment(dt).format('YYYY-MM-DD h:mm:ss')
})

// 將編輯器註冊成全局可用
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

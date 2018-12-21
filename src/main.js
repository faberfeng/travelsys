// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/utils/store.js';
import ElementUI from 'element-ui'
import '../theme/index.css'
import ZkTable from 'vue-table-with-tree-grid'
import vuescroll from 'vue-scroll'
import FullCalendar from 'vue-full-calendar'

// import htmlToPdf from '@/components/utils/htmlToPdf.js'  
// Vue.use(htmlToPdf) 
import '../node_modules/fullcalendar/dist/fullcalendar.css';
Vue.use(vuescroll)
Vue.use(FullCalendar)
//Vue.use(ZkTable)

Vue.use(ZkTable)

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
var app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

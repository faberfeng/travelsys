// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAMap from 'vue-amap';
import App from './App'
import router from './router'
import store from '@/utils/store.js';
import ElementUI from 'element-ui'
import '../theme/index.css'
import ZkTable from 'vue-table-with-tree-grid'
import vuescroll from 'vue-scroll'
import FullCalendar from 'vue-full-calendar'

import 'jquery'
import 'uikit'
// import "uikit-css"
// import 'uikit/dist/css/uikit.almost-flat.css'

// import UIkit from './uikit'

// Vue.use(UIkit)

// import htmlToPdf from '@/components/utils/htmlToPdf.js'  
// Vue.use(htmlToPdf) 
import '../node_modules/fullcalendar/dist/fullcalendar.css';
// import {Alert, Confirm, Toast} from 'wc-messagebox'
// import 'wc-messagebox/style.css'
 
// Vue.use(Alert, options)
// Vue.use(Confirm, options)
// Vue.use(Toast, options)

// require('videojs-contrib-hls/dist/videojs-contrib-hls');
// import { lazyAMapApiLoaderInstance } from 'vue-amap';
import 'v2-datepicker/lib/index.css';

import V2Datepicker from 'v2-datepicker';
Vue.use(V2Datepicker)

Vue.use(VueAMap);
// console.log(Vue);
// console.log(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'eb4e26a19ca36911be75f2f062bee6aa',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','MapType'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

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

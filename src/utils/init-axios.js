import axios from 'axios';
import store from './store.js';
import router from '../router/index.js';
const url = 'http://a:a@103.40.192.168:50055';
// const url = '/api';
// const token = localStorage.getItem('token');

axios.defaults.baseURL = url;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// 在实例已创建后修改默认值
// axios.defaults.headers.common['token'] = token;

axios.interceptors.request.use(config => {
    // const mod = getMod(config);
    // const shouldSign = needSign(mod);
    // if (process.env.NODE_ENV !== 'production' && shouldSign) {
    //   console.log(`%c${mod}：本接口需要签名，已自动添加sign和user_id至请求参数！`, 'color: blue');
    // }
    // config.params = config.params || {};
    // config.params.v = 1; // 接口版本
    // if (shouldSign) {
    //   sign(config);
    // }
    // console.log(config)
    return config;
  });
  // 响应拦截器
axios.interceptors.response.use(function (response) {
    if (response.data.cd === '-1') {
      // store.dispatch('logout'); //可以在 router action 处理，清空用户的所有资料和数据，重新登陆
      router.push({
        path:'/login'
      })
      return Promise.reject('您还未登陆！');
    }
    // if (response.data.status === 'expired') {
    //   store.dispatch('logout');
    //   return Promise.reject('登陆状态过期，请重新登陆！');
    // }
    // if (response.data.message === '签名错误') {
    //   store.dispatch('logout');
    // }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    console.error('接口或网络错误', error); // eslint-disable-line
    return Promise.reject(error);
  });
  export default axios;
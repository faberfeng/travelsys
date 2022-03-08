import Vue from 'vue'
import Router from 'vue-router'
import Review from "../views/Review.vue";
import Login from "../views/Login.vue"
import DriverList from "../views/driverList.vue"
import VehicleList from "../views/DataList.vue"
import Home from "../views/index.vue"

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:"/",
      redirect:"/login"
    },
    {
      path:"/login",
      name:'login',
      component:Login
    },
    {
      path:"/home",
      name:"home",
      // component:resolve=>require(['@/views/index.vue'],resolve),
      component:Home,
      children:[
            //可车辆实时轨迹路线
        {
          path: "/review",
          name: "Review",
          component: Review,
        },
        //司机列表
        {
          path: "/driverList",
          name: "DriverList",
          component: DriverList,
        },
        //车辆列表
        {
          path: "/vehicleList",
          name: "VehicleList",
          component: VehicleList,
        }
      ]
    },
    // //可车辆实时轨迹路线
    // {
    //   path: "/review",
    //   name: "Review",
    //   component: Review,
    // },
    // //司机列表
    // {
    //   path: "/driverList",
    //   name: "DriverList",
    //   component: DriverList,
    // },
    // //车辆列表
    // {
    //   path: "/vehicleList",
    //   name: "VehicleList",
    //   component: VehicleList,
    // }
  ]
})
router.beforeEach((to,from,next)=>{
  const token = localStorage.getItem('token');
  if(to.meta.requireAuth){
    if(token){
      next();
    }else{
      next({
        path:'/login'
      })
    }
  }else{
    next()
  }
})
export default router;

import Vue from 'vue'
import Router from 'vue-router'
import Review from "../views/Review.vue";

Vue.use(Router)

const router = new Router({
  routes: [
    //pdf
    {
      path: "/review",
      name: "Review",
      component: Review,
    },
    
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

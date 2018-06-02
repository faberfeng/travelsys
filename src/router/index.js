import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect:'/login',
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    },
    {
      path:'/showcompany',
      name:'ProjectNavigation',
      component:resolve=>require(['@/components/ProjectNavigation'],resolve),
      meta:{
        requireAuth:true
      }
    },
    {
      path:'/projectlist',
      name:'projectlist',
      component:resolve=>require(['@/components/ProjectList'],resolve),
      meta:{
        requireAuth:true
      }
    },
    {
      path:'/home',
      name:'Home',
      component:resolve=>require(['@/components/Home'],resolve),
      // meta:{
      //   requireAuth:true
      // },
      children:[
        {
          path:'/home/projHome/:id',
          name:'ProJHome',
          component:resolve=>require(['@/components/ProjectHome/home'],resolve)
        },
        {
          path:'/home/gongcheng',
          name:'Gongcheng',
          component:resolve=>require(['@/components/ManageCost/Gongcheng'],resolve)
        },
        {
          path:'/home/wuliao',
          name:'Wuliao',
          component:resolve=>require(['@/components/ManageCost/Wuliao'],resolve)
        },
      ]
    },
    {
      path:'/Design',
      name:'Design',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/Design/management',
          name:'ManageDesign',
          component:resolve=>require(['@/components/ManageDesign/Design'],resolve)
        },
        {
          path:'/Design/attributeManager',
          name:'attributeManager',
          component:resolve=>require(['@/components/ManageDesign/attributeManager'],resolve),
        },
        {
          path:'/Design/designversion',
          name:'DesignVersion',
          component:resolve=>require(['@/components/ManageDesign/DesignVersion'],resolve)
        },
      ]
    },
    {
      path:'/Cost',
      name:'Cost',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/Cost/management',
          name:'manageCost',
          component:resolve=>require(['@/components/planCost/overview'],resolve)
        },
        {
          path:'/Cost/goujianList',
          name:'goujianList',
          component:resolve=>require(['@/components/planCost/goujianList'],resolve),
        },
        // {
        //   path:'/Design/designversion',
        //   name:'DesignVersion',
        //   component:resolve=>require(['@/components/planCost/DesignVersion'],resolve)
        // },
        // {
        //   path:'/Design/designversion',
        //   name:'DesignVersion',
        //   component:resolve=>require(['@/components/planCost/DesignVersion'],resolve)
        // },
        // {
        //   path:'/Design/designversion',
        //   name:'DesignVersion',
        //   component:resolve=>require(['@/components/planCost/DesignVersion'],resolve)
        // },
        // {
        //   path:'/Design/designversion',
        //   name:'DesignVersion',
        //   component:resolve=>require(['@/components/planCost/DesignVersion'],resolve)
        // },
      ]
    },
    {
      path:'/Drive',
      name:'Drive',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/Drive/costover',
          name:'Costover',
          component:resolve=>require(['@/components/ManageCost/Costover'],resolve)
        },
        {
          path:'/Drive/cloudDrive',
          name:'cloudDrive',
          component:resolve=>require(['@/components/ManageCost/cloudDrive'],resolve)
        },
        {
          path:'/Drive/Share',
          name:'Share',
          component:resolve=>require(['@/components/ManageCost/Share'],resolve)
        },
        {
          path:'/Drive/PersonalTransit',
          name:'PersonalTransit',
          component:resolve=>require(['@/components/ManageCost/PersonalTransit'],resolve)
        },
      ]
    },
    {
      path:'/Drive/panoramicView/:id',
      name:'panoramicView',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost/panoramicView'],resolve),
    },
    {
      path:'/setting',
      name:'Setting',
      component:resolve=>require(['@/components/Home'],resolve),
      children:[
        {
          path:'/setting/initalsettings',
          name:'InitalSettings',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/InitalSettings'],resolve)
        },
        {
          path:'/setting/groundsettings',
          name:'GroundSettings',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/GroundSettings'],resolve)
        },
        {
          path:'/setting/pageinital',
          name:'PageIntial',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/PageIntial'],resolve)
        },
        {
          path:'/setting/datatransform',
          name:'DataTransform',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/DataTransform'],resolve)
        },
        {
          path:'/setting/projectstationmanage',
          name:'ProjectStationManage',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/ProjectStationManage'],resolve)
        },
        {
          path:'/setting/projectloggermanage',
          name:'ProjectLoggerManage',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/ProjectLoggerManage'],resolve)
        },
        {
          path:'/setting/groupmanage',
          nama:'GroupManage',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/GroupManage'],resolve)
        },
        {
          path:'/setting/worktool',
          name:'WorkTool',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/WorkTool'],resolve)
        },
        {
          path:'/setting/jobmanage',
          name:'JobManage',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/JobManage'],resolve)
        },
        {
          path:'/setting/usermanage',
          name:'UserManage',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/UserManage'],resolve)
        },
        {
          path:'/setting/professional',
          name:'Professional',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/Professional'],resolve)
        },
        {
          path:'/setting/constructordesignmapped',
          name:'ConstructorDesignMapped',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/ConstructorDesignMapped'],resolve)
        },
        {
          path:'/setting/constructordesigncode',
          name:'ConstructorDesignCode',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/ConstructorDesignCode'],resolve)
        },
        {
          path:'/setting/projectsubmit',
          name:'ProjectSubmit',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/ProjectSubmit'],resolve)
        },
        {
          path:'/setting/materialpurchase',
          name:'MaterialPurchase',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/MaterialPurchase'],resolve)
        },
        {
          path:'/setting/buildingproperty',
          name:'BuildingProperty',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/BuildingProperty'],resolve)
        },
      ]
    }
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
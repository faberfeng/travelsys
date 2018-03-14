import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
/*成本管理 组件*/

import Goujian from '@/components/ManageCost/Goujian'
import Gongcheng from '@/components/ManageCost/Gongcheng'
import Wuliao from '@/components/ManageCost/Wuliao'
/*设计管理 组件*/
import Design from '@/components/ManageDesign/Design'
import DesignVersion from '@/components/ManageDesign/DesignVersion'
/*配置中心 组件 */

import PageIntial from '@/components/Settings/PageIntial'
import DataTransform from '@/components/Settings/DataTransform'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    },
    {
      path:'/home',
      name:'Home',
      component:Home,
      children:[
        {
          path:'/home/costover',
          name:'Costover',
          component:resolve=>require(['@/components/ManageCost/Costover'],resolve)
        },
        {
          path:'/home/goujian',
          name:'Goujian',
          component:Goujian
        },
        {
          path:'/home/gongcheng',
          name:'Gongcheng',
          component:Gongcheng
        },
        {
          path:'/home/wuliao',
          name:'Wuliao',
          component:Wuliao
        },
        {
          path:'/home/design',
          name:'Design',
          component:Design
        },
        {
          path:'/home/designversion',
          name:'DesignVersion',
          component:DesignVersion
        },
        {
          path:'/home/initalsettings',
          name:'InitalSettings',
          component:resolve=>require(['@/components/Settings/InitalSettings'],resolve)
        },
        {
          path:'/home/groundsettings',
          name:'GroundSettings',
          component:resolve=>require(['@/components/Settings/GroundSettings'],resolve)
        },
        {
          path:'/home/pageinital',
          name:'PageIntial',
          component:PageIntial
        },
        {
          path:'/home/datatransform',
          name:'DataTransform',
          component:DataTransform
        },
        {
          path:'/home/projectstationmanage',
          name:'ProjectStationManage',
          component:resolve=>require(['@/components/Settings/ProjectStationManage'],resolve)
        },
        {
          path:'/home/projectloggermanage',
          name:'ProjectLoggerManage',
          component:resolve=>require(['@/components/Settings/ProjectLoggerManage'],resolve)
        },
        {
          path:'/home/groupmanage',
          nama:'GroupManage',
          component:resolve=>require(['@/components/Settings/GroupManage'],resolve)
        },
        {
          path:'/home/worktool',
          name:'WorkTool',
          component:resolve=>require(['@/components/Settings/WorkTool'],resolve)
        },
        {
          path:'/home/jobmanage',
          name:'JobManage',
          component:resolve=>require(['@/components/Settings/JobManage'],resolve)
        },
        {
          path:'/home/usermanage',
          name:'UserManage',
          component:resolve=>require(['@/components/Settings/UserManage'],resolve)
        },
        {
          path:'/home/professional',
          name:'Professional',
          component:resolve=>require(['@/components/Settings/Professional'],resolve)
        },
        {
          path:'/home/constructordesignmapped',
          name:'ConstructorDesignMapped',
          component:resolve=>require(['@/components/Settings/ConstructorDesignMapped'],resolve)
        },
        {
          path:'/home/constructordesigncode',
          name:'ConstructorDesignCode',
          component:resolve=>require(['@/components/Settings/ConstructorDesignCode'],resolve)
        },
        {
          path:'/home/projectsubmit',
          name:'ProjectSubmit',
          component:resolve=>require(['@/components/Settings/ProjectSubmit'],resolve)
        },
        {
          path:'/home/materialpurchase',
          name:'MaterialPurchase',
          component:resolve=>require(['@/components/Settings/MaterialPurchase'],resolve)
        },
        {
          path:'/home/buildingproperty',
          name:'BuildingProperty',
          component:resolve=>require(['@/components/Settings/BuildingProperty'],resolve)
        },
      ]
    }
  ]
})

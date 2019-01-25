import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    //pdf
    {
      path:'/pdfPreview',
      name:'pdfPreview',
      component:resolve=>require(['@/components/constructionSite/htmlToPdf'],resolve),
    },

    //gantt
    {
      path:'/gantt',
      name:'gantt',
      component:resolve=>require(['@/components/SchedulePlan/gantt'],resolve),
    },
    //二维码扫描
    //开始进入当前页面
    {
      path:'/qr/:id',
      name: '/qr',
      component:resolve=>require(['@/components/mobileQindan/qrCommonPage'],resolve)

    },
    //通用清单详情
    {
      path:'/mobileQindan/mobileQingdanDetail',
      name:'mobileQingdanDetail',
      component:resolve=>require(['@/components/mobileQindan/mobileQingdanDetail'],resolve),
    },
    //通用构件详情
    {
      path:'/mobileQindan/mobileGouJianDetail',
      name:'mobileGouJianDetail',
      component:resolve=>require(['@/components/mobileQindan/mobileGouJianDetail'],resolve),
    },
    //清单选择
    {
      path:'/mobileQindan/qingdanChioce',
      name:'qingdanChioce',
      component:resolve=>require(['@/components/mobileQindan/qingdanChioce'],resolve),
    },
    //安全点位
    {
      path:'/mobileQindan/pointPosition',
      name:'pointPosition',
      component:resolve=>require(['@/components/mobileQindan/pointPosition'],resolve),
    },
    //文档管理公有分享路由
    {
      path:'/cloud/share/:id',
      name:'shareFile',
      component:resolve=>require(['@/components/ManageCost/shareFile'],resolve),
    },
    //文档管理私有分享路由
    {
      path:'/cloud/sharePassword/:id',
      naem:'shareFilePassWord',
      component:resolve=>require(['@/components/ManageCost/shareFilePassWord'],resolve),
    },
    //移动端申请项目
    {
      path:'/applyPage/:id',
      name:'applyPage',
      component:resolve=>require(['@/components/mobile/applyPage'],resolve),
    },
    {
      path:'/register',
      name:'register',
      component:resolve=>require(['@/components/mobile/register'],resolve),
    },
    {
      path:'/changeMobile',
      name:'changeMobile',
      component:resolve=>require(['@/components/mobile/changeMobile'],resolve),
    },
    {
      path:'/applySuccess',
      name:'applySuccess',
      component:resolve=>require(['@/components/mobile/applySuccess'],resolve),
    },
    {
      path:'/registerSuccess',
      name:'registerSuccess',
      component:resolve=>require(['@/components/mobile/registerSuccess'],resolve),
    },
    {
      path:'/hasExist',
      name:'hasExist',
      component:resolve=>require(['@/components/mobile/hasExist'],resolve),
    },
    {
      path:'/hasApply',
      name:'hasApply',
      component:resolve=>require(['@/components/mobile/hasApply'],resolve),
    },
    
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
      path:'/noPassWordlogin',
      name:'noPassWordlogin',
      component:resolve=>require(['@/components/noPassWordLogin'],resolve),
    },
    //服务无法启动
    {
        path:'/noWebServerPage',
        name:'noWebServerPage',
        component:resolve=>require(['@/components/noWebServerPage'],resolve),
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
      component:resolve=>require(['@/components/ManageCost'],resolve),
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
          path:'/Design/drawingReview',
          name:'DrawingReview',
          component:resolve=>require(['@/components/ManageDesign/DrawingReview'],resolve)
        },
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
        {
          path:'/Cost/quantities',
          name:'quantities',
          component:resolve=>require(['@/components/planCost/quantities'],resolve)
        },
        {
          path:'/Cost/inventory',
          name:'inventory',
          component:resolve=>require(['@/components/planCost/inventory'],resolve)
        },
        {
          path:'/Cost/configmapping',
          name:'ConfigMapping',
          component:resolve=>require(['@/components/planCost/ConfigMapping'],resolve)
        },
        {
          path:'/Cost/configmappingtwo',
          name:'ConfigMappingTwo',
          component:resolve=>require(['@/components/planCost/ConfigMappingTwo'],resolve)
        },
      ]
    },
    //进度计划路由配置
    {
      path:'/Schedule',
      name:'Schedule',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
           path:'/SchedulePlan/personalCalendar',
          name:'personalCalendar',
          component:resolve=>require(['@/components/SchedulePlan/personalCalendar'],resolve)
        },
        {
          path:'/SchedulePlan/resourcePlan',
          name:'resourcePlan',
          component:resolve=>require(['@/components/SchedulePlan/resourcePlan'],resolve)
        },
        {
          path:'/SchedulePlan/taskIndex',
          name:'taskIndex',
          component:resolve=>require(['@/components/SchedulePlan/taskIndex'],resolve)
        },
        {
          path:'/SchedulePlan/calendarConfig',
          name:'calendarConfig',
          component:resolve=>require(['@/components/SchedulePlan/calendarConfig'],resolve)
        }
      ]
    },
    //安全管理路由配置
    {
      path:'/constructionSite',
      name:'constructionSite',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        // {
        //   path:'/constructionSite/fieldConnection',
        //   name:'fieldConnection',
        //   component:resolve=>require(['@/components/constructionSite/fieldConnection'],resolve)
        // },
        // {
        //   path:'/constructionSite/fieldMessage',
        //   name:'fieldMessage',
        //   component:resolve=>require(['@/components/constructionSite/fieldMessage'],resolve)
        // },
        {
          path:'/constructionSite/safetyCheckings',
          name:'safetyCheckings',
          component:resolve=>require(['@/components/constructionSite/safetyCheckings'],resolve)
        },
        {
          path:'/constructionSite/safetyRuning',
          name:'safetyRuning',
          component:resolve=>require(['@/components/constructionSite/safetyRuning'],resolve)
        },
        {
          path:'/constructionSite/safetyInspection',
          name:'safetyInspection',
          component:resolve=>require(['@/components/constructionSite/safetyInspection'],resolve)
        },
        {
          path:'/constructionSite/remoteVideo',
          name:'remoteVideo',
          component:resolve=>require(['@/components/constructionSite/remoteVideo'],resolve)
        }
      ]
    },
    //现场连线路由配置
    {
      path:'/liveConnect',
      name:'liveConnect',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/liveConnect/fieldConnection',
          name:'fieldConnection',
          component:resolve=>require(['@/components/liveConnect/fieldConnection'],resolve)
        },
        {
          path:'/liveConnect/fieldMessage',
          name:'fieldMessage',
          component:resolve=>require(['@/components/liveConnect/fieldMessage'],resolve)
        },
        {
          path:'/liveConnect/qualityChecking',
          name:'qualityChecking',
          component:resolve=>require(['@/components/liveConnect/qualityChecking'],resolve)
        },
        {
          path:'/liveConnect/qualityAcceptance',
          name:'qualityAcceptance',
          component:resolve=>require(['@/components/liveConnect/qualityAcceptance'],resolve)
        }
      ]
    },
    //物资采购
    {
      path:'/metarialpurchase',
      name:'MetarialPurchase',
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[{
        path:'/metarialpurchase/productioncenter',
        name:'ProductionCenter',
        component:resolve=>require(['@/components/MetarialPurchase/ProductionCenter'],resolve)

      },{
        path:'/metarialpurchase/wuliaopurchase',
        name:'Wuliaopurchase',
        component:resolve=>require(['@/components/MetarialPurchase/Wuliao'],resolve)
      },{
        path:'/metarialpurchase/dinghuoManage',
        name:'DinghuoManage',
        component:resolve=>require(['@/components/MetarialPurchase/DinghuoManage'],resolve)
      },{
        path:'/metarialpurchase/fahuoManage',
        name:'FahuoManage',
        component:resolve=>require(['@/components/MetarialPurchase/FahuoManage'],resolve)
      },{
        path:'/metarialpurchase/checked',
        name:'Checked',
        component:resolve=>require(['@/components/MetarialPurchase/Checked'],resolve)
      }]
    },
    {
      path:'/Cost/getManifestDetailInfoForPage/:mid/:detialid',
      name:'getManifestDetailInfoForPage',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/planCost/getManifestDetailInfoForPage'],resolve),
    },
    {
      path:'/Cost/getMainLabelInformation/:mid',
      name:'getMainLabelInformation',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost/getMainLabelInformation'],resolve),
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
      component:resolve=>require(['@/components/ManageCost'],resolve),
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

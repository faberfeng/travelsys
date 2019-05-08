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
    //用户注册
    {
      path:'/registerIndex',
      name:'register',
      component:resolve=>require(['@/components/register/registerIndex'],resolve)
    },
    //注册成功
    {
      path:'/userRegisterSuccess',
      name:'registerSuccess',
      component:resolve=>require(['@/components/register/registerSuccess'],resolve)
    },

    //用户邮箱注册激活成功验证
    {
      path:'/user/active',
      name:'active',
      component:resolve=>require(['@/components/register/active'],resolve)
    },
    //用户管理系统登陆页
    {
      path:'/userLogin',
      name:'userLogin',
      component:resolve=>require(['@/components/userManageSystem/userLogin'],resolve)
    },
    //用户详情信息
    {
      path:'/userInformation',
      name:'userInformation',
      component:resolve=>require(['@/components/userManageSystem/userInformation'],resolve)
    },

    {
      path:'/user/reActive',
      name:'reActive',
      component:resolve=>require(['@/components/register/reActive'],resolve)
    },
    //用户登录
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
        {
          path:'/Cost/wuliaoList',
          name:'wuliaoList',
          component:resolve=>require(['@/components/planCost/wuliaoList'],resolve)
        }
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

    //质量管理路由配置
    {
      path:'/qualityManage',
      name:'qualityManage',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/qualityManage/qualityManage',
          name:'qualityManage',
          component:resolve=>require(['@/components/qualityManage/qualityManage'],resolve)
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

     //门禁考勤系统
     {
      path:'/entranceCheck',
      name:'Entrance',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/entranceCheck/entranceRecord',
          name:'entranceRecord',
          component:resolve=>require(['@/components/entranceCheck/entranceRecord'],resolve)
        },
        {
          path:'/entranceCheck/monthAttendRecord',
          name:'monthAttendRecord',
          component:resolve=>require(['@/components/entranceCheck/monthAttendRecord'],resolve)
        },
        {
          path:'/entranceCheck/todayAttendRecord',
          name:'todayAttendRecord',
          component:resolve=>require(['@/components/entranceCheck/todayAttendRecord'],resolve),
        }
      ]
    },
    //视频监控
    {
      path:'/vidoControl',
      name:'vidoControl',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/videoControl/videoControl',
          name:'videoControl',
          component:resolve=>require(['@/components/videoControl/videoControl'],resolve)
        },
      ]
    },
    //项目成员
    {
      path:'/projectPerson',
      name:'projectPerson',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/projectPerson/projectPerson',
          name:'projectPerson',
          component:resolve=>require(['@/components/projectPerson/projectPerson'],resolve)
        },
      ]
    },

    //安全教育/告知
    {
      path:'/safetyEducation',
      name:'safetyEducation',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/safetyEducation/safeEducation',
          name:'safeEducation',
          component:resolve=>require(['@/components/safetyEducation/safeEducation'],resolve)
        },
        {
          path:'/safetyEducation/safeTechnology',
          name:'safeTechnology',
          component:resolve=>require(['@/components/safetyEducation/safeTechnology'],resolve)
        },
        {
          path:'/safetyEducation/visitorSafety',
          name:'visitorSafety',
          component:resolve=>require(['@/components/safetyEducation/visitorSafety'],resolve),
        }
      ]
    },
    //诚信管理
    {
      path:'/honestyManagement',
      name:'honestyManagement',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/honestyManagement/allEvaluate',
          name:'allEvaluate',
          component:resolve=>require(['@/components/honestyManagement/allEvaluate'],resolve)
        },
        {
          path:'/honestyManagement/badRecord',
          name:'badRecord',
          component:resolve=>require(['@/components/honestyManagement/badRecord'],resolve)
        },
        {
          path:'/honestyManagement/complaintHandling',
          name:'todayAttendRecord',
          component:resolve=>require(['@/components/honestyManagement/complaintHandling'],resolve),
        },
        {
          path:'/honestyManagement/goodRecord',
          name:'goodRecord',
          component:resolve=>require(['@/components/honestyManagement/goodRecord'],resolve),
        }
      ]
    },
    //访客登记
    {
      path:'/visitorRegister',
      name:'visitorRegister',
      meta:{
        requireAuth:true
      },
      component:resolve=>require(['@/components/ManageCost'],resolve),
      children:[
        {
          path:'/visitorRegister/carRegister',
          name:'carRegister',
          component:resolve=>require(['@/components/visitorRegister/carRegister'],resolve)
        },
        {
          path:'/visitorRegister/visitorRegister',
          name:'visitorRegister',
          component:resolve=>require(['@/components/visitorRegister/visitorRegister'],resolve)
        }
      ]
    },

    //配置中心
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
          path:'/setting/projectLableManage',
          name:'projectLableManage',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/projectLableManage'],resolve)
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
          path:'/setting/wuliaoList',
          name:'wuliaoList',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/wuliaoList'],resolve)
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
        {
          path:'/setting/hierarchicalManagement',
          name:'hierarchicalManagement',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/hierarchicalManagement'],resolve)
        },
        {
          path:'/setting/safeManageClassify',
          name:'safeManageClassify',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/safeManageClassify'],resolve)
        },
        {
          path:'/setting/qualityManageClassify',
          name:'qualityManageClassify',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/qualityManageClassify'],resolve)
        },
        {
          path:'/setting/accessControl',
          name:'accessControl',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/accessControl'],resolve)
        },
        {
          path:'/setting/carManage',
          name:'carManage',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/carManage'],resolve)
        },
        {
          path:'/setting/controlVideo',
          name:'controlVideo',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/controlVideo'],resolve)
        },
        {
          path:'/setting/faceAndfingerInput',
          name:'faceAndfingerInput',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/faceAndfingerInput'],resolve)
        },
        {
          path:'/setting/icCordControl',
          name:'icCordControl',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/icCordControl'],resolve)
        },
        {
          path:'/setting/projectModel',
          name:'projectModel',
          meta:{
            settingsCenter:true
          },
          component:resolve=>require(['@/components/Settings/projectModel'],resolve)
        },
      ]
    },
    //图片预览
    {
      path:'/filePreview',
      name:'picView',
      component:resolve=>require(['@/components/filePreview'],resolve)
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

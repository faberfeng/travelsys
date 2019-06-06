import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        path:'',
        UPID:'BB1408IN16014',
        // 以下是内网配置文件
        // QJFileManageSystemURL:'http://10.252.26.240:8080/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'http://10.252.26.240:8080/qjbim-file',
        // commomHeadPictureFile:'http://10.252.26.240:8080/arctron-usercenter',
        // BDMSUrl:'http://10.252.26.240:8080/h2-bim-project/',//仅供文件上传使用
        // GMDUrl:"http://10.252.26.240:8080",
        // WebGlUrl:"http://10.252.26.240", 
        // BIMServerPort:'8080',
        // shareUrl:'http://10.252.26.240:8080/bdms/#',
        // appShareUrl:'http://10.252.26.240:8080/bdms/',
        // iframeWebGlUrl:'http://10.252.26.240:8080/genDist/',
        // applyIndexUrl:'https://bdms.arctron.cn/arctron-usercenter/apply/applyIndex',
        // messageUrl:'http://10.252.26.241:8079',
        // webSocketUrl:"ws://10.252.26.241:16800/websocket",
        // qrShareUrl:"http://10.252.26.240:8080/bdms/#/qr",
        //无锡市政院
        // QJFileManageSystemURL:'http://58.214.36.222:8080/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'http://58.214.36.222:8080/qjbim-file',
        // commomHeadPictureFile:'https://bdms.arctron.cn/arctron-usercenter',
        // BDMSUrl:'http://58.214.36.222:8080/h2-bim-project/',//仅供文件上传使用
        // GMDUrl:"http://58.214.36.222:8080",
        // WebGlUrl:"http://58.214.36.222", 
        // appShareUrl:'http://58.214.36.222:8080/bdms/',
        // BIMServerPort:'8080',
        // shareUrl:'http://58.214.36.222:8080/bdms/#',
        // iframeWebGlUrl:'http://58.214.36.222:8080/genDist/',
        // applyIndexUrl:'https://bdms.arctron.cn/arctron-usercenter/apply/applyIndex',
        // messageUrl:'http://42.159.153.210:8079',
        // webSocketUrl:"ws://42.159.153.210:16800/websocket",
        // qrShareUrl:"http://58.214.36.222:8080/bdms/#/qr",
        //以下是外网配置文件
        // BIMServerPort:'443',
        // QJFileManageSystemURL:'https://file.arctron.cn/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'https://file.arctron.cn/qjbim-file',
        // commomHeadPictureFile:'https://bdms.arctron.cn/arctron-usercenter',
        // BDMSUrl:'https://bdms.arctron.cn/h2-bim-project/',//仅供文件上传使用
        // WebGlUrl:"https://bdms.arctron.cn",
        // appShareUrl:'https://bdms.arctron.cn/bdms/',
        // GMDUrl:"https://bdms.arctron.cn",
        // shareUrl:"https://bdms.arctron.cn/#",
        // iframeWebGlUrl:'https://bdms.arctron.cn/genDist/',
        // applyIndexUrl:'https://bdms.arctron.cn/arctron-usercenter/apply/applyIndex',
        // messageUrl:'http://42.159.153.210:8079',
        // webSocketUrl:"ws://42.159.153.210:16800/websocket",
        // qrShareUrl:"https://bdms.arctron.cn/bdms/#/qr",

        //外网测试配置文件
        // BIMServerPort:'443',
        // QJFileManageSystemURL:'https://file.arctron.cn/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'https://file.arctron.cn/qjbim-file',
        // commomHeadPictureFile:'https://bdms.arctron.cn/arctron-usercenter',
        // BDMSUrl:'https://bim.arctron.cn/h2-bim-project/',//仅供文件上传使用
        // WebGlUrl:"https://bim.arctron.cn",
        // GMDUrl:"https://bim.arctron.cn",
        // shareUrl:"https://bim.arctron.cn/#",
        // appShareUrl:'https://bim.arctron.cn/bdms/',
        // iframeWebGlUrl:'https://bim.arctron.cn/genDist/',
        // applyIndexUrl:'https://bim.arctron.cn/arctron-usercenter/apply/applyIndex',
        // messageUrl:'http://42.159.153.210:8079',
        // webSocketUrl:"ws://42.159.153.210:16800/websocket",
        // qrShareUrl:"https://bim.arctron.cn/bdms/#/qr",

        //外网测试配置文件（新版）
        // BIMServerPort:'443',
        // QJFileManageSystemURL:'https://file.arctron.cn/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'https://file.arctron.cn/qjbim-file',
        // commomHeadPictureFile:'https://bdms.arctron.cn/arctron-usercenter',
        // BDMSUrl:'https://bim.arctron.cn/bdms-rebuild/',//仅供文件上传使用
        // WebGlUrl:"https://bim.arctron.cn",
        // GMDUrl:"https://bim.arctron.cn",
        // shareUrl:"https://bim.arctron.cn/BDMSTest/#",
        // appShareUrl:'https://bim.arctron.cn/BDMSTest/',
        // // iframeWebGlUrl:'https://bim.arctron.cn/genDist/',
        // iframeWebGlUrl:'https://bim.arctron.cn/BDView/',
        // applyIndexUrl:'https://bim.arctron.cn/arctron-usercenter/apply/applyIndex',
        // messageUrl:'http://42.159.153.210:8079',
        // webSocketUrl:"ws://42.159.153.210:16800/websocket",
        // qrShareUrl:"https://bim.arctron.cn/bdms/#/qr",
        //以下是即时通讯网址

        // 以下是内网测试配置文件
        // QJFileManageSystemURL:'http://203.156.220.3:8080/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'http://203.156.220.3:8080/qjbim-file',
        // BDMSUrl:'http://203.156.220.3:8080/h2-bim-project/',//仅供文件上传使用
        // GMDUrl:"http://203.156.220.3:8080",
        // WebGlUrl:"http://203.156.220.3", 
        // BIMServerPort:'8080',
        // shareUrl:'http://203.156.220.3:8080/bdms/#',
        // iframeWebGlUrl:'http://203.156.220.3:8080/genDist/',
        // applyIndexUrl:'http://203.156.220.3:8080/arctron-usercenter/apply/applyIndex',
       


        //内网测试（最新BDWork）
        // BIMServerPort:'443',
        // QJFileManageSystemURL:'https://file.arctron.cn/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'https://file.arctron.cn/qjbim-file',
        // commomHeadPictureFile:'https://bdms.arctron.cn/arctron-usercenter',
        // BDMSUrl:'http://10.245.11.10:8080/bdms-rebuild/',//仅供文件上传使用
        // // BDMSUrl:'http://10.252.26.48:8080/bdms_war_exploded/',
        // WebGlUrl:"https://bim.arctron.cn",
        // GMDUrl:"https://bim.arctron.cn",
        // shareUrl:"http://10.245.11.10:8080/bdms/#",
        // appShareUrl:'http://10.245.11.10:8080/bdms/',
        // // iframeWebGlUrl:'https://bim.arctron.cn/genDist/',
        // iframeWebGlUrl:'http://10.245.11.10:8080/BDView/',
        // applyIndexUrl:'https://bim.arctron.cn/arctron-usercenter/apply/applyIndex',
        // messageUrl:'http://42.159.153.210:8079',
        // webSocketUrl:"ws://42.159.153.210:16800/websocket",
        // qrShareUrl:"https://bim.arctron.cn/bdms/#/qr",


        //外网测试（最新BDWork）
        BIMServerPort:'443',
        QJFileManageSystemURL:'https://file.arctron.cn/qjbim-file/',//仅供文件下载使用的路径，
        QJFileManageSystemURL1:'https://file.arctron.cn/qjbim-file',
        commomHeadPictureFile:'https://bdms.arctron.cn/arctron-usercenter',
        BDMSUrl:'http://42.159.153.210:8080/bdms-rebuild/',//仅供文件上传使用
        // BDMSUrl:'http://10.252.26.48:8080/bdms_war_exploded/',
        WebGlUrl:"https://bim.arctron.cn",
        GMDUrl:"https://bim.arctron.cn",
        shareUrl:"http://42.159.153.210:8080/BDWorks/#",
        appShareUrl:'http://42.159.153.210:8080/BDWorks/',
        // iframeWebGlUrl:'https://bim.arctron.cn/genDist/',
        iframeWebGlUrl:'http://42.159.153.210:8080/BDView/',
        applyIndexUrl:'https://bim.arctron.cn/arctron-usercenter/apply/applyIndex',
        messageUrl:'http://42.159.153.210:8079',
        webSocketUrl:"ws://42.159.153.210:16800/websocket",
        qrShareUrl:"https://bim.arctron.cn/BDWorks/#/qr",
        loginUrl:"http://42.159.153.210:8080/BDWorks/#/registerIndex",
        userCenterUrl:'http://42.159.153.210:8080/BDWorks/#/userLogin',
        BDMSLoginUrl:'http://42.159.153.210:8080/BDWorks/#/login',
        //无锡市政院（最新版本）

        // BIMServerPort:'443',
        // QJFileManageSystemURL:'https://file.arctron.cn/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'https://file.arctron.cn/qjbim-file',
        // commomHeadPictureFile:'https://bdms.arctron.cn/arctron-usercenter',
        // BDMSUrl:'http://58.214.36.222:18080/bdms-rebuild/',//仅供文件上传使用
        // // BDMSUrl:'http://10.252.26.48:8080/bdms_war_exploded/',
        // WebGlUrl:"https://bim.arctron.cn",
        // GMDUrl:"https://bim.arctron.cn",
        // shareUrl:"http://58.214.36.222:18080/bdmsRebuild/#",
        // appShareUrl:'http://58.214.36.222:18080/bdmsRebuild/',
        // // iframeWebGlUrl:'https://bim.arctron.cn/genDist/',
        // iframeWebGlUrl:'http://58.214.36.222:18080/BDView/',
        // applyIndexUrl:'https://bim.arctron.cn/arctron-usercenter/apply/applyIndex',
        // messageUrl:'http://42.159.153.210:8079',
        // webSocketUrl:"ws://42.159.153.210:16800/websocket",
        // qrShareUrl:"https://bim.arctron.cn/bdms/#/qr",
        // loginUrl:"http://58.214.36.222:18080/bdmsRebuild/#/registerIndex",
        // userCenterUrl:'http://58.214.36.222:18080/bdmsRebuild/#/userLogin',
        // BDMSLoginUrl:'http://58.214.36.222:18080/bdmsRebuild/#/login',

        //最新bdms外网地址
        // BIMServerPort:'443',
        // QJFileManageSystemURL:'https://file.arctron.cn/qjbim-file/',//仅供文件下载使用的路径，
        // QJFileManageSystemURL1:'https://file.arctron.cn/qjbim-file',
        // commomHeadPictureFile:'https://bdms.arctron.cn/arctron-usercenter',
        // BDMSUrl:'https://bdms.arctron.cn/bdms-rebuild/',//仅供文件上传使用
        // // BDMSUrl:'http://10.252.26.48:8080/bdms_war_exploded/',
        // WebGlUrl:"https://bim.arctron.cn",
        // GMDUrl:"https://bim.arctron.cn",
        // shareUrl:"https://bdms.arctron.cn/bdmsRebuild/#",
        // appShareUrl:'https://bdms.arctron.cn/bdmsRebuild/',
        // // iframeWebGlUrl:'https://bim.arctron.cn/genDist/',
        // iframeWebGlUrl:'https://bdms.arctron.cn/BDView/',
        // applyIndexUrl:'https://bim.arctron.cn/arctron-usercenter/apply/applyIndex',
        // messageUrl:'http://42.159.153.210:8079',
        // webSocketUrl:"ws://42.159.153.210:16800/websocket",
        // qrShareUrl:"https://bim.arctron.cn/bdms/#/qr",
        // loginUrl:"https://bdms.arctron.cn/bdmsRebuild/#/registerIndex",
        // userCenterUrl:'https://bdms.arctron.cn/bdmsRebuild/#/userLogin',
        // BDMSLoginUrl:'https://bdms.arctron.cn/bdmsRebuild/#/login',

        imgUuid:'',//用户头像
        projectLogo:'',//企业logo
        isUseDefaultLogo:false,
    },
    getters:{
        changePath(state){
            return state.path; 
        },
        getBaseUrl(state){
            return state.BDMSUrl
        }   
    },
    mutations:{
        //用户头像信息
        changeImagePath(state,payload){
            state.imgUuid = payload.imagePath;
        },
        //企业logo信息
        changeProjectLogo(state,payload){
            state.projectLogo = payload.projectImg;
        },
        //切换工程logo
        switchLogo(state,payload){
            state.isUseDefaultLogo = payload.isDefaultLogo;
        }
    },
    plugins:[
        createPersistedState()
    ]
})
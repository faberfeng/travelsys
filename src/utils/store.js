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
        //外网测试配置文件
        BIMServerPort:'443',
        QJFileManageSystemURL:'https://file.arctron.cn/qjbim-file/',//仅供文件下载使用的路径，
        QJFileManageSystemURL1:'https://file.arctron.cn/qjbim-file',
        commomHeadPictureFileUserCenter:'https://bdms.arctron.cn/arctron-usercenter',
        BDMSUrl:'https://bim.arctron.cn/h2-bim-project/',//仅供文件上传使用
        WebGlUrl:"https://bim.arctron.cn",
        GMDUrl:"https://bim.arctron.cn",
        shareUrl:"https://bim.arctron.cn/#",
        appShareUrl:'http://bim.arctron.cn/bdms/',
        iframeWebGlUrl:'https://bim.arctron.cn/genDist/',
        applyIndexUrl:'https://bim.arctron.cn/arctron-usercenter/apply/applyIndex',
        messageUrl:'http://42.159.153.210:8079',
        webSocketUrl:"ws://42.159.153.210:16800/websocket",
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
        WebSocketUrl:"http://203.156.220.3:16800/message",
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
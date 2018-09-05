import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        path:'',
        UPID:'BB1408IN16014',
        // QJFileManageSystemURL:'http://10.252.26.240:8080/qjbim-file/',//仅供文件下载使用的路径，
        // BDMSUrl:'http://10.252.26.240:8080/h2-bim-project/',//仅供文件上传使用
        // GMDUrl:"http://10.252.26.240:8080",
        // WebGlUrl:"http://10.252.26.240", 
        // BIMServerPort:'8080',
        BIMServerPort:'80',
        QJFileManageSystemURL:'http://42.159.154.173:8080/qjbim-file/',//仅供文件下载使用的路径，
        BDMSUrl:'http://bdms.arctron.cn/h2-bim-project/',//仅供文件上传使用
        WebGlUrl:"http://bdms.arctron.cn",
        GMDUrl:"http://bdms.arctron.cn",
        WebSocketUrl:"http://10.252.26.240:16800/message",
        imgUuid:'',
    },
    getters:{
        changePath(state){
          console.log(state.path) ;
          return state.path; 
        },
        getBaseUrl(state){
            return state.BDMSUrl
        }   
    },
    mutations:{
        changeImagePath(state,payload){
            state.imgUuid = payload.imagePath;
        },
    },
    plugins:[
        createPersistedState()
    ]
})
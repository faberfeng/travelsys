import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
//
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        path:'',
        activeIndex:'1'
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
        //改变菜单
        changeMenus(state,payload){
            state.activeIndex=payload;
        },
        //用户头像信息
        changeImagePath(state,payload){
            state.imgUuid = payload.imagePath;
        },
    },
    plugins:[
        createPersistedState()
    ]
})
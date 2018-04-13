import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        path:'',
        QJFileManageSystemURL:'http://10.252.26.240:8080/qjbim-file/',//仅供文件下载使用的路径
    },
    getters:{
        changePath(state){
          console.log(state.path) ;
          return state.path; 
        }
    },
    mutations:{
        change(state,index){
            state.path = index;
            this.getters.changePath;
            console.log(index+'+++++++++');
            console.log(state.path);
        }
    }
})
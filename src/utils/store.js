import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        path:''
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
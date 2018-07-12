import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);

// app全局状态
export default new Vuex.Store({
  state: {
    sign: null,
    contentHeight: 0,
  },
  mutations: {
    merge(state, payload) {
      Object.assign(state, payload);
    },
  },
  actions: {
    setContentHeight({commit}, height) {
      commit('merge', {contentHeight: height});
    }
  },
  modules,
}); // eslint-disable-line

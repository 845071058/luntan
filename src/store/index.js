import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'
import loading from './modules/loading'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    loading
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    }
  },
  getters
})

export default store

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  uuid: '', // 保存uuid
  isRelease: false, // 是否点击了发布按钮
  isSaveForm: true, // 是否发布
  isRouter: 'edit' // 当前路由
}
const mutations = {
  setIsRelease (state, data) {
    state.isRelease = data
  },
  setIsSaveForm (state, data) {
    state.isSaveForm = data
  },
  setIsRouter (state, data) {
    state.isRouter = data
  },
  setUuid (state, data) {
    state.uuid = data
  }
}
export default new Vuex.Store({
  state,
  mutations
})

/**
 * Created by zy on 2018/5/24.
 */
const AppLoading = { // 路由状态
  state: {
    LOADING: false
  },
  mutations: {
    setLoading(state, data) {
      state.LOADING = data
    }
  }
}
export default AppLoading

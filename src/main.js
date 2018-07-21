import 'babel-polyfill'
// vue.js
import Vue from 'vue'
import Vuex from 'vuex'
import App from '@/App'
import router from '@/router'
import store from '@/vuex/store'

Vue.use(Vuex)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.afterEach((to, from) => {})

export { app }

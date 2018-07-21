import Vue from 'vue'
import Router from 'vue-router'

import Page404 from '@/components/404'
import Layout from '@/components/Layout'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '',
      component: Layout,
      children: [
        {
          path: '',
          component: Layout
        },
        {
          path: '*',
          component: Page404
        }
      ]
    }
  ]
})

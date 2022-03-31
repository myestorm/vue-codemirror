import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

import home from '../views/home.vue'
import toolbar from '../views/toolbar.vue'

const routes: RouteRecordRaw[] = [{
  path: '/',
  name: 'Home',
  component: home,
  meta: {
    icon: 'home',
    keepAlive: false
  }
}, {
  path: '/toolbar',
  name: 'Toolbar',
  component: toolbar,
  meta: {
    icon: 'home',
    keepAlive: false
  }
}]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

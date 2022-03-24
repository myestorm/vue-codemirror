import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

import home from '../views/home.vue'

const routes: RouteRecordRaw[] = [{
  path: '/',
  name: 'Home',
  component: home,
  meta: {
    icon: 'home',
    keepAlive: false
  }
}, {
  path: '/mobile',
  name: 'Mobile',
  component: home,
  meta: {
    icon: 'home',
    keepAlive: false
  }
}, {
  path: '/toolbar',
  name: 'Toolbar',
  component: home,
  meta: {
    icon: 'home',
    keepAlive: false
  }
}, {
  path: '/document',
  name: 'Document',
  component: home,
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

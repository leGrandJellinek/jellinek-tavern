import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from "@/views/SearchView.vue"
import BaseDateView from "@/views/BDView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: "/search",
    name: "search",
    component: SearchView
  },
  {
    path: "/basedate",
    name: "basedate",
    component: BaseDateView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

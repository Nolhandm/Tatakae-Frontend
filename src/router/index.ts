import { createRouter, createWebHistory } from 'vue-router'
import Temple from '../views/Temple.vue'
import Dashboard from '../views/Dashboard.vue'
import Habitudes from '../views/Habitudes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Temple',
      component: Temple,
    },
    {
      path: '/habitudes',
      name: 'Habitudes',
      component: Habitudes,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    }
  ],
})

export default router

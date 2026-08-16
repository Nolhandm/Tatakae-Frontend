import { createRouter, createWebHistory } from 'vue-router'
import Temple from '../views/Temple.vue'
import Dashboard from '../views/DashBoard.vue'
import Quest from '../views/Quests.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Temple',
      component: Temple,
    },
    {
      path: '/quests',
      name: 'Quest',
      component: Quest,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
  ],
})

export default router

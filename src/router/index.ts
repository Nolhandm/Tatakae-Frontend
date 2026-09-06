import { createRouter, createWebHistory } from 'vue-router'
import Temple from '../views/Temple.vue'
import Dashboard from '../views/DashBoard.vue'
import QuestManagement from '../views/QuestManagement.vue'

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
      name: 'QuestManagement',
      component: QuestManagement,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
  ],
})

export default router

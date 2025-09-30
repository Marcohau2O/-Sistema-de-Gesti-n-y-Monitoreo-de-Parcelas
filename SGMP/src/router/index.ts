import { getToken } from '@/utils/tokenStorage'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/historicos',
      name: 'historicos',
      component: () => import('../views/HistoricosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mapaParcelas',
      name: 'mapaParcelas',
      component: () => import('../views/ParcelasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/parcelaEdit',
      name: 'parcelaEdit',
      component: () => import('../views/ParcelasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)',
      name: 'Not found',
      component: () => import('../views/NotFound.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = getToken();

  if(to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router

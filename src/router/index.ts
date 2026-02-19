import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          redirect: '/attraction',
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/pages/user/SignupPage.vue'),
          meta: { requiresGuest: true },
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/user/LoginPage.vue'),
          meta: { requiresGuest: true },
        },
        {
          path: 'attraction',
          name: 'attraction-list',
          component: () => import('@/pages/attraction/AttractionListPage.vue'),
        },
        {
          path: 'attraction/:attractionId',
          name: 'attraction-detail',
          component: () => import('@/pages/attraction/AttractionDetailPage.vue'),
        },
        {
          path: 'ticket',
          name: 'ticket-list',
          component: () => import('@/pages/ticket/TicketListPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'ticket/order',
          name: 'ticket-order',
          component: () => import('@/pages/ticket/TicketOrderPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'ticket/order/success',
          name: 'ticket-order-success',
          component: () => import('@/pages/ticket/TicketOrderSuccessPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'ticket/order/fail',
          name: 'ticket-order-fail',
          component: () => import('@/pages/ticket/TicketOrderFailPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'waiting',
          name: 'waiting',
          component: () => import('@/pages/WaitingListPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'mypage',
          name: 'mypage',
          component: () => import('@/pages/user/MyPage.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: ':pathMatch(.*)*',
          name: 'error',
          component: () => import('@/pages/ErrorPage.vue'),
        },
      ],
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.userId !== null

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'attraction-list' })
  } else {
    next()
  }
})

export default router

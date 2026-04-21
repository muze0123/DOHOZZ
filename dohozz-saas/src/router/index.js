import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录 - DOHOZZ'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: '控制台 - DOHOZZ'
    }
  },
  {
    path: '/performance',
    name: 'Performance',
    component: () => import('@/views/Performance.vue'),
    meta: {
      requiresAuth: true,
      title: '绩效管理 - DOHOZZ'
    }
  },
  {
    path: '/report-center',
    name: 'ReportCenter',
    component: () => import('@/views/ReportCenter.vue'),
    meta: {
      requiresAuth: true,
      title: '报表中心 - DOHOZZ'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title
  if (title) {
    document.title = title
  }
  next()
})

export default router
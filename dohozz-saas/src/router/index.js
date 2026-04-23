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
    path: '/workspace',
    name: 'Workspace',
    component: () => import('@/views/Workspace.vue'),
    meta: {
      requiresAuth: true,
      title: '工作台 - DOHOZZ'
    }
  },
  {
    path: '/data-overview',
    name: 'DataOverview',
    component: () => import('@/views/DataOverview.vue'),
    meta: {
      requiresAuth: true,
      title: '数据概览 - DOHOZZ'
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
    path: '/commission',
    name: 'Commission',
    component: () => import('@/views/Commission.vue'),
    meta: {
      requiresAuth: true,
      title: '提成管理 - DOHOZZ'
    }
  },
  {
    path: '/performance-target',
    name: 'PerformanceTarget',
    component: () => import('@/views/PerformanceTarget.vue'),
    meta: {
      requiresAuth: true,
      title: '业绩目标 - DOHOZZ'
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
  },
  {
    path: '/report/create',
    name: 'CreateReport',
    component: () => import('@/views/CreateReport.vue'),
    meta: {
      requiresAuth: true,
      title: '创建报表 - DOHOZZ'
    }
  },
  {
    path: '/commission/help',
    name: 'CommissionHelp',
    component: () => import('@/views/CommissionHelp.vue'),
    meta: {
      requiresAuth: true,
      title: '功能说明 - DOHOZZ'
    }
  },
  {
    path: '/influencer-database',
    name: 'InfluencerDatabase',
    component: () => import('@/views/InfluencerDatabase.vue'),
    meta: {
      requiresAuth: true,
      title: '达人库 - DOHOZZ'
    }
  },
  {
    path: '/brand-discovery',
    name: 'BrandDiscovery',
    component: () => import('@/views/BrandDiscovery.vue'),
    meta: {
      requiresAuth: true,
      title: '品牌找达人 - DOHOZZ'
    }
  },
  {
    path: '/smart-recommendation',
    name: 'SmartRecommendation',
    component: () => import('@/views/SmartRecommendation.vue'),
    meta: {
      requiresAuth: true,
      title: '智能推荐达人 - DOHOZZ'
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

  // 认证守卫
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      next({ name: 'Login' })
      return
    }
  }

  next()
})

export default router
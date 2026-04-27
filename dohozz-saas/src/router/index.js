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
  },
  {
    path: '/influencer-public-pool',
    name: 'InfluencerPublicPool',
    component: () => import('@/views/InfluencerPublicPool.vue'),
    meta: {
      requiresAuth: true,
      title: '达人公海 - DOHOZZ'
    }
  },
  {
    path: '/business-config',
    name: 'BusinessConfig',
    component: () => import('@/views/BusinessConfig.vue'),
    meta: {
      requiresAuth: true,
      title: '业务配置 - DOHOZZ'
    }
  },
  {
    path: '/exchange-rate',
    name: 'ExchangeRate',
    component: () => import('@/views/ExchangeRate.vue'),
    meta: {
      requiresAuth: true,
      title: '汇率设置 - DOHOZZ'
    }
  },
  {
    path: '/message-center',
    name: 'MessageCenter',
    component: () => import('@/views/MessageCenter.vue'),
    meta: {
      requiresAuth: true,
      title: '消息中心 - DOHOZZ'
    }
  },
  {
    path: '/non-cart-video',
    name: 'NonCartVideo',
    component: () => import('@/views/NonCartVideo.vue'),
    meta: {
      requiresAuth: true,
      title: '非挂车视频 - DOHOZZ'
    }
  },
  {
    path: '/account-info',
    name: 'AccountInfo',
    component: () => import('@/views/AccountInfo.vue'),
    meta: {
      requiresAuth: true,
      title: '账户信息 - DOHOZZ'
    }
  },
  {
    path: '/black-list',
    name: 'BlackList',
    component: () => import('@/views/BlackList.vue'),
    meta: {
      requiresAuth: true,
      title: '黑名单 - DOHOZZ'
    }
  },
  {
    path: '/brand-insight',
    name: 'BrandInsight',
    component: () => import('@/views/BrandInsight.vue'),
    meta: {
      requiresAuth: true,
      title: '品牌洞察 - DOHOZZ'
    }
  },
  {
    path: '/collaboration-live',
    name: 'CollaborationLive',
    component: () => import('@/views/CollaborationLive.vue'),
    meta: {
      requiresAuth: true,
      title: '合作直播 - DOHOZZ'
    }
  },
  {
    path: '/cooperation-management',
    name: 'CooperationManagement',
    component: () => import('@/views/CooperationManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '合作管理 - DOHOZZ'
    }
  },
  {
    path: '/department-management',
    name: 'DepartmentManagement',
    component: () => import('@/views/DepartmentManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '部门管理 - DOHOZZ'
    }
  },
  {
    path: '/follow-up-records',
    name: 'FollowUpRecords',
    component: () => import('@/views/FollowUpRecords.vue'),
    meta: {
      requiresAuth: true,
      title: '跟进记录 - DOHOZZ'
    }
  },
  {
    path: '/import-influencer-leads',
    name: 'ImportInfluencerLeads',
    component: () => import('@/views/ImportInfluencerLeads.vue'),
    meta: {
      requiresAuth: true,
      title: '导入达人线索 - DOHOZZ'
    }
  },
  {
    path: '/industry-hot',
    name: 'IndustryHot',
    component: () => import('@/views/IndustryHot.vue'),
    meta: {
      requiresAuth: true,
      title: '行业热点 - DOHOZZ'
    }
  },
  {
    path: '/invitation-management',
    name: 'InvitationManagement',
    component: () => import('@/views/InvitationManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '邀约管理 - DOHOZZ'
    }
  },
  {
    path: '/leader-cooperation',
    name: 'LeaderCooperation',
    component: () => import('@/views/LeaderCooperation.vue'),
    meta: {
      requiresAuth: true,
      title: 'leader合作 - DOHOZZ'
    }
  },
  {
    path: '/leader-list',
    name: 'LeaderList',
    component: () => import('@/views/LeaderList.vue'),
    meta: {
      requiresAuth: true,
      title: 'leader列表 - DOHOZZ'
    }
  },
  {
    path: '/live-recording',
    name: 'LiveRecording',
    component: () => import('@/views/LiveRecording.vue'),
    meta: {
      requiresAuth: true,
      title: '直播录制 - DOHOZZ'
    }
  },
  {
    path: '/my-tracked-influencers',
    name: 'MyTrackedInfluencers',
    component: () => import('@/views/MyTrackedInfluencers.vue'),
    meta: {
      requiresAuth: true,
      title: '追踪达人 - DOHOZZ'
    }
  },
  {
    path: '/member-management',
    name: 'MemberManagement',
    component: () => import('@/views/MemberManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '成员管理 - DOHOZZ'
    }
  },
  {
    path: '/message-settings',
    name: 'MessageSettings',
    component: () => import('@/views/MessageSettings.vue'),
    meta: {
      requiresAuth: true,
      title: '消息设置 - DOHOZZ'
    }
  },
  {
    path: '/my-influencer',
    name: 'MyInfluencer',
    component: () => import('@/views/MyInfluencer.vue'),
    meta: {
      requiresAuth: true,
      title: '我的达人 - DOHOZZ'
    }
  },
  {
    path: '/natural-order-influencer',
    name: 'NaturalOrderInfluencer',
    component: () => import('@/views/NaturalOrderInfluencer.vue'),
    meta: {
      requiresAuth: true,
      title: '自然订单达人 - DOHOZZ'
    }
  },
  {
    path: '/order-management',
    name: 'OrderManagement',
    component: () => import('@/views/OrderManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '订单管理 - DOHOZZ'
    }
  },
  {
    path: '/outreach-task',
    name: 'OutreachTask',
    component: () => import('@/views/OutreachTask.vue'),
    meta: {
      requiresAuth: true,
      title: ' outreach任务 - DOHOZZ'
    }
  },
  {
    path: '/product-analysis',
    name: 'ProductAnalysis',
    component: () => import('@/views/ProductAnalysis.vue'),
    meta: {
      requiresAuth: true,
      title: '产品分析 - DOHOZZ'
    }
  },
  {
    path: '/product-library',
    name: 'ProductLibrary',
    component: () => import('@/views/ProductLibrary.vue'),
    meta: {
      requiresAuth: true,
      title: '产品库 - DOHOZZ'
    }
  },
  {
    path: '/product-search-influencer',
    name: 'ProductSearchInfluencer',
    component: () => import('@/views/ProductSearchInfluencer.vue'),
    meta: {
      requiresAuth: true,
      title: '产品搜索达人 - DOHOZZ'
    }
  },
  {
    path: '/role-management',
    name: 'RoleManagement',
    component: () => import('@/views/RoleManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '角色管理 - DOHOZZ'
    }
  },
  {
    path: '/sample-management',
    name: 'SampleManagement',
    component: () => import('@/views/SampleManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '样品管理 - DOHOZZ'
    }
  },
  {
    path: '/seeding-data-overview',
    name: 'SeedingDataOverview',
    component: () => import('@/views/SeedingDataOverview.vue'),
    meta: {
      requiresAuth: true,
      title: '播种数据概览 - DOHOZZ'
    }
  },
  {
    path: '/shop-management',
    name: 'ShopManagement',
    component: () => import('@/views/ShopManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '店铺管理 - DOHOZZ'
    }
  },
  {
    path: '/shopping-video',
    name: 'ShoppingVideo',
    component: () => import('@/views/ShoppingVideo.vue'),
    meta: {
      requiresAuth: true,
      title: '购物视频 - DOHOZZ'
    }
  },
  {
    path: '/tag-management',
    name: 'TagManagement',
    component: () => import('@/views/TagManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '标签管理 - DOHOZZ'
    }
  },
  {
    path: '/template-management',
    name: 'TemplateManagement',
    component: () => import('@/views/TemplateManagement.vue'),
    meta: {
      requiresAuth: true,
      title: '模板管理 - DOHOZZ'
    }
  },
  {
    path: '/video-fulfillment',
    name: 'VideoFulfillment',
    component: () => import('@/views/VideoFulfillment.vue'),
    meta: {
      requiresAuth: true,
      title: '视频履约 - DOHOZZ'
    }
  },
  {
    path: '/white-list',
    name: 'WhiteList',
    component: () => import('@/views/WhiteList.vue'),
    meta: {
      requiresAuth: true,
      title: '白名单 - DOHOZZ'
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
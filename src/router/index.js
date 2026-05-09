import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/workspace'
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
    path: '/',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'workspace',
        name: 'Workspace',
        component: () => import('@/views/Workspace.vue'),
        meta: { title: '工作台 - DOHOZZ' }
      },
      {
        path: 'data-overview',
        name: 'DataOverview',
        component: () => import('@/views/DataOverview.vue'),
        meta: { title: '数据概览 - DOHOZZ' }
      },
      {
        path: 'performance',
        name: 'Performance',
        component: () => import('@/views/Performance.vue'),
        meta: { title: '绩效管理 - DOHOZZ' }
      },
      {
        path: 'commission',
        name: 'Commission',
        component: () => import('@/views/Commission.vue'),
        meta: { title: '提成管理 - DOHOZZ' }
      },
      {
        path: 'performance-target',
        name: 'PerformanceTarget',
        component: () => import('@/views/PerformanceTarget.vue'),
        meta: { title: '业绩目标 - DOHOZZ' }
      },
      {
        path: 'report-center',
        name: 'ReportCenter',
        component: () => import('@/views/ReportCenter.vue'),
        meta: { title: '报表中心 - DOHOZZ' }
      },
      {
        path: 'report/create',
        name: 'CreateReport',
        component: () => import('@/views/CreateReport.vue'),
        meta: { title: '创建报表 - DOHOZZ' }
      },
      {
        path: 'commission/help',
        name: 'CommissionHelp',
        component: () => import('@/views/CommissionHelp.vue'),
        meta: { title: '功能说明 - DOHOZZ' }
      },
      {
        path: 'influencer-database',
        name: 'InfluencerDatabase',
        component: () => import('@/views/InfluencerDatabase.vue'),
        meta: { title: '达人库 - DOHOZZ' }
      },
      {
        path: 'brand-discovery',
        name: 'BrandDiscovery',
        component: () => import('@/views/BrandDiscovery.vue'),
        meta: { title: '品牌找达人 - DOHOZZ' }
      },
      {
        path: 'smart-recommendation',
        name: 'SmartRecommendation',
        component: () => import('@/views/SmartRecommendation.vue'),
        meta: { title: '智能推荐达人 - DOHOZZ' }
      },
      {
        path: 'influencer-public-pool',
        name: 'InfluencerPublicPool',
        component: () => import('@/views/InfluencerPublicPool.vue'),
        meta: { title: '达人公海 - DOHOZZ' }
      },
      {
        path: 'business-config',
        name: 'BusinessConfig',
        component: () => import('@/views/BusinessConfig.vue'),
        meta: { title: '业务配置 - DOHOZZ' }
      },
      {
        path: 'exchange-rate',
        name: 'ExchangeRate',
        component: () => import('@/views/ExchangeRate.vue'),
        meta: { title: '汇率设置 - DOHOZZ' }
      },
      {
        path: 'non-cart-video',
        name: 'NonCartVideo',
        component: () => import('@/views/NonCartVideo.vue'),
        meta: { title: '非挂车视频 - DOHOZZ' }
      },
      {
        path: 'account-info',
        name: 'AccountInfo',
        component: () => import('@/views/AccountInfo.vue'),
        meta: { title: '账户信息 - DOHOZZ' }
      },
      {
        path: 'black-list',
        name: 'BlackList',
        component: () => import('@/views/BlackList.vue'),
        meta: { title: '黑名单 - DOHOZZ' }
      },
      {
        path: 'brand-insight',
        name: 'BrandInsight',
        component: () => import('@/views/BrandInsight.vue'),
        meta: { title: '品牌洞察 - DOHOZZ' }
      },
      {
        path: 'collaboration-live',
        name: 'CollaborationLive',
        component: () => import('@/views/CollaborationLive.vue'),
        meta: { title: '合作直播 - DOHOZZ' }
      },
      {
        path: 'cooperation-management',
        name: 'CooperationManagement',
        component: () => import('@/views/CooperationManagement.vue'),
        meta: { title: '合作管理 - DOHOZZ' }
      },
      {
        path: 'department-management',
        name: 'DepartmentManagement',
        component: () => import('@/views/DepartmentManagement.vue'),
        meta: { title: '部门管理 - DOHOZZ' }
      },
      {
        path: 'follow-up-records',
        name: 'FollowUpRecords',
        component: () => import('@/views/FollowUpRecords.vue'),
        meta: { title: '跟进记录 - DOHOZZ' }
      },
      {
        path: 'import-influencer-leads',
        name: 'ImportInfluencerLeads',
        component: () => import('@/views/ImportInfluencerLeads.vue'),
        meta: { title: '导入达人线索 - DOHOZZ' }
      },
      {
        path: 'industry-hot',
        name: 'IndustryHot',
        component: () => import('@/views/IndustryHot.vue'),
        meta: { title: '行业热点 - DOHOZZ' }
      },
      {
        path: 'invitation-management',
        name: 'InvitationManagement',
        component: () => import('@/views/InvitationManagement.vue'),
        meta: { title: '邀约管理 - DOHOZZ' }
      },
      {
        path: 'leader-cooperation',
        name: 'LeaderCooperation',
        component: () => import('@/views/LeaderCooperation.vue'),
        meta: { title: 'leader合作 - DOHOZZ' }
      },
      {
        path: 'leader-list',
        name: 'LeaderList',
        component: () => import('@/views/LeaderList.vue'),
        meta: { title: 'leader列表 - DOHOZZ' }
      },
      {
        path: 'live-recording',
        name: 'LiveRecording',
        component: () => import('@/views/LiveRecording.vue'),
        meta: { title: '直播录制 - DOHOZZ' }
      },
      {
        path: 'my-tracked-influencers',
        name: 'MyTrackedInfluencers',
        component: () => import('@/views/MyTrackedInfluencers.vue'),
        meta: { title: '追踪达人 - DOHOZZ' }
      },
      {
        path: 'plan-management',
        name: 'PlanManagement',
        component: () => import('@/views/PlanManagement.vue'),
        meta: { title: '计划管理 - DOHOZZ' }
      },
      {
        path: 'member-management',
        name: 'MemberManagement',
        component: () => import('@/views/MemberManagement.vue'),
        meta: { title: '成员管理 - DOHOZZ' }
      },
      {
        path: 'message-settings',
        name: 'MessageSettings',
        component: () => import('@/views/MessageSettings.vue'),
        meta: { title: '消息设置 - DOHOZZ' }
      },
      {
        path: 'my-influencer',
        name: 'MyInfluencer',
        component: () => import('@/views/MyInfluencer.vue'),
        meta: { title: '我的达人 - DOHOZZ' }
      },
      {
        path: 'natural-order-influencer',
        name: 'NaturalOrderInfluencer',
        component: () => import('@/views/NaturalOrderInfluencer.vue'),
        meta: { title: '自然订单达人 - DOHOZZ' }
      },
      {
        path: 'order-management',
        name: 'OrderManagement',
        component: () => import('@/views/OrderManagement.vue'),
        meta: { title: '订单管理 - DOHOZZ' }
      },
      {
        path: 'outreach-task',
        name: 'OutreachTask',
        component: () => import('@/views/OutreachTask.vue'),
        meta: { title: 'outreach任务 - DOHOZZ' }
      },
      {
        path: 'product-analysis',
        name: 'ProductAnalysis',
        component: () => import('@/views/ProductAnalysis.vue'),
        meta: { title: '产品分析 - DOHOZZ' }
      },
      {
        path: 'product-library',
        name: 'ProductLibrary',
        component: () => import('@/views/ProductLibrary.vue'),
        meta: { title: '产品库 - DOHOZZ' }
      },
      {
        path: 'product-search-influencer',
        name: 'ProductSearchInfluencer',
        component: () => import('@/views/ProductSearchInfluencer.vue'),
        meta: { title: '产品搜索达人 - DOHOZZ' }
      },
      {
        path: 'role-management',
        name: 'RoleManagement',
        component: () => import('@/views/RoleManagement.vue'),
        meta: { title: '角色管理 - DOHOZZ' }
      },
      {
        path: 'sample-management',
        name: 'SampleManagement',
        component: () => import('@/views/SampleManagement.vue'),
        meta: { title: '样品管理 - DOHOZZ' }
      },
      {
        path: 'seeding-data-overview',
        name: 'SeedingDataOverview',
        component: () => import('@/views/SeedingDataOverview.vue'),
        meta: { title: '播种数据概览 - DOHOZZ' }
      },
      {
        path: 'shop-management',
        name: 'ShopManagement',
        component: () => import('@/views/ShopManagement.vue'),
        meta: { title: '店铺管理 - DOHOZZ' }
      },
      {
        path: 'shopping-video',
        name: 'ShoppingVideo',
        component: () => import('@/views/ShoppingVideo.vue'),
        meta: { title: '购物视频 - DOHOZZ' }
      },
      {
        path: 'tag-management',
        name: 'TagManagement',
        component: () => import('@/views/TagManagement.vue'),
        meta: { title: '标签管理 - DOHOZZ' }
      },
      {
        path: 'template-management',
        name: 'TemplateManagement',
        component: () => import('@/views/TemplateManagement.vue'),
        meta: { title: '模板管理 - DOHOZZ' }
      },
      {
        path: 'video-fulfillment',
        name: 'VideoFulfillment',
        component: () => import('@/views/VideoFulfillment.vue'),
        meta: { title: '视频履约 - DOHOZZ' }
      },
      {
        path: 'white-list',
        name: 'WhiteList',
        component: () => import('@/views/WhiteList.vue'),
        meta: { title: '白名单 - DOHOZZ' }
      },
      {
        path: 'enterprise-influencer',
        name: 'EnterpriseInfluencer',
        component: () => import('@/views/EnterpriseInfluencer/EnterpriseInfluencer.vue'),
        meta: { title: '企业达人库 - DOHOZZ' }
      },
      {
        path: 'influencer-tags',
        name: 'InfluencerTags',
        component: () => import('@/views/InfluencerTags/InfluencerTags.vue'),
        meta: { title: '达人标签 - DOHOZZ' }
      },
      {
        path: 'influencer/detail/basic-analysis',
        name: 'InfluencerDetailBasicAnalysis',
        component: () => import('@/views/influencer/detail/InfluencerDetailBasicAnalysis.vue'),
        meta: { title: '达人详情-基础分析 - DOHOZZ' }
      },
      {
        path: 'content-tags',
        name: 'ContentTags',
        component: () => import('@/views/ContentTags/ContentTags.vue'),
        meta: { title: '内容标签 - DOHOZZ' }
      },
      {
        path: 'script-management',
        name: 'ScriptManagement',
        component: () => import('@/views/ScriptManagement/ScriptManagement.vue'),
        meta: { title: '脚本管理 - DOHOZZ' }
      },
      {
        path: 'ai-film-analysis',
        name: 'AIFilmAnalysis',
        component: () => import('@/views/AIFilmAnalysis.vue'),
        meta: { title: 'AI拉片 - DOHOZZ' }
      },
      {
        path: 'extract-script',
        name: 'ExtractScript',
        component: () => import('@/views/ExtractScript.vue'),
        meta: { title: '提取脚本 - DOHOZZ' }
      },
      {
        path: 'ai-rewrite',
        name: 'AIRewrite',
        component: () => import('@/views/AIRewrite.vue'),
        meta: { title: 'AI仿写 - DOHOZZ' }
      },
      {
        path: 'command-center',
        name: 'CommandCenter',
        component: () => import('@/views/CommandCenter.vue'),
        meta: { title: '指挥中台 - DOHOZZ' }
      },
      {
        path: 'command-center/product-shop-analysis',
        name: 'ProductShopAnalysis',
        component: () => import('@/views/ProductShopAnalysis.vue'),
        meta: { title: '商品&店铺指标分析 - DOHOZZ' }
      },
      {
        path: 'live-stream-analysis',
        name: 'LiveStreamAnalysis',
        component: () => import('@/views/LiveStreamAnalysis.vue'),
        meta: { title: '达播 - DOHOZZ' }
      },
      {
        path: 'team-analysis',
        name: 'TeamAnalysis',
        component: () => import('@/views/TeamAnalysis.vue'),
        meta: { title: '团队 - DOHOZZ' }
      },
      {
        path: 'content-analysis',
        name: 'ContentAnalysis',
        component: () => import('@/views/ContentAnalysis.vue'),
        meta: { title: '内容 - DOHOZZ' }
      },
      {
        path: 'big-screen',
        name: 'BigScreen',
        component: () => import('@/views/BigScreen.vue'),
        meta: { title: '大屏 - DOHOZZ' }
      },
      {
        path: 'content-management',
        name: 'ContentManagement',
        component: () => import('@/views/ContentManagement.vue'),
        meta: { title: '内容管理 - DOHOZZ' }
      },
      {
        path: 'seeding-sample-management',
        name: 'SeedingSampleManagement',
        component: () => import('@/views/SeedingSampleManagement.vue'),
        meta: { title: '寄样管理 - DOHOZZ' }
      },
      {
        path: 'product-link',
        name: 'ProductLink',
        component: () => import('@/views/ProductLink.vue'),
        meta: { title: '商品链接 - DOHOZZ' }
      },
      {
        path: 'content-asset',
        name: 'ContentAsset',
        component: () => import('@/views/ContentAsset.vue'),
        meta: { title: '内容资产 - DOHOZZ' }
      },
      {
        path: 'launch-management',
        name: 'LaunchManagement',
        component: () => import('@/views/LaunchManagement.vue'),
        meta: { title: '投放管理 - DOHOZZ' }
      },
      {
        path: 'spu-management',
        name: 'SpuManagement',
        component: () => import('@/views/SpuManagement.vue'),
        meta: { title: 'SPU管理 - DOHOZZ' }
      },
      {
        path: 'message-center',
        name: 'MessageCenter',
        component: () => import('@/views/MessageCenter.vue'),
        meta: { title: '消息中心 - DOHOZZ' }
      }
    ]
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

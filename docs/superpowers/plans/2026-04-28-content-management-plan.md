# 内容管理模块实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在内容种草→合作内容下构建内容管理二级菜单页面，实现内容列表的筛选、搜索、编辑、详情等完整功能

**Architecture:** 采用组件化架构，API层使用Mock数据模拟抖音/小红书两套端点，Store层管理状态，组件层负责展示和交互

**Tech Stack:** Vue 3 (Composition API + `<script setup>`) + Pinia + Element Plus + Tailwind CSS

---

## 文件结构

```
src/
├── api/contentManagement.js              # API层（抖音/小红书两套端点）
├── stores/contentManagement.js           # Pinia Store
├── views/
│   ├── ContentManagement.vue             # 主页面
│   └── components/
│       ├── ContentPlatformNav.vue        # 平台切换导航
│       ├── ContentFilterSection.vue      # 筛选操作栏
│       ├── ContentStatsSection.vue       # 数据概览卡片
│       └── ContentListSection.vue        # 内容表格
│   └── ContentManagement/dialogs/
│       ├── EditContentDialog.vue         # 编辑内容弹窗
│       ├── ContentDetailDialog.vue       # 内容详情弹窗
│       └── MoreActionsMenu.vue           # 更多操作菜单
└── router/index.js                       # 路由配置
```

---

## Task 1: API层开发

**Files:**
- Create: `dohozz-saas/src/api/contentManagement.js`

- [ ] **Step 1: 创建API文件**

```javascript
/**
 * 内容管理 API
 * 使用 Mock 数据，真实接口预留
 */

import { ElMessage } from 'element-plus'

// Mock 延迟时间
const MOCK_DELAY = 500

// ==================== Mock 数据 ====================

// 抖音内容列表 Mock 数据
const mockDouyinContents = [
  {
    id: 'c001',
    title: '夏日清新妆容教程',
    coverUrl: 'https://picsum.photos/seed/c001/400/300',
    url: 'https://www.douyin.com/video/c001',
    streamerId: 's001',
    streamerName: '美妆达人小雅',
    streamerAccount: 'meiyanxiaoya',
    streamerAvatar: 'https://i.pravatar.cc/150?img=101',
    contentTags: ['美妆', '教程'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p001',
    planName: '夏季美妆推广计划',
    spuId: 'spu001',
    spuTitle: '清透防晒霜',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm001',
    mediumName: '李媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=201',
    viewCount: 2600000000,
    likeCount: 22110900,
    commentCount: 2231700,
    collectCount: 2066400,
    publishTime: '2026-04-20 14:30:00',
    createTime: '2026-04-15 10:00:00',
    updateTime: '2026-04-25 16:00:00',
    remark: '优质内容，转化效果好',
    isConfirmed: true
  },
  {
    id: 'c002',
    title: '运动耳机深度测评',
    coverUrl: 'https://picsum.photos/seed/c002/400/300',
    url: 'https://www.douyin.com/video/c002',
    streamerId: 's002',
    streamerName: '科技小王子',
    streamerAccount: 'kejixiaowangzi',
    streamerAvatar: 'https://i.pravatar.cc/150?img=102',
    contentTags: ['科技', '测评'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p002',
    planName: '数码产品测评计划',
    spuId: 'spu002',
    spuTitle: '蓝牙运动耳机',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm002',
    mediumName: '张媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=202',
    viewCount: 890000000,
    likeCount: 5200000,
    commentCount: 318000,
    collectCount: 286000,
    publishTime: '2026-04-22 10:15:00',
    createTime: '2026-04-18 09:00:00',
    updateTime: '2026-04-26 12:00:00',
    remark: '',
    isConfirmed: false
  },
  {
    id: 'c003',
    title: '东南亚美食探店vlog',
    coverUrl: 'https://picsum.photos/seed/c003/400/300',
    url: 'https://www.douyin.com/video/c003',
    streamerId: 's003',
    streamerName: '吃货小分队',
    streamerAccount: 'chihuo_xiaofendui',
    streamerAvatar: 'https://i.pravatar.cc/150?img=103',
    contentTags: ['美食', '探店'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p003',
    planName: '美食探店计划',
    spuId: 'spu003',
    spuTitle: '进口零食大礼包',
    departmentId: 'd002',
    departmentName: '运营部',
    mediumId: 'm001',
    mediumName: '李媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=201',
    viewCount: 1560000000,
    likeCount: 11200000,
    commentCount: 680000,
    collectCount: 520000,
    publishTime: '2026-04-18 18:45:00',
    createTime: '2026-04-12 14:00:00',
    updateTime: '2026-04-24 20:30:00',
    remark: '探店效果超预期',
    isConfirmed: true
  },
  {
    id: 'c004',
    title: '时尚穿搭指南',
    coverUrl: 'https://picsum.photos/seed/c004/400/300',
    url: 'https://www.douyin.com/video/c004',
    streamerId: 's004',
    streamerName: '潮流小七',
    streamerAccount: 'chaoliu_xiaoqi',
    streamerAvatar: 'https://i.pravatar.cc/150?img=104',
    contentTags: ['时尚', '穿搭'],
    publishForm: '短视频',
    contentStatus: 'abnormal',
    statusText: '异常',
    planId: 'p001',
    planName: '夏季美妆推广计划',
    spuId: 'spu001',
    spuTitle: '清透防晒霜',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm003',
    mediumName: '王媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=203',
    viewCount: 678000000,
    likeCount: 4300000,
    commentCount: 215000,
    collectCount: 186000,
    publishTime: '2026-04-15 09:00:00',
    createTime: '2026-04-10 11:00:00',
    updateTime: '2026-04-23 11:00:00',
    remark: '数据异常已处理',
    isConfirmed: false
  },
  {
    id: 'c005',
    title: '护肤routine大公开',
    coverUrl: 'https://picsum.photos/seed/c005/400/300',
    url: 'https://www.douyin.com/video/c005',
    streamerId: 's005',
    streamerName: '护肤小能手',
    streamerAccount: 'hufu_xiaonengshou',
    streamerAvatar: 'https://i.pravatar.cc/150?img=105',
    contentTags: ['美妆', '护肤'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p004',
    planName: '护肤品牌推广',
    spuId: 'spu004',
    spuTitle: '氨基酸洗面奶',
    departmentId: 'd002',
    departmentName: '运营部',
    mediumId: 'm001',
    mediumName: '李媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=201',
    viewCount: 1980000000,
    likeCount: 15800000,
    commentCount: 920000,
    collectCount: 860000,
    publishTime: '2026-04-12 16:20:00',
    createTime: '2026-04-08 15:00:00',
    updateTime: '2026-04-22 18:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'c006',
    title: '家居好物推荐清单',
    coverUrl: 'https://picsum.photos/seed/c006/400/300',
    url: 'https://www.douyin.com/video/c006',
    streamerId: 's006',
    streamerName: '生活家小居',
    streamerAccount: 'shenghuojia_xiaoju',
    streamerAvatar: 'https://i.pravatar.cc/150?img=106',
    contentTags: ['家居', '好物'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: '',
    planName: '',
    spuId: '',
    spuTitle: '',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm002',
    mediumName: '张媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=202',
    viewCount: 456000000,
    likeCount: 2800000,
    commentCount: 156000,
    collectCount: 134000,
    publishTime: '2026-04-10 11:30:00',
    createTime: '2026-04-05 09:00:00',
    updateTime: '2026-04-20 11:00:00',
    remark: '暂无关联计划',
    isConfirmed: false
  },
  {
    id: 'c007',
    title: '儿童益智玩具开箱',
    coverUrl: 'https://picsum.photos/seed/c007/400/300',
    url: 'https://www.douyin.com/video/c007',
    streamerId: 's007',
    streamerName: '宝贝成长记',
    streamerAccount: 'baobei_chengzhangji',
    streamerAvatar: 'https://i.pravatar.cc/150?img=107',
    contentTags: ['母婴', '玩具'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p005',
    planName: '儿童节活动',
    spuId: 'spu005',
    spuTitle: '益智积木套装',
    departmentId: 'd003',
    departmentName: '销售部',
    mediumId: 'm003',
    mediumName: '王媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=203',
    viewCount: 786000000,
    likeCount: 5600000,
    commentCount: 320000,
    collectCount: 298000,
    publishTime: '2026-04-08 15:00:00',
    createTime: '2026-04-03 10:00:00',
    updateTime: '2026-04-18 17:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'c008',
    title: '数码产品横向对比',
    coverUrl: 'https://picsum.photos/seed/c008/400/300',
    url: 'https://www.douyin.com/video/c008',
    streamerId: 's002',
    streamerName: '科技小王子',
    streamerAccount: 'kejixiaowangzi',
    streamerAvatar: 'https://i.pravatar.cc/150?img=102',
    contentTags: ['科技', '测评'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p002',
    planName: '数码产品测评计划',
    spuId: 'spu006',
    spuTitle: '智能手环',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm002',
    mediumName: '张媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=202',
    viewCount: 1120000000,
    likeCount: 7800000,
    commentCount: 540000,
    collectCount: 486000,
    publishTime: '2026-04-05 08:45:00',
    createTime: '2026-04-01 09:00:00',
    updateTime: '2026-04-15 10:30:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'c009',
    title: '周末轻食料理',
    coverUrl: 'https://picsum.photos/seed/c009/400/300',
    url: 'https://www.douyin.com/video/c009',
    streamerId: 's003',
    streamerName: '吃货小分队',
    streamerAccount: 'chihuo_xiaofendui',
    streamerAvatar: 'https://i.pravatar.cc/150?img=103',
    contentTags: ['美食', '轻食'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p003',
    planName: '美食探店计划',
    spuId: 'spu007',
    spuTitle: '健康轻食套餐',
    departmentId: 'd002',
    departmentName: '运营部',
    mediumId: 'm001',
    mediumName: '李媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=201',
    viewCount: 890000000,
    likeCount: 6200000,
    commentCount: 410000,
    collectCount: 368000,
    publishTime: '2026-04-03 19:30:00',
    createTime: '2026-03-28 14:00:00',
    updateTime: '2026-04-12 21:00:00',
    remark: '',
    isConfirmed: false
  },
  {
    id: 'c010',
    title: '春季换季穿搭分享',
    coverUrl: 'https://picsum.photos/seed/c010/400/300',
    url: 'https://www.douyin.com/video/c010',
    streamerId: 's004',
    streamerName: '潮流小七',
    streamerAccount: 'chaoliu_xiaoqi',
    streamerAvatar: 'https://i.pravatar.cc/150?img=104',
    contentTags: ['时尚', '穿搭'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p006',
    planName: '春季穿搭季',
    spuId: 'spu008',
    spuTitle: '春季新款女装',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm003',
    mediumName: '王媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=203',
    viewCount: 1340000000,
    likeCount: 9800000,
    commentCount: 620000,
    collectCount: 568000,
    publishTime: '2026-03-28 12:00:00',
    createTime: '2026-03-22 11:00:00',
    updateTime: '2026-04-08 14:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'c011',
    title: '敏感肌修护全攻略',
    coverUrl: 'https://picsum.photos/seed/c011/400/300',
    url: 'https://www.douyin.com/video/c011',
    streamerId: 's005',
    streamerName: '护肤小能手',
    streamerAccount: 'hufu_xiaonengshou',
    streamerAvatar: 'https://i.pravatar.cc/150?img=105',
    contentTags: ['美妆', '护肤'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p004',
    planName: '护肤品牌推广',
    spuId: 'spu009',
    spuTitle: '敏感肌修护精华',
    departmentId: 'd002',
    departmentName: '运营部',
    mediumId: 'm001',
    mediumName: '李媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=201',
    viewCount: 1680000000,
    likeCount: 13200000,
    commentCount: 780000,
    collectCount: 720000,
    publishTime: '2026-03-25 14:00:00',
    createTime: '2026-03-20 10:00:00',
    updateTime: '2026-04-05 16:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'c012',
    title: '收纳神器大搜罗',
    coverUrl: 'https://picsum.photos/seed/c012/400/300',
    url: 'https://www.douyin.com/video/c012',
    streamerId: 's006',
    streamerName: '生活家小居',
    streamerAccount: 'shenghuojia_xiaoju',
    streamerAvatar: 'https://i.pravatar.cc/150?img=106',
    contentTags: ['家居', '收纳'],
    publishForm: '短视频',
    contentStatus: 'deleted',
    statusText: '已删除',
    planId: '',
    planName: '',
    spuId: '',
    spuTitle: '',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm002',
    mediumName: '张媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=202',
    viewCount: 567000000,
    likeCount: 3600000,
    commentCount: 198000,
    collectCount: 176000,
    publishTime: '2026-03-20 09:30:00',
    createTime: '2026-03-15 09:00:00',
    updateTime: '2026-04-01 09:00:00',
    remark: '已下架',
    isConfirmed: false
  }
]

// 小红书内容列表 Mock 数据
const mockXiaohongshuContents = [
  {
    id: 'xhs001',
    title: '春日限定美妆教程',
    coverUrl: 'https://picsum.photos/seed/xhs001/400/300',
    url: 'https://www.xiaohongshu.com/discovery/item/xhs001',
    streamerId: 'xs001',
    streamerName: '美妆博主小白',
    streamerAccount: 'beauty_xiaobai',
    streamerAvatar: 'https://i.pravatar.cc/150?img=301',
    contentTags: ['美妆', '教程'],
    publishForm: '图文',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p001',
    planName: '夏季美妆推广计划',
    spuId: 'spu001',
    spuTitle: '清透防晒霜',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm001',
    mediumName: '李媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=201',
    viewCount: 5200000,
    likeCount: 420000,
    commentCount: 18600,
    collectCount: 358000,
    publishTime: '2026-04-22 14:00:00',
    createTime: '2026-04-20 10:00:00',
    updateTime: '2026-04-26 16:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'xhs002',
    title: '租房改造日记',
    coverUrl: 'https://picsum.photos/seed/xhs002/400/300',
    url: 'https://www.xiaohongshu.com/discovery/item/xhs002',
    streamerId: 'xs002',
    streamerName: '租房少女',
    streamerAccount: 'zufang_shaonv',
    streamerAvatar: 'https://i.pravatar.cc/150?img=302',
    contentTags: ['家居', '改造'],
    publishForm: '图文',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p007',
    planName: '家居好物推荐',
    spuId: 'spu010',
    spuTitle: '墙上置物架',
    departmentId: 'd002',
    departmentName: '运营部',
    mediumId: 'm002',
    mediumName: '张媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=202',
    viewCount: 2800000,
    likeCount: 186000,
    commentCount: 9800,
    collectCount: 156000,
    publishTime: '2026-04-20 10:00:00',
    createTime: '2026-04-18 09:00:00',
    updateTime: '2026-04-24 12:00:00',
    remark: '',
    isConfirmed: false
  },
  {
    id: 'xhs003',
    title: '一周穿搭不重样',
    coverUrl: 'https://picsum.photos/seed/xhs003/400/300',
    url: 'https://www.xiaohongshu.com/discovery/item/xhs003',
    streamerId: 'xs003',
    streamerName: '时尚达人Lisa',
    streamerAccount: 'fashion_lisa',
    streamerAvatar: 'https://i.pravatar.cc/150?img=303',
    contentTags: ['时尚', '穿搭'],
    publishForm: '图文',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p006',
    planName: '春季穿搭季',
    spuId: 'spu008',
    spuTitle: '春季新款女装',
    departmentId: 'd001',
    departmentName: '市场部',
    mediumId: 'm003',
    mediumName: '王媒介',
    mediumAvatar: 'https://i.pravatar.cc/150?img=203',
    viewCount: 6800000,
    likeCount: 520000,
    commentCount: 28600,
    collectCount: 486000,
    publishTime: '2026-04-18 15:00:00',
    createTime: '2026-04-15 11:00:00',
    updateTime: '2026-04-22 18:00:00',
    remark: '',
    isConfirmed: true
  }
]

// 统计数据 Mock
const mockStatsData = {
  douyin: {
    total: 433,
    viewCount: 2600000000,
    likeCount: 22110900,
    commentCount: 2231700,
    collectCount: 2066400
  },
  xiaohongshu: {
    total: 128,
    viewCount: 14800000,
    likeCount: 1126000,
    commentCount: 57000,
    collectCount: 1000000
  }
}

// ==================== 辅助函数 ====================

/**
 * 格式化数字显示
 */
function formatNumber(num) {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toLocaleString()
}

/**
 * 根据时间范围获取开始和结束日期
 */
function getDateRange(timeRange) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (timeRange) {
    case 'yesterday':
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return { start: yesterday.toISOString().slice(0, 10), end: yesterday.toISOString().slice(0, 10) }
    case 'today':
      return { start: today.toISOString().slice(0, 10), end: today.toISOString().slice(0, 10) }
    case 'last7days':
      const last7 = new Date(today)
      last7.setDate(last7.getDate() - 7)
      return { start: last7.toISOString().slice(0, 10), end: today.toISOString().slice(0, 10) }
    case 'last30days':
      const last30 = new Date(today)
      last30.setDate(last30.getDate() - 30)
      return { start: last30.toISOString().slice(0, 10), end: today.toISOString().slice(0, 10) }
    default:
      return null
  }
}

// ==================== 抖音内容 API ====================

/**
 * 获取抖音内容列表
 */
export function getDouyinContents(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        page = 1,
        pageSize = 10,
        planId = '',
        streamerName = '',
        contentTag = '',
        publishForm = '',
        spuId = '',
        productLink = '',
        departmentId = '',
        mediumId = '',
        contentStatus = '',
        publishTimeStart = '',
        publishTimeEnd = '',
        createTimeStart = '',
        createTimeEnd = '',
        keyword = '',
        timeRange = 'all'
      } = params

      let filteredList = [...mockDouyinContents]

      // 关键词搜索
      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.title.toLowerCase().includes(kw) ||
          item.streamerName.toLowerCase().includes(kw) ||
          item.streamerAccount.toLowerCase().includes(kw)
        )
      }

      // 关联计划筛选
      if (planId) {
        filteredList = filteredList.filter(item => item.planId === planId)
      }

      // 达人昵称搜索
      if (streamerName) {
        const sn = streamerName.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.streamerName.toLowerCase().includes(sn) ||
          item.streamerAccount.toLowerCase().includes(sn)
        )
      }

      // 内容标签筛选
      if (contentTag) {
        filteredList = filteredList.filter(item => item.contentTags.includes(contentTag))
      }

      // 发布形式筛选
      if (publishForm) {
        filteredList = filteredList.filter(item => item.publishForm.includes(publishForm))
      }

      // SPU筛选
      if (spuId) {
        filteredList = filteredList.filter(item => item.spuId === spuId)
      }

      // 部门筛选
      if (departmentId) {
        filteredList = filteredList.filter(item => item.departmentId === departmentId)
      }

      // 媒介筛选
      if (mediumId) {
        filteredList = filteredList.filter(item => item.mediumId === mediumId)
      }

      // 状态筛选
      if (contentStatus) {
        filteredList = filteredList.filter(item => item.contentStatus === contentStatus)
      }

      // 发布时间范围筛选
      if (publishTimeStart && publishTimeEnd) {
        filteredList = filteredList.filter(item => {
          const pubTime = item.publishTime.slice(0, 10)
          return pubTime >= publishTimeStart && pubTime <= publishTimeEnd
        })
      }

      // 创建时间范围筛选
      if (createTimeStart && createTimeEnd) {
        filteredList = filteredList.filter(item => {
          const createT = item.createTime.slice(0, 10)
          return createT >= createTimeStart && createT <= createTimeEnd
        })
      }

      // 时间范围筛选
      const dateRange = getDateRange(timeRange)
      if (dateRange) {
        filteredList = filteredList.filter(item => {
          const pubTime = item.publishTime.slice(0, 10)
          return pubTime >= dateRange.start && pubTime <= dateRange.end
        })
      }

      // 分页
      const total = filteredList.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 0,
        message: 'success',
        data: {
          list,
          pagination: {
            page,
            pageSize,
            total
          }
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取抖音内容详情
 */
export function getDouyinContentDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = mockDouyinContents.find(item => item.id === id)
      if (content) {
        resolve({ code: 0, message: 'success', data: content })
      } else {
        resolve({ code: 404, message: '内容不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 更新抖音内容
 */
export function updateDouyinContent(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDouyinContents.findIndex(item => item.id === id)
      if (index > -1) {
        mockDouyinContents[index] = { ...mockDouyinContents[index], ...data, updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ') }
        resolve({ code: 0, message: '编辑成功', data: mockDouyinContents[index] })
      } else {
        resolve({ code: 404, message: '内容不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 删除抖音内容
 */
export function deleteDouyinContent(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDouyinContents.findIndex(item => item.id === id)
      if (index > -1) {
        mockDouyinContents[index].contentStatus = 'deleted'
        mockDouyinContents[index].statusText = '已删除'
        resolve({ code: 0, message: '删除成功', data: null })
      } else {
        resolve({ code: 404, message: '内容不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 归档抖音内容
 */
export function archiveDouyinContent(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = mockDouyinContents.find(item => item.id === id)
      if (content) {
        resolve({ code: 0, message: '归档成功', data: null })
      } else {
        resolve({ code: 404, message: '内容不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 一键确认抖音内容
 */
export function confirmDouyinContents(ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      ids.forEach(id => {
        const content = mockDouyinContents.find(item => item.id === id)
        if (content) {
          content.isConfirmed = true
        }
      })
      resolve({ code: 0, message: '一键确认成功', data: { success: ids.length } })
    }, MOCK_DELAY)
  })
}

/**
 * 导出抖音内容
 */
export function exportDouyinContents(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: '导出成功', data: { url: '/exports/douyin_contents.xlsx' } })
    }, MOCK_DELAY)
  })
}

// ==================== 小红书内容 API ====================

/**
 * 获取小红书内容列表
 */
export function getXiaohongshuContents(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        page = 1,
        pageSize = 10,
        planId = '',
        streamerName = '',
        contentTag = '',
        publishForm = '',
        spuId = '',
        productLink = '',
        departmentId = '',
        mediumId = '',
        contentStatus = '',
        publishTimeStart = '',
        publishTimeEnd = '',
        createTimeStart = '',
        createTimeEnd = '',
        keyword = '',
        timeRange = 'all'
      } = params

      let filteredList = [...mockXiaohongshuContents]

      // 关键词搜索
      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.title.toLowerCase().includes(kw) ||
          item.streamerName.toLowerCase().includes(kw) ||
          item.streamerAccount.toLowerCase().includes(kw)
        )
      }

      // 筛选条件应用
      if (planId) {
        filteredList = filteredList.filter(item => item.planId === planId)
      }
      if (streamerName) {
        const sn = streamerName.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.streamerName.toLowerCase().includes(sn) ||
          item.streamerAccount.toLowerCase().includes(sn)
        )
      }
      if (contentTag) {
        filteredList = filteredList.filter(item => item.contentTags.includes(contentTag))
      }
      if (publishForm) {
        filteredList = filteredList.filter(item => item.publishForm.includes(publishForm))
      }
      if (spuId) {
        filteredList = filteredList.filter(item => item.spuId === spuId)
      }
      if (departmentId) {
        filteredList = filteredList.filter(item => item.departmentId === departmentId)
      }
      if (mediumId) {
        filteredList = filteredList.filter(item => item.mediumId === mediumId)
      }
      if (contentStatus) {
        filteredList = filteredList.filter(item => item.contentStatus === contentStatus)
      }
      if (publishTimeStart && publishTimeEnd) {
        filteredList = filteredList.filter(item => {
          const pubTime = item.publishTime.slice(0, 10)
          return pubTime >= publishTimeStart && pubTime <= publishTimeEnd
        })
      }
      if (createTimeStart && createTimeEnd) {
        filteredList = filteredList.filter(item => {
          const createT = item.createTime.slice(0, 10)
          return createT >= createTimeStart && createT <= createTimeEnd
        })
      }

      // 时间范围筛选
      const dateRange = getDateRange(timeRange)
      if (dateRange) {
        filteredList = filteredList.filter(item => {
          const pubTime = item.publishTime.slice(0, 10)
          return pubTime >= dateRange.start && pubTime <= dateRange.end
        })
      }

      // 分页
      const total = filteredList.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 0,
        message: 'success',
        data: {
          list,
          pagination: {
            page,
            pageSize,
            total
          }
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取小红书内容详情
 */
export function getXiaohongshuContentDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = mockXiaohongshuContents.find(item => item.id === id)
      if (content) {
        resolve({ code: 0, message: 'success', data: content })
      } else {
        resolve({ code: 404, message: '内容不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 更新小红书内容
 */
export function updateXiaohongshuContent(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockXiaohongshuContents.findIndex(item => item.id === id)
      if (index > -1) {
        mockXiaohongshuContents[index] = { ...mockXiaohongshuContents[index], ...data, updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ') }
        resolve({ code: 0, message: '编辑成功', data: mockXiaohongshuContents[index] })
      } else {
        resolve({ code: 404, message: '内容不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 删除小红书内容
 */
export function deleteXiaohongshuContent(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockXiaohongshuContents.findIndex(item => item.id === id)
      if (index > -1) {
        mockXiaohongshuContents[index].contentStatus = 'deleted'
        mockXiaohongshuContents[index].statusText = '已删除'
        resolve({ code: 0, message: '删除成功', data: null })
      } else {
        resolve({ code: 404, message: '内容不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 归档小红书内容
 */
export function archiveXiaohongshuContent(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = mockXiaohongshuContents.find(item => item.id === id)
      if (content) {
        resolve({ code: 0, message: '归档成功', data: null })
      } else {
        resolve({ code: 404, message: '内容不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 一键确认小红书内容
 */
export function confirmXiaohongshuContents(ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      ids.forEach(id => {
        const content = mockXiaohongshuContents.find(item => item.id === id)
        if (content) {
          content.isConfirmed = true
        }
      })
      resolve({ code: 0, message: '一键确认成功', data: { success: ids.length } })
    }, MOCK_DELAY)
  })
}

/**
 * 导出小红书内容
 */
export function exportXiaohongshuContents(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: '导出成功', data: { url: '/exports/xiaohongshu_contents.xlsx' } })
    }, MOCK_DELAY)
  })
}

// ==================== 统计数据 API ====================

/**
 * 获取内容统计数据
 */
export function getContentStats(platform, timeRange = 'all') {
  return new Promise((resolve) => {
    setTimeout(() => {
      const platformKey = platform === 'xiaohongshu' ? 'xiaohongshu' : 'douyin'
      let stats = { ...mockStatsData[platformKey] }

      // 时间范围筛选影响统计数据
      if (timeRange && timeRange !== 'all') {
        const multiplier = {
          'yesterday': 0.02,
          'today': 0.01,
          'last7days': 0.15,
          'last30days': 0.5
        }
        const factor = multiplier[timeRange] || 1
        stats.viewCount = Math.floor(stats.viewCount * factor)
        stats.likeCount = Math.floor(stats.likeCount * factor)
        stats.commentCount = Math.floor(stats.commentCount * factor)
        stats.collectCount = Math.floor(stats.collectCount * factor)
      }

      resolve({
        code: 0,
        message: 'success',
        data: {
          total: stats.total,
          viewCount: stats.viewCount,
          likeCount: stats.likeCount,
          commentCount: stats.commentCount,
          collectCount: stats.collectCount,
          viewCountStr: formatNumber(stats.viewCount),
          likeCountStr: formatNumber(stats.likeCount),
          commentCountStr: formatNumber(stats.commentCount),
          collectCountStr: formatNumber(stats.collectCount)
        }
      })
    }, MOCK_DELAY)
  })
}

// ==================== 辅助选项 API ====================

/**
 * 获取关联计划选项
 */
export function getPlanOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          { id: 'p001', name: '夏季美妆推广计划' },
          { id: 'p002', name: '数码产品测评计划' },
          { id: 'p003', name: '美食探店计划' },
          { id: 'p004', name: '护肤品牌推广' },
          { id: 'p005', name: '儿童节活动' },
          { id: 'p006', name: '春季穿搭季' },
          { id: 'p007', name: '家居好物推荐' }
        ]
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取内容标签选项
 */
export function getTagOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: ['美妆', '教程', '科技', '测评', '美食', '探店', '时尚', '穿搭', '护肤', '家居', '好物', '母婴', '玩具', '收纳', '轻食']
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取SPU选项
 */
export function getSpuOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          { id: 'spu001', title: '清透防晒霜' },
          { id: 'spu002', title: '蓝牙运动耳机' },
          { id: 'spu003', title: '进口零食大礼包' },
          { id: 'spu004', title: '氨基酸洗面奶' },
          { id: 'spu005', title: '益智积木套装' },
          { id: 'spu006', title: '智能手环' },
          { id: 'spu007', title: '健康轻食套餐' },
          { id: 'spu008', title: '春季新款女装' },
          { id: 'spu009', title: '敏感肌修护精华' },
          { id: 'spu010', title: '墙上置物架' }
        ]
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取部门选项
 */
export function getDepartmentOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          { id: 'd001', name: '市场部' },
          { id: 'd002', name: '运营部' },
          { id: 'd003', name: '销售部' }
        ]
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取媒介选项
 */
export function getMediumOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          { id: 'm001', name: '李媒介' },
          { id: 'm002', name: '张媒介' },
          { id: 'm003', name: '王媒介' }
        ]
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取状态选项
 */
export function getStatusOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          { value: 'normal', label: '正常' },
          { value: 'abnormal', label: '异常' },
          { value: 'deleted', label: '已删除' }
        ]
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取发布形式选项
 */
export function getPublishFormOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: ['短视频', '图文', '直播']
      })
    }, MOCK_DELAY)
  })
}

// ==================== 导出所有 API ====================

export default {
  // 抖音内容
  getDouyinContents,
  getDouyinContentDetail,
  updateDouyinContent,
  deleteDouyinContent,
  archiveDouyinContent,
  confirmDouyinContents,
  exportDouyinContents,
  // 小红书内容
  getXiaohongshuContents,
  getXiaohongshuContentDetail,
  updateXiaohongshuContent,
  deleteXiaohongshuContent,
  archiveXiaohongshuContent,
  confirmXiaohongshuContents,
  exportXiaohongshuContents,
  // 统计
  getContentStats,
  // 辅助选项
  getPlanOptions,
  getTagOptions,
  getSpuOptions,
  getDepartmentOptions,
  getMediumOptions,
  getStatusOptions,
  getPublishFormOptions
}
```

- [ ] **Step 2: 提交 API 层代码**

```bash
git add dohzodz-saas/src/api/contentManagement.js
git commit -m "feat(content-api): add content management API layer with mock data

- Douyin content APIs: list, detail, update, delete, archive, confirm, export
- Xiaohongshu content APIs: same endpoints
- Stats API: getContentStats
- Helper option APIs: plans, tags, spus, departments, mediums, statuses

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Store 开发

**Files:**
- Create: `dohozz-saas/src/stores/contentManagement.js`

- [ ] **Step 1: 创建 Store 文件**

```javascript
import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import {
  getDouyinContents,
  getXiaohongshuContents,
  getDouyinContentDetail,
  getXiaohongshuContentDetail,
  updateDouyinContent,
  updateXiaohongshuContent,
  deleteDouyinContent,
  deleteXiaohongshuContent,
  archiveDouyinContent,
  archiveXiaohongshuContent,
  confirmDouyinContents,
  confirmXiaohongshuContents,
  exportDouyinContents,
  exportXiaohongshuContents,
  getContentStats,
  getPlanOptions,
  getTagOptions,
  getSpuOptions,
  getDepartmentOptions,
  getMediumOptions,
  getStatusOptions,
  getPublishFormOptions
} from '@/api/contentManagement'

import { ElMessage } from 'element-plus'

export const useContentManagementStore = defineStore('contentManagement', () => {
  // ==================== 平台相关 ====================
  const platformTabs = [
    { key: 'douyin', label: '抖音' },
    { key: 'xiaohongshu', label: '小红书' }
  ]
  const activePlatform = ref('douyin')

  // ==================== 筛选条件 ====================
  const filters = reactive({
    planId: '',
    streamerName: '',
    contentTag: '',
    publishForm: '',
    spuId: '',
    productLink: '',
    departmentId: '',
    mediumId: '',
    contentStatus: '',
    publishTimeStart: '',
    publishTimeEnd: '',
    createTimeStart: '',
    createTimeEnd: ''
  })

  // ==================== 时间范围 ====================
  const timeRangeOptions = [
    { key: 'all', label: '全部' },
    { key: 'yesterday', label: '昨天' },
    { key: 'today', label: '今天' },
    { key: 'last7days', label: '近7天' },
    { key: 'last30days', label: '近30天' }
  ]
  const activeTimeRange = ref('all')

  // ==================== 内容列表 ====================
  const contentList = ref([])
  const contentLoading = ref(false)

  // ==================== 统计数据 ====================
  const stats = reactive({
    total: 0,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    collectCount: 0,
    viewCountStr: '0',
    likeCountStr: '0',
    commentCountStr: '0',
    collectCountStr: '0'
  })

  // ==================== 分页 ====================
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // ==================== 搜索 ====================
  const searchKeyword = ref('')

  // ==================== 辅助选项 ====================
  const planOptions = ref([])
  const tagOptions = ref([])
  const spuOptions = ref([])
  const departmentOptions = ref([])
  const mediumOptions = ref([])
  const statusOptions = ref([])
  const publishFormOptions = ref([])

  // ==================== 容量信息 ====================
  const capacityInfo = reactive({
    used: 4,
    total: 3000
  })

  // ==================== 弹窗状态 ====================
  const isEditDialogVisible = ref(false)
  const isDetailDialogVisible = ref(false)
  const isMoreMenuVisible = ref(false)
  const currentContent = ref(null)
  const currentContentId = ref(null)

  // ==================== 计算属性 ====================
  const hasFilters = computed(() => {
    return Object.values(filters).some(v => v !== '' && v !== null && v !== undefined)
  })

  // ==================== Actions ====================

  // 切换平台
  function setActivePlatform(platform) {
    activePlatform.value = platform
    pagination.page = 1
    fetchContentList()
    fetchStats()
  }

  // 切换时间范围
  function setTimeRange(range) {
    activeTimeRange.value = range
    pagination.page = 1
    fetchContentList()
    fetchStats()
  }

  // 设置搜索关键词
  function setSearchKeyword(keyword) {
    searchKeyword.value = keyword
  }

  // 设置筛选条件
  function setFilter(key, value) {
    filters[key] = value
  }

  // 重置筛选条件
  function resetFilters() {
    Object.keys(filters).forEach(key => {
      filters[key] = ''
    })
    pagination.page = 1
  }

  // 设置分页
  function setPagination(page, pageSize) {
    if (page !== undefined) pagination.page = page
    if (pageSize !== undefined) pagination.pageSize = pageSize
  }

  // 获取内容列表
  async function fetchContentList() {
    contentLoading.value = true
    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchKeyword.value,
        timeRange: activeTimeRange.value,
        ...filters
      }

      let res
      if (activePlatform.value === 'douyin') {
        res = await getDouyinContents(params)
      } else {
        res = await getXiaohongshuContents(params)
      }

      if (res.code === 0) {
        contentList.value = res.data.list
        pagination.total = res.data.pagination.total
      } else {
        ElMessage.error('获取内容列表失败')
      }
    } catch (error) {
      ElMessage.error('获取内容列表失败：' + error.message)
    } finally {
      contentLoading.value = false
    }
  }

  // 获取统计数据
  async function fetchStats() {
    try {
      const res = await getContentStats(activePlatform.value, activeTimeRange.value)
      if (res.code === 0) {
        stats.total = res.data.total
        stats.viewCount = res.data.viewCount
        stats.likeCount = res.data.likeCount
        stats.commentCount = res.data.commentCount
        stats.collectCount = res.data.collectCount
        stats.viewCountStr = res.data.viewCountStr
        stats.likeCountStr = res.data.likeCountStr
        stats.commentCountStr = res.data.commentCountStr
        stats.collectCountStr = res.data.collectCountStr
      }
    } catch (error) {
      console.error('获取统计数据失败：', error)
    }
  }

  // 获取辅助选项
  async function fetchOptions() {
    try {
      const [planRes, tagRes, spuRes, deptRes, mediumRes, statusRes, formRes] = await Promise.all([
        getPlanOptions(),
        getTagOptions(),
        getSpuOptions(),
        getDepartmentOptions(),
        getMediumOptions(),
        getStatusOptions(),
        getPublishFormOptions()
      ])

      if (planRes.code === 0) planOptions.value = planRes.data
      if (tagRes.code === 0) tagOptions.value = tagRes.data
      if (spuRes.code === 0) spuOptions.value = spuRes.data
      if (deptRes.code === 0) departmentOptions.value = deptRes.data
      if (mediumRes.code === 0) mediumOptions.value = mediumRes.data
      if (statusRes.code === 0) statusOptions.value = statusRes.data
      if (formRes.code === 0) publishFormOptions.value = formRes.data
    } catch (error) {
      console.error('获取选项失败：', error)
    }
  }

  // 获取内容详情
  async function fetchContentDetail(id) {
    try {
      let res
      if (activePlatform.value === 'douyin') {
        res = await getDouyinContentDetail(id)
      } else {
        res = await getXiaohongshuContentDetail(id)
      }

      if (res.code === 0) {
        currentContent.value = res.data
        return res.data
      } else {
        ElMessage.error('获取内容详情失败')
        return null
      }
    } catch (error) {
      ElMessage.error('获取内容详情失败：' + error.message)
      return null
    }
  }

  // 更新内容
  async function updateContent(id, data) {
    try {
      let res
      if (activePlatform.value === 'douyin') {
        res = await updateDouyinContent(id, data)
      } else {
        res = await updateXiaohongshuContent(id, data)
      }

      if (res.code === 0) {
        ElMessage.success('编辑成功')
        await fetchContentList()
        return true
      } else {
        ElMessage.error(res.message || '编辑失败')
        return false
      }
    } catch (error) {
      ElMessage.error('编辑失败：' + error.message)
      return false
    }
  }

  // 删除内容
  async function deleteContent(id) {
    try {
      let res
      if (activePlatform.value === 'douyin') {
        res = await deleteDouyinContent(id)
      } else {
        res = await deleteXiaohongshuContent(id)
      }

      if (res.code === 0) {
        ElMessage.success('删除成功')
        await fetchContentList()
        return true
      } else {
        ElMessage.error(res.message || '删除失败')
        return false
      }
    } catch (error) {
      ElMessage.error('删除失败：' + error.message)
      return false
    }
  }

  // 归档内容
  async function archiveContent(id) {
    try {
      let res
      if (activePlatform.value === 'douyin') {
        res = await archiveDouyinContent(id)
      } else {
        res = await archiveXiaohongshuContent(id)
      }

      if (res.code === 0) {
        ElMessage.success('归档成功')
        await fetchContentList()
        return true
      } else {
        ElMessage.error(res.message || '归档失败')
        return false
      }
    } catch (error) {
      ElMessage.error('归档失败：' + error.message)
      return false
    }
  }

  // 一键确认
  async function confirmContents(ids) {
    if (!ids || ids.length === 0) {
      ElMessage.warning('请选择要确认的内容')
      return false
    }

    try {
      let res
      if (activePlatform.value === 'douyin') {
        res = await confirmDouyinContents(ids)
      } else {
        res = await confirmXiaohongshuContents(ids)
      }

      if (res.code === 0) {
        ElMessage.success('一键确认成功')
        await fetchContentList()
        return true
      } else {
        ElMessage.error(res.message || '一键确认失败')
        return false
      }
    } catch (error) {
      ElMessage.error('一键确认失败：' + error.message)
      return false
    }
  }

  // 导出内容
  async function exportContents() {
    try {
      let res
      if (activePlatform.value === 'douyin') {
        res = await exportDouyinContents(filters)
      } else {
        res = await exportXiaohongshuContents(filters)
      }

      if (res.code === 0) {
        ElMessage.success('导出成功')
        return true
      } else {
        ElMessage.error(res.message || '导出失败')
        return false
      }
    } catch (error) {
      ElMessage.error('导出失败：' + error.message)
      return false
    }
  }

  // 打开编辑弹窗
  function openEditDialog(content) {
    currentContent.value = { ...content }
    isEditDialogVisible.value = true
  }

  // 关闭编辑弹窗
  function closeEditDialog() {
    isEditDialogVisible.value = false
    currentContent.value = null
  }

  // 打开详情弹窗
  function openDetailDialog(content) {
    currentContent.value = { ...content }
    isDetailDialogVisible.value = true
  }

  // 关闭详情弹窗
  function closeDetailDialog() {
    isDetailDialogVisible.value = false
    currentContent.value = null
  }

  // 打开更多操作菜单
  function openMoreMenu(contentId) {
    currentContentId.value = contentId
    isMoreMenuVisible.value = true
  }

  // 关闭更多操作菜单
  function closeMoreMenu() {
    isMoreMenuVisible.value = false
    currentContentId.value = null
  }

  // 初始化
  async function init() {
    await fetchOptions()
    await Promise.all([fetchContentList(), fetchStats()])
  }

  return {
    // 平台
    platformTabs,
    activePlatform,
    setActivePlatform,
    // 时间范围
    timeRangeOptions,
    activeTimeRange,
    setTimeRange,
    // 筛选
    filters,
    setFilter,
    resetFilters,
    hasFilters,
    // 搜索
    searchKeyword,
    setSearchKeyword,
    // 列表
    contentList,
    contentLoading,
    fetchContentList,
    // 统计
    stats,
    fetchStats,
    // 分页
    pagination,
    setPagination,
    // 辅助选项
    planOptions,
    tagOptions,
    spuOptions,
    departmentOptions,
    mediumOptions,
    statusOptions,
    publishFormOptions,
    fetchOptions,
    // 容量
    capacityInfo,
    // 详情
    currentContent,
    fetchContentDetail,
    // 编辑
    updateContent,
    openEditDialog,
    closeEditDialog,
    isEditDialogVisible,
    // 详情弹窗
    openDetailDialog,
    closeDetailDialog,
    isDetailDialogVisible,
    // 更多菜单
    openMoreMenu,
    closeMoreMenu,
    isMoreMenuVisible,
    currentContentId,
    // 操作
    deleteContent,
    archiveContent,
    confirmContents,
    exportContents,
    // 初始化
    init
  }
})
```

- [ ] **Step 2: 提交 Store 代码**

```bash
git add dohozj-saas/src/stores/contentManagement.js
git commit -m "feat(content-store): add content management Pinia store

- Platform tabs: douyin/xiaohongshu
- Filters: plan, streamer, tags, spu, department, medium, status, date ranges
- Time range: all/yesterday/today/last7days/last30days
- Stats: total, viewCount, likeCount, commentCount, collectCount
- CRUD actions: update, delete, archive, confirm, export
- Dialog state management

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: ContentPlatformNav.vue 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ContentPlatformNav.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <div class="content-platform-nav">
    <!-- 左侧平台切换 -->
    <div class="platform-tabs">
      <button
        v-for="tab in platformTabs"
        :key="tab.key"
        :class="['platform-tab', { active: activePlatform === tab.key }]"
        @click="handlePlatformChange(tab.key)"
      >
        <span :class="['platform-icon', tab.key]">
          <svg v-if="tab.key === 'douyin'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.33 6.33 0 00-1-.05A6.34 6.34 0 003.15 15.6a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.06a8.16 8.16 0 004.77 1.52V7.38a4.83 4.83 0 01-1-.69z"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.29 4.26a7.76 7.76 0 0110.71-.11 7.76 7.76 0 01-.11 10.71 7.76 7.76 0 01-10.71-.11 7.76 7.76 0 01.11-10.71zM2.5 9.5v5l4-2.5-4-2.5z"/>
          </svg>
        </span>
        <span class="platform-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- 右侧容量信息和按钮 -->
    <div class="nav-right">
      <span class="capacity-info">
        企业已添加内容条数：{{ capacityInfo.used }} / {{ capacityInfo.total }}
      </span>
      <button class="add-btn" @click="handleAddContent">
        去加购
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activePlatform: {
    type: String,
    default: 'douyin'
  },
  platformTabs: {
    type: Array,
    default: () => [
      { key: 'douyin', label: '抖音' },
      { key: 'xiaohongshu', label: '小红书' }
    ]
  },
  capacityInfo: {
    type: Object,
    default: () => ({
      used: 4,
      total: 3000
    })
  }
})

const emit = defineEmits(['platform-change', 'add-content'])

function handlePlatformChange(platform) {
  emit('platform-change', platform)
}

function handleAddContent() {
  emit('add-content')
}
</script>

<style scoped>
.content-platform-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
}

.platform-tabs {
  display: flex;
  gap: 8px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.platform-tab:hover {
  border-color: #FF6600;
}

.platform-tab.active {
  background: #fff;
  border-color: #FF6600;
  border-bottom: 2px solid #FF6600;
}

.platform-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-icon.douyin {
  color: #000;
}

.platform-icon.xiaohongshu {
  color: #FE2C23;
}

.platform-tab.active .platform-icon.douyin {
  color: #000;
}

.platform-tab.active .platform-icon.xiaohongshu {
  color: #FE2C23;
}

.platform-label {
  font-size: 14px;
  color: #1F2937;
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.capacity-info {
  font-size: 14px;
  color: #6B7280;
}

.add-btn {
  padding: 8px 16px;
  background: #FF6600;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #E55A00;
}
</style>
```

- [ ] **Step 2: 提交组件**

```bash
git add dohozj-saas/src/views/components/ContentPlatformNav.vue
git commit -m "feat(content-nav): add ContentPlatformNav component

- Platform tab switcher (douyin/xiaohongshu)
- Capacity info display
- Add content button

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: ContentFilterSection.vue 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ContentFilterSection.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <div class="content-filter-section">
    <div class="filter-grid">
      <!-- 第一行 -->
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">关联计划</label>
          <el-select
            v-model="localFilters.planId"
            placeholder="全部"
            clearable
            class="filter-select"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="plan in planOptions"
              :key="plan.id"
              :label="plan.name"
              :value="plan.id"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">达人昵称</label>
          <el-input
            v-model="localFilters.streamerName"
            placeholder="请输入昵称/抖音号"
            clearable
            class="filter-input"
            @keyup.enter="handleQuery"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">内容标签</label>
          <el-select
            v-model="localFilters.contentTag"
            placeholder="全部"
            clearable
            class="filter-select"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="tag in tagOptions"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">发布形式</label>
          <el-input
            v-model="localFilters.publishForm"
            placeholder="请输入关键词"
            clearable
            class="filter-input"
            @keyup.enter="handleQuery"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">SPU标题</label>
          <el-select
            v-model="localFilters.spuId"
            placeholder="全部"
            clearable
            class="filter-select"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="spu in spuOptions"
              :key="spu.id"
              :label="spu.title"
              :value="spu.id"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">商品链接</label>
          <el-input
            v-model="localFilters.productLink"
            placeholder="请输入商品标题/ID"
            clearable
            class="filter-input"
            @keyup.enter="handleQuery"
          />
        </div>
      </div>

      <!-- 第三行 -->
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">所属部门</label>
          <el-select
            v-model="localFilters.departmentId"
            placeholder="全部"
            clearable
            class="filter-select"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="dept in departmentOptions"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">所属媒介</label>
          <el-select
            v-model="localFilters.mediumId"
            placeholder="全部"
            clearable
            class="filter-select"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="medium in mediumOptions"
              :key="medium.id"
              :label="medium.name"
              :value="medium.id"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">内容状态</label>
          <el-select
            v-model="localFilters.contentStatus"
            placeholder="全部"
            clearable
            class="filter-select"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 第四行：日期范围 -->
      <div class="filter-row date-row">
        <div class="filter-item">
          <label class="filter-label">发布时间</label>
          <el-date-picker
            v-model="publishTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            class="filter-date-picker"
            @change="handlePublishTimeChange"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">创建时间</label>
          <el-date-picker
            v-model="createTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            class="filter-date-picker"
            @change="handleCreateTimeChange"
          />
        </div>

        <div class="filter-item" />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="filter-actions">
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" @click="handleQuery">搜索</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  filterParams: {
    type: Object,
    required: true
  },
  planOptions: {
    type: Array,
    default: () => []
  },
  tagOptions: {
    type: Array,
    default: () => []
  },
  spuOptions: {
    type: Array,
    default: () => []
  },
  departmentOptions: {
    type: Array,
    default: () => []
  },
  mediumOptions: {
    type: Array,
    default: () => []
  },
  statusOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['query', 'reset'])

// 本地筛选条件副本
const localFilters = reactive({
  planId: props.filterParams.planId || '',
  streamerName: props.filterParams.streamerName || '',
  contentTag: props.filterParams.contentTag || '',
  publishForm: props.filterParams.publishForm || '',
  spuId: props.filterParams.spuId || '',
  productLink: props.filterParams.productLink || '',
  departmentId: props.filterParams.departmentId || '',
  mediumId: props.filterParams.mediumId || '',
  contentStatus: props.filterParams.contentStatus || '',
  publishTimeStart: props.filterParams.publishTimeStart || '',
  publishTimeEnd: props.filterParams.publishTimeEnd || '',
  createTimeStart: props.filterParams.createTimeStart || '',
  createTimeEnd: props.filterParams.createTimeEnd || ''
})

// 日期范围
const publishTimeRange = ref([])
const createTimeRange = ref([])

// 监听 props 变化同步到本地
watch(() => props.filterParams, (newVal) => {
  Object.keys(localFilters).forEach(key => {
    localFilters[key] = newVal[key] || ''
  })
  if (newVal.publishTimeStart && newVal.publishTimeEnd) {
    publishTimeRange.value = [newVal.publishTimeStart, newVal.publishTimeEnd]
  }
  if (newVal.createTimeStart && newVal.createTimeEnd) {
    createTimeRange.value = [newVal.createTimeStart, newVal.createTimeEnd]
  }
}, { deep: true })

// 日期变化处理
function handlePublishTimeChange(val) {
  if (val && val.length === 2) {
    localFilters.publishTimeStart = val[0]
    localFilters.publishTimeEnd = val[1]
  } else {
    localFilters.publishTimeStart = ''
    localFilters.publishTimeEnd = ''
  }
}

function handleCreateTimeChange(val) {
  if (val && val.length === 2) {
    localFilters.createTimeStart = val[0]
    localFilters.createTimeEnd = val[1]
  } else {
    localFilters.createTimeStart = ''
    localFilters.createTimeEnd = ''
  }
}

// 搜索
function handleQuery() {
  emit('query', { ...localFilters })
}

// 重置
function handleReset() {
  localFilters.planId = ''
  localFilters.streamerName = ''
  localFilters.contentTag = ''
  localFilters.publishForm = ''
  localFilters.spuId = ''
  localFilters.productLink = ''
  localFilters.departmentId = ''
  localFilters.mediumId = ''
  localFilters.contentStatus = ''
  localFilters.publishTimeStart = ''
  localFilters.publishTimeEnd = ''
  localFilters.createTimeStart = ''
  localFilters.createTimeEnd = ''
  publishTimeRange.value = []
  createTimeRange.value = []
  emit('reset')
}
</script>

<style scoped>
.content-filter-section {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
}

.filter-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  min-width: 70px;
  font-size: 14px;
  color: #6B7280;
}

.filter-select,
.filter-input {
  flex: 1;
}

.filter-select :deep(.el-input__wrapper),
.filter-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #E5E7EB;
}

.filter-select :deep(.el-input__wrapper:hover),
.filter-input :deep(.el-input__wrapper:hover) {
  border-color: #FF6600;
}

.filter-select :deep(.el-input__wrapper.is-focus),
.filter-input :deep(.el-input__wrapper.is-focus) {
  border-color: #FF6600;
  box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.1);
}

.filter-date-picker {
  flex: 1;
}

.filter-date-picker :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #E5E7EB;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.filter-actions :deep(.el-button) {
  border-radius: 8px;
  padding: 8px 20px;
}

.filter-actions :deep(.el-button--primary) {
  background: #FF6600;
  border-color: #FF6600;
}

.filter-actions :deep(.el-button--primary:hover) {
  background: #E55A00;
  border-color: #E55A00;
}
</style>
```

- [ ] **Step 2: 提交组件**

```bash
git add dohozj-saas/src/views/components/ContentFilterSection.vue
git commit -m "feat(content-filter): add ContentFilterSection component

- 3-column grid layout with 11 filter fields
- Date range pickers for publish time and create time
- Query and reset buttons

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: ContentStatsSection.vue 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ContentStatsSection.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <div class="content-stats-section">
    <!-- 时间切换栏 -->
    <div class="stats-header">
      <span class="stats-title">数据概览</span>
      <div class="time-tabs">
        <button
          v-for="tab in timeRangeOptions"
          :key="tab.key"
          :class="['time-tab', { active: activeTimeRange === tab.key }]"
          @click="handleTimeRangeChange(tab.key)"
        >
          {{ tab.label }}
        </button>
        <button class="time-tab" @click="handleMoreClick">更多</button>
        <el-popover
          placement="bottom"
          :width="200"
          trigger="hover"
        >
          <template #reference>
            <el-icon class="help-icon"><QuestionFilled /></el-icon>
          </template>
          <div class="help-content">
            <p>数据概览说明：</p>
            <ul>
              <li>播放量/阅读量：内容被播放或阅读的总次数</li>
              <li>点赞数：内容获得的总点赞数</li>
              <li>评论数：内容获得的总评论数</li>
              <li>收藏数：内容被收藏的总次数</li>
            </ul>
          </div>
        </el-popover>
      </div>
    </div>

    <!-- 数据卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-label">内容总数</div>
        <div class="stat-value">{{ stats.total }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          播放量/阅读量
          <el-popover
            placement="top"
            :width="200"
            trigger="hover"
          >
            <template #reference>
              <el-icon class="stat-help"><QuestionFilled /></el-icon>
            </template>
            <div>内容被播放或阅读的总次数</div>
          </el-popover>
        </div>
        <div class="stat-value">{{ stats.viewCountStr }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">点赞数</div>
        <div class="stat-value">{{ stats.likeCountStr }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">评论数</div>
        <div class="stat-value">{{ stats.commentCountStr }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">收藏数</div>
        <div class="stat-value">{{ stats.collectCountStr }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuestionFilled } from '@element-plus/icons-vue'

defineProps({
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      collectCount: 0,
      viewCountStr: '0',
      likeCountStr: '0',
      commentCountStr: '0',
      collectCountStr: '0'
    })
  },
  timeRangeOptions: {
    type: Array,
    default: () => [
      { key: 'all', label: '全部' },
      { key: 'yesterday', label: '昨天' },
      { key: 'today', label: '今天' },
      { key: 'last7days', label: '近7天' },
      { key: 'last30days', label: '近30天' }
    ]
  },
  activeTimeRange: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['time-range-change', 'more-click'])

function handleTimeRangeChange(range) {
  emit('time-range-change', range)
}

function handleMoreClick() {
  emit('more-click')
}
</script>

<style scoped>
.content-stats-section {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.time-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-tab {
  padding: 6px 12px;
  font-size: 14px;
  color: #6B7280;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.time-tab:hover {
  border-color: #FF6600;
  color: #FF6600;
}

.time-tab.active {
  background: #fff;
  border-color: #FF6600;
  color: #FF6600;
}

.help-icon {
  color: #9CA3AF;
  cursor: pointer;
  margin-left: 8px;
}

.help-icon:hover {
  color: #6B7280;
}

.help-content {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.6;
}

.help-content p {
  margin-bottom: 8px;
  font-weight: 500;
}

.help-content ul {
  margin: 0;
  padding-left: 16px;
}

.help-content li {
  margin-bottom: 4px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.stat-card {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 10px;
}

.stat-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 8px;
}

.stat-help {
  color: #9CA3AF;
  cursor: pointer;
  font-size: 12px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
}
</style>
```

- [ ] **Step 2: 提交组件**

```bash
git add dohozj-saas/src/views/components/ContentStatsSection.vue
git commit -m "feat(content-stats): add ContentStatsSection component

- Time range tabs: all/yesterday/today/last7days/last30days/more
- 5 stat cards: total, viewCount, likeCount, commentCount, collectCount
- Help icons with explanations

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: ContentListSection.vue 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ContentListSection.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <div class="content-list-section">
    <!-- 表格工具栏 -->
    <div class="list-toolbar">
      <el-input
        v-model="localKeyword"
        placeholder="请输入关键词"
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <div class="toolbar-actions">
        <el-button @click="handleConfirm">一键确认</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="contentList"
      v-loading="loading"
      class="content-table"
      row-key="id"
    >
      <!-- 内容列 -->
      <el-table-column label="内容" min-width="280">
        <template #default="{ row }">
          <div class="content-cell">
            <el-image
              :src="row.coverUrl"
              fit="cover"
              class="content-cover"
              :preview-src-list="[row.coverUrl]"
            >
              <template #error>
                <div class="cover-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="content-info">
              <div class="content-title">{{ row.title }}</div>
              <div class="content-time">{{ row.publishTime }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 达人列 -->
      <el-table-column label="达人" min-width="180">
        <template #default="{ row }">
          <div class="streamer-cell">
            <el-avatar :src="row.streamerAvatar" :size="32">
              <template #error>
                <el-icon><User /></el-icon>
              </template>
            </el-avatar>
            <div class="streamer-info">
              <div class="streamer-name">{{ row.streamerName }}</div>
              <div class="streamer-account">
                {{ row.streamerAccount }}
                <el-link :href="getAccountLink(row)" target="_blank" :underline="false">
                  <el-icon class="external-icon"><TopRight /></el-icon>
                </el-link>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 内容标签列 -->
      <el-table-column label="内容标签" min-width="120" align="center">
        <template #default="{ row }">
          <div class="tags-cell">
            <span v-if="row.contentTags && row.contentTags.length > 0" class="tag-list">
              <span v-for="tag in row.contentTags.slice(0, 2)" :key="tag" class="tag">
                {{ tag }}
              </span>
              <span v-if="row.contentTags.length > 2" class="tag-more">+{{ row.contentTags.length - 2 }}</span>
            </span>
            <span v-else class="no-tag">-</span>
          </div>
        </template>
      </el-table-column>

      <!-- 状态列 -->
      <el-table-column label="状态" min-width="100" align="center">
        <template #default="{ row }">
          <span :class="['status-badge', row.contentStatus]">
            <span class="status-dot" />
            {{ row.statusText }}
          </span>
        </template>
      </el-table-column>

      <!-- 关联计划列 -->
      <el-table-column label="关联计划" min-width="100" align="center">
        <template #default="{ row }">
          <div v-if="row.planName" class="link-cell">
            <span class="link-count">{{ row.planId ? 1 : 0 }}</span>
            <el-icon class="link-arrow"><Right /></el-icon>
          </div>
          <span v-else class="no-data">-</span>
        </template>
      </el-table-column>

      <!-- 关联SPU列 -->
      <el-table-column label="关联SPU" min-width="100" align="center">
        <template #default="{ row }">
          <div v-if="row.spuTitle" class="link-cell">
            <span class="link-count">{{ row.spuId ? 1 : 0 }}</span>
            <el-icon class="link-arrow"><Right /></el-icon>
          </div>
          <span v-else class="no-data">-</span>
        </template>
      </el-table-column>

      <!-- 所属媒介列 -->
      <el-table-column label="所属媒介" min-width="140">
        <template #default="{ row }">
          <div v-if="row.mediumName" class="medium-cell">
            <el-avatar :src="row.mediumAvatar" :size="24">
              <template #error>
                <el-icon><User /></el-icon>
              </template>
            </el-avatar>
            <span class="medium-name">{{ row.mediumName }}</span>
          </div>
          <span v-else class="no-data">-</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" min-width="150" fixed="right">
        <template #default="{ row }">
          <div class="action-cell">
            <el-button size="small" @click="handleViewDetail(row)">详情</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-dropdown trigger="click" @command="(cmd) => handleMoreCommand(cmd, row)">
              <el-button size="small">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete">删除内容</el-dropdown-item>
                  <el-dropdown-item command="archive">归档内容</el-dropdown-item>
                  <el-dropdown-item command="export">导出内容</el-dropdown-item>
                  <el-dropdown-item command="copy">复制内容</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <!-- 空状态 -->
      <template #empty>
        <div class="empty-state">
          <el-icon :size="48"><DocumentDelete /></el-icon>
          <p>暂无内容</p>
        </div>
      </template>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search, Picture, User, Right, MoreFilled, TopRight, DocumentDelete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  contentList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      pageSize: 10,
      total: 0
    })
  },
  searchKeyword: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'search',
  'confirm',
  'export',
  'view-detail',
  'edit',
  'delete',
  'archive',
  'copy',
  'page-change',
  'page-size-change'
])

const localKeyword = ref(props.searchKeyword)
const currentPage = ref(props.pagination.page)
const pageSize = ref(props.pagination.pageSize)
const total = ref(props.pagination.total)

watch(() => props.searchKeyword, (val) => {
  localKeyword.value = val
})

watch(() => props.pagination, (val) => {
  currentPage.value = val.page
  pageSize.value = val.pageSize
  total.value = val.total
}, { deep: true })

function handleSearch() {
  emit('search', localKeyword.value)
}

function handleConfirm() {
  emit('confirm')
}

function handleExport() {
  emit('export')
}

function handleViewDetail(row) {
  emit('view-detail', row)
}

function handleEdit(row) {
  emit('edit', row)
}

async function handleMoreCommand(cmd, row) {
  switch (cmd) {
    case 'delete':
      try {
        await ElMessageBox.confirm('确定要删除该内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        emit('delete', row.id)
      } catch {
        // 取消
      }
      break
    case 'archive':
      try {
        await ElMessageBox.confirm('确定要归档该内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        emit('archive', row.id)
      } catch {
        // 取消
      }
      break
    case 'export':
      emit('export', row)
      break
    case 'copy':
      await navigator.clipboard.writeText(JSON.stringify(row))
      ElMessage.success('复制成功')
      emit('copy', row)
      break
  }
}

function handlePageChange(page) {
  emit('page-change', page)
}

function handleSizeChange(size) {
  emit('page-size-change', size)
}

function getAccountLink(row) {
  if (row.platform === 'douyin') {
    return `https://www.douyin.com/user/${row.streamerAccount}`
  }
  return `https://www.xiaohongshu.com/user/profile/${row.streamerId}`
}
</script>

<style scoped>
.content-list-section {
  background: #fff;
}

.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.search-input {
  width: 280px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #E5E7EB;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.toolbar-actions :deep(.el-button) {
  border-radius: 8px;
}

.content-table {
  width: 100%;
}

.content-table :deep(.el-table__header th) {
  background: #f5f7fa;
  color: #6B7280;
  font-weight: 500;
  font-size: 14px;
}

.content-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.cover-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
  color: #9CA3AF;
}

.content-info {
  flex: 1;
  min-width: 0;
}

.content-title {
  font-size: 14px;
  color: #1F2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-time {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
}

.streamer-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.streamer-info {
  min-width: 0;
}

.streamer-name {
  font-size: 14px;
  color: #1F2937;
}

.streamer-account {
  font-size: 12px;
  color: #9CA3AF;
  display: flex;
  align-items: center;
  gap: 4px;
}

.external-icon {
  font-size: 12px;
}

.tags-cell {
  display: flex;
  justify-content: center;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.tag {
  padding: 2px 8px;
  background: #FFF7ED;
  color: #FF6600;
  border-radius: 4px;
  font-size: 12px;
}

.tag-more {
  font-size: 12px;
  color: #9CA3AF;
}

.no-tag {
  color: #9CA3AF;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: #f5f7fa;
  border-radius: 16px;
  font-size: 12px;
  color: #6B7280;
}

.status-badge.normal .status-dot {
  width: 6px;
  height: 6px;
  background: #3B82F6;
  border-radius: 50%;
}

.status-badge.abnormal .status-dot {
  width: 6px;
  height: 6px;
  background: #EF4444;
  border-radius: 50%;
}

.status-badge.deleted .status-dot {
  width: 6px;
  height: 6px;
  background: #9CA3AF;
  border-radius: 50%;
}

.link-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #FF6600;
  cursor: pointer;
}

.link-count {
  font-size: 14px;
}

.link-arrow {
  font-size: 12px;
}

.no-data {
  color: #9CA3AF;
}

.medium-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.medium-name {
  font-size: 14px;
  color: #1F2937;
}

.action-cell {
  display: flex;
  gap: 8px;
}

.action-cell :deep(.el-button) {
  border-radius: 6px;
  padding: 4px 10px;
}

.action-cell :deep(.el-button--primary) {
  background: #FF6600;
  border-color: #FF6600;
}

.action-cell :deep(.el-button--primary:hover) {
  background: #E55A00;
  border-color: #E55A00;
}

.empty-state {
  padding: 48px 0;
  text-align: center;
  color: #9CA3AF;
}

.empty-state p {
  margin-top: 16px;
  font-size: 14px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #E5E7EB;
}

.pagination-wrapper :deep(.el-pagination) {
  justify-content: flex-end;
}
</style>
```

- [ ] **Step 2: 提交组件**

```bash
git add dohozj-saas/src/views/components/ContentListSection.vue
git commit -m "feat(content-list): add ContentListSection component

- Table with 8 columns: content, streamer, tags, status, plan, SPU, medium, actions
- Search, one-click confirm, export toolbar
- Pagination with 10/20/50/100 per page
- More actions dropdown: delete, archive, export, copy
- Empty state and loading state

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Dialog 组件

**Files:**
- Create: `dohozz-saas/src/views/ContentManagement/dialogs/EditContentDialog.vue`
- Create: `dohozz-saas/src/views/ContentManagement/dialogs/ContentDetailDialog.vue`
- Create: `dohozz-saas/src/views/ContentManagement/dialogs/MoreActionsMenu.vue`

- [ ] **Step 1: 创建 EditContentDialog.vue**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="编辑内容"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="内容标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入内容标题" />
      </el-form-item>

      <el-form-item label="达人昵称" prop="streamerName">
        <el-input v-model="formData.streamerName" placeholder="请输入达人昵称" />
      </el-form-item>

      <el-form-item label="内容标签" prop="contentTags">
        <el-select
          v-model="formData.contentTags"
          multiple
          placeholder="请选择内容标签"
          class="full-width"
        >
          <el-option
            v-for="tag in tagOptions"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发布形式" prop="publishForm">
        <el-select v-model="formData.publishForm" placeholder="请选择发布形式">
          <el-option label="短视频" value="短视频" />
          <el-option label="图文" value="图文" />
          <el-option label="直播" value="直播" />
        </el-select>
      </el-form-item>

      <el-form-item label="关联计划" prop="planId">
        <el-select v-model="formData.planId" placeholder="请选择关联计划">
          <el-option
            v-for="plan in planOptions"
            :key="plan.id"
            :label="plan.name"
            :value="plan.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="关联SPU" prop="spuId">
        <el-select v-model="formData.spuId" placeholder="请选择关联SPU">
          <el-option
            v-for="spu in spuOptions"
            :key="spu.id"
            :label="spu.title"
            :value="spu.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属部门" prop="departmentId">
        <el-select v-model="formData.departmentId" placeholder="请选择所属部门">
          <el-option
            v-for="dept in departmentOptions"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属媒介" prop="mediumId">
        <el-select v-model="formData.mediumId" placeholder="请选择所属媒介">
          <el-option
            v-for="medium in mediumOptions"
            :key="medium.id"
            :label="medium.name"
            :value="medium.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  content: {
    type: Object,
    default: null
  },
  planOptions: {
    type: Array,
    default: () => []
  },
  tagOptions: {
    type: Array,
    default: () => []
  },
  spuOptions: {
    type: Array,
    default: () => []
  },
  departmentOptions: {
    type: Array,
    default: () => []
  },
  mediumOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)
const loading = ref(false)
const formRef = ref(null)

const formData = reactive({
  title: '',
  streamerName: '',
  contentTags: [],
  publishForm: '',
  planId: '',
  spuId: '',
  departmentId: '',
  mediumId: '',
  remark: ''
})

const formRules = {
  title: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
  streamerName: [{ required: true, message: '请输入达人昵称', trigger: 'blur' }],
  contentTags: [{ required: true, message: '请选择内容标签', trigger: 'change' }],
  publishForm: [{ required: true, message: '请选择发布形式', trigger: 'change' }],
  planId: [{ required: true, message: '请选择关联计划', trigger: 'change' }],
  spuId: [{ required: true, message: '请选择关联SPU', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  mediumId: [{ required: true, message: '请选择所属媒介', trigger: 'change' }]
}

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(() => props.content, (val) => {
  if (val) {
    formData.title = val.title || ''
    formData.streamerName = val.streamerName || ''
    formData.contentTags = val.contentTags || []
    formData.publishForm = val.publishForm || ''
    formData.planId = val.planId || ''
    formData.spuId = val.spuId || ''
    formData.departmentId = val.departmentId || ''
    formData.mediumId = val.mediumId || ''
    formData.remark = val.remark || ''
  }
}, { immediate: true })

function handleClose() {
  visible.value = false
  emit('update:modelValue', false)
  formRef.value?.resetFields()
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    loading.value = true
    emit('confirm', { ...formData })
  } catch (error) {
    // 验证失败
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 16px 20px;
  border-top: 1px solid #E5E7EB;
}

:deep(.el-form-item__label) {
  color: #6B7280;
}

:deep(.el-button--primary) {
  background: #FF6600;
  border-color: #FF6600;
}

:deep(.el-button--primary:hover) {
  background: #E55A00;
  border-color: #E55A00;
}
</style>
```

- [ ] **Step 2: 创建 ContentDetailDialog.vue**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="内容详情"
    width="640px"
    @close="handleClose"
  >
    <div v-if="content" class="detail-content">
      <!-- 内容预览 -->
      <div class="preview-section">
        <el-image
          :src="content.coverUrl"
          fit="cover"
          class="preview-image"
          :preview-src-list="[content.coverUrl]"
        />
      </div>

      <!-- 基本信息 -->
      <div class="info-grid">
        <div class="info-item">
          <label>内容ID</label>
          <span>{{ content.id }}</span>
        </div>
        <div class="info-item">
          <label>内容标题</label>
          <span>{{ content.title }}</span>
        </div>
        <div class="info-item">
          <label>达人信息</label>
          <div class="streamer-info">
            <el-avatar :src="content.streamerAvatar" :size="32" />
            <div>
              <div>{{ content.streamerName }}</div>
              <div class="account">{{ content.streamerAccount }}</div>
            </div>
          </div>
        </div>
        <div class="info-item">
          <label>内容标签</label>
          <span>
            <span v-if="content.contentTags && content.contentTags.length" class="tag-list">
              <span v-for="tag in content.contentTags" :key="tag" class="tag">{{ tag }}</span>
            </span>
            <span v-else>-</span>
          </span>
        </div>
        <div class="info-item">
          <label>发布形式</label>
          <span>{{ content.publishForm || '-' }}</span>
        </div>
        <div class="info-item">
          <label>关联计划</label>
          <span>{{ content.planName || '-' }}</span>
        </div>
        <div class="info-item">
          <label>关联SPU</label>
          <span>{{ content.spuTitle || '-' }}</span>
        </div>
        <div class="info-item">
          <label>所属部门</label>
          <span>{{ content.departmentName || '-' }}</span>
        </div>
        <div class="info-item">
          <label>所属媒介</label>
          <div v-if="content.mediumName" class="medium-info">
            <el-avatar :src="content.mediumAvatar" :size="24" />
            <span>{{ content.mediumName }}</span>
          </div>
          <span v-else>-</span>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="stats-section">
        <h4>数据统计</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <label>播放量/阅读量</label>
            <span>{{ formatNumber(content.viewCount) }}</span>
          </div>
          <div class="stat-item">
            <label>点赞数</label>
            <span>{{ formatNumber(content.likeCount) }}</span>
          </div>
          <div class="stat-item">
            <label>评论数</label>
            <span>{{ formatNumber(content.commentCount) }}</span>
          </div>
          <div class="stat-item">
            <label>收藏数</label>
            <span>{{ formatNumber(content.collectCount) }}</span>
          </div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="time-section">
        <div class="info-item">
          <label>发布时间</label>
          <span>{{ content.publishTime }}</span>
        </div>
        <div class="info-item">
          <label>创建时间</label>
          <span>{{ content.createTime }}</span>
        </div>
      </div>

      <!-- 备注 -->
      <div v-if="content.remark" class="remark-section">
        <label>备注</label>
        <p>{{ content.remark }}</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  content: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

function handleClose() {
  visible.value = false
  emit('update:modelValue', false)
}

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toLocaleString()
}
</script>

<style scoped>
.detail-content {
  max-height: 60vh;
  overflow-y: auto;
}

.preview-section {
  margin-bottom: 20px;
}

.preview-image {
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  object-fit: contain;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 12px;
  color: #9CA3AF;
}

.info-item span {
  font-size: 14px;
  color: #1F2937;
}

.streamer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.streamer-info .account {
  font-size: 12px;
  color: #9CA3AF;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  padding: 2px 8px;
  background: #FFF7ED;
  color: #FF6600;
  border-radius: 4px;
  font-size: 12px;
}

.medium-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stats-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item label {
  font-size: 12px;
  color: #9CA3AF;
}

.stat-item span {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.time-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.remark-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.remark-section label {
  font-size: 12px;
  color: #9CA3AF;
}

.remark-section p {
  margin: 0;
  font-size: 14px;
  color: #1F2937;
  line-height: 1.6;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 16px 20px;
  border-top: 1px solid #E5E7EB;
}
</style>
```

- [ ] **Step 3: 创建 MoreActionsMenu.vue**

```vue
<template>
  <el-dropdown
    :visible="visible"
    trigger="click"
    @visible-change="handleVisibleChange"
  >
    <slot>
      <el-button size="small">
        <el-icon><MoreFilled /></el-icon>
      </el-button>
    </slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleCommand('delete')">
          <el-icon><Delete /></el-icon>
          <span>删除内容</span>
        </el-dropdown-item>
        <el-dropdown-item @click="handleCommand('archive')">
          <el-icon><FolderOpened /></el-icon>
          <span>归档内容</span>
        </el-dropdown-item>
        <el-dropdown-item @click="handleCommand('export')">
          <el-icon><Download /></el-icon>
          <span>导出内容</span>
        </el-dropdown-item>
        <el-dropdown-item @click="handleCommand('copy')">
          <el-icon><CopyDocument /></el-icon>
          <span>复制内容</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref } from 'vue'
import { MoreFilled, Delete, FolderOpened, Download, CopyDocument } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  contentId: {
    type: String,
    required: true
  },
  contentData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['delete', 'archive', 'export', 'copy'])

const visible = ref(false)

function handleVisibleChange(val) {
  visible.value = val
}

async function handleCommand(command) {
  visible.value = false

  switch (command) {
    case 'delete':
      try {
        await ElMessageBox.confirm('确定要删除该内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        emit('delete', props.contentId)
      } catch {
        // 取消
      }
      break
    case 'archive':
      try {
        await ElMessageBox.confirm('确定要归档该内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        emit('archive', props.contentId)
      } catch {
        // 取消
      }
      break
    case 'export':
      emit('export', props.contentData || { id: props.contentId })
      break
    case 'copy':
      if (props.contentData) {
        await navigator.clipboard.writeText(JSON.stringify(props.contentData))
        ElMessage.success('复制成功')
      }
      emit('copy', props.contentData)
      break
  }
}
</script>

<style scoped>
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 14px;
}
</style>
```

- [ ] **Step 4: 提交 Dialog 组件**

```bash
git add dohozj-saas/src/views/ContentManagement/dialogs/
git commit -m "feat(content-dialogs): add content management dialogs

- EditContentDialog.vue: edit form with 9 fields
- ContentDetailDialog.vue: display all content info and stats
- MoreActionsMenu.vue: dropdown with delete/archive/export/copy

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: 主页面 ContentManagement.vue

**Files:**
- Create: `dohozz-saas/src/views/ContentManagement.vue`

- [ ] **Step 1: 创建主页面**

```vue
<template>
  <div class="content-management-page">
    <!-- 平台切换导航 -->
    <ContentPlatformNav
      :active-platform="store.activePlatform"
      :platform-tabs="store.platformTabs"
      :capacity-info="store.capacityInfo"
      @platform-change="handlePlatformChange"
      @add-content="handleAddContent"
    />

    <!-- 筛选操作栏 -->
    <ContentFilterSection
      :filter-params="store.filters"
      :plan-options="store.planOptions"
      :tag-options="store.tagOptions"
      :spu-options="store.spuOptions"
      :department-options="store.departmentOptions"
      :medium-options="store.mediumOptions"
      :status-options="store.statusOptions"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- 数据概览 -->
    <ContentStatsSection
      :stats="store.stats"
      :time-range-options="store.timeRangeOptions"
      :active-time-range="store.activeTimeRange"
      @time-range-change="handleTimeRangeChange"
      @more-click="handleMoreTimeClick"
    />

    <!-- 内容列表 -->
    <ContentListSection
      :content-list="store.contentList"
      :loading="store.contentLoading"
      :pagination="store.pagination"
      :search-keyword="store.searchKeyword"
      @search="handleSearch"
      @confirm="handleConfirm"
      @export="handleExport"
      @view-detail="handleViewDetail"
      @edit="handleEdit"
      @delete="handleDelete"
      @archive="handleArchive"
      @copy="handleCopy"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />

    <!-- 编辑弹窗 -->
    <EditContentDialog
      v-model="store.isEditDialogVisible"
      :content="store.currentContent"
      :plan-options="store.planOptions"
      :tag-options="store.tagOptions"
      :spu-options="store.spuOptions"
      :department-options="store.departmentOptions"
      :medium-options="store.mediumOptions"
      @confirm="handleEditConfirm"
    />

    <!-- 详情弹窗 -->
    <ContentDetailDialog
      v-model="store.isDetailDialogVisible"
      :content="store.currentContent"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useContentManagementStore } from '@/stores/contentManagement'
import ContentPlatformNav from './components/ContentPlatformNav.vue'
import ContentFilterSection from './components/ContentFilterSection.vue'
import ContentStatsSection from './components/ContentStatsSection.vue'
import ContentListSection from './components/ContentListSection.vue'
import EditContentDialog from './ContentManagement/dialogs/EditContentDialog.vue'
import ContentDetailDialog from './ContentManagement/dialogs/ContentDetailDialog.vue'

const store = useContentManagementStore()

onMounted(() => {
  store.init()
})

// 平台切换
function handlePlatformChange(platform) {
  store.setActivePlatform(platform)
}

// 添加内容
function handleAddContent() {
  // TODO: 跳转到加购页面
}

// 筛选查询
function handleQuery(filters) {
  Object.keys(filters).forEach(key => {
    store.setFilter(key, filters[key])
  })
  store.setPagination(1)
  store.fetchContentList()
}

// 重置筛选
function handleReset() {
  store.resetFilters()
  store.fetchContentList()
}

// 时间范围切换
function handleTimeRangeChange(range) {
  store.setTimeRange(range)
}

// 更多时间选项
function handleMoreTimeClick() {
  // TODO: 显示更多时间选择弹窗
}

// 搜索
function handleSearch(keyword) {
  store.setSearchKeyword(keyword)
  store.setPagination(1)
  store.fetchContentList()
}

// 一键确认
function handleConfirm() {
  const unconfirmedIds = store.contentList
    .filter(item => !item.isConfirmed)
    .map(item => item.id)
  store.confirmContents(unconfirmedIds)
}

// 导出
function handleExport() {
  store.exportContents()
}

// 查看详情
function handleViewDetail(content) {
  store.openDetailDialog(content)
}

// 编辑
function handleEdit(content) {
  store.openEditDialog(content)
}

// 编辑确认
async function handleEditConfirm(formData) {
  if (store.currentContent) {
    const success = await store.updateContent(store.currentContent.id, formData)
    if (success) {
      store.closeEditDialog()
    }
  }
}

// 删除
function handleDelete(id) {
  store.deleteContent(id)
}

// 归档
function handleArchive(id) {
  store.archiveContent(id)
}

// 复制
function handleCopy(content) {
  // 复制逻辑已在 ContentListSection 处理
}

// 分页变化
function handlePageChange(page) {
  store.setPagination(page)
  store.fetchContentList()
}

// 每页条数变化
function handlePageSizeChange(size) {
  store.setPagination(1, size)
  store.fetchContentList()
}
</script>

<style scoped>
.content-management-page {
  min-height: 100vh;
  background: #f5f7fa;
}
</style>
```

- [ ] **Step 2: 提交主页面**

```bash
git add dohozj-saas/src/views/ContentManagement.vue
git commit -m "feat(content-page): add ContentManagement main page

- Assemble all components: PlatformNav, FilterSection, StatsSection, ListSection
- Integrate EditContentDialog and ContentDetailDialog
- Connect to contentManagement store

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: 路由配置

**Files:**
- Modify: `dohozz-saas/src/router/index.js`

- [ ] **Step 1: 添加路由配置**

在 router/index.js 中添加内容管理路由：

```javascript
{
  path: '/content-management',
  name: 'ContentManagement',
  component: () => import('@/views/ContentManagement.vue'),
  meta: { requiresAuth: true, title: '内容管理 - DOHOZZ' }
}
```

- [ ] **Step 2: 提交路由配置**

```bash
git add dohozj-saas/src/router/index.js
git commit -m "feat(router): add content management route

- Route: /content-management
- Component: ContentManagement.vue

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: 菜单配置（可选，取决于现有菜单结构）

根据现有项目结构，菜单可能在以下位置配置：
- 侧边栏组件
- 菜单配置文件

请根据实际项目结构添加内容管理的菜单项：
- 路径：内容种草 → 合作内容 → 内容管理
- 路由：/content-management

- [ ] **Step 1: 添加菜单配置**（根据实际项目结构）

- [ ] **Step 2: 提交菜单配置**

---

## 自检清单

完成实现后，请检查以下内容：

### Spec Coverage
- [ ] 平台切换（抖音/小红书）
- [ ] 筛选操作栏（9个筛选条件 + 2个日期范围）
- [ ] 数据概览统计卡片（5个指标）
- [ ] 内容列表表格（8列 + 分页）
- [ ] 编辑内容弹窗（9个表单字段）
- [ ] 内容详情弹窗（完整信息展示）
- [ ] 更多操作菜单（删除、归档、导出、复制）
- [ ] 一键确认功能
- [ ] 导出功能
- [ ] 搜索功能

### Placeholder Scan
- [ ] 无 "TBD"、"TODO" 标记
- [ ] 所有函数和 API 调用都有完整实现
- [ ] 无 "类似..." 或 "参考..." 的模糊引用

### Type Consistency
- [ ] API 函数命名一致（getDouyin* / getXiaohongshu*）
- [ ] Store 方法命名一致
- [ ] Props 和 Events 命名一致

---

## 执行选项

**Plan complete and saved to `docs/superpowers/plans/2026-04-28-content-management-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**

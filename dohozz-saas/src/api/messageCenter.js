// dohozz-saas/src/api/messageCenter.js

// 通知消息分类配置
export const EXCEPTION_TABS = [
  { key: 'all', label: '全部' },
  { key: 'logistics_exception', label: '寄样物流异常' },
  { key: 'sign_timeout', label: '签收超时未交付' },
  { key: 'coop_timeout', label: '合作单超时未交付' },
  { key: 'will_release', label: '达人即将释放公海' }
]

export const REMINDER_TABS = [
  { key: 'all', label: '全部' },
  { key: 'sample_deliver', label: '样品发货' },
  { key: 'sample_sign', label: '样品签收' },
  { key: 'sample_review', label: '样品审核' },
  { key: 'coop_review', label: '合作单审核' },
  { key: 'live_start', label: '直播开播' },
  { key: 'video_publish', label: '视频发布' },
  { key: 'influencer_assign', label: '达人分配' },
  { key: 'influencer_transfer', label: '达人转移' },
  { key: 'influencer_release', label: '达人释放公海' }
]

// 跳转路由映射
export const JUMP_ROUTE_MAP = {
  'influencer_assign': '/my-influencer?filter=assigned',
  'influencer_transfer': '/my-influencer?filter=transferred',
  'influencer_release': '/influencer-public-pool',
  'sample_deliver': '/seeding-sample?filter=delivered',
  'sample_sign': '/seeding-sample?filter=signed',
  'sample_review': '/seeding-sample?filter=review',
  'coop_review': '/cooperation?filter=review',
  'logistics_exception': '/seeding-sample?filter=exception',
  'sign_timeout': '/seeding-sample?filter=sign_timeout',
  'coop_timeout': '/cooperation?filter=overtime',
  'will_release': '/influencer-public-pool?filter=will_release',
  'live_start': '/collaboration-live',
  'video_publish': '/shopping-video'
}

// Mock 通知消息数据
export const mockNotifications = [
  {
    id: 'n001',
    title: '【达人分配】张三、李四、王五等10位抖音达人分配给你了，请及时跟进',
    category: 'reminder',
    subCategory: 'influencer_assign',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 14:00'
  },
  {
    id: 'n002',
    title: '【样品发货】达人「李小龙」购买的样品已发货，请注意查收',
    category: 'reminder',
    subCategory: 'sample_deliver',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 13:30'
  },
  {
    id: 'n003',
    title: '【样品审核】您提交的「春季新品」样品待审核，请准备样品',
    category: 'reminder',
    subCategory: 'sample_review',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 12:00'
  },
  {
    id: 'n004',
    title: '【寄样物流异常】达人「张小泉」收件地址无效，样品退回',
    category: 'exception',
    subCategory: 'logistics_exception',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 11:00'
  },
  {
    id: 'n005',
    title: '【签收超时未交付】达人「王小二」已签收样品15天未提交内容',
    category: 'exception',
    subCategory: 'sign_timeout',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 10:00'
  },
  {
    id: 'n006',
    title: '【合作单超时未交付】合作单「CO202604001」超时30天未交付视频',
    category: 'exception',
    subCategory: 'coop_timeout',
    platform: 'tiktok',
    isRead: true,
    createdAt: '2026-04-27 18:00'
  },
  {
    id: 'n007',
    title: '【达人转移】达人「赵六」从其他BD转移给你，请及时跟进',
    category: 'reminder',
    subCategory: 'influencer_transfer',
    platform: 'tiktok',
    isRead: true,
    createdAt: '2026-04-27 16:00'
  },
  {
    id: 'n008',
    title: '【直播开播】达人「孙七」直播间已开播，正在进行带货直播',
    category: 'reminder',
    subCategory: 'live_start',
    platform: 'tiktok',
    isRead: true,
    createdAt: '2026-04-27 15:00'
  },
  {
    id: 'n009',
    title: '【视频发布】达人「周八」已发布合作视频「春季穿搭」，请审核',
    category: 'reminder',
    subCategory: 'video_publish',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-27 14:00'
  },
  {
    id: 'n010',
    title: '【达人释放公海】达人「吴九」连续30天未跟进，即将释放公海',
    category: 'exception',
    subCategory: 'will_release',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-27 12:00'
  }
]

// Mock 系统公告数据
export const mockAnnouncements = [
  {
    id: 'a001',
    title: '版本升级',
    content: `1、【达人管理】新增达人批量分配功能，支持批量转移达人给其他BD
2、【样品管理】优化样品审核流程，新增自动催发提醒
3、【数据看板】全新上线数据大屏，支持自定义配置指标
4、【消息中心】全新消息中心上线，支持分类筛选和一键已读
5、【合作管理】新增合作单评价功能，支持BD互相评分
6、【业绩管理】优化业绩统计逻辑，支持按时间段自定义查询
7、【系统优化】修复若干已知问题，提升系统稳定性`,
    isRead: false,
    createdAt: '2026-04-28 09:00'
  },
  {
    id: 'a002',
    title: '版本升级',
    content: `1、【达人管理】优化达人列表加载速度，支持虚拟滚动
2、【样品管理】新增样品图片水印功能，防止盗用`,
    isRead: true,
    createdAt: '2026-04-20 09:00'
  }
]

// 工具函数：计算各分类未读数
export function getExceptionBadgeMap(notifications) {
  const map = {}
  EXCEPTION_TABS.forEach(tab => {
    if (tab.key === 'all') {
      map[tab.key] = notifications.filter(n => n.category === 'exception' && !n.isRead).length
    } else {
      map[tab.key] = notifications.filter(n => n.subCategory === tab.key && !n.isRead).length
    }
  })
  return map
}

export function getReminderBadgeMap(notifications) {
  const map = {}
  REMINDER_TABS.forEach(tab => {
    if (tab.key === 'all') {
      map[tab.key] = notifications.filter(n => n.category === 'reminder' && !n.isRead).length
    } else {
      map[tab.key] = notifications.filter(n => n.subCategory === tab.key && !n.isRead).length
    }
  })
  return map
}

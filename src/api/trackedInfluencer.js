/**
 * 追踪达人 API
 * 使用 Mock 数据，真实接口预留
 */

const MOCK_DELAY = 500

// 追踪达人 Mock 数据
const mockTrackedInfluencers = [
  {
    id: 'TI001',
    name: '美妆达人小雅',
    avatar: 'https://i.pravatar.cc/150?img=101',
    platform: 'tiktok',
    followerCount: 1250000,
    followerStr: '125W',
    categories: ['美妆个护', '护肤'],
    lastLiveTime: '2026-04-26 15:30:00',
    trackingStatus: 'monitoring',
    monitoringStartTime: '2026-04-01',
    monitoringEndTime: '2026-04-30',
    remainingDays: 3,
    totalQuota: 10,
    usedQuota: 7,
    remainingQuota: 3,
    currentMonthRecords: 12,
    totalLiveCount: 45
  },
  {
    id: 'TI002',
    name: '科技小王子',
    avatar: 'https://i.pravatar.cc/150?img=102',
    platform: 'tiktok',
    followerCount: 890000,
    followerStr: '89W',
    categories: ['数码科技', '测评'],
    lastLiveTime: '2026-04-25 20:00:00',
    trackingStatus: 'monitoring',
    monitoringStartTime: '2026-04-10',
    monitoringEndTime: '2026-05-10',
    remainingDays: 13,
    totalQuota: 15,
    usedQuota: 5,
    remainingQuota: 10,
    currentMonthRecords: 8,
    totalLiveCount: 32
  },
  {
    id: 'TI003',
    name: '吃货小分队',
    avatar: 'https://i.pravatar.cc/150?img=103',
    platform: 'shopee',
    followerCount: 560000,
    followerStr: '56W',
    categories: ['食品饮料', '探店'],
    lastLiveTime: '2026-04-24 18:45:00',
    trackingStatus: 'paused',
    monitoringStartTime: '2026-03-15',
    monitoringEndTime: '2026-04-15',
    remainingDays: 0,
    totalQuota: 20,
    usedQuota: 20,
    remainingQuota: 0,
    currentMonthRecords: 25,
    totalLiveCount: 78
  },
  {
    id: 'TI004',
    name: '潮流小七',
    avatar: 'https://i.pravatar.cc/150?img=104',
    platform: 'instagram',
    followerCount: 780000,
    followerStr: '78W',
    categories: ['服饰鞋包', '穿搭'],
    lastLiveTime: '2026-04-23 14:20:00',
    trackingStatus: 'monitoring',
    monitoringStartTime: '2026-04-05',
    monitoringEndTime: '2026-05-05',
    remainingDays: 8,
    totalQuota: 12,
    usedQuota: 9,
    remainingQuota: 3,
    currentMonthRecords: 15,
    totalLiveCount: 56
  },
  {
    id: 'TI005',
    name: '生活家小居',
    avatar: 'https://i.pravatar.cc/150?img=106',
    platform: 'lazada',
    followerCount: 420000,
    followerStr: '42W',
    categories: ['家居生活', '收纳'],
    lastLiveTime: '2026-04-22 10:00:00',
    trackingStatus: 'monitoring',
    monitoringStartTime: '2026-04-01',
    monitoringEndTime: '2026-06-01',
    remainingDays: 35,
    totalQuota: 30,
    usedQuota: 8,
    remainingQuota: 22,
    currentMonthRecords: 6,
    totalLiveCount: 28
  }
]

// 监控记录 Mock 数据
const mockMonitoringRecords = [
  {
    id: 'MR001',
    influencerId: 'TI001',
    influencerName: '美妆达人小雅',
    recordTime: '2026-04-26 15:30:00',
    duration: 3600,
    views: 125000,
    likes: 8900,
    comments: 456,
    shares: 234,
    gmv: 45680,
    orderCount: 328,
    hasViolation: false,
    status: 'completed'
  },
  {
    id: 'MR002',
    influencerId: 'TI001',
    influencerName: '美妆达人小雅',
    recordTime: '2026-04-25 14:00:00',
    duration: 4200,
    views: 98000,
    likes: 7200,
    comments: 389,
    shares: 198,
    gmv: 38900,
    orderCount: 276,
    hasViolation: true,
    violationReason: '提及竞品品牌',
    status: 'completed'
  },
  {
    id: 'MR003',
    influencerId: 'TI002',
    influencerName: '科技小王子',
    recordTime: '2026-04-25 20:00:00',
    duration: 5400,
    views: 156000,
    likes: 11200,
    comments: 678,
    shares: 412,
    gmv: 78200,
    orderCount: 445,
    hasViolation: false,
    status: 'completed'
  }
]

// 配额消耗记录 Mock 数据
const mockQuotaRecords = [
  {
    id: 'QR001',
    influencerId: 'TI001',
    influencerName: '美妆达人小雅',
    consumeTime: '2026-04-26 16:00:00',
    quotaUsed: 1,
    reason: '直播录屏',
    status: 'success'
  },
  {
    id: 'QR002',
    influencerId: 'TI001',
    influencerName: '美妆达人小雅',
    consumeTime: '2026-04-25 15:00:00',
    quotaUsed: 1,
    reason: '直播录屏',
    status: 'success'
  },
  {
    id: 'QR003',
    influencerId: 'TI002',
    influencerName: '科技小王子',
    consumeTime: '2026-04-25 21:00:00',
    quotaUsed: 1,
    reason: '直播录屏',
    status: 'success'
  },
  {
    id: 'QR004',
    influencerId: 'TI004',
    influencerName: '潮流小七',
    consumeTime: '2026-04-24 15:00:00',
    quotaUsed: 1,
    reason: '直播录屏',
    status: 'success'
  }
]

/**
 * 获取追踪达人列表
 */
export function getTrackedInfluencers(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, pageSize = 10, keyword = '', status = '', platform = '' } = params

      let filteredList = [...mockTrackedInfluencers]

      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.name.toLowerCase().includes(kw) ||
          item.id.toLowerCase().includes(kw)
        )
      }

      if (status) {
        filteredList = filteredList.filter(item => item.trackingStatus === status)
      }

      if (platform) {
        filteredList = filteredList.filter(item => item.platform === platform)
      }

      const total = filteredList.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 0,
        message: 'success',
        data: {
          list,
          pagination: { page, pageSize, total }
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取追踪达人统计
 */
export function getTrackedStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = mockTrackedInfluencers.length
      const monitoring = mockTrackedInfluencers.filter(i => i.trackingStatus === 'monitoring').length
      const paused = mockTrackedInfluencers.filter(i => i.trackingStatus === 'paused').length
      const totalUsedQuota = mockTrackedInfluencers.reduce((sum, i) => sum + i.usedQuota, 0)
      const totalRemainingQuota = mockTrackedInfluencers.reduce((sum, i) => sum + i.remainingQuota, 0)

      resolve({
        code: 0,
        message: 'success',
        data: {
          totalInfluencers: total,
          monitoringCount: monitoring,
          pausedCount: paused,
          totalUsedQuota,
          totalRemainingQuota,
          totalQuota: totalUsedQuota + totalRemainingQuota,
          totalRecords: mockMonitoringRecords.length
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 添加追踪达人
 */
export function addTrackedInfluencer(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newInfluencer = {
        id: `TI${String(mockTrackedInfluencers.length + 1).padStart(3, '0')}`,
        name: data.name || '新追踪达人',
        avatar: data.avatar || 'https://i.pravatar.cc/150?img=1',
        platform: data.platform || 'tiktok',
        followerCount: data.followerCount || 0,
        followerStr: data.followerStr || '0',
        categories: data.categories || ['未知分类'],
        lastLiveTime: '-',
        trackingStatus: 'monitoring',
        monitoringStartTime: new Date().toISOString().slice(0, 10),
        monitoringEndTime: data.endTime || '',
        remainingDays: data.remainingDays || 30,
        totalQuota: data.totalQuota || 10,
        usedQuota: 0,
        remainingQuota: data.totalQuota || 10,
        currentMonthRecords: 0,
        totalLiveCount: 0
      }

      mockTrackedInfluencers.unshift(newInfluencer)

      resolve({
        code: 0,
        message: '添加成功',
        data: { influencer: newInfluencer }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 更新追踪状态（开启/关闭监控）
 */
export function updateTrackingStatus(id, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const influencer = mockTrackedInfluencers.find(i => i.id === id)
      if (influencer) {
        influencer.trackingStatus = status
      }
      resolve({
        code: 0,
        message: status === 'monitoring' ? '监控已开启' : '监控已关闭',
        data: { id, status }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 延长监控时间
 */
export function extendMonitoringTime(id, days) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const influencer = mockTrackedInfluencers.find(i => i.id === id)
      if (influencer) {
        const currentEnd = new Date(influencer.monitoringEndTime)
        currentEnd.setDate(currentEnd.getDate() + days)
        influencer.monitoringEndTime = currentEnd.toISOString().slice(0, 10)
        influencer.remainingDays += days
        influencer.totalQuota += days
        influencer.remainingQuota += days
      }
      resolve({
        code: 0,
        message: `监控时间已延长${days}天`,
        data: { id, extendedDays: days }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 移除追踪达人
 */
export function removeTrackedInfluencer(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTrackedInfluencers.findIndex(i => i.id === id)
      if (index > -1) {
        mockTrackedInfluencers.splice(index, 1)
      }
      resolve({
        code: 0,
        message: '移除成功',
        data: { id }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取监控记录
 */
export function getMonitoringRecords(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { influencerId = '', page = 1, pageSize = 10 } = params

      let filteredList = [...mockMonitoringRecords]

      if (influencerId) {
        filteredList = filteredList.filter(r => r.influencerId === influencerId)
      }

      const total = filteredList.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 0,
        message: 'success',
        data: {
          list,
          pagination: { page, pageSize, total }
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取配额消耗记录
 */
export function getQuotaRecords(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { influencerId = '', page = 1, pageSize = 10 } = params

      let filteredList = [...mockQuotaRecords]

      if (influencerId) {
        filteredList = filteredList.filter(r => r.influencerId === influencerId)
      }

      const total = filteredList.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 0,
        message: 'success',
        data: {
          list,
          pagination: { page, pageSize, total }
        }
      })
    }, MOCK_DELAY)
  })
}

export default {
  getTrackedInfluencers,
  getTrackedStats,
  addTrackedInfluencer,
  updateTrackingStatus,
  extendMonitoringTime,
  removeTrackedInfluencer,
  getMonitoringRecords,
  getQuotaRecords
}

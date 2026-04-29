/**
 * 带货视频 API
 * 使用 Mock 数据，真实接口预留
 */

import { ElMessage } from 'element-plus'

// Mock 延迟时间
const MOCK_DELAY = 500

// ==================== Mock 数据 ====================

// 视频列表 Mock 数据 (15条)
const mockVideoList = [
  {
    id: 'v001',
    title: '夏日清新妆容教程',
    coverUrl: 'https://picsum.photos/seed/v001/400/300',
    authorName: '美妆达人小雅',
    authorAvatar: 'https://i.pravatar.cc/150?img=101',
    platform: 'tiktok',
    publishTime: '2026-04-26 14:30:00',
    duration: 125,
    views: 125800,
    likes: 8650,
    comments: 423,
    shares: 1200,
    gmv: 45680,
    gmvStr: '45.7K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-26 16:00:00'
  },
  {
    id: 'v002',
    title: '运动耳机深度测评',
    coverUrl: 'https://picsum.photos/seed/v002/400/300',
    authorName: '科技小王子',
    authorAvatar: 'https://i.pravatar.cc/150?img=102',
    platform: 'tiktok',
    publishTime: '2026-04-26 10:15:00',
    duration: 180,
    views: 89200,
    likes: 5200,
    comments: 318,
    shares: 890,
    gmv: 32800,
    gmvStr: '32.8K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-26 12:00:00'
  },
  {
    id: 'v003',
    title: '东南亚美食探店vlog',
    coverUrl: 'https://picsum.photos/seed/v003/400/300',
    authorName: '吃货小分队',
    authorAvatar: 'https://i.pravatar.cc/150?img=103',
    platform: 'tiktok',
    publishTime: '2026-04-25 18:45:00',
    duration: 245,
    views: 156000,
    likes: 11200,
    comments: 680,
    shares: 2100,
    gmv: 78900,
    gmvStr: '78.9K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-25 20:30:00'
  },
  {
    id: 'v004',
    title: '时尚穿搭指南',
    coverUrl: 'https://picsum.photos/seed/v004/400/300',
    authorName: '潮流小七',
    authorAvatar: 'https://i.pravatar.cc/150?img=104',
    platform: 'tiktok',
    publishTime: '2026-04-25 09:00:00',
    duration: 95,
    views: 67800,
    likes: 4300,
    comments: 215,
    shares: 720,
    gmv: 23400,
    gmvStr: '23.4K',
    status: 'paused',
    statusText: '已暂停',
    syncStatus: 'synced',
    syncTime: '2026-04-25 11:00:00'
  },
  {
    id: 'v005',
    title: '护肤routine大公开',
    coverUrl: 'https://picsum.photos/seed/v005/400/300',
    authorName: '护肤小能手',
    authorAvatar: 'https://i.pravatar.cc/150?img=105',
    platform: 'tiktok',
    publishTime: '2026-04-24 16:20:00',
    duration: 150,
    views: 198000,
    likes: 15800,
    comments: 920,
    shares: 3200,
    gmv: 125600,
    gmvStr: '125.6K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-24 18:00:00'
  },
  {
    id: 'v006',
    title: '家居好物推荐清单',
    coverUrl: 'https://picsum.photos/seed/v006/400/300',
    authorName: '生活家小居',
    authorAvatar: 'https://i.pravatar.cc/150?img=106',
    platform: 'tiktok',
    publishTime: '2026-04-24 11:30:00',
    duration: 200,
    views: 45600,
    likes: 2800,
    comments: 156,
    shares: 480,
    gmv: 18900,
    gmvStr: '18.9K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'pending',
    syncTime: null
  },
  {
    id: 'v007',
    title: '儿童益智玩具开箱',
    coverUrl: 'https://picsum.photos/seed/v007/400/300',
    authorName: '宝贝成长记',
    authorAvatar: 'https://i.pravatar.cc/150?img=107',
    platform: 'tiktok',
    publishTime: '2026-04-23 15:00:00',
    duration: 180,
    views: 78600,
    likes: 5600,
    comments: 320,
    shares: 890,
    gmv: 34200,
    gmvStr: '34.2K',
    status: 'paused',
    statusText: '已暂停',
    syncStatus: 'synced',
    syncTime: '2026-04-23 17:00:00'
  },
  {
    id: 'v008',
    title: '数码产品横向对比',
    coverUrl: 'https://picsum.photos/seed/v008/400/300',
    authorName: '科技小王子',
    authorAvatar: 'https://i.pravatar.cc/150?img=102',
    platform: 'tiktok',
    publishTime: '2026-04-23 08:45:00',
    duration: 320,
    views: 112000,
    likes: 7800,
    comments: 540,
    shares: 1500,
    gmv: 56700,
    gmvStr: '56.7K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-23 10:30:00'
  },
  {
    id: 'v009',
    title: '周末轻食料理',
    coverUrl: 'https://picsum.photos/seed/v009/400/300',
    authorName: '吃货小分队',
    authorAvatar: 'https://i.pravatar.cc/150?img=103',
    platform: 'tiktok',
    publishTime: '2026-04-22 19:30:00',
    duration: 165,
    views: 89000,
    likes: 6200,
    comments: 410,
    shares: 1100,
    gmv: 41200,
    gmvStr: '41.2K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-22 21:00:00'
  },
  {
    id: 'v010',
    title: '春季换季穿搭分享',
    coverUrl: 'https://picsum.photos/seed/v010/400/300',
    authorName: '潮流小七',
    authorAvatar: 'https://i.pravatar.cc/150?img=104',
    platform: 'tiktok',
    publishTime: '2026-04-22 12:00:00',
    duration: 110,
    views: 134000,
    likes: 9800,
    comments: 620,
    shares: 1800,
    gmv: 89600,
    gmvStr: '89.6K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-22 14:00:00'
  },
  {
    id: 'v011',
    title: '敏感肌修护全攻略',
    coverUrl: 'https://picsum.photos/seed/v011/400/300',
    authorName: '护肤小能手',
    authorAvatar: 'https://i.pravatar.cc/150?img=105',
    platform: 'tiktok',
    publishTime: '2026-04-21 14:00:00',
    duration: 195,
    views: 168000,
    likes: 13200,
    comments: 780,
    shares: 2400,
    gmv: 108500,
    gmvStr: '108.5K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-21 16:00:00'
  },
  {
    id: 'v012',
    title: '收纳神器大搜罗',
    coverUrl: 'https://picsum.photos/seed/v012/400/300',
    authorName: '生活家小居',
    authorAvatar: 'https://i.pravatar.cc/150?img=106',
    platform: 'tiktok',
    publishTime: '2026-04-21 09:30:00',
    duration: 145,
    views: 56700,
    likes: 3600,
    comments: 198,
    shares: 560,
    gmv: 22300,
    gmvStr: '22.3K',
    status: 'pending',
    statusText: '待投放',
    syncStatus: 'pending',
    syncTime: null
  },
  {
    id: 'v013',
    title: '户外运动装备推荐',
    coverUrl: 'https://picsum.photos/seed/v013/400/300',
    authorName: '运动狂热者',
    authorAvatar: 'https://i.pravatar.cc/150?img=108',
    platform: 'tiktok',
    publishTime: '2026-04-20 16:45:00',
    duration: 210,
    views: 98000,
    likes: 6900,
    comments: 420,
    shares: 1300,
    gmv: 47800,
    gmvStr: '47.8K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-20 18:30:00'
  },
  {
    id: 'v014',
    title: '新手化妆教程',
    coverUrl: 'https://picsum.photos/seed/v014/400/300',
    authorName: '美妆达人小雅',
    authorAvatar: 'https://i.pravatar.cc/150?img=101',
    platform: 'tiktok',
    publishTime: '2026-04-20 11:00:00',
    duration: 280,
    views: 245000,
    likes: 18600,
    comments: 1100,
    shares: 3800,
    gmv: 156700,
    gmvStr: '156.7K',
    status: 'active',
    statusText: '投放中',
    syncStatus: 'synced',
    syncTime: '2026-04-20 13:00:00'
  },
  {
    id: 'v015',
    title: '智能手环深度体验',
    coverUrl: 'https://picsum.photos/seed/v015/400/300',
    authorName: '科技小王子',
    authorAvatar: 'https://i.pravatar.cc/150?img=102',
    platform: 'tiktok',
    publishTime: '2026-04-19 15:30:00',
    duration: 175,
    views: 76000,
    likes: 4800,
    comments: 280,
    shares: 720,
    gmv: 29800,
    gmvStr: '29.8K',
    status: 'paused',
    statusText: '已暂停',
    syncStatus: 'synced',
    syncTime: '2026-04-19 17:00:00'
  }
]

// 分析区统计数据 Mock
const mockStatsData = {
  totalGMV: {
    value: 856700,
    label: '总GMV',
    unit: '₵',
    trend: 12.5,
    trendDirection: 'up'
  },
  totalVideos: {
    value: 156,
    label: '视频总数',
    unit: '个',
    trend: 8.2,
    trendDirection: 'up'
  },
  avgGMV: {
    value: 5491,
    label: '平均GMV',
    unit: '₵',
    trend: -3.1,
    trendDirection: 'down'
  },
  activeVideos: {
    value: 89,
    label: '投放中',
    unit: '个',
    trend: 15.6,
    trendDirection: 'up'
  },
  pausedVideos: {
    value: 45,
    label: '已暂停',
    unit: '个',
    trend: -5.2,
    trendDirection: 'down'
  },
  pendingVideos: {
    value: 22,
    label: '待投放',
    unit: '个',
    trend: 0,
    trendDirection: 'neutral'
  }
}

// ==================== API 方法 ====================

/**
 * 获取视频列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.keyword - 搜索关键词
 * @param {string} params.status - 状态筛选
 * @param {string} params.platform - 平台筛选
 * @param {string} params.dateRange - 日期范围
 */
export function getVideoList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, pageSize = 10, keyword = '', status = '', platform = '' } = params

      let filteredList = [...mockVideoList]

      // 关键词筛选
      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.title.toLowerCase().includes(kw) ||
          item.authorName.toLowerCase().includes(kw)
        )
      }

      // 状态筛选
      if (status) {
        filteredList = filteredList.filter(item => item.status === status)
      }

      // 平台筛选
      if (platform) {
        filteredList = filteredList.filter(item => item.platform === platform)
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
 * 获取分析区统计数据
 */
export function getStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: mockStatsData
      })
    }, MOCK_DELAY)
  })
}

/**
 * 批量投放同步
 * @param {Array<string>} videoIds - 视频ID列表
 */
export function batchSync(videoIds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 更新 mock 数据中的同步状态
      videoIds.forEach(id => {
        const video = mockVideoList.find(v => v.id === id)
        if (video) {
          video.syncStatus = 'synced'
          video.syncTime = new Date().toLocaleString('zh-CN', { hour12: false })
            .replace(/\//g, '-')
            .replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/, (_, y, m, d, h, min, s) =>
              `${y}-${m}-${d} ${h}:${min}:${s}`
            )
        }
      })

      resolve({
        code: 0,
        message: '同步成功',
        data: {
          success: videoIds.length,
          failed: 0,
          videoIds
        }
      })
    }, MOCK_DELAY * 2)
  })
}

/**
 * 手动添加视频
 * @param {Object} videoData - 视频数据
 */
export function manualAddVideo(videoData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newVideo = {
        id: `v${Date.now()}`,
        title: videoData.title || '新添加视频',
        coverUrl: videoData.coverUrl || 'https://picsum.photos/seed/new/400/300',
        authorName: videoData.authorName || '未知作者',
        authorAvatar: videoData.authorAvatar || 'https://i.pravatar.cc/150?img=1',
        platform: videoData.platform || 'tiktok',
        publishTime: videoData.publishTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
        duration: videoData.duration || 0,
        views: videoData.views || 0,
        likes: videoData.likes || 0,
        comments: videoData.comments || 0,
        shares: videoData.shares || 0,
        gmv: videoData.gmv || 0,
        gmvStr: videoData.gmv ? `${(videoData.gmv / 1000).toFixed(1)}K` : '0',
        status: 'pending',
        statusText: '待投放',
        syncStatus: 'pending',
        syncTime: null
      }

      // 添加到 mock 列表头部
      mockVideoList.unshift(newVideo)

      resolve({
        code: 0,
        message: '添加成功',
        data: {
          video: newVideo
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 提取文案
 * @param {string} videoId - 视频ID
 */
export function extractText(videoId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTexts = [
        '这款产品真的超级好用，我已经用了三个月了，效果非常明显。强烈推荐给大家！',
        '作为一个专业的美妆博主，我试用过无数产品，这款绝对是我的最爱。质地轻薄，持久度也很好。',
        '今天给大家分享一款最近发现的宝藏产品，性价比超高，使用感受完全不输大牌。',
        '这个品牌的产品我一直都在用，品质非常有保障。这次的新品更是惊喜满满。',
        '用了这款产品之后，我的皮肤状态明显改善了很多。周围的朋友都被我种草了。'
      ]

      resolve({
        code: 0,
        message: '提取成功',
        data: {
          videoId,
          text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
          extractedAt: new Date().toISOString()
        }
      })
    }, MOCK_DELAY * 1.5)
  })
}

/**
 * AI智能仿写
 * @param {string} videoUrl - 视频链接
 * @param {Object} options - 仿写选项
 * @param {string} options.style - 风格 (formal/casual/playful)
 */
export function aiRewrite(videoUrl, options = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const validStyles = ['formal', 'casual', 'playful']
      const style = validStyles.includes(options.style) ? options.style : 'casual'

      const stylePrefix = {
        formal: '【正式版】',
        casual: '【轻松版】',
        playful: '【趣味版】'
      }

      // 模拟仿写结果
      const rewrittenTexts = [
        `${stylePrefix[style]}这款产品真的非常好用，使用后效果显著，推荐指数五颗星！强烈建议大家尝试一下。`,
        `${stylePrefix[style]}朋友们！我发现了一款超棒的产品，真的是太喜欢了，必须分享给你们！效果立竿见影，谁用谁知道！`,
        `${stylePrefix[style]}咳咳，说正事！这款产品我必须好好夸一夸，真的绝绝子，用完之后直接被圈粉，爱了爱了！`
      ]

      resolve({
        code: 0,
        message: '仿写成功',
        data: {
          original: videoUrl,
          rewritten: rewrittenTexts[style === 'formal' ? 0 : style === 'playful' ? 2 : 1],
          style,
          generatedAt: new Date().toISOString()
        }
      })
    }, MOCK_DELAY * 2)
  })
}

// 导出所有 API
export default {
  getVideoList,
  getStats,
  batchSync,
  manualAddVideo,
  extractText,
  aiRewrite
}
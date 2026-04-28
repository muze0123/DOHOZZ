/**
 * 内容管理 API
 * 使用 Mock 数据，真实接口预留
 */

import { ElMessage } from 'element-plus'

// Mock 延迟时间
const MOCK_DELAY = 500

// ==================== Mock 数据 ====================

// 抖音内容 Mock 数据 (12条)
const mockDouyinContents = [
  {
    id: 'dy001',
    title: '夏季清爽护肤套装测评',
    coverUrl: 'https://picsum.photos/seed/dy001/400/300',
    url: 'https://www.douyin.com/video/dy001',
    streamerId: 's001',
    streamerName: '美妆达人小雅',
    streamerAccount: 'meiyanxiaoya',
    streamerAvatar: 'https://i.pravatar.cc/150?img=101',
    contentTags: ['护肤', '测评', '夏季'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p001',
    planName: '夏季推广计划',
    spuId: 'spu001',
    spuTitle: '清爽护肤套装',
    departmentId: 'd001',
    departmentName: '美妆事业部',
    mediumId: 'm001',
    mediumName: '抖音达人',
    mediumAvatar: 'https://i.pravatar.cc/150?img=101',
    viewCount: 2600000000,
    likeCount: 185000000,
    commentCount: 8900000,
    collectCount: 4500000,
    publishTime: '2026-04-26 14:30:00',
    createTime: '2026-04-26 10:00:00',
    updateTime: '2026-04-26 14:30:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy002',
    title: '运动耳机深度测评分享',
    coverUrl: 'https://picsum.photos/seed/dy002/400/300',
    url: 'https://www.douyin.com/video/dy002',
    streamerId: 's002',
    streamerName: '科技小王子',
    streamerAccount: 'keji_wangzi',
    streamerAvatar: 'https://i.pravatar.cc/150?img=102',
    contentTags: ['数码', '测评', '运动'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p002',
    planName: '数码新品计划',
    spuId: 'spu002',
    spuTitle: '运动蓝牙耳机',
    departmentId: 'd002',
    departmentName: '数码事业部',
    mediumId: 'm002',
    mediumName: '数码博主',
    mediumAvatar: 'https://i.pravatar.cc/150?img=102',
    viewCount: 89200000,
    likeCount: 5200000,
    commentCount: 318000,
    collectCount: 1200000,
    publishTime: '2026-04-26 10:15:00',
    createTime: '2026-04-26 08:00:00',
    updateTime: '2026-04-26 10:15:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy003',
    title: '东南亚美食探店合集',
    coverUrl: 'https://picsum.photos/seed/dy003/400/300',
    url: 'https://www.douyin.com/video/dy003',
    streamerId: 's003',
    streamerName: '吃货小分队',
    streamerAccount: 'chihuo_xiaofendui',
    streamerAvatar: 'https://i.pravatar.cc/150?img=103',
    contentTags: ['美食', '探店', '东南亚'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p003',
    planName: '美食探店计划',
    spuId: 'spu003',
    spuTitle: '东南亚美食套餐',
    departmentId: 'd003',
    departmentName: '食品事业部',
    mediumId: 'm003',
    mediumName: '美食达人',
    mediumAvatar: 'https://i.pravatar.cc/150?img=103',
    viewCount: 156000000,
    likeCount: 11200000,
    commentCount: 680000,
    collectCount: 3200000,
    publishTime: '2026-04-25 18:45:00',
    createTime: '2026-04-25 16:00:00',
    updateTime: '2026-04-25 18:45:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy004',
    title: '春季时尚穿搭指南',
    coverUrl: 'https://picsum.photos/seed/dy004/400/300',
    url: 'https://www.douyin.com/video/dy004',
    streamerId: 's004',
    streamerName: '潮流小七',
    streamerAccount: 'chaoliu_xiaoqi',
    streamerAvatar: 'https://i.pravatar.cc/150?img=104',
    contentTags: ['时尚', '穿搭', '春季'],
    publishForm: '短视频',
    contentStatus: 'abnormal',
    statusText: '异常',
    planId: 'p004',
    planName: '春季时尚计划',
    spuId: 'spu004',
    spuTitle: '时尚春装系列',
    departmentId: 'd004',
    departmentName: '服装事业部',
    mediumId: 'm004',
    mediumName: '时尚博主',
    mediumAvatar: 'https://i.pravatar.cc/150?img=104',
    viewCount: 67800000,
    likeCount: 4300000,
    commentCount: 215000,
    collectCount: 980000,
    publishTime: '2026-04-25 09:00:00',
    createTime: '2026-04-25 07:00:00',
    updateTime: '2026-04-25 09:00:00',
    remark: '数据存在异常波动',
    isConfirmed: false
  },
  {
    id: 'dy005',
    title: '护肤routine大公开',
    coverUrl: 'https://picsum.photos/seed/dy005/400/300',
    url: 'https://www.douyin.com/video/dy005',
    streamerId: 's005',
    streamerName: '护肤小能手',
    streamerAccount: 'hufu_xiaonengshou',
    streamerAvatar: 'https://i.pravatar.cc/150?img=105',
    contentTags: ['护肤', '教程', '日常'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p001',
    planName: '夏季推广计划',
    spuId: 'spu001',
    spuTitle: '清爽护肤套装',
    departmentId: 'd001',
    departmentName: '美妆事业部',
    mediumId: 'm005',
    mediumName: '护肤达人',
    mediumAvatar: 'https://i.pravatar.cc/150?img=105',
    viewCount: 198000000,
    likeCount: 15800000,
    commentCount: 920000,
    collectCount: 4500000,
    publishTime: '2026-04-24 16:20:00',
    createTime: '2026-04-24 14:00:00',
    updateTime: '2026-04-24 16:20:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy006',
    title: '家居好物推荐清单',
    coverUrl: 'https://picsum.photos/seed/dy006/400/300',
    url: 'https://www.douyin.com/video/dy006',
    streamerId: 's006',
    streamerName: '生活家小居',
    streamerAccount: 'shenghuojia_xiaoju',
    streamerAvatar: 'https://i.pravatar.cc/150?img=106',
    contentTags: ['家居', '好物', '推荐'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p005',
    planName: '家居生活计划',
    spuId: 'spu005',
    spuTitle: '家居好物套装',
    departmentId: 'd005',
    departmentName: '家居事业部',
    mediumId: 'm006',
    mediumName: '生活博主',
    mediumAvatar: 'https://i.pravatar.cc/150?img=106',
    viewCount: 45600000,
    likeCount: 2800000,
    commentCount: 156000,
    collectCount: 680000,
    publishTime: '2026-04-24 11:30:00',
    createTime: '2026-04-24 09:00:00',
    updateTime: '2026-04-24 11:30:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy007',
    title: '儿童益智玩具开箱',
    coverUrl: 'https://picsum.photos/seed/dy007/400/300',
    url: 'https://www.douyin.com/video/dy007',
    streamerId: 's007',
    streamerName: '宝贝成长记',
    streamerAccount: 'baobei_chengzhang',
    streamerAvatar: 'https://i.pravatar.cc/150?img=107',
    contentTags: ['玩具', '儿童', '开箱'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p006',
    planName: '母婴用品计划',
    spuId: 'spu006',
    spuTitle: '儿童益智玩具',
    departmentId: 'd006',
    departmentName: '母婴事业部',
    mediumId: 'm007',
    mediumName: '母婴达人',
    mediumAvatar: 'https://i.pravatar.cc/150?img=107',
    viewCount: 78600000,
    likeCount: 5600000,
    commentCount: 320000,
    collectCount: 1200000,
    publishTime: '2026-04-23 15:00:00',
    createTime: '2026-04-23 12:00:00',
    updateTime: '2026-04-23 15:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy008',
    title: '数码产品横向对比',
    coverUrl: 'https://picsum.photos/seed/dy008/400/300',
    url: 'https://www.douyin.com/video/dy008',
    streamerId: 's002',
    streamerName: '科技小王子',
    streamerAccount: 'keji_wangzi',
    streamerAvatar: 'https://i.pravatar.cc/150?img=102',
    contentTags: ['数码', '对比', '测评'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p002',
    planName: '数码新品计划',
    spuId: 'spu002',
    spuTitle: '运动蓝牙耳机',
    departmentId: 'd002',
    departmentName: '数码事业部',
    mediumId: 'm002',
    mediumName: '数码博主',
    mediumAvatar: 'https://i.pravatar.cc/150?img=102',
    viewCount: 112000000,
    likeCount: 7800000,
    commentCount: 540000,
    collectCount: 2100000,
    publishTime: '2026-04-23 08:45:00',
    createTime: '2026-04-23 06:00:00',
    updateTime: '2026-04-23 08:45:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy009',
    title: '周末轻食料理制作',
    coverUrl: 'https://picsum.photos/seed/dy009/400/300',
    url: 'https://www.douyin.com/video/dy009',
    streamerId: 's003',
    streamerName: '吃货小分队',
    streamerAccount: 'chihuo_xiaofendui',
    streamerAvatar: 'https://i.pravatar.cc/150?img=103',
    contentTags: ['美食', '轻食', '教程'],
    publishForm: '短视频',
    contentStatus: 'deleted',
    statusText: '已删除',
    planId: 'p003',
    planName: '美食探店计划',
    spuId: 'spu003',
    spuTitle: '东南亚美食套餐',
    departmentId: 'd003',
    departmentName: '食品事业部',
    mediumId: 'm003',
    mediumName: '美食达人',
    mediumAvatar: 'https://i.pravatar.cc/150?img=103',
    viewCount: 89000000,
    likeCount: 6200000,
    commentCount: 410000,
    collectCount: 1500000,
    publishTime: '2026-04-22 19:30:00',
    createTime: '2026-04-22 17:00:00',
    updateTime: '2026-04-26 10:00:00',
    remark: '内容已下架',
    isConfirmed: false
  },
  {
    id: 'dy010',
    title: '春季换季穿搭分享',
    coverUrl: 'https://picsum.photos/seed/dy010/400/300',
    url: 'https://www.douyin.com/video/dy010',
    streamerId: 's004',
    streamerName: '潮流小七',
    streamerAccount: 'chaoliu_xiaoqi',
    streamerAvatar: 'https://i.pravatar.cc/150?img=104',
    contentTags: ['时尚', '穿搭', '春季'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p004',
    planName: '春季时尚计划',
    spuId: 'spu004',
    spuTitle: '时尚春装系列',
    departmentId: 'd004',
    departmentName: '服装事业部',
    mediumId: 'm004',
    mediumName: '时尚博主',
    mediumAvatar: 'https://i.pravatar.cc/150?img=104',
    viewCount: 134000000,
    likeCount: 9800000,
    commentCount: 620000,
    collectCount: 2800000,
    publishTime: '2026-04-22 12:00:00',
    createTime: '2026-04-22 10:00:00',
    updateTime: '2026-04-22 12:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy011',
    title: '敏感肌修护全攻略',
    coverUrl: 'https://picsum.photos/seed/dy011/400/300',
    url: 'https://www.douyin.com/video/dy011',
    streamerId: 's005',
    streamerName: '护肤小能手',
    streamerAccount: 'hufu_xiaonengshou',
    streamerAvatar: 'https://i.pravatar.cc/150?img=105',
    contentTags: ['护肤', '敏感肌', '教程'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p001',
    planName: '夏季推广计划',
    spuId: 'spu001',
    spuTitle: '清爽护肤套装',
    departmentId: 'd001',
    departmentName: '美妆事业部',
    mediumId: 'm005',
    mediumName: '护肤达人',
    mediumAvatar: 'https://i.pravatar.cc/150?img=105',
    viewCount: 168000000,
    likeCount: 13200000,
    commentCount: 780000,
    collectCount: 3600000,
    publishTime: '2026-04-21 14:00:00',
    createTime: '2026-04-21 12:00:00',
    updateTime: '2026-04-21 14:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'dy012',
    title: '收纳神器大搜罗',
    coverUrl: 'https://picsum.photos/seed/dy012/400/300',
    url: 'https://www.douyin.com/video/dy012',
    streamerId: 's006',
    streamerName: '生活家小居',
    streamerAccount: 'shenghuojia_xiaoju',
    streamerAvatar: 'https://i.pravatar.cc/150?img=106',
    contentTags: ['家居', '收纳', '好物'],
    publishForm: '短视频',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p005',
    planName: '家居生活计划',
    spuId: 'spu005',
    spuTitle: '家居好物套装',
    departmentId: 'd005',
    departmentName: '家居事业部',
    mediumId: 'm006',
    mediumName: '生活博主',
    mediumAvatar: 'https://i.pravatar.cc/150?img=106',
    viewCount: 56700000,
    likeCount: 3600000,
    commentCount: 198000,
    collectCount: 860000,
    publishTime: '2026-04-21 09:30:00',
    createTime: '2026-04-21 07:00:00',
    updateTime: '2026-04-21 09:30:00',
    remark: '',
    isConfirmed: true
  }
]

// 小红书内容 Mock 数据 (3条)
const mockXiaohongshuContents = [
  {
    id: 'xhs001',
    title: '春日妆容灵感分享',
    coverUrl: 'https://picsum.photos/seed/xhs001/400/300',
    url: 'https://www.xiaohongshu.com/discovery/item/xhs001',
    streamerId: 'xs001',
    streamerName: '美妆笔记',
    streamerAccount: 'meiyan_biji',
    streamerAvatar: 'https://i.pravatar.cc/150?img=201',
    contentTags: ['美妆', '妆容', '春日'],
    publishForm: '图文笔记',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p001',
    planName: '夏季推广计划',
    spuId: 'spu001',
    spuTitle: '清爽护肤套装',
    departmentId: 'd001',
    departmentName: '美妆事业部',
    mediumId: 'mx001',
    mediumName: '小红书博主',
    mediumAvatar: 'https://i.pravatar.cc/150?img=201',
    viewCount: 22110900,
    likeCount: 1890000,
    commentCount: 45600,
    collectCount: 892000,
    publishTime: '2026-04-26 11:00:00',
    createTime: '2026-04-26 09:00:00',
    updateTime: '2026-04-26 11:00:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'xhs002',
    title: '极简生活收纳心得',
    coverUrl: 'https://picsum.photos/seed/xhs002/400/300',
    url: 'https://www.xiaohongshu.com/discovery/item/xhs002',
    streamerId: 'xs002',
    streamerName: '生活家小小',
    streamerAccount: 'shenghuojia_xiaoxiao',
    streamerAvatar: 'https://i.pravatar.cc/150?img=202',
    contentTags: ['生活', '收纳', '极简'],
    publishForm: '图文笔记',
    contentStatus: 'normal',
    statusText: '正常',
    planId: 'p005',
    planName: '家居生活计划',
    spuId: 'spu005',
    spuTitle: '家居好物套装',
    departmentId: 'd005',
    departmentName: '家居事业部',
    mediumId: 'mx002',
    mediumName: '小红书达人',
    mediumAvatar: 'https://i.pravatar.cc/150?img=202',
    viewCount: 15800000,
    likeCount: 1200000,
    commentCount: 32000,
    collectCount: 560000,
    publishTime: '2026-04-25 16:30:00',
    createTime: '2026-04-25 14:00:00',
    updateTime: '2026-04-25 16:30:00',
    remark: '',
    isConfirmed: true
  },
  {
    id: 'xhs003',
    title: '职场穿搭教科书',
    coverUrl: 'https://picsum.photos/seed/xhs003/400/300',
    url: 'https://www.xiaohongshu.com/discovery/item/xhs003',
    streamerId: 'xs003',
    streamerName: '时尚笔记',
    streamerAccount: 'shishang_biji',
    streamerAvatar: 'https://i.pravatar.cc/150?img=203',
    contentTags: ['时尚', '职场', '穿搭'],
    publishForm: '图文笔记',
    contentStatus: 'abnormal',
    statusText: '异常',
    planId: 'p004',
    planName: '春季时尚计划',
    spuId: 'spu004',
    spuTitle: '时尚春装系列',
    departmentId: 'd004',
    departmentName: '服装事业部',
    mediumId: 'mx003',
    mediumName: '时尚博主',
    mediumAvatar: 'https://i.pravatar.cc/150?img=203',
    viewCount: 8900000,
    likeCount: 680000,
    commentCount: 18900,
    collectCount: 320000,
    publishTime: '2026-04-24 10:00:00',
    createTime: '2026-04-24 08:00:00',
    updateTime: '2026-04-24 10:00:00',
    remark: '数据存在异常',
    isConfirmed: false
  }
]

// 统计数据 Mock
const mockStatsData = {
  douyin: {
    totalContents: 156,
    totalViews: 8567000000,
    totalLikes: 589000000,
    totalComments: 32100000,
    totalCollects: 16800000,
    activeContents: 89,
    abnormalContents: 12,
    deletedContents: 5
  },
  xiaohongshu: {
    totalContents: 45,
    totalViews: 856000000,
    totalLikes: 68900000,
    totalComments: 1980000,
    totalCollects: 8900000,
    activeContents: 38,
    abnormalContents: 5,
    deletedContents: 2
  }
}

// ==================== 辅助函数 ====================

/**
 * 格式化数字
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(num) {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(0) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toString()
}

/**
 * 获取日期范围
 * @param {string} timeRange - 时间范围类型
 * @returns {Object} 包含 startDate 和 endDate 的对象
 */
export function getDateRange(timeRange) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const rangeMap = {
    all: { startDate: null, endDate: null },
    yesterday: {
      startDate: new Date(today.getTime() - 86400000).toISOString().slice(0, 10),
      endDate: new Date(today.getTime() - 1).toISOString().slice(0, 10)
    },
    today: {
      startDate: today.toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10)
    },
    last7days: {
      startDate: new Date(today.getTime() - 6 * 86400000).toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10)
    },
    last30days: {
      startDate: new Date(today.getTime() - 29 * 86400000).toISOString().slice(0, 10),
      endDate: now.toISOString().slice(0, 10)
    }
  }

  return rangeMap[timeRange] || rangeMap.all
}

// ==================== 抖音内容 API ====================

/**
 * 获取抖音内容列表
 * @param {Object} params - 查询参数
 */
export function getDouyinContents(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        page = 1,
        pageSize = 10,
        keyword = '',
        planId = '',
        streamerName = '',
        contentTag = '',
        publishForm = '',
        spuId = '',
        departmentId = '',
        mediumId = '',
        contentStatus = '',
        publishTimeStart = '',
        publishTimeEnd = '',
        createTimeStart = '',
        createTimeEnd = '',
        timeRange = 'all'
      } = params

      let filteredList = [...mockDouyinContents]

      // 关键词筛选
      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.title.toLowerCase().includes(kw) ||
          item.streamerName.toLowerCase().includes(kw) ||
          item.streamerAccount.toLowerCase().includes(kw)
        )
      }

      // 各字段筛选
      if (planId) filteredList = filteredList.filter(item => item.planId === planId)
      if (streamerName) filteredList = filteredList.filter(item => item.streamerName.includes(streamerName))
      if (contentTag) filteredList = filteredList.filter(item => item.contentTags.includes(contentTag))
      if (publishForm) filteredList = filteredList.filter(item => item.publishForm === publishForm)
      if (spuId) filteredList = filteredList.filter(item => item.spuId === spuId)
      if (departmentId) filteredList = filteredList.filter(item => item.departmentId === departmentId)
      if (mediumId) filteredList = filteredList.filter(item => item.mediumId === mediumId)
      if (contentStatus) filteredList = filteredList.filter(item => item.contentStatus === contentStatus)

      // 时间范围筛选
      if (timeRange && timeRange !== 'all') {
        const { startDate, endDate } = getDateRange(timeRange)
        if (startDate) {
          filteredList = filteredList.filter(item => {
            const publishDate = item.publishTime.slice(0, 10)
            return publishDate >= startDate && publishDate <= endDate
          })
        }
      }

      // 发布时间范围筛选
      if (publishTimeStart) {
        filteredList = filteredList.filter(item => item.publishTime.slice(0, 10) >= publishTimeStart)
      }
      if (publishTimeEnd) {
        filteredList = filteredList.filter(item => item.publishTime.slice(0, 10) <= publishTimeEnd)
      }

      // 创建时间范围筛选
      if (createTimeStart) {
        filteredList = filteredList.filter(item => item.createTime.slice(0, 10) >= createTimeStart)
      }
      if (createTimeEnd) {
        filteredList = filteredList.filter(item => item.createTime.slice(0, 10) <= createTimeEnd)
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
 * @param {string} id - 内容ID
 */
export function getDouyinContentDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = mockDouyinContents.find(item => item.id === id)

      if (content) {
        resolve({
          code: 0,
          message: 'success',
          data: content
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null
        })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 更新抖音内容
 * @param {string} id - 内容ID
 * @param {Object} data - 更新数据
 */
export function updateDouyinContent(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDouyinContents.findIndex(item => item.id === id)

      if (index !== -1) {
        mockDouyinContents[index] = {
          ...mockDouyinContents[index],
          ...data,
          updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
        resolve({
          code: 0,
          message: '更新成功',
          data: mockDouyinContents[index]
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null
        })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 删除抖音内容（软删除）
 * @param {string} id - 内容ID
 */
export function deleteDouyinContent(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDouyinContents.findIndex(item => item.id === id)

      if (index !== -1) {
        mockDouyinContents[index].contentStatus = 'deleted'
        mockDouyinContents[index].statusText = '已删除'
        mockDouyinContents[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

        resolve({
          code: 0,
          message: '删除成功',
          data: null
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null
        })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 归档抖音内容
 * @param {string} id - 内容ID
 */
export function archiveDouyinContent(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDouyinContents.findIndex(item => item.id === id)

      if (index !== -1) {
        mockDouyinContents[index].contentStatus = 'archived'
        mockDouyinContents[index].statusText = '已归档'
        mockDouyinContents[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

        resolve({
          code: 0,
          message: '归档成功',
          data: null
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null
        })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 批量确认抖音内容
 * @param {Array<string>} ids - 内容ID列表
 */
export function confirmDouyinContents(ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      ids.forEach(id => {
        const content = mockDouyinContents.find(item => item.id === id)
        if (content) {
          content.isConfirmed = true
          content.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
      })

      resolve({
        code: 0,
        message: '确认成功',
        data: {
          success: ids.length,
          failed: 0,
          ids
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 导出抖音内容
 * @param {Object} params - 导出参数
 */
export function exportDouyinContents(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '导出任务已创建',
        data: {
          taskId: `export_${Date.now()}`,
          status: 'pending'
        }
      })
    }, MOCK_DELAY)
  })
}

// ==================== 小红书内容 API ====================

/**
 * 获取小红书内容列表
 * @param {Object} params - 查询参数
 */
export function getXiaohongshuContents(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        page = 1,
        pageSize = 10,
        keyword = '',
        planId = '',
        streamerName = '',
        contentTag = '',
        publishForm = '',
        spuId = '',
        departmentId = '',
        mediumId = '',
        contentStatus = '',
        publishTimeStart = '',
        publishTimeEnd = '',
        createTimeStart = '',
        createTimeEnd = '',
        timeRange = 'all'
      } = params

      let filteredList = [...mockXiaohongshuContents]

      // 关键词筛选
      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.title.toLowerCase().includes(kw) ||
          item.streamerName.toLowerCase().includes(kw) ||
          item.streamerAccount.toLowerCase().includes(kw)
        )
      }

      // 各字段筛选
      if (planId) filteredList = filteredList.filter(item => item.planId === planId)
      if (streamerName) filteredList = filteredList.filter(item => item.streamerName.includes(streamerName))
      if (contentTag) filteredList = filteredList.filter(item => item.contentTags.includes(contentTag))
      if (publishForm) filteredList = filteredList.filter(item => item.publishForm === publishForm)
      if (spuId) filteredList = filteredList.filter(item => item.spuId === spuId)
      if (departmentId) filteredList = filteredList.filter(item => item.departmentId === departmentId)
      if (mediumId) filteredList = filteredList.filter(item => item.mediumId === mediumId)
      if (contentStatus) filteredList = filteredList.filter(item => item.contentStatus === contentStatus)

      // 时间范围筛选
      if (timeRange && timeRange !== 'all') {
        const { startDate, endDate } = getDateRange(timeRange)
        if (startDate) {
          filteredList = filteredList.filter(item => {
            const publishDate = item.publishTime.slice(0, 10)
            return publishDate >= startDate && publishDate <= endDate
          })
        }
      }

      // 发布时间范围筛选
      if (publishTimeStart) {
        filteredList = filteredList.filter(item => item.publishTime.slice(0, 10) >= publishTimeStart)
      }
      if (publishTimeEnd) {
        filteredList = filteredList.filter(item => item.publishTime.slice(0, 10) <= publishTimeEnd)
      }

      // 创建时间范围筛选
      if (createTimeStart) {
        filteredList = filteredList.filter(item => item.createTime.slice(0, 10) >= createTimeStart)
      }
      if (createTimeEnd) {
        filteredList = filteredList.filter(item => item.createTime.slice(0, 10) <= createTimeEnd)
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
 * @param {string} id - 内容ID
 */
export function getXiaohongshuContentDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const content = mockXiaohongshuContents.find(item => item.id === id)

      if (content) {
        resolve({
          code: 0,
          message: 'success',
          data: content
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null
        })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 更新小红书内容
 * @param {string} id - 内容ID
 * @param {Object} data - 更新数据
 */
export function updateXiaohongshuContent(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockXiaohongshuContents.findIndex(item => item.id === id)

      if (index !== -1) {
        mockXiaohongshuContents[index] = {
          ...mockXiaohongshuContents[index],
          ...data,
          updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
        resolve({
          code: 0,
          message: '更新成功',
          data: mockXiaohongshuContents[index]
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null
        })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 删除小红书内容（软删除）
 * @param {string} id - 内容ID
 */
export function deleteXiaohongshuContent(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockXiaohongshuContents.findIndex(item => item.id === id)

      if (index !== -1) {
        mockXiaohongshuContents[index].contentStatus = 'deleted'
        mockXiaohongshuContents[index].statusText = '已删除'
        mockXiaohongshuContents[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

        resolve({
          code: 0,
          message: '删除成功',
          data: null
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null
        })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 归档小红书内容
 * @param {string} id - 内容ID
 */
export function archiveXiaohongshuContent(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockXiaohongshuContents.findIndex(item => item.id === id)

      if (index !== -1) {
        mockXiaohongshuContents[index].contentStatus = 'archived'
        mockXiaohongshuContents[index].statusText = '已归档'
        mockXiaohongshuContents[index].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

        resolve({
          code: 0,
          message: '归档成功',
          data: null
        })
      } else {
        resolve({
          code: 404,
          message: '内容不存在',
          data: null
        })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 批量确认小红书内容
 * @param {Array<string>} ids - 内容ID列表
 */
export function confirmXiaohongshuContents(ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      ids.forEach(id => {
        const content = mockXiaohongshuContents.find(item => item.id === id)
        if (content) {
          content.isConfirmed = true
          content.updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
      })

      resolve({
        code: 0,
        message: '确认成功',
        data: {
          success: ids.length,
          failed: 0,
          ids
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 导出小红书内容
 * @param {Object} params - 导出参数
 */
export function exportXiaohongshuContents(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '导出任务已创建',
        data: {
          taskId: `export_${Date.now()}`,
          status: 'pending'
        }
      })
    }, MOCK_DELAY)
  })
}

// ==================== 统计 API ====================

/**
 * 获取内容统计数据
 * @param {string} platform - 平台 (douyin/xiaohongshu)
 * @param {string} timeRange - 时间范围
 */
export function getContentStats(platform, timeRange = 'all') {
  return new Promise((resolve) => {
    setTimeout(() => {
      const platformData = mockStatsData[platform] || mockStatsData.douyin

      // 时间范围乘数
      const multiplierMap = {
        all: 1,
        yesterday: 1,
        today: 0.1,
        last7days: 0.7,
        last30days: 1
      }
      const multiplier = multiplierMap[timeRange] || 1

      resolve({
        code: 0,
        message: 'success',
        data: {
          ...platformData,
          totalViews: Math.floor(platformData.totalViews * multiplier),
          totalLikes: Math.floor(platformData.totalLikes * multiplier),
          totalComments: Math.floor(platformData.totalComments * multiplier),
          totalCollects: Math.floor(platformData.totalCollects * multiplier)
        }
      })
    }, MOCK_DELAY)
  })
}

// ==================== 辅助选项 API ====================

/**
 * 获取计划选项
 */
export function getPlanOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          { id: 'p001', name: '夏季推广计划' },
          { id: 'p002', name: '数码新品计划' },
          { id: 'p003', name: '美食探店计划' },
          { id: 'p004', name: '春季时尚计划' },
          { id: 'p005', name: '家居生活计划' },
          { id: 'p006', name: '母婴用品计划' }
        ]
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取标签选项
 */
export function getTagOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          '护肤', '测评', '夏季', '数码', '运动', '美食', '探店', '东南亚',
          '时尚', '穿搭', '春季', '教程', '日常', '家居', '好物', '推荐',
          '玩具', '儿童', '开箱', '对比', '轻食', '敏感肌', '收纳', '极简', '职场'
        ]
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取商品选项
 */
export function getSpuOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          { id: 'spu001', title: '清爽护肤套装' },
          { id: 'spu002', title: '运动蓝牙耳机' },
          { id: 'spu003', title: '东南亚美食套餐' },
          { id: 'spu004', title: '时尚春装系列' },
          { id: 'spu005', title: '家居好物套装' },
          { id: 'spu006', title: '儿童益智玩具' }
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
          { id: 'd001', name: '美妆事业部' },
          { id: 'd002', name: '数码事业部' },
          { id: 'd003', name: '食品事业部' },
          { id: 'd004', name: '服装事业部' },
          { id: 'd005', name: '家居事业部' },
          { id: 'd006', name: '母婴事业部' }
        ]
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取媒体选项
 */
export function getMediumOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: [
          { id: 'm001', name: '抖音达人' },
          { id: 'm002', name: '数码博主' },
          { id: 'm003', name: '美食达人' },
          { id: 'm004', name: '时尚博主' },
          { id: 'm005', name: '护肤达人' },
          { id: 'm006', name: '生活博主' },
          { id: 'm007', name: '母婴达人' },
          { id: 'mx001', name: '小红书博主' },
          { id: 'mx002', name: '小红书达人' },
          { id: 'mx003', name: '时尚博主' }
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
        data: ['短视频', '图文笔记', '直播', '图文+视频']
      })
    }, MOCK_DELAY)
  })
}

// ==================== 默认导出 ====================

export default {
  // 辅助函数
  formatNumber,
  getDateRange,

  // 抖音内容 API
  getDouyinContents,
  getDouyinContentDetail,
  updateDouyinContent,
  deleteDouyinContent,
  archiveDouyinContent,
  confirmDouyinContents,
  exportDouyinContents,

  // 小红书内容 API
  getXiaohongshuContents,
  getXiaohongshuContentDetail,
  updateXiaohongshuContent,
  deleteXiaohongshuContent,
  archiveXiaohongshuContent,
  confirmXiaohongshuContents,
  exportXiaohongshuContents,

  // 统计 API
  getContentStats,

  // 辅助选项 API
  getPlanOptions,
  getTagOptions,
  getSpuOptions,
  getDepartmentOptions,
  getMediumOptions,
  getStatusOptions,
  getPublishFormOptions
}

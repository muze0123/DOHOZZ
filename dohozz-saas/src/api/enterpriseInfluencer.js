/**
 * 企业达人库 API
 * 使用 Mock 数据，真实接口预留
 */

// Mock 延迟时间
const MOCK_DELAY = 500

// ==================== Mock 数据 ====================

// 达人列表 Mock 数据
const mockInfluencerList = [
  {
    streamer_id: 'IF001',
    streamer_name: '测试达人A',
    streamer_account: 'douyin123456',
    streamer_avatar: '',
    platform: 'douyin',
    streamer_category: '美妆博主',
    streamer_portrait: '成熟达人',
    follower_portrait: '年轻用户',
    follower_count: 520000,
    follower_level: '50万-100万',
    commerce_category: '美妆',
    commerce_method: '直播带货',
    commerce_reputation: '优秀',
    commerce_level: '高水平',
    avg_live_sales: 85000,
    commerce_price: '100-500元',
    avg_view_count: 125000,
    video_count_30days: 28,
    cooperation_plan_count: 3,
    plan_content_count: 12,
    view_read_count: 3500000,
    all_content_count: 156,
    total_view_count: 19500000,
    contact_info: '13800138001',
    remark: '优质达人',
    is_verified: true,
    cooperation_status: 'cooperated',
    create_time: '2026-03-15 10:30:00',
    update_time: '2026-04-20 14:20:00'
  },
  {
    streamer_id: 'IF002',
    streamer_name: '美妆达人小雅',
    streamer_account: 'xiaohongshu_abc789',
    streamer_avatar: '',
    platform: 'xiaohongshu',
    streamer_category: '美妆博主',
    streamer_portrait: '新锐达人',
    follower_portrait: '都市女性',
    follower_count: 280000,
    follower_level: '10万-50万',
    commerce_category: '美妆',
    commerce_method: '图文种草',
    commerce_reputation: '良好',
    commerce_level: '中等水平',
    avg_live_sales: 32000,
    commerce_price: '50-200元',
    avg_view_count: 58000,
    video_count_30days: 15,
    cooperation_plan_count: 2,
    plan_content_count: 8,
    view_read_count: 1200000,
    all_content_count: 89,
    total_view_count: 8500000,
    contact_info: '13800138002',
    remark: '图文效果优秀',
    is_verified: true,
    cooperation_status: 'cooperated',
    create_time: '2026-03-10 09:15:00',
    update_time: '2026-04-18 11:30:00'
  },
  {
    streamer_id: 'IF003',
    streamer_name: '科技小王子',
    streamer_account: 'douyin_tech888',
    streamer_avatar: '',
    platform: 'douyin',
    streamer_category: '科技数码',
    streamer_portrait: '成熟达人',
    follower_portrait: '数码爱好者',
    follower_count: 1200000,
    follower_level: '100万以上',
    commerce_category: '数码',
    commerce_method: '直播带货',
    commerce_reputation: '优秀',
    commerce_level: '高水平',
    avg_live_sales: 256000,
    commerce_price: '500-2000元',
    avg_view_count: 380000,
    video_count_30days: 42,
    cooperation_plan_count: 5,
    plan_content_count: 18,
    view_read_count: 9800000,
    all_content_count: 312,
    total_view_count: 58000000,
    contact_info: '13800138003',
    remark: '数码类头部达人',
    is_verified: true,
    cooperation_status: 'cooperated',
    create_time: '2026-02-20 14:00:00',
    update_time: '2026-04-22 16:45:00'
  },
  {
    streamer_id: 'IF004',
    streamer_name: '吃货小分队',
    streamer_account: 'xiaohongshu_food123',
    streamer_avatar: '',
    platform: 'xiaohongshu',
    streamer_category: '美食博主',
    streamer_portrait: '新锐达人',
    follower_portrait: '美食爱好者',
    follower_count: 156000,
    follower_level: '10万-50万',
    commerce_category: '美食',
    commerce_method: '视频种草',
    commerce_reputation: '良好',
    commerce_level: '中等水平',
    avg_live_sales: 18000,
    commerce_price: '50-100元',
    avg_view_count: 42000,
    video_count_30days: 22,
    cooperation_plan_count: 1,
    plan_content_count: 5,
    view_read_count: 680000,
    all_content_count: 67,
    total_view_count: 4200000,
    contact_info: '13800138004',
    remark: '美食探店效果不错',
    is_verified: false,
    cooperation_status: 'uncooperated',
    create_time: '2026-04-01 08:30:00',
    update_time: '2026-04-25 10:15:00'
  },
  {
    streamer_id: 'IF005',
    streamer_name: '运动狂热者',
    streamer_account: 'douyin_sport999',
    streamer_avatar: '',
    platform: 'douyin',
    streamer_category: '运动健身',
    streamer_portrait: '成熟达人',
    follower_portrait: '健身人群',
    follower_count: 680000,
    follower_level: '50万-100万',
    commerce_category: '运动户外',
    commerce_method: '直播带货',
    commerce_reputation: '优秀',
    commerce_level: '高水平',
    avg_live_sales: 98000,
    commerce_price: '200-800元',
    avg_view_count: 185000,
    video_count_30days: 35,
    cooperation_plan_count: 4,
    plan_content_count: 14,
    view_read_count: 4500000,
    all_content_count: 198,
    total_view_count: 32000000,
    contact_info: '13800138005',
    remark: '运动类目优质达人',
    is_verified: true,
    cooperation_status: 'cooperated',
    create_time: '2026-03-25 11:00:00',
    update_time: '2026-04-21 15:30:00'
  }
]

// 企业配额 Mock 数据
const mockEnterpriseQuota = {
  used: 815,
  total: 10000
}

// 计划列表 Mock 数据
const mockPlanList = [
  { plan_id: 'PL001', plan_name: '春季美妆推广计划', status: 'active' },
  { plan_id: 'PL002', plan_name: '618大促直播计划', status: 'active' },
  { plan_id: 'PL003', plan_name: '新品上市种草计划', status: 'pending' },
  { plan_id: 'PL004', plan_name: '品牌周年庆活动', status: 'active' },
  { plan_id: 'PL005', plan_name: '618预售专场', status: 'pending' }
]

// ==================== API 方法 ====================

/**
 * 获取达人列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.platform - 平台筛选 (douyin/xiaohongshu)
 * @param {string} params.cooperation_status - 合作状态 (cooperated/uncooperated)
 * @param {string} params.streamer_category - 达人分类
 * @param {string} params.streamer_portrait - 达人画像
 * @param {string} params.follower_portrait - 粉丝画像
 * @param {string} params.follower_level - 粉丝量级
 * @param {string} params.commerce_category - 带货类目
 * @param {string} params.commerce_method - 带货方式
 * @param {string} params.commerce_reputation - 口碑评级
 * @param {string} params.commerce_level - 带货等级
 * @param {number} params.avg_live_sales - 平均带货金额
 * @param {string} params.commerce_price - 商品价格带
 * @param {string} params.contact_info - 联系方式
 * @param {string} params.keyword - 关键词搜索
 */
export function getInfluencerList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        page = 1,
        pageSize = 10,
        platform = '',
        cooperation_status = '',
        streamer_category = '',
        streamer_portrait = '',
        follower_portrait = '',
        follower_level = '',
        commerce_category = '',
        commerce_method = '',
        commerce_reputation = '',
        commerce_level = '',
        avg_live_sales = '',
        commerce_price = '',
        contact_info = '',
        keyword = ''
      } = params

      let filteredList = [...mockInfluencerList]

      // 平台筛选
      if (platform) {
        filteredList = filteredList.filter(item => item.platform === platform)
      }

      // 合作状态筛选
      if (cooperation_status) {
        filteredList = filteredList.filter(item => item.cooperation_status === cooperation_status)
      }

      // 达人分类筛选
      if (streamer_category) {
        filteredList = filteredList.filter(item => item.streamer_category === streamer_category)
      }

      // 达人画像筛选
      if (streamer_portrait) {
        filteredList = filteredList.filter(item => item.streamer_portrait === streamer_portrait)
      }

      // 粉丝画像筛选
      if (follower_portrait) {
        filteredList = filteredList.filter(item => item.follower_portrait === follower_portrait)
      }

      // 粉丝量级筛选
      if (follower_level) {
        filteredList = filteredList.filter(item => item.follower_level === follower_level)
      }

      // 带货类目筛选
      if (commerce_category) {
        filteredList = filteredList.filter(item => item.commerce_category === commerce_category)
      }

      // 带货方式筛选
      if (commerce_method) {
        filteredList = filteredList.filter(item => item.commerce_method === commerce_method)
      }

      // 口碑评级筛选
      if (commerce_reputation) {
        filteredList = filteredList.filter(item => item.commerce_reputation === commerce_reputation)
      }

      // 带货等级筛选
      if (commerce_level) {
        filteredList = filteredList.filter(item => item.commerce_level === commerce_level)
      }

      // 平均带货金额筛选
      if (avg_live_sales) {
        filteredList = filteredList.filter(item => item.avg_live_sales >= Number(avg_live_sales))
      }

      // 商品价格带筛选
      if (commerce_price) {
        filteredList = filteredList.filter(item => item.commerce_price === commerce_price)
      }

      // 联系方式筛选
      if (contact_info) {
        filteredList = filteredList.filter(item => item.contact_info.includes(contact_info))
      }

      // 关键词搜索
      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.streamer_name.toLowerCase().includes(kw) ||
          item.streamer_account.toLowerCase().includes(kw) ||
          item.remark.toLowerCase().includes(kw)
        )
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
 * 获取企业配额信息
 */
export function getEnterpriseQuota() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: mockEnterpriseQuota
      })
    }, MOCK_DELAY)
  })
}

/**
 * 添加达人
 * @param {Object} data - 达人数据
 */
export function addInfluencer(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查是否已存在相同平台和账号的达人
      const exists = mockInfluencerList.find(
        item => item.platform === data.platform && item.streamer_account === data.streamer_account
      )

      if (exists) {
        reject({
          code: 1,
          message: '该平台账号已存在',
          data: null
        })
        return
      }

      const now = new Date().toLocaleString('zh-CN', { hour12: false })
        .replace(/\//g, '-')
        .replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/, (_, y, m, d, h, min, s) =>
          `${y}-${m}-${d} ${h}:${min}:${s}`
        )

      const newInfluencer = {
        streamer_id: `IF${String(mockInfluencerList.length + 1).padStart(3, '0')}`,
        streamer_name: data.streamer_name || '新达人',
        streamer_account: data.streamer_account || '',
        streamer_avatar: data.streamer_avatar || '',
        platform: data.platform || 'douyin',
        streamer_category: data.streamer_category || '',
        streamer_portrait: data.streamer_portrait || '',
        follower_portrait: data.follower_portrait || '',
        follower_count: data.follower_count || 0,
        follower_level: data.follower_level || '未知',
        commerce_category: data.commerce_category || '',
        commerce_method: data.commerce_method || '',
        commerce_reputation: data.commerce_reputation || '良好',
        commerce_level: data.commerce_level || '中等水平',
        avg_live_sales: data.avg_live_sales || 0,
        commerce_price: data.commerce_price || '',
        avg_view_count: data.avg_view_count || 0,
        video_count_30days: data.video_count_30days || 0,
        cooperation_plan_count: 0,
        plan_content_count: 0,
        view_read_count: 0,
        all_content_count: 0,
        total_view_count: 0,
        contact_info: data.contact_info || '',
        remark: data.remark || '',
        is_verified: data.is_verified || false,
        cooperation_status: 'uncooperated',
        create_time: now,
        update_time: now
      }

      mockInfluencerList.unshift(newInfluencer)

      resolve({
        code: 0,
        message: '添加成功',
        data: {
          influencer: newInfluencer
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 更新达人信息
 * @param {string} id - 达人ID
 * @param {Object} data - 更新数据
 */
export function updateInfluencer(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInfluencerList.findIndex(item => item.streamer_id === id)

      if (index === -1) {
        resolve({
          code: 1,
          message: '达人不存在',
          data: null
        })
        return
      }

      const now = new Date().toLocaleString('zh-CN', { hour12: false })
        .replace(/\//g, '-')
        .replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/, (_, y, m, d, h, min, s) =>
          `${y}-${m}-${d} ${h}:${min}:${s}`
        )

      const updatedInfluencer = {
        ...mockInfluencerList[index],
        ...data,
        streamer_id: id,
        update_time: now
      }

      mockInfluencerList[index] = updatedInfluencer

      resolve({
        code: 0,
        message: '更新成功',
        data: {
          influencer: updatedInfluencer
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 删除达人
 * @param {string} id - 达人ID
 */
export function deleteInfluencer(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInfluencerList.findIndex(item => item.streamer_id === id)

      if (index === -1) {
        resolve({
          code: 1,
          message: '达人不存在',
          data: null
        })
        return
      }

      mockInfluencerList.splice(index, 1)

      resolve({
        code: 0,
        message: '删除成功',
        data: {
          id
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 批量删除达人
 * @param {Array<string>} ids - 达人ID列表
 */
export function batchDeleteInfluencers(ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const deletedIds = []

      ids.forEach(id => {
        const index = mockInfluencerList.findIndex(item => item.streamer_id === id)
        if (index !== -1) {
          mockInfluencerList.splice(index, 1)
          deletedIds.push(id)
        }
      })

      resolve({
        code: 0,
        message: `成功删除 ${deletedIds.length} 个达人`,
        data: {
          deletedIds
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取计划列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.keyword - 关键词搜索
 */
export function getPlanList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, pageSize = 10, keyword = '' } = params

      let filteredList = [...mockPlanList]

      // 关键词搜索
      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.plan_name.toLowerCase().includes(kw)
        )
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
 * 关联达人和计划
 * @param {string} streamer_id - 达人ID
 * @param {Array<string>} plan_ids - 计划ID列表
 */
export function relatePlan(streamer_id, plan_ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const influencer = mockInfluencerList.find(item => item.streamer_id === streamer_id)

      if (!influencer) {
        resolve({
          code: 1,
          message: '达人不存在',
          data: null
        })
        return
      }

      // 更新达人的合作计划数量
      influencer.cooperation_plan_count = plan_ids.length
      influencer.update_time = new Date().toLocaleString('zh-CN', { hour12: false })
        .replace(/\//g, '-')
        .replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/, (_, y, m, d, h, min, s) =>
          `${y}-${m}-${d} ${h}:${min}:${s}`
        )

      resolve({
        code: 0,
        message: '关联成功',
        data: {
          streamer_id,
          plan_ids
        }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 导出达人数据
 * @param {Object} params - 导出参数
 */
export function exportInfluencers(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '导出成功',
        data: {
          exportUrl: '/api/export/influencers.xlsx',
          fileName: `达人列表_${new Date().toISOString().slice(0, 10)}.xlsx`,
          total: mockInfluencerList.length
        }
      })
    }, MOCK_DELAY)
  })
}

// 导出所有 API
export default {
  getInfluencerList,
  getEnterpriseQuota,
  addInfluencer,
  updateInfluencer,
  deleteInfluencer,
  batchDeleteInfluencers,
  getPlanList,
  relatePlan,
  exportInfluencers
}

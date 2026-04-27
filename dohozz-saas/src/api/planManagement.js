/**
 * 营销计划管理 API
 * 使用 Mock 数据，真实接口预留
 */

const MOCK_DELAY = 500

// 计划分组 Mock 数据
const mockPlanGroups = [
  { id: 'group_all', name: '全部计划', planCount: 100 },
  { id: 'group_a', name: '分组A', planCount: 20 },
  { id: 'group_b', name: '分组B', planCount: 30 },
  { id: 'group_c', name: '分组C', planCount: 50 }
]

// 计划列表 Mock 数据
const mockPlans = [
  {
    id: 'P001',
    name: '2026年Q1新品发布营销计划',
    platform: 'douyin',
    platformLabel: '抖音',
    groupId: 'group_a',
    groupName: '分组A',
    status: 'ongoing',
    statusLabel: '进行中',
    startTime: '2026-01-01',
    endTime: '2026-03-31',
    viewTarget: 10000000,
    viewCurrent: 7500000,
    viewProgress: 75,
    interactionTarget: 100000,
    interactionCurrent: 68000,
    interactionProgress: 68,
    streamerTarget: 50,
    streamerCurrent: 35,
    streamerProgress: 70,
    contentCount: 128,
    memberCount: 8,
    memberRange: '张三、李四、王五等8人',
    remark: 'Q1季度重点新品发布计划',
    createTime: '2025-12-15 10:30:00',
    updateTime: '2026-04-26 14:20:00',
    creatorId: 'u001',
    creatorName: '张三'
  },
  {
    id: 'P002',
    name: '618大促营销计划',
    platform: 'xiaohongshu',
    platformLabel: '小红书',
    groupId: 'group_b',
    groupName: '分组B',
    status: 'ongoing',
    statusLabel: '进行中',
    startTime: '2026-05-01',
    endTime: '2026-06-30',
    viewTarget: 50000000,
    viewCurrent: 32000000,
    viewProgress: 64,
    interactionTarget: 500000,
    interactionCurrent: 280000,
    interactionProgress: 56,
    streamerTarget: 100,
    streamerCurrent: 65,
    streamerProgress: 65,
    contentCount: 256,
    memberCount: 12,
    memberRange: '李四、王五、赵六等12人',
    remark: '618大促活动',
    createTime: '2026-03-01 09:00:00',
    updateTime: '2026-04-27 10:00:00',
    creatorId: 'u002',
    creatorName: '李四'
  },
  {
    id: 'P003',
    name: '夏季清凉节营销计划',
    platform: 'douyin',
    platformLabel: '抖音',
    groupId: 'group_a',
    groupName: '分组A',
    status: 'completed',
    statusLabel: '已完成',
    startTime: '2025-06-01',
    endTime: '2025-08-31',
    viewTarget: 8000000,
    viewCurrent: 8200000,
    viewProgress: 100,
    interactionTarget: 80000,
    interactionCurrent: 85600,
    interactionProgress: 100,
    streamerTarget: 40,
    streamerCurrent: 42,
    streamerProgress: 100,
    contentCount: 96,
    memberCount: 6,
    memberRange: '王五、赵六等6人',
    remark: '夏季清凉节活动已圆满完成',
    createTime: '2025-05-15 14:00:00',
    updateTime: '2025-09-01 18:00:00',
    creatorId: 'u003',
    creatorName: '王五'
  },
  {
    id: 'P004',
    name: '双十一预热计划',
    platform: 'xiaohongshu',
    platformLabel: '小红书',
    groupId: 'group_c',
    groupName: '分组C',
    status: 'paused',
    statusLabel: '已暂停',
    startTime: '2026-10-01',
    endTime: '2026-11-11',
    viewTarget: 100000000,
    viewCurrent: 15000000,
    viewProgress: 15,
    interactionTarget: 1000000,
    interactionCurrent: 120000,
    interactionProgress: 12,
    streamerTarget: 200,
    streamerCurrent: 30,
    streamerProgress: 15,
    contentCount: 45,
    memberCount: 15,
    memberRange: '赵六、钱七、孙八等15人',
    remark: '因供应链问题暂停',
    createTime: '2026-08-01 11:00:00',
    updateTime: '2026-04-20 16:30:00',
    creatorId: 'u004',
    creatorName: '赵六'
  },
  {
    id: 'P005',
    name: '新年焕新季营销计划',
    platform: 'douyin',
    platformLabel: '抖音',
    groupId: 'group_b',
    groupName: '分组B',
    status: 'ongoing',
    statusLabel: '进行中',
    startTime: '2026-02-01',
    endTime: '2026-04-30',
    viewTarget: 15000000,
    viewCurrent: 11250000,
    viewProgress: 75,
    interactionTarget: 150000,
    interactionCurrent: 98000,
    interactionProgress: 65,
    streamerTarget: 80,
    streamerCurrent: 52,
    streamerProgress: 65,
    contentCount: 180,
    memberCount: 10,
    memberRange: '钱七、孙八等10人',
    remark: '新年焕新季活动进行中',
    createTime: '2026-01-10 08:00:00',
    updateTime: '2026-04-27 09:15:00',
    creatorId: 'u005',
    creatorName: '钱七'
  },
  {
    id: 'P006',
    name: '母亲节营销计划',
    platform: 'xiaohongshu',
    platformLabel: '小红书',
    groupId: 'group_a',
    groupName: '分组A',
    status: 'completed',
    statusLabel: '已完成',
    startTime: '2025-04-20',
    endTime: '2025-05-10',
    viewTarget: 6000000,
    viewCurrent: 6300000,
    viewProgress: 100,
    interactionTarget: 60000,
    interactionCurrent: 64800,
    interactionProgress: 100,
    streamerTarget: 35,
    streamerCurrent: 38,
    streamerProgress: 100,
    contentCount: 72,
    memberCount: 5,
    memberRange: '孙八、周九等5人',
    remark: '母亲节活动圆满完成',
    createTime: '2025-04-01 10:00:00',
    updateTime: '2025-05-11 12:00:00',
    creatorId: 'u006',
    creatorName: '孙八'
  }
]

// 配额消耗记录 Mock 数据
const mockQuotaRecords = [
  {
    id: 'QR001',
    planId: 'P001',
    planName: '2026年Q1新品发布营销计划',
    consumeTime: '2026-04-26 16:00:00',
    quotaUsed: 1,
    reason: '内容发布',
    status: 'success'
  },
  {
    id: 'QR002',
    planId: 'P002',
    planName: '618大促营销计划',
    consumeTime: '2026-04-25 21:00:00',
    quotaUsed: 1,
    reason: '内容发布',
    status: 'success'
  }
]

/**
 * 获取计划列表
 */
export function getPlans(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, pageSize = 10, keyword = '', status = '', platform = '', groupId = '' } = params

      let filteredList = [...mockPlans]

      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.name.toLowerCase().includes(kw) ||
          item.id.toLowerCase().includes(kw)
        )
      }

      if (status) {
        filteredList = filteredList.filter(item => item.status === status)
      }

      if (platform && platform !== 'all') {
        filteredList = filteredList.filter(item => item.platform === platform)
      }

      if (groupId && groupId !== 'group_all') {
        filteredList = filteredList.filter(item => item.groupId === groupId)
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
 * 获取计划分组列表
 */
export function getPlanGroups() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: 'success',
        data: mockPlanGroups
      })
    }, MOCK_DELAY)
  })
}

/**
 * 新增计划
 */
export function addPlan(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPlan = {
        id: `P${String(mockPlans.length + 1).padStart(3, '0')}`,
        name: data.name,
        platform: data.platform || 'all',
        platformLabel: data.platform === 'douyin' ? '抖音' : data.platform === 'xiaohongshu' ? '小红书' : '全部',
        groupId: data.groupId || 'group_all',
        groupName: data.groupName || '全部计划',
        status: data.status || 'ongoing',
        statusLabel: data.status === 'completed' ? '已完成' : data.status === 'paused' ? '已暂停' : '进行中',
        startTime: data.startTime,
        endTime: data.endTime,
        viewTarget: data.viewTarget || 0,
        viewCurrent: 0,
        viewProgress: 0,
        interactionTarget: data.interactionTarget || 0,
        interactionCurrent: 0,
        interactionProgress: 0,
        streamerTarget: data.streamerTarget || 0,
        streamerCurrent: 0,
        streamerProgress: 0,
        contentCount: 0,
        memberCount: 1,
        memberRange: '当前用户',
        remark: data.remark || '',
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        creatorId: 'u001',
        creatorName: '当前用户'
      }

      mockPlans.unshift(newPlan)
      // 更新分组计数
      const group = mockPlanGroups.find(g => g.id === newPlan.groupId)
      if (group) group.planCount++
      const allGroup = mockPlanGroups.find(g => g.id === 'group_all')
      if (allGroup) allGroup.planCount++

      resolve({
        code: 0,
        message: '新增计划成功',
        data: { plan: newPlan }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 编辑计划
 */
export function updatePlan(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plan = mockPlans.find(p => p.id === id)
      if (plan) {
        Object.assign(plan, {
          name: data.name,
          platform: data.platform,
          platformLabel: data.platform === 'douyin' ? '抖音' : data.platform === 'xiaohongshu' ? '小红书' : '全部',
          groupId: data.groupId,
          groupName: data.groupName,
          status: data.status,
          statusLabel: data.status === 'completed' ? '已完成' : data.status === 'paused' ? '已暂停' : '进行中',
          startTime: data.startTime,
          endTime: data.endTime,
          viewTarget: data.viewTarget,
          interactionTarget: data.interactionTarget,
          streamerTarget: data.streamerTarget,
          remark: data.remark,
          updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
        })
      }
      resolve({
        code: 0,
        message: '编辑计划成功',
        data: { plan }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 删除计划
 */
export function deletePlan(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockPlans.findIndex(p => p.id === id)
      if (index > -1) {
        const plan = mockPlans[index]
        mockPlans.splice(index, 1)
        // 更新分组计数
        const group = mockPlanGroups.find(g => g.id === plan.groupId)
        if (group) group.planCount--
        const allGroup = mockPlanGroups.find(g => g.id === 'group_all')
        if (allGroup) allGroup.planCount--
      }
      resolve({
        code: 0,
        message: '删除计划成功',
        data: { id }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 复制计划
 */
export function copyPlan(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const original = mockPlans.find(p => p.id === id)
      if (original) {
        const copy = {
          ...original,
          id: `P${String(mockPlans.length + 1).padStart(3, '0')}`,
          name: `${original.name} (副本)`,
          createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
          updateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
        }
        mockPlans.unshift(copy)
        const group = mockPlanGroups.find(g => g.id === copy.groupId)
        if (group) group.planCount++
        const allGroup = mockPlanGroups.find(g => g.id === 'group_all')
        if (allGroup) allGroup.planCount++
        resolve({ code: 0, message: '复制计划成功', data: { plan: copy } })
      } else {
        resolve({ code: 1, message: '计划不存在', data: null })
      }
    }, MOCK_DELAY)
  })
}

/**
 * 归档计划
 */
export function archivePlan(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plan = mockPlans.find(p => p.id === id)
      if (plan) {
        plan.status = 'archived'
        plan.statusLabel = '已归档'
      }
      resolve({ code: 0, message: '归档计划成功', data: { id } })
    }, MOCK_DELAY)
  })
}

/**
 * 新增分组
 */
export function addGroup(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGroup = {
        id: `group_${Date.now()}`,
        name: data.name,
        planCount: 0
      }
      mockPlanGroups.push(newGroup)
      resolve({ code: 0, message: '新增分组成功', data: { group: newGroup } })
    }, MOCK_DELAY)
  })
}

/**
 * 编辑分组
 */
export function updateGroup(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockPlanGroups.find(g => g.id === id)
      if (group) {
        group.name = data.name
      }
      resolve({ code: 0, message: '编辑分组成功', data: { group } })
    }, MOCK_DELAY)
  })
}

/**
 * 删除分组
 */
export function deleteGroup(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockPlanGroups.findIndex(g => g.id === id)
      if (index > -1 && id !== 'group_all') {
        mockPlanGroups.splice(index, 1)
        resolve({ code: 0, message: '删除分组成功', data: { id } })
      } else {
        resolve({ code: 1, message: '默认分组不能删除', data: null })
      }
    }, MOCK_DELAY)
  })
}

export default {
  getPlans,
  getPlanGroups,
  addPlan,
  updatePlan,
  deletePlan,
  copyPlan,
  archivePlan,
  addGroup,
  updateGroup,
  deleteGroup
}

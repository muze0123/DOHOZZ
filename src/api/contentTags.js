/**
 * 内容标签 API
 * 使用 Mock 数据，真实接口预留
 */

const MOCK_DELAY = 400

const now = new Date()
function timeAgo(days, hours = 0, minutes = 0) {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

// ==================== Mock 数据 ====================

const mockTagGroups = [
  {
    tag_group_id: 'ct001',
    tag_group_name: '短视频内容标签组',
    tag_group_sort: 1,
    remark: '归类短视频方向的达人内容',
    create_time: timeAgo(25, 10, 0),
    update_time: timeAgo(1, 14, 30),
    tags: [
      { tag_id: 'c001', tag_name: '口播种草', tag_color: '#ff6b6b', tag_sort: 1 },
      { tag_id: 'c002', tag_name: '好物推荐', tag_color: '#ff9f43', tag_sort: 2 },
      { tag_id: 'c003', tag_name: '生活vlog', tag_color: '#feca57', tag_sort: 3 },
      { tag_id: 'c004', tag_name: '剧情植入', tag_color: '#54a0ff', tag_sort: 4 },
      { tag_id: 'c005', tag_name: '使用教程', tag_color: '#5f27cd', tag_sort: 5 },
      { tag_id: 'c006', tag_name: '对比评测', tag_color: '#01a3a4', tag_sort: 6 },
      { tag_id: 'c007', tag_name: '场景化种草', tag_color: '#ff6348', tag_sort: 7 },
      { tag_id: 'c008', tag_name: '干货分享', tag_color: '#7bed9f', tag_sort: 8 },
      { tag_id: 'c009', tag_name: '挑战互动', tag_color: '#70a1ff', tag_sort: 9 }
    ]
  },
  {
    tag_group_id: 'ct002',
    tag_group_name: '图文笔记内容标签组',
    tag_group_sort: 2,
    remark: '归类图文笔记方向的达人内容',
    create_time: timeAgo(22, 9, 15),
    update_time: timeAgo(0, 11, 0),
    tags: [
      { tag_id: 'c010', tag_name: '合集整理', tag_color: '#fd79a8', tag_sort: 1 },
      { tag_id: 'c011', tag_name: '单品测评', tag_color: '#636e72', tag_sort: 2 },
      { tag_id: 'c012', tag_name: '清单推荐', tag_color: '#00b894', tag_sort: 3 },
      { tag_id: 'c013', tag_name: '经验分享', tag_color: '#fdcb6e', tag_sort: 4 },
      { tag_id: 'c014', tag_name: '教程图文', tag_color: '#e17055', tag_sort: 5 },
      { tag_id: 'c015', tag_name: '穿搭笔记', tag_color: '#6c5ce7', tag_sort: 6 },
      { tag_id: 'c016', tag_name: '探店笔记', tag_color: '#0984e3', tag_sort: 7 }
    ]
  },
  {
    tag_group_id: 'ct003',
    tag_group_name: '直播内容标签组',
    tag_group_sort: 3,
    remark: '用于分类直播带货内容',
    create_time: timeAgo(20, 14, 30),
    update_time: timeAgo(2, 16, 45),
    tags: [
      { tag_id: 'c017', tag_name: '专场直播', tag_color: '#0984e3', tag_sort: 1 },
      { tag_id: 'c018', tag_name: '混场直播', tag_color: '#636e72', tag_sort: 2 },
      { tag_id: 'c019', tag_name: '品牌自播', tag_color: '#6c5ce7', tag_sort: 3 },
      { tag_id: 'c020', tag_name: '达人代播', tag_color: '#e17055', tag_sort: 4 },
      { tag_id: 'c021', tag_name: '新品首发', tag_color: '#00b894', tag_sort: 5 },
      { tag_id: 'c022', tag_name: '秒杀专场', tag_color: '#ff6348', tag_sort: 6 }
    ]
  },
  {
    tag_group_id: 'ct004',
    tag_group_name: '品牌宣传内容标签组',
    tag_group_sort: 4,
    remark: '',
    create_time: timeAgo(18, 11, 0),
    update_time: timeAgo(3, 10, 30),
    tags: [
      { tag_id: 'c023', tag_name: '品牌故事', tag_color: '#fd79a8', tag_sort: 1 },
      { tag_id: 'c024', tag_name: '产品溯源', tag_color: '#feca57', tag_sort: 2 },
      { tag_id: 'c025', tag_name: '工厂探秘', tag_color: '#54a0ff', tag_sort: 3 },
      { tag_id: 'c026', tag_name: 'CEO访谈', tag_color: '#e17055', tag_sort: 4 },
      { tag_id: 'c027', tag_name: '公益活动', tag_color: '#2ed573', tag_sort: 5 }
    ]
  },
  {
    tag_group_id: 'ct005',
    tag_group_name: '产品测评内容标签组',
    tag_group_sort: 5,
    remark: '产品测评类内容',
    create_time: timeAgo(15, 8, 45),
    update_time: timeAgo(1, 9, 15),
    tags: [
      { tag_id: 'c028', tag_name: '开箱测评', tag_color: '#ff6b6b', tag_sort: 1 },
      { tag_id: 'c029', tag_name: '横评对比', tag_color: '#ff9f43', tag_sort: 2 },
      { tag_id: 'c030', tag_name: '长期使用', tag_color: '#feca57', tag_sort: 3 },
      { tag_id: 'c031', tag_name: '成分分析', tag_color: '#54a0ff', tag_sort: 4 },
      { tag_id: 'c032', tag_name: '性价比测评', tag_color: '#2ed573', tag_sort: 5 },
      { tag_id: 'c033', tag_name: '真人实测', tag_color: '#5f27cd', tag_sort: 6 },
      { tag_id: 'c034', tag_name: '实验室测试', tag_color: '#01a3a4', tag_sort: 7 },
      { tag_id: 'c035', tag_name: '口碑评分', tag_color: '#636e72', tag_sort: 8 }
    ]
  },
  {
    tag_group_id: 'ct006',
    tag_group_name: '创意种草内容标签组',
    tag_group_sort: 6,
    remark: '',
    create_time: timeAgo(12, 16, 0),
    update_time: timeAgo(4, 13, 20),
    tags: [
      { tag_id: 'c036', tag_name: '创意剧情', tag_color: '#6c5ce7', tag_sort: 1 },
      { tag_id: 'c037', tag_name: '反转植入', tag_color: '#fd79a8', tag_sort: 2 },
      { tag_id: 'c038', tag_name: '场景还原', tag_color: '#00b894', tag_sort: 3 },
      { tag_id: 'c039', tag_name: '痛点解决', tag_color: '#feca57', tag_sort: 4 },
      { tag_id: 'c040', tag_name: '情感共鸣', tag_color: '#0984e3', tag_sort: 5 },
      { tag_id: 'c041', tag_name: '悬念引导', tag_color: '#e17055', tag_sort: 6 }
    ]
  },
  {
    tag_group_id: 'ct007',
    tag_group_name: '内容效果分级',
    tag_group_sort: 7,
    remark: '按内容传播效果分级',
    create_time: timeAgo(10, 13, 30),
    update_time: timeAgo(5, 17, 0),
    tags: [
      { tag_id: 'c042', tag_name: '爆款内容', tag_color: '#ff6b6b', tag_sort: 1 },
      { tag_id: 'c043', tag_name: '潜力内容', tag_color: '#ff9f43', tag_sort: 2 },
      { tag_id: 'c044', tag_name: '长尾内容', tag_color: '#54a0ff', tag_sort: 3 },
      { tag_id: 'c045', tag_name: '高转化内容', tag_color: '#2ed573', tag_sort: 4 },
      { tag_id: 'c046', tag_name: '待优化内容', tag_color: '#636e72', tag_sort: 5 }
    ]
  },
  {
    tag_group_id: 'ct008',
    tag_group_name: '合作内容类型',
    tag_group_sort: 8,
    remark: '',
    create_time: timeAgo(8, 10, 15),
    update_time: timeAgo(6, 15, 30),
    tags: [
      { tag_id: 'c047', tag_name: '纯佣金合作', tag_color: '#2ed573', tag_sort: 1 },
      { tag_id: 'c048', tag_name: '坑位费+佣金', tag_color: '#0984e3', tag_sort: 2 },
      { tag_id: 'c049', tag_name: '纯坑位合作', tag_color: '#feca57', tag_sort: 3 },
      { tag_id: 'c050', tag_name: '样品置换', tag_color: '#fd79a8', tag_sort: 4 }
    ]
  }
]

// ==================== API 函数 ====================

/**
 * 获取标签组列表（含分页、搜索）
 */
export function getTagGroupList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, pageSize = 10, keyword = '' } = params

      let filteredList = [...mockTagGroups]

      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.tag_group_name.toLowerCase().includes(kw) ||
          item.tags.some(t => t.tag_name.toLowerCase().includes(kw))
        )
      }

      filteredList.sort((a, b) => a.tag_group_sort - b.tag_group_sort)

      const total = filteredList.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end).map(group => ({
        ...group,
        tag_count: group.tags.length
      }))

      resolve({
        code: 0,
        message: 'success',
        data: { list, pagination: { page, pageSize, total } }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 获取所有标签组选项（用于下拉选择）
 */
export function getTagGroupOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const options = mockTagGroups.map(g => ({
        tag_group_id: g.tag_group_id,
        tag_group_name: g.tag_group_name
      }))
      resolve({ code: 0, message: 'success', data: options })
    }, MOCK_DELAY)
  })
}

/**
 * 新增标签组
 */
export function createTagGroup(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const exists = mockTagGroups.some(g => g.tag_group_name === data.tag_group_name)
      if (exists) {
        resolve({ code: 1001, message: '标签组名称已存在', data: null })
        return
      }
      const newGroup = {
        tag_group_id: 'ct' + Date.now(),
        tag_group_name: data.tag_group_name,
        tag_group_sort: mockTagGroups.length + 1,
        remark: data.remark || '',
        create_time: timeAgo(0, now.getHours(), now.getMinutes()),
        update_time: timeAgo(0, now.getHours(), now.getMinutes()),
        tags: []
      }
      mockTagGroups.push(newGroup)
      resolve({ code: 0, message: '保存成功', data: newGroup })
    }, MOCK_DELAY)
  })
}

/**
 * 编辑标签组
 */
export function updateTagGroup(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTagGroups.findIndex(g => g.tag_group_id === data.tag_group_id)
      if (index === -1) {
        resolve({ code: 1002, message: '标签组不存在', data: null })
        return
      }
      const nameConflict = mockTagGroups.some(
        g => g.tag_group_id !== data.tag_group_id && g.tag_group_name === data.tag_group_name
      )
      if (nameConflict) {
        resolve({ code: 1001, message: '标签组名称已存在', data: null })
        return
      }
      mockTagGroups[index].tag_group_name = data.tag_group_name
      mockTagGroups[index].remark = data.remark || ''
      mockTagGroups[index].update_time = timeAgo(0, now.getHours(), now.getMinutes())
      resolve({ code: 0, message: '保存成功', data: mockTagGroups[index] })
    }, MOCK_DELAY)
  })
}

/**
 * 删除标签组
 */
export function deleteTagGroup(tagGroupId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTagGroups.findIndex(g => g.tag_group_id === tagGroupId)
      if (index === -1) {
        resolve({ code: 1002, message: '标签组不存在', data: null })
        return
      }
      mockTagGroups.splice(index, 1)
      mockTagGroups.forEach((g, i) => { g.tag_group_sort = i + 1 })
      resolve({ code: 0, message: '删除成功', data: null })
    }, MOCK_DELAY)
  })
}

/**
 * 上移标签组
 */
export function moveTagGroupUp(tagGroupId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTagGroups.findIndex(g => g.tag_group_id === tagGroupId)
      if (index <= 0) {
        resolve({ code: 0, message: '已是首位', data: null })
        return
      }
      const temp = mockTagGroups[index].tag_group_sort
      mockTagGroups[index].tag_group_sort = mockTagGroups[index - 1].tag_group_sort
      mockTagGroups[index - 1].tag_group_sort = temp
      ;[mockTagGroups[index], mockTagGroups[index - 1]] = [mockTagGroups[index - 1], mockTagGroups[index]]
      resolve({ code: 0, message: '上移成功', data: null })
    }, MOCK_DELAY)
  })
}

/**
 * 下移标签组
 */
export function moveTagGroupDown(tagGroupId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTagGroups.findIndex(g => g.tag_group_id === tagGroupId)
      if (index < 0 || index >= mockTagGroups.length - 1) {
        resolve({ code: 0, message: '已是末位', data: null })
        return
      }
      const temp = mockTagGroups[index].tag_group_sort
      mockTagGroups[index].tag_group_sort = mockTagGroups[index + 1].tag_group_sort
      mockTagGroups[index + 1].tag_group_sort = temp
      ;[mockTagGroups[index], mockTagGroups[index + 1]] = [mockTagGroups[index + 1], mockTagGroups[index]]
      resolve({ code: 0, message: '下移成功', data: null })
    }, MOCK_DELAY)
  })
}

/**
 * 添加标签到标签组
 */
export function addTag(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockTagGroups.find(g => g.tag_group_id === data.tag_group_id)
      if (!group) {
        resolve({ code: 1002, message: '标签组不存在', data: null })
        return
      }
      const nameExists = group.tags.some(t => t.tag_name === data.tag_name)
      if (nameExists) {
        resolve({ code: 1003, message: '标签名称已存在', data: null })
        return
      }
      const newTag = {
        tag_id: 'c' + Date.now(),
        tag_name: data.tag_name,
        tag_color: data.tag_color || '#1677ff',
        tag_sort: group.tags.length + 1
      }
      group.tags.push(newTag)
      group.update_time = timeAgo(0, now.getHours(), now.getMinutes())
      resolve({ code: 0, message: '保存成功', data: newTag })
    }, MOCK_DELAY)
  })
}

/**
 * 编辑标签
 */
export function updateTag(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockTagGroups.find(g => g.tag_group_id === data.tag_group_id)
      if (!group) {
        resolve({ code: 1002, message: '标签组不存在', data: null })
        return
      }
      const tag = group.tags.find(t => t.tag_id === data.tag_id)
      if (!tag) {
        resolve({ code: 1004, message: '标签不存在', data: null })
        return
      }
      const nameConflict = group.tags.some(
        t => t.tag_id !== data.tag_id && t.tag_name === data.tag_name
      )
      if (nameConflict) {
        resolve({ code: 1003, message: '标签名称已存在', data: null })
        return
      }
      tag.tag_name = data.tag_name
      tag.tag_color = data.tag_color || tag.tag_color
      group.update_time = timeAgo(0, now.getHours(), now.getMinutes())
      resolve({ code: 0, message: '保存成功', data: tag })
    }, MOCK_DELAY)
  })
}

/**
 * 删除标签
 */
export function deleteTag(tagGroupId, tagId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const group = mockTagGroups.find(g => g.tag_group_id === tagGroupId)
      if (!group) {
        resolve({ code: 1002, message: '标签组不存在', data: null })
        return
      }
      const tagIndex = group.tags.findIndex(t => t.tag_id === tagId)
      if (tagIndex === -1) {
        resolve({ code: 1004, message: '标签不存在', data: null })
        return
      }
      group.tags.splice(tagIndex, 1)
      group.tags.forEach((t, i) => { t.tag_sort = i + 1 })
      group.update_time = timeAgo(0, now.getHours(), now.getMinutes())
      resolve({ code: 0, message: '删除成功', data: null })
    }, MOCK_DELAY)
  })
}

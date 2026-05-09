/**
 * 达人标签 API
 * 使用 Mock 数据，真实接口预留
 */

const MOCK_DELAY = 400

// ==================== Mock 数据 ====================

const now = new Date()
function timeAgo(days, hours = 0, minutes = 0) {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

const mockTagGroups = [
  {
    tag_group_id: 'tg001',
    tag_group_name: '美妆护肤达人标签组',
    tag_group_sort: 1,
    remark: '用于归类美妆护肤领域的达人',
    create_time: timeAgo(30, 10, 30),
    update_time: timeAgo(2, 15, 1),
    tags: [
      { tag_id: 't001', tag_name: '护肤分享', tag_color: '#ff6b6b', tag_sort: 1 },
      { tag_id: 't002', tag_name: '彩妆教程', tag_color: '#ff9f43', tag_sort: 2 },
      { tag_id: 't003', tag_name: '口红试色', tag_color: '#feca57', tag_sort: 3 },
      { tag_id: 't004', tag_name: '粉底测评', tag_color: '#54a0ff', tag_sort: 4 },
      { tag_id: 't005', tag_name: '眼妆教程', tag_color: '#5f27cd', tag_sort: 5 },
      { tag_id: 't006', tag_name: '卸妆推荐', tag_color: '#01a3a4', tag_sort: 6 },
      { tag_id: 't007', tag_name: '防晒测评', tag_color: '#ff6348', tag_sort: 7 },
      { tag_id: 't008', tag_name: '面膜推荐', tag_color: '#7bed9f', tag_sort: 8 },
      { tag_id: 't009', tag_name: '精华液测评', tag_color: '#70a1ff', tag_sort: 9 },
      { tag_id: 't010', tag_name: '水乳套装', tag_color: '#ffa502', tag_sort: 10 },
      { tag_id: 't011', tag_name: '抗老精华', tag_color: '#eccc68', tag_sort: 11 },
      { tag_id: 't012', tag_name: '痘痘肌护理', tag_color: '#ff4757', tag_sort: 12 },
      { tag_id: 't013', tag_name: '敏感肌修复', tag_color: '#2ed573', tag_sort: 13 },
      { tag_id: 't014', tag_name: '美白淡斑', tag_color: '#1e90ff', tag_sort: 14 },
      { tag_id: 't015', tag_name: '颈部护理', tag_color: '#a29bfe', tag_sort: 15 },
      { tag_id: 't016', tag_name: '眼霜推荐', tag_color: '#fd79a8', tag_sort: 16 },
      { tag_id: 't017', tag_name: '美容仪测评', tag_color: '#00b894', tag_sort: 17 },
      { tag_id: 't018', tag_name: '素颜霜推荐', tag_color: '#e17055', tag_sort: 18 },
      { tag_id: 't019', tag_name: '气垫测评', tag_color: '#0984e3', tag_sort: 19 },
      { tag_id: 't020', tag_name: '定妆喷雾', tag_color: '#6c5ce7', tag_sort: 20 },
      { tag_id: 't021', tag_name: '美妆工具', tag_color: '#b2bec3', tag_sort: 21 },
      { tag_id: 't022', tag_name: '唇釉推荐', tag_color: '#d63031', tag_sort: 22 },
      { tag_id: 't023', tag_name: '腮红推荐', tag_color: '#fdcb6e', tag_sort: 23 },
      { tag_id: 't024', tag_name: '眉笔推荐', tag_color: '#636e72', tag_sort: 24 },
      { tag_id: 't025', tag_name: '化妆刷具', tag_color: '#fab1a0', tag_sort: 25 },
      { tag_id: 't026', tag_name: '隔离霜', tag_color: '#81ecec', tag_sort: 26 },
      { tag_id: 't027', tag_name: 'BB霜测评', tag_color: '#ffeaa7', tag_sort: 27 },
      { tag_id: 't028', tag_name: '香水推荐', tag_color: '#dfe6e9', tag_sort: 28 },
      { tag_id: 't029', tag_name: '护手霜', tag_color: '#74b9ff', tag_sort: 29 },
      { tag_id: 't030', tag_name: '美甲教程', tag_color: '#a29bfe', tag_sort: 30 }
    ]
  },
  {
    tag_group_id: 'tg002',
    tag_group_name: '时尚穿搭标签组',
    tag_group_sort: 2,
    remark: '用于归类时尚穿搭领域的达人',
    create_time: timeAgo(28, 9, 15),
    update_time: timeAgo(1, 11, 30),
    tags: [
      { tag_id: 't031', tag_name: '日常穿搭', tag_color: '#fd79a8', tag_sort: 1 },
      { tag_id: 't032', tag_name: '职场穿搭', tag_color: '#636e72', tag_sort: 2 },
      { tag_id: 't033', tag_name: '春季搭配', tag_color: '#00b894', tag_sort: 3 },
      { tag_id: 't034', tag_name: '夏季穿搭', tag_color: '#fdcb6e', tag_sort: 4 },
      { tag_id: 't035', tag_name: '秋冬穿搭', tag_color: '#e17055', tag_sort: 5 },
      { tag_id: 't036', tag_name: '小个子穿搭', tag_color: '#6c5ce7', tag_sort: 6 },
      { tag_id: 't037', tag_name: '显瘦穿搭', tag_color: '#0984e3', tag_sort: 7 },
      { tag_id: 't038', tag_name: '平价穿搭', tag_color: '#ff6b6b', tag_sort: 8 },
      { tag_id: 't039', tag_name: '品牌穿搭', tag_color: '#feca57', tag_sort: 9 },
      { tag_id: 't040', tag_name: '配饰搭配', tag_color: '#2ed573', tag_sort: 10 },
      { tag_id: 't041', tag_name: '包包推荐', tag_color: '#ff6348', tag_sort: 11 }
    ]
  },
  {
    tag_group_id: 'tg003',
    tag_group_name: '数码科技',
    tag_group_sort: 3,
    remark: '数码科技类达人标签',
    create_time: timeAgo(25, 14, 0),
    update_time: timeAgo(0, 9, 45),
    tags: [
      { tag_id: 't042', tag_name: '手机测评', tag_color: '#0984e3', tag_sort: 1 },
      { tag_id: 't043', tag_name: '电脑科技', tag_color: '#636e72', tag_sort: 2 },
      { tag_id: 't044', tag_name: '智能穿戴', tag_color: '#6c5ce7', tag_sort: 3 },
      { tag_id: 't045', tag_name: '耳机推荐', tag_color: '#e17055', tag_sort: 4 },
      { tag_id: 't046', tag_name: '游戏装备', tag_color: '#d63031', tag_sort: 5 }
    ]
  },
  {
    tag_group_id: 'tg004',
    tag_group_name: '美食探店',
    tag_group_sort: 4,
    remark: '',
    create_time: timeAgo(20, 16, 20),
    update_time: timeAgo(3, 14, 10),
    tags: [
      { tag_id: 't047', tag_name: '美食探店', tag_color: '#feca57', tag_sort: 1 },
      { tag_id: 't048', tag_name: '零食推荐', tag_color: '#ff9f43', tag_sort: 2 },
      { tag_id: 't049', tag_name: '健康饮食', tag_color: '#2ed573', tag_sort: 3 },
      { tag_id: 't050', tag_name: '饮品制作', tag_color: '#54a0ff', tag_sort: 4 },
      { tag_id: 't051', tag_name: '烘焙教程', tag_color: '#fd79a8', tag_sort: 5 },
      { tag_id: 't052', tag_name: '家常菜谱', tag_color: '#e17055', tag_sort: 6 },
      { tag_id: 't053', tag_name: '夜宵推荐', tag_color: '#ff6348', tag_sort: 7 },
      { tag_id: 't054', tag_name: '甜品推荐', tag_color: '#ff6b6b', tag_sort: 8 },
      { tag_id: 't055', tag_name: '异国料理', tag_color: '#01a3a4', tag_sort: 9 }
    ]
  },
  {
    tag_group_id: 'tg005',
    tag_group_name: '家居生活',
    tag_group_sort: 5,
    remark: '家居生活类达人',
    create_time: timeAgo(18, 11, 0),
    update_time: timeAgo(5, 16, 30),
    tags: [
      { tag_id: 't056', tag_name: '家居装饰', tag_color: '#fd79a8', tag_sort: 1 },
      { tag_id: 't057', tag_name: '收纳技巧', tag_color: '#00b894', tag_sort: 2 },
      { tag_id: 't058', tag_name: '清洁好物', tag_color: '#0984e3', tag_sort: 3 },
      { tag_id: 't059', tag_name: '厨房用具', tag_color: '#ff9f43', tag_sort: 4 },
      { tag_id: 't060', tag_name: '床品推荐', tag_color: '#6c5ce7', tag_sort: 5 },
      { tag_id: 't061', tag_name: '灯具照明', tag_color: '#feca57', tag_sort: 6 },
      { tag_id: 't062', tag_name: '绿植养护', tag_color: '#2ed573', tag_sort: 7 }
    ]
  },
  {
    tag_group_id: 'tg006',
    tag_group_name: '运动健身',
    tag_group_sort: 6,
    remark: '',
    create_time: timeAgo(15, 8, 30),
    update_time: timeAgo(4, 10, 0),
    tags: [
      { tag_id: 't063', tag_name: '瑜伽教程', tag_color: '#2ed573', tag_sort: 1 },
      { tag_id: 't064', tag_name: '跑步训练', tag_color: '#ff6b6b', tag_sort: 2 },
      { tag_id: 't065', tag_name: '健身器材', tag_color: '#636e72', tag_sort: 3 },
      { tag_id: 't066', tag_name: '运动穿搭', tag_color: '#0984e3', tag_sort: 4 },
      { tag_id: 't067', tag_name: '减脂餐', tag_color: '#feca57', tag_sort: 5 },
      { tag_id: 't068', tag_name: '增肌训练', tag_color: '#e17055', tag_sort: 6 }
    ]
  },
  {
    tag_group_id: 'tg007',
    tag_group_name: '母婴育儿',
    tag_group_sort: 7,
    remark: '母婴育儿领域达人',
    create_time: timeAgo(12, 13, 45),
    update_time: timeAgo(6, 8, 20),
    tags: [
      { tag_id: 't069', tag_name: '母婴好物', tag_color: '#fd79a8', tag_sort: 1 },
      { tag_id: 't070', tag_name: '孕产经验', tag_color: '#ff9f43', tag_sort: 2 },
      { tag_id: 't071', tag_name: '育儿知识', tag_color: '#6c5ce7', tag_sort: 3 },
      { tag_id: 't072', tag_name: '童装推荐', tag_color: '#00b894', tag_sort: 4 }
    ]
  },
  {
    tag_group_id: 'tg008',
    tag_group_name: '旅行户外',
    tag_group_sort: 8,
    remark: '',
    create_time: timeAgo(10, 17, 0),
    update_time: timeAgo(7, 12, 15),
    tags: [
      { tag_id: 't073', tag_name: '旅行攻略', tag_color: '#0984e3', tag_sort: 1 },
      { tag_id: 't074', tag_name: '户外装备', tag_color: '#e17055', tag_sort: 2 },
      { tag_id: 't075', tag_name: '自驾游', tag_color: '#636e72', tag_sort: 3 },
      { tag_id: 't076', tag_name: '露营体验', tag_color: '#2ed573', tag_sort: 4 },
      { tag_id: 't077', tag_name: '背包客', tag_color: '#ff6348', tag_sort: 5 },
      { tag_id: 't078', tag_name: '潜水冲浪', tag_color: '#54a0ff', tag_sort: 6 }
    ]
  },
  {
    tag_group_id: 'tg009',
    tag_group_name: '宠物',
    tag_group_sort: 9,
    remark: '宠物类达人',
    create_time: timeAgo(8, 10, 30),
    update_time: timeAgo(1, 18, 0),
    tags: [
      { tag_id: 't079', tag_name: '狗狗用品', tag_color: '#ff9f43', tag_sort: 1 },
      { tag_id: 't080', tag_name: '猫咪用品', tag_color: '#fd79a8', tag_sort: 2 },
      { tag_id: 't081', tag_name: '宠物零食', tag_color: '#feca57', tag_sort: 3 }
    ]
  },
  {
    tag_group_id: 'tg010',
    tag_group_name: '汽车交通',
    tag_group_sort: 10,
    remark: '',
    create_time: timeAgo(5, 15, 0),
    update_time: timeAgo(2, 9, 30),
    tags: [
      { tag_id: 't082', tag_name: '新车测评', tag_color: '#0984e3', tag_sort: 1 },
      { tag_id: 't083', tag_name: '二手车', tag_color: '#636e72', tag_sort: 2 },
      { tag_id: 't084', tag_name: '汽车改装', tag_color: '#e17055', tag_sort: 3 },
      { tag_id: 't085', tag_name: '新能源车', tag_color: '#2ed573', tag_sort: 4 },
      { tag_id: 't086', tag_name: '汽车保养', tag_color: '#6c5ce7', tag_sort: 5 }
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
      const {
        page = 1,
        pageSize = 10,
        keyword = ''
      } = params

      let filteredList = [...mockTagGroups]

      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.tag_group_name.toLowerCase().includes(kw) ||
          item.tags.some(t => t.tag_name.toLowerCase().includes(kw))
        )
      }

      // 按 sort 排序
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
        data: {
          list,
          pagination: { page, pageSize, total }
        }
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
      resolve({
        code: 0,
        message: 'success',
        data: options
      })
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
        tag_group_id: 'tg' + Date.now(),
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
      // 更新排序
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
        tag_id: 't' + Date.now(),
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

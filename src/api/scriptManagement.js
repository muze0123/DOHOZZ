/**
 * 脚本管理 API
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

const mockScripts = [
  {
    id: 'sc001',
    file_name: '口红推广脚本_v3.docx',
    file_type: 'word',
    file_size: 2457600,
    file_url: '',
    remark: '第三版口红推广脚本，调整了口播节奏和产品展示顺序',
    creator_id: 's001',
    creator_name: '美妆达人小雅',
    creator_account: 'meiyanxiaoya',
    creator_avatar: 'https://i.pravatar.cc/150?img=101',
    platform: 'douyin',
    plan_id: 'p001',
    plan_name: '夏季美妆推广计划',
    upload_time: timeAgo(1, 14, 30),
    upload_member: '张三',
    update_time: timeAgo(1, 14, 30)
  },
  {
    id: 'sc002',
    file_name: '精华液产品介绍.txt',
    file_type: 'txt',
    file_size: 524288,
    file_url: '',
    remark: '精华液产品核心卖点介绍',
    creator_id: 's002',
    creator_name: '护肤专家小李',
    creator_account: 'hufu_lilei',
    creator_avatar: 'https://i.pravatar.cc/150?img=102',
    platform: 'douyin',
    plan_id: 'p001',
    plan_name: '夏季美妆推广计划',
    upload_time: timeAgo(2, 10, 15),
    upload_member: '李四',
    update_time: timeAgo(2, 10, 15)
  },
  {
    id: 'sc003',
    file_name: '穿搭推广方案.pdf',
    file_type: 'pdf',
    file_size: 8388608,
    file_url: '',
    remark: '',
    creator_id: 's003',
    creator_name: '时尚穿搭小C',
    creator_account: 'shishangCC',
    creator_avatar: 'https://i.pravatar.cc/150?img=103',
    platform: 'xiaohongshu',
    plan_id: 'p002',
    plan_name: '春季时尚计划',
    upload_time: timeAgo(3, 9, 45),
    upload_member: '王五',
    update_time: timeAgo(3, 9, 45)
  },
  {
    id: 'sc004',
    file_name: '美食探店脚本.pptx',
    file_type: 'ppt',
    file_size: 12582912,
    file_url: '',
    remark: '美食探店直播脚本，含互动环节设计',
    creator_id: 's004',
    creator_name: '吃货小分队',
    creator_account: 'chihuo_xiaofendui',
    creator_avatar: 'https://i.pravatar.cc/150?img=104',
    platform: 'douyin',
    plan_id: 'p003',
    plan_name: '美食探店计划',
    upload_time: timeAgo(4, 16, 0),
    upload_member: '张三',
    update_time: timeAgo(4, 16, 0)
  },
  {
    id: 'sc005',
    file_name: '数码开箱流程表.xlsx',
    file_type: 'excel',
    file_size: 3670016,
    file_url: '',
    remark: '数码产品开箱评测流程表',
    creator_id: 's005',
    creator_name: '科技小王子',
    creator_account: 'keji_wangzi',
    creator_avatar: 'https://i.pravatar.cc/150?img=105',
    platform: 'douyin',
    plan_id: 'p004',
    plan_name: '数码新品计划',
    upload_time: timeAgo(5, 11, 30),
    upload_member: '李四',
    update_time: timeAgo(5, 11, 30)
  },
  {
    id: 'sc006',
    file_name: '家居好物种草指南.docx',
    file_type: 'word',
    file_size: 2097152,
    file_url: '',
    remark: '',
    creator_id: 's006',
    creator_name: '生活家小小',
    creator_account: 'shenghuojia_xiaoxiao',
    creator_avatar: 'https://i.pravatar.cc/150?img=106',
    platform: 'xiaohongshu',
    plan_id: 'p005',
    plan_name: '家居生活计划',
    upload_time: timeAgo(6, 14, 20),
    upload_member: '王五',
    update_time: timeAgo(6, 14, 20)
  },
  {
    id: 'sc007',
    file_name: '瑜伽教学脚本.txt',
    file_type: 'txt',
    file_size: 153600,
    file_url: '',
    remark: '30分钟瑜伽教学短视频脚本',
    creator_id: 's007',
    creator_name: '瑜伽教练Amy',
    creator_account: 'yoga_Amy',
    creator_avatar: 'https://i.pravatar.cc/150?img=107',
    platform: 'douyin',
    plan_id: 'p006',
    plan_name: '运动健身推广',
    upload_time: timeAgo(7, 8, 0),
    upload_member: '张三',
    update_time: timeAgo(7, 8, 0)
  },
  {
    id: 'sc008',
    file_name: '宠物零食种草文案.pdf',
    file_type: 'pdf',
    file_size: 4718592,
    file_url: '',
    remark: '宠物零食种草内容脚本，新版配方介绍',
    creator_id: 's008',
    creator_name: '宠物达人豆豆',
    creator_account: 'pet_doudou',
    creator_avatar: 'https://i.pravatar.cc/150?img=108',
    platform: 'xiaohongshu',
    plan_id: 'p007',
    plan_name: '宠物用品推广',
    upload_time: timeAgo(8, 15, 45),
    upload_member: '李四',
    update_time: timeAgo(2, 9, 15)
  },
  {
    id: 'sc009',
    file_name: '旅游攻略脚本.pptx',
    file_type: 'ppt',
    file_size: 10485760,
    file_url: '',
    remark: '五一假期旅游攻略短视频脚本',
    creator_id: 's009',
    creator_name: '旅行博主小航',
    creator_account: 'travel_xiaohang',
    creator_avatar: 'https://i.pravatar.cc/150?img=109',
    platform: 'douyin',
    plan_id: '',
    plan_name: '',
    upload_time: timeAgo(9, 10, 0),
    upload_member: '王五',
    update_time: timeAgo(9, 10, 0)
  },
  {
    id: 'sc010',
    file_name: '护肤套装直播脚本.docx',
    file_type: 'word',
    file_size: 3145728,
    file_url: '',
    remark: '618大促护肤套装直播脚本，含话术和互动环节',
    creator_id: 's010',
    creator_name: '美肌达人小美',
    creator_account: 'meiji_xiaomei',
    creator_avatar: 'https://i.pravatar.cc/150?img=110',
    platform: 'douyin',
    plan_id: 'p001',
    plan_name: '夏季美妆推广计划',
    upload_time: timeAgo(10, 13, 30),
    upload_member: '张三',
    update_time: timeAgo(3, 16, 0)
  },
  {
    id: 'sc011',
    file_name: '春装搭配指南.pdf',
    file_type: 'pdf',
    file_size: 5767168,
    file_url: '',
    remark: '',
    creator_id: 's003',
    creator_name: '时尚穿搭小C',
    creator_account: 'shishangCC',
    creator_avatar: 'https://i.pravatar.cc/150?img=103',
    platform: 'xiaohongshu',
    plan_id: 'p002',
    plan_name: '春季时尚计划',
    upload_time: timeAgo(12, 17, 15),
    upload_member: '李四',
    update_time: timeAgo(12, 17, 15)
  },
  {
    id: 'sc012',
    file_name: '耳机测评脚本.txt',
    file_type: 'txt',
    file_size: 204800,
    file_url: '',
    remark: '蓝牙耳机对比测评脚本',
    creator_id: 's005',
    creator_name: '科技小王子',
    creator_account: 'keji_wangzi',
    creator_avatar: 'https://i.pravatar.cc/150?img=105',
    platform: 'douyin',
    plan_id: 'p004',
    plan_name: '数码新品计划',
    upload_time: timeAgo(14, 9, 0),
    upload_member: '王五',
    update_time: timeAgo(14, 9, 0)
  }
]

// 可选达人列表（用于搜索）
const mockCreators = [
  { creator_id: 's001', creator_name: '美妆达人小雅', creator_account: 'meiyanxiaoya', creator_avatar: 'https://i.pravatar.cc/150?img=101', platform: 'douyin' },
  { creator_id: 's002', creator_name: '护肤专家小李', creator_account: 'hufu_lilei', creator_avatar: 'https://i.pravatar.cc/150?img=102', platform: 'douyin' },
  { creator_id: 's003', creator_name: '时尚穿搭小C', creator_account: 'shishangCC', creator_avatar: 'https://i.pravatar.cc/150?img=103', platform: 'xiaohongshu' },
  { creator_id: 's004', creator_name: '吃货小分队', creator_account: 'chihuo_xiaofendui', creator_avatar: 'https://i.pravatar.cc/150?img=104', platform: 'douyin' },
  { creator_id: 's005', creator_name: '科技小王子', creator_account: 'keji_wangzi', creator_avatar: 'https://i.pravatar.cc/150?img=105', platform: 'douyin' },
  { creator_id: 's006', creator_name: '生活家小小', creator_account: 'shenghuojia_xiaoxiao', creator_avatar: 'https://i.pravatar.cc/150?img=106', platform: 'xiaohongshu' },
  { creator_id: 's007', creator_name: '瑜伽教练Amy', creator_account: 'yoga_Amy', creator_avatar: 'https://i.pravatar.cc/150?img=107', platform: 'douyin' },
  { creator_id: 's008', creator_name: '宠物达人豆豆', creator_account: 'pet_doudou', creator_avatar: 'https://i.pravatar.cc/150?img=108', platform: 'xiaohongshu' },
  { creator_id: 's009', creator_name: '旅行博主小航', creator_account: 'travel_xiaohang', creator_avatar: 'https://i.pravatar.cc/150?img=109', platform: 'douyin' },
  { creator_id: 's010', creator_name: '美肌达人小美', creator_account: 'meiji_xiaomei', creator_avatar: 'https://i.pravatar.cc/150?img=110', platform: 'douyin' },
  { creator_id: 's011', creator_name: '穿搭博主Nina', creator_account: 'nina_style', creator_avatar: 'https://i.pravatar.cc/150?img=111', platform: 'xiaohongshu' },
  { creator_id: 's012', creator_name: '美食博主圆圆', creator_account: 'yuanyuan_food', creator_avatar: 'https://i.pravatar.cc/150?img=112', platform: 'douyin' }
]

const mockPlans = [
  { plan_id: 'p001', plan_name: '夏季美妆推广计划' },
  { plan_id: 'p002', plan_name: '春季时尚计划' },
  { plan_id: 'p003', plan_name: '美食探店计划' },
  { plan_id: 'p004', plan_name: '数码新品计划' },
  { plan_id: 'p005', plan_name: '家居生活计划' },
  { plan_id: 'p006', plan_name: '运动健身推广' },
  { plan_id: 'p007', plan_name: '宠物用品推广' }
]

// ==================== API 函数 ====================

/**
 * 获取脚本列表
 */
export function getScriptList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { page = 1, pageSize = 10, keyword = '' } = params

      let filteredList = [...mockScripts]

      if (keyword) {
        const kw = keyword.toLowerCase()
        filteredList = filteredList.filter(item =>
          item.file_name.toLowerCase().includes(kw) ||
          item.creator_name.toLowerCase().includes(kw) ||
          item.creator_account.toLowerCase().includes(kw) ||
          (item.remark && item.remark.toLowerCase().includes(kw))
        )
      }

      // 按上传时间倒序
      filteredList.sort((a, b) => b.upload_time.localeCompare(a.upload_time))

      const total = filteredList.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      resolve({
        code: 0,
        message: 'success',
        data: { list, pagination: { page, pageSize, total } }
      })
    }, MOCK_DELAY)
  })
}

/**
 * 搜索达人
 */
export function searchCreators(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { keyword = '', platform = '' } = params
      let list = [...mockCreators]

      if (platform) {
        list = list.filter(c => c.platform === platform)
      }
      if (keyword) {
        const kw = keyword.toLowerCase()
        list = list.filter(c =>
          c.creator_name.toLowerCase().includes(kw) ||
          c.creator_account.toLowerCase().includes(kw)
        )
      }

      resolve({ code: 0, message: 'success', data: list })
    }, 300)
  })
}

/**
 * 获取计划列表
 */
export function getPlanOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: 'success', data: mockPlans })
    }, MOCK_DELAY)
  })
}

/**
 * 新增脚本
 */
export function createScript(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const uploadTime = timeAgo(0, now.getHours(), now.getMinutes())
      const newScript = {
        id: 'sc' + Date.now(),
        file_name: data.file_name,
        file_type: data.file_type,
        file_size: data.file_size,
        file_url: data.file_url || '',
        remark: data.remark || '',
        creator_id: data.creator_id,
        creator_name: data.creator_name,
        creator_account: data.creator_account,
        creator_avatar: data.creator_avatar,
        platform: data.platform,
        plan_id: data.plan_id || '',
        plan_name: data.plan_name || '',
        upload_time: uploadTime,
        upload_member: '当前用户',
        update_time: uploadTime
      }
      mockScripts.unshift(newScript)
      resolve({ code: 0, message: '保存成功', data: newScript })
    }, MOCK_DELAY)
  })
}

/**
 * 编辑脚本
 */
export function updateScript(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockScripts.findIndex(s => s.id === data.id)
      if (idx === -1) {
        resolve({ code: 1002, message: '脚本不存在', data: null })
        return
      }
      const s = mockScripts[idx]
      if (data.file_name !== undefined) s.file_name = data.file_name
      if (data.file_type !== undefined) s.file_type = data.file_type
      if (data.file_size !== undefined) s.file_size = data.file_size
      if (data.file_url !== undefined) s.file_url = data.file_url
      if (data.remark !== undefined) s.remark = data.remark
      if (data.creator_id !== undefined) s.creator_id = data.creator_id
      if (data.creator_name !== undefined) s.creator_name = data.creator_name
      if (data.creator_account !== undefined) s.creator_account = data.creator_account
      if (data.creator_avatar !== undefined) s.creator_avatar = data.creator_avatar
      if (data.platform !== undefined) s.platform = data.platform
      if (data.plan_id !== undefined) s.plan_id = data.plan_id
      if (data.plan_name !== undefined) s.plan_name = data.plan_name
      s.update_time = timeAgo(0, now.getHours(), now.getMinutes())
      resolve({ code: 0, message: '保存成功', data: s })
    }, MOCK_DELAY)
  })
}

/**
 * 删除脚本
 */
export function deleteScript(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockScripts.findIndex(s => s.id === id)
      if (idx === -1) {
        resolve({ code: 1002, message: '脚本不存在', data: null })
        return
      }
      mockScripts.splice(idx, 1)
      resolve({ code: 0, message: '删除成功', data: null })
    }, MOCK_DELAY)
  })
}

/**
 * 更新脚本备注
 */
export function updateScriptRemark(id, remark) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const s = mockScripts.find(sc => sc.id === id)
      if (!s) {
        resolve({ code: 1002, message: '脚本不存在', data: null })
        return
      }
      s.remark = remark
      s.update_time = timeAgo(0, now.getHours(), now.getMinutes())
      resolve({ code: 0, message: '保存成功', data: s })
    }, MOCK_DELAY)
  })
}

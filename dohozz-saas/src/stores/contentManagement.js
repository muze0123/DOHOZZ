import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
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

export const useContentManagementStore = defineStore('contentManagement', () => {
  // ==================== 平台 Tab ====================
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

  // ==================== 选项数据 ====================
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

  // ==================== Actions ====================

  /**
   * 设置当前平台
   * @param {string} platform - 平台 key
   */
  function setActivePlatform(platform) {
    activePlatform.value = platform
    resetFilters()
    fetchContentList()
    fetchStats()
  }

  /**
   * 设置时间范围
   * @param {string} range - 时间范围 key
   */
  function setTimeRange(range) {
    activeTimeRange.value = range
    fetchContentList()
    fetchStats()
  }

  /**
   * 设置搜索关键词
   * @param {string} keyword - 搜索关键词
   */
  function setSearchKeyword(keyword) {
    searchKeyword.value = keyword
    pagination.page = 1
    fetchContentList()
  }

  /**
   * 设置单个筛选条件
   * @param {string} key - 筛选字段
   * @param {any} value - 筛选值
   */
  function setFilter(key, value) {
    filters[key] = value
    pagination.page = 1
    fetchContentList()
  }

  /**
   * 重置所有筛选条件
   */
  function resetFilters() {
    Object.keys(filters).forEach(key => {
      filters[key] = ''
    })
    searchKeyword.value = ''
    activeTimeRange.value = 'all'
    pagination.page = 1
  }

  /**
   * 设置分页
   * @param {number} page - 页码
   * @param {number} pageSize - 每页条数
   */
  function setPagination(page, pageSize) {
    pagination.page = page
    pagination.pageSize = pageSize
    fetchContentList()
  }

  /**
   * 获取内容列表
   */
  async function fetchContentList() {
    contentLoading.value = true
    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchKeyword.value,
        planId: filters.planId,
        streamerName: filters.streamerName,
        contentTag: filters.contentTag,
        publishForm: filters.publishForm,
        spuId: filters.spuId,
        departmentId: filters.departmentId,
        mediumId: filters.mediumId,
        contentStatus: filters.contentStatus,
        publishTimeStart: filters.publishTimeStart,
        publishTimeEnd: filters.publishTimeEnd,
        createTimeStart: filters.createTimeStart,
        createTimeEnd: filters.createTimeEnd,
        timeRange: activeTimeRange.value
      }

      const api = activePlatform.value === 'douyin' ? getDouyinContents : getXiaohongshuContents
      const res = await api(params)

      if (res.code === 0) {
        contentList.value = res.data.list
        pagination.total = res.data.pagination.total
      }
    } catch (error) {
      ElMessage.error('获取内容列表失败')
    } finally {
      contentLoading.value = false
    }
  }

  /**
   * 获取统计数据
   */
  async function fetchStats() {
    try {
      const res = await getContentStats(activePlatform.value, activeTimeRange.value)

      if (res.code === 0) {
        stats.total = res.data.totalContents
        stats.viewCount = res.data.totalViews
        stats.likeCount = res.data.totalLikes
        stats.commentCount = res.data.totalComments
        stats.collectCount = res.data.totalCollects

        // 格式化数字
        stats.viewCountStr = formatNumberStr(res.data.totalViews)
        stats.likeCountStr = formatNumberStr(res.data.totalLikes)
        stats.commentCountStr = formatNumberStr(res.data.totalComments)
        stats.collectCountStr = formatNumberStr(res.data.totalCollects)
      }
    } catch (error) {
      ElMessage.error('获取统计数据失败')
    }
  }

  /**
   * 格式化数字为字符串
   * @param {number} num - 数字
   * @returns {string} 格式化后的字符串
   */
  function formatNumberStr(num) {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(2) + '亿'
    } else if (num >= 10000) {
      return (num / 10000).toFixed(2) + 'w'
    }
    return num.toString()
  }

  /**
   * 获取所有选项数据
   */
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
      ElMessage.error('获取选项数据失败')
    }
  }

  /**
   * 获取内容详情
   * @param {string} id - 内容ID
   */
  async function fetchContentDetail(id) {
    try {
      const api = activePlatform.value === 'douyin' ? getDouyinContentDetail : getXiaohongshuContentDetail
      const res = await api(id)

      if (res.code === 0) {
        currentContent.value = res.data
      } else {
        ElMessage.error(res.message || '获取内容详情失败')
      }
    } catch (error) {
      ElMessage.error('获取内容详情失败')
    }
  }

  /**
   * 更新内容
   * @param {string} id - 内容ID
   * @param {Object} data - 更新数据
   */
  async function updateContent(id, data) {
    try {
      const api = activePlatform.value === 'douyin' ? updateDouyinContent : updateXiaohongshuContent
      const res = await api(id, data)

      if (res.code === 0) {
        ElMessage.success(res.message || '更新成功')
        fetchContentList()
        fetchStats()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } catch (error) {
      ElMessage.error('更新内容失败')
    }
  }

  /**
   * 删除内容
   * @param {string} id - 内容ID
   */
  async function deleteContent(id) {
    try {
      const api = activePlatform.value === 'douyin' ? deleteDouyinContent : deleteXiaohongshuContent
      const res = await api(id)

      if (res.code === 0) {
        ElMessage.success(res.message || '删除成功')
        fetchContentList()
        fetchStats()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除内容失败')
    }
  }

  /**
   * 归档内容
   * @param {string} id - 内容ID
   */
  async function archiveContent(id) {
    try {
      const api = activePlatform.value === 'douyin' ? archiveDouyinContent : archiveXiaohongshuContent
      const res = await api(id)

      if (res.code === 0) {
        ElMessage.success(res.message || '归档成功')
        fetchContentList()
        fetchStats()
      } else {
        ElMessage.error(res.message || '归档失败')
      }
    } catch (error) {
      ElMessage.error('归档内容失败')
    }
  }

  /**
   * 批量确认内容
   * @param {Array<string>} ids - 内容ID列表
   */
  async function confirmContents(ids) {
    try {
      const api = activePlatform.value === 'douyin' ? confirmDouyinContents : confirmXiaohongshuContents
      const res = await api(ids)

      if (res.code === 0) {
        ElMessage.success(res.message || '确认成功')
        fetchContentList()
        fetchStats()
      } else {
        ElMessage.error(res.message || '确认失败')
      }
    } catch (error) {
      ElMessage.error('确认内容失败')
    }
  }

  /**
   * 导出内容
   */
  async function exportContents() {
    try {
      const api = activePlatform.value === 'douyin' ? exportDouyinContents : exportXiaohongshuContents
      const params = {
        ...filters,
        timeRange: activeTimeRange.value
      }
      const res = await api(params)

      if (res.code === 0) {
        ElMessage.success(res.message || '导出任务已创建')
      } else {
        ElMessage.error(res.message || '导出失败')
      }
    } catch (error) {
      ElMessage.error('导出内容失败')
    }
  }

  // ==================== 弹窗控制 ====================

  /**
   * 打开发布编辑弹窗
   * @param {Object} content - 内容数据（可选）
   */
  function openEditDialog(content = null) {
    currentContent.value = content
    isEditDialogVisible.value = true
  }

  /**
   * 关闭编辑弹窗
   */
  function closeEditDialog() {
    isEditDialogVisible.value = false
    currentContent.value = null
  }

  /**
   * 打开详情弹窗
   * @param {Object} content - 内容数据
   */
  function openDetailDialog(content) {
    currentContent.value = content
    isDetailDialogVisible.value = true
  }

  /**
   * 关闭详情弹窗
   */
  function closeDetailDialog() {
    isDetailDialogVisible.value = false
    currentContent.value = null
  }

  /**
   * 打更多菜单
   * @param {string} contentId - 内容ID
   */
  function openMoreMenu(contentId) {
    currentContentId.value = contentId
    isMoreMenuVisible.value = true
  }

  /**
   * 关闭更多菜单
   */
  function closeMoreMenu() {
    isMoreMenuVisible.value = false
    currentContentId.value = null
  }

  // ==================== 初始化 ====================

  /**
   * 初始化 store
   */
  async function init() {
    await Promise.all([
      fetchOptions(),
      fetchContentList(),
      fetchStats()
    ])
  }

  // ==================== Return ====================

  return {
    // 平台
    platformTabs,
    activePlatform,
    // 筛选条件
    filters,
    // 时间范围
    timeRangeOptions,
    activeTimeRange,
    // 内容列表
    contentList,
    contentLoading,
    // 统计
    stats,
    // 分页
    pagination,
    // 搜索
    searchKeyword,
    // 选项
    planOptions,
    tagOptions,
    spuOptions,
    departmentOptions,
    mediumOptions,
    statusOptions,
    publishFormOptions,
    // 容量
    capacityInfo,
    // 弹窗状态
    isEditDialogVisible,
    isDetailDialogVisible,
    isMoreMenuVisible,
    currentContent,
    currentContentId,
    // Actions
    setActivePlatform,
    setTimeRange,
    setSearchKeyword,
    setFilter,
    resetFilters,
    setPagination,
    fetchContentList,
    fetchStats,
    fetchOptions,
    fetchContentDetail,
    updateContent,
    deleteContent,
    archiveContent,
    confirmContents,
    exportContents,
    openEditDialog,
    closeEditDialog,
    openDetailDialog,
    closeDetailDialog,
    openMoreMenu,
    closeMoreMenu,
    init
  }
})

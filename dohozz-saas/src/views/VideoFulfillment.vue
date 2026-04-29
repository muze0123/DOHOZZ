<template>
  <div class="video-fulfillment">
    <!-- ==================== 平台切换栏 ==================== -->
    <div class="platform-section">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key }"
          @click="handlePlatformChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <!-- ==================== 筛选查询区 ==================== -->
    <VideoFilterSection
      ref="filterSectionRef"
      :filter-params="filterParams"
      :department-options="departmentOptions"
      :bd-options="bdOptions"
      :shop-options="shopOptions"
      :status-options="statusOptions"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- ==================== 数据概览区 ==================== -->
    <VideoStatsSection
      :active-category="activeCategory"
      :stats-data="statsData"
      :category-tabs="categoryTabs"
      :has-selection="selectedVideos.length > 0"
      :update-time="updateTime"
      @category-change="handleCategoryChange"
      @batch-action="handleBatchAction"
      @add-video="handleAddVideo"
      @show-rule="handleShowRule"
    />

    <!-- ==================== 视频列表区 ==================== -->
    <VideoListSection
      :videos="paginatedVideos"
      :loading="loading"
      :sort-field="sortField"
      :sort-order="sortOrder"
      :selected-ids="selectedVideoIds"
      @play="handlePlay"
      @view-detail="handleViewDetail"
      @delete="handleDelete"
      @sort="handleSort"
      @selection-change="handleSelectionChange"
    />

    <!-- ==================== 分页控制区 ==================== -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="filteredVideos.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- ==================== 弹窗组件 ==================== -->
    <VideoPlayerDialog
      v-model="playerDialogVisible"
      :video="currentVideo"
    />

    <VideoDetailDialog
      v-model="detailDialogVisible"
      :video="currentVideo"
    />

    <DeleteDialog
      v-model="deleteDialogVisible"
      :video="currentVideo"
      @success="handleDeleteSuccess"
    />

    <BatchOfflineDialog
      v-model="batchOfflineDialogVisible"
      :selected-count="selectedVideos.length"
      @success="handleBatchOfflineSuccess"
    />

    <BatchExportDialog
      v-model="batchExportDialogVisible"
      :selected-count="selectedVideos.length"
    />

    <LinkImportDialog
      v-model="linkImportDialogVisible"
      @success="handleLinkImportSuccess"
    />

    <ManualAddDialog
      v-model="manualAddDialogVisible"
      :influencer-options="influencerOptions"
      :product-options="productOptions"
      @success="handleManualAddSuccess"
    />

    <UpdateRuleDialog
      v-model="updateRuleDialogVisible"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import VideoFilterSection from './components/VideoFilterSection.vue'
import VideoStatsSection from './components/VideoStatsSection.vue'
import VideoListSection from './components/VideoListSection.vue'
import VideoPlayerDialog from './VideoFulfillment/dialogs/VideoPlayerDialog.vue'
import VideoDetailDialog from './VideoFulfillment/dialogs/VideoDetailDialog.vue'
import DeleteDialog from './VideoFulfillment/dialogs/DeleteDialog.vue'
import BatchOfflineDialog from './VideoFulfillment/dialogs/BatchOfflineDialog.vue'
import BatchExportDialog from './VideoFulfillment/dialogs/BatchExportDialog.vue'
import LinkImportDialog from './VideoFulfillment/dialogs/LinkImportDialog.vue'
import ManualAddDialog from './VideoFulfillment/dialogs/ManualAddDialog.vue'
import UpdateRuleDialog from './VideoFulfillment/dialogs/UpdateRuleDialog.vue'

// ==================== 平台Tab ====================
const platformTabs = [
  { key: 'all', label: '全部' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('all')

// ==================== 筛选参数 ====================
const filterSectionRef = ref(null)

const filterParams = reactive({
  timeRange: [],
  videoKeyword: '',
  influencerKeyword: '',
  productKeyword: '',
  departmentId: '',
  bdId: '',
  shopId: '',
  status: ''
})

const departmentOptions = ref([
  { id: 'dept1', name: '销售部' },
  { id: 'dept2', name: '市场部' },
  { id: 'dept3', name: '运营部' }
])

const bdOptions = ref([
  { id: 'bd1', name: '张三' },
  { id: 'bd2', name: '李四' },
  { id: 'bd3', name: '王五' }
])

const shopOptions = ref([
  { id: 'shop1', name: '官方旗舰店' },
  { id: 'shop2', name: '京东自营店' },
  { id: 'shop3', name: '天猫旗舰店' }
])

const statusOptions = ref([
  { value: '', label: '全部' },
  { value: 'normal', label: '正常' },
  { value: 'offline', label: '下架' },
  { value: 'abnormal', label: '异常' }
])

// ==================== 数据概览 ====================
const activeCategory = ref('all')

const categoryTabs = ref([
  { key: 'all', label: '全部视频', count: 666 },
  { key: 'has_orders', label: '有出单', count: 8 },
  { key: 'no_orders', label: '未出单', count: 10 }
])

const updateTime = ref('2025-09-02 15:11:16')

const statsData = ref({
  videoCount: 666,
  influencerCount: 456,
  totalAmount: 1234567.89,
  refundAmount: 12345.67,
  commission: 98765.43,
  orderCount: 5432
})

// ==================== 视频列表 ====================
const loading = ref(false)
const sortField = ref('')
const sortOrder = ref('')

const videos = ref([
  {
    id: 'V20260420001',
    title: '夏季清爽护肤教程',
    thumbnail: '',
    platform: 'tiktok',
    status: 'normal',
    authCode: 'AUTH202604001',
    publishTime: '2026-04-20 10:30:00',
    influencer: {
      id: 'I001',
      name: '@fashionqueen_k',
      avatar: '',
      level: 'LV5',
      followers: '10.2w'
    },
    product: {
      id: 'P001',
      name: '氨基酸洁面乳',
      image: ''
    },
    bd: '李四',
    shop: '官方旗舰店',
    stats: {
      plays: 123456,
      likes: 6543,
      comments: 321,
      collects: 876,
      shares: 234,
      interactionRate: 6.8,
      dealAmount: 12345.67,
      dealOrders: 89,
      refundAmount: 234.56,
      estimatedCommission: 987.65,
      estimatedGMV: 12345.67
    },
    createTime: '2026-04-15 09:00:00',
    lastOrderTime: '2026-04-23 14:30:00'
  },
  {
    id: 'V20260420002',
    title: '粉底液测评推荐',
    thumbnail: '',
    platform: 'tiktok',
    status: 'normal',
    authCode: 'AUTH202604002',
    publishTime: '2026-04-19 14:00:00',
    influencer: {
      id: 'I002',
      name: '@beauty_sarah',
      avatar: '',
      level: 'LV6',
      followers: '25.8w'
    },
    product: {
      id: 'P002',
      name: '粉底液SPF30',
      image: ''
    },
    bd: '张三',
    shop: '天猫旗舰店',
    stats: {
      plays: 234567,
      likes: 12345,
      comments: 654,
      collects: 1234,
      shares: 456,
      interactionRate: 7.2,
      dealAmount: 23456.78,
      dealOrders: 156,
      refundAmount: 456.78,
      estimatedCommission: 1876.54,
      estimatedGMV: 23456.78
    },
    createTime: '2026-04-14 10:00:00',
    lastOrderTime: '2026-04-22 16:20:00'
  },
  {
    id: 'V20260420003',
    title: '口红色号试色',
    thumbnail: '',
    platform: 'instagram',
    status: 'offline',
    authCode: 'AUTH202604003',
    publishTime: '2026-04-18 09:00:00',
    influencer: {
      id: 'I003',
      name: '@makeup_artist_m',
      avatar: '',
      level: 'LV4',
      followers: '8.5w'
    },
    product: {
      id: 'P003',
      name: '丝绒口红',
      image: ''
    },
    bd: '王五',
    shop: '京东自营店',
    stats: {
      plays: 45678,
      likes: 2345,
      comments: 123,
      collects: 345,
      shares: 67,
      interactionRate: 6.5,
      dealAmount: 0,
      dealOrders: 0,
      refundAmount: 0,
      estimatedCommission: 0,
      estimatedGMV: 0
    },
    createTime: '2026-04-13 11:00:00',
    lastOrderTime: ''
  },
  {
    id: 'V20260420004',
    title: '面膜使用技巧',
    thumbnail: '',
    platform: 'shopee',
    status: 'normal',
    authCode: 'AUTH202604004',
    publishTime: '2026-04-17 16:00:00',
    influencer: {
      id: 'I004',
      name: '@skincare_expert',
      avatar: '',
      level: 'LV5',
      followers: '15.6w'
    },
    product: {
      id: 'P004',
      name: '玻尿酸面膜',
      image: ''
    },
    bd: '李四',
    shop: '官方旗舰店',
    stats: {
      plays: 87654,
      likes: 4567,
      comments: 234,
      collects: 567,
      shares: 123,
      interactionRate: 6.2,
      dealAmount: 8765.43,
      dealOrders: 67,
      refundAmount: 123.45,
      estimatedCommission: 701.23,
      estimatedGMV: 8765.43
    },
    createTime: '2026-04-12 14:00:00',
    lastOrderTime: '2026-04-21 10:15:00'
  },
  {
    id: 'V20260420005',
    title: '防晒霜户外测评',
    thumbnail: '',
    platform: 'lazada',
    status: 'abnormal',
    authCode: 'AUTH202604005',
    publishTime: '2026-04-16 11:00:00',
    influencer: {
      id: 'I005',
      name: '@outdoor_life',
      avatar: '',
      level: 'LV3',
      followers: '5.2w'
    },
    product: {
      id: 'P005',
      name: '防晒霜SPF50+',
      image: ''
    },
    bd: '张三',
    shop: '天猫旗舰店',
    stats: {
      plays: 34567,
      likes: 1234,
      comments: 89,
      collects: 234,
      shares: 45,
      interactionRate: 4.6,
      dealAmount: 3456.78,
      dealOrders: 23,
      refundAmount: 0,
      estimatedCommission: 276.54,
      estimatedGMV: 3456.78
    },
    createTime: '2026-04-11 09:00:00',
    lastOrderTime: '2026-04-20 15:30:00'
  }
])

const selectedVideoIds = ref([])

const filteredVideos = computed(() => {
  let result = videos.value

  if (activePlatform.value !== 'all') {
    result = result.filter(v => v.platform === activePlatform.value)
  }

  if (activeCategory.value === 'has_orders') {
    result = result.filter(v => v.stats.dealOrders > 0)
  } else if (activeCategory.value === 'no_orders') {
    result = result.filter(v => v.stats.dealOrders === 0)
  }

  if (filterParams.timeRange && filterParams.timeRange.length === 2) {
    const [start, end] = filterParams.timeRange
    result = result.filter(v => v.publishTime >= start && v.publishTime <= end + ' 23:59:59')
  }

  if (filterParams.videoKeyword) {
    const kw = filterParams.videoKeyword.toLowerCase()
    result = result.filter(v =>
      v.title.toLowerCase().includes(kw) ||
      v.id.toLowerCase().includes(kw)
    )
  }

  if (filterParams.influencerKeyword) {
    const kw = filterParams.influencerKeyword.toLowerCase()
    result = result.filter(v =>
      v.influencer.name.toLowerCase().includes(kw) ||
      v.influencer.id.toLowerCase().includes(kw)
    )
  }

  if (filterParams.productKeyword) {
    const kw = filterParams.productKeyword.toLowerCase()
    result = result.filter(v =>
      v.product.name.toLowerCase().includes(kw) ||
      v.product.id.toLowerCase().includes(kw)
    )
  }

  if (filterParams.departmentId) {
    // mock filtering by bd
    result = result.filter(v => v.bd.includes('张') === (filterParams.departmentId === 'dept1'))
  }

  if (filterParams.bdId) {
    const bdMap = { bd1: '张三', bd2: '李四', bd3: '王五' }
    result = result.filter(v => v.bd === bdMap[filterParams.bdId])
  }

  if (filterParams.shopId) {
    const shopMap = { shop1: '官方旗舰店', shop2: '京东自营店', shop3: '天猫旗舰店' }
    result = result.filter(v => v.shop === shopMap[filterParams.shopId])
  }

  if (filterParams.status) {
    result = result.filter(v => v.status === filterParams.status)
  }

  if (sortField.value) {
    result = [...result].sort((a, b) => {
      let aVal, bVal
      if (sortField.value === 'plays') { aVal = a.stats.plays; bVal = b.stats.plays }
      else if (sortField.value === 'likes') { aVal = a.stats.likes; bVal = b.stats.likes }
      else if (sortField.value === 'comments') { aVal = a.stats.comments; bVal = b.stats.comments }
      else if (sortField.value === 'collects') { aVal = a.stats.collects; bVal = b.stats.collects }
      else if (sortField.value === 'shares') { aVal = a.stats.shares; bVal = b.stats.shares }
      else if (sortField.value === 'interactionRate') { aVal = a.stats.interactionRate; bVal = b.stats.interactionRate }
      else if (sortField.value === 'dealAmount') { aVal = a.stats.dealAmount; bVal = b.stats.dealAmount }
      else if (sortField.value === 'dealOrders') { aVal = a.stats.dealOrders; bVal = b.stats.dealOrders }
      else if (sortField.value === 'refundAmount') { aVal = a.stats.refundAmount; bVal = b.stats.refundAmount }
      else if (sortField.value === 'estimatedCommission') { aVal = a.stats.estimatedCommission; bVal = b.stats.estimatedCommission }
      else if (sortField.value === 'estimatedGMV') { aVal = a.stats.estimatedGMV; bVal = b.stats.estimatedGMV }
      else if (sortField.value === 'createTime') { aVal = a.createTime; bVal = b.createTime }
      else if (sortField.value === 'lastOrderTime') { aVal = a.lastOrderTime || ''; bVal = b.lastOrderTime || '' }
      else return 0

      if (sortOrder.value === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })
  }

  return result
})

const paginatedVideos = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredVideos.value.slice(start, end)
})

// ==================== 分页 ====================
const pagination = reactive({
  page: 1,
  pageSize: 10
})

// ==================== 弹窗状态 ====================
const playerDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const batchOfflineDialogVisible = ref(false)
const batchExportDialogVisible = ref(false)
const linkImportDialogVisible = ref(false)
const manualAddDialogVisible = ref(false)
const updateRuleDialogVisible = ref(false)

const currentVideo = ref(null)
const selectedVideos = ref([])

// ==================== 下拉选项 ====================
const influencerOptions = ref([
  { id: 'I001', name: '@fashionqueen_k' },
  { id: 'I002', name: '@beauty_sarah' },
  { id: 'I003', name: '@makeup_artist_m' },
  { id: 'I004', name: '@skincare_expert' },
  { id: 'I005', name: '@outdoor_life' }
])

const productOptions = ref([
  { id: 'P001', name: '氨基酸洁面乳' },
  { id: 'P002', name: '粉底液SPF30' },
  { id: 'P003', name: '丝绒口红' },
  { id: 'P004', name: '玻尿酸面膜' },
  { id: 'P005', name: '防晒霜SPF50+' }
])

// ==================== 方法 ====================

// 平台切换
function handlePlatformChange(platform) {
  activePlatform.value = platform
  pagination.page = 1
}

// 分类切换
function handleCategoryChange(category) {
  activeCategory.value = category
  pagination.page = 1
}

// 排序
function handleSort(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
}

// 选择
function handleSelectionChange(ids) {
  selectedVideoIds.value = ids
  selectedVideos.value = videos.value.filter(v => ids.includes(v.id))
}

// 查询
function handleQuery() {
  pagination.page = 1
  ElMessage.success('查询成功')
}

// 重置
function handleReset() {
  filterSectionRef.value?.reset()
  pagination.page = 1
  ElMessage.success('重置成功')
}

// 播放
function handlePlay(video) {
  currentVideo.value = video
  playerDialogVisible.value = true
}

// 详情
function handleViewDetail(video) {
  currentVideo.value = video
  detailDialogVisible.value = true
}

// 删除
function handleDelete(video) {
  currentVideo.value = video
  deleteDialogVisible.value = true
}

function handleDeleteSuccess() {
  const idx = videos.value.findIndex(v => v.id === currentVideo.value.id)
  if (idx > -1) {
    videos.value.splice(idx, 1)
  }
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
}

// 批量操作
function handleBatchAction(action) {
  if (selectedVideos.value.length === 0) {
    ElMessage.warning('请至少选择一个视频')
    return
  }
  if (action === 'offline') {
    batchOfflineDialogVisible.value = true
  } else if (action === 'export') {
    batchExportDialogVisible.value = true
  }
}

function handleBatchOfflineSuccess() {
  ElMessage.success('下架成功')
  batchOfflineDialogVisible.value = false
}

// 添加视频
function handleAddVideo(type) {
  if (type === 'link') {
    linkImportDialogVisible.value = true
  } else if (type === 'manual') {
    manualAddDialogVisible.value = true
  }
}

function handleLinkImportSuccess() {
  ElMessage.success('导入成功')
  linkImportDialogVisible.value = false
}

function handleManualAddSuccess() {
  ElMessage.success('添加成功')
  manualAddDialogVisible.value = false
}

// 数据更新规则
function handleShowRule() {
  updateRuleDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.video-fulfillment {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

// ==================== 平台切换栏 ====================
.platform-section {
  @extend .platform-section;
  margin-bottom: 0;
}

.platform-tabs {
  @extend .platform-tabs;
}

.platform-tab {
  @extend .platform-tab;
}

// ==================== 分页区 ====================
.pagination-section {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

// ==================== Toast提示样式 ====================
:deep(.success-toast) {
  --el-message-bg-color: #00cc66;
}

:deep(.warning-toast) {
  --el-message-bg-color: #ff6600;
}
</style>

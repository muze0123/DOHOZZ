<template>
  <div class="cooperation-management">
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
    <CooperationFilterSection
      ref="filterSectionRef"
      :filter-params="filterParams"
      :department-options="departmentOptions"
      :bd-options="bdOptions"
      :shop-options="shopOptions"
      :mode-options="modeOptions"
      :create-type-options="createTypeOptions"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- ==================== 合作单管理区 ==================== -->
    <CooperationListSection
      :cooperations="paginatedCooperations"
      :loading="loading"
      :active-status="activeStatus"
      :status-tabs="statusTabs"
      :sort-field="sortField"
      :sort-order="sortOrder"
      :selected-ids="selectedCooperationIds"
      :update-time="updateTime"
      :has-selection="selectedCooperations.length > 0"
      @status-change="handleStatusChange"
      @sort="handleSort"
      @selection-change="handleSelectionChange"
      @view-detail="handleViewDetail"
      @edit="handleEdit"
      @delete="handleDelete"
      @show-rule="handleShowRule"
      @batch-action="handleBatchAction"
      @add="handleAdd"
      @copy="handleCopy"
      @show-products="handleShowProducts"
      @show-create-type-rule="handleShowCreateTypeRule"
    />

    <!-- ==================== 分页控制区 ==================== -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="filteredCooperations.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- ==================== 弹窗组件 ==================== -->
    <AddCooperationDialog
      v-model="addDialogVisible"
      :influencer-options="influencerOptions"
      :bd-options="bdOptions"
      :shop-options="shopOptions"
      :product-options="productOptions"
      :mode-options="modeOptions"
      @success="handleAddSuccess"
    />

    <EditCooperationDialog
      v-model="editDialogVisible"
      :cooperation="currentCooperation"
      :influencer-options="influencerOptions"
      :bd-options="bdOptions"
      :shop-options="shopOptions"
      :product-options="productOptions"
      :mode-options="modeOptions"
      @success="handleEditSuccess"
    />

    <CooperationDetailDialog
      v-model="detailDialogVisible"
      :cooperation="currentCooperation"
    />

    <DeleteDialog
      v-model="deleteDialogVisible"
      :cooperation="currentCooperation"
      @success="handleDeleteSuccess"
    />

    <BatchCancelDialog
      v-model="batchCancelDialogVisible"
      :selected-count="selectedCooperations.length"
      @success="handleBatchCancelSuccess"
    />

    <BatchExportDialog
      v-model="batchExportDialogVisible"
      :selected-count="selectedCooperations.length"
    />

    <ProductListDialog
      v-model="productListDialogVisible"
      :products="currentProducts"
    />

    <CreateTypeRuleDialog
      v-model="createTypeRuleDialogVisible"
    />

    <UpdateRuleDialog
      v-model="updateRuleDialogVisible"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import CooperationFilterSection from './components/CooperationFilterSection.vue'
import CooperationListSection from './components/CooperationListSection.vue'
import AddCooperationDialog from './CooperationManagement/dialogs/AddCooperationDialog.vue'
import EditCooperationDialog from './CooperationManagement/dialogs/EditCooperationDialog.vue'
import CooperationDetailDialog from './CooperationManagement/dialogs/CooperationDetailDialog.vue'
import DeleteDialog from './CooperationManagement/dialogs/DeleteDialog.vue'
import BatchCancelDialog from './CooperationManagement/dialogs/BatchCancelDialog.vue'
import BatchExportDialog from './CooperationManagement/dialogs/BatchExportDialog.vue'
import ProductListDialog from './CooperationManagement/dialogs/ProductListDialog.vue'
import CreateTypeRuleDialog from './CooperationManagement/dialogs/CreateTypeRuleDialog.vue'
import UpdateRuleDialog from './CooperationManagement/dialogs/UpdateRuleDialog.vue'

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
  cooperationId: '',
  productKeyword: '',
  influencerKeyword: '',
  departmentId: '',
  bdId: '',
  shopId: '',
  mode: '',
  createType: '',
  createTimeRange: []
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

const modeOptions = ref([
  { value: '', label: '全部' },
  { value: 'commission', label: '佣金模式' },
  { value: 'slot_fee', label: '坑位费模式' },
  { value: 'mixed', label: '混合模式' }
])

const createTypeOptions = ref([
  { value: '', label: '全部' },
  { value: 'manual', label: '手动创建' },
  { value: 'auto', label: '系统自动创建' }
])

// ==================== 状态分类 ====================
const activeStatus = ref('all')

const statusTabs = ref([
  { key: 'all', label: '全部', count: 888 },
  { key: 'pending', label: '待交付', count: 66 },
  { key: 'delivering', label: '交付中', count: 66 },
  { key: 'finished', label: '已结束', count: 66 },
  { key: 'cancelled', label: '已取消', count: 66 }
])

const updateTime = ref('2025-09-02 15:11:16')

// ==================== 合作单列表 ====================
const loading = ref(false)
const sortField = ref('')
const sortOrder = ref('')

const cooperations = ref([
  {
    id: 'C20260420001',
    platform: 'tiktok',
    status: 'pending',
    influencer: {
      id: 'I001',
      name: '@fashionqueen_k',
      avatar: '',
      followers: '10.2w'
    },
    deliveryStartTime: '2026-05-01',
    deliveryEndTime: '2026-05-31',
    bd: '李四',
    shop: '官方旗舰店',
    dealAmount: 12345.67,
    settleAmount: 9876.54,
    slotFee: 0,
    mode: 'commission',
    products: [
      { id: 'P001', name: '氨基酸洁面乳', image: '', quantity: 1 }
    ],
    createType: 'manual',
    createTime: '2026-04-20 10:30:00',
    note: '长期合作优先'
  },
  {
    id: 'C20260420002',
    platform: 'tiktok',
    status: 'delivering',
    influencer: {
      id: 'I002',
      name: '@beauty_sarah',
      avatar: '',
      followers: '25.8w'
    },
    deliveryStartTime: '2026-04-15',
    deliveryEndTime: '2026-05-15',
    bd: '张三',
    shop: '天猫旗舰店',
    dealAmount: 45678.90,
    settleAmount: 36543.12,
    slotFee: 5000,
    mode: 'mixed',
    products: [
      { id: 'P002', name: '粉底液SPF30', image: '', quantity: 2 },
      { id: 'P003', name: '丝绒口红', image: '', quantity: 1 }
    ],
    createType: 'manual',
    createTime: '2026-04-18 14:00:00',
    note: ''
  },
  {
    id: 'C20260420003',
    platform: 'instagram',
    status: 'finished',
    influencer: {
      id: 'I003',
      name: '@makeup_artist_m',
      avatar: '',
      followers: '8.5w'
    },
    deliveryStartTime: '2026-03-01',
    deliveryEndTime: '2026-03-31',
    bd: '王五',
    shop: '京东自营店',
    dealAmount: 23456.78,
    settleAmount: 18765.43,
    slotFee: 3000,
    mode: 'slot_fee',
    products: [
      { id: 'P003', name: '丝绒口红', image: '', quantity: 1 }
    ],
    createType: 'auto',
    createTime: '2026-02-28 09:00:00',
    note: '已完成交付'
  },
  {
    id: 'C20260420004',
    platform: 'shopee',
    status: 'cancelled',
    influencer: {
      id: 'I004',
      name: '@skincare_expert',
      avatar: '',
      followers: '15.6w'
    },
    deliveryStartTime: '2026-05-10',
    deliveryEndTime: '2026-06-10',
    bd: '李四',
    shop: '官方旗舰店',
    dealAmount: 0,
    settleAmount: 0,
    slotFee: 2000,
    mode: 'slot_fee',
    products: [
      { id: 'P004', name: '玻尿酸面膜', image: '', quantity: 3 }
    ],
    createType: 'manual',
    createTime: '2026-04-10 16:00:00',
    note: '达人档期冲突取消'
  },
  {
    id: 'C20260420005',
    platform: 'lazada',
    status: 'pending',
    influencer: {
      id: 'I005',
      name: '@outdoor_life',
      avatar: '',
      followers: '5.2w'
    },
    deliveryStartTime: '2026-05-15',
    deliveryEndTime: '2026-06-15',
    bd: '张三',
    shop: '天猫旗舰店',
    dealAmount: 0,
    settleAmount: 0,
    slotFee: 1500,
    mode: 'slot_fee',
    products: [
      { id: 'P005', name: '防晒霜SPF50+', image: '', quantity: 1 }
    ],
    createType: 'manual',
    createTime: '2026-04-22 11:00:00',
    note: ''
  }
])

const selectedCooperationIds = ref([])
const selectedCooperations = ref([])

const filteredCooperations = computed(() => {
  let result = cooperations.value

  if (activePlatform.value !== 'all') {
    result = result.filter(c => c.platform === activePlatform.value)
  }

  if (activeStatus.value !== 'all') {
    result = result.filter(c => c.status === activeStatus.value)
  }

  if (filterParams.cooperationId) {
    const kw = filterParams.cooperationId.toLowerCase()
    result = result.filter(c => c.id.toLowerCase().includes(kw))
  }

  if (filterParams.productKeyword) {
    const kw = filterParams.productKeyword.toLowerCase()
    result = result.filter(c =>
      c.products.some(p => p.name.toLowerCase().includes(kw) || p.id.toLowerCase().includes(kw))
    )
  }

  if (filterParams.influencerKeyword) {
    const kw = filterParams.influencerKeyword.toLowerCase()
    result = result.filter(c =>
      c.influencer.name.toLowerCase().includes(kw) ||
      c.influencer.id.toLowerCase().includes(kw)
    )
  }

  if (filterParams.bdId) {
    const bdMap = { bd1: '张三', bd2: '李四', bd3: '王五' }
    result = result.filter(c => c.bd === bdMap[filterParams.bdId])
  }

  if (filterParams.shopId) {
    const shopMap = { shop1: '官方旗舰店', shop2: '京东自营店', shop3: '天猫旗舰店' }
    result = result.filter(c => c.shop === shopMap[filterParams.shopId])
  }

  if (filterParams.mode) {
    result = result.filter(c => c.mode === filterParams.mode)
  }

  if (filterParams.createType) {
    result = result.filter(c => c.createType === filterParams.createType)
  }

  if (filterParams.createTimeRange && filterParams.createTimeRange.length === 2) {
    const [start, end] = filterParams.createTimeRange
    result = result.filter(c => c.createTime >= start && c.createTime <= end + ' 23:59:59')
  }

  if (sortField.value) {
    result = [...result].sort((a, b) => {
      let aVal, bVal
      if (sortField.value === 'dealAmount') { aVal = a.dealAmount; bVal = b.dealAmount }
      else if (sortField.value === 'settleAmount') { aVal = a.settleAmount; bVal = b.settleAmount }
      else if (sortField.value === 'slotFee') { aVal = a.slotFee; bVal = b.slotFee }
      else if (sortField.value === 'createTime') { aVal = a.createTime; bVal = b.createTime }
      else return 0

      if (sortOrder.value === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })
  }

  return result
})

const paginatedCooperations = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredCooperations.value.slice(start, end)
})

// ==================== 分页 ====================
const pagination = reactive({
  page: 1,
  pageSize: 10
})

// ==================== 弹窗状态 ====================
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const batchCancelDialogVisible = ref(false)
const batchExportDialogVisible = ref(false)
const productListDialogVisible = ref(false)
const createTypeRuleDialogVisible = ref(false)
const updateRuleDialogVisible = ref(false)

const currentCooperation = ref(null)
const currentProducts = ref([])

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

// 状态切换
function handleStatusChange(status) {
  activeStatus.value = status
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
  selectedCooperationIds.value = ids
  selectedCooperations.value = cooperations.value.filter(c => ids.includes(c.id))
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

// 详情
function handleViewDetail(cooperation) {
  currentCooperation.value = cooperation
  detailDialogVisible.value = true
}

// 编辑
function handleEdit(cooperation) {
  currentCooperation.value = cooperation
  editDialogVisible.value = true
}

// 删除
function handleDelete(cooperation) {
  currentCooperation.value = cooperation
  deleteDialogVisible.value = true
}

function handleDeleteSuccess() {
  const idx = cooperations.value.findIndex(c => c.id === currentCooperation.value.id)
  if (idx > -1) {
    cooperations.value.splice(idx, 1)
  }
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
}

// 新增
function handleAdd() {
  addDialogVisible.value = true
}

function handleAddSuccess() {
  ElMessage.success('添加成功')
  addDialogVisible.value = false
}

// 编辑成功
function handleEditSuccess() {
  ElMessage.success('编辑成功')
  editDialogVisible.value = false
}

// 批量操作
function handleBatchAction(action) {
  if (selectedCooperations.value.length === 0) {
    ElMessage.warning('请至少选择一个合作单')
    return
  }
  if (action === 'cancel') {
    batchCancelDialogVisible.value = true
  } else if (action === 'export') {
    batchExportDialogVisible.value = true
  }
}

function handleBatchCancelSuccess() {
  ElMessage.success('取消成功')
  batchCancelDialogVisible.value = false
}

// 商品列表
function handleShowProducts(cooperation) {
  currentProducts.value = cooperation.products
  productListDialogVisible.value = true
}

// 复制
function handleCopy(text) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

// 创建类型说明
function handleShowCreateTypeRule() {
  createTypeRuleDialogVisible.value = true
}

// 数据更新规则
function handleShowRule() {
  updateRuleDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

.cooperation-management {
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

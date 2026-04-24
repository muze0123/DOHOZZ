<template>
  <div class="leader-list">
    <!-- ==================== 平台切换栏 ==================== -->
    <div class="platform-section">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key, disabled: !tab.enabled }"
          @click="tab.enabled && handlePlatformChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <!-- ==================== 筛选条件区 ==================== -->
    <LeaderFilterSection
      ref="filterSectionRef"
      :filter-params="filterParams"
      :department-options="departmentOptions"
      :bd-options="bdOptions"
      :shop-options="shopOptions"
      :mode-options="modeOptions"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- ==================== 操作按钮区 ==================== -->
    <div class="action-bar">
      <div class="action-left">
        <el-button @click="handleBatchTransfer" :disabled="selectedLeaders.length === 0">批量转移</el-button>
        <el-button @click="handleExport" :disabled="selectedLeaders.length === 0">导出</el-button>
      </div>
      <div class="action-right">
        <el-dropdown trigger="click" @command="handleAddLeader">
          <el-button type="primary">
            + 添加团长合作
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="import">批量导入合作团长</el-dropdown-item>
              <el-dropdown-item command="collect">收录团长</el-dropdown-item>
              <el-dropdown-item command="manual">手动添加团长</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- ==================== 数据指标区 ==================== -->
    <LeaderStatsSection :stats-data="statsData" />

    <!-- ==================== 团长列表区 ==================== -->
    <LeaderListSection
      :leaders="paginatedLeaders"
      :loading="loading"
      :sort-field="sortField"
      :sort-order="sortOrder"
      :selected-ids="selectedLeaderIds"
      @sort="handleSort"
      @selection-change="handleSelectionChange"
      @edit="handleEdit"
      @transfer="handleTransfer"
      @follow-up="handleFollowUp"
      @edit-remark="handleEditRemark"
      @view-detail="handleViewDetail"
    />

    <!-- ==================== 分页控制区 ==================== -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="filteredLeaders.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- ==================== 弹窗组件 ==================== -->
    <TransferLeaderDialog
      v-model="transferDialogVisible"
      :leader="currentLeader"
      :bd-options="bdOptions"
      @success="handleTransferSuccess"
    />

    <ExportConfirmDialog
      v-model="exportDialogVisible"
      @confirm="handleExportConfirm"
    />

    <EditRemarkDialog
      v-model="editRemarkDialogVisible"
      :leader="currentLeader"
      @success="handleEditRemarkSuccess"
    />

    <AddLeaderDialog
      v-model="addLeaderDialogVisible"
      :bd-options="bdOptions"
      :shop-options="shopOptions"
      @success="handleAddLeaderSuccess"
    />

    <ImportLeaderDialog
      v-model="importDialogVisible"
      @success="handleImportSuccess"
    />

    <FollowUpDialog
      v-model="followUpDialogVisible"
      :leader="currentLeader"
    />

    <LeaderDetailDialog
      v-model="detailDialogVisible"
      :leader="currentLeader"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import LeaderFilterSection from './components/LeaderFilterSection.vue'
import LeaderStatsSection from './components/LeaderStatsSection.vue'
import LeaderListSection from './components/LeaderListSection.vue'
import TransferLeaderDialog from './LeaderList/dialogs/TransferLeaderDialog.vue'
import ExportConfirmDialog from './LeaderList/dialogs/ExportConfirmDialog.vue'
import EditRemarkDialog from './LeaderList/dialogs/EditRemarkDialog.vue'
import AddLeaderDialog from './LeaderList/dialogs/AddLeaderDialog.vue'
import ImportLeaderDialog from './LeaderList/dialogs/ImportLeaderDialog.vue'
import FollowUpDialog from './LeaderList/dialogs/FollowUpDialog.vue'
import LeaderDetailDialog from './LeaderList/dialogs/LeaderDetailDialog.vue'

// ==================== 平台Tab ====================
const platformTabs = [
  { key: 'tiktok', label: 'TikTok', enabled: true },
  { key: 'instagram', label: 'Instagram', enabled: false },
  { key: 'shopee', label: 'Shopee', enabled: false },
  { key: 'lazada', label: 'Lazada', enabled: false }
]
const activePlatform = ref('tiktok')

// ==================== 筛选参数 ====================
const filterSectionRef = ref(null)

const filterParams = reactive({
  leaderKeyword: '',
  departmentId: '',
  bdId: '',
  shopIds: [],
  mode: '',
  timeRange: []
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
  { value: 'leader', label: '团长归属' },
  { value: 'activity', label: '活动归属' },
  { value: 'influencer', label: '达人归属' },
  { value: 'product', label: '商品归属' },
  { value: 'unassigned', label: '未归属' }
])

// ==================== 数据指标 ====================
const statsData = ref({
  dealAmount: 1234567.89,
  dealAmountChange: -3.6,
  settleAmount: 987654.32,
  settleAmountChange: -3.6,
  refundAmount: 12345.67,
  refundAmountChange: -3.6,
  serviceFee: 45678.90,
  serviceFeeChange: -3.6,
  leaderWithOrders: 28,
  leaderWithOrdersChange: -3.6,
  influencerWithOrders: 156,
  influencerWithOrdersChange: -3.6
})

// ==================== 团长列表 ====================
const loading = ref(false)
const sortField = ref('')
const sortOrder = ref('')

const leaders = ref([
  {
    id: 'L20260420001',
    name: '美妆达人团长小王',
    avatar: '',
    level: 'LV8',
    category: '美妆个护',
    bdList: ['张三', '李四'],
    mode: 'leader',
    activityCount: 15,
    dealAmount: 23456.78,
    settleAmount: 18765.43,
    refundAmount: 234.56,
    serviceFee: 1876.54,
    influencerCount: 45,
    productCount: 23,
    videoCount: 89,
    liveCount: 12,
    latestFollow: '已确认合作意向，计划下周开始推广',
    remark: '长期合作优先',
    homeUrl: 'https://example.com/leader/001'
  },
  {
    id: 'L20260420002',
    name: '护肤专家李老师',
    avatar: '',
    level: 'LV7',
    category: '美妆个护',
    bdList: ['王五'],
    mode: 'activity',
    activityCount: 8,
    dealAmount: 12345.67,
    settleAmount: 9876.54,
    refundAmount: 123.45,
    serviceFee: 987.65,
    influencerCount: 28,
    productCount: 15,
    videoCount: 45,
    liveCount: 5,
    latestFollow: '等待样品寄出',
    remark: '',
    homeUrl: 'https://example.com/leader/002'
  },
  {
    id: 'L20260420003',
    name: '母婴达人团长妈咪',
    avatar: '',
    level: 'LV6',
    category: '母婴用品',
    bdList: ['张三'],
    mode: 'influencer',
    activityCount: 12,
    dealAmount: 34567.89,
    settleAmount: 27654.32,
    refundAmount: 345.67,
    serviceFee: 2765.43,
    influencerCount: 67,
    productCount: 34,
    videoCount: 123,
    liveCount: 18,
    latestFollow: '已完成第一场直播，效果良好',
    remark: '重点维护客户',
    homeUrl: 'https://example.com/leader/003'
  },
  {
    id: 'L20260420004',
    name: '服饰搭配师阿东',
    avatar: '',
    level: 'LV5',
    category: '服饰鞋包',
    bdList: ['李四', '王五'],
    mode: 'product',
    activityCount: 5,
    dealAmount: 8765.43,
    settleAmount: 7012.34,
    refundAmount: 87.65,
    serviceFee: 701.23,
    influencerCount: 18,
    productCount: 12,
    videoCount: 34,
    liveCount: 3,
    latestFollow: '',
    remark: '',
    homeUrl: 'https://example.com/leader/004'
  },
  {
    id: 'L20260420005',
    name: '数码达人老王',
    avatar: '',
    level: 'LV9',
    category: '数码电器',
    bdList: ['张三', '李四', '王五'],
    mode: 'unassigned',
    activityCount: 22,
    dealAmount: 56789.01,
    settleAmount: 45431.21,
    refundAmount: 567.89,
    serviceFee: 4543.12,
    influencerCount: 89,
    productCount: 45,
    videoCount: 178,
    liveCount: 25,
    latestFollow: '合作效果显著，计划扩大合作规模',
    remark: '高潜力团长',
    homeUrl: 'https://example.com/leader/005'
  }
])

const selectedLeaderIds = ref([])
const selectedLeaders = ref([])

const filteredLeaders = computed(() => {
  let result = leaders.value

  if (filterParams.leaderKeyword) {
    const kw = filterParams.leaderKeyword.toLowerCase()
    result = result.filter(l =>
      l.name.toLowerCase().includes(kw) ||
      l.id.toLowerCase().includes(kw)
    )
  }

  if (filterParams.bdId) {
    result = result.filter(l => l.bdList.some(bd => bd === getBdName(filterParams.bdId)))
  }

  if (filterParams.mode) {
    result = result.filter(l => l.mode === filterParams.mode)
  }

  if (filterParams.timeRange && filterParams.timeRange.length === 2) {
    // Time filtering logic would go here
  }

  if (sortField.value) {
    result = [...result].sort((a, b) => {
      let aVal, bVal
      if (sortField.value === 'activityCount') { aVal = a.activityCount; bVal = b.activityCount }
      else if (sortField.value === 'dealAmount') { aVal = a.dealAmount; bVal = b.dealAmount }
      else if (sortField.value === 'settleAmount') { aVal = a.settleAmount; bVal = b.settleAmount }
      else if (sortField.value === 'refundAmount') { aVal = a.refundAmount; bVal = b.refundAmount }
      else if (sortField.value === 'serviceFee') { aVal = a.serviceFee; bVal = b.serviceFee }
      else if (sortField.value === 'influencerCount') { aVal = a.influencerCount; bVal = b.influencerCount }
      else if (sortField.value === 'productCount') { aVal = a.productCount; bVal = b.productCount }
      else if (sortField.value === 'videoCount') { aVal = a.videoCount; bVal = b.videoCount }
      else if (sortField.value === 'liveCount') { aVal = a.liveCount; bVal = b.liveCount }
      else return 0

      if (sortOrder.value === 'asc') return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })
  }

  return result
})

const paginatedLeaders = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredLeaders.value.slice(start, end)
})

// ==================== 分页 ====================
const pagination = reactive({
  page: 1,
  pageSize: 10
})

// ==================== 弹窗状态 ====================
const transferDialogVisible = ref(false)
const exportDialogVisible = ref(false)
const editRemarkDialogVisible = ref(false)
const addLeaderDialogVisible = ref(false)
const importDialogVisible = ref(false)
const followUpDialogVisible = ref(false)
const detailDialogVisible = ref(false)

const currentLeader = ref(null)

// ==================== 方法 ====================

function getBdName(bdId) {
  const map = { bd1: '张三', bd2: '李四', bd3: '王五' }
  return map[bdId] || ''
}

function handlePlatformChange(platform) {
  activePlatform.value = platform
  pagination.page = 1
}

function handleSort(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
}

function handleSelectionChange(ids) {
  selectedLeaderIds.value = ids
  selectedLeaders.value = leaders.value.filter(l => ids.includes(l.id))
}

function handleQuery() {
  pagination.page = 1
  ElMessage.success('查询成功')
}

function handleReset() {
  filterSectionRef.value?.reset()
  pagination.page = 1
  ElMessage.success('重置成功')
}

function handleBatchTransfer() {
  if (selectedLeaders.value.length === 0) {
    ElMessage.warning('请至少选择一个团长')
    return
  }
  currentLeader.value = selectedLeaders.value[0]
  transferDialogVisible.value = true
}

function handleExport() {
  if (selectedLeaders.value.length === 0) {
    ElMessage.warning('请至少选择一个团长')
    return
  }
  exportDialogVisible.value = true
}

function handleExportConfirm() {
  ElMessage.success('导出成功')
  exportDialogVisible.value = false
}

function handleAddLeader(type) {
  if (type === 'import') {
    importDialogVisible.value = true
  } else if (type === 'manual') {
    addLeaderDialogVisible.value = true
  } else if (type === 'collect') {
    ElMessage.info('收录团长功能开发中')
  }
}

function handleTransfer(leader) {
  currentLeader.value = leader
  transferDialogVisible.value = true
}

function handleTransferSuccess() {
  ElMessage.success('转移成功')
  transferDialogVisible.value = false
}

function handleEdit(leader) {
  currentLeader.value = leader
  ElMessage.info('编辑合作功能开发中')
}

function handleFollowUp(leader) {
  currentLeader.value = leader
  followUpDialogVisible.value = true
}

function handleEditRemark(leader) {
  currentLeader.value = leader
  editRemarkDialogVisible.value = true
}

function handleEditRemarkSuccess() {
  ElMessage.success('保存成功')
  editRemarkDialogVisible.value = false
}

function handleViewDetail(leader) {
  currentLeader.value = leader
  detailDialogVisible.value = true
}

function handleAddLeaderSuccess() {
  ElMessage.success('添加成功')
  addLeaderDialogVisible.value = false
}

function handleImportSuccess() {
  ElMessage.success('导入成功')
  importDialogVisible.value = false
}
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

.leader-list {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

.platform-section {
  @extend .platform-section;
  margin-bottom: 0;
}

.platform-tabs {
  @extend .platform-tabs;
}

.platform-tab {
  @extend .platform-tab;

  &.disabled {
    color: #ccc;
    cursor: not-allowed;
    border-bottom-color: transparent;

    &:hover {
      color: #ccc;
    }
  }
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.action-left,
.action-right {
  display: flex;
  gap: 8px;
}

.pagination-section {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

:deep(.success-toast) {
  --el-message-bg-color: #00cc66;
}

:deep(.warning-toast) {
  --el-message-bg-color: #ff6600;
}
</style>

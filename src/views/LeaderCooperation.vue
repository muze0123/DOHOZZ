<template>
  <div class="leader-cooperation">
    <!-- 平台Tab区 -->
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
          <svg v-if="tab.icon" class="platform-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path :d="tab.icon" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 筛选条件区 -->
    <div class="filter-section">
      <div class="filter-header" @click="filterCollapsed = !filterCollapsed">
        <span>筛选条件</span>
        <svg class="collapse-icon" :class="{ collapsed: filterCollapsed }" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div v-show="!filterCollapsed" class="filter-content">
        <div class="filter-row">
          <div class="filter-item">
            <label>团长搜索</label>
            <el-input v-model="filters.leaderSearch" placeholder="请输入团长名称/ID" clearable style="width: 200px" @keyup.enter="handleQuery" />
          </div>
          <div class="filter-item">
            <label>合作单ID</label>
            <el-input v-model="filters.cooperationId" placeholder="请输入合作单ID" clearable style="width: 200px" @keyup.enter="handleQuery" />
          </div>
          <div class="filter-item">
            <label>所属部门</label>
            <el-select v-model="filters.departmentId" placeholder="请选择部门" filterable clearable style="width: 180px">
              <el-option v-for="dept in departmentOptions" :key="dept.id" :label="dept.name" :value="dept.id" />
            </el-select>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-item">
            <label>所属BD</label>
            <el-select v-model="filters.bdId" placeholder="请选择BD" filterable clearable style="width: 180px">
              <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>店铺名称</label>
            <el-select v-model="filters.shopIds" placeholder="请选择店铺" filterable multiple clearable style="width: 200px">
              <el-option v-for="shop in shopOptions" :key="shop.id" :label="shop.name" :value="shop.id" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>归属模式</label>
            <el-select v-model="filters.mode" placeholder="请选择归属模式" filterable multiple clearable style="width: 180px">
              <el-option v-for="mode in modeOptions" :key="mode.value" :label="mode.label" :value="mode.value" />
            </el-select>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-item">
            <label>合作单状态</label>
            <el-select v-model="filters.status" placeholder="请选择状态" filterable clearable style="width: 150px">
              <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>时间筛选</label>
            <el-date-picker
              v-model="filters.timeRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px"
            />
          </div>
          <div class="filter-item">
            <label>创建时间</label>
            <el-date-picker
              v-model="filters.createTimeRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px"
            />
          </div>
        </div>
        <div class="filter-row filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-bar">
      <div class="action-left">
        <el-button :disabled="!selectedRows.length" @click="handleBatchDelete">批量删除</el-button>
        <el-button disabled title="导出功能开发中">导出</el-button>
      </div>
      <div class="action-right">
        <el-button type="primary" @click="handleAdd">+ 添加团长合作</el-button>
      </div>
    </div>

    <!-- 数据列表区 -->
    <div class="list-section">
      <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%; min-width: 1400px"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column label="合作信息" min-width="220" fixed="left">
          <template #default="{ row }">
            <div class="leader-info">
              <el-avatar :size="36" :src="row.leaderAvatar" class="leader-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="leader-detail">
                <div class="leader-name" @click="handleLeaderClick(row)">{{ row.leaderName }}</div>
                <div class="cooperation-id">
                  <span class="id-text">{{ row.cooperationId }}</span>
                  <span class="id-link" @click="handleDetailClick(row)">合作单ID&gt;</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合作时间" min-width="140">
          <template #default="{ row }">
            <div class="time-range">
              <span>{{ row.startTime }}</span>
              <span>至 {{ row.endTime || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合作BD" min-width="100">
          <template #default="{ row }">
            <el-tooltip :content="row.bdName" placement="top" :show-after="300">
              <span class="bd-name">{{ row.bdName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="归属模式" min-width="100">
          <template #default="{ row }">
            <span class="mode-tag" :class="row.mode">{{ getModeText(row.mode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="90" sortable :sort-orders="['ascending', 'descending']">
          <template #default="{ row }">
            <div class="status-cell">
              <span class="status-dot" :class="row.status"></span>
              <span>{{ getStatusText(row.status) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="成交金额" min-width="100" sortable :sort-orders="['ascending', 'descending']" align="right">
          <template #default="{ row }">
            <span class="amount">¥{{ formatMoney(row.dealAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出单达人数" min-width="100" sortable :sort-orders="['ascending', 'descending']" align="right">
          <template #default="{ row }">
            <span>{{ row.influencerCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出单链接数" min-width="100" sortable :sort-orders="['ascending', 'descending']" align="right">
          <template #default="{ row }">
            <span>{{ row.linkCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160" sortable :sort-orders="['ascending', 'descending']">
          <template #default="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <template v-if="['pending', 'active'].includes(row.status)">
                <span class="action-link" @click="handleEdit(row)">编辑</span>
                <span class="action-link" @click="handleCancel(row)">取消</span>
              </template>
              <span class="action-link" @click="handleDetailClick(row)">详情</span>
              <span class="action-link danger" @click="handleDelete(row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区 -->
    <div class="pagination-section">
      <Pagination
        v-model="paginationState"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
      />
    </div>

    <!-- 弹窗组件 -->
    <AddCooperationDialog v-model="addDialogVisible" @success="handleDialogSuccess" />
    <EditCooperationDialog v-model="editDialogVisible" :cooperation="currentCooperation" @success="handleDialogSuccess" />
    <CancelCooperationDialog v-model="cancelDialogVisible" :cooperation="currentCooperation" @success="handleDialogSuccess" />
    <DeleteCooperationDialog v-model="deleteDialogVisible" :cooperation="currentCooperation" @success="handleDialogSuccess" />
    <BatchDeleteDialog v-model="batchDeleteDialogVisible" :ids="selectedIds" @success="handleDialogSuccess" />
    <ExportConfirmDialog v-model="exportDialogVisible" @confirm="handleExportConfirm" />
    <CooperationDetailDialog v-model="detailDialogVisible" :cooperation="currentCooperation" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import AddCooperationDialog from './LeaderCooperation/dialogs/AddCooperationDialog.vue'
import EditCooperationDialog from './LeaderCooperation/dialogs/EditCooperationDialog.vue'
import CancelCooperationDialog from './LeaderCooperation/dialogs/CancelCooperationDialog.vue'
import DeleteCooperationDialog from './LeaderCooperation/dialogs/DeleteCooperationDialog.vue'
import BatchDeleteDialog from './LeaderCooperation/dialogs/BatchDeleteDialog.vue'
import ExportConfirmDialog from './LeaderCooperation/dialogs/ExportConfirmDialog.vue'
import CooperationDetailDialog from './LeaderCooperation/dialogs/CooperationDetailDialog.vue'
import Pagination from '@/components/Pagination.vue'

// 平台Tab配置
const platformTabs = [
  { key: 'tiktok', label: 'TikTok', enabled: true, icon: '<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.84a4.83 4.83 0 0 1-1.01-.15z"/>' },
  { key: 'instagram', label: 'Instagram', enabled: false, icon: '<path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>' },
  { key: 'shopee', label: 'Shopee', enabled: false, icon: '<path d="M22 12.22a1.88 1.88 0 0 0-1.05-1.65 9.88 9.88 0 0 0-5.6-1.8l1.3-1.8a.6.6 0 0 0-.09-.86.61.61 0 0 0-.82.12l-2.73 3.76a.6.6 0 0 0 .2.83l1.42 1a.62.62 0 0 0 .76-.14l1.4-1.95a11.7 11.7 0 0 1 6.4 2.1.6.6 0 0 0 .79-.47l.77-3.34a.59.59 0 0 0-.2-.67z"/>' },
  { key: 'lazada', label: 'Lazada', enabled: false, icon: '<path d="M22 8.18L11.28 1.07a1.12 1.12 0 0 0-1.03 0L.54 8.18a1.02 1.02 0 0 0-.4.81v5.5a1.02 1.02 0 0 0 .53.9l8.94 5.19a1.12 1.12 0 0 0 1.06 0l8.94-5.19a1.02 1.02 0 0 0 .53-.9v-5.5a1.02 1.02 0 0 0-.54-.81z"/>' }
]

const activePlatform = ref('tiktok')
const filterCollapsed = ref(false)

// 筛选条件
const filters = reactive({
  leaderSearch: '',
  cooperationId: '',
  departmentId: null,
  bdId: null,
  shopIds: [],
  mode: [],
  status: null,
  timeRange: [],
  createTimeRange: []
})

// 选项数据
const departmentOptions = ref([
  { id: 1, name: '商务部' },
  { id: 2, name: '运营部' },
  { id: 3, name: '销售部' }
])

const bdOptions = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' }
])

const shopOptions = ref([
  { id: 1, name: '旗舰店A' },
  { id: 2, name: '专卖店B' },
  { id: 3, name: '专营店C' }
])

const modeOptions = [
  { value: 'leader', label: '团长归属' },
  { value: 'activity', label: '活动归属' },
  { value: 'influencer', label: '达人归属' },
  { value: 'product', label: '商品归属' },
  { value: 'unassigned', label: '未归属' }
]

const statusOptions = [
  { value: 'pending', label: '未开始' },
  { value: 'active', label: '进行中' },
  { value: 'ended', label: '已结束' },
  { value: 'cancelled', label: '已取消' }
]

// 表格数据 - Mock数据
const mockTableData = [
  { id: 1, cooperationId: 'C202603150001', leaderName: '美妆达人小王', leaderAvatar: '', startTime: '2026-03-01', endTime: '', bdName: '张三', mode: 'leader', status: 'active', dealAmount: 125680.50, influencerCount: 23, linkCount: 45, createTime: '2026-03-01 10:30:00' },
  { id: 2, cooperationId: 'C202603140002', leaderName: '服饰团长优选', leaderAvatar: '', startTime: '2026-02-15', endTime: '2026-03-15', bdName: '李四', mode: 'activity', status: 'ended', dealAmount: 89230.00, influencerCount: 15, linkCount: 28, createTime: '2026-02-15 14:20:00' },
  { id: 3, cooperationId: 'C202603130003', leaderName: '母婴好物推荐', leaderAvatar: '', startTime: '2026-04-01', endTime: '', bdName: '王五', mode: 'influencer', status: 'pending', dealAmount: 0, influencerCount: 0, linkCount: 0, createTime: '2026-03-13 09:15:00' },
  { id: 4, cooperationId: 'C202603120004', leaderName: '数码科技大咖', leaderAvatar: '', startTime: '2026-01-10', endTime: '2026-02-10', bdName: '张三', mode: 'product', status: 'cancelled', dealAmount: 45200.00, influencerCount: 8, linkCount: 12, createTime: '2026-01-10 11:45:00' },
  { id: 5, cooperationId: 'C202603110005', leaderName: '家居生活家', leaderAvatar: '', startTime: '2026-03-20', endTime: '', bdName: '赵六', mode: 'leader', status: 'active', dealAmount: 67890.00, influencerCount: 18, linkCount: 32, createTime: '2026-03-11 16:30:00' }
]

const tableData = ref(mockTableData)
const selectedRows = ref([])
const tableRef = ref(null)

// 分页
const paginationState = ref({ page: 1, pageSize: 10 })
const total = ref(40)
const totalPages = computed(() => Math.ceil(total.value / paginationState.value.pageSize))

// 弹窗状态
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const batchDeleteDialogVisible = ref(false)
const exportDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentCooperation = ref(null)

// 方法
function handlePlatformChange(platform) {
  activePlatform.value = platform
  handleReset()
}

function handleQuery() {
  if (filters.timeRange && filters.timeRange.length === 2) {
    const [start, end] = filters.timeRange
    if (start && end && start > end) {
      ElMessage.warning('开始日期不能晚于结束日期')
      return
    }
  }
  ElMessage.success('查询成功')
  currentPage.value = 1
}

function handleReset() {
  filters.leaderSearch = ''
  filters.cooperationId = ''
  filters.departmentId = null
  filters.bdId = null
  filters.shopIds = []
  filters.mode = []
  filters.status = null
  filters.timeRange = []
  filters.createTimeRange = []
  ElMessage.success('重置成功')
  currentPage.value = 1
}

function handleSelectionChange(selection) {
  selectedRows.value = selection
}

function handleAdd() {
  currentCooperation.value = null
  addDialogVisible.value = true
}

function handleEdit(row) {
  currentCooperation.value = row
  editDialogVisible.value = true
}

function handleCancel(row) {
  currentCooperation.value = row
  cancelDialogVisible.value = true
}

function handleDelete(row) {
  currentCooperation.value = row
  deleteDialogVisible.value = true
}

function handleDetailClick(row) {
  currentCooperation.value = row
  detailDialogVisible.value = true
}

function handleLeaderClick(row) {
  ElMessage.info('跳转团长详情页面（后续开发）')
}

function handleBatchDelete() {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先选择要删除的记录')
    return
  }
  batchDeleteDialogVisible.value = true
}

function handleExportConfirm() {
  ElMessage.success('导出任务已提交，请前往任务中心查看')
  exportDialogVisible.value = false
}

function handleDialogSuccess() {
  ElMessage.success('操作成功')
}

function handleSizeChange() {
  currentPage.value = 1
}

function handleCurrentChange() {
  // 重新加载数据
}

function getModeText(mode) {
  return { leader: '团长归属', activity: '活动归属', influencer: '达人归属', product: '商品归属', unassigned: '未归属' }[mode] || mode
}

function getStatusText(status) {
  return { pending: '未开始', active: '进行中', ended: '已结束', cancelled: '已取消' }[status] || status
}

function formatMoney(v) {
  return v ? v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '0.00'
}

const selectedIds = computed(() => selectedRows.value.map(r => r.id))
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

.leader-cooperation {
  padding: 16px 0 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.platform-section {
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.platform-tabs {
  display: flex;
  gap: 8px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;

  &:hover:not(.disabled) {
    background: #f0f5ff;
    color: #0064e0;
  }

  &.active {
    background: #0064e0;
    color: #fff;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .platform-icon {
    width: 16px;
    height: 16px;
  }
}

.filter-section {
  background: #fff;
  padding: 0 16px 16px;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;

  .collapse-icon {
    transition: transform 0.3s;

    &.collapsed {
      transform: rotate(-90deg);
    }
  }
}

.filter-content {
  .filter-row {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    flex-wrap: wrap;

    &.filter-actions {
      justify-content: flex-end;
      margin-top: 8px;
    }
  }

  .filter-item {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      font-size: 13px;
      color: #666;
      white-space: nowrap;
    }
  }
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;

  .action-left {
    display: flex;
    gap: 8px;
  }
}

.list-section {
  background: #fff;
  padding: 16px;
}

.leader-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .leader-avatar {
    flex-shrink: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .leader-detail {
    min-width: 0;
  }

  .leader-name {
    font-size: 14px;
    color: #1677ff;
    cursor: pointer;
    margin-bottom: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  .cooperation-id {
    font-size: 12px;
    color: #999;

    .id-text {
      margin-right: 4px;
    }

    .id-link {
      color: #1677ff;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.time-range {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.bd-name {
  font-size: 13px;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.mode-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;

  &.leader { background: #e6f4ff; color: #1677ff; }
  &.activity { background: #fff7e6; color: #ff6600; }
  &.influencer { background: #f9f0ff; color: #722ed1; }
  &.product { background: #e6fffb; color: #00856a; }
  &.unassigned { background: #f5f5f5; color: #999; }
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.pending { background: #999; }
    &.active { background: #52c41a; }
    &.ended { background: #ff4d4f; }
    &.cancelled { background: #999; }
  }
}

.amount {
  font-size: 14px;
  color: #00cc66;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
  font-size: 13px;

  .action-link {
    color: #1677ff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }

    &.danger {
      color: #ff4d4f;
    }
  }
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;

  .pagination-info {
    font-size: 14px;
    color: #666;
  }
}
</style>

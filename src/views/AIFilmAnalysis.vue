<template>
  <div class="ai-film-analysis-page">
    <!-- 区域一：Tab切换栏 -->
    <div class="tabs-header">
      <div
        class="tab-item"
        :class="{ active: activeTab === 'AI拉片' }"
        @click="handleTabChange('AI拉片')"
      >
        AI拉片
      </div>
      <div
        class="tab-item disabled"
        @click="handleTabChange('AI脚本')"
      >
        AI脚本
      </div>
    </div>

    <!-- 区域二：筛选条件区 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item" style="width: 220px;">
          <span class="filter-label">任务搜索</span>
          <el-input v-model="filters.taskSearch" placeholder="请输入任务名称/任务ID" clearable />
        </div>
        <div class="filter-item" style="width: 220px;">
          <span class="filter-label">达人搜索</span>
          <el-input v-model="filters.influencerSearch" placeholder="请输入达人名称/达人ID" clearable />
        </div>
        <div class="filter-item" style="width: 180px;">
          <span class="filter-label">任务状态</span>
          <el-select v-model="filters.status" placeholder="全部">
            <el-option label="全部" value="全部" />
            <el-option label="待开始" value="待开始" />
            <el-option label="执行中" value="执行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已终止" value="已终止" />
          </el-select>
        </div>
        <div class="filter-item" style="width: 220px;">
          <span class="filter-label">店铺</span>
          <el-select v-model="filters.shop" placeholder="所有店铺" filterable>
            <el-option label="所有店铺" value="所有店铺" />
            <el-option label="DOHOZZ旗舰店" value="DOHOZZ旗舰店" />
            <el-option label="DOHOZZ官方店" value="DOHOZZ官方店" />
            <el-option label="测试店铺" value="测试店铺" />
          </el-select>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-item" style="width: 260px;">
          <span class="filter-label">完成时间</span>
          <el-date-picker
            v-model="filters.finishTime"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div class="filter-item" style="width: 200px;">
          <span class="filter-label">创建人</span>
          <el-select v-model="filters.creator" placeholder="全部" filterable>
            <el-option label="全部" value="全部" />
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
          </el-select>
        </div>
        <div class="filter-item" style="width: 260px;">
          <span class="filter-label">创建时间</span>
          <el-date-picker
            v-model="filters.createTime"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>

        <FilterActions @query="applyFilters" @reset="resetFilters" />
      </div>
    </div>

    <!-- 区域三：任务列表区 -->
    <div class="list-section">
      <div class="list-header">
        <div class="list-title">任务列表</div>
        <el-button type="primary" @click="handleCreateTask" class="btn-create">
          + 新增拉片任务
        </el-button>
      </div>

      <div class="overview-banner">
        <div class="overview-item">
          <div class="overview-label">拉片任务</div>
          <div class="overview-value">25</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">分析视频数</div>
          <div class="overview-value">158</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">提取卖点数</div>
          <div class="overview-value">486</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">生成脚本数</div>
          <div class="overview-value">120</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">完成率</div>
          <div class="overview-value">75.95%</div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th style="flex: 2">任务</th>
              <th style="width: 120px">店铺</th>
              <th style="width: 100px">任务状态</th>
              <th style="width: 130px">分析视频数</th>
              <th style="width: 120px">提取卖点数</th>
              <th style="width: 150px">任务开始时间</th>
              <th style="width: 150px">任务完成时间</th>
              <th style="width: 70px">创建人</th>
              <th style="width: 150px" class="sortable">创建时间 <span class="sort-icon">↕</span></th>
              <th style="width: 120px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredList.length === 0">
              <td colspan="10">
                <div class="empty-state">
                  <svg class="empty-icon" viewBox="0 0 64 64" width="64" height="64" fill="#E8E8E8">
                    <path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2zm0 56C17.664 58 6 46.336 6 32S17.664 6 32 6s26 11.664 26 26-11.664 26-26 26zm14-28H18v-4h28v4z"/>
                  </svg>
                  <p>暂无相关任务，请调整筛选条件</p>
                </div>
              </td>
            </tr>
            <tr v-for="item in filteredList" :key="item.id">
              <td style="flex: 2">
                <div class="task-name" @click="handleTaskDetail(item)">{{ item.name }}</div>
                <div class="task-id">
                  ID：{{ item.id }}
                  <span class="copy-icon" @click="handleCopy(item.id)">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  </span>
                </div>
              </td>
              <td style="width: 120px">{{ item.shop }}</td>
              <td style="width: 100px">
                <div class="status-tag" :class="getStatusClass(item.status)">
                  <span class="status-dot"></span>
                  {{ item.status }}
                </div>
              </td>
              <td style="width: 130px">
                <div class="plan-count">{{ item.videoCount }}</div>
                <div v-if="item.status === '执行中'" class="progress-bar-wrapper">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (item.completedCount / item.videoCount * 100) + '%' }"></div>
                  </div>
                </div>
              </td>
              <td style="width: 120px">{{ item.sellingPointCount }}</td>
              <td style="width: 150px" class="time-col">{{ item.startTime }}</td>
              <td style="width: 150px" class="time-col">{{ item.endTime || '– –' }}</td>
              <td style="width: 70px">{{ item.creator }}</td>
              <td style="width: 150px" class="time-col">{{ item.createTime }}</td>
              <td style="width: 120px">
                <div class="action-links">
                  <span @click="handleTaskDetail(item)">详情</span>
                  <span v-if="item.status === '待开始'" @click="handleEdit(item)">编辑</span>
                  <span v-if="['待开始', '执行中'].includes(item.status)" @click="handlePause(item)">暂停</span>
                  <span v-if="item.status === '已暂停'" @click="handleResume(item)">恢复</span>
                  <span v-if="['待开始', '执行中', '已暂停'].includes(item.status)" @click="handleTerminateDialog(item)">终止</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 区域四：分页栏 -->
    <div class="pagination-section" v-if="filteredList.length > 0">
      <Pagination
        v-model="pagination"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
      />
    </div>

    <!-- 终止任务确认弹窗 -->
    <el-dialog
      v-model="showTerminateModal"
      title="确认终止该AI拉片任务吗？"
      width="400px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="terminate-content">
        终止后不可恢复，请谨慎操作。
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTerminateModal = false">取消</el-button>
          <el-button type="primary" @click="confirmTerminate">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import FilterActions from '@/components/FilterActions.vue'
import Pagination from '@/components/Pagination.vue'

const activeTab = ref('AI拉片')

const filters = reactive({
  taskSearch: '',
  influencerSearch: '',
  status: '全部',
  shop: '所有店铺',
  finishTime: [],
  creator: '全部',
  createTime: []
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 3
})

// Mock Data
const tableData = ref([
  { id: '20001', name: '美妆产品拉片任务', shop: 'DOHOZZ旗舰店', status: '已完成', videoCount: 50, completedCount: 50, sellingPointCount: 120, startTime: '2025-10-01 10:00:00', endTime: '2025-10-05 18:00:00', creator: '张三', createTime: '2025-09-28 10:00:00' },
  { id: '20002', name: '数码产品卖点分析', shop: 'DOHOZZ官方店', status: '执行中', videoCount: 30, completedCount: 18, sellingPointCount: 54, startTime: '2025-10-08 09:00:00', endTime: '– –', creator: '李四', createTime: '2025-10-07 14:30:00' },
  { id: '20003', name: '服装品类视频分析', shop: '测试店铺', status: '待开始', videoCount: 20, completedCount: 0, sellingPointCount: 0, startTime: '– –', endTime: '– –', creator: '王五', createTime: '2025-10-10 09:15:00' },
])

const filteredList = computed(() => {
  let result = tableData.value

  if (filters.status !== '全部') {
    result = result.filter(item => item.status === filters.status)
  }
  if (filters.taskSearch) {
    result = result.filter(item => item.name.includes(filters.taskSearch) || item.id === filters.taskSearch)
  }

  return result
})

const handleTabChange = (tabName) => {
  if (tabName === 'AI脚本') {
    ElMessage.info('功能建设中，敬请期待')
    return
  }
  activeTab.value = tabName
}

const resetFilters = () => {
  filters.taskSearch = ''
  filters.influencerSearch = ''
  filters.status = '全部'
  filters.shop = '所有店铺'
  filters.finishTime = []
  filters.creator = '全部'
  filters.createTime = []
  pagination.page = 1
}

const applyFilters = () => {
  pagination.page = 1
}

const showTerminateModal = ref(false)
const terminatingItem = ref(null)

const handleTerminateDialog = (item) => {
  terminatingItem.value = item
  showTerminateModal.value = true
}

const confirmTerminate = () => {
  if (terminatingItem.value) {
    terminatingItem.value.status = '已终止'
    ElMessage.success('终止任务成功')
  }
  showTerminateModal.value = false
  terminatingItem.value = null
}

const handlePause = (item) => {
  item.status = '已暂停'
  ElMessage.success('暂停成功')
}

const handleResume = (item) => {
  item.status = '执行中'
  ElMessage.success('恢复成功')
}

const handleCopy = (id) => {
  navigator.clipboard.writeText(id).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const handleCreateTask = () => {
  ElMessage.success('跳转新增拉片任务...')
}

const handleEdit = (item) => {
  ElMessage.success(`编辑任务: ${item.name}`)
}

const handleTaskDetail = (item) => {
  ElMessage.success(`打开任务详情: ${item.name}`)
}

const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
}

const handlePageChange = (page) => {
  pagination.page = page
}

const getStatusClass = (status) => {
  const map = {
    '待开始': 'status-pending',
    '执行中': 'status-running',
    '已完成': 'status-completed',
    '已暂停': 'status-paused',
    '已终止': 'status-terminated'
  }
  return map[status] || ''
}
</script>

<style lang="scss" scoped>
.ai-film-analysis-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
}

/* 区域一：顶部 Tab */
.tabs-header {
  display: flex;
  height: 52px;
  background: #FFFFFF;
  border-bottom: 1px solid #F0F0F0;
  padding: 0 24px;
  gap: 32px;
  margin-bottom: 16px;
}

.tab-item {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 15px;
  font-weight: 400;
  color: #595959;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: #262626;
  }

  &.active {
    font-size: 16px;
    font-weight: 700;
    color: #262626;
    border-bottom: 2px solid #262626;
  }

  &.disabled {
    color: #BFBFBF;
    cursor: not-allowed;

    &:hover {
      color: #BFBFBF;
    }
  }
}

/* 区域二：筛选条件 */
.filter-section {
  background: #FFFFFF;
  padding: 16px 24px;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row {
  display: flex;
  align-items: center;
  height: 44px;
  gap: 24px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .filter-label {
    flex-shrink: 0;
    font-size: 13px;
    color: #595959;
    text-align: right;
  }

  :deep(.el-input__wrapper), :deep(.el-select__wrapper) {
    box-shadow: 0 0 0 1px #D9D9D9 inset;
    height: 32px;
    border-radius: 4px;

    &.is-focus {
      box-shadow: 0 0 0 1px #1677FF inset;
    }
  }

  :deep(.el-input__inner) {
    font-size: 13px;
    &::placeholder {
      color: #BFBFBF;
    }
  }

  :deep(.el-date-editor) {
    width: 100%;
    height: 32px;
    .el-range-input {
      font-size: 13px;
    }
  }
}


/* 区域三：任务列表 */
.list-section {
  background: #FFFFFF;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 0 24px;

  .list-title {
    font-size: 15px;
    font-weight: 600;
    color: #262626;
  }

  .btn-create {
    height: 32px;
    padding: 0 16px;
    border-radius: 4px;
    background: #1677FF;
    font-size: 13px;
  }
}

.overview-banner {
  display: flex;
  background: #F7F8FA;
  padding: 16px 24px;

  .overview-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #E8E8E8;
    padding-left: 16px;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      border-right: none;
    }

    .overview-label {
      font-size: 12px;
      color: #8C8C8C;
      margin-bottom: 6px;
    }

    .overview-value {
      font-size: 20px;
      font-weight: 600;
      color: #262626;
    }
  }
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th, td {
    text-align: left;
    padding: 12px 16px;
    box-sizing: border-box;
  }

  th {
    height: 44px;
    background: #FAFAFA;
    font-size: 13px;
    color: #8C8C8C;
    font-weight: 400;
    border-bottom: 1px solid #F0F0F0;

    &.sortable {
      cursor: pointer;
      .sort-icon {
        font-size: 10px;
        margin-left: 2px;
      }
    }
  }

  td {
    min-height: 56px;
    border-bottom: 1px solid #F5F5F5;
    font-size: 14px;
    color: #262626;
    vertical-align: middle;
  }

  tr:hover td {
    background-color: #FAFAFA;
  }
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  cursor: pointer;
  margin-bottom: 4px;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #1677FF;
  }
}

.task-id {
  font-size: 12px;
  color: #8C8C8C;
  display: flex;
  align-items: center;

  .copy-icon {
    margin-left: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #BFBFBF;

    &:hover {
      color: #1677FF;
    }
  }
}

.time-col {
  font-size: 13px;
  color: #595959;
}

/* 状态标签 */
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  white-space: nowrap;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
  }

  &.status-pending {
    background: #F5F5F5;
    color: #595959;
    .status-dot { background: #D9D9D9; }
  }
  &.status-running {
    background: #E6F4FF;
    color: #1677FF;
    .status-dot { background: #1677FF; }
  }
  &.status-completed {
    background: #F6FFED;
    color: #52C41A;
    .status-dot { background: #52C41A; }
  }
  &.status-paused {
    background: #FFF7E6;
    color: #FA8C16;
    .status-dot { background: #FA8C16; }
  }
  &.status-terminated {
    background: #FFF2F0;
    color: #FF4D4F;
    .status-dot { background: #FF4D4F; }
  }
}

/* 进度条 */
.plan-count {
  margin-bottom: 4px;
}

.progress-bar-wrapper {
  margin-top: 4px;
}

.progress-bar {
  width: 140px;
  height: 6px;
  background: #E8E8E8;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1677FF;
  border-radius: 3px;
}

/* 操作链接 */
.action-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  span {
    color: #1677FF;
    font-size: 13px;
    cursor: pointer;

    &:hover {
      color: #4096FF;
      text-decoration: underline;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #8C8C8C;
  font-size: 14px;

  .empty-icon {
    margin-bottom: 16px;
  }
}

/* 区域四：分页栏 */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  padding: 12px 24px;
  border-top: 1px solid #F0F0F0;
  margin-top: 16px;

  :deep(.el-pagination) {
    justify-content: center;

    .el-pager li {
      background: #FFFFFF;
      border: none;
      border-radius: 4px;
      margin: 0 4px;
      min-width: 32px;
      height: 32px;
      color: #595959;
      font-weight: 400;

      &:hover {
        border-color: #1677FF;
        color: #1677FF;
      }

      &.is-active {
        background: #1677FF;
        border-color: #1677FF;
        color: #FFFFFF;
      }
    }

    button {
      background: #FFFFFF;
      border: none;
      border-radius: 4px;
      height: 32px;
      min-width: 32px;
      margin: 0 4px;

      &:hover:not(:disabled) {
        border-color: #1677FF;
        color: #1677FF;
      }
    }

    .el-select .el-input {
      width: 100px;
    }
  }

  .custom-total {
    margin-left: 16px;
    font-size: 13px;
    color: #595959;
  }
}

/* 弹窗通用 */
:deep(.custom-dialog) {
  .el-dialog__header {
    border-bottom: 1px solid #F0F0F0;
    margin-right: 0;
    padding: 16px 24px;

    .el-dialog__title {
      font-size: 15px;
      font-weight: 600;
      color: #262626;
    }
  }
  .el-dialog__body {
    padding: 24px;
  }
  .el-dialog__footer {
    border-top: 1px solid #F0F0F0;
    padding: 12px 24px;
  }
  .terminate-content {
    font-size: 13px;
    color: #595959;
  }
  .readonly-text {
    font-size: 14px;
    color: #262626;
  }
}
</style>

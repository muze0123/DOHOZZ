<template>
  <div class="white-list">
    <!-- ==================== 平台Tab区 ==================== -->
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

    <!-- ==================== 搜索区 ==================== -->
    <div class="search-section">
      <div class="search-row">
        <div class="search-item">
          <span class="search-label">达人搜索:</span>
          <el-input
            v-model="influencerSearch"
            placeholder="请输入达人名称/达人ID"
            class="search-input"
            clearable
          />
        </div>
        <div class="search-item">
          <span class="search-label">矩阵号搜索:</span>
          <el-input
            v-model="matrixSearch"
            placeholder="请输入矩阵号名称"
            class="search-input"
            clearable
          />
        </div>
        <div class="search-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- ==================== 列表标题区 ==================== -->
    <div class="list-header">
      <h3 class="section-title">白名单</h3>
      <p class="section-desc">白名单内的达人与绑定矩阵，不受自动释放公海规则限制，可以长期留在指定BD手上。(仅支持管理员操作白名单)</p>
    </div>

    <!-- ==================== 工具栏 ==================== -->
    <div class="toolbar-section">
      <div class="toolbar-right">
        <el-dropdown @command="handleBatchCommand" trigger="click">
          <el-button type="primary" class="add-btn">
            <el-icon><Plus /></el-icon>
            添加白名单达人
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </el-dropdown>
      </div>
    </div>

    <!-- ==================== 数据表格 ==================== -->
    <div class="table-section">
      <el-table
        :data="paginatedData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'addTime', order: 'descending' }"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="达人" min-width="220" fixed="left">
          <template #default="{ row }">
            <div class="influencer-cell">
              <el-avatar :size="46" :src="row.avatar" class="inf-avatar clickable" @click="goToDetail(row)">
                <template #default>
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI0U4QThFOiIvPjwvc3ZnPg==" />
                </template>
              </el-avatar>
              <div class="inf-info">
                <div class="inf-name">
                  <span class="username">@{{ row.username }}</span>
                  <el-icon v-if="row.verified" class="verified-icon"><CircleCheck /></el-icon>
                  <el-tag size="small" class="level-tag" :style="{ background: '#FFE6F0', color: '#FF66CC' }">
                    {{ row.level }}
                  </el-tag>
                </div>
                <div class="inf-realname">{{ row.name }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="粉丝数" width="120" align="right" sortable>
          <template #default="{ row }">
            <div class="follower-cell">
              <span>{{ formatFollowers(row.followers) }}</span>
              <el-icon class="follower-icon"><User /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合作状态" width="120" align="center">
          <template #default="{ row }">
            <div class="status-cell">
              <span v-if="row.bdName" class="bd-name">{{ row.bdName }}</span>
              <el-tag v-if="row.status" size="small" class="status-tag" :style="{ background: '#E6F0FF', color: '#0066FF' }">
                {{ row.status }}
              </el-tag>
              <span v-else class="no-status">{{ row.defaultStatus }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="100" align="center">
          <template #default="{ row }">
            <span class="operator">{{ row.operator }}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="180" align="center" sortable prop="addTime">
          <template #default="{ row }">
            <span class="add-time">{{ row.addTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link size="small" @click="handleExport(row)">移出</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-area">
        <Pagination
          v-model="paginationState"
          :total="totalCount"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </div>

    <!-- ==================== 批量操作弹窗 ==================== -->
    <!-- 批量移出弹窗 -->
    <el-dialog v-model="isRemoveDialogVisible" title="批量移出白名单" width="480px">
      <div class="dialog-content">
        <p class="dialog-tip warning">确定要移出选中的 <span class="highlight">{{ selectedRows.length }}</span> 位达人吗？</p>
        <p class="dialog-sub-tip">移出后达人将受自动释放公海规则限制</p>
      </div>
      <template #footer>
        <el-button @click="isRemoveDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmBatchRemove">移出</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus, ArrowDown, CircleCheck, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

// 平台Tab
const platformTabs = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('tiktok')

// 搜索
const influencerSearch = ref('')
const matrixSearch = ref('')

// 工具栏
const totalCount = ref(40)
const selectedRows = ref([])

// 分页
const paginationState = ref({ page: 1, pageSize: 10 })

// 弹窗
const isRemoveDialogVisible = ref(false)

// 模拟数据
const mockData = ref([
  {
    id: 1,
    avatar: '',
    username: 'fashionqueen_k',
    name: 'Kelly Chen',
    level: 'LV5',
    verified: true,
    followers: 102200,
    defaultStatus: '未跟进',
    operator: '张三',
    addTime: '2025-08-06 17:28:40'
  },
  {
    id: 2,
    avatar: '',
    username: 'techreview_mike',
    name: 'Mike Liu',
    level: 'LV4',
    verified: true,
    followers: 102200,
    bdName: '张三',
    status: '待邀约',
    operator: '张三',
    addTime: '2025-08-06 17:28:40'
  },
  {
    id: 3,
    avatar: '',
    username: 'beauty_sarah',
    name: 'Sarah Wong',
    level: 'LV5',
    verified: false,
    followers: 156000,
    defaultStatus: '未跟进',
    operator: '李四',
    addTime: '2025-08-05 14:20:10'
  },
  {
    id: 4,
    avatar: '',
    username: 'foodie_james',
    name: 'James Tan',
    level: 'LV3',
    verified: true,
    followers: 45600,
    bdName: '李四',
    status: '待跟进',
    operator: '李四',
    addTime: '2025-08-04 09:15:30'
  },
  {
    id: 5,
    avatar: '',
    username: 'sports_pro',
    name: 'David Lee',
    level: 'LV4',
    verified: true,
    followers: 78000,
    defaultStatus: '未跟进',
    operator: '王五',
    addTime: '2025-08-03 18:45:20'
  },
  {
    id: 6,
    avatar: '',
    username: 'home_lifestyle',
    name: 'Emma Zhang',
    level: 'LV5',
    verified: false,
    followers: 210000,
    bdName: '王五',
    status: '合作中',
    operator: '王五',
    addTime: '2025-08-02 11:30:45'
  },
  {
    id: 7,
    avatar: '',
    username: 'fashion_styler',
    name: 'Sophie Chen',
    level: 'LV4',
    verified: true,
    followers: 92000,
    defaultStatus: '未跟进',
    operator: '张三',
    addTime: '2025-08-01 16:20:00'
  },
  {
    id: 8,
    avatar: '',
    username: 'digital_guru',
    name: 'Alex Kim',
    level: 'LV3',
    verified: false,
    followers: 38000,
    bdName: '张三',
    status: '待审单',
    operator: '张三',
    addTime: '2025-07-31 20:10:15'
  },
  {
    id: 9,
    avatar: '',
    username: 'beauty_guru',
    name: 'Lisa Wang',
    level: 'LV5',
    verified: true,
    followers: 185000,
    defaultStatus: '未跟进',
    operator: '李四',
    addTime: '2025-07-30 08:45:30'
  },
  {
    id: 10,
    avatar: '',
    username: 'mom_baby_care',
    name: 'Amy Liu',
    level: 'LV4',
    verified: true,
    followers: 134000,
    bdName: '李四',
    status: '待履约',
    operator: '李四',
    addTime: '2025-07-29 14:30:20'
  }
])

// 计算分页数据
const paginatedData = computed(() => {
  const start = (paginationState.value.page - 1) * paginationState.value.pageSize
  const end = start + paginationState.value.pageSize
  return mockData.value.slice(start, end)
})

// 平台切换
function handlePlatformChange(platform) {
  activePlatform.value = platform
}

// 搜索
function handleSearch() {
  ElMessage.success('查询成功')
}

function handleReset() {
  influencerSearch.value = ''
  matrixSearch.value = ''
  ElMessage.success('重置成功')
}

// 批量操作
function handleBatchCommand(command) {
  switch (command) {
    case 'add':
      ElMessage.info('添加白名单达人')
      break
  }
}

// 表格选择变化
function handleSelectionChange(selection) {
  selectedRows.value = selection
}

// 单个操作
function handleExport(row) {
  ElMessage.success({ message: '移出成功', customClass: 'success-toast' })
}

// 批量确认
function confirmBatchRemove() {
  ElMessage.success({ message: '批量移出成功', customClass: 'success-toast' })
  isRemoveDialogVisible.value = false
}

// 格式化粉丝数
function formatFollowers(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toLocaleString()
}

function goToDetail(row) {
  window.open(`/influencer/detail/basic-analysis?id=${row.id}`, '_blank')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.white-list {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

// ==================== 平台Tab区 ====================
.platform-section {
  @extend .platform-section;
}

.platform-tabs {
  @extend .platform-tabs;
}

.platform-tab {
  @extend .platform-tab;
}

// ==================== 搜索区 ====================
.search-section {
  padding: 16px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-label {
  font-size: 14px;
  color: #666;
}

.search-input {
  width: 200px;
}

.search-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

// ==================== 列表标题区 ====================
.list-header {
  padding: 16px;
  background: #fff;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.section-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

// ==================== 工具栏 ====================
.toolbar-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 0;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn {
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

// ==================== 数据表格 ====================
.table-section {
  @extend .table-section;
}

.influencer-cell {
  @extend .influencer-cell;
}

.inf-avatar {
  @extend .inf-avatar;
}

.inf-info {
  @extend .inf-info;
}

.inf-name {
  @extend .inf-name;

  .username {
    color: #1677ff;
  }
}

.verified-icon {
  color: #1677ff;
}

.level-tag {
  border: none;
  font-size: 10px;
}

.inf-realname {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.follower-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;

  .follower-icon {
    color: #999;
    font-size: 12px;
  }
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.bd-name {
  color: #333;
  font-size: 14px;
}

.status-tag {
  border: none;
  font-size: 12px;
}

.no-status {
  color: #666;
  font-size: 14px;
}

.operator {
  color: #333;
  font-size: 14px;
}

.add-time {
  font-size: 12px;
  color: #666;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-area {
  @extend .pagination-area;
}

// ==================== 弹窗样式 ====================
.dialog-content {
  padding: 0;
}

.dialog-tip {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;

  .highlight {
    color: #1677ff;
    font-weight: 600;
  }

  &.warning .highlight {
    color: #ff4d4f;
  }
}

.dialog-sub-tip {
  font-size: 13px;
  color: #999;
  margin-top: -8px;
}

// ==================== 表格样式覆盖 ====================
:deep(.el-table) {
  .el-table__header th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
    font-size: 13px;
  }

  .el-table__row {
    border-bottom: 1px solid #f0f0f0;
  }
}

// ==================== Toast提示样式 ====================
:deep(.success-toast) {
  --el-message-bg-color: #00cc66;
}

:deep(.warning-toast) {
  --el-message-bg-color: #ff6600;
}
</style>
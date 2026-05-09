<template>
  <div class="black-list">
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
        <el-input
          v-model="searchInput"
          placeholder="搜索达人名称、达人ID或达人主页链接"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearchClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- ==================== 列表标题区 ==================== -->
    <div class="list-header">
      <h3 class="section-title">黑名单</h3>
      <p class="section-desc">可以在【我的达人】列表中拉取达人，已拉黑达人不能进行合作，需要恢复才可以进行合作。</p>
    </div>

    <!-- ==================== 数据表格 ==================== -->
    <div class="table-section">
      <el-table
        :data="paginatedData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'blockTime', order: 'descending' }"
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
        <el-table-column label="粉丝数" width="100" align="right" sortable>
          <template #default="{ row }">
            <div class="follower-cell">
              <span>{{ formatFollowers(row.followers) }}</span>
              <el-icon class="follower-icon"><User /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="带货类目" width="100" align="center">
          <template #default="{ row }">
            <div class="category-tags">
              <el-tag v-for="(cat, idx) in row.categories.slice(0, 1)" :key="idx" size="small" class="category-tag">
                {{ cat }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="拉黑后GMV" width="100" align="right" sortable prop="blockedGmv">
          <template #default="{ row }">
            <span class="gmv-value">￥{{ formatNumber(row.blockedGmv) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="近30日成交金额" width="120" align="right" sortable prop="gmv30d">
          <template #default="{ row }">
            <span class="gmv-value">￥{{ formatNumber(row.gmv30d) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="近30日成交订单数" width="130" align="right" sortable prop="orderCount30d">
          <template #default="{ row }">
            <span>{{ row.orderCount30d }}</span>
          </template>
        </el-table-column>
        <el-table-column label="场均成交金额" width="120" align="right" sortable prop="avgGmv">
          <template #default="{ row }">
            <span class="gmv-value">￥{{ formatNumber(row.avgGmv) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="100" align="center">
          <template #default="{ row }">
            <span class="operator">{{ row.operator }}</span>
          </template>
        </el-table-column>
        <el-table-column label="拉黑原因" width="120" align="center">
          <template #default="{ row }">
            <el-tooltip :content="row.blockReason" placement="top">
              <span class="block-reason">{{ row.blockReason }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="拉黑时间" width="180" align="center" sortable prop="blockTime">
          <template #default="{ row }">
            <span class="block-time">{{ row.blockTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button type="primary" link size="small" @click="handleRecover(row)">恢复</el-button>
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
    <!-- 批量恢复弹窗 -->
    <el-dialog v-model="isRecoverDialogVisible" title="批量恢复黑名单" width="480px">
      <div class="dialog-content">
        <p class="dialog-tip">确定要恢复选中的 <span class="highlight">{{ selectedRows.length }}</span> 位达人吗？</p>
        <p class="dialog-sub-tip">恢复后达人可以进行合作</p>
      </div>
      <template #footer>
        <el-button @click="isRecoverDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchRecover">恢复</el-button>
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
const searchInput = ref('')

// 工具栏
const totalCount = ref(40)
const selectedRows = ref([])

// 分页
const paginationState = ref({ page: 1, pageSize: 10 })

// 弹窗
const isRecoverDialogVisible = ref(false)

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
    categories: ['美妆个护'],
    blockedGmv: 3600000,
    gmv30d: 1000000,
    orderCount30d: 1234,
    avgGmv: 1200,
    operator: '张三',
    blockReason: '说明内容...',
    blockTime: '2025-08-06 17:28:40'
  },
  {
    id: 2,
    avatar: '',
    username: 'techreview_mike',
    name: 'Mike Liu',
    level: 'LV4',
    verified: true,
    followers: 85000,
    categories: ['数码科技'],
    blockedGmv: 2800000,
    gmv30d: 580000,
    orderCount30d: 856,
    avgGmv: 980,
    operator: '李四',
    blockReason: '合作态度差',
    blockTime: '2025-08-05 14:20:10'
  },
  {
    id: 3,
    avatar: '',
    username: 'beauty_sarah',
    name: 'Sarah Wong',
    level: 'LV5',
    verified: false,
    followers: 156000,
    categories: ['美妆个护'],
    blockedGmv: 4200000,
    gmv30d: 1200000,
    orderCount30d: 2100,
    avgGmv: 1500,
    operator: '张三',
    blockReason: '违约',
    blockTime: '2025-08-04 09:15:30'
  },
  {
    id: 4,
    avatar: '',
    username: 'foodie_james',
    name: 'James Tan',
    level: 'LV3',
    verified: true,
    followers: 45600,
    categories: ['食品饮料'],
    blockedGmv: 1800000,
    gmv30d: 320000,
    orderCount30d: 1580,
    avgGmv: 850,
    operator: '王五',
    blockReason: '产品质量问题',
    blockTime: '2025-08-03 18:45:20'
  },
  {
    id: 5,
    avatar: '',
    username: 'sports_pro',
    name: 'David Lee',
    level: 'LV4',
    verified: true,
    followers: 78000,
    categories: ['运动户外'],
    blockedGmv: 3100000,
    gmv30d: 680000,
    orderCount30d: 980,
    avgGmv: 1100,
    operator: '李四',
    blockReason: '沟通不畅',
    blockTime: '2025-08-02 11:30:45'
  },
  {
    id: 6,
    avatar: '',
    username: 'home_lifestyle',
    name: 'Emma Zhang',
    level: 'LV5',
    verified: false,
    followers: 210000,
    categories: ['家居生活'],
    blockedGmv: 5200000,
    gmv30d: 1500000,
    orderCount30d: 3200,
    avgGmv: 1800,
    operator: '张三',
    blockReason: '虚假宣传',
    blockTime: '2025-08-01 16:20:00'
  },
  {
    id: 7,
    avatar: '',
    username: 'fashion_styler',
    name: 'Sophie Chen',
    level: 'LV4',
    verified: true,
    followers: 92000,
    categories: ['服饰鞋包'],
    blockedGmv: 2900000,
    gmv30d: 890000,
    orderCount30d: 1450,
    avgGmv: 1050,
    operator: '王五',
    blockReason: '未按时交付',
    blockTime: '2025-07-31 20:10:15'
  },
  {
    id: 8,
    avatar: '',
    username: 'digital_guru',
    name: 'Alex Kim',
    level: 'LV3',
    verified: false,
    followers: 38000,
    categories: ['数码科技'],
    blockedGmv: 1500000,
    gmv30d: 280000,
    orderCount30d: 620,
    avgGmv: 780,
    operator: '李四',
    blockReason: '态度恶劣',
    blockTime: '2025-07-30 08:45:30'
  },
  {
    id: 9,
    avatar: '',
    username: 'beauty_guru',
    name: 'Lisa Wang',
    level: 'LV5',
    verified: true,
    followers: 185000,
    categories: ['美妆个护'],
    blockedGmv: 4800000,
    gmv30d: 2100000,
    orderCount30d: 4500,
    avgGmv: 2100,
    operator: '张三',
    blockReason: '违反平台规则',
    blockTime: '2025-07-29 14:30:20'
  },
  {
    id: 10,
    avatar: '',
    username: 'mom_baby_care',
    name: 'Amy Liu',
    level: 'LV4',
    verified: true,
    followers: 134000,
    categories: ['母婴用品'],
    blockedGmv: 3500000,
    gmv30d: 980000,
    orderCount30d: 2100,
    avgGmv: 1300,
    operator: '王五',
    blockReason: '产品不符合描述',
    blockTime: '2025-07-28 10:20:40'
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
  ElMessage.success('搜索成功')
}

function handleSearchClear() {
  searchInput.value = ''
}

// 表格选择变化
function handleSelectionChange(selection) {
  selectedRows.value = selection
}

// 单个操作
function handleRecover(row) {
  ElMessage.success({ message: '恢复成功', customClass: 'success-toast' })
}

// 批量确认
function confirmBatchRecover() {
  ElMessage.success({ message: '批量恢复成功', customClass: 'success-toast' })
  isRecoverDialogVisible.value = false
}

// 格式化粉丝数
function formatFollowers(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toLocaleString()
}

// 格式化金额
function formatNumber(num) {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function goToDetail(row) {
  window.open(`/influencer/detail/basic-analysis?id=${row.id}`, '_blank')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.black-list {
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
}

.search-input {
  width: 320px;
}

// ==================== 列表标题区（黑名单说明） ====================
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

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.category-tag {
  background: #f5f7fa;
  border: none;
  font-size: 12px;
}

.gmv-value {
  font-family: 'PingFang SC', sans-serif;
}

.operator {
  color: #333;
  font-size: 14px;
}

.block-reason {
  color: #666;
  font-size: 12px;
  cursor: pointer;
}

.block-time {
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
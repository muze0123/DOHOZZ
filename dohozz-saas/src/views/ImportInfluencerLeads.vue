<template>
  <div class="import-influencer-leads">
    <!-- 平台切换栏 -->
    <div class="platform-tabs">
      <div
        v-for="platform in platforms"
        :key="platform.key"
        class="platform-tab"
        :class="{ active: activePlatform === platform.key }"
        @click="handlePlatformChange(platform.key)"
      >
        <span class="tab-icon" v-html="platform.icon"></span>
        <span class="tab-text">{{ platform.label }}</span>
      </div>
    </div>

    <!-- 筛选区 -->
    <div class="filter-section">
      <!-- 第一行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">达人搜索：</span>
          <el-input v-model="filters.keyword" placeholder="请输入达人名称/达人ID" style="width: 280px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">带货商品：</span>
          <el-input v-model="filters.product" placeholder="请输入商品名称/商品ID" style="width: 280px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">跟进状态：</span>
          <el-select v-model="filters.followStatus" placeholder="全部" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="待跟进" value="pending" />
            <el-option label="已跟进" value="followed" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">公海状态：</span>
          <el-select v-model="filters.publicStatus" placeholder="全部" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="未放入" value="not_in" />
            <el-option label="已放入" value="in" />
          </el-select>
        </div>
      </div>
      <!-- 第二行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">操作人：</span>
          <el-select v-model="filters.operator" placeholder="全部" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option v-for="op in operators" :key="op" :label="op" :value="op" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">导入时间：</span>
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 340px"
          />
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 列表头部 -->
    <div class="list-header">
      <div class="list-title">
        <span>达人线索</span>
        <span class="total-count">共{{ totalCount }}个达人线索</span>
      </div>
      <div class="header-actions">
        <el-dropdown trigger="click" @command="handleBatchCommand">
          <el-button>
            批量操作
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="assign">批量分配</el-dropdown-item>
              <el-dropdown-item command="public">批量放入公海</el-dropdown-item>
              <el-dropdown-item command="delete">批量删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleAddCommand">
          <el-button type="primary">
            + 添加达人线索
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="add">添加达人线索</el-dropdown-item>
              <el-dropdown-item command="import">批量导入达人</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="data-table">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" :selectable="checkSelectable" />
        <el-table-column label="达人信息" min-width="200">
          <template #default="{ row }">
            <div class="influencer-cell">
              <el-avatar :size="48" :src="row.avatar" class="inf-avatar clickable" @click="goToDetail(row)" />
              <div class="inf-info">
                <div class="inf-name">
                  <span class="clickable">{{ row.name }}</span>
                  <el-tag size="small" class="level-tag">LV{{ row.level }}</el-tag>
                  <el-tag v-if="row.salesType === 'video'" size="small" type="info">视频</el-tag>
                  <el-tag v-else size="small" type="warning">直播</el-tag>
                </div>
                <div class="inf-username">{{ row.username }}</div>
                <div class="inf-country">
                  <span>{{ row.countryFlag }}</span> {{ row.country }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="粉丝数" width="120" sortable prop="followers">
          <template #default="{ row }">
            <span class="clickable">{{ formatNumber(row.followers) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="带货类目" width="140">
          <template #default="{ row }">
            <div class="category-tags">
              <el-tag v-for="(cat, idx) in (row.categories || [row.category]).slice(0, 2)" :key="idx" size="small">{{ cat }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="国家地区" width="120">
          <template #default="{ row }">
            <span>{{ row.countryFlag }} {{ row.country }}</span>
          </template>
        </el-table-column>
        <el-table-column label="近30日成交金额" prop="gmv30d" width="140" sortable>
          <template #default="{ row }">
            <span>¥{{ formatNumber(row.gmv30d) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="近30日销量" prop="sales30d" width="120" sortable>
          <template #default="{ row }">
            <span>{{ formatSales(row.sales30d) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进状态" width="100">
          <template #default="{ row }">
            <span class="status-cell" :class="row.followStatus">
              <span class="status-dot"></span>
              {{ row.followStatus === 'pending' ? '待跟进' : '已跟进' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="公海状态" width="100">
          <template #default="{ row }">
            <span class="status-cell" :class="row.publicStatus">
              <span class="status-dot"></span>
              {{ row.publicStatus === 'not_in' ? '未放入' : '已放入' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="100" prop="operator" />
        <el-table-column label="导入时间" width="180" sortable prop="importTime">
          <template #default="{ row }">{{ row.importTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleAssign(row)">分配</el-button>
            <el-button type="primary" link @click="handleToPublic(row)">放入公海</el-button>
            <el-button type="primary" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- 添加达人线索弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加达人线索" width="480px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="所属平台" required>
          <el-select v-model="addForm.platform" placeholder="请选择" style="width: 100%">
            <el-option label="TikTok" value="tiktok" />
            <el-option label="Instagram" value="instagram" />
            <el-option label="Shopee" value="shopee" />
            <el-option label="Lazada" value="lazada" />
          </el-select>
        </el-form-item>
        <el-form-item label="达人名称" required>
          <el-input v-model="addForm.name" placeholder="请输入达人名称" />
        </el-form-item>
        <el-form-item label="达人ID" required>
          <el-input v-model="addForm.influencerId" placeholder="请输入达人ID" />
        </el-form-item>
        <el-form-item label="达人主页链接">
          <el-input v-model="addForm.profileUrl" placeholder="请输入达人主页链接" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量分配弹窗 -->
    <el-dialog v-model="assignDialogVisible" title="批量分配" width="420px">
      <p class="assign-tip" v-if="selectedRows.length > 0">
        已选择 {{ selectedRows.length }} 位达人
      </p>
      <el-form>
        <el-form-item label="分配BD" required>
          <el-select v-model="assignForm.bd" placeholder="请选择BD" style="width: 100%">
            <el-option label="张三" value="zhangsan" />
            <el-option label="李四" value="lisi" />
            <el-option label="王五" value="wangwu" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAssignSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, CircleCheck } from '@element-plus/icons-vue'

// 平台数据
const platforms = ref([
  { key: 'all', label: '全部', icon: '<svg viewBox="0 0 24 24" width="16" height="16"><rect width="16" height="16" fill="#0066FF"/></svg>' },
  { key: 'tiktok', label: 'TikTok', icon: '<svg viewBox="0 0 24 24" width="26" height="26"><path fill="#000" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>' },
  { key: 'instagram', label: 'Instagram', icon: '<svg viewBox="0 0 24 24" width="26" height="26"><defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FFDC80"/><stop offset="50%" style="stop-color:#E1306C"/><stop offset="100%" style="stop-color:#833AB4"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig)"/></svg>' },
  { key: 'shopee', label: 'Shopee', icon: '<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="10" fill="#EE4D2D"/></svg>' },
  { key: 'lazada', label: 'Lazada', icon: '<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="10" fill="#0B72C5"/></svg>' }
])
const activePlatform = ref('all')

// 筛选条件
const filters = reactive({
  keyword: '',
  product: '',
  followStatus: '',
  publicStatus: '',
  operator: '',
  dateRange: []
})

// 操作人列表
const operators = ref(['张三', '李四', '王五'])

// 列表数据（Mock）
const tableData = ref([
  {
    id: '1',
    avatar: 'https://via.placeholder.com/46',
    name: '美食推荐小王',
    username: '@food_recommend',
    verified: true,
    level: '8',
    country: '中国',
    countryFlag: '🇨🇳',
    salesType: 'video',
    followers: 1210100,
    categories: ['食品饮料', '生鲜蔬果'],
    gmv30d: 3125800,
    sales30d: 15800,
    avgLikes: 56000,
    followStatus: 'pending',
    publicStatus: 'not_in',
    operator: '张三',
    importTime: '2025-12-05 13:53:15'
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/46',
    name: '美妆达人小李',
    username: '@beauty_lili',
    verified: true,
    level: '7',
    country: '美国',
    countryFlag: '🇺🇸',
    salesType: 'live',
    followers: 895600,
    categories: ['美妆个护', '护肤彩妆'],
    gmv30d: 2236000,
    sales30d: 12300,
    avgLikes: 89000,
    followStatus: 'followed',
    publicStatus: 'in',
    operator: '李四',
    importTime: '2025-12-04 10:20:30'
  }
])

// 总数
const totalCount = computed(() => tableData.value.length)
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: tableData.value.length
})

// 选中行
const selectedRows = ref([])

// 弹窗
const addDialogVisible = ref(false)
const assignDialogVisible = ref(false)
const addForm = reactive({
  platform: '',
  name: '',
  influencerId: '',
  profileUrl: '',
  remark: ''
})
const assignForm = reactive({
  bd: ''
})

// 方法
function handlePlatformChange(key) {
  activePlatform.value = key
}

function handleQuery() {
  ElMessage.success('查询成功')
}

function handleReset() {
  filters.keyword = ''
  filters.product = ''
  filters.followStatus = ''
  filters.publicStatus = ''
  filters.operator = ''
  filters.dateRange = []
  ElMessage.success('重置成功')
}

function handleSelectionChange(selection) {
  selectedRows.value = selection
}

function handleBatchCommand(command) {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一位达人')
    return
  }
  if (command === 'assign') {
    assignDialogVisible.value = true
  } else if (command === 'public') {
    ElMessage.success('已放入公海')
  } else if (command === 'delete') {
    ElMessage.success('删除成功')
  }
}

function handleAddCommand(command) {
  if (command === 'add') {
    addDialogVisible.value = true
  } else if (command === 'import') {
    ElMessage.info('批量导入功能开发中')
  }
}

function handleAddSubmit() {
  if (!addForm.platform || !addForm.name || !addForm.influencerId) {
    ElMessage.warning('请填写必填项')
    return
  }
  ElMessage.success('添加成功')
  addDialogVisible.value = false
}

function handleAssign(row) {
  selectedRows.value = [row]
  assignDialogVisible.value = true
}

function handleAssignSubmit() {
  if (!assignForm.bd) {
    ElMessage.warning('请选择分配BD')
    return
  }
  ElMessage.success('分配成功')
  assignDialogVisible.value = false
}

function handleToPublic(row) {
  ElMessage.success('已放入公海')
}

function handleDelete(row) {
  ElMessage.success('删除成功')
}

function formatNumber(num) {
  if (num >= 100000000) return (num / 100000000).toFixed(2) + '亿'
  if (num >= 10000) return (num / 10000).toFixed(2) + 'w'
  return num.toLocaleString()
}

function formatSales(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toLocaleString()
}

function goToDetail(row) {
  window.open(`/influencer/detail/basic-analysis?id=${row.id}`, '_blank')
}
</script>

<style lang="scss" scoped>
$primary: #0066FF;
$secondary: #FF6600;
$success: #00CC66;
$text-primary: #333333;
$text-secondary: #666666;
$text-hint: #999999;
$border-default: #D9D9D9;
$border-light: #F0F0F0;
$bg-section: #F5F7FA;
$white: #FFFFFF;

.import-influencer-leads {
  background: $white;
  padding: 20px;
  min-height: 100vh;
}

// 平台切换栏
.platform-tabs {
  display: flex;
  gap: 24px;
}

.platform-tab {
  display: flex;
  align-items: center;
  padding: 12px 0;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  position: relative;
  top: 1px;
  font-size: 14px;

  .tab-text {
    font-size: 14px;
    color: inherit;
    margin-left: 8px;
  }

  &:hover {
    color: #333;
  }

  &.active {
    color: #1677ff;
    font-weight: 500;
    border-bottom-color: #1677ff;
  }
}

// 筛选区
.filter-section {
  background: $bg-section;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 14px;
  color: $text-primary;
  margin-right: 8px;
  white-space: nowrap;
}

.filter-actions {
  margin-left: auto;
}

// 列表头部
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-title {
  font-size: 14px;
  font-weight: bold;
  color: $text-primary;

  .total-count {
    font-weight: normal;
    color: $text-hint;
    margin-left: 8px;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
}

// 数据表格
.data-table {
  margin-bottom: 16px;

  :deep(.el-table) {
    .el-table__header th {
      background: #fafafa;
      font-weight: 600;
      color: #333;
    }
  }
}

.influencer-cell {
  display: flex;
  gap: 12px;
}

.inf-avatar {
  flex-shrink: 0;
}

.inf-info {
  flex: 1;
  min-width: 0;
}

.inf-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;

  .clickable {
    cursor: pointer;
    &:hover {
      color: #1677ff;
    }
  }
}

.level-tag {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #fff;
  border: none;
}

.inf-username {
  font-size: 12px;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #1677ff;
  }
}

.inf-country {
  font-size: 12px;
  color: #666;
}

.category-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.status-cell {
  display: flex;
  align-items: center;
  font-size: 12px;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 6px;
  }

  &.pending, &.not_in {
    color: #FF6600;

    .status-dot {
      background: #FF6600;
    }
  }

  &.followed, &.in {
    color: #999;

    .status-dot {
      background: #999;
    }
  }
}

.clickable {
  cursor: pointer;
  &:hover {
    color: #1677ff;
  }
}

// 分页
.pagination-bar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}

// 弹窗
.assign-tip {
  margin-bottom: 16px;
  font-size: 14px;
  color: $text-primary;
}
</style>

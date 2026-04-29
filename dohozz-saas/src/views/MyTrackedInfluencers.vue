<template>
  <div class="tracked-influencers-page">
    <!-- 欢迎介绍区 -->
    <div class="welcome-card">
      <div class="welcome-title">追踪达人</div>
      <div class="welcome-desc">
        管理品牌已追踪的达人列表，支持手动添加追踪达人、开启/关闭监控、延长监控时间、查看监控记录、移除达人等操作。
        追踪次数（监控配额）管理与消耗记录查看。
      </div>
    </div>

    <!-- 数据总览区 -->
    <div class="stats-card">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ statsData.totalInfluencers }}</div>
          <div class="stat-label">追踪达人</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ statsData.monitoringCount }}</div>
          <div class="stat-label">监控中</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ statsData.pausedCount }}</div>
          <div class="stat-label">已暂停</div>
        </div>
        <div class="stat-item highlight">
          <div class="stat-value">{{ statsData.totalRemainingQuota }}</div>
          <div class="stat-label">剩余配额</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ statsData.totalUsedQuota }}</div>
          <div class="stat-label">已消耗配额</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ statsData.totalRecords }}</div>
          <div class="stat-label">监控记录</div>
        </div>
      </div>
    </div>

    <!-- 筛选区 -->
    <div class="filter-card">
      <div class="filter-row">
        <div class="platform-tabs">
          <div
            v-for="tab in platformTabs"
            :key="tab.key"
            class="platform-tab"
            :class="{ active: filters.platform === tab.key }"
            @click="handlePlatformTabChange(tab.key)"
          >
            <span>{{ tab.label }}</span>
          </div>
        </div>
      </div>
      <div class="filter-row filter-controls">
        <div class="control">
          <div class="label">达人搜索</div>
          <el-input
            v-model="filters.keyword"
            placeholder="输入达人名称/ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </div>
        <div class="control">
          <div class="label">监控状态</div>
          <el-select v-model="filters.status" placeholder="全部状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="监控中" value="monitoring" />
            <el-option label="已暂停" value="paused" />
          </el-select>
        </div>
        <div class="control actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 操作区 -->
    <div class="action-card">
      <div class="action-left">
        <el-button type="primary" @click="handleAddInfluencer">+ 添加追踪达人</el-button>
      </div>
      <div class="action-right">
        <el-button @click="handleViewQuotaRecords">配额消耗记录</el-button>
        <el-button @click="handleViewMonitoringRecords">监控记录</el-button>
      </div>
    </div>

    <!-- 列表区 -->
    <div class="list-card">
      <el-table v-loading="loading" :data="pagedInfluencers" class="influencer-table">
        <el-table-column label="达人信息" min-width="200">
          <template #default="{ row }">
            <div class="cell-user">
              <el-avatar :size="36" :src="row.avatar || undefined" />
              <div class="cell-user-meta">
                <div class="name">{{ row.name }}</div>
                <div class="sub">{{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="平台" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getPlatformType(row.platform)">{{ getPlatformLabel(row.platform) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="粉丝" min-width="100">
          <template #default="{ row }">{{ row.followerStr }}</template>
        </el-table-column>
        <el-table-column label="分类" min-width="120">
          <template #default="{ row }">
            <div class="category-tags">
              <el-tag v-for="cat in row.categories.slice(0, 2)" :key="cat" size="small">{{ cat }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="监控状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.trackingStatus === 'monitoring' ? 'success' : 'info'">
              {{ row.trackingStatus === 'monitoring' ? '监控中' : '已暂停' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="监控时间" min-width="180">
          <template #default="{ row }">
            <div class="monitor-time">
              <div>{{ row.monitoringStartTime }} 至 {{ row.monitoringEndTime }}</div>
              <div class="remaining-days" :class="{ warning: row.remainingDays <= 7 && row.remainingDays > 0, danger: row.remainingDays <= 0 }">
                剩余 {{ row.remainingDays }} 天
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="配额使用" min-width="140">
          <template #default="{ row }">
            <div class="quota-info">
              <el-progress
                :percentage="Math.round((row.usedQuota / row.totalQuota) * 100)"
                :color="getQuotaColor(row.usedQuota, row.totalQuota)"
                :stroke-width="8"
              />
              <div class="quota-text">{{ row.remainingQuota }} / {{ row.totalQuota }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="本月录屏" min-width="80">
          <template #default="{ row }">{{ row.currentMonthRecords }}</template>
        </el-table-column>
        <el-table-column label="最近直播" min-width="160">
          <template #default="{ row }">{{ row.lastLiveTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button
                v-if="row.trackingStatus === 'paused'"
                link
                type="primary"
                @click="handleToggleMonitor(row)"
              >
                开启监控
              </el-button>
              <el-button
                v-else
                link
                type="warning"
                @click="handleToggleMonitor(row)"
              >
                暂停监控
              </el-button>
              <el-button link type="primary" @click="handleExtendTime(row)">延长</el-button>
              <el-button link type="primary" @click="handleViewRecords(row)">记录</el-button>
              <el-button link type="danger" @click="handleRemove(row)">移除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!loading && pagedInfluencers.length === 0" class="empty-state">
        暂无追踪达人
      </div>

      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredInfluencers.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 添加追踪达人弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加追踪达人" width="500px" :destroy-on-close="true">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="达人名称">
          <el-input v-model="addForm.name" placeholder="请输入达人名称" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="addForm.platform" placeholder="选择平台" style="width: 100%">
            <el-option label="TikTok" value="tiktok" />
            <el-option label="Instagram" value="instagram" />
            <el-option label="Shopee" value="shopee" />
            <el-option label="Lazada" value="lazada" />
          </el-select>
        </el-form-item>
        <el-form-item label="监控配额">
          <el-input-number v-model="addForm.totalQuota" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="监控结束日期">
          <el-date-picker
            v-model="addForm.endTime"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 延长监控时间弹窗 -->
    <el-dialog v-model="extendDialogVisible" title="延长监控时间" width="400px" :destroy-on-close="true">
      <div class="extend-form">
        <p class="extend-info">当前达人：<strong>{{ currentInfluencer?.name }}</strong></p>
        <p class="extend-info">当前剩余：<strong>{{ currentInfluencer?.remainingDays }} 天</strong></p>
        <el-form :model="extendForm" label-width="80px">
          <el-form-item label="延长天数">
            <el-input-number v-model="extendForm.days" :min="1" :max="90" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="extendDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmExtend">确认延长</el-button>
      </template>
    </el-dialog>

    <!-- 监控记录弹窗 -->
    <el-dialog v-model="recordsDialogVisible" title="监控记录" width="800px" :destroy-on-close="true">
      <div class="records-header">
        <span>达人：<strong>{{ currentInfluencer?.name }}</strong></span>
      </div>
      <el-table :data="monitoringRecords" class="records-table">
        <el-table-column prop="recordTime" label="录屏时间" min-width="160" />
        <el-table-column prop="duration" label="直播时长(s)" min-width="120">
          <template #default="{ row }">{{ formatDuration(row.duration) }}</template>
        </el-table-column>
        <el-table-column prop="views" label="观看人数" min-width="100" />
        <el-table-column prop="likes" label="点赞" min-width="80" />
        <el-table-column prop="gmv" label="成交金额" min-width="100">
          <template #default="{ row }">￥{{ formatMoney(row.gmv) }}</template>
        </el-table-column>
        <el-table-column prop="orderCount" label="订单数" min-width="80" />
        <el-table-column label="违规" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.hasViolation" type="danger">有违规</el-tag>
            <el-tag v-else type="success">无违规</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="monitoringRecords.length === 0" class="empty-state">暂无监控记录</div>
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="recordsPagination.page"
          v-model:page-size="recordsPagination.pageSize"
          :page-sizes="[10, 20]"
          :total="monitoringRecords.length"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-dialog>

    <!-- 配额消耗记录弹窗 -->
    <el-dialog v-model="quotaDialogVisible" title="配额消耗记录" width="700px" :destroy-on-close="true">
      <el-table :data="quotaRecords" class="quota-table">
        <el-table-column prop="influencerName" label="达人" min-width="150" />
        <el-table-column prop="consumeTime" label="消耗时间" min-width="160" />
        <el-table-column prop="quotaUsed" label="消耗配额" min-width="100">
          <template #default="{ row }">
            <el-tag type="warning">-{{ row.quotaUsed }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="消耗原因" min-width="120" />
        <el-table-column label="状态" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'">{{ row.status === 'success' ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="quotaRecords.length === 0" class="empty-state">暂无配额消耗记录</div>
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="quotaPagination.page"
          v-model:page-size="quotaPagination.pageSize"
          :page-sizes="[10, 20]"
          :total="quotaRecords.length"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getTrackedInfluencers,
  getTrackedStats,
  addTrackedInfluencer,
  updateTrackingStatus,
  extendMonitoringTime,
  removeTrackedInfluencer,
  getMonitoringRecords,
  getQuotaRecords
} from '@/api/trackedInfluencer'

const loading = ref(false)

// 统计数据
const statsData = reactive({
  totalInfluencers: 0,
  monitoringCount: 0,
  pausedCount: 0,
  totalUsedQuota: 0,
  totalRemainingQuota: 0,
  totalQuota: 0,
  totalRecords: 0
})

// 平台选项
const platformOptions = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' }
]

const platformTabs = [
  { key: 'all', label: '全部' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]

// 筛选条件
const filters = reactive({
  platform: 'all',
  keyword: '',
  status: ''
})

const pagination = reactive({ page: 1, pageSize: 10 })
const influencers = ref([])

// 过滤后的列表
const filteredInfluencers = computed(() => {
  let result = influencers.value

  if (filters.platform !== 'all') {
    result = result.filter(i => i.platform === filters.platform)
  }
  if (filters.keyword) {
    const kw = filters.keyword.trim().toLowerCase()
    result = result.filter(i =>
      i.name.toLowerCase().includes(kw) ||
      i.id.toLowerCase().includes(kw)
    )
  }
  if (filters.status) {
    result = result.filter(i => i.trackingStatus === filters.status)
  }
  return result
})

const pagedInfluencers = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredInfluencers.value.slice(start, end)
})

// 加载数据
async function loadStats() {
  try {
    const res = await getTrackedStats()
    if (res.code === 0) {
      Object.assign(statsData, res.data)
    }
  } catch (e) {
    console.error('加载统计数据失败', e)
  }
}

async function loadInfluencers() {
  loading.value = true
  try {
    const res = await getTrackedInfluencers({ page: 1, pageSize: 100 })
    if (res.code === 0) {
      influencers.value = res.data.list
    }
  } catch (e) {
    console.error('加载追踪达人失败', e)
  } finally {
    loading.value = false
  }
}

// 筛选操作
function handlePlatformTabChange(key) {
  filters.platform = key
  pagination.page = 1
}

function handleQuery() {
  pagination.page = 1
  ElMessage.success('搜索成功')
}

function handleReset() {
  filters.platform = 'all'
  filters.keyword = ''
  filters.status = ''
  pagination.page = 1
  ElMessage.success('重置成功')
}

// 添加追踪达人
const addDialogVisible = ref(false)
const addForm = reactive({
  name: '',
  platform: 'tiktok',
  totalQuota: 10,
  endTime: ''
})

function handleAddInfluencer() {
  addForm.name = ''
  addForm.platform = 'tiktok'
  addForm.totalQuota = 10
  addForm.endTime = ''
  addDialogVisible.value = true
}

async function handleConfirmAdd() {
  if (!addForm.name.trim()) {
    ElMessage.warning('请输入达人名称')
    return
  }
  try {
    const res = await addTrackedInfluencer(addForm)
    if (res.code === 0) {
      ElMessage.success('添加成功')
      addDialogVisible.value = false
      await loadInfluencers()
      await loadStats()
    }
  } catch (e) {
    ElMessage.error('添加失败')
  }
}

// 开启/暂停监控
async function handleToggleMonitor(row) {
  const newStatus = row.trackingStatus === 'monitoring' ? 'paused' : 'monitoring'
  const actionText = newStatus === 'monitoring' ? '开启' : '暂停'
  try {
    await ElMessageBox.confirm(`确认${actionText}对「${row.name}」的监控？`, `${actionText}监控确认`, {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await updateTrackingStatus(row.id, newStatus)
    if (res.code === 0) {
      ElMessage.success(res.message)
      await loadInfluencers()
      await loadStats()
    }
  } catch {
    // user canceled
  }
}

// 延长监控时间
const extendDialogVisible = ref(false)
const extendForm = reactive({ days: 30 })
const currentInfluencer = ref(null)

function handleExtendTime(row) {
  currentInfluencer.value = row
  extendForm.days = 30
  extendDialogVisible.value = true
}

async function handleConfirmExtend() {
  if (!currentInfluencer.value) return
  try {
    const res = await extendMonitoringTime(currentInfluencer.value.id, extendForm.days)
    if (res.code === 0) {
      ElMessage.success(res.message)
      extendDialogVisible.value = false
      await loadInfluencers()
      await loadStats()
    }
  } catch (e) {
    ElMessage.error('延长失败')
  }
}

// 监控记录
const recordsDialogVisible = ref(false)
const monitoringRecords = ref([])
const recordsPagination = reactive({ page: 1, pageSize: 10 })

function handleViewRecords(row) {
  currentInfluencer.value = row
  loadMonitoringRecords(row.id)
  recordsDialogVisible.value = true
}

async function loadMonitoringRecords(influencerId) {
  try {
    const res = await getMonitoringRecords({ influencerId })
    if (res.code === 0) {
      monitoringRecords.value = res.data.list
    }
  } catch (e) {
    console.error('加载监控记录失败', e)
  }
}

function handleViewMonitoringRecords() {
  currentInfluencer.value = null
  loadMonitoringRecords('')
  recordsDialogVisible.value = true
}

// 配额消耗记录
const quotaDialogVisible = ref(false)
const quotaRecords = ref([])
const quotaPagination = reactive({ page: 1, pageSize: 10 })

function handleViewQuotaRecords() {
  loadQuotaRecords()
  quotaDialogVisible.value = true
}

async function loadQuotaRecords() {
  try {
    const res = await getQuotaRecords({})
    if (res.code === 0) {
      quotaRecords.value = res.data.list
    }
  } catch (e) {
    console.error('加载配额记录失败', e)
  }
}

// 移除达人
async function handleRemove(row) {
  try {
    await ElMessageBox.confirm(`确认移除「${row.name}」？移除后将停止对该达人的监控。`, '移除确认', {
      confirmButtonText: '确认移除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await removeTrackedInfluencer(row.id)
    if (res.code === 0) {
      ElMessage.success('移除成功')
      await loadInfluencers()
      await loadStats()
    }
  } catch {
    // user canceled
  }
}

// 工具函数
function getPlatformLabel(platform) {
  return platformOptions.find(p => p.value === platform)?.label || platform
}

function getPlatformType(platform) {
  const types = { tiktok: '', instagram: 'warning', shopee: 'danger', lazada: 'primary' }
  return types[platform] || ''
}

function getQuotaColor(used, total) {
  const ratio = used / total
  if (ratio >= 0.9) return '#f56c6c'
  if (ratio >= 0.7) return '#e6a23c'
  return '#67c23a'
}

function formatMoney(v) {
  return Number(v || 0).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDuration(sec) {
  const s = Number(sec || 0)
  if (s < 60) return `${s}秒`
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m < 60) return `${m}分${r ? `${r}秒` : ''}`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${h}小时${mm ? `${mm}分` : ''}`
}

onMounted(() => {
  loadStats()
  loadInfluencers()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.tracked-influencers-page {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

.welcome-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 16px;
  margin-bottom: 12px;

  .welcome-title {
    font-size: 18px;
    font-weight: 700;
    color: #111;
  }
  .welcome-desc {
    margin-top: 8px;
    color: #666;
    line-height: 1.6;
  }
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 16px;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;

  &.highlight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    .stat-value { color: #fff; }
    .stat-label { color: rgba(255, 255, 255, 0.85); }
  }

  .stat-value {
    font-size: 24px;
    font-weight: 800;
    color: #111;
  }
  .stat-label {
    margin-top: 4px;
    font-size: 12px;
    color: #666;
  }
}

.filter-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 16px;
  margin-bottom: 12px;
}

.filter-row + .filter-row {
  margin-top: 12px;
}

.platform-tabs {
  display: flex;
  gap: 8px;
}

.platform-tab {
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: #f5f6f7;
  color: #333;

  &:hover {
    background: #eef4ff;
  }

  &.active {
    background: #1677ff;
    color: #fff;
    font-weight: 600;
  }
}

.filter-controls {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.control {
  .label {
    font-size: 12px;
    color: #666;
    margin-bottom: 6px;
  }
}

.actions {
  display: flex;
  gap: 8px;
}

.action-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.action-right {
  display: flex;
  gap: 8px;
}

.list-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 16px;
}

.cell-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cell-user-meta {
  min-width: 0;
  .name {
    font-weight: 700;
    color: #111;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sub {
    color: #888;
    font-size: 12px;
  }
}

.category-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.monitor-time {
  .remaining-days {
    font-size: 12px;
    color: #666;
    &.warning { color: #e6a23c; }
    &.danger { color: #f56c6c; }
  }
}

.quota-info {
  .quota-text {
    margin-top: 4px;
    font-size: 12px;
    color: #888;
  }
}

.action-btns {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.pagination-section {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  padding: 18px 0;
  color: #999;
  text-align: center;
}

.extend-form {
  .extend-info {
    margin-bottom: 12px;
    color: #666;
  }
}

.records-header {
  margin-bottom: 12px;
  color: #666;
}

@media (max-width: 1280px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .filter-controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

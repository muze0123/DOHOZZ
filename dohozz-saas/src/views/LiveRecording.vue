<template>
  <div class="live-recording-page">
    <!-- 顶部平台选择区（与PRD一致，独立于筛选区展示） -->
    <div class="top-platform-select">
      <el-select v-model="topPlatform" class="platform-select" size="default" placeholder="Tik Tok">
        <el-option v-for="p in platformOptions" :key="p.value" :label="p.label" :value="p.value" />
      </el-select>
      <el-select v-model="topPlatform2" class="platform-select" size="default" placeholder="Instagram">
        <el-option v-for="p in platformOptions" :key="p.value" :label="p.label" :value="p.value" />
      </el-select>
      <el-select v-model="topPlatform3" class="platform-select" size="default" placeholder="Shopee">
        <el-option v-for="p in platformOptions" :key="p.value" :label="p.label" :value="p.value" />
      </el-select>
      <el-select v-model="topPlatform4" class="platform-select" size="default" placeholder="Lazada">
        <el-option v-for="p in platformOptions" :key="p.value" :label="p.label" :value="p.value" />
      </el-select>
    </div>

    <!-- 欢迎介绍区 -->
    <div class="welcome-card">
      <div class="welcome-title">达人直播录屏</div>
      <div class="welcome-desc">
        欢迎使用蝉圈圈的新功能「直播录屏监控」，自动监控合作达人直播表现,智能提取合作商品的直播讲解片段录屏完成后,
        你将获得合作商品的录屏片段、直播话术、违规情况、商品动销及互动数据,助您全面洞察达人直播间表现
      </div>
      <el-button type="primary" class="welcome-btn" @click="scrollToFilters">开始使用</el-button>
    </div>

    <!-- 功能介绍区 -->
    <div class="feature-section">
      <div class="feature-title">功能介绍</div>
      <div class="feature-cards">
        <div class="feature-card active" @click="ElMessage.info('当前页：直播录屏')">
          <div class="feature-name">直播录屏</div>
          <div class="feature-desc">录制达播中合作商品的讲解片段</div>
        </div>
        <div class="feature-card" @click="ElMessage.info('违规情况 - 功能开发中')">
          <div class="feature-name">违规情况</div>
          <div class="feature-desc">及时发现达播中的违规话术</div>
        </div>
        <div class="feature-card" @click="ElMessage.info('素材库 - 功能开发中')">
          <div class="feature-name">素材库</div>
          <div class="feature-desc">保存达人高光片段二次利用</div>
        </div>
      </div>
    </div>

    <!-- 数据筛选区 -->
    <div ref="filterAnchorRef" class="filter-card">
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

      <div class="filter-row">
        <div class="time-dim">
          <div class="dim-btns">
            <div
              v-for="dim in timeDims"
              :key="dim.key"
              class="dim-btn"
              :class="{ active: filters.timeDim === dim.key }"
              @click="handleTimeDimChange(dim.key)"
            >
              {{ dim.label }}
            </div>
          </div>
          <div class="time-range-text">{{ timeRangeText }}</div>
        </div>
      </div>

      <div class="filter-row filter-controls">
        <div class="control">
          <div class="label">所属部门</div>
          <el-select v-model="filters.departmentId" placeholder="全部部门" clearable>
            <el-option v-for="d in departmentOptions" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
        </div>
        <div class="control">
          <div class="label">所属BD</div>
          <el-select v-model="filters.bdId" placeholder="全部BD" clearable>
            <el-option v-for="b in bdOptions" :key="b.id" :label="b.name" :value="b.id" />
          </el-select>
        </div>
        <div class="control">
          <div class="label">店铺名称</div>
          <el-select v-model="filters.shopId" placeholder="所有店铺" clearable>
            <el-option v-for="s in shopOptions" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </div>
        <div class="control wide">
          <div class="label">商品搜索</div>
          <el-input
            v-model="filters.productKeyword"
            placeholder="请输入商品名称/商品ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </div>
        <div class="control wide">
          <div class="label">达人搜索</div>
          <el-input
            v-model="filters.streamerKeyword"
            placeholder="请输入达人名称/达人ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </div>

        <div class="control actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 直播录屏总览区 -->
    <div class="overview-card">
      <div class="overview-header">
        <div class="overview-title">直播录屏总览</div>
        <div class="overview-range">数据统计日期：{{ overviewRangeText }}</div>
      </div>
      <div class="overview-metrics">
        <div v-for="m in overviewMetrics" :key="m.key" class="metric">
          <div class="metric-label">{{ m.label }}</div>
          <div class="metric-value">{{ m.value }}</div>
          <div class="metric-mom" :class="m.momClass">{{ m.momText }}</div>
        </div>
      </div>
    </div>

    <!-- 录屏列表区 -->
    <div class="list-card">
      <div class="list-header">
        <div class="list-title">录屏列表</div>
        <div class="list-actions">
          <el-button class="monitor-btn" @click="monitorDialogVisible = true">
            监控达人名单({{ monitorInfluencersTotal }})
          </el-button>
        </div>
      </div>
      <div class="list-subtitle">本月已录制 {{ monthStats.recorded }} 场合作直播, 还可录制 {{ monthStats.remaining }} 场</div>

      <el-table
        v-loading="loading"
        :data="pagedRecordings"
        class="recording-table"
        @row-click="openDetail"
      >
        <el-table-column prop="screen_id" label="录屏ID" min-width="140" />
        <el-table-column prop="platform" label="平台" min-width="110">
          <template #default="{ row }">{{ platformLabel(row.platform) }}</template>
        </el-table-column>
        <el-table-column label="达人" min-width="220">
          <template #default="{ row }">
            <div class="cell-user">
              <el-avatar :size="28" :src="row.streamer_avatar || undefined" />
              <div class="cell-user-meta">
                <div class="name">{{ row.streamer_name }}</div>
                <div class="sub">{{ row.streamer_id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品" min-width="260">
          <template #default="{ row }">
            <div class="cell-product">
              <div class="img" />
              <div class="cell-user-meta">
                <div class="name">{{ row.product_name }}</div>
                <div class="sub">{{ row.product_id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stream_time" label="直播时间" min-width="170" />
        <el-table-column prop="screen_duration" label="讲解时长(s)" min-width="120" />
        <el-table-column prop="sales_amount" label="成交金额" min-width="120">
          <template #default="{ row }">￥{{ formatMoney(row.sales_amount) }}</template>
        </el-table-column>
        <el-table-column prop="sales_order_count" label="订单数" min-width="90" />
        <el-table-column prop="violation_status" label="违规" min-width="90">
          <template #default="{ row }">
            <el-tag v-if="row.violation_status === 1" type="danger">有违规</el-tag>
            <el-tag v-else type="success">无违规</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!loading && filteredRecordings.length === 0" class="empty-state">
        暂无录屏数据
      </div>

      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredRecordings.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 录屏详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="录屏详情" width="860px" :destroy-on-close="true">
      <div v-if="currentRecording" class="detail-body">
        <div class="player">
          <div class="player-inner">
            <div class="player-tip">录屏视频播放器（后续接入 screen_url）</div>
          </div>
        </div>

        <div class="detail-grid">
          <div class="kv"><div class="k">录屏ID</div><div class="v">{{ currentRecording.screen_id }}</div></div>
          <div class="kv"><div class="k">达人信息</div><div class="v">{{ currentRecording.streamer_name }}（{{ currentRecording.streamer_id }}）</div></div>
          <div class="kv"><div class="k">直播时间</div><div class="v">{{ currentRecording.stream_time }}</div></div>
          <div class="kv"><div class="k">直播时长</div><div class="v">{{ formatDuration(currentRecording.stream_duration) }}</div></div>
          <div class="kv"><div class="k">商品信息</div><div class="v">{{ currentRecording.product_name }}（{{ currentRecording.product_id }}）</div></div>
          <div class="kv"><div class="k">讲解时长</div><div class="v">{{ formatDuration(currentRecording.screen_duration) }}</div></div>
          <div class="kv"><div class="k">违规情况</div><div class="v">{{ currentRecording.violation_status ? (currentRecording.violation_content || '有违规') : '无违规' }}</div></div>
          <div class="kv"><div class="k">成交金额</div><div class="v">￥{{ formatMoney(currentRecording.sales_amount) }}</div></div>
          <div class="kv"><div class="k">成交订单数</div><div class="v">{{ currentRecording.sales_order_count }}</div></div>
          <div class="kv"><div class="k">互动数据</div><div class="v">点赞{{ currentRecording.like_count }}、评论{{ currentRecording.comment_count }}、分享{{ currentRecording.share_count }}</div></div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 监控达人名单弹窗 -->
    <el-dialog v-model="monitorDialogVisible" title="监控达人名单" width="720px" :destroy-on-close="true">
      <div class="monitor-toolbar">
        <el-input
          v-model="monitorSearchKeyword"
          placeholder="搜索达人名称/达人ID"
          clearable
          @keyup.enter="handleMonitorQuery"
        />
        <el-button type="primary" @click="handleAddMonitor">+ 添加监控达人</el-button>
      </div>

      <el-table :data="pagedMonitorInfluencers" class="monitor-table">
        <el-table-column label="达人" min-width="320">
          <template #default="{ row }">
            <div class="cell-user">
              <el-avatar :size="28" :src="row.avatar || undefined" />
              <div class="cell-user-meta">
                <div class="name">{{ row.name }}</div>
                <div class="sub">{{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="right">
          <template #default="{ row }">
            <el-button link type="danger" @click="handleRemoveMonitor(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="monitorInfluencersFiltered.length === 0" class="empty-state">暂无监控达人</div>

      <div class="pagination-section">
        <el-pagination
          v-model:current-page="monitorPagination.page"
          v-model:page-size="monitorPagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="monitorInfluencersFiltered.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ============= 顶部平台选择区（按PRD：4个下拉） =============
const platformOptions = [
  { value: 'tiktok', label: 'Tik Tok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' }
]
const topPlatform = ref('tiktok')
const topPlatform2 = ref('')
const topPlatform3 = ref('')
const topPlatform4 = ref('')

// ============= 筛选区平台Tab（与你们合作管理的“平台Tab”一致风格） =============
const platformTabs = [
  { key: 'all', label: '全部' },
  { key: 'tiktok', label: 'Tik Tok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]

const timeDims = [
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'custom', label: '自定义' },
  { key: 'lastN', label: '近N天' }
]

const departmentOptions = ref([
  { id: 'dept_all', name: '全部部门' },
  { id: 'dept1', name: '销售部' },
  { id: 'dept2', name: '市场部' },
  { id: 'dept3', name: '运营部' }
])
const bdOptions = ref([
  { id: 'bd_all', name: '全部BD' },
  { id: 'bd1', name: '张三' },
  { id: 'bd2', name: '李四' },
  { id: 'bd3', name: '王五' }
])
const shopOptions = ref([
  { id: 'shop_all', name: '所有店铺' },
  { id: 'shop1', name: '官方旗舰店' },
  { id: 'shop2', name: '京东自营店' },
  { id: 'shop3', name: '天猫旗舰店' }
])

const filters = reactive({
  platform: 'all',
  timeDim: 'lastN',
  departmentId: '',
  bdId: '',
  shopId: '',
  productKeyword: '',
  streamerKeyword: ''
})

const filterAnchorRef = ref(null)
function scrollToFilters() {
  filterAnchorRef.value?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
}

function handlePlatformTabChange(key) {
  filters.platform = key
  pagination.page = 1
  ElMessage.success('平台切换成功')
}

function handleTimeDimChange(key) {
  filters.timeDim = key
  if (key === 'custom') {
    ElMessage.info('自定义时间范围 - 待接入日期选择器')
  } else if (key === 'lastN') {
    ElMessage.info('近N天 - 待接入下拉（近7/30/90天）')
  }
  pagination.page = 1
}

const timeRangeText = computed(() => '近7天（2025/11/20 - 2025/11/26）')
const overviewRangeText = computed(() => '2026/02/05-2026/03/06')

// ============= 列表数据（先用mock，后续替换为API） =============
const loading = ref(false)
const recordings = ref([
  {
    screen_id: 'SCR-000001',
    stream_id: 'STR-000001',
    platform: 'tiktok',
    streamer_id: 'I001',
    streamer_name: '@fashionqueen_k',
    streamer_avatar: '',
    product_id: 'P001',
    product_name: '氨基酸洁面乳',
    product_image: '',
    stream_time: '2025-11-26 10:00:00',
    stream_duration: 9000,
    screen_duration: 300,
    violation_status: 0,
    violation_content: '',
    sales_amount: 1000,
    sales_order_count: 10,
    refund_amount: 0,
    like_count: 100,
    comment_count: 50,
    share_count: 30,
    screen_url: '',
    department_id: 'dept2',
    bd_id: 'bd1',
    shop_id: 'shop3',
    create_time: '2025-11-26 12:00:00'
  }
])

const filteredRecordings = computed(() => {
  let result = recordings.value

  if (filters.platform !== 'all') {
    result = result.filter(r => r.platform === filters.platform)
  }
  if (filters.departmentId) {
    result = result.filter(r => r.department_id === filters.departmentId)
  }
  if (filters.bdId) {
    result = result.filter(r => r.bd_id === filters.bdId)
  }
  if (filters.shopId) {
    result = result.filter(r => r.shop_id === filters.shopId)
  }
  if (filters.productKeyword) {
    const kw = filters.productKeyword.trim().toLowerCase()
    result = result.filter(r =>
      r.product_name.toLowerCase().includes(kw) || r.product_id.toLowerCase().includes(kw)
    )
  }
  if (filters.streamerKeyword) {
    const kw = filters.streamerKeyword.trim().toLowerCase()
    result = result.filter(r =>
      r.streamer_name.toLowerCase().includes(kw) || r.streamer_id.toLowerCase().includes(kw)
    )
  }
  return result
})

const pagination = reactive({ page: 1, pageSize: 10 })
const pagedRecordings = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredRecordings.value.slice(start, end)
})

function handleQuery() {
  pagination.page = 1
  ElMessage.success('搜索成功')
  if (filteredRecordings.value.length === 0) {
    ElMessage.info('暂无搜索结果')
  }
}

function handleReset() {
  filters.platform = 'all'
  filters.timeDim = 'lastN'
  filters.departmentId = ''
  filters.bdId = ''
  filters.shopId = ''
  filters.productKeyword = ''
  filters.streamerKeyword = ''
  pagination.page = 1
  ElMessage.success('重置成功')
}

// ============= 总览（mock聚合） =============
const monthStats = reactive({ recorded: 0, remaining: 200 })
const overviewMetrics = computed(() => {
  const totalScreens = filteredRecordings.value.length
  const totalSegments = filteredRecordings.value.length
  const avgExplainSec =
    totalScreens === 0 ? 0 : Math.round(filteredRecordings.value.reduce((s, r) => s + r.screen_duration, 0) / totalScreens)
  const salesAmount = filteredRecordings.value.reduce((s, r) => s + Number(r.sales_amount || 0), 0)
  const orderCount = filteredRecordings.value.reduce((s, r) => s + Number(r.sales_order_count || 0), 0)
  const refundAmount = filteredRecordings.value.reduce((s, r) => s + Number(r.refund_amount || 0), 0)

  return [
    { key: 'screenCount', label: '已录屏场次', value: String(totalScreens), momText: '环比 ↑ 0%', momClass: 'up' },
    { key: 'segmentCount', label: '录屏片段', value: String(totalSegments), momText: '环比 ↑ 0%', momClass: 'up' },
    { key: 'avgExplain', label: '平均讲解时长', value: String(avgExplainSec), momText: '环比 ↑ 0%', momClass: 'up' },
    { key: 'salesAmount', label: '成交金额', value: `￥${formatMoney(salesAmount)}`, momText: '环比 ↑ 0%', momClass: 'up' },
    { key: 'orderCount', label: '成交订单数', value: String(orderCount), momText: '环比 ↑ 0%', momClass: 'up' },
    { key: 'refundAmount', label: '退款金额', value: `￥${formatMoney(refundAmount)}`, momText: '环比 ↑ 0%', momClass: 'up' }
  ]
})

// ============= 详情弹窗 =============
const detailDialogVisible = ref(false)
const currentRecording = ref(null)
function openDetail(row) {
  currentRecording.value = row
  detailDialogVisible.value = true
}

// ============= 监控达人名单 =============
const monitorDialogVisible = ref(false)
const monitorSearchKeyword = ref('')
const monitorPagination = reactive({ page: 1, pageSize: 10 })
const monitorInfluencers = ref(
  Array.from({ length: 66 }).map((_, idx) => ({
    id: `M${String(idx + 1).padStart(3, '0')}`,
    name: `达人${idx + 1}`,
    avatar: ''
  }))
)

const monitorInfluencersFiltered = computed(() => {
  const kw = monitorSearchKeyword.value.trim().toLowerCase()
  if (!kw) return monitorInfluencers.value
  return monitorInfluencers.value.filter(i => i.name.toLowerCase().includes(kw) || i.id.toLowerCase().includes(kw))
})

const pagedMonitorInfluencers = computed(() => {
  const start = (monitorPagination.page - 1) * monitorPagination.pageSize
  const end = start + monitorPagination.pageSize
  return monitorInfluencersFiltered.value.slice(start, end)
})

const monitorInfluencersTotal = computed(() => monitorInfluencers.value.length)

function handleMonitorQuery() {
  monitorPagination.page = 1
  if (monitorInfluencersFiltered.value.length === 0) {
    ElMessage.info('暂无搜索结果')
  } else {
    ElMessage.success('搜索成功')
  }
}

function handleAddMonitor() {
  ElMessage.info('添加监控达人 - 待接入选择/搜索组件与API')
}

async function handleRemoveMonitor(row) {
  try {
    await ElMessageBox.confirm('确认删除该监控达人？', '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    monitorInfluencers.value = monitorInfluencers.value.filter(i => i.id !== row.id)
    ElMessage.success('删除成功')
  } catch {
    // user canceled
  }
}

// ============= utils =============
function platformLabel(p) {
  return platformOptions.find(x => x.value === p)?.label || p
}
function formatMoney(v) {
  const n = Number(v || 0)
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
function formatDuration(sec) {
  const s = Number(sec || 0)
  if (s < 60) return `${s}秒`
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m < 60) return `${m}分钟${r ? `${r}秒` : ''}`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${h}小时${mm ? `${mm}分钟` : ''}`
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.live-recording-page {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

.top-platform-select {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  margin-bottom: 12px;

  .platform-select {
    width: 160px;
  }
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
    max-width: 1080px;
  }
  .welcome-btn {
    margin-top: 12px;
  }
}

.feature-section {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 16px;
  margin-bottom: 12px;

  .feature-title {
    font-weight: 700;
    color: #111;
    margin-bottom: 12px;
  }

  .feature-cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .feature-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: #cfe0ff;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }

    &.active {
      border-color: #1677ff;
      box-shadow: 0 12px 26px rgba(22, 119, 255, 0.15);
    }

    .feature-name {
      font-weight: 700;
      color: #111;
      margin-bottom: 6px;
    }
    .feature-desc {
      color: #666;
    }
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

.time-dim {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dim-btns {
  display: flex;
  gap: 8px;
}

.dim-btn {
  padding: 6px 10px;
  border-radius: 10px;
  background: #f5f6f7;
  color: #333;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  transition: all 0.15s ease;

  &:hover {
    background: #eef4ff;
  }

  &.active {
    background: #e6f0ff;
    border-color: #cfe0ff;
    color: #1677ff;
    font-weight: 700;
  }
}

.time-range-text {
  color: #666;
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
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

.wide {
  grid-column: span 1;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.overview-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 16px;
  margin-bottom: 12px;
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.overview-title {
  font-weight: 800;
  color: #111;
}

.overview-range {
  color: #666;
}

.overview-metrics {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.metric {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);

  .metric-label {
    color: #666;
    font-size: 12px;
  }
  .metric-value {
    margin-top: 6px;
    font-size: 18px;
    font-weight: 800;
    color: #111;
  }
  .metric-mom {
    margin-top: 6px;
    font-size: 12px;
    &.up {
      color: #e41e3f;
    }
    &.down {
      color: #31a24c;
    }
  }
}

.list-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 16px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.list-title {
  font-weight: 800;
  color: #111;
}

.monitor-btn {
  background: #e6f0ff;
  border-color: #cfe0ff;
  color: #1677ff;
}

.list-subtitle {
  margin-top: 8px;
  color: #666;
}

.recording-table {
  margin-top: 12px;
}

.cell-user,
.cell-product {
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

.cell-product .img {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f2f3f5;
  border: 1px solid #eee;
}

.pagination-section {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  padding: 18px 0 6px;
  color: #999;
  text-align: center;
}

.detail-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.player {
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  background: #0b0f1a;
}

.player-inner {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-tip {
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
}

.kv {
  display: flex;
  gap: 10px;
  .k {
    width: 90px;
    color: #666;
    font-size: 12px;
    flex-shrink: 0;
  }
  .v {
    color: #111;
    font-weight: 600;
    min-width: 0;
  }
}

.monitor-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.monitor-table {
  margin-top: 6px;
}

@media (max-width: 1280px) {
  .overview-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .filter-controls {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>


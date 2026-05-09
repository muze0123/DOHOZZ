<template>
  <div class="shopping-video">
    <!-- ==================== 区域1：平台Tab切换 ==================== -->
    <div class="platform-tabs-wrapper">
      <!-- TODO: PlatformTabs 组件 (Task 3) -->
      <div class="temp-placeholder">
        <div class="temp-tabs">
          <span
            v-for="p in platformOptions"
            :key="p.value"
            class="temp-tab"
            :class="{ active: state.platform === p.value }"
            @click="handlePlatformChange(p.value)"
          >
            {{ p.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- ==================== 区域2：全局筛选工具栏 ==================== -->
    <div class="filter-toolbar-wrapper">
      <!-- TODO: FilterToolbar 组件 (Task 4) -->
      <div class="temp-placeholder filter-toolbar">
        <div class="filter-row">
          <div class="filter-item">
            <span class="filter-label">时间筛选</span>
            <el-select v-model="state.filters.timeRange.type" size="small" class="filter-select" @change="handleTimeRangeChange">
              <el-option label="今日" value="today" />
              <el-option label="昨日" value="yesterday" />
              <el-option label="近7天" value="last7days" />
              <el-option label="近30天" value="last30days" />
              <el-option label="自定义" value="custom" />
            </el-select>
            <el-date-picker
              v-if="state.filters.timeRange.type === 'custom'"
              v-model="state.filters.timeRange.customRange"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              class="date-range-picker"
            />
          </div>
          <div class="filter-item">
            <span class="filter-label">店铺</span>
            <el-select v-model="state.filters.shop" placeholder="全部店铺" filterable clearable size="small" class="filter-select">
              <el-option label="全部店铺" value="" />
              <el-option label="店铺A" value="shopA" />
              <el-option label="店铺B" value="shopB" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">达人</span>
            <el-input v-model="state.filters.influencer" placeholder="搜索达人" clearable size="small" class="filter-input" />
          </div>
          <div class="filter-item">
            <span class="filter-label">BD</span>
            <el-select v-model="state.filters.bd" placeholder="全部BD" filterable clearable size="small" class="filter-select">
              <el-option label="全部BD" value="" />
              <el-option label="张三" value="bd1" />
              <el-option label="李四" value="bd2" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">部门</span>
            <el-select v-model="state.filters.department" placeholder="全部部门" filterable clearable size="small" class="filter-select">
              <el-option label="全部部门" value="" />
              <el-option label="销售一部" value="dept1" />
              <el-option label="销售二部" value="dept2" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">商品</span>
            <el-input v-model="state.filters.product" placeholder="搜索商品" clearable size="small" class="filter-input" />
          </div>
          <div class="filter-item">
            <span class="filter-label">销量区间</span>
            <el-input-number v-model="state.filters.salesVolume.min" :min="0" size="small" class="filter-number" controls-position="right" />
            <span class="range-separator">-</span>
            <el-input-number v-model="state.filters.salesVolume.max" :min="0" size="small" class="filter-number" controls-position="right" />
          </div>
          <div class="filter-item">
            <span class="filter-label">有派单</span>
            <el-select v-model="state.filters.hasAssignment" placeholder="全部" clearable size="small" class="filter-select">
              <el-option label="全部" :value="null" />
              <el-option label="有派单" :value="true" />
              <el-option label="无派单" :value="false" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">有履约</span>
            <el-select v-model="state.filters.hasDelivery" placeholder="全部" clearable size="small" class="filter-select">
              <el-option label="全部" :value="null" />
              <el-option label="有履约" :value="true" />
              <el-option label="无履约" :value="false" />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域3：追踪统计横幅 ==================== -->
    <div class="stats-banner-wrapper">
      <!-- TODO: StatsBanner 组件 (Task 5) -->
      <div class="temp-placeholder stats-banner">
        <div class="stats-cards">
          <div class="stats-card">
            <div class="stats-label">视频总数</div>
            <div class="stats-value">1,234</div>
            <div class="stats-trend trend-up">↑ 12.5%</div>
          </div>
          <div class="stats-card">
            <div class="stats-label">投放中</div>
            <div class="stats-value">856</div>
            <div class="stats-trend trend-up">↑ 8.3%</div>
          </div>
          <div class="stats-card">
            <div class="stats-label">总GMV</div>
            <div class="stats-value">¥12.56W</div>
            <div class="stats-trend trend-up">↑ 15.2%</div>
          </div>
          <div class="stats-card">
            <div class="stats-label">总观看</div>
            <div class="stats-value">2,345,678</div>
            <div class="stats-trend trend-down">↓ 3.2%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域4：分析区 ==================== -->
    <div class="analysis-section-wrapper">
      <!-- TODO: AnalysisSection 组件 (Task 6, 7, 8) -->
      <div class="temp-placeholder analysis-section">
        <!-- 指标Tab -->
        <div class="metric-tabs">
          <span
            v-for="m in metricOptions"
            :key="m.value"
            class="metric-tab"
            :class="{ active: state.currentMetric === m.value }"
            @click="handleMetricChange(m.value)"
          >
            {{ m.label }}
          </span>
        </div>

        <!-- 三指标块 -->
        <div class="metric-cards">
          <div class="metric-card">
            <div class="metric-label">新增视频</div>
            <div class="metric-value">328</div>
            <div class="metric-trend trend-up">↑ 18.5%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">带货视频</div>
            <div class="metric-value">456</div>
            <div class="metric-trend trend-up">↑ 12.3%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">履约视频</div>
            <div class="metric-value">234</div>
            <div class="metric-trend trend-down">↓ 5.8%</div>
          </div>
        </div>

        <!-- 趋势图表 -->
        <div class="trend-chart-area">
          <div class="chart-title">趋势图</div>
          <div class="chart-placeholder">
            <!-- TODO: TrendChart 组件 (Task 7) -->
            <span>TrendChart Component Placeholder</span>
          </div>
        </div>

        <!-- GMV分布和类目TOP5 -->
        <div class="bottom-charts">
          <div class="chart-block">
            <div class="chart-title">GMV分布</div>
            <!-- TODO: GMVDistribution 组件 (Task 8) -->
            <div class="chart-placeholder">GMVDistribution Placeholder</div>
          </div>
          <div class="chart-block">
            <div class="chart-title">类目TOP5</div>
            <!-- TODO: CategoryTop5 组件 (Task 8) -->
            <div class="chart-placeholder">CategoryTop5 Placeholder</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 区域5：视频列表区 ==================== -->
    <div class="video-list-section-wrapper">
      <!-- TODO: VideoListSection 组件 (Task 9, 10, 11, 12) -->
      <div class="temp-placeholder video-list-section">
        <!-- 列表头部操作栏 -->
        <div class="list-header">
          <div class="list-left">
            <el-checkbox v-model="selectAll" @change="handleSelectAllChange">全选</el-checkbox>
            <span class="selected-count">已选 {{ state.selectedVideos.length }} 条</span>
            <el-button
              type="primary"
              size="small"
              :disabled="state.selectedVideos.length === 0 || state.selectedVideos.length > 100"
              @click="handleBatchPublish"
            >
              批量投放 ({{ state.selectedVideos.length }})
            </el-button>
            <span v-if="state.selectedVideos.length > 100" class="warning-text">最多只能投放100条</span>
          </div>
          <div class="list-right">
            <span class="sub-tab"
              :class="{ active: state.currentSubTab === 'all' }"
              @click="state.currentSubTab = 'all'"
            >
              全部
            </span>
            <span class="sub-tab"
              :class="{ active: state.currentSubTab === 'hasorder' }"
              @click="state.currentSubTab = 'hasorder'"
            >
              有订单
            </span>
            <span class="sub-tab"
              :class="{ active: state.currentSubTab === 'noorder' }"
              @click="state.currentSubTab = 'noorder'"
            >
              无订单
            </span>
            <el-divider direction="vertical" />
            <span
              class="view-btn"
              :class="{ active: state.listView === 'table' }"
              @click="state.listView = 'table'"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 13h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V7H3v2z"/></svg>
            </span>
            <span
              class="view-btn"
              :class="{ active: state.listView === 'card' }"
              @click="state.listView = 'card'"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
            </span>
          </div>
        </div>

        <!-- 表格视图 -->
        <div v-if="state.listView === 'table'" class="video-table">
          <!-- TODO: VideoTable 组件 (Task 9) -->
          <div class="table-placeholder">
            <span>VideoTable Component Placeholder</span>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div v-else class="video-card-grid">
          <!-- TODO: VideoCardGrid 组件 (Task 10) -->
          <div class="card-placeholder">
            <span>VideoCardGrid Component Placeholder</span>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <Pagination
            v-model="paginationState"
            :total="totalVideoCount"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

// ==================== 状态管理 ====================
const state = reactive({
  platform: 'tiktok',  // tiktok/instagram/shopee/lazada
  currentMetric: 'new', // new/selling/delivery
  filters: {
    timeRange: { type: 'last7days', start: '', end: '', customRange: [] },
    shop: '',
    influencer: '',
    bd: '',
    department: '',
    product: '',
    salesVolume: { min: null, max: null },
    hasAssignment: null,     // null/true/false
    hasDelivery: null       // null/true/false
  },
  selectedVideos: [],  // 批量投放选中
  listView: 'table',   // table/card
  currentSubTab: 'all'  // all/hasorder/noorder
})

// ==================== 平台选项 ====================
const platformOptions = [
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Shopee', value: 'shopee' },
  { label: 'Lazada', value: 'lazada' }
]

// ==================== 指标选项 ====================
const metricOptions = [
  { label: '新增', value: 'new' },
  { label: '带货中', value: 'selling' },
  { label: '履约中', value: 'delivery' }
]

// ==================== 默认筛选条件 ====================
const getDefaultFilters = () => ({
  timeRange: { type: 'last7days', start: '', end: '', customRange: [] },
  shop: '',
  influencer: '',
  bd: '',
  department: '',
  product: '',
  salesVolume: { min: null, max: null },
  hasAssignment: null,
  hasDelivery: null
})

// ==================== 全选状态 ====================
const selectAll = computed({
  get: () => state.selectedVideos.length === 100,
  set: (val) => {
    // TODO: Task 9 实现全选逻辑
  }
})

// ==================== 平台切换 ====================
const handlePlatformChange = (platform) => {
  state.platform = platform
  // 重置所有筛选条件为默认值
  state.filters = getDefaultFilters()
  state.selectedVideos = []
  state.currentSubTab = 'all'
  selectAll.value = false
}

// ==================== 时间范围变化 ====================
const handleTimeRangeChange = (type) => {
  // TODO: Task 4 实现时间范围变化逻辑
}

// ==================== 指标切换 ====================
const handleMetricChange = (metric) => {
  state.currentMetric = metric
  // TODO: Task 6/7/8 实现指标联动刷新图表和列表
}

// ==================== 全选变化 ====================
const handleSelectAllChange = (val) => {
  // TODO: Task 9 实现全选变化逻辑
}

// ==================== 批量投放 ====================
const handleBatchPublish = () => {
  if (state.selectedVideos.length === 0) {
    ElMessage.warning('请先选择视频')
    return
  }
  if (state.selectedVideos.length > 100) {
    ElMessage.warning('最多只能投放100条视频')
    return
  }
  ElMessage.success(`已选择 ${state.selectedVideos.length} 条视频进行批量投放`)
}

// ==================== 分页状态 ====================
const paginationState = ref({ page: 1, pageSize: 20 })
const totalVideoCount = ref(100)

// ==================== 分页变化 ====================
const handlePageChange = (page) => {
  paginationState.value.page = page
}
</script>

<style lang="scss" scoped>
// 使用 Dashboard 的变量
$primary-color: #1677ff;
$success-color: #52c41a;
$warning-color: #fa8c16;
$error-color: #ff4d4f;
$text-primary: #1e293b;
$text-secondary: #64748b;
$border-color: #e8e8e8;
$bg-light: #f5f7fa;

.shopping-video {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100vh;

  .temp-placeholder {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }
}

// ==================== 平台Tab ====================
.platform-tabs-wrapper {
  margin-bottom: 16px;

  .temp-placeholder {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 12px 16px;
  }

  .temp-tabs {
    display: flex;
    gap: 8px;
  }

  .temp-tab {
    padding: 8px 24px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;

    &:hover {
      color: #fff;
    }

    &.active {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      font-weight: 500;
    }
  }
}

// ==================== 筛选工具栏 ====================
.filter-toolbar-wrapper {
  margin-bottom: 16px;

  .filter-toolbar {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
  }

  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-label {
    font-size: 14px;
    color: $text-secondary;
    white-space: nowrap;
  }

  .filter-select {
    width: 140px;
  }

  .filter-input {
    width: 120px;
  }

  .filter-number {
    width: 80px;
  }

  .range-separator {
    color: $text-secondary;
  }

  .date-range-picker {
    width: 240px;
  }
}

// ==================== 统计横幅 ====================
.stats-banner-wrapper {
  margin-bottom: 16px;

  .stats-banner {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    border-radius: 12px;
    padding: 20px;
  }

  .stats-cards {
    display: flex;
    gap: 24px;
  }

  .stats-card {
    flex: 1;
    color: #fff;

    .stats-label {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 4px;
    }

    .stats-value {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .stats-trend {
      font-size: 12px;

      &.trend-up {
        color: #ffd700;
      }

      &.trend-down {
        color: #ff6b6b;
      }
    }
  }
}

// ==================== 分析区 ====================
.analysis-section-wrapper {
  margin-bottom: 16px;

  .analysis-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
  }

  .metric-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 1px solid $border-color;
    padding-bottom: 12px;
  }

  .metric-tab {
    padding: 8px 20px;
    color: $text-secondary;
    cursor: pointer;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s;

    &:hover {
      color: $primary-color;
    }

    &.active {
      background: $primary-color;
      color: #fff;
    }
  }

  .metric-cards {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
  }

  .metric-card {
    flex: 1;
    background: $bg-light;
    border-radius: 8px;
    padding: 16px;

    .metric-label {
      font-size: 13px;
      color: $text-secondary;
      margin-bottom: 8px;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 4px;
    }

    .metric-trend {
      font-size: 12px;

      &.trend-up {
        color: $success-color;
      }

      &.trend-down {
        color: $error-color;
      }
    }
  }

  .trend-chart-area {
    margin-bottom: 24px;

    .chart-title {
      font-size: 14px;
      font-weight: 500;
      color: $text-primary;
      margin-bottom: 12px;
    }

    .chart-placeholder {
      height: 200px;
      background: $bg-light;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-secondary;
      font-size: 14px;
    }
  }

  .bottom-charts {
    display: flex;
    gap: 20px;

    .chart-block {
      flex: 1;

      .chart-title {
        font-size: 14px;
        font-weight: 500;
        color: $text-primary;
        margin-bottom: 12px;
      }

      .chart-placeholder {
        height: 180px;
        background: $bg-light;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $text-secondary;
        font-size: 14px;
      }
    }
  }
}

// ==================== 视频列表区 ====================
.video-list-section-wrapper {
  .video-list-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $border-color;
  }

  .list-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .selected-count {
    font-size: 13px;
    color: $text-secondary;
  }

  .warning-text {
    font-size: 12px;
    color: $error-color;
  }

  .list-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sub-tab {
    padding: 6px 12px;
    color: $text-secondary;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
    transition: all 0.3s;

    &:hover {
      color: $primary-color;
    }

    &.active {
      background: rgba(22, 119, 255, 0.1);
      color: $primary-color;
    }
  }

  .view-btn {
    padding: 6px;
    cursor: pointer;
    color: $text-secondary;
    border-radius: 4px;
    display: flex;
    align-items: center;
    transition: all 0.3s;

    &:hover {
      color: $primary-color;
      background: $bg-light;
    }

    &.active {
      color: $primary-color;
      background: rgba(22, 119, 255, 0.1);
    }
  }

  .video-table {
    margin-bottom: 16px;

    .table-placeholder {
      height: 300px;
      background: $bg-light;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-secondary;
      font-size: 14px;
    }
  }

  .video-card-grid {
    margin-bottom: 16px;

    .card-placeholder {
      height: 300px;
      background: $bg-light;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-secondary;
      font-size: 14px;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid $border-color;

    .pagination-placeholder {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
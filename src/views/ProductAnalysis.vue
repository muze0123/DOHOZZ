<template>
  <div class="product-analysis">
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

    <!-- 时间筛选区 -->
    <div class="time-section">
      <div class="time-tabs">
        <div class="time-tab" :class="{ active: timeType === 'week' }" @click="handleTimeTypeChange('week')">周</div>
        <div class="time-tab" :class="{ active: timeType === 'month' }" @click="handleTimeTypeChange('month')">月</div>
        <div class="time-tab" :class="{ active: timeType === 'custom' }" @click="handleTimeTypeChange('custom')">自定义</div>
        <div class="time-tab" :class="{ active: timeType === 'near' }" @click="handleTimeTypeChange('near')">近N天</div>
      </div>

      <!-- 周选择 -->
      <div v-if="timeType === 'week'" class="time-select">
        <el-select v-model="selectedWeek" placeholder="请选择周" style="width: 260px">
          <el-option v-for="week in weekOptions" :key="week.value" :label="week.label" :value="week.value" />
        </el-select>
      </div>

      <!-- 月选择 -->
      <div v-if="timeType === 'month'" class="time-select">
        <el-select v-model="selectedMonth" placeholder="请选择月份" style="width: 260px">
          <el-option v-for="month in monthOptions" :key="month.value" :label="month.label" :value="month.value" />
        </el-select>
      </div>

      <!-- 自定义选择 -->
      <div v-if="timeType === 'custom'" class="time-select">
        <el-date-picker
          v-model="customDateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 260px"
        />
      </div>

      <!-- 近N天选择 -->
      <div v-if="timeType === 'near'" class="time-select">
        <el-select v-model="selectedNearDays" placeholder="请选择天数" style="width: 160px">
          <el-option label="今天" :value="0" />
          <el-option label="昨天" :value="1" />
          <el-option label="近7天" :value="7" />
          <el-option label="近15天" :value="15" />
          <el-option label="近30天" :value="30" />
        </el-select>
      </div>

      <div class="time-range-display">{{ timeRangeDisplay }}</div>
    </div>

    <!-- 筛选条件区 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>商品类目</label>
          <el-select v-model="filters.categoryId" placeholder="请选择" filterable clearable style="width: 160px">
            <el-option v-for="cat in categoryOptions" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <label>商品品牌</label>
          <el-select v-model="filters.brandId" placeholder="请选择" filterable clearable style="width: 160px">
            <el-option v-for="brand in brandOptions" :key="brand.id" :label="brand.name" :value="brand.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <label>店铺名称</label>
          <el-select v-model="filters.shopId" placeholder="所有店铺" filterable clearable style="width: 180px">
            <el-option v-for="shop in shopOptions" :key="shop.id" :label="shop.name" :value="shop.id" />
          </el-select>
        </div>
      </div>
      <div class="filter-row">
        <div class="filter-item">
          <label>所属部门</label>
          <el-select v-model="filters.departmentId" placeholder="全部部门" filterable clearable style="width: 160px">
            <el-option v-for="dept in departmentOptions" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <label>所属BD</label>
          <el-select v-model="filters.bdId" placeholder="全部BD" filterable clearable style="width: 160px">
            <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
          </el-select>
        </div>
        <div class="filter-item filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 标题和信息区 -->
    <div class="title-section">
      <div class="title-left">
        <span class="title">SPU分析</span>
      </div>
      <div class="title-right">
        <span class="data-range">数据范围：{{ dataRangeStart }} - {{ dataRangeEnd }}</span>
        <span class="separator">|</span>
        <span class="update-time">
          数据更新时间：{{ dataUpdateTime }}
          <el-tooltip content="数据每小时更新一次" placement="top">
            <el-icon class="help-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </div>
    </div>

    <!-- 数据指标卡片区 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue"><el-icon><Box /></el-icon></div>
          <div class="stat-content">
            <div class="stat-label">SPU数量</div>
            <div class="stat-value">{{ stats.spuCount.toLocaleString() }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><el-icon><Top /></el-icon></div>
          <div class="stat-content">
            <div class="stat-label">GMV环比上升SPU</div>
            <div class="stat-value">{{ stats.gmvUpCount }}</div>
            <div class="stat-sub">{{ stats.gmvUpRate }}%</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red"><el-icon><Bottom /></el-icon></div>
          <div class="stat-content">
            <div class="stat-label">GMV环比下降SPU</div>
            <div class="stat-value">{{ stats.gmvDownCount }}</div>
            <div class="stat-sub">{{ stats.gmvDownRate }}%</div>
          </div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-icon orange"><el-icon><Money /></el-icon></div>
          <div class="stat-content">
            <div class="stat-label">成交金额</div>
            <div class="stat-value">¥{{ formatWan(stats.dealAmount) }}</div>
            <div class="stat-change" :class="stats.dealAmountChange >= 0 ? 'up' : 'down'">
              {{ stats.dealAmountChange >= 0 ? '↑' : '↓' }}{{ Math.abs(stats.dealAmountChange) }}%
            </div>
          </div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-icon purple"><el-icon><ShoppingCart /></el-icon></div>
          <div class="stat-content">
            <div class="stat-label">销量</div>
            <div class="stat-value">{{ formatWan(stats.sales) }}</div>
            <div class="stat-change" :class="stats.salesChange >= 0 ? 'up' : 'down'">
              {{ stats.salesChange >= 0 ? '↑' : '↓' }}{{ Math.abs(stats.salesChange) }}%
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon gray"><el-icon><Delete /></el-icon></div>
          <div class="stat-content">
            <div class="stat-label">退款金额</div>
            <div class="stat-value">¥{{ formatWan(stats.refundAmount) }}</div>
            <div class="stat-change" :class="stats.refundChange >= 0 ? 'up' : 'down'">
              {{ stats.refundChange >= 0 ? '↑' : '↓' }}{{ Math.abs(stats.refundChange) }}%
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon teal"><el-icon><Link /></el-icon></div>
          <div class="stat-content">
            <div class="stat-label">关联链接数</div>
            <div class="stat-value">{{ stats.linkCount.toLocaleString() }}</div>
            <div class="stat-change" :class="stats.linkChange >= 0 ? 'up' : 'down'">
              {{ stats.linkChange >= 0 ? '↑' : '↓' }}{{ Math.abs(stats.linkChange) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 散点图分析区 -->
    <div class="chart-section">
      <div class="chart-header">
        <div class="chart-labels">
          <span class="axis-label">X轴：成交金额</span>
          <span class="axis-label">Y轴：出单达人</span>
        </div>
      </div>
      <div ref="chartRef" class="chart-container"></div>
    </div>

    <!-- SUP列表区 -->
    <div class="list-section">
      <div class="list-header">
        <div class="list-title">SUP列表</div>
        <div class="list-stats">
          <span>SPU数量：{{ stats.spuCount.toLocaleString() }}</span>
          <span>成交金额：¥{{ formatWan(stats.dealAmount) }}</span>
          <span>销量：{{ formatWan(stats.sales) }}</span>
        </div>
      </div>
      <el-table
        ref="listTableRef"
        :data="listData"
        style="width: 100%; min-width: 1200px"
        row-key="id"
      >
        <el-table-column label="SPU信息" min-width="280" fixed="left">
          <template #default="{ row }">
            <div class="spu-info">
              <div class="spu-name" @click="handleDetail(row)">{{ row.spuName }}</div>
              <div class="spu-id">
                <span class="id-text">ID:{{ row.spuId }}</span>
                <el-icon class="copy-icon" @click.stop="handleCopyId(row)"><CopyDocument /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品类目" min-width="100">
          <template #default="{ row }">
            <span>{{ row.categoryName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品品牌" min-width="100">
          <template #default="{ row }">
            <span>{{ row.brandName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源店铺" min-width="120">
          <template #default="{ row }">
            <span>{{ row.shopName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交金额" min-width="120" sortable align="right">
          <template #default="{ row }">
            <span class="amount">¥{{ formatMoney(row.gmv) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销量" min-width="100" sortable align="right">
          <template #default="{ row }">
            <span>{{ row.sales.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" min-width="100" align="right">
          <template #default="{ row }">
            <span class="refund">¥{{ formatMoney(row.refundAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联链接数" min-width="100" sortable align="right">
          <template #default="{ row }">
            <span>{{ row.linkCount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出单达人" min-width="100" sortable align="right">
          <template #default="{ row }">
            <span>{{ row.influencerCount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="GMV环比" min-width="100" sortable align="right">
          <template #default="{ row }">
            <span class="mom" :class="row.gmvMom >= 0 ? 'up' : 'down'">
              {{ row.gmvMom >= 0 ? '↑' : '↓' }}{{ Math.abs(row.gmvMom) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <span class="action-link" @click="handleDetail(row)">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 商品详情抽屉 -->
    <ProductDetailDrawer v-model="detailDrawerVisible" :product="currentProduct" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled, Box, Top, Bottom, Money, ShoppingCart, Delete, Link, CopyDocument } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import ProductDetailDrawer from './ProductLibrary/dialogs/ProductDetailDrawer.vue'

// 平台Tab配置
const platformTabs = [
  { key: 'tiktok', label: 'TikTok', enabled: true, icon: '<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.84a4.83 4.83 0 0 1-1.01-.15z"/>' },
  { key: 'instagram', label: 'Instagram', enabled: false, icon: '<path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>' },
  { key: 'shopee', label: 'Shopee', enabled: false, icon: '<path d="M22 12.22a1.88 1.88 0 0 0-1.05-1.65 9.88 9.88 0 0 0-5.6-1.8l1.3-1.8a.6.6 0 0 0-.09-.86.61.61 0 0 0-.82.12l-2.73 3.76a.6.6 0 0 0 .2.83l1.42 1a.62.62 0 0 0 .76-.14l1.4-1.95a11.7 11.7 0 0 1 6.4 2.1.6.6 0 0 0 .79-.47l.77-3.34a.59.59 0 0 0-.2-.67z"/>' },
  { key: 'lazada', label: 'Lazada', enabled: false, icon: '<path d="M22 8.18L11.28 1.07a1.12 1.12 0 0 0-1.03 0L.54 8.18a1.02 1.02 0 0 0-.4.81v5.5a1.02 1.02 0 0 0 .53.9l8.94 5.19a1.12 1.12 0 0 0 1.06 0l8.94-5.19a1.02 1.02 0 0 0 .53-.9v-5.5a1.02 1.02 0 0 0-.54-.81z"/>' }
]

const activePlatform = ref('tiktok')

// 时间筛选
const timeType = ref('month')
const selectedWeek = ref('')
const selectedMonth = ref('current')
const customDateRange = ref([])
const selectedNearDays = ref(7)

// 周选项
const weekOptions = computed(() => {
  const weeks = []
  const today = new Date()
  for (let i = 0; i < 5; i++) {
    const endDate = new Date(today)
    endDate.setDate(today.getDate() - i * 7 - 1)
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6)
    const formatDate = (d) => d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')
    weeks.push({
      value: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      label: `${formatDate(startDate)} - ${formatDate(endDate)}`
    })
  }
  return weeks
})

// 月选项
const monthOptions = computed(() => {
  const months = []
  const today = new Date()
  const currentMonth = today.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' })
  months.push({ value: 'current', label: `本月至今（${currentMonth}/01 - ${today.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}）` })

  for (let i = 1; i <= 4; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push({
      value: d.toLocaleDateString('zh-CN', { year: 'numeric' }) + '年' + (d.getMonth() + 1) + '月',
      label: d.toLocaleDateString('zh-CN', { year: 'numeric' }) + '年' + (d.getMonth() + 1) + '月'
    })
  }
  return months
})

// 时间范围显示
const timeRangeDisplay = computed(() => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  switch (timeType.value) {
    case 'week':
      return selectedWeek.value || '请选择周'
    case 'month':
      if (selectedMonth.value === 'current') {
        return `本月至今（${currentYear}/${String(currentMonth).padStart(2, '0')}/01 - ${currentYear}/${String(currentMonth).padStart(2, '0')}/${String(currentDay).padStart(2, '0')}）`
      }
      return selectedMonth.value
    case 'custom':
      return customDateRange.value && customDateRange.value.length === 2
        ? `自定义（${customDateRange.value[0]} - ${customDateRange.value[1]}）`
        : '请选择日期范围'
    case 'near':
      if (selectedNearDays.value === 0) return '今天'
      if (selectedNearDays.value === 1) return '昨天'
      return `近${selectedNearDays.value}天`
    default:
      return ''
  }
})

// 数据范围
const dataRangeStart = ref('2026/01/21')
const dataRangeEnd = ref('2026/01/30')
const dataUpdateTime = ref('2026-04-24 10:30:00')

// 筛选条件
const filters = reactive({
  categoryId: null,
  brandId: null,
  shopId: null,
  departmentId: null,
  bdId: null
})

// 选项数据
const categoryOptions = ref([
  { id: 1, name: '美妆个护' },
  { id: 2, name: '服饰鞋包' },
  { id: 3, name: '数码电子' },
  { id: 4, name: '母婴用品' }
])

const brandOptions = ref([
  { id: 1, name: '品牌A' },
  { id: 2, name: '品牌B' },
  { id: 3, name: '品牌C' }
])

const shopOptions = ref([
  { id: 1, name: '美妆旗舰店' },
  { id: 2, name: '服饰专营店' },
  { id: 3, name: '数码专营店' }
])

const departmentOptions = ref([
  { id: 1, name: '商务部' },
  { id: 2, name: '运营部' },
  { id: 3, name: '销售部' }
])

const bdOptions = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
])

// 统计数据
const stats = reactive({
  spuCount: 1302,
  gmvUpCount: 11,
  gmvUpRate: 1.25,
  gmvDownCount: 11,
  gmvDownRate: 0.75,
  dealAmount: 125600,
  dealAmountChange: 5.2,
  sales: 12300,
  salesChange: 3.8,
  refundAmount: 25600,
  refundChange: -2.1,
  linkCount: 2350,
  linkChange: 1.5
})

// 散点图
const chartRef = ref(null)
let chartInstance = null

// 抽屉状态
const detailDrawerVisible = ref(false)
const currentProduct = ref(null)
const listTableRef = ref(null)

// Mock列表数据
const listData = computed(() => {
  const categories = ['美妆个护', '服饰鞋包', '数码电子', '母婴用品']
  const brands = ['品牌A', '品牌B', '品牌C']
  const shops = ['美妆旗舰店', '服饰专营店', '数码专营店', '母婴用品店']

  return Array.from({ length: 50 }, (_, i) => {
    const gmv = Math.random() * 50000
    const sales = Math.floor(Math.random() * 10000)
    const refundAmount = gmv * (Math.random() * 0.1)
    const linkCount = Math.floor(Math.random() * 500)
    const influencerCount = Math.floor(Math.random() * 100)
    const gmvMom = (Math.random() - 0.5) * 20

    return {
      id: i + 1,
      spuId: `SPU${String(i + 1).padStart(6, '0')}`,
      spuName: `${categories[i % 4]}${brands[i % 3]}商品${i + 1} 热销爆款`,
      categoryName: categories[i % 4],
      brandName: brands[i % 3],
      shopName: shops[i % 4],
      gmv: parseFloat(gmv.toFixed(2)),
      sales,
      refundAmount: parseFloat(refundAmount.toFixed(2)),
      linkCount,
      influencerCount,
      gmvMom: parseFloat(gmvMom.toFixed(2))
    }
  })
})

// Mock散点图数据
const scatterData = computed(() => {
  const data = []
  const categories = ['美妆个护', '服饰鞋包', '数码电子', '母婴用品']
  const colors = ['#1677ff', '#52c41a', '#faad14', '#722ed1']

  for (let i = 0; i < 50; i++) {
    const categoryIndex = Math.floor(Math.random() * 4)
    data.push({
      value: [
        Math.random() * 500, // X: 成交金额
        Math.random() * 18 // Y: 出单达人
      ],
      name: `${categories[categoryIndex]}商品${i + 1}`,
      id: `SPU${String(i + 1).padStart(6, '0')}`,
      category: categories[categoryIndex],
      color: colors[categoryIndex],
      gmv: (Math.random() * 500).toFixed(2),
      influencers: (Math.random() * 18).toFixed(1)
    })
  }
  return data
})

// 初始化图表
function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    grid: {
      left: 60,
      right: 40,
      top: 40,
      bottom: 60
    },
    xAxis: {
      type: 'value',
      name: '成交金额（万）',
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#999' },
      splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
      min: 0,
      max: 500
    },
    yAxis: {
      type: 'value',
      name: '出单达人',
      nameLocation: 'middle',
      nameGap: 45,
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#999', formatter: (v) => v + 'w' },
      splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
      min: 0,
      max: 18
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const d = params.data
        return `<div style="font-size: 12px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${d.name}</div>
          <div>商品ID：${d.id}</div>
          <div>成交金额：¥${d.gmv}万</div>
          <div>出单达人：${d.influencers}万</div>
          <div>类目：${d.category}</div>
        </div>`
      }
    },
    series: [{
      type: 'scatter',
      symbolSize: 12,
      data: scatterData.value.map(d => ({
        value: d.value,
        name: d.name,
        id: d.id,
        category: d.category,
        color: d.color,
        gmv: d.gmv,
        influencers: d.influencers
      })),
      itemStyle: {
        color: (params) => params.data.color,
        opacity: 0.8
      },
      emphasis: {
        scale: 1.5,
        itemStyle: { opacity: 1 }
      }
    }],
    // 参考线
    markLine: {
      silent: true,
      symbol: 'none',
      lineStyle: { color: '#ff4d4f', type: 'dashed', width: 1 },
      label: {
        position: 'end',
        formatter: '平均值 {c}',
        fontSize: 11
      },
      data: [
        {
          yAxis: 9.5, // 出单达人平均值
          name: '出单达人平均值 9.5'
        },
        {
          xAxis: 250, // 成交金额平均值
          name: '成交金额平均值 250'
        }
      ]
    }
  }

  chartInstance.setOption(option)

  // 点击节点
  chartInstance.on('click', (params) => {
    if (params.componentType === 'series') {
      ElMessage.info(`正在跳转至商品详情：${params.data.name}`)
      currentProduct.value = {
        productId: params.data.id,
        productName: params.data.name,
        productImage: '',
        shopName: '示例店铺',
        shopImage: '',
        shopRegion: '菲律宾',
        price: parseFloat(params.data.gmv) * 10000,
        commissionRate: 2.5,
        inventory: 999,
        status: 'online',
        syncTime: dataUpdateTime.value,
        creatorCount: parseInt(params.data.influencers * 10000),
        creatorAmount: parseFloat(params.data.gmv) * 10000
      }
      detailDrawerVisible.value = true
    }
  })
}

// 监听窗口变化
function handleResize() {
  chartInstance?.resize()
}

// 方法
function handlePlatformChange(platform) {
  activePlatform.value = platform
  handleReset()
}

function handleTimeTypeChange(type) {
  timeType.value = type
}

function handleQuery() {
  if (timeType.value === 'custom' && customDateRange.value) {
    const [start, end] = customDateRange.value
    if (start && end && start > end) {
      ElMessage.warning('开始日期不能晚于结束日期')
      return
    }
  }
  ElMessage.success('查询成功')
}

function handleReset() {
  filters.categoryId = null
  filters.brandId = null
  filters.shopId = null
  filters.departmentId = null
  filters.bdId = null
  selectedWeek.value = ''
  selectedMonth.value = 'current'
  customDateRange.value = []
  selectedNearDays.value = 7
  ElMessage.success('重置成功')
}

function formatWan(v) {
  if (v >= 10000) {
    return (v / 10000).toFixed(2) + 'w'
  }
  return v.toLocaleString()
}

function formatMoney(v) {
  return v ? v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '0.00'
}

function handleCopyId(row) {
  navigator.clipboard.writeText(row.spuId).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

function handleDetail(row) {
  currentProduct.value = {
    productId: row.spuId || row.id,
    productName: row.spuName || row.productName,
    productImage: '',
    shopName: row.shopName || '示例店铺',
    shopImage: '',
    shopRegion: '菲律宾',
    price: row.gmv / Math.max(row.sales, 1),
    commissionRate: 2.5,
    inventory: 999,
    status: 'online',
    syncTime: dataUpdateTime.value,
    creatorCount: row.influencerCount || 0,
    creatorAmount: row.gmv || 0
  }
  detailDrawerVisible.value = true
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

// 监听数据变化刷新图表
watch(scatterData, () => {
  nextTick(() => {
    initChart()
  })
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.product-analysis {
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
}

.time-section {
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.time-tabs {
  display: flex;
  gap: 4px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 6px;
}

.time-tab {
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;

  &.active {
    background: #fff;
    color: #333;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &:hover:not(.active) {
    color: #333;
  }
}

.time-select {
  min-width: 200px;
}

.time-range-display {
  font-size: 13px;
  color: #666;
  margin-left: auto;
}

.filter-section {
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  &:last-child {
    margin-bottom: 0;
  }

  &.filter-actions {
    margin-left: auto;
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

.title-section {
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .title-right {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 8px;

    .separator {
      color: #e8e8e8;
    }

    .update-time {
      display: flex;
      align-items: center;
      gap: 4px;

      .help-icon {
        cursor: help;
        color: #999;
      }
    }
  }
}

.stats-section {
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}

.stat-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;

  &.highlight {
    background: linear-gradient(135deg, #fff7e6 0%, #fff2e6 100%);
    border: none;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;

    &.blue { background: #e6f4ff; color: #1677ff; }
    &.green { background: #f6ffed; color: #52c41a; }
    &.red { background: #fff2f0; color: #ff4d4f; }
    &.orange { background: #fff7e6; color: #fa8c16; }
    &.purple { background: #f9f0ff; color: #722ed1; }
    &.gray { background: #f5f5f5; color: #666; }
    &.teal { background: #e6fffb; color: #00856a; }
  }

  .stat-content {
    flex: 1;
    min-width: 0;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
  }

  .stat-sub {
    font-size: 12px;
    color: #52c41a;
    margin-top: 2px;
  }

  .stat-change {
    font-size: 12px;
    margin-top: 2px;

    &.up { color: #ff4d4f; }
    &.down { color: #52c41a; }
  }
}

.chart-section {
  background: #fff;
  padding: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .chart-labels {
    display: flex;
    gap: 16px;

    .axis-label {
      font-size: 12px;
      color: #666;
    }
  }
}

.chart-container {
  width: 100%;
  height: 400px;
}

.list-section {
  background: #fff;
  padding: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .list-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .list-stats {
    display: flex;
    gap: 24px;
    font-size: 13px;
    color: #666;
  }
}

.spu-info {
  .spu-name {
    font-size: 14px;
    color: #1677ff;
    cursor: pointer;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }

  .spu-id {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;

    .id-text {
      cursor: pointer;

      &:hover {
        color: #1677ff;
      }
    }

    .copy-icon {
      cursor: pointer;
      color: #999;

      &:hover {
        color: #1677ff;
      }
    }
  }
}

.amount {
  font-size: 14px;
  color: #00cc66;
  font-weight: 500;
}

.refund {
  font-size: 14px;
  color: #ff4d4f;
}

.mom {
  font-size: 13px;

  &.up { color: #ff4d4f; }
  &.down { color: #52c41a; }
}

.action-link {
  color: #1677ff;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
}
</style>

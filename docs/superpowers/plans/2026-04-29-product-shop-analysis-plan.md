# 商品&店铺指标分析页面实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在指挥中台下开发商品&店铺指标分析页面，包含平台切换、时间筛选、核心指标卡片、半圆环形图、折线趋势图、商品占比TOP15、SPU分布热力矩阵、出单SPU表格

**Architecture:** 采用组件化设计，主页面容器 + 11个子组件，使用 ECharts 图表库，Mock 数据驱动

**Tech Stack:** Vue 3 (Composition API + script setup), Element Plus, ECharts, Tailwind CSS

---

## 文件结构

```
dohozz-saas/src/
├── views/
│   └── ProductShopAnalysis.vue              # 主页面
├── views/components/ProductShop/
│   ├── PlatformTabs.vue                      # 平台切换
│   ├── TimeFilterBar.vue                     # 时间筛选
│   ├── FilterBar.vue                         # 基础筛选
│   ├── MetricsCards.vue                      # 核心指标卡片
│   ├── ChartTabs.vue                         # 图表切换标签
│   ├── RingChart.vue                         # 半圆环形图
│   ├── LineTrendChart.vue                    # 折线趋势图
│   ├── ProductShareCards.vue                 # 商品占比TOP15
│   ├── SpuDistribution.vue                   # SPU分布热力矩阵
│   └── SpuTable.vue                         # 出单SPU表格
├── mock/
│   └── productShopAnalysis.js                # Mock数据
└── router/index.js                          # 路由配置
```

---

## Task 1: 创建项目目录结构和Mock数据

**Files:**
- Create: `dohozz-saas/src/mock/productShopAnalysis.js`
- Create: `dohozz-saas/src/views/components/ProductShop/` (目录)

- [ ] **Step 1: 创建Mock数据文件**

```javascript
// dohozz-saas/src/mock/productShopAnalysis.js

// 平台列表
export const platforms = ['全部', '抖音', '快手', '视频号', '小红书']

// 快捷时间选项
export const quickTimeOptions = [
  { label: '近N天', value: 'near' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '大促', value: 'promo' },
  { label: '自定义', value: 'custom' }
]

// 归属筛选
export const attrOptions = ['全部出单达人', '团队建联达人']

// 类型筛选
export const typeOptions = ['全部', '达人', '团长']

// 店铺列表
export const shopOptions = [
  { label: '所有店铺', value: 'all' },
  { label: '示例店铺18', value: 'shop1' },
  { label: '懒猫馋馋官方旗舰店', value: 'shop2' }
]

// 核心指标数据
export const metricsData = {
  salesAmount: {
    value: 185.96,
    unit: 'w',
    orderCount: 62000,
    mom: -6.04,
    orderMom: -7.18
  },
  refundAmount: {
    value: 33.27,
    unit: 'w',
    orderCount: 9917,
    mom: -18.99,
    orderMom: -18.82
  },
  productCount: {
    value: 74,
    linkCount: 703,
    mom: -6.33,
    linkMom: 2.93
  }
}

// 商品占比TOP15
export const productShareList = [
  { id: '2909', name: '示例SPU商品2909', brand: '品牌A', salesAmount: 33000, ratio: 16.57 },
  { id: '2910', name: '幼儿园午睡趴睡枕', brand: '品牌B', salesAmount: 15600, ratio: 7.82 },
  { id: '2911', name: '轻奢挂钩粘胶强力', brand: '品牌C', salesAmount: 24200, ratio: 12.15 },
  { id: '2912', name: '防水双肩背包', brand: '品牌D', salesAmount: 12800, ratio: 6.42 },
  { id: '2913', name: '智能手环运动手表', brand: '品牌E', salesAmount: 9800, ratio: 4.91 },
  { id: '2914', name: '无线蓝牙耳机', brand: '品牌F', salesAmount: 8600, ratio: 4.31 },
  { id: '2915', name: '便携式充电宝', brand: '品牌G', salesAmount: 7200, ratio: 3.61 },
  { id: '2916', name: '迷你加湿器', brand: '品牌H', salesAmount: 6500, ratio: 3.26 },
  { id: '2917', name: '家用投影仪', brand: '品牌I', salesAmount: 5800, ratio: 2.91 },
  { id: '2918', name: '电动牙刷', brand: '品牌J', salesAmount: 5200, ratio: 2.61 },
  { id: '2919', name: '空气炸锅', brand: '品牌K', salesAmount: 4800, ratio: 2.41 },
  { id: '2920', name: '多功能料理锅', brand: '品牌L', salesAmount: 4200, ratio: 2.11 },
  { id: '2921', name: '智能音箱', brand: '品牌M', salesAmount: 3800, ratio: 1.91 },
  { id: '2922', name: '扫地机器人', brand: '品牌N', salesAmount: 3400, ratio: 1.71 },
  { id: '2923', name: '榨汁机便携式', brand: '品牌O', salesAmount: 3100, ratio: 1.56 }
]

// SPU分布热力矩阵数据
export const spuDistributionData = {
  xAxis: { name: '成交金额', min: 0, max: 33000 },
  yAxis: { name: '出单达人数', min: 0, max: 196 },
  data: [
    { x: 15000, y: 120, name: '示例SPU商品', linkCount: 5 },
    { x: 8000, y: 85, name: '幼儿园午睡趴睡枕', linkCount: 3 },
    { x: 24000, y: 196, name: '轻奢挂钩粘胶强力', linkCount: 8 },
    { x: 12000, y: 95, name: '防水双肩背包', linkCount: 4 },
    { x: 9500, y: 78, name: '智能手环运动手表', linkCount: 3 }
  ]
}

// 出单SPU表格数据
export const spuTableData = {
  list: [
    { spuId: '2909', spuName: '示例SPU商品2909', salesAmount: 33000, settlementAmount: 6071.14, refundAmount: 5282.93, creatorCount: 196 },
    { spuId: '2910', spuName: '幼儿园午睡趴睡枕', salesAmount: 15600, settlementAmount: 3491.99, refundAmount: 2444.97, creatorCount: 85 },
    { spuId: '2911', spuName: '轻奢挂钩粘胶强力', salesAmount: 24200, settlementAmount: 5420.00, refundAmount: 4100.00, creatorCount: 142 },
    { spuId: '2912', spuName: '防水双肩背包', salesAmount: 12800, settlementAmount: 2890.00, refundAmount: 2100.00, creatorCount: 92 },
    { spuId: '2913', spuName: '智能手环运动手表', salesAmount: 9800, settlementAmount: 2156.00, refundAmount: 1680.00, creatorCount: 65 },
    { spuId: '2914', spuName: '无线蓝牙耳机', salesAmount: 8600, settlementAmount: 1892.00, refundAmount: 1450.00, creatorCount: 58 },
    { spuId: '2915', spuName: '便携式充电宝', salesAmount: 7200, settlementAmount: 1584.00, refundAmount: 1200.00, creatorCount: 48 },
    { spuId: '2916', spuName: '迷你加湿器', salesAmount: 6500, settlementAmount: 1430.00, refundAmount: 1080.00, creatorCount: 42 },
    { spuId: '2917', spuName: '家用投影仪', salesAmount: 5800, settlementAmount: 1276.00, refundAmount: 960.00, creatorCount: 38 },
    { spuId: '2918', spuName: '电动牙刷', salesAmount: 5200, settlementAmount: 1144.00, refundAmount: 860.00, creatorCount: 35 },
    { spuId: '2919', spuName: '空气炸锅', salesAmount: 4800, settlementAmount: 1056.00, refundAmount: 790.00, creatorCount: 32 },
    { spuId: '2920', spuName: '多功能料理锅', salesAmount: 4200, settlementAmount: 924.00, refundAmount: 690.00, creatorCount: 28 },
    { spuId: '2921', spuName: '智能音箱', salesAmount: 3800, settlementAmount: 836.00, refundAmount: 620.00, creatorCount: 25 },
    { spuId: '2922', spuName: '扫地机器人', salesAmount: 3400, settlementAmount: 748.00, refundAmount: 550.00, creatorCount: 22 },
    { spuId: '2923', spuName: '榨汁机便携式', salesAmount: 3100, settlementAmount: 682.00, refundAmount: 500.00, creatorCount: 20 }
  ],
  total: 74,
  pageSize: 10,
  currentPage: 1
}

// 环形图数据
export const ringChartData = {
  legend: ['示例店铺18', '懒猫馋馋官方旗舰店'],
  seriesData: [
    { value: 104, name: '示例店铺18' },
    { value: 78, name: '懒猫馋馋官方旗舰店' }
  ]
}

// 折线趋势图数据
export const lineTrendData = {
  xAxis: ['04/01', '04/05', '04/10', '04/15', '04/20', '04/25', '04/29'],
  series: [
    { name: '示例店铺18', data: [120, 132, 101, 134, 90, 230, 210] },
    { name: '懒猫馋馋官方旗舰店', data: [220, 182, 191, 234, 290, 330, 310] }
  ]
}
```

- [ ] **Step 2: 提交**

```bash
git add dohozz-saas/src/mock/productShopAnalysis.js
git add dohozz-saas/src/views/components/ProductShop/
git commit -m "feat(ProductShopAnalysis): init mock data and component directory"
```

---

## Task 2: 主页面骨架 ProductShopAnalysis.vue

**Files:**
- Create: `dohozz-saas/src/views/ProductShopAnalysis.vue`

- [ ] **Step 1: 创建主页面骨架**

```vue
<template>
  <div class="product-shop-analysis-page">
    <!-- 顶部功能按钮 -->
    <div class="top-actions">
      <el-button type="warning" size="small" @click="handleTutorial">
        一分钟看懂指挥中台
      </el-button>
      <el-button size="small" @click="handleExportImage">
        导出页面为图片
      </el-button>
    </div>

    <!-- 平台切换栏 -->
    <PlatformTabs v-model="activePlatform" :platforms="platforms" @change="handlePlatformChange" />

    <!-- 时间筛选栏 -->
    <TimeFilterBar
      v-model:dateRange="dateRange"
      v-model:activeQuickTime="activeQuickTime"
      @update:dateRange="handleDateRangeChange"
      @quick-time-change="handleQuickTimeChange"
    />

    <!-- 基础筛选栏 -->
    <FilterBar
      v-model:activeAttr="activeAttr"
      v-model:activeType="activeType"
      v-model:activeShop="activeShop"
      :attr-options="attrOptions"
      :type-options="typeOptions"
      :shop-options="shopOptions"
    />

    <!-- 核心指标卡片 -->
    <MetricsCards :data="metricsData" />

    <!-- 图表切换标签 -->
    <ChartTabs v-model="activeChartTab" @change="handleChartTabChange" />

    <!-- 环形图 + 折线趋势图 -->
    <div class="charts-section">
      <RingChart :data="ringChartData" />
      <LineTrendChart :data="lineTrendData" />
    </div>

    <!-- 商品占比图 -->
    <ProductShareCards :data="productShareList" />

    <!-- SPU分布 -->
    <SpuDistribution :data="spuDistributionData" />

    <!-- 出单SPU表格 -->
    <SpuTable :data="spuTableData" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PlatformTabs from './components/ProductShop/PlatformTabs.vue'
import TimeFilterBar from './components/ProductShop/TimeFilterBar.vue'
import FilterBar from './components/ProductShop/FilterBar.vue'
import MetricsCards from './components/ProductShop/MetricsCards.vue'
import ChartTabs from './components/ProductShop/ChartTabs.vue'
import RingChart from './components/ProductShop/RingChart.vue'
import LineTrendChart from './components/ProductShop/LineTrendChart.vue'
import ProductShareCards from './components/ProductShop/ProductShareCards.vue'
import SpuDistribution from './components/ProductShop/SpuDistribution.vue'
import SpuTable from './components/ProductShop/SpuTable.vue'

import {
  platforms,
  quickTimeOptions,
  attrOptions,
  typeOptions,
  shopOptions,
  metricsData,
  productShareList,
  spuDistributionData,
  spuTableData,
  ringChartData,
  lineTrendData
} from '@/mock/productShopAnalysis'

// 状态
const activePlatform = ref('全部')
const dateRange = ref(['2026-04-01', '2026-04-29'])
const activeQuickTime = ref('month')
const activeAttr = ref('全部出单达人')
const activeType = ref('全部')
const activeShop = ref('all')
const activeChartTab = ref('shop')

// 方法
function handlePlatformChange(platform) {
  activePlatform.value = platform
}

function handleDateRangeChange(val) {
  dateRange.value = val
}

function handleQuickTimeChange(val) {
  activeQuickTime.value = val
}

function handleChartTabChange(val) {
  activeChartTab.value = val
}

function handleTutorial() {
  // TODO: 弹窗教程
}

function handleExportImage() {
  // TODO: 导出图片
}
</script>

<style scoped>
.product-shop-analysis-page {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
  margin: 16px 0;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add dohozz-saas/src/views/ProductShopAnalysis.vue
git commit -m "feat(ProductShopAnalysis): create main page skeleton"
```

---

## Task 3: PlatformTabs 和 TimeFilterBar 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ProductShop/PlatformTabs.vue`
- Create: `dohozz-saas/src/views/components/ProductShop/TimeFilterBar.vue`

- [ ] **Step 1: PlatformTabs.vue**

```vue
<template>
  <div class="platform-tabs">
    <span
      v-for="p in platforms"
      :key="p"
      class="platform-tab"
      :class="{ active: modelValue === p }"
      @click="handleClick(p)"
    >
      {{ p }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '全部' },
  platforms: { type: Array, default: () => ['全部', '抖音', '快手', '视频号', '小红书'] }
})

const emit = defineEmits(['update:modelValue', 'change'])

function handleClick(platform) {
  emit('update:modelValue', platform)
  emit('change', platform)
}
</script>

<style scoped>
.platform-tabs {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.platform-tab {
  cursor: pointer;
  padding: 4px 8px;
  color: #666;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.platform-tab:hover {
  color: #333;
}

.platform-tab.active {
  color: #333;
  font-weight: 600;
  border-bottom-color: #333;
}
</style>
```

- [ ] **Step 2: TimeFilterBar.vue**

```vue
<template>
  <div class="time-filter-bar">
    <el-date-picker
      :model-value="dateRange"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="YYYY-MM-DD"
      size="small"
      style="width: 240px;"
      @update:model-value="handleDateChange"
    />
    <div class="quick-time-btns">
      <span
        v-for="opt in quickTimeOptions"
        :key="opt.value"
        class="quick-btn"
        :class="{ active: activeQuickTime === opt.value }"
        @click="handleQuickTime(opt.value)"
      >
        {{ opt.label }}
      </span>
    </div>
    <el-button size="small" @click="handleTutorial">教程</el-button>
  </div>
</template>

<script setup>
import { quickTimeOptions } from '@/mock/productShopAnalysis'

const props = defineProps({
  dateRange: { type: Array, default: () => [] },
  activeQuickTime: { type: String, default: 'month' }
})

const emit = defineEmits(['update:dateRange', 'update:activeQuickTime', 'date-range-change', 'quick-time-change'])

function handleDateChange(val) {
  emit('update:dateRange', val)
  emit('date-range-change', val)
}

function handleQuickTime(val) {
  emit('update:activeQuickTime', val)
  emit('quick-time-change', val)
}

function handleTutorial() {
  // TODO
}
</script>

<style scoped>
.time-filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.quick-time-btns {
  display: flex;
  gap: 8px;
}

.quick-btn {
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #e8e8e8;
}

.quick-btn.active {
  background: #ff7c3f;
  color: #fff;
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add dohozz-saas/src/views/components/ProductShop/PlatformTabs.vue
git add dohozz-saas/src/views/components/ProductShop/TimeFilterBar.vue
git commit -m "feat(ProductShopAnalysis): add PlatformTabs and TimeFilterBar components"
```

---

## Task 4: FilterBar 和 MetricsCards 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ProductShop/FilterBar.vue`
- Create: `dohozz-saas/src/views/components/ProductShop/MetricsCards.vue`

- [ ] **Step 1: FilterBar.vue**

```vue
<template>
  <div class="filter-bar">
    <!-- 归属筛选 -->
    <div class="filter-item">
      <span class="filter-label">归属:</span>
      <div class="attr-tabs">
        <span
          v-for="a in attrOptions"
          :key="a"
          class="attr-tab"
          :class="{ active: activeAttr === a }"
          @click="handleAttrChange(a)"
        >
          {{ a }}
        </span>
      </div>
      <el-tooltip content="归属筛选说明" placement="top">
        <span class="help-icon">?</span>
      </el-tooltip>
    </div>

    <!-- 类型筛选 -->
    <div class="filter-item">
      <span class="filter-label">类型:</span>
      <div class="attr-tabs">
        <span
          v-for="t in typeOptions"
          :key="t"
          class="attr-tab"
          :class="{ active: activeType === t }"
          @click="handleTypeChange(t)"
        >
          {{ t }}
        </span>
      </div>
      <el-tooltip content="类型筛选说明" placement="top">
        <span class="help-icon">?</span>
      </el-tooltip>
    </div>

    <!-- 店铺筛选 -->
    <div class="filter-item">
      <span class="filter-label">店铺:</span>
      <el-select
        :model-value="activeShop"
        size="small"
        style="width: 140px;"
        @update:model-value="handleShopChange"
      >
        <el-option
          v-for="shop in shopOptions"
          :key="shop.value"
          :label="shop.label"
          :value="shop.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activeAttr: { type: String, default: '全部出单达人' },
  activeType: { type: String, default: '全部' },
  activeShop: { type: String, default: 'all' },
  attrOptions: { type: Array, default: () => [] },
  typeOptions: { type: Array, default: () => [] },
  shopOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:activeAttr', 'update:activeType', 'update:activeShop', 'attr-change', 'type-change', 'shop-change'])

function handleAttrChange(val) {
  emit('update:activeAttr', val)
  emit('attr-change', val)
}

function handleTypeChange(val) {
  emit('update:activeType', val)
  emit('type-change', val)
}

function handleShopChange(val) {
  emit('update:activeShop', val)
  emit('shop-change', val)
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  color: #666;
  font-size: 13px;
}

.attr-tabs {
  display: flex;
  gap: 4px;
}

.attr-tab {
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
}

.attr-tab:hover {
  background: #f5f5f5;
}

.attr-tab.active {
  background: #1677ff;
  color: #fff;
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #d9d9d9;
  color: #fff;
  font-size: 11px;
  cursor: pointer;
}
</style>
```

- [ ] **Step 2: MetricsCards.vue**

```vue
<template>
  <div class="metrics-cards">
    <!-- 成交金额卡片 - 淡粉底色 -->
    <div class="metric-card card-pink">
      <div class="card-header">
        <span class="card-title">成交金额</span>
        <el-tooltip content="成交金额说明" placement="top">
          <span class="help-icon">?</span>
        </el-tooltip>
      </div>
      <div class="card-value">¥{{ data.salesAmount.value }}{{ data.salesAmount.unit }}</div>
      <div class="card-secondary">订单数: {{ formatNumber(data.salesAmount.orderCount) }}</div>
      <div class="card-trend" :class="getTrendClass(data.salesAmount.mom)">
        <span class="trend-arrow">{{ getTrendArrow(data.salesAmount.mom) }}</span>
        环比 {{ data.salesAmount.mom }}%
      </div>
      <div class="card-trend" :class="getTrendClass(data.salesAmount.orderMom)">
        <span class="trend-arrow">{{ getTrendArrow(data.salesAmount.orderMom) }}</span>
        {{ data.salesAmount.orderMom }}%
      </div>
    </div>

    <!-- 退款金额卡片 - 淡紫底色 -->
    <div class="metric-card card-purple">
      <div class="card-header">
        <span class="card-title">退款金额</span>
        <el-tooltip content="退款金额说明" placement="top">
          <span class="help-icon">?</span>
        </el-tooltip>
      </div>
      <div class="card-value">¥{{ data.refundAmount.value }}{{ data.refundAmount.unit }}</div>
      <div class="card-secondary">退款订单数: {{ formatNumber(data.refundAmount.orderCount) }}</div>
      <div class="card-trend" :class="getTrendClass(data.refundAmount.mom)">
        <span class="trend-arrow">{{ getTrendArrow(data.refundAmount.mom) }}</span>
        环比 {{ data.refundAmount.mom }}%
      </div>
      <div class="card-trend" :class="getTrendClass(data.refundAmount.orderMom)">
        <span class="trend-arrow">{{ getTrendArrow(data.refundAmount.orderMom) }}</span>
        {{ data.refundAmount.orderMom }}%
      </div>
    </div>

    <!-- 出单商品数卡片 - 淡蓝底色 -->
    <div class="metric-card card-blue">
      <div class="card-header">
        <span class="card-title">出单商品数</span>
        <el-tooltip content="出单商品数说明" placement="top">
          <span class="help-icon">?</span>
        </el-tooltip>
      </div>
      <div class="card-value">{{ data.productCount.value }}</div>
      <div class="card-secondary">出单链接数: {{ data.productCount.linkCount }}</div>
      <div class="card-trend" :class="getTrendClass(data.productCount.mom)">
        <span class="trend-arrow">{{ getTrendArrow(data.productCount.mom) }}</span>
        环比 {{ data.productCount.mom }}%
      </div>
      <div class="card-trend" :class="getTrendClass(data.productCount.linkMom)">
        <span class="trend-arrow">{{ getTrendArrow(data.productCount.linkMom) }}</span>
        {{ data.productCount.linkMom }}%
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true }
})

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

function getTrendClass(value) {
  return value >= 0 ? 'trend-up' : 'trend-down'
}

function getTrendArrow(value) {
  return value >= 0 ? '↑' : '↓'
}
</script>

<style scoped>
.metrics-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.metric-card {
  padding: 16px;
  border-radius: 8px;
  background: #fff;
}

.card-pink { background: #FFF1F0; }
.card-purple { background: #F9F0FF; }
.card-blue { background: #E6F4FF; }

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  color: #666;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.card-secondary {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.card-trend {
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-right: 12px;
}

.trend-up {
  color: #ff4d4f;
}

.trend-down {
  color: #52c41a;
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #d9d9d9;
  color: #fff;
  font-size: 11px;
  cursor: pointer;
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add dohozz-saas/src/views/components/ProductShop/FilterBar.vue
git add dohozz-saas/src/views/components/ProductShop/MetricsCards.vue
git commit -m "feat(ProductShopAnalysis): add FilterBar and MetricsCards components"
```

---

## Task 5: ChartTabs, RingChart, LineTrendChart 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ProductShop/ChartTabs.vue`
- Create: `dohozz-saas/src/views/components/ProductShop/RingChart.vue`
- Create: `dohozz-saas/src/views/components/ProductShop/LineTrendChart.vue`

- [ ] **Step 1: ChartTabs.vue**

```vue
<template>
  <div class="chart-tabs">
    <span
      v-for="tab in tabs"
      :key="tab.value"
      class="chart-tab"
      :class="{ active: modelValue === tab.value }"
      @click="handleClick(tab.value)"
    >
      {{ tab.label }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'shop' },
  tabs: { type: Array, default: () => [{ label: '店铺指标分析', value: 'shop' }, { label: '商品指标分析', value: 'product' }] }
})

const emit = defineEmits(['update:modelValue', 'change'])

function handleClick(val) {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style scoped>
.chart-tabs {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.chart-tab {
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.2s;
}

.chart-tab:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.chart-tab.active {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}
</style>
```

- [ ] **Step 2: RingChart.vue (ECharts 半圆环形图)**

```vue
<template>
  <div class="ring-chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      legend: ['示例店铺18', '懒猫馋馋官方旗舰店'],
      seriesData: [
        { value: 104, name: '示例店铺18' },
        { value: 78, name: '懒猫馋馋官方旗舰店' }
      ]
    })
  }
})

const chartRef = ref(null)
let chartInstance = null

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: props.data.legend
    },
    series: [
      {
        name: '店铺成交',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['35%', '50%'],
        startAngle: 180,
        endAngle: 0,
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        data: props.data.seriesData,
        itemStyle: {
          color: (params) => {
            const colors = ['#52c41a', '#ff4d4f']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
})

watch(() => props.data, () => {
  initChart()
}, { deep: true })
</script>

<style scoped>
.ring-chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.chart {
  width: 100%;
  height: 280px;
}
</style>
```

- [ ] **Step 3: LineTrendChart.vue (ECharts 折线图)**

```vue
<template>
  <div class="line-trend-chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      xAxis: ['04/01', '04/05', '04/10', '04/15', '04/20', '04/25', '04/29'],
      series: [
        { name: '示例店铺18', data: [120, 132, 101, 134, 90, 230, 210] },
        { name: '懒猫馋馋官方旗舰店', data: [220, 182, 191, 234, 290, 330, 310] }
      ]
    })
  }
})

const chartRef = ref(null)
let chartInstance = null

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: props.data.series.map(s => s.name),
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.xAxis
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: props.data.series.map((s, index) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: true,
      itemStyle: {
        color: index === 0 ? '#1677ff' : '#ff7c3f'
      }
    }))
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
})

watch(() => props.data, () => {
  initChart()
}, { deep: true })
</script>

<style scoped>
.line-trend-chart-container {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.chart {
  width: 100%;
  height: 280px;
}
</style>
```

- [ ] **Step 4: 提交**

```bash
git add dohozz-saas/src/views/components/ProductShop/ChartTabs.vue
git add dohozz-saas/src/views/components/ProductShop/RingChart.vue
git add dohozz-saas/src/views/components/ProductShop/LineTrendChart.vue
git commit -m "feat(ProductShopAnalysis): add ChartTabs, RingChart, LineTrendChart components"
```

---

## Task 6: ProductShareCards 商品占比TOP15组件

**Files:**
- Create: `dohozz-saas/src/views/components/ProductShop/ProductShareCards.vue`

- [ ] **Step 1: ProductShareCards.vue**

```vue
<template>
  <div class="product-share-cards">
    <div class="section-header">
      <span class="section-title">商品占比图</span>
      <span class="section-tag">商品成交金额TOP15</span>
    </div>
    <div class="cards-wrapper">
      <div class="cards-scroll">
        <div
          v-for="(item, index) in data"
          :key="item.id"
          class="product-card"
          @click="handleCardClick(item)"
        >
          <div class="card-rank">{{ index + 1 }}</div>
          <div class="card-name">{{ item.name }}</div>
          <div class="card-brand">{{ item.brand }}</div>
          <div class="card-amount">¥{{ formatAmount(item.salesAmount) }}</div>
          <div class="card-ratio">占比 {{ item.ratio }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] }
})

const emit = defineEmits(['card-click'])

function formatAmount(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + 'w'
  }
  return value.toLocaleString()
}

function handleCardClick(item) {
  emit('card-click', item)
}
</script>

<style scoped>
.product-share-cards {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-tag {
  padding: 2px 8px;
  background: #fff1f0;
  color: #ff4d4f;
  font-size: 12px;
  border-radius: 4px;
}

.cards-wrapper {
  overflow-x: auto;
}

.cards-scroll {
  display: flex;
  gap: 12px;
  padding-bottom: 8px;
}

.product-card {
  flex-shrink: 0;
  width: 160px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
}

.card-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-brand {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.card-amount {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-ratio {
  font-size: 12px;
  opacity: 0.9;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add dohozz-saas/src/views/components/ProductShop/ProductShareCards.vue
git commit -m "feat(ProductShopAnalysis): add ProductShareCards component"
```

---

## Task 7: SpuDistribution SPU分布热力矩阵组件

**Files:**
- Create: `dohozz-saas/src/views/components/ProductShop/SpuDistribution.vue`

- [ ] **Step 1: SpuDistribution.vue**

```vue
<template>
  <div class="spu-distribution">
    <div class="section-header">
      <span class="section-title">SPU分布</span>
      <span class="data-range">数据范围: 2026/04/01-2026/04/29</span>
      <span class="update-time">数据更新时间: 2026-04-29 09:30</span>

      <div class="tab-btns">
        <span
          class="tab-btn"
          :class="{ active: activeTab === 'spu' }"
          @click="activeTab = 'spu'"
        >
          SPU
        </span>
        <span
          class="tab-btn"
          :class="{ active: activeTab === 'link' }"
          @click="activeTab = 'link'"
        >
          商品链接
        </span>
      </div>

      <el-select v-model="yAxisDimension" size="small" style="width: 120px;">
        <el-option label="出单达人数" value="creator" />
        <el-option label="成交金额" value="sales" />
        <el-option label="退款金额" value="refund" />
      </el-select>
    </div>

    <div ref="chartRef" class="heatmap-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      xAxis: { name: '成交金额', min: 0, max: 33000 },
      yAxis: { name: '出单达人数', min: 0, max: 196 },
      data: []
    })
  }
})

const activeTab = ref('spu')
const yAxisDimension = ref('creator')
const chartRef = ref(null)
let chartInstance = null

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  // 将数据转换为热力矩阵格式
  const heatmapData = props.data.data.map(item => [item.x, item.y, item.linkCount || 1])

  const option = {
    tooltip: {
      position: 'top',
      formatter: (params) => {
        const item = props.data.data[params.dataIndex]
        return `${item.name}<br/>成交金额: ¥${item.x}<br/>出单达人数: ${item.y}<br/>链接数: ${item.linkCount}`
      }
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: props.data.xAxis.name,
      min: props.data.xAxis.min,
      max: props.data.xAxis.max,
      splitLine: { show: true }
    },
    yAxis: {
      type: 'value',
      name: props.data.yAxis.name,
      min: props.data.yAxis.min,
      max: props.data.yAxis.max,
      splitLine: { show: true }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'vertical',
      right: 10,
      top: 'center',
      inRange: {
        color: ['#50a3ba', '#eac736', '#d94e5d']
      }
    },
    series: [{
      type: 'heatmap',
      data: heatmapData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
})

watch(() => props.data, () => {
  initChart()
}, { deep: true })
</script>

<style scoped>
.spu-distribution {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.data-range,
.update-time {
  font-size: 13px;
  color: #999;
}

.tab-btns {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.tab-btn {
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.2s;
}

.tab-btn.active {
  border-color: #1677ff;
  color: #1677ff;
}

.heatmap-chart {
  width: 100%;
  height: 300px;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add dohozz-saas/src/views/components/ProductShop/SpuDistribution.vue
git commit -m "feat(ProductShopAnalysis): add SpuDistribution heatmap component"
```

---

## Task 8: SpuTable 出单SPU表格组件

**Files:**
- Create: `dohozz-saas/src/views/components/ProductShop/SpuTable.vue`

- [ ] **Step 1: SpuTable.vue**

```vue
<template>
  <div class="spu-table">
    <div class="section-header">
      <div class="header-left">
        <span class="section-title">出单SPU</span>
        <span class="data-range">数据范围: 2026/04/01-2026/04/29</span>
        <span class="update-time">数据更新时间: 2026-04-29 09:30</span>
      </div>

      <div class="header-actions">
        <el-button size="small" @click="handleExport">
          <span>导出</span>
        </el-button>

        <div class="tab-btns">
          <span
            class="tab-btn"
            :class="{ active: activeTab === 'spu' }"
            @click="activeTab = 'spu'"
          >
            SPU
          </span>
          <span
            class="tab-btn"
            :class="{ active: activeTab === 'link' }"
            @click="activeTab = 'link'"
          >
            商品链接
          </span>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入商品ID搜索"
        size="small"
        style="width: 240px;"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button icon="Search" @click="handleSearch" />
        </template>
      </el-input>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :default-sort="{ prop: 'salesAmount', order: 'descending' }"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="spuName" label="商品" min-width="180">
        <template #default="{ row }">
          <span class="product-name">{{ row.spuName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salesAmount" label="成交金额" sortable min-width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.salesAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="settlementAmount" label="结算金额" sortable min-width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.settlementAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="refundAmount" label="退款金额" sortable min-width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.refundAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="creatorCount" label="出单达人数" sortable min-width="100">
        <template #default="{ row }">
          {{ row.creatorCount }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <span class="action-link" @click="handleViewDetail(row)">查看详情</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <span class="total-count">共 {{ total }} 条</span>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
      <el-select v-model="pageSize" size="small" style="width: 100px;" @change="handlePageSizeChange">
        <el-option label="10条/页" :value="10" />
        <el-option label="20条/页" :value="20" />
        <el-option label="50条/页" :value="50" />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      list: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    })
  }
})

const activeTab = ref('spu')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const sortProp = ref('salesAmount')
const sortOrder = ref('descending')

const total = computed(() => props.data.total)

const tableData = computed(() => {
  let list = [...props.data.list]

  // 搜索过滤
  if (searchKeyword.value) {
    list = list.filter(item =>
      item.spuId.includes(searchKeyword.value) ||
      item.spuName.includes(searchKeyword.value)
    )
  }

  // 排序
  list.sort((a, b) => {
    const aVal = a[sortProp.value]
    const bVal = b[sortProp.value]
    const order = sortOrder.value === 'ascending' ? 1 : -1
    return (aVal - bVal) * order
  })

  return list
})

function formatAmount(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(2) + 'w'
  }
  return value.toLocaleString()
}

function handleSearch() {
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

function handleSortChange({ prop, order }) {
  sortProp.value = prop
  sortOrder.value = order
}

function handlePageChange(page) {
  currentPage.value = page
}

function handlePageSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
}

function handleExport() {
  ElMessage.success('导出成功')
}

function handleViewDetail(row) {
  // TODO: 跳转到SPU详情页
  console.log('查看详情', row)
}
</script>

<style scoped>
.spu-table {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.data-range,
.update-time {
  font-size: 13px;
  color: #999;
}

.tab-btns {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.2s;
}

.tab-btn.active {
  border-color: #1677ff;
  color: #1677ff;
}

.search-bar {
  margin-bottom: 16px;
}

.product-name {
  color: #1677ff;
  cursor: pointer;
}

.product-name:hover {
  text-decoration: underline;
}

.action-link {
  color: #ff4d4f;
  cursor: pointer;
}

.action-link:hover {
  text-decoration: underline;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.total-count {
  font-size: 13px;
  color: #666;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add dohozz-saas/src/views/components/ProductShop/SpuTable.vue
git commit -m "feat(ProductShopAnalysis): add SpuTable component with pagination"
```

---

## Task 9: 路由配置

**Files:**
- Modify: `dohozz-saas/src/router/index.js`

- [ ] **Step 1: 添加路由**

在 router/index.js 中找到 `/command-center` 路由位置，在其后添加子路由：

```javascript
{
  path: '/command-center/product-shop-analysis',
  name: 'ProductShopAnalysis',
  component: () => import('@/views/ProductShopAnalysis.vue'),
  meta: {
    requiresAuth: true,
    title: '商品&店铺指标分析 - DOHOZZ'
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add dohozz-saas/src/router/index.js
git commit -m "feat(ProductShopAnalysis): add route configuration"
```

---

## Task 10: 整体样式调优和交互联调

**Files:**
- Modify: `dohozz-saas/src/views/ProductShopAnalysis.vue`

- [ ] **Step 1: 检查并完善主页面**

确保所有组件正确引入和连接

- [ ] **Step 2: 运行项目验证**

```bash
cd dohozz-saas && npm run dev
```

访问 `/command-center/product-shop-analysis` 验证页面

- [ ] **Step 3: 提交**

```bash
git add dohozz-saas/src/views/ProductShopAnalysis.vue
git commit -m "feat(ProductShopAnalysis): integrate all components and fix styles"
```

---

## 自检清单

- [ ] 主页面骨架正确引入所有子组件
- [ ] Mock 数据结构完整
- [ ] 平台切换正常切换数据
- [ ] 时间筛选正常工作
- [ ] 核心指标卡片颜色和布局正确
- [ ] ECharts 图表正确渲染
- [ ] 商品占比 TOP15 卡片横向滚动
- [ ] SPU 分布热力矩阵正确显示
- [ ] 表格排序、分页、搜索功能正常
- [ ] 路由正确配置
- [ ] 页面无报错

---

**Plan complete.** 10 tasks covering file creation, component development, routing, and integration.

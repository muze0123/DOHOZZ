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

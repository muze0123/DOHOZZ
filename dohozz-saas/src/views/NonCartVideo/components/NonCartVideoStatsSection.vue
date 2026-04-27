<template>
  <div class="non-cart-video-stats-section">
    <!-- 数据元信息 -->
    <div class="update-info">
      <span>数据更新时间：{{ updateTime }}</span>
      <span class="separator">|</span>
      <span>数据范围：{{ dataRange }}</span>
    </div>

    <!-- 指标块 -->
    <div class="stats-blocks">
      <div
        class="stats-block"
        :class="{ active: activeMetric === 'all' }"
        @click="handleMetricChange('all')"
      >
        <div class="block-label">全部视频</div>
        <div class="block-value">{{ metricsData.allVideoCount }}</div>
        <el-tooltip content="公司员工累计添加的非挂车视频数" placement="top">
          <el-icon class="question-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div
        class="stats-block"
        :class="{ active: activeMetric === 'new' }"
        @click="handleMetricChange('new')"
      >
        <div class="block-label">新发布视频</div>
        <div class="block-value">{{ metricsData.newVideoCount }}</div>
        <el-tooltip content="视频发布时间在统计时间段内的视频数" placement="top">
          <el-icon class="question-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </div>

    <!-- 汇总子指标（仅全部视频时显示） -->
    <div v-if="activeMetric === 'all'" class="sub-metrics">
      <div class="sub-metric">
        <span class="sub-label">视频播放量</span>
        <span class="sub-value">{{ metricsData.totalPlays.toLocaleString() }}</span>
      </div>
      <div class="sub-metric">
        <span class="sub-label">视频点赞数</span>
        <span class="sub-value">{{ metricsData.totalLikes.toLocaleString() }}</span>
      </div>
      <div class="sub-metric">
        <span class="sub-label">视频评论数</span>
        <span class="sub-value">{{ metricsData.totalComments.toLocaleString() }}</span>
      </div>
      <div class="sub-metric">
        <span class="sub-label">视频收藏数</span>
        <span class="sub-value">{{ metricsData.totalCollects.toLocaleString() }}</span>
      </div>
    </div>

    <!-- 折线趋势图 -->
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  activeMetric: {
    type: String,
    default: 'all'
  },
  activePlatform: {
    type: String,
    default: 'tiktok'
  },
  timeRange: {
    type: Array,
    default: () => []
  },
  metricsData: {
    type: Object,
    default: () => ({
      allVideoCount: 0,
      newVideoCount: 0,
      totalPlays: 0,
      totalLikes: 0,
      totalComments: 0,
      totalCollects: 0
    })
  },
  chartData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['metric-change'])

const updateTime = ref('2026-04-26 01:00')
const dataRange = ref('2026/04/20 - 2026/04/26')
const chartRef = ref(null)
let chartInstance = null

function handleMetricChange(metric) {
  emit('metric-change', metric)
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return
  const option = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['视频数', '视频播放量', '视频点赞数', '视频评论数', '视频收藏数']
    },
    xAxis: {
      type: 'category',
      data: ['4/20', '4/21', '4/22', '4/23', '4/24', '4/25', '4/26']
    },
    yAxis: [
      { type: 'value', name: '视频数', position: 'left' },
      { type: 'value', name: '互动量', position: 'right' }
    ],
    series: [
      { name: '视频数', type: 'bar', data: [12, 15, 18, 20, 22, 25, 28] },
      { name: '视频播放量', type: 'line', yAxisIndex: 1, data: [12000, 15000, 18000, 20000, 22000, 25000, 28000] },
      { name: '视频点赞数', type: 'line', yAxisIndex: 1, data: [1200, 1500, 1800, 2000, 2200, 2500, 2800] },
      { name: '视频评论数', type: 'line', yAxisIndex: 1, data: [120, 150, 180, 200, 220, 250, 280] },
      { name: '视频收藏数', type: 'line', yAxisIndex: 1, data: [600, 750, 900, 1000, 1100, 1250, 1400] }
    ]
  }
  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
})

watch(() => props.chartData, () => {
  updateChart()
}, { deep: true })
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.non-cart-video-stats-section {
  background: #fff;
  margin-bottom: 0;
}

.update-info {
  padding: 12px 20px;
  font-size: 12px;
  color: #999;
  background: #fafafa;
  display: flex;
  gap: 8px;

  .separator {
    color: #d9d9d9;
  }
}

.stats-blocks {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
}

.stats-block {
  flex: 1;
  padding: 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;

  &.active {
    border-color: #1677ff;
    background: #e6f4ff;
  }

  &:hover:not(.active) {
    background: #f5f5f5;
  }

  .block-label {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .block-value {
    font-size: 24px;
    font-weight: 600;
    color: #1677ff;
  }

  .question-icon {
    color: #999;
    cursor: pointer;
  }
}

.sub-metrics {
  display: flex;
  gap: 24px;
  padding: 0 20px 16px;
}

.sub-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .sub-label {
    font-size: 12px;
    color: #999;
  }

  .sub-value {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

.chart-container {
  height: 280px;
  padding: 0 20px 20px;
}
</style>

<template>
  <div class="trend-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  metricType: {
    type: String,
    default: 'new'
  }
})

const chartRef = ref(null)
let chartInstance = null

// Dynamic legend based on metricType
const legendConfig = {
  new: ['视频数量', '新发布成交金额'],
  selling: ['视频数量', '动销成交金额'],
  delivery: ['视频数量', '投放成交金额']
}

// Get series config based on metricType
function getSeriesConfig(metricType) {
  const baseConfig = [
    {
      name: '视频数量',
      type: 'bar',
      yAxisIndex: 0,
      barMaxWidth: 40,
      itemStyle: { color: '#3370ff', opacity: 0.9 },
      emphasis: { itemStyle: { opacity: 1 } }
    }
  ]

  const lineConfig = {
    new: { name: '新发布成交金额', color: '#ff9f43' },
    selling: { name: '动销成交金额', color: '#2ed573' },
    delivery: { name: '投放成交金额', color: '#ff6b6b' }
  }

  const line = lineConfig[metricType] || lineConfig.new

  baseConfig.push({
    name: line.name,
    type: 'line',
    yAxisIndex: 1,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { color: line.color, width: 2 },
    itemStyle: { color: line.color },
    emphasis: { scale: 1.3 }
  })

  return baseConfig
}

// Calculate max value for axis scaling
function calcMax(values, fallback) {
  if (!values || values.length === 0) return fallback
  const max = Math.max(...values)
  return max === 0 ? fallback : Math.ceil(max * 1.2)
}

// Format tooltip
function formatTooltip(params) {
  if (!params || params.length === 0) return ''
  const date = params[0].axisValue
  let html = `<div style="font-size: 12px; padding: 4px 0;">
    <div style="font-weight: 600; margin-bottom: 8px; color: #333;">${date}</div>`

  params.forEach(p => {
    const marker = `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${p.color}; margin-right: 6px;"></span>`
    if (p.seriesType === 'bar') {
      html += `<div style="margin-bottom: 4px;">${marker}${p.seriesName}：<strong>${p.value}</strong> 个</div>`
    } else {
      html += `<div style="margin-bottom: 4px;">${marker}${p.seriesName}：<strong>¥${Number(p.value).toLocaleString()}</strong></div>`
    }
  })

  html += '</div>'
  return html
}

// Init chart
function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// Update chart options
function updateChart() {
  if (!chartInstance) return

  const dates = props.data.map(d => d.date)
  const videoCounts = props.data.map(d => d.videoCount)
  const amounts = props.data.map(d => d.amount)

  const option = {
    grid: {
      left: 60,
      right: 60,
      top: 40,
      bottom: 40
    },
    legend: {
      data: legendConfig[props.metricType] || legendConfig.new,
      top: 0,
      right: 20,
      itemWidth: 14,
      itemHeight: 10,
      textStyle: { fontSize: 12, color: '#666' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: formatTooltip,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: '#333' }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#999', fontSize: 11 },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '视频数量',
        nameTextStyle: { fontSize: 12, color: '#666', padding: [0, 40, 0, 0] },
        axisLine: { show: false },
        axisLabel: { color: '#999', fontSize: 11 },
        splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
        min: 0,
        max: (v) => calcMax([...videoCounts], 100)
      },
      {
        type: 'value',
        name: '成交金额',
        nameTextStyle: { fontSize: 12, color: '#666', padding: [0, 0, 0, 40] },
        axisLine: { show: false },
        axisLabel: {
          color: '#999',
          fontSize: 11,
          formatter: (v) => v >= 10000 ? (v / 10000).toFixed(0) + 'w' : v
        },
        splitLine: { show: false },
        min: 0,
        max: (v) => calcMax([...amounts], 10000)
      }
    ],
    series: getSeriesConfig(props.metricType).map(s => ({
      ...s,
      data: s.name === '视频数量' ? videoCounts : amounts
    }))
  }

  chartInstance.setOption(option, true)
}

// Resize handler
function handleResize() {
  chartInstance?.resize()
}

// Lifecycle
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

// Watch for prop changes
watch(() => [props.data, props.metricType], () => {
  updateChart()
}, { deep: true })
</script>

<style scoped>
.trend-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
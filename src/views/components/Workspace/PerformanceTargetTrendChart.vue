<template>
  <div class="performance-trend-chart">
    <div class="chart-header">
      <div class="header-item">
        <span class="header-label">成交金额目标</span>
        <span class="header-value">30w</span>
      </div>
      <div class="header-item">
        <span class="header-label">完成率</span>
        <span class="header-value highlight">75%</span>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

// 模拟数据 - 每日目标值和实际值
const chartData = {
  dates: ['5/26', '5/27', '5/28', '5/29', '5/30', '5/31'],
  targetValues: [5, 10, 15, 20, 25, 30], // 目标值 w (绿色)
  actualValues: [1, 3.5, 6.75, 11, 19.5, 22.5] // 实际值 w (橙色)
}

// 初始化图表
function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表
function updateChart() {
  if (!chartInstance) return

  const option = {
    grid: {
      left: 50,
      right: 20,
      top: 20,
      bottom: 30
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: { color: '#e8e8e8', type: 'dashed' }
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: '#333', fontSize: 12 },
      formatter: function(params) {
        let html = `<div style="font-weight: 600; margin-bottom: 8px; color: #333;">${params[0].axisValue}</div>`
        params.forEach(p => {
          const marker = `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${p.color}; margin-right: 6px;"></span>`
          html += `<div style="margin-bottom: 4px;">${marker}${p.seriesName}：<strong>${p.value}w</strong></div>`
        })
        return html
      }
    },
    xAxis: {
      type: 'category',
      data: chartData.dates,
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: '#999', fontSize: 11 },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '成交金额(w)',
      nameTextStyle: { fontSize: 12, color: '#666', padding: [0, 0, 0, 0] },
      axisLine: { show: false },
      axisLabel: {
        color: '#999',
        fontSize: 11,
        formatter: '{value}w'
      },
      splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
      min: 0,
      max: 35
    },
    series: [
      {
        name: '目标值',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#2ed573', width: 2 },
        itemStyle: { color: '#2ed573' },
        emphasis: { scale: 1.3 },
        data: chartData.targetValues
      },
      {
        name: '当前成交',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#ff9f43', width: 2 },
        itemStyle: { color: '#ff9f43' },
        emphasis: { scale: 1.3 },
        data: chartData.actualValues
      }
    ]
  }

  chartInstance.setOption(option, true)
}

// 窗口大小变化时重绘图表
function handleResize() {
  chartInstance?.resize()
}

// 生命周期
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.performance-trend-chart {
  width: 100%;
  height: 280px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  gap: 32px;
  padding: 0 0 16px 0;
}

.header-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.header-label {
  font-size: 13px;
  color: #666;
}

.header-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.header-value.highlight {
  color: #ff9f43;
}

.chart-container {
  flex: 1;
  width: 100%;
  min-height: 0;
}
</style>

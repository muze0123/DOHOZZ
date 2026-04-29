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

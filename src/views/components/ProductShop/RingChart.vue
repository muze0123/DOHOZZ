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

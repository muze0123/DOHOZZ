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

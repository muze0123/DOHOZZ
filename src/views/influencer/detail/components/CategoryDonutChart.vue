<template>
  <div class="category-donut-chart">
    <h3 class="chart-title">{{ title }}</h3>

    <div class="chart-container">
      <!-- SVG环形图 -->
      <svg class="donut-svg" viewBox="0 0 180 180" width="180" height="180">
        <!-- 背景圆环 -->
        <circle
          cx="90"
          cy="90"
          r="40"
          fill="none"
          stroke="#F5F5F5"
          stroke-width="40"
        />
        <!-- 数据圆环 -->
        <circle
          v-for="(slice, index) in computedSlices"
          :key="index"
          cx="90"
          cy="90"
          r="40"
          fill="none"
          :stroke="slice.color"
          stroke-width="40"
          :stroke-dasharray="slice.dashArray"
          :stroke-dashoffset="slice.dashOffset"
          stroke-linecap="butt"
          class="donut-segment"
        />
      </svg>

      <!-- 中心文字 -->
      <div class="donut-center">
        <span class="center-value">{{ totalValue }}</span>
        <span class="center-label">带货分类</span>
      </div>
    </div>

    <!-- 图例表格 -->
    <div class="legend-table">
      <div class="legend-header">
        <span>一级分类</span>
        <span>占比</span>
      </div>
      <div
        v-for="(slice, index) in computedSlices"
        :key="index"
        class="legend-row"
      >
        <span class="legend-name">
          <i
            class="legend-dot"
            :style="{ backgroundColor: slice.color }"
          ></i>
          {{ slice.name }}
        </span>
        <span class="legend-percent">{{ slice.percent }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface DonutSlice {
  name: string
  value: number
  color?: string
}

interface Props {
  title: string
  data: DonutSlice[]
}

const props = defineProps<Props>()

// 默认颜色系列
const defaultColors = [
  '#4A7EFF', // 蓝
  '#FF8F1A', // 橙
  '#34C759', // 绿
  '#AF52DE', // 紫
  '#8E8E93'  // 灰
]

// "其他"分类颜色
const otherColor = '#D9D9D9'

// 计算总价值
const totalValue = computed(() => {
  return props.data.reduce((sum, item) => sum + item.value, 0)
})

// 计算每个切片
const computedSlices = computed(() => {
  const total = totalValue.value
  if (total === 0) return []

  // 按value降序排列
  const sortedData = [...props.data].sort((a, b) => b.value - a.value)

  // 计算非"其他"分类的数量
  const nonOtherCount = sortedData.filter(item => item.name !== '其他').length

  let currentOffset = 0
  const circumference = 2 * Math.PI * 40 // r=40

  return sortedData.map((item, index) => {
    const percent = ((item.value / total) * 100).toFixed(2) + '%'
    const sliceLength = (item.value / total) * circumference

    // 确定颜色
    let color = item.color
    if (!color) {
      if (item.name === '其他') {
        color = otherColor
      } else {
        // 根据索引循环使用默认颜色
        color = defaultColors[(index - (sortedData.length - nonOtherCount)) % defaultColors.length]
      }
    }

    const dashArray = `${sliceLength} ${circumference - sliceLength}`
    const dashOffset = -currentOffset

    currentOffset += sliceLength

    return {
      name: item.name,
      value: item.value,
      color,
      percent,
      dashArray,
      dashOffset
    }
  })
})
</script>

<style lang="scss" scoped>
.category-donut-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  text-align: center;
  margin: 0 0 12px;
}

.chart-container {
  position: relative;
  width: 180px;
  height: 180px;
  margin-bottom: 16px;
}

.donut-svg {
  transform: rotate(-90deg);
}

.donut-segment {
  transition: opacity 0.3s ease;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: transparent;
}

.center-value {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  line-height: 1.2;
}

.center-label {
  font-size: 12px;
  color: #8C8C8C;
  margin-top: 2px;
}

.legend-table {
  width: 100%;
  max-width: 240px;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #F0F0F0;
  font-size: 12px;
  color: #8C8C8C;

  span:last-child {
    text-align: right;
  }
}

.legend-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding: 0 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #FAFAFA;
  }

  span:last-child {
    text-align: right;
  }
}

.legend-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #262626;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-percent {
  font-size: 13px;
  color: #262626;
}
</style>

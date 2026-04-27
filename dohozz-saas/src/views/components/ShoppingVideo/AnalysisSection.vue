<template>
  <div class="analysis-section">
    <!-- 三指标块 -->
    <div class="metric-row">
      <MetricCard
        v-for="t in types"
        :key="t"
        :type="t"
        :active="currentMetric === t"
        :data="metricData[t] || {}"
        @click="selectMetric(t)"
      />
    </div>

    <!-- 下方图表区 -->
    <div class="chart-area">
      <div class="chart-placeholder">
        <span>TrendChart (Task 7)</span>
      </div>
      <div class="chart-placeholder">
        <span>GMVDistribution (Task 7)</span>
      </div>
      <div class="chart-placeholder">
        <span>CategoryTop5 (Task 8)</span>
      </div>
    </div>
  </div>
</template>

<script>
import MetricCard from './MetricCard.vue'

export default {
  name: 'AnalysisSection',
  components: { MetricCard },
  props: {
    currentMetric: { type: String, default: 'new' }
  },
  data() {
    return {
      types: ['new', 'selling', 'delivery'],
      metricData: {}
    }
  },
  methods: {
    selectMetric(type) {
      this.$emit('update:currentMetric', type)
    }
  }
}
</script>

<style scoped>
.analysis-section {
  padding: 16px;
}
.metric-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.chart-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.chart-placeholder {
  background: #f5f5f5;
  border-radius: 8px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
.chart-area > div:last-child {
  grid-column: 1 / -1;
}
</style>
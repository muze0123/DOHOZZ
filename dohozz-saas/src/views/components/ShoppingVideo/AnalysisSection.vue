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
      <TrendChart
        class="chart-item trend-chart-item"
        :data="metricData[currentMetric]?.trendData || []"
        :metric-type="currentMetric"
      />
      <GMVDistribution
        class="chart-item"
        :data="metricData[currentMetric]?.gmvDistribution || []"
        @click-row="handleRowClick"
      />
      <CategoryTop5
        class="chart-item"
        :data="metricData[currentMetric]?.categoryTop5 || []"
        @click-row="handleRowClick"
      />
    </div>
  </div>
</template>

<script>
import MetricCard from './MetricCard.vue'
import TrendChart from './TrendChart.vue'
import GMVDistribution from './GMVDistribution.vue'
import CategoryTop5 from './CategoryTop5.vue'

export default {
  name: 'AnalysisSection',
  components: { MetricCard, TrendChart, GMVDistribution, CategoryTop5 },
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
    },
    handleRowClick(type, value) {
      this.$emit('click-row', type, value)
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
  grid-template-rows: auto auto;
  gap: 16px;
}
.trend-chart-item {
  grid-column: 1 / -1;
}
</style>
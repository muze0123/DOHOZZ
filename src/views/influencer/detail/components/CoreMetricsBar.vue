<template>
  <div class="core-metrics-bar">
    <div class="metrics-container">
      <div
        v-for="metric in metrics"
        :key="metric.key"
        class="metric-item"
      >
        <span class="metric-label">{{ metric.label }}</span>
        <span class="metric-value">{{ metric.value }}</span>
        <span class="metric-sub" v-if="metric.sub">{{ metric.sub }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Metric {
  key: string
  label: string
  value: string
  sub?: string
}

defineProps<{
  data?: Metric[]
}>()

const metrics = ref<Metric[]>([
  { key: 'fans', label: '粉丝数', value: '1,234,567', sub: '' },
  { key: 'likes', label: '获赞数', value: '5,678,901', sub: '' },
  { key: 'gmv', label: '近30日成交金额', value: '¥132.32w', sub: '直播占88.65%' },
  { key: 'sales', label: '近30日销量', value: '66,666', sub: '' },
  { key: 'videos', label: '视频数量', value: '43', sub: '历史总视频数2,332' },
  { key: 'liveSessions', label: '直播场次', value: '66', sub: '历史总场次1,256' },
  { key: 'avgViews', label: '视频平均播放量', value: '123,456', sub: '' },
  { key: 'avgLiveViewers', label: '直播场均观看人数', value: '88,888', sub: '' }
])
</script>

<style scoped>
.core-metrics-bar {
  background: #ffffff;
  padding: 16px 24px;
  border-top: 1px solid #F0F0F0;
}

.metrics-container {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-label {
  font-size: 14px;
  color: #8C8C8C;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.metric-sub {
  font-size: 12px;
  color: #8C8C8C;
}
</style>

<template>
  <div class="enterprise-influencer-stats-section">
    <div class="stats-cards">
      <div class="stats-card" v-for="stat in statsData" :key="stat.key">
        <div class="card-label">{{ stat.label }}</div>
        <div class="card-value">{{ formatValue(stat.value) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  statsData: {
    type: Array,
    default: () => []
  }
})

function formatValue(value) {
  if (value == null || typeof value !== 'number') return '0'
  return value.toLocaleString('zh-CN')
}
</script>

<style scoped lang="scss">
.enterprise-influencer-stats-section {
  background: #fff;
  margin-bottom: 16px;
  border-radius: 8px;
}

.stats-cards {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.stats-card {
  flex: 1;
  min-width: 140px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;

  .card-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
}
</style>

<template>
  <div class="product-share-cards">
    <div class="section-header">
      <span class="section-title">商品占比图</span>
      <span class="section-tag">商品成交金额TOP15</span>
    </div>
    <div class="cards-wrapper">
      <div class="cards-scroll">
        <div
          v-for="(item, index) in data"
          :key="item.id"
          class="product-card"
          @click="handleCardClick(item)"
        >
          <div class="card-rank">{{ index + 1 }}</div>
          <div class="card-name">{{ item.name }}</div>
          <div class="card-brand">{{ item.brand }}</div>
          <div class="card-amount">¥{{ formatAmount(item.salesAmount) }}</div>
          <div class="card-ratio">占比 {{ item.ratio }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] }
})

const emit = defineEmits(['card-click'])

function formatAmount(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + 'w'
  }
  return value.toLocaleString()
}

function handleCardClick(item) {
  emit('card-click', item)
}
</script>

<style scoped>
.product-share-cards {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-tag {
  padding: 2px 8px;
  background: #fff1f0;
  color: #ff4d4f;
  font-size: 12px;
  border-radius: 4px;
}

.cards-wrapper {
  overflow-x: auto;
}

.cards-scroll {
  display: flex;
  gap: 12px;
  padding-bottom: 8px;
}

.product-card {
  flex-shrink: 0;
  width: 160px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
}

.card-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-brand {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.card-amount {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-ratio {
  font-size: 12px;
  opacity: 0.9;
}
</style>

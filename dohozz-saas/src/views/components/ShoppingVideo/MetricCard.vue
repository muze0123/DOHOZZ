<template>
  <div class="metric-card" :class="{ active }">
    <div class="metric-header">
      <span class="metric-name">{{ title }}</span>
      <span class="metric-icon">?</span>
    </div>
    <div class="metric-value">{{ data.mainValue || '--' }}</div>
    <div class="metric-subs">
      <div v-for="item in subMetrics" :key="item.label" class="sub-item">
        <span class="sub-label">{{ item.label }}</span>
        <span class="sub-value">{{ item.value ?? '--' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    type: { type: String, required: true },
    active: { type: Boolean, default: false },
    data: { type: Object, default: () => ({}) }
  },
  computed: {
    title() {
      const map = { new: '新发布视频', selling: '动销视频', delivery: '投放视频' }
      return map[this.type] || ''
    },
    subMetrics() {
      const subMap = {
        new: [
          { label: '成交金额', key: 'dealAmount' },
          { label: '退款金额', key: 'refundAmount' },
          { label: '达人佣金', key: 'commission' },
          { label: '视频达人数', key: 'influencerCount' }
        ],
        selling: [
          { label: '成交金额', key: 'dealAmount' },
          { label: '退款金额', key: 'refundAmount' },
          { label: '达人佣金', key: 'commission' },
          { label: '视频达人数', key: 'influencerCount' }
        ],
        delivery: [
          { label: '消耗金额', key: 'consumeAmount' },
          { label: '成交金额', key: 'dealAmount' },
          { label: '成交订单数', key: 'orderCount' },
          { label: '支付ROI', key: 'payRoi' }
        ]
      }
      const items = subMap[this.type] || []
      return items.map(i => ({ ...i, value: this.data[i.key] }))
    }
  }
}
</script>

<style scoped>
.metric-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.metric-card.active {
  box-shadow: 0 0 0 2px #3370ff;
}
.metric-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.metric-name {
  font-size: 14px;
  color: #666;
}
.metric-icon {
  color: #999;
  font-size: 14px;
}
.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}
.metric-subs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.sub-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sub-label {
  font-size: 12px;
  color: #999;
}
.sub-value {
  font-size: 14px;
  color: #333;
}
</style>
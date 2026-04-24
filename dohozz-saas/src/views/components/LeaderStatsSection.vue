<template>
  <div class="leader-stats-section">
    <div class="stats-cards">
      <div class="stats-card">
        <div class="card-label">成交金额</div>
        <div class="card-value">¥{{ formatMoney(statsData.dealAmount) }}</div>
        <div class="card-change" :class="getChangeClass(statsData.dealAmountChange)">
          环比 {{ statsData.dealAmountChange }}%
        </div>
      </div>
      <div class="stats-card">
        <div class="card-label">结算金额</div>
        <div class="card-value">¥{{ formatMoney(statsData.settleAmount) }}</div>
        <div class="card-change" :class="getChangeClass(statsData.settleAmountChange)">
          环比 {{ statsData.settleAmountChange }}%
        </div>
      </div>
      <div class="stats-card warning">
        <div class="card-label">退款金额</div>
        <div class="card-value">¥{{ formatMoney(statsData.refundAmount) }}</div>
        <div class="card-change" :class="getChangeClass(statsData.refundAmountChange)">
          环比 {{ statsData.refundAmountChange }}%
        </div>
      </div>
      <div class="stats-card">
        <div class="card-label">结算服务费</div>
        <div class="card-value">¥{{ formatMoney(statsData.serviceFee) }}</div>
        <div class="card-change" :class="getChangeClass(statsData.serviceFeeChange)">
          环比 {{ statsData.serviceFeeChange }}%
        </div>
      </div>
      <div class="stats-card">
        <div class="card-label">出单团长数</div>
        <div class="card-value">{{ statsData.leaderWithOrders }}</div>
        <div class="card-change" :class="getChangeClass(statsData.leaderWithOrdersChange)">
          环比 {{ statsData.leaderWithOrdersChange }}%
        </div>
      </div>
      <div class="stats-card">
        <div class="card-label">出单达人数</div>
        <div class="card-value">{{ statsData.influencerWithOrders }}</div>
        <div class="card-change" :class="getChangeClass(statsData.influencerWithOrdersChange)">
          环比 {{ statsData.influencerWithOrdersChange }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  statsData: {
    type: Object,
    default: () => ({})
  }
})

function formatMoney(value) {
  if (!value) return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getChangeClass(change) {
  if (change > 0) return 'up'
  if (change < 0) return 'down'
  return 'neutral'
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.leader-stats-section {
  background: #fff;
  margin-bottom: 0;
}

.stats-cards {
  display: flex;
  flex-wrap: wrap;
  padding: 16px 20px;
  gap: 12px;
  background: #fafafa;
}

.stats-card {
  flex: 1;
  min-width: 140px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #f0f0f0;

  .card-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
  }

  .card-value {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .card-change {
    font-size: 11px;
    margin-top: 4px;

    &.up {
      color: #ff4d4f;
    }

    &.down {
      color: #00cc66;
    }

    &.neutral {
      color: #999;
    }
  }

  &.warning .card-value {
    color: #ff4d4f;
  }
}
</style>

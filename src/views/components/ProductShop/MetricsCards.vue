<template>
  <div class="metrics-cards">
    <!-- 成交金额卡片 - 淡粉底色 -->
    <div class="metric-card card-pink">
      <div class="card-header">
        <span class="card-title">成交金额</span>
        <el-tooltip content="成交金额说明" placement="top">
          <span class="help-icon">?</span>
        </el-tooltip>
      </div>
      <div class="card-value">¥{{ data.salesAmount.value }}{{ data.salesAmount.unit }}</div>
      <div class="card-secondary">订单数: {{ formatNumber(data.salesAmount.orderCount) }}</div>
      <div class="card-trend" :class="getTrendClass(data.salesAmount.mom)">
        <span class="trend-arrow">{{ getTrendArrow(data.salesAmount.mom) }}</span>
        环比 {{ data.salesAmount.mom }}%
      </div>
      <div class="card-trend" :class="getTrendClass(data.salesAmount.orderMom)">
        <span class="trend-arrow">{{ getTrendArrow(data.salesAmount.orderMom) }}</span>
        {{ data.salesAmount.orderMom }}%
      </div>
    </div>

    <!-- 退款金额卡片 - 淡紫底色 -->
    <div class="metric-card card-purple">
      <div class="card-header">
        <span class="card-title">退款金额</span>
        <el-tooltip content="退款金额说明" placement="top">
          <span class="help-icon">?</span>
        </el-tooltip>
      </div>
      <div class="card-value">¥{{ data.refundAmount.value }}{{ data.refundAmount.unit }}</div>
      <div class="card-secondary">退款订单数: {{ formatNumber(data.refundAmount.orderCount) }}</div>
      <div class="card-trend" :class="getTrendClass(data.refundAmount.mom)">
        <span class="trend-arrow">{{ getTrendArrow(data.refundAmount.mom) }}</span>
        环比 {{ data.refundAmount.mom }}%
      </div>
      <div class="card-trend" :class="getTrendClass(data.refundAmount.orderMom)">
        <span class="trend-arrow">{{ getTrendArrow(data.refundAmount.orderMom) }}</span>
        {{ data.refundAmount.orderMom }}%
      </div>
    </div>

    <!-- 出单商品数卡片 - 淡蓝底色 -->
    <div class="metric-card card-blue">
      <div class="card-header">
        <span class="card-title">出单商品数</span>
        <el-tooltip content="出单商品数说明" placement="top">
          <span class="help-icon">?</span>
        </el-tooltip>
      </div>
      <div class="card-value">{{ data.productCount.value }}</div>
      <div class="card-secondary">出单链接数: {{ data.productCount.linkCount }}</div>
      <div class="card-trend" :class="getTrendClass(data.productCount.mom)">
        <span class="trend-arrow">{{ getTrendArrow(data.productCount.mom) }}</span>
        环比 {{ data.productCount.mom }}%
      </div>
      <div class="card-trend" :class="getTrendClass(data.productCount.linkMom)">
        <span class="trend-arrow">{{ getTrendArrow(data.productCount.linkMom) }}</span>
        {{ data.productCount.linkMom }}%
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true }
})

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

function getTrendClass(value) {
  return value >= 0 ? 'trend-up' : 'trend-down'
}

function getTrendArrow(value) {
  return value >= 0 ? '↑' : '↓'
}
</script>

<style scoped>
.metrics-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.metric-card {
  padding: 16px;
  border-radius: 8px;
  background: #fff;
}

.card-pink { background: #FFF1F0; }
.card-purple { background: #F9F0FF; }
.card-blue { background: #E6F4FF; }

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  color: #666;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.card-secondary {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.card-trend {
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-right: 12px;
}

.trend-up {
  color: #ff4d4f;
}

.trend-down {
  color: #52c41a;
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid #d9d9d9;
  color: #8C8C8C;
  font-size: 11px;
  cursor: pointer;
}
</style>

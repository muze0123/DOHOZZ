<template>
  <div class="collab-live-stats-section">
    <!-- 统计范围说明 -->
    <div class="stats-range-info">
      <span class="range-label">统计时间范围：</span>
      <span class="range-value">{{ dateRangeText }}</span>
    </div>

    <!-- 两栏统计数据 -->
    <div class="stats-columns">
      <!-- 合作直播数据 -->
      <div class="stats-column">
        <div class="column-header">合作直播数据汇总</div>
        <div class="stats-cards">
          <div class="stats-card">
            <div class="card-label">直播场次</div>
            <div class="card-value">{{ formatNumber(safeStats.collabLiveCount) }}</div>
          </div>
          <div class="stats-card">
            <div class="card-label">直播成交金额</div>
            <div class="card-value">¥{{ formatMoney(safeStats.collabLiveAmount) }}</div>
          </div>
          <div class="stats-card">
            <div class="card-label">直播销量</div>
            <div class="card-value">{{ formatSales(safeStats.collabLiveSales) }}</div>
          </div>
          <div class="stats-card warning">
            <div class="card-label">直播退款金额</div>
            <div class="card-value">¥{{ formatMoney(safeStats.collabLiveRefund) }}</div>
          </div>
          <div class="stats-card success">
            <div class="card-label">预估达人佣金</div>
            <div class="card-value">¥{{ formatMoney(safeStats.estimatedCommission) }}</div>
          </div>
          <div class="stats-card">
            <div class="card-label">直播达人数</div>
            <div class="card-value">{{ formatNumber(safeStats.collabLiveInfluencerCount) }}</div>
          </div>
        </div>
      </div>

      <!-- 投放直播数据 -->
      <div class="stats-column">
        <div class="column-header">投放直播数据汇总</div>
        <div class="stats-cards">
          <div class="stats-card">
            <div class="card-label">投放直播数</div>
            <div class="card-value">{{ formatNumber(safeStats.promoLiveCount) }}</div>
          </div>
          <div class="stats-card">
            <div class="card-label">消耗金额</div>
            <div class="card-value">¥{{ formatMoney(safeStats.consumeAmount) }}</div>
          </div>
          <div class="stats-card">
            <div class="card-label">成交金额（投放）</div>
            <div class="card-value">¥{{ formatMoney(safeStats.promoLiveAmount) }}</div>
          </div>
          <div class="stats-card">
            <div class="card-label">成交订单数</div>
            <div class="card-value">{{ formatNumber(safeStats.promoOrderCount) }}</div>
          </div>
          <div class="stats-card">
            <div class="card-label">支付ROI</div>
            <div class="card-value">{{ formatRatio(safeStats.payRoi) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  statsData: {
    type: Object,
    default: () => ({})
  },
  dateRange: {
    type: Array,
    default: () => []
  }
})

// 安全访问statsData的computed属性，防止null/undefined访问错误
const safeStats = computed(() => props.statsData ?? {})

// 计算统计时间范围文案
const dateRangeText = computed(() => {
  if (!props.dateRange || props.dateRange.length < 2) {
    return '近30天'
  }
  const [start, end] = props.dateRange
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))

  if (diffDays === 30) {
    return '近30天'
  }
  return `${start} 至 ${end}`
})

// 格式化金额
function formatMoney(value) {
  if (value == null || typeof value !== 'number') return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 格式化销量
function formatSales(value) {
  if (value == null || typeof value !== 'number') return '0'
  return value.toLocaleString('zh-CN')
}

// 格式化数字
function formatNumber(value) {
  if (value == null || typeof value !== 'number') return '0'
  return value.toLocaleString('zh-CN')
}

// 格式化ROI
function formatRatio(value) {
  if (value == null || typeof value !== 'number') return '--'
  return value.toFixed(2)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_influencer-page.scss';

.collab-live-stats-section {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.stats-range-info {
  padding: 12px 20px;
  font-size: 13px;
  color: #65676B;
  border-bottom: 1px solid #E8E8E8;

  .range-label {
    color: #999;
  }

  .range-value {
    color: #050505;
    font-weight: 500;
  }
}

.stats-columns {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
}

.stats-column {
  flex: 1;
  min-width: 0;

  &:first-child {
    border-right: 1px solid #E8E8E8;
    padding-right: 16px;
  }

  &:last-child {
    padding-left: 16px;
  }
}

.column-header {
  font-size: 14px;
  font-weight: 600;
  color: #050505;
  margin-bottom: 12px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stats-card {
  padding: 12px 16px;
  background: #F5F6F7;
  border-radius: 6px;

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

  &.warning .card-value {
    color: #ff4d4f;
  }

  &.success .card-value {
    color: #00cc66;
  }
}
</style>

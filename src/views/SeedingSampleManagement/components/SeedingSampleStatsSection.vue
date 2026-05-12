<template>
  <div class="sample-stats-section">
    <!-- 状态Tab区 -->
    <div class="status-tabs-section">
      <div class="status-tabs">
        <div
          v-for="tab in statusTabs"
          :key="tab.key"
          class="status-tab"
          :class="{ active: activeStatus === tab.key }"
          @click="handleStatusChange(tab.key)"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </div>
      </div>
    </div>

    <!-- 交付状态Tab（仅已签收时显示） -->
    <div v-if="activeStatus === 'signed'" class="delivery-tabs-section">
      <div class="delivery-tabs">
        <div
          v-for="tab in deliveryTabs"
          :key="tab.key"
          class="delivery-tab"
          :class="{ active: activeDeliveryStatus === tab.key }"
          @click="handleDeliveryStatusChange(tab.key)"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </div>
      </div>
    </div>

    <!-- 统计数据卡片 -->
    <div class="stats-cards">
      <div class="stats-card" @click="handleStatClick('sampleCount')">
        <div class="card-label">样品总数</div>
        <div class="card-value">{{ statsData.sampleCount }}</div>
      </div>
      <div class="stats-card" @click="handleStatClick('productCount')">
        <div class="card-label">商品数</div>
        <div class="card-value">{{ statsData.productCount }}</div>
      </div>
      <div class="stats-card" @click="handleStatClick('influencerCount')">
        <div class="card-label">达人数</div>
        <div class="card-value">{{ statsData.influencerCount }}</div>
      </div>
      <div class="stats-card highlight" @click="handleStatClick('repeatProductCount')">
        <div class="card-label">重复样品数</div>
        <div class="card-value">{{ statsData.repeatProductCount }}</div>
      </div>
      <div class="stats-card" @click="handleStatClick('sampleFee')">
        <div class="card-label">样品总费用</div>
        <div class="card-value">¥{{ formatMoney(statsData.sampleFee) }}</div>
      </div>
      <div class="stats-card warning" @click="handleStatClick('repeatFee')">
        <div class="card-label">重复样品费用</div>
        <div class="card-value">¥{{ formatMoney(statsData.repeatFee) }}</div>
      </div>
      <div class="stats-card success" @click="handleStatClick('deliveryRate')">
        <div class="card-label">交付率</div>
        <div class="card-value">{{ statsData.deliveryRate }}</div>
      </div>
      <div class="stats-card success" @click="handleStatClick('orderRate')">
        <div class="card-label">出单率</div>
        <div class="card-value">{{ statsData.orderRate }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeStatus: {
    type: String,
    default: 'all'
  },
  activeDeliveryStatus: {
    type: String,
    default: ''
  },
  statusTabs: {
    type: Array,
    default: () => []
  },
  deliveryTabs: {
    type: Array,
    default: () => []
  },
  statsData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['status-change', 'delivery-status-change', 'stat-click'])

function handleStatusChange(status) {
  emit('status-change', status)
}

function handleDeliveryStatusChange(status) {
  emit('delivery-status-change', status)
}

function handleStatClick(statKey) {
  emit('stat-click', statKey)
}

function formatMoney(value) {
  if (!value) return '0'
  return value.toLocaleString()
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.sample-stats-section {
  background: #fff;
  margin-bottom: 0;
}

.status-tabs-section {
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
}

.status-tabs {
  display: flex;
  gap: 24px;
}

.status-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  .tab-label {
    font-size: 14px;
    color: #666;
  }

  .tab-count {
    font-size: 13px;
    color: #999;
    background: #f5f5f5;
    padding: 1px 8px;
    border-radius: 10px;
  }

  &.active {
    border-bottom-color: #1677ff;

    .tab-label {
      color: #1677ff;
      font-weight: 500;
    }

    .tab-count {
      color: #1677ff;
      background: #e6f4ff;
    }
  }

  &:hover:not(.active) {
    .tab-label {
      color: #333;
    }
  }
}

.delivery-tabs-section {
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
}

.delivery-tabs {
  display: flex;
  gap: 24px;
}

.delivery-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 0;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  .tab-label {
    font-size: 13px;
    color: #666;
  }

  .tab-count {
    font-size: 12px;
    color: #999;
    background: #f5f5f5;
    padding: 1px 6px;
    border-radius: 10px;
  }

  &.active {
    border-bottom-color: #00cc66;

    .tab-label {
      color: #00cc66;
      font-weight: 500;
    }

    .tab-count {
      color: #00cc66;
      background: #e6f7ed;
    }
  }
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
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:hover {
    border-color: #1677ff;
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);
  }

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

  &.highlight {
    .card-value {
      color: #ff6600;
    }
  }

  &.warning {
    .card-value {
      color: #ff4d4f;
    }
  }

  &.success {
    .card-value {
      color: #00cc66;
    }
  }
}
</style>

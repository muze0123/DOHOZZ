<template>
  <div class="data-overview-section">
    <!-- ==================== 5.2 标题与时间筛选行 ==================== -->
    <div class="header-row">
      <h3 class="section-title">数据概览</h3>
      <div class="time-filter-group">
        <div class="tab-container">
          <span
            v-for="tab in timeTabs"
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @click="handleTabClick(tab.key)"
          >
            {{ tab.label }}
          </span>
        </div>
        <span class="date-range-text" v-if="activeTab !== 'all'">
          {{ dateRangeText }}
        </span>
      </div>
    </div>

    <!-- ==================== 5.3 数据指标卡片区 ==================== -->
    <div class="cards-area">
      <!-- 左翻页箭头 -->
      <button
        class="pagination-btn prev-btn"
        :class="{ disabled: currentPage <= 1 }"
        @click="prevPage"
        :disabled="currentPage <= 1"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <!-- 卡片列表 -->
      <div class="cards-container">
        <div class="cards-grid">
          <div
            v-for="card in visibleCards"
            :key="card.id"
            class="metric-card"
            :class="{ selected: selectedCardId === card.id }"
            @click="handleCardClick(card.id)"
          >
            <div class="card-label">{{ card.label }}</div>
            <div class="card-value">{{ card.value }}</div>
            <div class="card-sub" v-if="card.sub">{{ card.sub }}</div>
          </div>
        </div>
      </div>

      <!-- 右翻页箭头 -->
      <button
        class="pagination-btn next-btn"
        :class="{ disabled: currentPage >= totalPages }"
        @click="nextPage"
        :disabled="currentPage >= totalPages"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>

    <!-- 页码指示器 -->
    <div class="page-indicator">
      <span class="indicator-text">
        {{ currentPage }} / {{ totalPages }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 定义Props - 可接收外部数据
defineProps({
  // 可接收外部数据
})

// 时间筛选Tab
const timeTabs = [
  { key: 'all', label: '全部' },
  { key: 'recent', label: '近7天' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'custom', label: '自定义' }
]

const activeTab = ref('recent')
const dateRangeText = '2026.04.01 - 2026.04.30'

const handleTabClick = (key) => {
  activeTab.value = key
}

// 10个指标数据
const metricCards = ref([
  { id: '1', label: '成交金额', value: '¥132.32w', sub: '直播占 88.65%' },
  { id: '2', label: '直播成交金额', value: '¥88.88w', sub: '场均成交金额 ¥2.56w' },
  { id: '3', label: '视频成交金额', value: '¥33.33w', sub: '平均成交金额 ¥1.25w' },
  { id: '4', label: '橱窗及其他成交金额', value: '¥32.32w', sub: '-' },
  { id: '5', label: '千次观看成交金额', value: '¥132.32w', sub: '-' },
  { id: '6', label: '成交订单数', value: '666', sub: '-' },
  { id: '7', label: '直播场次', value: '66', sub: '历史总场次 1,256' },
  { id: '8', label: '直播成交订单数', value: '666', sub: '场均成交订单数 22' },
  { id: '9', label: '视频数量', value: '43', sub: '历史总视频数 2,332' },
  { id: '10', label: '视频成交订单数', value: '666', sub: '平均成交订单数 22' }
])

// 翻页状态
const currentPage = ref(1)
const cardsPerPage = 5
const totalPages = computed(() => Math.ceil(metricCards.value.length / cardsPerPage))

// 当前页可见的卡片
const visibleCards = computed(() => {
  const start = (currentPage.value - 1) * cardsPerPage
  const end = start + cardsPerPage
  return metricCards.value.slice(start, end)
})

// 卡片选中状态
const selectedCardId = ref(null)

const handleCardClick = (id) => {
  selectedCardId.value = selectedCardId.value === id ? null : id
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    selectedCardId.value = null
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    selectedCardId.value = null
  }
}
</script>

<style scoped>
.data-overview-section {
  background: #ffffff;
  padding: 16px;
}

/* ==================== 5.2 标题与时间筛选行 ==================== */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.time-filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tab-container {
  display: flex;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  overflow: hidden;
}

.tab-item {
  padding: 6px 16px;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  background: #ffffff;
  border-right: 1px solid #E8E8E8;
  transition: all 0.2s ease;
}

.tab-item:last-child {
  border-right: none;
}

.tab-item:hover {
  color: #1677FF;
}

.tab-item.active {
  background: #1677FF;
  color: #ffffff;
  border-radius: 3px;
  margin: 2px;
}

.date-range-text {
  font-size: 12px;
  color: #8C8C8C;
  margin-left: 12px;
}

/* ==================== 5.3 数据指标卡片区 ==================== */
.cards-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.pagination-btn {
  width: 24px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F5F5;
  border: none;
  border-radius: 4px;
  color: #8C8C8C;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.pagination-btn:hover:not(.disabled) {
  color: #262626;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  margin-right: 16px;
}

.next-btn {
  margin-left: 16px;
}

.cards-container {
  flex: 1;
  overflow: hidden;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.metric-card {
  background: #ffffff;
  border: 1px solid #F0F0F0;
  border-radius: 6px;
  padding: 16px;
  min-height: 80px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metric-card:hover {
  border-color: #d6e4ff;
}

.metric-card.selected {
  border-color: #1677FF;
}

.card-label {
  font-size: 12px;
  color: #8C8C8C;
  margin-bottom: 8px;
}

.card-value {
  font-size: 22px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.card-sub {
  font-size: 12px;
  color: #8C8C8C;
}

/* 页码指示器 */
.page-indicator {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.indicator-text {
  font-size: 12px;
  color: #8C8C8C;
}
</style>

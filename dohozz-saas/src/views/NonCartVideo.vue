<template>
  <div class="non-cart-video">
    <!-- 平台 Tab 切换栏 -->
    <div class="platform-section">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key }"
          @click="handlePlatformChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <!-- 全局时间筛选 -->
    <div class="time-filter-bar">
      <!-- 周/月/近N天/自定义 选项卡 -->
    </div>

    <!-- 分析区 -->
    <NonCartVideoStatsSection v-if="statsSectionVisible" />

    <!-- 列表区 -->
    <NonCartVideoFilterSection ref="filterSectionRef" />
    <NonCartVideoListSection v-if="listSectionVisible" />

    <!-- 分页 -->
    <div class="pagination-section">...</div>

    <!-- 弹窗 -->
    <AddNonCartVideoDialog v-model="addDialogVisible" />
    <SyncPlatformDialog v-model="syncDialogVisible" />
    <NonCartVideoDetailDialog v-model="detailDialogVisible" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 平台 Tab（默认 TikTok，不含"全部"）
const platformTabs = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('tiktok')

// 时间筛选
const activeTimeKey = ref('7days')
const timeRange = ref([])

// 弹窗状态
const addDialogVisible = ref(false)
const syncDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 组件引用
const filterSectionRef = ref(null)

// 状态
const statsSectionVisible = ref(false)
const listSectionVisible = ref(false)

// 方法
function handlePlatformChange(platform) {
  activePlatform.value = platform
}

function handleTimeChange(key) {
  activeTimeKey.value = key
}
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

.non-cart-video {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}
</style>

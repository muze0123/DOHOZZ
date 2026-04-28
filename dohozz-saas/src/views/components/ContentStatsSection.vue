<template>
  <div class="content-stats-section">
    <!-- 时间切换栏 -->
    <div class="stats-header">
      <span class="stats-title">数据概览</span>
      <div class="time-tabs">
        <button
          v-for="tab in timeRangeOptions"
          :key="tab.key"
          :class="['time-tab', { active: activeTimeRange === tab.key }]"
          @click="handleTimeRangeChange(tab.key)"
        >
          {{ tab.label }}
        </button>
        <button class="time-tab" @click="handleMoreClick">更多</button>
        <el-popover
          placement="bottom-start"
          :width="280"
          trigger="hover"
          content="数据更新时间：每日凌晨更新昨日数据"
        >
          <template #reference>
            <el-icon class="help-icon"><QuestionFilled /></el-icon>
          </template>
        </el-popover>
      </div>
    </div>

    <!-- 数据卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-label">内容总数</div>
        <div class="stat-value">{{ stats.total }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">播放量/阅读量</div>
        <div class="stat-value">{{ stats.viewCountStr }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">点赞数</div>
        <div class="stat-value">{{ stats.likeCountStr }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">评论数</div>
        <div class="stat-value">{{ stats.commentCountStr }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">收藏数</div>
        <div class="stat-value">{{ stats.collectCountStr }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuestionFilled } from '@element-plus/icons-vue'

defineProps({
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      collectCount: 0,
      viewCountStr: '0',
      likeCountStr: '0',
      commentCountStr: '0',
      collectCountStr: '0'
    })
  },
  timeRangeOptions: {
    type: Array,
    default: () => [
      { key: 'all', label: '全部' },
      { key: 'yesterday', label: '昨天' },
      { key: 'today', label: '今天' },
      { key: 'last7days', label: '近7天' },
      { key: 'last30days', label: '近30天' }
    ]
  },
  activeTimeRange: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['time-range-change', 'more-click'])

function handleTimeRangeChange(key) {
  emit('time-range-change', key)
}

function handleMoreClick() {
  emit('more-click')
}
</script>

<style scoped lang="scss">
.content-stats-section {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.time-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-tab {
  padding: 6px 12px;
  font-size: 13px;
  color: #666;
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #FF6600;
    color: #FF6600;
  }

  &.active {
    border-color: #FF6600;
    color: #FF6600;
  }
}

.help-icon {
  color: #9CA3AF;
  cursor: pointer;
  margin-left: 4px;

  &:hover {
    color: #FF6600;
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.stat-card {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 10px;

  .stat-label {
    font-size: 12px;
    color: #6B7280;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #1F2937;
  }
}
</style>
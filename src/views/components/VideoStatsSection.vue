<template>
  <div class="video-stats-section">
    <!-- 统计卡片区 -->
    <div class="stats-cards">
      <div class="stats-card">
        <div class="card-label">视频数</div>
        <div class="card-value">{{ statsData.videoCount }}</div>
      </div>
      <div class="stats-card">
        <div class="card-label">视频达人数</div>
        <div class="card-value">{{ statsData.influencerCount }}</div>
      </div>
      <div class="stats-card">
        <div class="card-label">成交金额</div>
        <div class="card-value">¥{{ formatMoney(statsData.totalAmount) }}</div>
      </div>
      <div class="stats-card warning">
        <div class="card-label">退款金额</div>
        <div class="card-value">¥{{ formatMoney(statsData.refundAmount) }}</div>
      </div>
      <div class="stats-card success">
        <div class="card-label">达人佣金</div>
        <div class="card-value">¥{{ formatMoney(statsData.commission) }}</div>
      </div>
      <div class="stats-card">
        <div class="card-label">成交订单数</div>
        <div class="card-value">{{ statsData.orderCount.toLocaleString() }}</div>
      </div>
    </div>

    <!-- 列表分类标签 + 操作按钮 -->
    <div class="list-toolbar">
      <div class="toolbar-left">
        <span class="page-title">带货视频列表</span>
        <div class="category-tabs">
          <span
            v-for="tab in categoryTabs"
            :key="tab.key"
            class="category-tab"
            :class="{ active: activeCategory === tab.key }"
            @click="handleCategoryChange(tab.key)"
          >
            {{ tab.label }}({{ tab.count }})
          </span>
        </div>
        <div class="update-time">
          <span>数据更新时间：{{ updateTime }}</span>
          <el-icon class="question-icon" @click="handleShowRule"><QuestionFilled /></el-icon>
        </div>
      </div>
      <div class="toolbar-right">
        <el-dropdown trigger="click" @command="handleBatchAction">
          <el-button :disabled="!hasSelection">
            批量操作
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="offline">批量下架</el-dropdown-item>
              <el-dropdown-item command="export">批量导出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleAddVideo">
          <el-button type="primary">
            + 添加视频
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="link">链接导入</el-dropdown-item>
              <el-dropdown-item command="manual">手动添加</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuestionFilled, ArrowDown } from '@element-plus/icons-vue'

defineProps({
  activeCategory: {
    type: String,
    default: 'all'
  },
  statsData: {
    type: Object,
    default: () => ({})
  },
  categoryTabs: {
    type: Array,
    default: () => []
  },
  hasSelection: {
    type: Boolean,
    default: false
  },
  updateTime: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['category-change', 'batch-action', 'add-video', 'show-rule'])

function handleCategoryChange(category) {
  emit('category-change', category)
}

function handleBatchAction(action) {
  emit('batch-action', action)
}

function handleAddVideo(type) {
  emit('add-video', type)
}

function handleShowRule() {
  emit('show-rule')
}

function formatMoney(value) {
  if (!value) return '0'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.video-stats-section {
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
  border: none;

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

.list-toolbar {
  @include toolbar-section;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  @include page-title;
}

.category-tabs {
  display: flex;
  gap: 16px;
}

.category-tab {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    color: #1677ff;
    background: #e6f4ff;
  }
}

.update-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;

  .question-icon {
    cursor: pointer;

    &:hover {
      color: #1677ff;
    }
  }
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

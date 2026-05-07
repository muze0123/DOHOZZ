<template>
  <div class="stats-section">
    <div class="section-head">
      <div class="head-left">
        <span class="section-title">绩效详情</span>
        <span class="update-time">数据更新时间：{{ updateTime }}</span>
        <el-tooltip content="点击查看数据更新说明" placement="top">
          <span class="help-icon" @click="$emit('showDataUpdateDialog')">?</span>
        </el-tooltip>
      </div>
      <div class="head-right">
        <div class="time-quick-btns">
          <span
            v-for="t in timeTabs"
            :key="t.key"
            class="quick-btn"
            :class="{ active: currentTimeType === t.key }"
            @click="handleTimeChange(t.key)"
          >{{ t.label }}</span>
        </div>
        <button class="custom-btn export-btn" @click="$emit('export')">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          <span>数据导出</span>
        </button>
        <button class="custom-btn config-btn" @click="$emit('showTableConfigDialog')">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          <span>表格设置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  updateTime: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'showDataUpdateDialog',
  'showMoreTimeDialog',
  'showTableConfigDialog',
  'export',
  'timeChange'
])

const currentTimeType = ref('7d')

const timeTabs = [
  { key: 'all', label: '全部' },
  { key: 'yesterday', label: '昨天' },
  { key: 'today', label: '今天' },
  { key: '7d', label: '近7天' },
  { key: '30d', label: '近30天' },
  { key: 'more', label: '更多' }
]

const handleTimeChange = (key) => {
  currentTimeType.value = key
  if (key === 'more') {
    emit('showMoreTimeDialog')
  }
}
</script>

<style lang="scss" scoped>
$primary: #1677ff;
$primary-text: #333333;
$secondary-text: #666666;
$text-3: #999999;
$border: #e8e8e8;
$white: #ffffff;
$bg: #f5f5f5;

.stats-section {
  background: $white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid $border;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: $primary-text;
}

.update-time {
  font-size: 12px;
  color: $secondary-text;
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f0f0f0;
  color: $text-3;
  font-size: 10px;
  cursor: pointer;
  font-weight: 600;
}

.head-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-quick-btns {
  display: flex;
  gap: 4px;
}

.quick-btn {
  padding: 4px 12px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  color: $secondary-text;
  background: $white;
  border: 1px solid $border;
  transition: all 150ms ease;

  &:hover {
    color: $primary;
    border-color: $primary;
  }

  &.active {
    background: $primary;
    border-color: $primary;
    color: #fff;
  }
}

.custom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  font-size: 14px;
  padding: 0 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 150ms ease;
  border: 1px solid $border;
  background: $white;
  color: $primary-text;
  
  &:focus {
    outline: none;
  }
}

.export-btn {
  color: $primary;
  border-color: $primary;

  &:hover {
    background: rgba($primary, 0.06);
  }
}

.config-btn {
  background: #f5f5f5;
  border: none;
  color: $secondary-text;

  &:hover {
    background: #e8e8e8;
    color: $primary-text;
  }
}
</style>

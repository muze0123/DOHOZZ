<template>
  <div class="filter-section">
    <!-- 异常监控行 -->
    <div class="filter-row">
      <div class="filter-row-label">异常监控</div>
      <div class="filter-options">
        <div
          v-for="tab in exceptionTabs"
          :key="tab.key"
          class="filter-option"
          :class="{ active: selectedExceptionTab === tab.key }"
          @click="handleTabClick('exception', tab.key)"
        >
          {{ tab.label }}
          <span v-if="exceptionBadgeMap[tab.key] > 0" class="filter-badge">
            {{ exceptionBadgeMap[tab.key] }}
          </span>
        </div>
      </div>
    </div>
    <!-- 消息提醒行 -->
    <div class="filter-row">
      <div class="filter-row-label">消息提醒</div>
      <div class="filter-options">
        <div
          v-for="tab in reminderTabs"
          :key="tab.key"
          class="filter-option"
          :class="{ active: selectedReminderTab === tab.key }"
          @click="handleTabClick('reminder', tab.key)"
        >
          {{ tab.label }}
          <span v-if="reminderBadgeMap[tab.key] > 0" class="filter-badge">
            {{ reminderBadgeMap[tab.key] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EXCEPTION_TABS, REMINDER_TABS } from '@/api/messageCenter'

const props = defineProps({
  selectedExceptionTab: { type: String, default: '' },
  selectedReminderTab: { type: String, default: '' },
  exceptionBadgeMap: { type: Object, default: () => ({}) },
  reminderBadgeMap: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:selectedExceptionTab', 'update:selectedReminderTab'])

const exceptionTabs = EXCEPTION_TABS
const reminderTabs = REMINDER_TABS

// 点击切换单选，选中一个时清除另一个分类的选中状态
function handleTabClick(type, key) {
  if (type === 'exception') {
    const newValue = props.selectedExceptionTab === key ? '' : key
    emit('update:selectedExceptionTab', newValue)
    // 清除消息提醒选中状态
    emit('update:selectedReminderTab', '')
  } else {
    const newValue = props.selectedReminderTab === key ? '' : key
    emit('update:selectedReminderTab', newValue)
    // 清除异常监控选中状态
    emit('update:selectedExceptionTab', '')
  }
}
</script>

<style scoped>
.filter-section {
  background: #fff;
  padding: 12px 24px 12px 24px;
  border-bottom: 1px solid #F0F0F0;
}

.filter-row {
  display: flex;
  align-items: center;
  height: 48px;
}

.filter-row-label {
  width: 98px;
  flex-shrink: 0;
  font-size: 13px;
  color: #8C8C8C;
  white-space: nowrap;
}

.filter-options {
  display: flex;
  align-items: center;
  flex: 1;
  height: 48px;
  overflow: hidden;
}

.filter-option {
  position: relative;
  padding: 6px 12px;
  margin-right: 8px;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
  white-space: nowrap;
}

.filter-option:hover { color: #1677FF; }

.filter-option.active {
  color: #1677FF;
  background: #E6F4FF;
  font-weight: 500;
}

.filter-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  background: #FF4D4F;
  border-radius: 7px;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>

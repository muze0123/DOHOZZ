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
          @click="$emit('update:selectedExceptionTab', tab.key)"
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
          @click="$emit('update:selectedReminderTab', tab.key)"
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

defineProps({
  selectedExceptionTab: { type: String, default: 'all' },
  selectedReminderTab: { type: String, default: 'all' },
  exceptionBadgeMap: { type: Object, default: () => ({}) },
  reminderBadgeMap: { type: Object, default: () => ({}) }
})

defineEmits(['update:selectedExceptionTab', 'update:selectedReminderTab'])

const exceptionTabs = EXCEPTION_TABS
const reminderTabs = REMINDER_TABS
</script>

<style scoped>
.filter-section {
  background: #fff;
  padding: 4px 24px 0;
  border-bottom: 1px solid #F0F0F0;
}

.filter-row {
  display: flex;
  align-items: center;
  height: 40px;
}

.filter-row-label {
  width: 56px;
  flex-shrink: 0;
  font-size: 13px;
  color: #8C8C8C;
  white-space: nowrap;
}

.filter-options {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.filter-option {
  position: relative;
  padding: 4px 0;
  margin-right: 24px;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
  white-space: nowrap;
}

.filter-option:hover { color: #1677FF; }

.filter-option.active {
  color: #1677FF;
  font-weight: 500;
  border-bottom: 2px solid #1677FF;
}

.filter-badge {
  position: absolute;
  top: -2px;
  right: -12px;
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
}
</style>

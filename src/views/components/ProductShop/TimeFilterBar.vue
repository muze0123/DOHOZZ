<template>
  <div class="time-filter-bar">
    <el-date-picker
      :model-value="dateRange"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="YYYY-MM-DD"
      size="small"
      style="width: 240px;"
      @update:model-value="handleDateChange"
    />
    <div class="quick-time-btns">
      <span
        v-for="opt in quickTimeOptions"
        :key="opt.value"
        class="quick-btn"
        :class="{ active: activeQuickTime === opt.value }"
        @click="handleQuickTime(opt.value)"
      >
        {{ opt.label }}
      </span>
    </div>
    <el-button size="small" @click="handleTutorial">教程</el-button>
  </div>
</template>

<script setup>
import { quickTimeOptions } from '@/mock/productShopAnalysis'

const props = defineProps({
  dateRange: { type: Array, default: () => [] },
  activeQuickTime: { type: String, default: 'month' }
})

const emit = defineEmits(['update:dateRange', 'update:activeQuickTime', 'date-range-change', 'quick-time-change'])

function handleDateChange(val) {
  emit('update:dateRange', val)
  emit('date-range-change', val)
}

function handleQuickTime(val) {
  emit('update:activeQuickTime', val)
  emit('quick-time-change', val)
}

function handleTutorial() {
  // TODO
}
</script>

<style scoped>
.time-filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.quick-time-btns {
  display: flex;
  gap: 8px;
}

.quick-btn {
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #e8e8e8;
}

.quick-btn.active {
  background: #ff7c3f;
  color: #fff;
}
</style>

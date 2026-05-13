// 自定义日历组件
<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { isBefore, isAfter, isSameDay, isSameMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, addMonths, subMonths, isToday, isSelected } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const props = defineProps<{
  modelValue?: Date
}>()

const emit = defineEmits<{
  'update:modelValue': [date: Date]
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const locale = zhCN

const currentMonth = computed(() => {
  return modelValue.value ? startOfMonth(modelValue.value) : startOfMonth(new Date())
})

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDays = computed(() => {
  const start = startOfWeek(currentMonth.value, { locale })
  const end = endOfWeek(endOfMonth(currentMonth.value), { locale })
  return eachDayOfInterval({ start, end })
})

function prevMonth() {
  modelValue.value = subMonths(modelValue.value || new Date(), 1)
}

function nextMonth() {
  modelValue.value = addMonths(modelValue.value || new Date(), 1)
}

function selectDate(day: Date) {
  modelValue.value = day
}

function getDayClass(day: Date) {
  const isSelectedDay = modelValue.value && isSameDay(day, modelValue.value)
  const isTodayDay = isToday(day)
  const isCurrentMonth = isSameMonth(day, currentMonth.value)

  return {
    'calendar-day': true,
    'is-selected': isSelectedDay,
    'is-today': isTodayDay,
    'is-other-month': !isCurrentMonth,
  }
}
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth" class="calendar-nav">&lt;</button>
      <span class="calendar-month">{{ format(currentMonth, 'yyyy年 M月', { locale }) }}</span>
      <button @click="nextMonth" class="calendar-nav">&gt;</button>
    </div>
    <div class="calendar-weekdays">
      <div v-for="day in weekDays" :key="day" class="calendar-weekday">
        {{ day }}
      </div>
    </div>
    <div class="calendar-grid">
      <button
        v-for="day in calendarDays"
        :key="day.toISOString()"
        :class="getDayClass(day)"
        @click="selectDate(day)"
      >
        {{ format(day, 'd') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  width: 100%;
  padding: 16px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-nav {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.calendar-month {
  font-size: 14px;
  font-weight: 500;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.calendar-weekday {
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  padding: 8px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 14px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.calendar-day:hover {
  background: #f3f4f6;
}

.calendar-day.is-selected {
  background: #0064e0;
  color: white;
}

.calendar-day.is-today {
  border: 1px solid #0064e0;
}

.calendar-day.is-other-month {
  color: #d1d5db;
}
</style>

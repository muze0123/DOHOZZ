// 自定义日期范围选择器组件
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calendar } from './Calendar'
import { format, addMonths, subMonths, isBefore, isAfter, isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const props = defineProps<{
  modelValue?: [string, string]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: [string, string]]
}>()

const locale = zhCN

const startDate = ref<Date | undefined>(props.modelValue?.[0] ? new Date(props.modelValue[0]) : undefined)
const endDate = ref<Date | undefined>(props.modelValue?.[1] ? new Date(props.modelValue[1]) : undefined)

const currentMonth = ref(startOfDay(new Date()))

function prevMonth() {
  currentMonth.value = subMonths(currentMonth.value, 1)
}

function nextMonth() {
  currentMonth.value = addMonths(currentMonth.value, 1)
}

function prevYear() {
  currentMonth.value = addMonths(currentMonth.value, -12)
}

function nextYear() {
  currentMonth.value = addMonths(currentMonth.value, 12)
}

const secondMonth = computed(() => addMonths(currentMonth.value, 1))

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

function getCalendarDays(month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1)
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)

  const startDow = start.getDay()
  const days: (Date | null)[] = []

  for (let i = 0; i < startDow; i++) {
    days.push(null)
  }

  for (let d = 1; d <= end.getDate(); d++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), d))
  }

  return days
}

const firstMonthDays = computed(() => getCalendarDays(currentMonth.value))
const secondMonthDays = computed(() => getCalendarDays(secondMonth.value))

function getDayClass(day: Date | null, month: 'first' | 'second') {
  if (!day) return 'calendar-day empty'

  const date = startOfDay(day)
  const isStart = startDate.value && isSameDay(date, startDate.value)
  const isEnd = endDate.value && isSameDay(date, endDate.value)
  const isInRange = startDate.value && endDate.value && !isStart && !isEnd && isWithinInterval(date, { start: startDate.value, end: endDate.value })
  const isToday = isSameDay(date, new Date())

  return {
    'calendar-day': true,
    'is-start': isStart,
    'is-end': isEnd,
    'is-in-range': isInRange,
    'is-today': isToday,
  }
}

function selectDate(day: Date | null) {
  if (!day) return

  const date = startOfDay(day)

  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = date
    endDate.value = undefined
  } else if (isBefore(date, startDate.value)) {
    endDate.value = startDate.value
    startDate.value = date
  } else {
    endDate.value = date
    emitValue()
  }
}

function emitValue() {
  if (startDate.value && endDate.value) {
    const start = format(startDate.value, 'yyyy-MM-dd')
    const end = format(endDate.value, 'yyyy-MM-dd')
    emit('update:modelValue', [start, end])
  }
}

watch([startDate, endDate], () => {
  if (startDate.value && !endDate.value) {
    // Just selecting start date, no emit yet
  }
})

const displayValue = computed(() => {
  if (startDate.value && endDate.value) {
    return `${format(startDate.value, 'yyyy/MM/dd')} - ${format(endDate.value, 'yyyy/MM/dd')}`
  }
  if (startDate.value) {
    return format(startDate.value, 'yyyy/MM/dd')
  }
  return ''
})
</script>

<template>
  <div class="date-range-picker">
    <div class="picker-header">
      <div class="year-nav">
        <button @click="prevYear" class="nav-btn">&lt;&lt;</button>
        <button @click="prevMonth" class="nav-btn">&lt;</button>
      </div>
      <div class="month-labels">
        <span>{{ format(currentMonth, 'yyyy年 M月', { locale }) }}</span>
        <span>{{ format(secondMonth, 'yyyy年 M月', { locale }) }}</span>
      </div>
      <div class="year-nav">
        <button @click="nextMonth" class="nav-btn">&gt;</button>
        <button @click="nextYear" class="nav-btn">&gt;&gt;</button>
      </div>
    </div>

    <div class="calendars-container">
      <div class="calendar-wrapper">
        <div class="calendar-weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
        </div>
        <div class="calendar-grid">
          <template v-for="(day, index) in firstMonthDays" :key="index">
            <button
              v-if="day"
              :class="getDayClass(day, 'first')"
              @click="selectDate(day)"
            >
              {{ day.getDate() }}
            </button>
            <div v-else class="calendar-day empty"></div>
          </template>
        </div>
      </div>

      <div class="calendar-wrapper">
        <div class="calendar-weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
        </div>
        <div class="calendar-grid">
          <template v-for="(day, index) in secondMonthDays" :key="index">
            <button
              v-if="day"
              :class="getDayClass(day, 'second')"
              @click="selectDate(day)"
            >
              {{ day.getDate() }}
            </button>
            <div v-else class="calendar-day empty"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-range-picker {
  width: 646px;
  height: 329px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.year-nav {
  display: flex;
  gap: 4px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.month-labels {
  display: flex;
  gap: 80px;
  font-size: 14px;
  font-weight: 500;
}

.calendars-container {
  display: flex;
  padding: 16px;
  gap: 32px;
}

.calendar-wrapper {
  flex: 1;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  padding: 4px 0;
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
  font-size: 13px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.calendar-day:not(.empty):hover {
  background: #f3f4f6;
}

.calendar-day.empty {
  cursor: default;
}

.calendar-day.is-start,
.calendar-day.is-end {
  background: #0064e0;
  color: white;
}

.calendar-day.is-start:hover,
.calendar-day.is-end:hover {
  background: #0052c0;
}

.calendar-day.is-in-range {
  background: #e6f4ff;
}

.calendar-day.is-today:not(.is-start):not(.is-end) {
  border: 1px solid #0064e0;
}
</style>

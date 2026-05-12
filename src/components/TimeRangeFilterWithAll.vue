<template>
  <div class="time-range-filter">
    <div class="filter-group">
      <span
        class="dropdown-trigger quick-trigger"
        :class="{ 'is-active': activeFilter === 'all' }"
        @click="handleAllClick"
      >
        全部
      </span>

      <el-dropdown trigger="click" @command="handleQuickTimeChange" @visible-change="(visible) => handleDropdownVisibleChange(visible, 'quickTime')" :class="{ 'dropdown-active': activeFilter === 'quickTime' }">
        <span class="dropdown-trigger week-trigger" :class="{ 'is-active': activeFilter === 'quickTime' }">
          {{ selectedQuickTimeLabel }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="opt in quickTimeOptions"
              :key="opt.value"
              :command="opt.value"
              :class="{ 'is-active': activeQuickTime === opt.value }"
            >
              {{ opt.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown trigger="click" @command="handleWeekChange" @visible-change="(visible) => handleDropdownVisibleChange(visible, 'week')" :class="{ 'dropdown-active': activeFilter === 'week' }">
        <span class="dropdown-trigger month-trigger" :class="{ 'is-active': activeFilter === 'week' }">
          {{ selectedWeekLabel }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="opt in weekOptions"
              :key="opt.value"
              :command="opt.value"
              :class="{ 'is-active': selectedWeek === opt.value }"
            >
              {{ opt.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown trigger="click" @command="handleMonthChange" @visible-change="(visible) => handleDropdownVisibleChange(visible, 'month')" :class="{ 'dropdown-active': activeFilter === 'month' }">
        <span class="dropdown-trigger last-trigger" :class="{ 'is-active': activeFilter === 'month' }">
          {{ selectedMonthLabel }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="opt in monthOptions"
              :key="opt.value"
              :command="opt.value"
              :class="{ 'is-active': selectedMonth === opt.value }"
            >
              {{ opt.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div ref="customWrapperRef" class="custom-trigger-wrapper" :class="{ 'dropdown-active': activeFilter === 'custom' }">
        <span
          class="dropdown-trigger custom-trigger"
          :class="{ 'is-active': activeFilter === 'custom' }"
          @click="handleCustomClick"
        >
          自定义
        </span>
        <div v-if="showCustomPicker" ref="popoverRef" class="custom-picker-popover" :class="{ 'align-center': popoverAlign === 'center', 'align-left': popoverAlign === 'left', 'align-right': popoverAlign === 'right' }">
          <DateRangePicker
            v-model="customDateRange"
            @update:modelValue="handleCustomDateChange"
          />
        </div>
      </div>
    </div>

    <div class="time-range-display">
      {{ dateRangeDisplay }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { DateRangePicker } from './ui'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      quickTime: 'all',
      week: '',
      month: '',
      customStart: '',
      customEnd: ''
    })
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 当前激活的筛选器: 'all' | 'quickTime' | 'week' | 'month' | 'custom'
const activeFilter = ref('all')

// 自定义日期范围
const customDateRange = ref(
  props.modelValue?.customStart && props.modelValue?.customEnd
    ? [props.modelValue.customStart, props.modelValue.customEnd]
    : []
)

// 是否显示自定义日期选择器
const showCustomPicker = ref(false)
const popoverRef = ref(null)
const customWrapperRef = ref(null)
const popoverAlign = ref('right')

// 点击外部关闭
function handleClickOutside(e) {
  const trigger = document.querySelector('.custom-trigger')
  if (trigger && trigger.contains(e.target)) {
    return
  }
  if (popoverRef.value && !popoverRef.value.contains(e.target)) {
    showCustomPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 近N天选项
const quickTimeOptions = [
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'last7', label: '近7天' },
  { value: 'last15', label: '近15天' },
  { value: 'last30', label: '近30天' },
  { value: 'last90', label: '近90天' }
]

// 周选项（最近5周）
const weekOptions = computed(() => {
  const options = []
  const today = new Date()
  for (let i = 0; i < 5; i++) {
    const weekEnd = new Date(today)
    weekEnd.setDate(today.getDate() - (i * 7))
    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekEnd.getDate() - 6)
    const formatDate = (d) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}/${month}/${day}`
    }
    options.push({
      value: `${formatDate(weekStart)}-${formatDate(weekEnd)}`,
      label: `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
    })
  }
  return options
})

// 月选项（本月至今 + 最近5个月）
const monthOptions = computed(() => {
  const options = []
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1

  // 本月至今
  const todayStr = `${year}/${String(month).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`
  const monthStartStr = `${year}年${month}月`
  options.push({
    value: `current_month`,
    label: `本月至今（${monthStartStr.split('年')[0]}/${String(month).padStart(2, '0')}/01 - ${todayStr.split('/').slice(1).join('/')}）`
  })

  // 最近5个月
  for (let i = 1; i <= 5; i++) {
    let targetMonth = month - i
    let targetYear = year
    if (targetMonth <= 0) {
      targetMonth += 12
      targetYear -= 1
    }
    options.push({
      value: `${targetYear}年${targetMonth}月`,
      label: `${targetYear}年${targetMonth}月`
    })
  }
  return options
})

// 当前选中的快捷时间
const activeQuickTime = ref('today')

// 快捷时间标签
const selectedQuickTimeLabel = computed(() => '近N天')

// 当前选中的周
const selectedWeek = ref('')

// 当前选中的月
const selectedMonth = ref('')

// 周标签 - 始终显示"周"
const selectedWeekLabel = computed(() => '周')

// 月标签 - 始终显示"月"
const selectedMonthLabel = computed(() => '月')

// 日期范围显示
const dateRangeDisplay = computed(() => {
  const today = new Date()
  const formatDate = (d) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }

  switch (activeFilter.value) {
    case 'all':
      return '全部时间'
    case 'quickTime':
      switch (activeQuickTime.value) {
        case 'today':
          return formatDate(today)
        case 'yesterday': {
          const y = new Date(today)
          y.setDate(today.getDate() - 1)
          return formatDate(y)
        }
        case 'last7': {
          const start = new Date(today)
          start.setDate(today.getDate() - 6)
          return `${formatDate(start)} - ${formatDate(today)}`
        }
        case 'last15': {
          const start = new Date(today)
          start.setDate(today.getDate() - 14)
          return `${formatDate(start)} - ${formatDate(today)}`
        }
        case 'last30': {
          const start = new Date(today)
          start.setDate(today.getDate() - 29)
          return `${formatDate(start)} - ${formatDate(today)}`
        }
        case 'last90': {
          const start = new Date(today)
          start.setDate(today.getDate() - 89)
          return `${formatDate(start)} - ${formatDate(today)}`
        }
        default:
          return ''
      }
    case 'week':
      return selectedWeek.value
    case 'month': {
      if (!selectedMonth.value) return ''
      if (selectedMonth.value === 'current_month') {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        return `${formatDate(firstDay)} - ${formatDate(today)}`
      }
      const match = selectedMonth.value.match(/(\d{4})年(\d{1,2})月/)
      if (match) {
        const y = parseInt(match[1])
        const m = parseInt(match[2])
        const firstDay = new Date(y, m - 1, 1)
        const lastDay = new Date(y, m, 0)
        return `${formatDate(firstDay)} - ${formatDate(lastDay)}`
      }
      return selectedMonth.value
    }
    case 'custom':
      if (customDateRange.value && customDateRange.value.length === 2) {
        const fmt = (d) => d.replace(/-/g, '/')
        return `${fmt(customDateRange.value[0])} - ${fmt(customDateRange.value[1])}`
      }
      return ''
    default:
      return ''
  }
})

// 处理全部点击
function handleAllClick() {
  activeFilter.value = 'all'
  emitChange()
}

// 处理快捷时间变化
function handleQuickTimeChange(value) {
  activeQuickTime.value = value
  activeFilter.value = 'quickTime'
  emitChange()
}

// 处理下拉菜单展开/收起
function handleDropdownVisibleChange(visible, type) {
  if (visible) {
    // 下拉菜单展开时，设置对应的筛选器激活状态和默认值
    if (type === 'quickTime') {
      activeQuickTime.value = 'today'
      activeFilter.value = 'quickTime'
    } else if (type === 'week') {
      selectedWeek.value = weekOptions.value[0]?.value || ''
      activeFilter.value = 'week'
    } else if (type === 'month') {
      selectedMonth.value = monthOptions.value[0]?.value || ''
      activeFilter.value = 'month'
    }
  }
}

// 处理周变化
function handleWeekChange(value) {
  selectedWeek.value = value
  activeFilter.value = 'week'
  emitChange()
}

// 处理月变化
function handleMonthChange(value) {
  selectedMonth.value = value
  activeFilter.value = 'month'
  emitChange()
}

// 预计算日期面板对齐方式
function computePopoverAlign() {
  const wrapper = customWrapperRef.value
  if (!wrapper) return
  const mainContent = document.querySelector('.main-content')
  const mainRect = mainContent?.getBoundingClientRect()
  const wrapperRect = wrapper.getBoundingClientRect()
  const popoverWidth = 646

  if (mainRect) {
    const centerLeft = wrapperRect.left + wrapperRect.width / 2 - popoverWidth / 2
    const centerRight = wrapperRect.left + wrapperRect.width / 2 + popoverWidth / 2
    if (centerLeft >= mainRect.left && centerRight <= mainRect.right) {
      popoverAlign.value = 'center'
      return
    }
    const rightLeft = wrapperRect.right - popoverWidth
    if (rightLeft >= mainRect.left) {
      popoverAlign.value = 'right'
      return
    }
  }
  popoverAlign.value = 'left'
}

// 处理自定义点击
function handleCustomClick() {
  activeFilter.value = 'custom'
  // 设置默认日期为近7天
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - 6)
  const formatDate = (d) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }
  customDateRange.value = [formatDate(start), formatDate(today)]
  if (!showCustomPicker.value) {
    computePopoverAlign()
  }
  showCustomPicker.value = !showCustomPicker.value
}

// 处理自定义日期变化
function handleCustomDateChange(val) {
  if (val && val.length === 2) {
    customDateRange.value = val
    showCustomPicker.value = false
    emitChange()
  }
}

// 发送变化事件
function emitChange() {
  const result = {
    quickTime: activeQuickTime.value,
    week: '',
    month: '',
    customStart: customDateRange.value[0] || '',
    customEnd: customDateRange.value[1] || ''
  }
  emit('update:modelValue', result)
  emit('change', result)
}

// 监听外部值变化
watch(() => props.modelValue, (val) => {
  if (val) {
    activeQuickTime.value = val.quickTime || 'today'
  }
}, { deep: true })
</script>

<style scoped>
.time-range-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0;
}

.filter-group > * {
  position: relative;
  z-index: 1;
}

.filter-group > .dropdown-active {
  z-index: 10;
}

.filter-group > *:has(.dropdown-trigger:hover) {
  z-index: 2;
}

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  padding: 0;
  height: 32px;
  font-size: 13px;
  color: #333;
  background: #fff;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #0064e0;
    color: #0064e0;
    position: relative;
    z-index: 2;
  }

  &.is-active {
    background: #e6f4ff;
    color: #0064e0;
    border-color: #0064e0;
    position: relative;
    z-index: 10;
  }
}

.quick-trigger {
  border-radius: 4px 0 0 4px;
}

.week-trigger {
  margin-left: -1px;
}

.month-trigger {
  margin-left: -1px;
}

.last-trigger {
  margin-left: -1px;
}

.custom-trigger-wrapper {
  position: relative;
  display: inline-flex;
}

.custom-trigger {
  margin-left: -1px;
  border-radius: 0 4px 4px 0;
  width: 62px;
}

.custom-picker-popover {
  position: absolute;
  top: 100%;
  z-index: 1000;
  margin-top: 4px;
  max-width: min(646px, calc(100vw - 32px));
  overflow: visible;

  &.align-center {
    left: 50%;
    transform: translateX(-50%);
  }

  &.align-right {
    right: 0;
  }

  &.align-left {
    left: 0;
  }
}

.time-range-display {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: #0064e0;
  background: #e6f4ff;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f0f9ff;
}

:deep(.el-dropdown-menu) {
  padding: 0 6px;
  width: auto !important;
  min-width: 0;
}

:deep(.el-dropdown-menu__item) {
  padding: 0 12px;
  font-size: 14px;
  width: auto;
  min-width: 144px;
  height: 40px;
  line-height: 40px;
  margin: 0;
  white-space: nowrap;
}
</style>

# 绩效管理页面 Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在内容种草-内容合作下开发绩效管理页面，展示员工跟进达人、建联达人、合作达人、交付达人等指标。

**Architecture:** 新建 `PerformanceManagement.vue` 页面组件，复用 CollaborationLive 的三段式组件结构（FilterSection + StatsSection + TableSection），使用 Mock 数据。各弹窗组件独立文件，Dashboard 中通过 `currentScenario === 'seeding'` 条件渲染新页面。

**Tech Stack:** Vue 3 (Composition API + `<script setup>`), Element Plus, Tailwind CSS, SCSS

---

## 文件结构

```
src/views/
  PerformanceManagement.vue                    # 新建 - 主页面
  PerformanceManagement/
    components/
      PerformanceMFilterSection.vue           # 新建 - 筛选区组件
      PerformanceMStatsSection.vue             # 新建 - 数据统计区组件
      PerformanceMTableSection.vue             # 新建 - 表格区域组件
    dialogs/
      PerformanceMDataUpdateDialog.vue         # 新建 - 数据更新说明弹窗
      PerformanceMViewReadDialog.vue           # 新建 - 播放量/阅读量说明弹窗
      PerformanceMTableConfigDialog.vue        # 新建 - 表格设置弹窗
      PerformanceMMoreTimeDialog.vue          # 新建 - 更多时间选择弹窗
  Dashboard.vue                                # 修改 - 添加条件渲染

src/api/
  performanceManagement.js                     # 新建 - API 模块
```

---

## Task 1: 创建 API 模块

**Files:**
- Create: `src/api/performanceManagement.js`

- [ ] **Step 1: 创建 API 模块文件**

```javascript
// src/api/performanceManagement.js
import request from './request'

// 获取绩效列表
export function getPerformanceList(params) {
  return request({
    url: '/api/performance/list',
    method: 'GET',
    params
  })
}

// 获取部门列表
export function getDepartmentList() {
  return request({
    url: '/api/department/list',
    method: 'GET'
  })
}

// 获取媒介列表
export function getMediumList() {
  return request({
    url: '/api/medium/list',
    method: 'GET'
  })
}

// 导出绩效数据
export function exportPerformance(data) {
  return request({
    url: '/api/performance/export',
    method: 'POST',
    data
  })
}
```

- [ ] **Step 2: 在 api/index.js 中注册**

修改 `src/api/index.js`，添加：
```javascript
export * from './performanceManagement'
```

- [ ] **Step 3: Commit**

```bash
git add src/api/performanceManagement.js src/api/index.js
git commit -m "feat(api): 添加绩效管理 API 模块"
```

---

## Task 2: 创建筛选区组件

**Files:**
- Create: `src/views/PerformanceManagement/components/PerformanceMFilterSection.vue`

- [ ] **Step 1: 创建筛选区组件**

```vue
<template>
  <div class="filter-section">
    <!-- 平台Tab -->
    <div class="platform-tabs-bar">
      <div class="platform-tabs">
        <div
          v-for="p in platformTabs"
          :key="p.id"
          class="platform-tab"
          :class="{ active: modelValue.platform === p.id }"
          @click="handlePlatformChange(p.id)"
        >
          <div class="platform-icon" v-html="p.icon"></div>
          <span>{{ p.name }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选条件区块 -->
    <div class="filter-toolbar">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">全部部门</span>
          <el-select
            v-model="localDepartment"
            placeholder="全部部门"
            filterable
            clearable
            size="small"
            class="filter-select"
            @change="handleFilterChange"
          >
            <el-option label="全部部门" value="" />
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">全部媒介</span>
          <el-select
            v-model="localMedium"
            placeholder="全部媒介"
            filterable
            clearable
            size="small"
            class="filter-select"
            @change="handleFilterChange"
          >
            <el-option label="全部媒介" value="" />
            <el-option
              v-for="medium in mediumList"
              :key="medium.id"
              :label="medium.name"
              :value="medium.id"
            />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      platform: 'all',
      department: '',
      medium: ''
    })
  },
  departmentList: {
    type: Array,
    default: () => []
  },
  mediumList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const localDepartment = ref(props.modelValue.department)
const localMedium = ref(props.modelValue.medium)

watch(() => props.modelValue, (val) => {
  localDepartment.value = val.department
  localMedium.value = val.medium
}, { deep: true })

const platformTabs = [
  {
    id: 'all',
    name: '全部',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>'
  },
  {
    id: 'douyin',
    name: '抖音',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>'
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>'
  }
]

const handlePlatformChange = (platform) => {
  emit('update:modelValue', { ...props.modelValue, platform })
  emit('change', props.modelValue)
}

const handleFilterChange = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    department: localDepartment.value,
    medium: localMedium.value
  })
  emit('change', props.modelValue)
}
</script>

<style lang="scss" scoped>
$primary: #1677ff;
$primary-text: #333333;
$secondary-text: #666666;
$border: #e8e8e8;
$white: #ffffff;
$bg: #f5f5f5;
$radius: 8px;

.filter-section {
  margin-bottom: 16px;
}

.platform-tabs-bar {
  background: $white;
  border: 1px solid $border;
  border-bottom: none;
  border-radius: $radius $radius 0 0;
  padding: 0 16px;
}

.platform-tabs {
  display: flex;
  gap: 24px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: $secondary-text;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 150ms ease;
  position: relative;
  top: 1px;

  .platform-icon {
    display: flex;
    align-items: center;
  }

  &:hover {
    color: $primary-text;
  }

  &.active {
    color: $primary;
    font-weight: 500;
    border-bottom-color: $primary;
  }
}

.filter-toolbar {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid $border;
  border-top: none;
  border-radius: 0 0 $radius $radius;
  background: $white;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.filter-label {
  font-size: 13px;
  color: $primary-text;
  font-weight: 500;
  white-space: nowrap;
}

.filter-select {
  width: 160px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/PerformanceManagement/components/PerformanceMFilterSection.vue
git commit -m "feat: 创建绩效管理筛选区组件"
```

---

## Task 3: 创建数据统计区组件

**Files:**
- Create: `src/views/PerformanceManagement/components/PerformanceMStatsSection.vue`

- [ ] **Step 1: 创建数据统计区组件**

```vue
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
        <el-button
          v-if="currentTimeType === 'more'"
          size="small"
          class="export-btn"
          @click="$emit('showMoreTimeDialog')"
        >
          更多
        </el-button>
        <el-button size="small" class="export-btn" @click="$emit('export')">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 4px">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          数据导出
        </el-button>
        <el-button size="small" class="config-btn" @click="$emit('showTableConfigDialog')">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 4px">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          表格设置
        </el-button>
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

defineEmits([
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
```

- [ ] **Step 2: Commit**

```bash
git add src/views/PerformanceManagement/components/PerformanceMStatsSection.vue
git commit -m "feat: 创建绩效管理数据统计区组件"
```

---

## Task 4: 创建表格区域组件

**Files:**
- Create: `src/views/PerformanceManagement/components/PerformanceMTableSection.vue`

- [ ] **Step 1: 创建表格区域组件**

```vue
<template>
  <div class="table-section">
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :class="{ sortable: col.sortable }"
              @click="col.sortable && handleSort(col.key)"
            >
              {{ col.label }}
              <span v-if="col.key === 'viewReadCount'" class="help-icon-inline" @click.stop="$emit('showViewReadDialog')">?</span>
              <span v-if="col.sortable" class="sort-arrows">{{ getSortIcon(col.key) }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- 合计行 -->
          <tr class="total-row">
            <td>合计</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>{{ totalData.cooperationContentCount || 0 }}</td>
            <td>{{ totalData.viewReadCount || 0 }}</td>
            <td>{{ totalData.interactionCount || 0 }}</td>
            <td>{{ totalData.likeCount || 0 }}</td>
          </tr>
          <!-- 数据行 -->
          <tr
            v-for="(row, index) in tableData"
            :key="index"
            class="data-row"
          >
            <td class="employee-cell">
              <div class="employee-avatar" :style="{ background: '#1677ff' }">
                {{ row.employeeSurname || row.employeeName?.charAt(0) || '?' }}
              </div>
              <div class="employee-info">
                <span class="employee-name">{{ row.employeeName }}</span>
                <span class="employee-dept">{{ row.departmentName }}</span>
              </div>
            </td>
            <td class="clickable-cell" @click="$emit('showComingSoon')">{{ row.followStreamerCount || 0 }}</td>
            <td class="clickable-cell" @click="$emit('showComingSoon')">{{ row.connectStreamerCount || 0 }}</td>
            <td class="clickable-cell" @click="$emit('showComingSoon')">{{ row.cooperateStreamerCount || 0 }}</td>
            <td class="clickable-cell" @click="$emit('showComingSoon')">{{ row.deliverStreamerCount || 0 }}</td>
            <td class="clickable-cell" @click="$emit('showComingSoon')">{{ row.cooperationContentCount || 0 }}</td>
            <td class="clickable-cell" @click="$emit('showComingSoon')">{{ row.viewReadCount || 0 }}</td>
            <td class="clickable-cell" @click="$emit('showComingSoon')">{{ row.interactionCount || 0 }}</td>
            <td class="clickable-cell" @click="$emit('showComingSoon')">{{ row.likeCount || 0 }}</td>
          </tr>
          <!-- 无数据 -->
          <tr v-if="!tableData || tableData.length === 0">
            <td colspan="9" class="empty-cell">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination-bar">
      <span class="page-info">共 {{ total }} 条记录 第 {{ currentPage }}/{{ totalPages }} 页</span>
      <div class="page-controls">
        <el-select v-model="localPageSize" size="small" class="page-size-select" @change="handlePageSizeChange">
          <el-option :label="'10条/页'" :value="10" />
          <el-option :label="'20条/页'" :value="20" />
          <el-option :label="'50条/页'" :value="50" />
          <el-option :label="'100条/页'" :value="100" />
        </el-select>
        <div class="page-btns">
          <span class="page-btn" :class="{ disabled: currentPage <= 1 }" @click="prevPage">上一页</span>
          <span
            v-for="p in visiblePages"
            :key="p"
            class="page-btn"
            :class="{ active: currentPage === p }"
            @click="goToPage(p)"
          >{{ p }}</span>
          <span class="page-btn" :class="{ disabled: currentPage >= totalPages }" @click="nextPage">下一页</span>
        </div>
        <div class="page-jump">
          <span>跳至</span>
          <input
            type="number"
            class="page-input"
            v-model="jumpPage"
            min="1"
            :max="totalPages"
            @keyup.enter="handlePageJump"
          />
          <span>页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  visibleColumns: {
    type: Array,
    default: () => []
  },
  totalData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'showViewReadDialog',
  'showComingSoon',
  'pageChange',
  'pageSizeChange',
  'sort'
])

const localPageSize = ref(props.pageSize)
const jumpPage = ref(1)
const sortField = ref('')
const sortDir = ref('desc')

watch(() => props.pageSize, (val) => {
  localPageSize.value = val
})

const totalPages = computed(() => Math.ceil(props.total / localPageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const getSortIcon = (field) => {
  if (sortField.value !== field) return '↕'
  return sortDir.value === 'desc' ? '↓' : '↑'
}

const handleSort = (field) => {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortField.value = field
    sortDir.value = 'desc'
  }
  emit('sort', { field: sortField.value, dir: sortDir.value })
}

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('pageChange', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('pageChange', props.currentPage + 1)
  }
}

const goToPage = (page) => {
  emit('pageChange', page)
}

const handlePageSizeChange = (size) => {
  emit('pageSizeChange', size)
}

const handlePageJump = () => {
  const page = parseInt(jumpPage.value)
  if (page < 1 || page > totalPages.value) {
    return
  }
  emit('pageChange', page)
}
</script>

<style lang="scss" scoped>
$primary: #1677ff;
$primary-text: #333333;
$secondary-text: #666666;
$text-3: #999999;
$border: #e8e8e8;
$white: #ffffff;
$bg: #fafafa;

.table-section {
  background: $white;
  border-radius: 8px;
  border: 1px solid $border;
}

.data-table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 900px;

  th {
    text-align: left;
    padding: 12px 16px;
    background: $bg;
    color: $secondary-text;
    font-weight: 500;
    border-bottom: 1px solid $border;
    white-space: nowrap;

    &.sortable {
      cursor: pointer;
      user-select: none;
      &:hover {
        color: $primary;
      }
    }
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;
    color: $secondary-text;
  }

  tr:hover td {
    background: #fafafa;
  }
}

.total-row td {
  background: $white;
  font-weight: 600;
  color: $primary-text;
}

.employee-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.employee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.employee-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.employee-name {
  font-size: 13px;
  font-weight: 500;
  color: $primary-text;
}

.employee-dept {
  font-size: 12px;
  color: $secondary-text;
}

.clickable-cell {
  cursor: pointer;
  &:hover {
    color: $primary;
  }
}

.empty-cell {
  text-align: center;
  color: $text-3;
  padding: 48px 0;
}

.help-icon-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f0f0f0;
  color: $text-3;
  font-size: 9px;
  cursor: pointer;
  margin-left: 4px;
  font-weight: 600;
  vertical-align: middle;
}

.sort-arrows {
  font-size: 11px;
  color: $text-3;
  margin-left: 2px;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
}

.page-info {
  font-size: 12px;
  color: $text-3;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-size-select {
  width: 100px;
}

.page-btns {
  display: flex;
  gap: 4px;
}

.page-btn {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $border;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  color: $secondary-text;
  transition: all 150ms ease;

  &:hover:not(.disabled) {
    border-color: $primary;
    color: $primary;
  }

  &.active {
    background: $primary;
    border-color: $primary;
    color: #fff;
  }

  &.disabled {
    color: #d9d9d9;
    cursor: not-allowed;
  }
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: $secondary-text;
}

.page-input {
  width: 48px;
  height: 28px;
  border: 1px solid $border;
  border-radius: 4px;
  text-align: center;
  outline: none;

  &:focus {
    border-color: $primary;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/views/PerformanceManagement/components/PerformanceMTableSection.vue
git commit -m "feat: 创建绩效管理表格区域组件"
```

---

## Task 5: 创建弹窗组件

**Files:**
- Create: `src/views/PerformanceManagement/dialogs/PerformanceMDataUpdateDialog.vue`
- Create: `src/views/PerformanceManagement/dialogs/PerformanceMViewReadDialog.vue`
- Create: `src/views/PerformanceManagement/dialogs/PerformanceMTableConfigDialog.vue`
- Create: `src/views/PerformanceManagement/dialogs/PerformanceMMoreTimeDialog.vue`

- [ ] **Step 1: 创建数据更新说明弹窗**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="数据更新说明"
    width="480px"
    :close-on-click-modal="false"
  >
    <div class="dialog-content">
      <div class="section">
        <div class="section-title">数据更新时间说明：</div>
        <ul class="section-list">
          <li>员工绩效数据每日凌晨自动更新一次</li>
          <li>数据更新完成后，更新时间会同步更新</li>
          <li>如遇数据更新延迟，请联系技术支持</li>
        </ul>
      </div>
      <div class="section">
        <div class="section-title">注意事项：</div>
        <ul class="section-list">
          <li>绩效数据仅供参考，不作为唯一考核标准</li>
          <li>数据可能存在1-2天的延迟</li>
        </ul>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="visible = false">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 8px 0;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.section-list {
  padding-left: 20px;
  margin: 0;

  li {
    font-size: 13px;
    color: #666;
    line-height: 1.8;
  }
}
</style>
```

- [ ] **Step 2: 创建播放量/阅读量说明弹窗**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="播放量/阅读量说明"
    width="480px"
    :close-on-click-modal="false"
  >
    <div class="dialog-content">
      <div class="section">
        <div class="section-title">播放量/阅读量说明：</div>
        <ul class="section-list">
          <li>播放量：抖音平台视频的播放次数</li>
          <li>阅读量：小红书平台笔记的阅读次数</li>
        </ul>
      </div>
      <div class="section">
        <div class="section-title">计算方式：</div>
        <ul class="section-list">
          <li>播放量 = 所有合作内容的播放次数总和</li>
          <li>阅读量 = 所有合作内容的阅读次数总和</li>
        </ul>
      </div>
      <div class="section">
        <div class="section-title">注意事项：</div>
        <ul class="section-list">
          <li>数据每日更新一次</li>
          <li>数据可能存在1-2天的延迟</li>
        </ul>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="visible = false">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 8px 0;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.section-list {
  padding-left: 20px;
  margin: 0;

  li {
    font-size: 13px;
    color: #666;
    line-height: 1.8;
  }
}
</style>
```

- [ ] **Step 3: 创建表格设置弹窗**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="表格设置"
    width="520px"
    :close-on-click-modal="false"
  >
    <div class="config-content">
      <el-checkbox-group v-model="selectedColumns">
        <div class="checkbox-grid">
          <el-checkbox
            v-for="col in allColumns"
            :key="col.key"
            :label="col.key"
            :disabled="selectedColumns.length <= 1 && selectedColumns.includes(col.key)"
          >
            {{ col.label }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  visibleColumns: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const allColumns = [
  { key: 'employee', label: '媒介/部门' },
  { key: 'followStreamerCount', label: '跟进达人' },
  { key: 'connectStreamerCount', label: '建联达人' },
  { key: 'cooperateStreamerCount', label: '合作达人' },
  { key: 'deliverStreamerCount', label: '交付达人' },
  { key: 'cooperationContentCount', label: '合作内容数' },
  { key: 'viewReadCount', label: '播放量/阅读量' },
  { key: 'interactionCount', label: '互动数' },
  { key: 'likeCount', label: '点赞' }
]

const selectedColumns = ref([])

watch(() => props.visibleColumns, (val) => {
  selectedColumns.value = val.map(c => c.key)
}, { immediate: true, deep: true })

const handleCancel = () => {
  selectedColumns.value = props.visibleColumns.map(c => c.key)
  visible.value = false
}

const handleConfirm = () => {
  const confirmed = selectedColumns.value.map(key => allColumns.find(c => c.key === key))
  emit('confirm', confirmed)
  visible.value = false
}
</script>

<style lang="scss" scoped>
.config-content {
  padding: 16px 0;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
```

- [ ] **Step 4: 创建更多时间选择弹窗**

```vue
<template>
  <el-dialog
    v-model="visible"
    title="选择时间范围"
    width="420px"
    :close-on-click-modal="false"
  >
    <div class="dialog-content">
      <div class="section">
        <div class="section-title">时间维度：</div>
        <div class="dimension-btns">
          <span
            v-for="dim in dimensions"
            :key="dim.key"
            class="dim-btn"
            :class="{ active: selectedDimension === dim.key }"
            @click="selectedDimension = dim.key"
          >
            {{ dim.label }}
          </span>
        </div>
      </div>
      <div class="section" v-if="selectedDimension === 'custom'">
        <div class="section-title">自定义时间范围：</div>
        <div class="date-range">
          <el-date-picker
            v-model="customRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            size="small"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedDimension = ref('all')
const customRange = ref([])

const dimensions = [
  { key: 'all', label: '全部' },
  { key: 'naturalDay', label: '自然日' },
  { key: 'naturalWeek', label: '自然周' },
  { key: 'naturalMonth', label: '自然月' },
  { key: 'custom', label: '自定义' }
]

const handleConfirm = () => {
  emit('confirm', {
    dimension: selectedDimension.value,
    customRange: customRange.value
  })
  visible.value = false
}
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 8px 0;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.dimension-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dim-btn {
  padding: 6px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 150ms ease;

  &:hover {
    border-color: #1677ff;
    color: #1677ff;
  }

  &.active {
    background: #1677ff;
    border-color: #1677ff;
    color: #fff;
  }
}

.date-range {
  display: flex;
  gap: 12px;
}
</style>
```

- [ ] **Step 5: Commit**

```bash
git add src/views/PerformanceManagement/dialogs/
git commit -m "feat: 创建绩效管理弹窗组件集"
```

---

## Task 6: 创建主页面并集成

**Files:**
- Create: `src/views/PerformanceManagement.vue`
- Modify: `src/views/Dashboard.vue` (添加 import 和条件渲染)

- [ ] **Step 1: 创建主页面**

```vue
<template>
  <div class="performance-management-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-filter"></div>
      <div class="skeleton-stats"></div>
      <div class="skeleton-table"></div>
    </div>

    <!-- 主内容 -->
    <template v-else>
      <!-- 筛选区 -->
      <PerformanceMFilterSection
        v-model="filters"
        :department-list="departmentList"
        :medium-list="mediumList"
        @change="handleFilterChange"
      />

      <!-- 数据统计区 -->
      <PerformanceMStatsSection
        :update-time="updateTime"
        @show-data-update-dialog="showDataUpdateDialog = true"
        @show-more-time-dialog="showMoreTimeDialog = true"
        @show-table-config-dialog="showTableConfigDialog = true"
        @export="handleExport"
      />

      <!-- 表格区域 -->
      <PerformanceMTableSection
        :table-data="tableData"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :visible-columns="visibleColumns"
        :total-data="totalData"
        @show-view-read-dialog="showViewReadDialog = true"
        @show-coming-soon="showComingSoonTip"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />

      <!-- 弹窗 -->
      <PerformanceMDataUpdateDialog v-model="showDataUpdateDialog" />
      <PerformanceMViewReadDialog v-model="showViewReadDialog" />
      <PerformanceMTableConfigDialog
        v-model="showTableConfigDialog"
        :visible-columns="visibleColumns"
        @confirm="handleTableConfigConfirm"
      />
      <PerformanceMMoreTimeDialog
        v-model="showMoreTimeDialog"
        @confirm="handleMoreTimeConfirm"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PerformanceMFilterSection from './PerformanceManagement/components/PerformanceMFilterSection.vue'
import PerformanceMStatsSection from './PerformanceManagement/components/PerformanceMStatsSection.vue'
import PerformanceMTableSection from './PerformanceManagement/components/PerformanceMTableSection.vue'
import PerformanceMDataUpdateDialog from './PerformanceManagement/dialogs/PerformanceMDataUpdateDialog.vue'
import PerformanceMViewReadDialog from './PerformanceManagement/dialogs/PerformanceMViewReadDialog.vue'
import PerformanceMTableConfigDialog from './PerformanceManagement/dialogs/PerformanceMTableConfigDialog.vue'
import PerformanceMMoreTimeDialog from './PerformanceManagement/dialogs/PerformanceMMoreTimeDialog.vue'

// Mock 数据
const mockDepartmentList = [
  { id: 'dept1', name: '市场部' },
  { id: 'dept2', name: '销售部' },
  { id: 'dept3', name: '运营部' },
  { id: 'dept4', name: '商务部' }
]

const mockMediumList = [
  { id: 'med1', name: '媒介A' },
  { id: 'med2', name: '媒介B' },
  { id: 'med3', name: '媒介C' }
]

const mockTableData = [
  {
    employeeId: 'e1',
    employeeName: '张三',
    employeeSurname: '张',
    departmentId: 'dept1',
    departmentName: '市场部',
    followStreamerCount: 120,
    connectStreamerCount: 85,
    cooperateStreamerCount: 45,
    deliverStreamerCount: 32,
    cooperationContentCount: 156,
    viewReadCount: 1256800,
    interactionCount: 45800,
    likeCount: 28600
  },
  {
    employeeId: 'e2',
    employeeName: '李四',
    employeeSurname: '李',
    departmentId: 'dept1',
    departmentName: '市场部',
    followStreamerCount: 98,
    connectStreamerCount: 72,
    cooperateStreamerCount: 38,
    deliverStreamerCount: 25,
    cooperationContentCount: 120,
    viewReadCount: 980500,
    interactionCount: 32600,
    likeCount: 19800
  },
  {
    employeeId: 'e3',
    employeeName: '王五',
    employeeSurname: '王',
    departmentId: 'dept2',
    departmentName: '销售部',
    followStreamerCount: 150,
    connectStreamerCount: 110,
    cooperateStreamerCount: 65,
    deliverStreamerCount: 48,
    cooperationContentCount: 210,
    viewReadCount: 1850000,
    interactionCount: 68500,
    likeCount: 42500
  }
]

// 状态
const loading = ref(true)
const filters = reactive({
  platform: 'all',
  department: '',
  medium: ''
})
const departmentList = ref(mockDepartmentList)
const mediumList = ref(mockMediumList)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 弹窗状态
const showDataUpdateDialog = ref(false)
const showViewReadDialog = ref(false)
const showTableConfigDialog = ref(false)
const showMoreTimeDialog = ref(false)

// 表格列配置
const allColumns = [
  { key: 'employee', label: '媒介/部门', sortable: false },
  { key: 'followStreamerCount', label: '跟进达人', sortable: true },
  { key: 'connectStreamerCount', label: '建联达人', sortable: true },
  { key: 'cooperateStreamerCount', label: '合作达人', sortable: true },
  { key: 'deliverStreamerCount', label: '交付达人', sortable: true },
  { key: 'cooperationContentCount', label: '合作内容数', sortable: true },
  { key: 'viewReadCount', label: '播放量/阅读量', sortable: true },
  { key: 'interactionCount', label: '互动数', sortable: true },
  { key: 'likeCount', label: '点赞', sortable: true }
]
const visibleColumns = ref([...allColumns])

const totalData = computed(() => {
  return {
    cooperationContentCount: tableData.value.reduce((sum, r) => sum + (r.cooperationContentCount || 0), 0),
    viewReadCount: tableData.value.reduce((sum, r) => sum + (r.viewReadCount || 0), 0),
    interactionCount: tableData.value.reduce((sum, r) => sum + (r.interactionCount || 0), 0),
    likeCount: tableData.value.reduce((sum, r) => sum + (r.likeCount || 0), 0)
  }
})

const updateTime = ref('')

// 生命周期
onMounted(() => {
  fetchData()
  updateTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
})

// 数据获取
const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    tableData.value = mockTableData
    pagination.total = mockTableData.length
  } finally {
    loading.value = false
  }
}

// 事件处理
const handleFilterChange = () => {
  pagination.page = 1
  fetchData()
}

const handlePageChange = (page) => {
  pagination.page = page
  fetchData()
}

const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const showComingSoonTip = () => {
  ElMessage.info('功能即将上线')
}

const handleTableConfigConfirm = (columns) => {
  visibleColumns.value = columns
}

const handleMoreTimeConfirm = (params) => {
  ElMessage.success('时间范围已更新')
}
</script>

<style lang="scss" scoped>
.performance-management-page {
  padding: 16px;
  min-height: 100%;
  background: #f5f6f7;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-filter {
  height: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-stats {
  height: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-table {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

- [ ] **Step 2: 修改 Dashboard.vue 添加导入和条件渲染**

修改 `src/views/Dashboard.vue`:

1. 在 import 区添加：
```javascript
import PerformanceManagement from './PerformanceManagement.vue'
```

2. 修改主内容区渲染条件，将原来的：
```vue
<!-- 绩效管理页面 -->
<Performance v-else-if="activeSidebarMenu === '绩效管理'" />
```
改为：
```vue
<!-- 绩效管理页面（种草场景） -->
<PerformanceManagement v-else-if="activeSidebarMenu === '绩效管理' && currentScenario === 'seeding'" />
<!-- 绩效管理页面（带货场景） -->
<Performance v-else-if="activeSidebarMenu === '绩效管理' && currentScenario === 'ecommerce'" />
```

注意：需要将 PerformanceManagement 的 import 放在 Performance import 之后，否则会冲突。

- [ ] **Step 3: Commit**

```bash
git add src/views/PerformanceManagement.vue src/views/Dashboard.vue
git commit -m "feat: 创建绩效管理主页面并集成到Dashboard"
```

---

## 自检清单

**Spec Coverage:**
- [x] 平台Tab（全部/抖音/小红书）
- [x] 部门/媒介筛选下拉
- [x] 绩效详情标题 + 数据更新时间 + 问号
- [x] 时间标签（全部/昨天/今天/近7天/近30天/更多）
- [x] 数据导出按钮（Mock）
- [x] 表格设置按钮
- [x] 表格（媒介/部门 + 8个数据列 + 合计行）
- [x] 分页（10/20/50/100条每页）
- [x] 数据更新说明弹窗
- [x] 播放量/阅读量说明弹窗
- [x] 表格设置弹窗（列配置）
- [x] 更多时间选择弹窗
- [x] 详情点击弹窗提示"功能即将上线"
- [x] Dashboard 菜单集成

**Placeholder Scan:** 无 TBD/TODO/placeholder，所有步骤均已填入实际代码。

**Type Consistency:** 列 key 均在 allColumns 和 PerformanceMTableSection 中保持一致。

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

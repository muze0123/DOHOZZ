// 分页组件-带分页大小选择器和总条数显示
<template>
  <div class="pagination">
    <button class="pagination-btn prev" @click="handlePrev" :disabled="currentPage <= 1">‹</button>
    <div class="page-numbers">
      <button
        v-for="page in displayedPages"
        :key="page"
        class="page-btn"
        :class="{ active: currentPage === page }"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
      <span v-if="showEllipsisBefore" class="ellipsis">...</span>
      <button
        v-if="showLastPage"
        class="page-btn"
        @click="handlePageChange(totalPages)"
      >
        {{ totalPages }}
      </button>
    </div>
    <button class="pagination-btn next" @click="handleNext" :disabled="currentPage >= totalPages">›</button>
    <span class="total-info">共 {{ total }} 条</span>
    <el-select v-model="pageSize" class="page-size-select" size="small" @change="handleSizeChange">
      <el-option
        v-for="size in pageSizes"
        :key="size"
        :label="`${size}条/页`"
        :value="size"
      />
    </el-select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ page: 1, pageSize: 10 })
  },
  total: {
    type: Number,
    default: 0
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 40, 50]
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const currentPage = computed({
  get: () => props.modelValue.page,
  set: (val) => {
    emit('update:modelValue', { ...props.modelValue, page: val })
    emit('change', { ...props.modelValue, page: val })
  }
})

const pageSize = computed({
  get: () => props.modelValue.pageSize,
  set: (val) => {
    emit('update:modelValue', { ...props.modelValue, pageSize: val, page: 1 })
    emit('change', { ...props.modelValue, pageSize: val, page: 1 })
  }
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.total / props.modelValue.pageSize))
})

const displayedPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = props.modelValue.page
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (current >= total - 3) {
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(current - 2)
      pages.push(current - 1)
      pages.push(current)
      pages.push(current + 1)
      pages.push(current + 2)
    }
  }
  
  return pages
})

const showEllipsisBefore = computed(() => {
  const total = totalPages.value
  const current = props.modelValue.page
  
  if (total <= 7) return false
  
  if (current >= total - 3) {
    return displayedPages.value[0] > 1
  }
  
  return current > 4
})

const showLastPage = computed(() => {
  const total = totalPages.value
  const current = props.modelValue.page
  
  if (total <= 7) return false
  
  if (current <= 4) {
    return true
  }
  
  return displayedPages.value[displayedPages.value.length - 1] < total
})

const handlePrev = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNext = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSizeChange = (val) => {
  pageSize.value = val
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  padding: 16px 0;
}

.pagination-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #4E5969;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #1890ff;
    color: #1890ff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #4E5969;
  transition: all 0.2s;

  &:hover:not(.active) {
    border-color: #1890ff;
    color: #1890ff;
  }

  &.active {
    background: #1890ff;
    color: #fff;
    border-color: #1890ff;
  }
}

.ellipsis {
  font-size: 14px;
  color: #4E5969;
  padding: 0 4px;
}

.total-info {
  font-size: 14px;
  color: #4E5969;
  margin-left: 8px;
}

.page-size-select {
  width: 90px !important;
  margin-left: 8px;

  :deep(.el-select__wrapper) {
    height: 32px;
    border-radius: 6px;
  }

  :deep(.el-select__selected-item:nth-child(2) > span) {
    color: #4E5969;
  }
}
</style>

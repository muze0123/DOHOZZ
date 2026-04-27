<template>
  <div class="pagination-wrapper">
    <!-- 分页信息 -->
    <div class="pagination-info">
      <span>共 {{ total }} 条记录</span>
      <span class="separator">第 {{ page }} / {{ totalPages }} 页</span>
    </div>

    <!-- 分页控件 -->
    <div class="pagination-controls">
      <!-- 每页条数下拉 -->
      <div class="page-size-select">
        <span class="label">每页条数</span>
        <el-select
          :model-value="pageSize"
          @update:model-value="handlePageSizeChange"
          placeholder="请选择"
          style="width: 90px"
        >
          <el-option :value="10" label="10" />
          <el-option :value="20" label="20" />
          <el-option :value="50" label="50" />
        </el-select>
      </div>

      <!-- 页码导航 -->
      <div class="page-nav">
        <!-- 上一页 -->
        <button
          class="nav-btn"
          :disabled="page <= 1"
          @click="handlePrevPage"
        >
          上一页
        </button>

        <!-- 页码列表 -->
        <template v-for="(item, index) in pageItems" :key="index">
          <span v-if="item === '...'" class="ellipsis">...</span>
          <button
            v-else
            class="page-btn"
            :class="{ active: item === page }"
            @click="handlePageClick(item)"
          >
            {{ item }}
          </button>
        </template>

        <!-- 下一页 -->
        <button
          class="nav-btn"
          :disabled="page >= totalPages"
          @click="handleNextPage"
        >
          下一页
        </button>
      </div>

      <!-- 快速跳页 -->
      <div class="jump-to">
        <span>跳至</span>
        <el-input
          v-model="jumpInput"
          type="number"
          :min="1"
          :max="totalPages"
          placeholder=""
          style="width: 60px"
          @keyup.enter="handleJump"
        />
        <span>页</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:page', 'update:pageSize'])

const jumpInput = ref('')

// 计算总页数
const totalPages = computed(() => {
  if (props.total <= 0) return 1
  return Math.ceil(props.total / props.pageSize)
})

// 计算页码列表（最多显示5个页码）
const pageItems = computed(() => {
  const total = totalPages.value
  const current = props.page
  const items = []

  if (total <= 5) {
    // 总页数小于等于5，全部显示
    for (let i = 1; i <= total; i++) {
      items.push(i)
    }
  } else {
    // 总页数大于5，需要显示省略号
    if (current <= 3) {
      // 当前页在前面
      for (let i = 1; i <= 4; i++) {
        items.push(i)
      }
      items.push('...')
      items.push(total)
    } else if (current >= total - 2) {
      // 当前页在后面
      items.push(1)
      items.push('...')
      for (let i = total - 3; i <= total; i++) {
        items.push(i)
      }
    } else {
      // 当前页在中间
      items.push(1)
      items.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        items.push(i)
      }
      items.push('...')
      items.push(total)
    }
  }

  return items
})

// 处理每页条数变化
const handlePageSizeChange = (val) => {
  emit('update:pageSize', val)
  // 重置到第一页
  if (props.page !== 1) {
    emit('update:page', 1)
  }
}

// 处理页码点击
const handlePageClick = (pageNum) => {
  if (pageNum === '...' || pageNum === props.page) return
  emit('update:page', pageNum)
}

// 处理上一页
const handlePrevPage = () => {
  if (props.page > 1) {
    emit('update:page', props.page - 1)
  }
}

// 处理下一页
const handleNextPage = () => {
  if (props.page < totalPages.value) {
    emit('update:page', props.page + 1)
  }
}

// 处理跳页
const handleJump = () => {
  const pageNum = parseInt(jumpInput.value, 10)
  if (isNaN(pageNum) || pageNum < 1) {
    ElMessage.warning('请输入有效页码')
    return
  }
  if (pageNum > totalPages.value) {
    ElMessage.warning('请输入有效页码')
    return
  }
  emit('update:page', pageNum)
  jumpInput.value = ''
}

// 监听 total 变化，如果当前页超出范围则重置
watch(() => props.total, (newTotal) => {
  const maxPage = Math.ceil(newTotal / props.pageSize) || 1
  if (props.page > maxPage) {
    emit('update:page', 1)
  }
})
</script>

<style lang="scss" scoped>
$meta-blue: #0064E0;
$text-primary: #050505;
$text-secondary: #65676B;
$border-color: #E8E8E8;

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid $border-color;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $text-secondary;

  .separator {
    color: $text-primary;
  }
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-size-select {
  display: flex;
  align-items: center;
  gap: 8px;

  .label {
    font-size: 13px;
    color: $text-secondary;
  }
}

.page-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-btn,
.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid $border-color;
  border-radius: 6px;
  background: #fff;
  color: $text-secondary;
  font-size: 13px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    color: $meta-blue;
    border-color: $meta-blue;
  }

  &:disabled {
    color: #BCC0C4;
    cursor: not-allowed;
  }

  &.active {
    background: $meta-blue;
    border-color: $meta-blue;
    color: #fff;
    font-weight: 500;

    &:hover {
      background: $meta-blue;
      border-color: $meta-blue;
      color: #fff;
    }
  }
}

.nav-btn {
  padding: 0 12px;
}

.ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: $text-secondary;
  font-size: 13px;
}

.jump-to {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $text-secondary;

  :deep(.el-input) {
    --el-input-border-color: #e5e7eb;
    --el-input-hover-border-color: $meta-blue;
    --el-input-focus-border-color: $meta-blue;

    .el-input__wrapper {
      border-radius: 6px;
      padding: 0 8px;
    }

    .el-input__inner {
      text-align: center;
    }
  }
}
</style>

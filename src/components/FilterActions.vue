// 自定义筛选操作按钮组件
<template>
  <div class="filter-actions" :class="className" :style="{ marginLeft: ml ? 'auto' : undefined }">
    <el-button type="primary" size="small" @click="handleQuery">{{ queryText }}</el-button>
    <el-button size="small" @click="handleReset">{{ resetText }}</el-button>
  </div>
</template>

<script setup>
const props = defineProps({
  ml: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  },
  queryText: {
    type: String,
    default: '查询'
  },
  resetText: {
    type: String,
    default: '重置'
  }
})

const emit = defineEmits(['query', 'reset'])

const handleQuery = () => {
  emit('query')
}

const handleReset = () => {
  emit('reset')
}
</script>

<style lang="scss" scoped>
.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.el-button) {
    height: 32px;
  }
}
</style>
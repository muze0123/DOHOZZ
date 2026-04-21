<template>
  <div class="pagination-wrapper">
    <el-pagination
      v-model:current-page="currentPageModel"
      v-model:page-size="pageSizeModel"
      :page-sizes="pageSizes"
      :total="total"
      :disabled="disabled"
      :background="background"
      :layout="layout"
      :prev-text="prevText"
      :next-text="nextText"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
    default: () => [10, 20, 50]
  },
  disabled: {
    type: Boolean,
    default: false
  },
  background: {
    type: Boolean,
    default: true
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  prevText: {
    type: String,
    default: '上一页'
  },
  nextText: {
    type: String,
    default: '下一页'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const currentPageModel = computed({
  get: () => props.modelValue.page,
  set: (val) => {
    emit('update:modelValue', { ...props.modelValue, page: val })
  }
})

const pageSizeModel = computed({
  get: () => props.modelValue.pageSize,
  set: (val) => {
    emit('update:modelValue', { ...props.modelValue, pageSize: val })
  }
})

const handleSizeChange = (val) => {
  emit('change', { ...props.modelValue, pageSize: val, page: 1 })
}

const handleCurrentChange = (val) => {
  emit('change', { ...props.modelValue, page: val })
}
</script>

<style lang="scss" scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 0;
}

:deep(.el-pagination) {
  --el-pagination-button-bg-color: #ffffff;
  --el-pagination-button-color: #65676B;
  --el-pagination-button-disabled-bg-color: #f5f7fa;
  --el-pagination-hover-color: #0064E0;

  font-weight: 400;

  .el-pagination__total {
    font-size: 13px;
    color: #65676B;
  }

  .el-pagination__sizes {
    margin: 0 16px 0 8px;

    .el-select {
      --el-select-border-color-hover: #0064E0;
    }
  }

  .btn-prev,
  .btn-next {
    border-radius: 6px;
    border: 1px solid #e5e7eb;

    &:hover {
      color: #0064E0;
      border-color: #0064E0;
    }

    &.is-disabled {
      color: #BCC0C4;
      border-color: #e5e7eb;
    }
  }

  .el-pager {
    li {
      border-radius: 6px;
      border: 1px solid transparent;
      margin: 0 2px;
      font-weight: 400;

      &:hover {
        color: #0064E0;
      }

      &.is-active {
        background: #0064E0;
        color: #ffffff;
        border-color: #0064E0;
      }

      &.is-disabled {
        color: #BCC0C4;
      }
    }
  }

  .el-pagination__jump {
    margin-left: 16px;
    color: #65676B;

    .el-input {
      --el-input-border-color: #e5e7eb;
      --el-input-hover-border-color: #0064E0;
      --el-input-focus-border-color: #0064E0;

      .el-input__wrapper {
        border-radius: 6px;
      }
    }
  }
}
</style>

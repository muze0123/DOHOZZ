<template>
  <div class="msg-pagination">
    <el-pagination
      v-model:current-page="currentPageModel"
      v-model:page-size="pageSizeModel"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElPagination } from 'element-plus'

const props = defineProps({
  total: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'change'])

const currentPageModel = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

function handleSizeChange() {
  emit('change', { page: 1, pageSize: props.pageSize })
}

function handleCurrentChange() {
  emit('change', { page: props.currentPage, pageSize: props.pageSize })
}
</script>

<style scoped>
.msg-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  gap: 8px;
  background: #fff;
  border-top: 1px solid #F0F0F0;
}
</style>

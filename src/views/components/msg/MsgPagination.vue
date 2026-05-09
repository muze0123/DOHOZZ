<template>
  <div class="msg-pagination">
    <Pagination
      v-model="paginationState"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Pagination from '@/components/Pagination.vue'

const props = defineProps({
  total: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'change'])

const paginationState = computed({
  get: () => ({ page: props.currentPage, pageSize: props.pageSize }),
  set: (val) => {
    if (val.page !== props.currentPage) {
      emit('update:currentPage', val.page)
    }
    if (val.pageSize !== props.pageSize) {
      emit('update:pageSize', val.pageSize)
    }
  }
})
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

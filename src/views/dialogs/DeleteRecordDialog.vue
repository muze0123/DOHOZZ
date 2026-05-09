<template>
  <el-dialog
    v-model="dialogVisible"
    title="删除记录"
    width="420px"
    @close="handleClose"
  >
    <div class="delete-content">
      <p class="delete-tip">确定要删除该记录吗？</p>
      <p class="delete-warning">删除后将无法恢复</p>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" danger @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  record: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)

function handleClose() {
  loading.value = false
}

function handleSubmit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    emit('success')
  }, 500)
}
</script>

<style scoped>
.delete-content {
  text-align: center;
  padding: 20px 0;
}

.delete-tip {
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
}

.delete-warning {
  font-size: 13px;
  color: #ff4d4f;
}
</style>

<template>
  <el-dialog v-model="dialogVisible" title="确认取消该团长合作记录吗？" width="440px" @close="handleClose">
    <div class="cancel-tip">
      取消合作后，该合作记录的状态将变为"已取消"，无法恢复。
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  cooperation: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

function handleConfirm() {
  emit('success')
  handleClose()
}
</script>

<style scoped>
.cancel-tip {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>

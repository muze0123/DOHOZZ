<template>
  <el-dialog v-model="dialogVisible" title="确认删除" width="440px" @close="handleClose">
    <div class="delete-tip">
      <el-icon class="tip-icon"><InfoFilled /></el-icon>
      <div class="tip-text">
        <p>确认删除所选团长合作记录吗？</p>
        <p>删除后，这些合作记录的所有数据将被删除，对应商务BD的绩效也会减少，请谨慎操作。</p>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  ids: { type: Array, default: () => [] }
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
.delete-tip {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff7e6;
  border-radius: 4px;
}

.tip-icon {
  font-size: 20px;
  color: #faad14;
  flex-shrink: 0;
}

.tip-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;

  p {
    margin: 0 0 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

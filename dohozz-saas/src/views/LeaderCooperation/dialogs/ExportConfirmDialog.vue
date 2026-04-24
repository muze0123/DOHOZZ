<template>
  <el-dialog v-model="dialogVisible" title="导出提示" width="440px" @close="handleClose">
    <div class="export-tip">
      <el-icon class="tip-icon"><InfoFilled /></el-icon>
      <div class="tip-text">
        本次将导出所选时间范围内的所有数据，导出结果可以在「任务中心-下载任务」中查看和下载。
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认导出</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

function handleConfirm() {
  emit('confirm')
  handleClose()
}
</script>

<style scoped>
.export-tip {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f0f5ff;
  border-radius: 4px;
  align-items: flex-start;
}

.tip-icon {
  font-size: 20px;
  color: #1677ff;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-text {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}
</style>

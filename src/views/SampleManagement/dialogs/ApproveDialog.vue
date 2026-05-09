<template>
  <el-dialog
    v-model="dialogVisible"
    title="审批通过"
    width="480px"
    @close="handleClose"
  >
    <div class="dialog-tip">
      确定要通过样品 <span class="highlight">{{ sample?.id }}</span> 的发货申请吗？
    </div>
    <div class="dialog-tip warning">
      通过后样品将进入 <span class="highlight">待发货</span> 状态。
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认通过</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  sample: {
    type: Object,
    default: null
  }
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
}
</script>

<style scoped>
.dialog-tip {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}

.dialog-tip.warning {
  color: #ff6600;
}

.highlight {
  font-weight: 600;
  color: #1677ff;
}

.dialog-tip.warning .highlight {
  color: #ff6600;
}
</style>

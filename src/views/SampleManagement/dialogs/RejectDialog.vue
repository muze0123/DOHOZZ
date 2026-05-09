<template>
  <el-dialog
    v-model="dialogVisible"
    title="拒绝发货"
    width="480px"
    @close="handleClose"
  >
    <div class="dialog-tip warning">
      确定要拒绝样品 <span class="highlight">{{ sample?.id }}</span> 的发货申请吗？
    </div>
    <div class="reject-form">
      <div class="form-label">拒绝原因</div>
      <el-input
        v-model="rejectReason"
        type="textarea"
        :rows="3"
        placeholder="请输入拒绝原因"
      />
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="danger" @click="handleConfirm">确认拒绝</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

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

const rejectReason = ref('')

function handleClose() {
  dialogVisible.value = false
  rejectReason.value = ''
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
  color: #ff4d4f;
}

.highlight {
  font-weight: 600;
  color: #ff4d4f;
}

.reject-form {
  margin-top: 8px;
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}
</style>

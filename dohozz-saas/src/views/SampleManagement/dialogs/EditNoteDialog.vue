<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑备注"
    width="480px"
    @close="handleClose"
  >
    <div class="edit-form">
      <div class="form-item">
        <div class="form-label">样品ID</div>
        <div class="form-value">{{ sample?.id }}</div>
      </div>
      <div class="form-item">
        <div class="form-label">商品名称</div>
        <div class="form-value">{{ sample?.product?.name }}</div>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>备注</div>
        <el-input
          v-model="note"
          type="textarea"
          :rows="4"
          placeholder="请输入备注信息"
          maxlength="200"
          show-word-limit
        />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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

const note = ref('')

watch(() => props.sample, (newSample) => {
  if (newSample) {
    note.value = newSample.note || ''
  }
}, { immediate: true })

function handleClose() {
  dialogVisible.value = false
  note.value = ''
}

function handleConfirm() {
  emit('success')
}
</script>

<style scoped>
.edit-form {
  padding: 8px 0;
}

.form-item {
  margin-bottom: 16px;

  .form-label {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;

    .required {
      color: #ff4d4f;
      margin-right: 4px;
    }
  }

  .form-value {
    font-size: 14px;
    color: #666;
  }
}
</style>

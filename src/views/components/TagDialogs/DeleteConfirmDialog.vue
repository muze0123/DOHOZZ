<template>
  <el-dialog
    v-model="visible"
    title="确认删除该标签组吗？"
    width="420px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="delete-content">
      <el-icon class="delete-icon" :size="48" color="#ff4d4f">
        <WarningFilled />
      </el-icon>
      <p class="delete-text">
        删除后，该标签组及其下的所有标签将无法恢复，请谨慎操作。
      </p>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" danger :loading="loading" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  tagGroupId: { type: String, default: '' },
  /** API 函数：deleteTagGroup(id) */
  deleteFn: { type: Function, required: true }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    loading.value = false
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

function handleClose() {
  visible.value = false
}

async function handleConfirm() {
  loading.value = true
  try {
    const res = await props.deleteFn(props.tagGroupId)
    if (res.code === 0) {
      ElMessage.success(res.message)
      visible.value = false
      emit('success')
    } else {
      ElMessage.error('删除失败，请重试')
    }
  } catch {
    ElMessage.error('删除失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.delete-content {
  text-align: center;
  padding: 20px 0 12px;
}

.delete-icon {
  margin-bottom: 12px;
}

.delete-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}
</style>

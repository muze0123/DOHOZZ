<template>
  <el-dialog
    v-model="visible"
    title="仿写结果"
    width="560px"
    :close-on-click-modal="false"
  >
    <div class="result-box">
      <div class="result-label">原视频链接：</div>
      <div class="result-url">{{ result.original }}</div>
    </div>
    <div class="result-box">
      <div class="result-label">仿写内容：</div>
      <div class="result-content">{{ result.rewritten }}</div>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
      <el-button @click="handleRegenerate">重新仿写</el-button>
      <el-button type="primary" @click="handleCopy">复制内容</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({ modelValue: Boolean, result: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'regenerate'])

const visible = ref(false)
watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const handleCopy = () => {
  if (!props.result?.rewritten) {
    ElMessage.error('复制失败，请重试')
    return
  }
  navigator.clipboard.writeText(props.result.rewritten).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

const handleRegenerate = () => {
  emit('regenerate')
}
</script>

<style scoped>
.result-box { margin-bottom: 16px; }
.result-label { color: #999; font-size: 14px; margin-bottom: 8px; }
.result-url { color: #666; font-size: 14px; word-break: break-all; }
.result-content { background: #fafafa; border: none; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.8; color: #262626; min-height: 100px; white-space: pre-wrap; }
</style>

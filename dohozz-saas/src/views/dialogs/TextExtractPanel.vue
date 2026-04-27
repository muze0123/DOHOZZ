<template>
  <el-dialog
    v-model="visible"
    title="提取文案"
    width="480px"
    :close-on-click-modal="false"
    class="extract-text-dialog"
  >
    <div v-if="video" class="video-summary">
      <span class="summary-title">{{ video.title }}</span>
    </div>

    <div v-if="status === 'idle'" class="extract-hint">
      点击下方按钮开始提取视频中的文案内容
    </div>

    <div v-if="status === 'loading'" class="extract-loading">
      <el-icon class="loading-icon"><i class="el-icon-loading"></i></el-icon>
      <span>正在提取文案...</span>
    </div>

    <div v-if="status === 'success'" class="extract-result">
      <div class="result-text">{{ extractedText }}</div>
      <el-button type="primary" size="small" @click="copyText">复制文案</el-button>
    </div>

    <div v-if="status === 'empty'" class="extract-empty">
      <el-empty description="该视频暂无文案内容" />
    </div>

    <div v-if="status === 'error'" class="extract-error">
      <el-empty description="提取失败" />
      <el-button type="primary" size="small" @click="startExtract">重新提取</el-button>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
      <el-button
        v-if="status === 'idle'"
        type="primary"
        :loading="status === 'loading'"
        @click="startExtract"
      >
        开始提取
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  video: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) { emit('update:modelValue', false); status.value = 'idle'; extractedText.value = '' } })

const status = ref('idle') // idle | loading | success | empty | error
const extractedText = ref('')

const startExtract = () => {
  status.value = 'loading'
  // 模拟提取
  setTimeout(() => {
    if (Math.random() > 0.2) {
      extractedText.value = '这是一段模拟的文案内容，包含商品介绍、使用体验和推荐理由。视频中的主播详细介绍了产品的特点和使用方法，并分享了真实的使用感受。'
      status.value = 'success'
    } else {
      status.value = 'empty'
    }
  }, 1500)
}

const copyText = () => {
  navigator.clipboard.writeText(extractedText.value).then(() => {
    ElMessage.success('复制成功')
  })
}
</script>

<style scoped>
.video-summary { padding: 12px; background: #f5f5f5; border-radius: 6px; margin-bottom: 16px; }
.summary-title { font-size: 14px; color: #262626; font-weight: 500; }
.extract-hint { text-align: center; padding: 40px 0; color: #999; font-size: 14px; }
.extract-loading { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 40px 0; color: #1677ff; }
.loading-icon { font-size: 18px; }
.extract-result { position: relative; }
.result-text { background: #fafafa; border: 1px solid #e8e8e8; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.8; color: #262626; margin-bottom: 12px; max-height: 300px; overflow-y: auto; }
.extract-empty, .extract-error { text-align: center; padding: 20px 0; }
</style>

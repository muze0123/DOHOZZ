<template>
  <el-dialog
    v-model="visible"
    title="AI 智能仿写"
    width="600px"
    :close-on-click-modal="false"
    class="ai-rewrite-dialog"
  >
    <el-form label-width="80px">
      <el-form-item label="商品选择">
        <el-select v-model="selectedProduct" placeholder="请选择商品" filterable style="width: 100%">
          <el-option
            v-for="p in productOptions"
            :key="p.value"
            :label="p.label"
            :value="p.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="创作风格">
        <el-radio-group v-model="rewriteStyle">
          <el-radio value="formal">正式风格</el-radio>
          <el-radio value="casual">轻松风格</el-radio>
          <el-radio value="playful">活泼风格</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="generatedText" label="生成结果">
        <div class="generated-result">
          <div class="result-content">{{ generatedText }}</div>
          <div class="result-actions">
            <el-button size="small" @click="copyResult">复制</el-button>
            <el-button size="small" @click="regenerate">重新生成</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div v-if="generating" class="generating-state">
      <el-icon class="loading-icon"><i class="el-icon-loading"></i></el-icon>
      <span>AI正在仿写中...</span>
    </div>

    <div v-if="!generatedText && !generating && selectedProduct" class="generate-hint">
      点击"开始仿写"，AI将基于商品信息和视频文案生成多个版本
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" :loading="generating" @click="startRewrite" :disabled="!selectedProduct">
        开始仿写
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
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const selectedProduct = ref('')
const rewriteStyle = ref('casual')
const generating = ref(false)
const generatedText = ref('')

const productOptions = [
  { label: '夏季美妆新品礼盒', value: 'p1' },
  { label: '精华液30ml', value: 'p2' },
  { label: '控油洗面奶', value: 'p3' }
]

const startRewrite = () => {
  if (!selectedProduct.value) return
  generating.value = true
  setTimeout(() => {
    const styles = {
      formal: '这款产品经过严格的质量把控，为用户提供卓越的使用体验。其独特的配方能够有效改善肌肤状况，长期使用可达到显著的美容效果。我们诚挚推荐给追求品质生活的您。',
      casual: '最近试了这款产品，真的蛮好用的！质地轻薄好吸收，用了一个星期皮肤状态明显变好了。价格也很实在，性价比超高，姐妹们可以放心冲！',
      playful: '哇塞！这款产品也太好用了叭！简直是宝藏级别的存在！用过就回不去了~姐妹们快冲鸭！保证你们用了就会爱上它的！'
    }
    generatedText.value = styles[rewriteStyle.value]
    generating.value = false
    ElMessage.success('仿写完成')
  }, 2000)
}

const copyResult = () => {
  navigator.clipboard.writeText(generatedText.value).then(() => {
    ElMessage.success('复制成功')
  })
}

const regenerate = () => { generatedText.value = ''; startRewrite() }
</script>

<style scoped>
.generated-result { width: 100%; }
.result-content { background: #fafafa; border: none; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.8; color: #262626; margin-bottom: 8px; }
.result-actions { display: flex; gap: 8px; justify-content: flex-end; }
.generating-state { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 30px 0; color: #1677ff; }
.loading-icon { font-size: 18px; }
.generate-hint { text-align: center; padding: 20px 0; color: #999; font-size: 13px; }
</style>

<template>
  <el-dialog
    v-model="visible"
    title="手动添加带货视频"
    width="560px"
    :close-on-click-modal="false"
    class="manual-add-dialog"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="视频链接" prop="videoUrl">
        <el-input
          v-model="formData.videoUrl"
          placeholder="请输入 TikTok 视频链接"
          @blur="handleUrlBlur"
        />
      </el-form-item>

      <!-- 视频信息回显 -->
      <div v-if="videoInfo" class="video-preview">
        <img :src="videoInfo.coverUrl" class="preview-cover" />
        <div class="preview-info">
          <div class="preview-title">{{ videoInfo.title }}</div>
          <div class="preview-author">达人：{{ videoInfo.author }}</div>
        </div>
      </div>
      <div v-if="urlError" class="url-error">{{ urlError }}</div>

      <el-form-item label="归属员工" prop="assignee">
        <el-select
          v-model="formData.assignee"
          placeholder="请选择归属员工"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="emp in employeeOptions"
            :key="emp.value"
            :label="emp.label"
            :value="emp.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(false)
watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const formRef = ref(null)
const submitting = ref(false)
const videoInfo = ref(null)
const urlError = ref('')

const formData = reactive({
  videoUrl: '',
  assignee: ''
})

const formRules = {
  videoUrl: [{ required: true, message: '请输入视频链接', trigger: 'blur' }],
  assignee: [{ required: true, message: '请选择归属员工', trigger: 'change' }]
}

const employeeOptions = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
  { label: '王五', value: 'wangwu' }
]

const handleUrlBlur = () => {
  if (!formData.videoUrl) { videoInfo.value = null; urlError.value = ''; return }
  // 模拟识别视频链接
  setTimeout(() => {
    videoInfo.value = {
      coverUrl: 'https://via.placeholder.com/120x90',
      title: '模拟视频标题 - 系统自动识别',
      author: '达人名称'
    }
    urlError.value = ''
  }, 500)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  // 模拟提交
  setTimeout(() => {
    submitting.value = false
    visible.value = false
    formData.videoUrl = ''
    formData.assignee = ''
    videoInfo.value = null
    ElMessage.success('视频添加成功')
    emit('submit', { ...formData })
  }, 500)
}
</script>

<style scoped>
.video-preview { display: flex; gap: 12px; padding: 12px 16px; background: #f5f5f5; border-radius: 6px; margin: -8px 0 16px 100px; }
.preview-cover { width: 120px; height: 90px; object-fit: cover; border-radius: 4px; }
.preview-info { display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.preview-title { font-size: 14px; color: #262626; font-weight: 500; }
.preview-author { font-size: 12px; color: #999; }
.url-error { color: #ff4d4f; font-size: 12px; margin: -8px 0 16px 100px; }
</style>

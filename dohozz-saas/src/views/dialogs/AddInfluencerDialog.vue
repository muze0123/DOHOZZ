<template>
  <el-dialog
    v-model="visible"
    title="收录达人"
    width="520px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="add-content">
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <!-- 收录方式 -->
        <el-form-item label="收录方式" prop="type">
          <el-radio-group v-model="form.type" class="type-radio">
            <el-radio label="username">达人用户名</el-radio>
            <el-radio label="url">达人主页链接</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 达人标识 -->
        <el-form-item :label="form.type === 'username' ? '达人用户名' : '达人主页链接'" prop="identifier">
          <el-input
            v-model="form.identifier"
            :placeholder="form.type === 'username' ? '请输入达人用户名' : '请输入达人主页链接'"
            clearable
          />
        </el-form-item>

        <div class="identifier-tips">
          <p class="tips-title">如何获取达人信息？</p>
          <ul class="tips-list">
            <li>打开 TikTok App 或网页版</li>
            <li>进入达人个人主页</li>
            <li>复制主页链接或用户名</li>
            <li>粘贴到上方输入框</li>
          </ul>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          开始收录
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, h, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'open-task-dialog'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  type: 'username',
  identifier: ''
})

const rules = computed(() => ({
  type: [
    { required: true, message: '请选择收录方式', trigger: 'change' }
  ],
  identifier: [
    { required: true, message: form.type === 'username' ? '请输入达人用户名' : '请输入达人主页链接', trigger: 'blur' }
  ]
}))

// Mock existing influencers for duplicate check
const existingInfluencers = ['@sarahj_official', '@mikechen_tiktok', '@emmawilliams_fash']
const existingUrls = ['https://tiktok.com/@sarahj_official', 'https://tiktok.com/@mikechen_tiktok']

function validateUrl(url) {
  // Simple URL format validation
  const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
  return urlPattern.test(url)
}

function handleClose() {
  form.identifier = ''
  form.type = 'username'
  emit('close')
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      // Validation passed, now check for duplicates and URL format
      if (form.type === 'url') {
        // URL format check
        if (!validateUrl(form.identifier)) {
          ElMessage.error('主页链接格式错误')
          return
        }
        // Check if URL already exists
        if (existingUrls.includes(form.identifier)) {
          ElMessage.error('达人已存在')
          return
        }
      } else {
        // Check if username already exists
        if (existingInfluencers.includes(form.identifier)) {
          ElMessage.error('达人已存在')
          return
        }
      }

      // Mock: check if in task list (simulate random failure)
      const inTaskList = false
      if (inTaskList) {
        ElMessage.error('达人已在收录列表')
        return
      }

      loading.value = true
      // Simulate API call
      setTimeout(() => {
        loading.value = false
        visible.value = false

        ElMessage.success({
          message: h('span', [
            '收录任务已添加，将在10分钟内完成收录，可以在',
            h('a', {
              style: 'color: #1677ff; margin-left: 4px; cursor: pointer;',
              onClick: () => {
                emit('open-task-dialog')
              }
            }, '查看'),
            '任务列表-达人收录任务中查看结果'
          ])
        })
        handleClose()
      }, 1500)
    }
  })
}
</script>

<style lang="scss" scoped>
.add-content {
  padding: 8px 0;
}

.type-radio {
  display: flex;
  gap: 24px;
}

.platform-select {
  width: 100%;
}

.identifier-tips {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
}

.tips-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin: 0 0 10px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

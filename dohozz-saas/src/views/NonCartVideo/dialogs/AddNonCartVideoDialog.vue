<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加非挂车视频链接"
    width="560px"
    @close="handleClose"
  >
    <div class="add-form">
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>视频链接</div>
        <el-input
          ref="videoLinkRef"
          v-model="videoLink"
          placeholder="请输入视频链接，失去焦点后自动识别视频信息"
          :class="{ 'is-error': linkError }"
          @blur="handleLinkBlur"
        />
        <div v-if="linkError" class="error-tip">链接无效，请重新输入</div>
        <div v-if="linkRecognizing" class="recognizing-tip">
          <el-icon class="is-loading"><Loading /></el-icon>
          正在识别中...
        </div>
        <div v-if="linkRecognized && !linkError" class="success-tip">
          <el-icon><CircleCheckFilled /></el-icon>
          视频信息已识别
        </div>
      </div>

      <div class="form-item">
        <div class="form-label"><span class="required">*</span>达人</div>
        <el-select
          v-model="influencerId"
          placeholder="请选择达人"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="inf in influencerOptions"
            :key="inf.id"
            :label="inf.name"
            :value="inf.id"
          />
        </el-select>
      </div>

      <div class="form-item">
        <div class="form-label">合作费用</div>
        <el-input
          v-model="cooperationFee"
          placeholder="请输入合作报酬金额"
        >
          <template #prefix>¥</template>
        </el-input>
      </div>

      <div class="form-item">
        <div class="form-label">归属员工</div>
        <el-select
          v-model="employeeId"
          placeholder="请选择归属员工"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="emp in employeeOptions"
            :key="emp.id"
            :label="emp.name"
            :value="emp.id"
          />
        </el-select>
      </div>

      <div class="form-item">
        <div class="form-label">小蓝词</div>
        <el-select
          v-model="blueWords"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="输入关键词后按回车创建"
          style="width: 100%"
        >
          <el-option
            v-for="word in blueWordOptions"
            :key="word"
            :label="word"
            :value="word"
          />
        </el-select>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, CircleCheckFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  influencerOptions: {
    type: Array,
    default: () => []
  },
  employeeOptions: {
    type: Array,
    default: () => []
  },
  blueWordOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 表单数据
const videoLink = ref('')
const influencerId = ref('')
const cooperationFee = ref('')
const employeeId = ref('')
const blueWords = ref([])

// 识别状态
const linkError = ref(false)
const linkRecognizing = ref(false)
const linkRecognized = ref(false)

// 提交状态
const submitting = ref(false)

function handleLinkBlur() {
  const value = videoLink.value.trim()
  if (!value) {
    linkError.value = false
    linkRecognized.value = false
    return
  }

  // 模拟识别过程
  linkRecognizing.value = true
  linkError.value = false
  linkRecognized.value = false

  setTimeout(() => {
    linkRecognizing.value = false
    // 简单校验 URL 格式
    const isValidUrl = /^https?:\/\/.+/.test(value) || value.includes('.')
    if (!isValidUrl) {
      linkError.value = true
      linkRecognized.value = false
      return
    }

    // 模拟从链接识别达人
    linkRecognized.value = true
    // 模拟自动匹配到第一个达人选项
    if (props.influencerOptions.length > 0 && !influencerId.value) {
      // 模拟根据链接内容匹配：如果是 tiktok 链接用第一个达人，其他链接用第二个
      if (value.includes('tiktok') && props.influencerOptions.length > 0) {
        influencerId.value = props.influencerOptions[0].id
      } else if (value.includes('instagram') && props.influencerOptions.length > 1) {
        influencerId.value = props.influencerOptions[1].id
      } else if (props.influencerOptions.length > 0) {
        influencerId.value = props.influencerOptions[0].id
      }
    }
  }, 800)
}

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

function resetForm() {
  videoLink.value = ''
  influencerId.value = ''
  cooperationFee.value = ''
  employeeId.value = ''
  blueWords.value = []
  linkError.value = false
  linkRecognizing.value = false
  linkRecognized.value = false
  submitting.value = false
}

function handleConfirm() {
  if (!videoLink.value.trim()) {
    ElMessage.warning('请填写视频链接')
    return
  }
  if (!influencerId.value) {
    ElMessage.warning('请选择达人')
    return
  }

  // 校验通过，模拟提交
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    emit('success')
    ElMessage.success('非挂车视频添加成功')
  }, 500)
}
</script>

<style scoped>
.add-form {
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
}

.error-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #ff4d4f;
  display: flex;
  align-items: center;
  gap: 4px;
}

.recognizing-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.success-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

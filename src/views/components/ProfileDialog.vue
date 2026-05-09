<template>
  <el-dialog
    v-model="visible"
    title="个人信息"
    width="480px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="profile-content">
      <!-- 用户头像 -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <el-avatar :size="80" :icon="UserIcon" class="profile-avatar" />
          <el-upload
            class="avatar-upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            accept=".png,.jpg,.jpeg"
          >
            <div class="camera-btn">
              <IconCamera class="camera-icon" />
            </div>
          </el-upload>
        </div>
      </div>

      <!-- 成员名称 -->
      <div class="form-item">
        <label class="form-label">成员名称 <span class="required">*</span></label>
        <el-input
          v-model="formData.name"
          placeholder="请输入成员名称"
          maxlength="20"
          show-word-limit
          @blur="validateName"
        />
      </div>

      <!-- 入职时间 -->
      <div class="form-item">
        <label class="form-label">入职时间</label>
        <el-date-picker
          v-model="formData.joinDate"
          type="date"
          placeholder="请选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import IconCamera from '@/components/icons/IconCamera.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const UserIcon = {
  render() {
    return this.$createElement('i', { class: 'iconfont icon-yonghu' })
  }
}

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formData = ref({
  name: '张三',
  joinDate: ''
})

const validateName = () => {
  if (!formData.value.name || formData.value.name.trim() === '') {
    ElMessage.warning('请输入成员名称')
    return false
  }
  return true
}

const beforeAvatarUpload = (file) => {
  const isImage = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
  const isLt20M = file.size / 1024 / 1024 < 20

  if (!isImage) {
    ElMessage.error('上传头像图片只能是 PNG/JPG/JPEG 格式!')
    return false
  }
  if (!isLt20M) {
    ElMessage.error('上传头像图片大小不能超过 20MB!')
    return false
  }

  // 预览头像
  const reader = new FileReader()
  reader.onload = (e) => {
    // 可以通过 emit 或 store 来更新头像
    ElMessage.success('头像上传成功')
  }
  reader.readAsDataURL(file)
  return false // 阻止自动上传
}

const handleSave = () => {
  if (!validateName()) return

  // 保存逻辑
  ElMessage.success('修改成功')
  visible.value = false
}

const handleClose = () => {
  visible.value = false
}

// 监听打开弹窗，重置表单
watch(() => props.modelValue, (val) => {
  if (val) {
    formData.value.name = '张三'
    formData.value.joinDate = ''
  }
})
</script>

<style scoped lang="scss">
.profile-content {
  padding: 16px 0;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;

  .profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .avatar-upload {
    position: absolute;
    bottom: 0;
    right: 0;

    :deep(.el-upload) {
      width: 28px;
      height: 28px;
    }
  }

  .camera-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid #fff;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }

    .camera-icon {
      width: 14px;
      height: 14px;
      color: #fff;
    }
  }
}

.form-item {
  margin-bottom: 24px;

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;

    .required {
      color: #ff4d4f;
      margin-left: 2px;
    }
  }
}
</style>
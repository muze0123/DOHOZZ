<template>
  <el-dialog
    v-model="dialogVisible"
    title="链接导入视频"
    width="520px"
    @close="handleClose"
  >
    <div class="import-form">
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>视频链接</div>
        <el-input
          v-model="videoLink"
          placeholder="请输入视频链接"
        />
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>所属平台</div>
        <el-select v-model="platform" placeholder="请选择平台" style="width: 100%">
          <el-option label="TikTok" value="tiktok" />
          <el-option label="Instagram" value="instagram" />
          <el-option label="Shopee" value="shopee" />
          <el-option label="Lazada" value="lazada" />
        </el-select>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const videoLink = ref('')
const platform = ref('')

function handleClose() {
  dialogVisible.value = false
  videoLink.value = ''
  platform.value = ''
}

function handleConfirm() {
  if (!videoLink.value) {
    ElMessage.warning('请填写视频链接')
    return
  }
  if (!platform.value) {
    ElMessage.warning('请选择所属平台')
    return
  }
  emit('success')
}
</script>

<style scoped>
.import-form {
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
</style>

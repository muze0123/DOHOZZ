<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加达人"
    width="560px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="平台" prop="platform">
        <el-select v-model="form.platform" placeholder="请选择平台" style="width: 100%">
          <el-option label="抖音" value="douyin" />
          <el-option label="小红书" value="xiaohongshu" />
        </el-select>
      </el-form-item>

      <el-form-item label="达人昵称" prop="streamer_name">
        <el-input v-model="form.streamer_name" placeholder="请输入达人昵称" />
      </el-form-item>

      <el-form-item :label="accountLabel" prop="streamer_account">
        <el-input v-model="form.streamer_account" :placeholder="accountPlaceholder" />
      </el-form-item>

      <el-form-item label="达人分类" prop="streamer_category">
        <el-select v-model="form.streamer_category" placeholder="请选择达人分类" style="width: 100%">
          <el-option label="美妆博主" value="美妆博主" />
          <el-option label="美食博主" value="美食博主" />
          <el-option label="穿搭博主" value="穿搭博主" />
          <el-option label="母婴博主" value="母婴博主" />
          <el-option label="数码博主" value="数码博主" />
        </el-select>
      </el-form-item>

      <el-form-item label="联系方式" prop="contact_info">
        <el-input v-model="form.contact_info" placeholder="请输入联系方式" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api/enterpriseInfluencer'

const props = defineProps({
  visible: Boolean,
  platform: {
    type: String,
    default: 'douyin'
  }
})

const emit = defineEmits(['success', 'update:visible'])

const dialogVisible = ref(false)
const confirmLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  platform: 'douyin',
  streamer_name: '',
  streamer_account: '',
  streamer_category: '',
  contact_info: '',
  remark: ''
})

const rules = {
  platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
  streamer_name: [{ required: true, message: '请输入达人昵称', trigger: 'blur' }],
  streamer_account: [{ required: true, message: '请输入账号', trigger: 'blur' }]
}

const accountLabel = computed(() => {
  return form.platform === 'xiaohongshu' ? '小红书号' : '抖音号'
})

const accountPlaceholder = computed(() => {
  return form.platform === 'xiaohongshu' ? '请输入小红书号' : '请输入抖音号'
})

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    // Reset form when dialog opens
    form.platform = props.platform || 'douyin'
    form.streamer_name = ''
    form.streamer_account = ''
    form.streamer_category = ''
    form.contact_info = ''
    form.remark = ''
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

const handleClose = () => {
  formRef.value?.resetFields()
}

const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    confirmLoading.value = true

    const res = await api.addInfluencer({
      platform: form.platform,
      streamer_name: form.streamer_name,
      streamer_account: form.streamer_account,
      streamer_category: form.streamer_category,
      contact_info: form.contact_info,
      remark: form.remark
    })

    if (res.code === 0) {
      ElMessage.success('添加成功')
      emit('success')
      dialogVisible.value = false
    } else {
      ElMessage.error(res.message || '添加失败')
    }
  } catch (error) {
    // Validation failed
  } finally {
    confirmLoading.value = false
  }
}
</script>

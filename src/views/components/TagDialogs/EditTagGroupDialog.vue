<template>
  <el-dialog
    v-model="visible"
    title="编辑标签组"
    width="480px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="标签组名称" prop="tag_group_name" required>
        <el-input
          v-model="form.tag_group_name"
          placeholder="请输入标签组名称"
          maxlength="100"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  data: { type: Object, default: () => ({}) },
  /** API 函数：updateTagGroup(data) */
  updateFn: { type: Function, required: true }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  tag_group_id: '',
  tag_group_name: '',
  remark: ''
})

const rules = {
  tag_group_name: [
    { required: true, message: '请输入标签组名称', trigger: 'blur' }
  ]
}

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    form.tag_group_id = props.data.tag_group_id || ''
    form.tag_group_name = props.data.tag_group_name || ''
    form.remark = props.data.remark || ''
    loading.value = false
    formRef.value?.clearValidate()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

function handleClose() {
  visible.value = false
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await props.updateFn({
      tag_group_id: form.tag_group_id,
      tag_group_name: form.tag_group_name,
      remark: form.remark
    })
    if (res.code === 0) {
      ElMessage.success(res.message)
      visible.value = false
      emit('success')
    } else {
      if (res.code === 1001) {
        ElMessage.warning(res.message)
      } else {
        ElMessage.error('保存失败，请重试')
      }
    }
  } catch {
    ElMessage.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

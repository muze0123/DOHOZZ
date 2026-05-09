<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑内容"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="内容标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入内容标题" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="达人昵称" prop="streamerName">
        <el-input v-model="formData.streamerName" placeholder="请输入达人昵称" />
      </el-form-item>
      <el-form-item label="内容标签" prop="contentTags">
        <el-select v-model="formData.contentTags" multiple placeholder="请选择内容标签" style="width: 100%">
          <el-option v-for="tag in tagOptions" :key="tag.value" :label="tag.label" :value="tag.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布形式" prop="publishForm">
        <el-select v-model="formData.publishForm" placeholder="请选择发布形式" style="width: 100%">
          <el-option v-for="opt in publishFormOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="关联计划" prop="planId">
        <el-select v-model="formData.planId" placeholder="请选择关联计划" filterable style="width: 100%">
          <el-option v-for="plan in planOptions" :key="plan.id" :label="plan.name" :value="plan.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关联SPU" prop="spuId">
        <el-select v-model="formData.spuId" placeholder="请选择关联SPU" filterable style="width: 100%">
          <el-option v-for="spu in spuOptions" :key="spu.id" :label="spu.name" :value="spu.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="departmentId">
        <el-select v-model="formData.departmentId" placeholder="请选择所属部门" style="width: 100%">
          <el-option v-for="dept in departmentOptions" :key="dept.id" :label="dept.name" :value="dept.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属媒介" prop="mediumId">
        <el-select v-model="formData.mediumId" placeholder="请选择所属媒介" style="width: 100%">
          <el-option v-for="medium in mediumOptions" :key="medium.id" :label="medium.name" :value="medium.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  content: { type: Object, default: null },
  planOptions: { type: Array, default: () => [] },
  tagOptions: { type: Array, default: () => [] },
  spuOptions: { type: Array, default: () => [] },
  departmentOptions: { type: Array, default: () => [] },
  mediumOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref(null)
const loading = ref(false)

const publishFormOptions = [
  { label: '短视频', value: 'short_video' },
  { label: '直播', value: 'live' },
  { label: '图文', value: 'image_text' },
  { label: '种草', value: 'recommend' }
]

const formData = reactive({
  title: '',
  streamerName: '',
  contentTags: [],
  publishForm: '',
  planId: '',
  spuId: '',
  departmentId: '',
  mediumId: '',
  remark: ''
})

const formRules = {
  title: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
  streamerName: [{ required: true, message: '请输入达人昵称', trigger: 'blur' }],
  contentTags: [{ required: true, message: '请选择内容标签', trigger: 'change' }],
  publishForm: [{ required: true, message: '请选择发布形式', trigger: 'change' }],
  planId: [{ required: true, message: '请选择关联计划', trigger: 'change' }],
  spuId: [{ required: true, message: '请选择关联SPU', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  mediumId: [{ required: true, message: '请选择所属媒介', trigger: 'change' }]
}

watch(() => props.modelValue, (val) => {
  if (val && props.content) {
    formData.title = props.content.title || ''
    formData.streamerName = props.content.streamerName || ''
    formData.contentTags = props.content.contentTags || []
    formData.publishForm = props.content.publishForm || ''
    formData.planId = props.content.planId || ''
    formData.spuId = props.content.spuId || ''
    formData.departmentId = props.content.departmentId || ''
    formData.mediumId = props.content.mediumId || ''
    formData.remark = props.content.remark || ''
  }
})

function handleClose() {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    emit('confirm', { ...formData })
    dialogVisible.value = false
  } catch (e) {
    // validation failed
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 12px;
}
:deep(.el-button--primary) {
  background-color: #FF6600;
  border-color: #FF6600;
}
:deep(.el-button--primary:hover) {
  background-color: #ff8533;
  border-color: #ff8533;
}
</style>

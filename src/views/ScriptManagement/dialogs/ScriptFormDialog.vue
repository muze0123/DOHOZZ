<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑脚本' : '新增脚本'"
    width="560px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="auto"
      label-position="left"
    >
      <!-- 达人平台 -->
      <el-form-item label="达人平台" prop="platform" required>
        <el-radio-group v-model="form.platform" @change="handlePlatformChange">
          <el-radio value="douyin">抖音</el-radio>
          <el-radio value="xiaohongshu">小红书</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 选择达人 -->
      <el-form-item label="选择达人" prop="creator_id" required>
        <el-select
          v-model="form.creator_id"
          filterable
          remote
          reserve-keyword
          placeholder="请输入达人昵称 / 抖音号"
          :remote-method="searchCreators"
          :loading="creatorSearching"
          style="width: 100%"
          clearable
          @change="handleCreatorChange"
        >
          <el-option
            v-for="c in creatorOptions"
            :key="c.creator_id"
            :label="`${c.creator_name} (${c.creator_account})`"
            :value="c.creator_id"
          >
            <div class="creator-option">
              <img :src="c.creator_avatar" class="creator-avatar" />
              <div class="creator-info">
                <span class="creator-name">{{ c.creator_name }}</span>
                <span class="creator-account">{{ c.creator_account }}</span>
              </div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 关联计划 -->
      <el-form-item label="关联计划" prop="plan_id">
        <el-select
          v-model="form.plan_id"
          placeholder="请选择计划"
          style="width: 100%"
          clearable
          @change="handlePlanChange"
        >
          <el-option
            v-for="p in planOptions"
            :key="p.plan_id"
            :label="p.plan_name"
            :value="p.plan_id"
          />
        </el-select>
      </el-form-item>

      <!-- 脚本备注 -->
      <el-form-item label="脚本备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <!-- 上传脚本 -->
      <el-form-item label="上传脚本" prop="script_file" required>
        <div class="upload-area">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :accept="ACCEPTED_TYPES"
            drag
          >
            <div class="upload-trigger">
              <el-icon class="upload-icon"><UploadFilled /></el-icon>
              <span class="upload-text">上传脚本</span>
            </div>
            <template #tip>
              <span class="upload-tip">支持上传word/txt/pdf/ppt/图片/excel文件</span>
            </template>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { searchCreators as searchCreatorsApi, getPlanOptions } from '@/api/scriptManagement'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** 编辑模式时传入的数据 */
  editData: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'success'])

const isEdit = ref(false)
const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const uploadRef = ref(null)

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = '.doc,.docx,.txt,.pdf,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.xls,.xlsx'

const form = reactive({
  platform: 'douyin',
  creator_id: '',
  creator_name: '',
  creator_account: '',
  creator_avatar: '',
  plan_id: '',
  plan_name: '',
  remark: '',
  script_file: null
})

const rules = {
  platform: [
    { required: true, message: '请选择达人平台', trigger: 'change' }
  ],
  creator_id: [
    { required: true, message: '请选择达人', trigger: 'change' }
  ],
  script_file: [
    {
      required: true,
      validator: (_rule, _value, callback) => {
        if (form.script_file) {
          callback()
        } else {
          callback(new Error('请上传脚本'))
        }
      },
      trigger: 'change'
    }
  ]
}

const creatorOptions = ref([])
const creatorSearching = ref(false)
const planOptions = ref([])

watch(() => props.modelValue, async (val) => {
  visible.value = val
  if (val) {
    isEdit.value = !!props.editData
    loadPlanOptions()
    if (isEdit.value) {
      loadEditData()
    } else {
      resetForm()
    }
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

function loadEditData() {
  const d = props.editData
  form.platform = d.platform || 'douyin'
  form.creator_id = d.creator_id
  form.creator_name = d.creator_name || ''
  form.creator_account = d.creator_account || ''
  form.creator_avatar = d.creator_avatar || ''
  form.plan_id = d.plan_id || ''
  form.plan_name = d.plan_name || ''
  form.remark = d.remark || ''
  form.script_file = {
    name: d.file_name,
    size: d.file_size,
    raw: null
  }
  loading.value = false
  nextTick(() => { formRef.value?.clearValidate() })
}

function resetForm() {
  form.platform = 'douyin'
  form.creator_id = ''
  form.creator_name = ''
  form.creator_account = ''
  form.creator_avatar = ''
  form.plan_id = ''
  form.plan_name = ''
  form.remark = ''
  form.script_file = null
  creatorOptions.value = []
  loading.value = false
  uploadRef.value?.clearFiles()
  nextTick(() => { formRef.value?.clearValidate() })
}

async function loadPlanOptions() {
  try {
    const res = await getPlanOptions()
    if (res.code === 0) {
      planOptions.value = res.data
    }
  } catch { /* ignore */ }
}

async function searchCreators(keyword) {
  creatorSearching.value = true
  try {
    const res = await searchCreatorsApi({
      keyword: keyword || '',
      platform: form.platform
    })
    if (res.code === 0) {
      creatorOptions.value = res.data
    }
  } catch {
    creatorOptions.value = []
  } finally {
    creatorSearching.value = false
  }
}

function handleCreatorChange(val) {
  const selected = creatorOptions.value.find(c => c.creator_id === val)
  if (selected) {
    form.creator_name = selected.creator_name
    form.creator_account = selected.creator_account
    form.creator_avatar = selected.creator_avatar
  } else {
    form.creator_name = ''
    form.creator_account = ''
    form.creator_avatar = ''
  }
}

function handlePlatformChange() {
  form.creator_id = ''
  form.creator_name = ''
  form.creator_account = ''
  form.creator_avatar = ''
  creatorOptions.value = []
}

function handlePlanChange(val) {
  const selected = planOptions.value.find(p => p.plan_id === val)
  form.plan_name = selected ? selected.plan_name : ''
}

function getFileType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase()
  const map = { doc: 'word', docx: 'word', txt: 'txt', pdf: 'pdf', ppt: 'ppt', pptx: 'ppt', jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', bmp: 'image', xls: 'excel', xlsx: 'excel' }
  return map[ext] || 'other'
}

function handleFileChange(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const allowedExts = ['doc', 'docx', 'txt', 'pdf', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'xls', 'xlsx']
  if (!allowedExts.includes(ext)) {
    uploadRef.value?.clearFiles()
    ElMessage.warning('不支持的文件格式')
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    uploadRef.value?.clearFiles()
    ElMessage.warning('文件大小不能超过10MB')
    return
  }
  form.script_file = file
  formRef.value?.validateField('script_file')
}

function handleFileRemove() {
  form.script_file = null
}

function handleClose() {
  visible.value = false
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const { createScript, updateScript } = await import('@/api/scriptManagement')

    if (!isEdit.value && !form.script_file) {
      ElMessage.warning('请上传脚本')
      loading.value = false
      return
    }

    if (isEdit.value) {
      const payload = {
        id: props.editData.id,
        platform: form.platform,
        creator_id: form.creator_id,
        creator_name: form.creator_name,
        creator_account: form.creator_account,
        creator_avatar: form.creator_avatar,
        plan_id: form.plan_id,
        plan_name: form.plan_name,
        remark: form.remark
      }
      if (form.script_file && form.script_file.raw) {
        payload.file_name = form.script_file.name
        payload.file_type = getFileType(form.script_file.name)
        payload.file_size = form.script_file.size
      }
      const res = await updateScript(payload)
      if (res.code === 0) {
        ElMessage.success(res.message)
        visible.value = false
        emit('success')
      } else {
        ElMessage.error('保存失败，请重试')
      }
    } else {
      const res = await createScript({
        platform: form.platform,
        creator_id: form.creator_id,
        creator_name: form.creator_name,
        creator_account: form.creator_account,
        creator_avatar: form.creator_avatar,
        plan_id: form.plan_id,
        plan_name: form.plan_name,
        remark: form.remark,
        file_name: form.script_file.name,
        file_type: getFileType(form.script_file.name),
        file_size: form.script_file.size
      })
      if (res.code === 0) {
        ElMessage.success(res.message)
        visible.value = false
        emit('success')
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

<style lang="scss" scoped>
.creator-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.creator-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.creator-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.creator-name {
  font-size: 14px;
  color: #333;
}

.creator-account {
  font-size: 12px;
  color: #999;
}

.upload-area {
  width: 100%;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.upload-icon {
  font-size: 28px;
  color: #1677ff;
}

.upload-text {
  font-size: 14px;
  color: #1677ff;
}

.upload-tip {
  font-size: 12px;
  color: #999;
}
</style>

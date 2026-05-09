<template>
  <el-dialog
    v-model="visible"
    title="添加标签"
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
      <el-form-item label="所属标签组" prop="tag_group_id" required>
        <el-select
          v-model="form.tag_group_id"
          placeholder="请选择所属标签组"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in groupOptions"
            :key="item.tag_group_id"
            :label="item.tag_group_name"
            :value="item.tag_group_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签名称" prop="tag_name" required>
        <el-input
          v-model="form.tag_name"
          placeholder="请输入标签名称"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="标签颜色" prop="tag_color">
        <el-select
          v-model="form.tag_color"
          placeholder="选择颜色"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="c in colorOptions"
            :key="c.value"
            :label="c.label"
            :value="c.value"
          >
            <div class="color-option">
              <span class="color-dot" :style="{ background: c.value }"></span>
              <span>{{ c.label }}</span>
            </div>
          </el-option>
        </el-select>
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
  groupOptions: { type: Array, default: () => [] },
  defaultGroupId: { type: String, default: '' },
  /** API 函数：addTag(data) */
  addFn: { type: Function, required: true }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(false)
const loading = ref(false)
const formRef = ref(null)

const colorOptions = [
  { label: '红色', value: '#ff6b6b' },
  { label: '橙色', value: '#ff9f43' },
  { label: '黄色', value: '#feca57' },
  { label: '绿色', value: '#2ed573' },
  { label: '青色', value: '#01a3a4' },
  { label: '蓝色', value: '#1677ff' },
  { label: '紫色', value: '#5f27cd' },
  { label: '粉色', value: '#fd79a8' },
  { label: '灰色', value: '#636e72' }
]

const form = reactive({
  tag_group_id: '',
  tag_name: '',
  tag_color: '',
  remark: ''
})

const rules = {
  tag_group_id: [
    { required: true, message: '请选择所属标签组', trigger: 'change' }
  ],
  tag_name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' }
  ]
}

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    form.tag_group_id = props.defaultGroupId || ''
    form.tag_name = ''
    form.tag_color = ''
    form.remark = ''
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
    const res = await props.addFn({
      tag_group_id: form.tag_group_id,
      tag_name: form.tag_name,
      tag_color: form.tag_color || '#1677ff'
    })
    if (res.code === 0) {
      ElMessage.success(res.message)
      visible.value = false
      emit('success')
    } else {
      if (res.code === 1003) {
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

<style lang="scss" scoped>
.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: none;
  flex-shrink: 0;
}
</style>

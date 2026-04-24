<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增记录"
    width="520px"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="记录类型" prop="recordType">
        <el-select v-model="form.recordType" placeholder="请选择记录类型" style="width: 100%">
          <el-option
            v-for="opt in recordTypeOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="达人" prop="influencerId">
        <el-select v-model="form.influencerId" placeholder="请选择达人" filterable style="width: 100%">
          <el-option
            v-for="opt in influencerOptions"
            :key="opt.id"
            :label="opt.name"
            :value="opt.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="合作商品" prop="productIds">
        <el-select v-model="form.productIds" multiple placeholder="请选择合作商品（可选）" style="width: 100%">
          <el-option
            v-for="prod in allProducts"
            :key="prod.id"
            :label="prod.name"
            :value="prod.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="跟进内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请填写跟进内容"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item v-if="form.recordType === 'sample_send'" label="样品单号" prop="sampleNo">
        <el-input v-model="form.sampleNo" placeholder="请填写样品单号" />
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
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  influencerOptions: {
    type: Array,
    default: () => []
  },
  recordTypeOptions: {
    type: Array,
    default: () => []
  },
  shopProductOptions: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  recordType: '',
  influencerId: '',
  productIds: [],
  content: '',
  sampleNo: ''
})

const rules = {
  recordType: [{ required: true, message: '请选择记录类型', trigger: 'change' }],
  influencerId: [{ required: true, message: '请选择达人', trigger: 'change' }],
  content: [{ required: true, message: '请填写跟进内容', trigger: 'blur' }],
  sampleNo: [{ required: true, message: '请填写样品单号', trigger: 'blur' }]
}

// 获取所有商品
const allProducts = computed(() => {
  const products = []
  Object.values(props.shopProductOptions).forEach(shopProds => {
    products.push(...shopProds)
  })
  return products
})

// 监听记录类型变化
watch(() => form.recordType, (newVal) => {
  if (newVal !== 'sample_send') {
    form.sampleNo = ''
  }
})

function handleClose() {
  formRef.value?.resetFields()
  form.recordType = ''
  form.influencerId = ''
  form.productIds = []
  form.content = ''
  form.sampleNo = ''
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (!valid) return

    if (form.recordType === 'sample_send' && !form.sampleNo) {
      ElMessage.warning('请填写样品单号')
      return
    }

    loading.value = true
    setTimeout(() => {
      loading.value = false
      emit('success')
    }, 500)
  })
}
</script>

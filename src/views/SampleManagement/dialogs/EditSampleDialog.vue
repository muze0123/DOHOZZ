<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑样品"
    width="560px"
    @close="handleClose"
  >
    <div class="edit-form">
      <div class="form-item">
        <div class="form-label">样品ID</div>
        <div class="form-value">{{ sample?.id }}</div>
      </div>
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>商品</div>
          <el-select
            v-model="productId"
            placeholder="请选择商品"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="p in productOptions"
              :key="p.id"
              :label="p.name"
              :value="p.id"
            />
          </el-select>
        </div>
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>达人</div>
          <el-select
            v-model="influencerId"
            placeholder="请选择达人"
            filterable
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
      </div>
      <div class="form-row">
        <div class="form-item">
          <div class="form-label">收货人姓名</div>
          <el-input
            v-model="recipientName"
            placeholder="请输入收货人姓名"
          />
        </div>
        <div class="form-item">
          <div class="form-label">联系电话</div>
          <el-input
            v-model="recipientPhone"
            placeholder="请输入联系电话"
          />
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">收货地址</div>
        <el-input
          v-model="recipientAddress"
          type="textarea"
          :rows="2"
          placeholder="请输入收货地址"
        />
      </div>
      <div class="form-item">
        <div class="form-label">备注</div>
        <el-input
          v-model="note"
          type="textarea"
          :rows="2"
          placeholder="请输入备注信息"
        />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  sample: {
    type: Object,
    default: null
  },
  productOptions: {
    type: Array,
    default: () => []
  },
  influencerOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const productId = ref('')
const influencerId = ref('')
const recipientName = ref('')
const recipientPhone = ref('')
const recipientAddress = ref('')
const note = ref('')

watch(() => props.sample, (newSample) => {
  if (newSample) {
    productId.value = newSample.product?.id || ''
    influencerId.value = newSample.influencer?.id || ''
    recipientName.value = newSample.recipient?.name || ''
    recipientPhone.value = newSample.recipient?.phone || ''
    recipientAddress.value = newSample.recipient?.address || ''
    note.value = newSample.note || ''
  }
}, { immediate: true })

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

function resetForm() {
  productId.value = ''
  influencerId.value = ''
  recipientName.value = ''
  recipientPhone.value = ''
  recipientAddress.value = ''
  note.value = ''
}

function handleConfirm() {
  if (!productId.value || !influencerId.value) {
    return
  }
  emit('success')
}
</script>

<style scoped>
.edit-form {
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

  .form-value {
    font-size: 14px;
    color: #666;
  }
}

.form-row {
  display: flex;
  gap: 16px;

  .form-item {
    flex: 1;
  }
}
</style>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="发货"
    width="520px"
    @close="handleClose"
  >
    <div class="ship-form">
      <div class="form-item">
        <div class="form-label">样品ID</div>
        <div class="form-value">{{ sample?.id }}</div>
      </div>
      <div class="form-item">
        <div class="form-label">收货人</div>
        <div class="form-value">{{ sample?.recipient?.name }} {{ sample?.recipient?.phone }}</div>
      </div>
      <div class="form-item">
        <div class="form-label">收货地址</div>
        <div class="form-value">{{ sample?.recipient?.address }}</div>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>物流公司</div>
        <el-select
          v-model="logisticsCompany"
          placeholder="请选择物流公司"
          style="width: 100%"
        >
          <el-option
            v-for="opt in logisticsOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>物流单号</div>
        <el-input
          v-model="logisticsNo"
          placeholder="请输入物流单号"
        />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认发货</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  sample: {
    type: Object,
    default: null
  },
  logisticsOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const logisticsCompany = ref('')
const logisticsNo = ref('')

function handleClose() {
  dialogVisible.value = false
  logisticsCompany.value = ''
  logisticsNo.value = ''
}

function handleConfirm() {
  if (!logisticsCompany.value || !logisticsNo.value) {
    return
  }
  emit('success')
}
</script>

<style scoped>
.ship-form {
  padding: 8px 0;
}

.form-item {
  margin-bottom: 16px;
}

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
  line-height: 1.6;
}
</style>

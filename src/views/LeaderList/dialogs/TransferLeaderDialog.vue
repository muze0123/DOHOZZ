<template>
  <el-dialog v-model="dialogVisible" title="转移团长" width="520px" @close="handleClose">
    <div class="transfer-tip">
      操作转移成功后，该团长将立即与接管BD进行绑定。同时，转出BD交付中的合作单按照实际接管日期终止，系统为接管BD创建新的合作单，合作单开始时间和数据将从实际接管日期第二天开始计算。
    </div>
    <div class="form">
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>转出BD</div>
        <el-select v-model="outBdId" placeholder="请选择转出BD" filterable style="width: 100%">
          <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>接管BD</div>
        <el-select v-model="inBdId" placeholder="请选择接管BD" filterable style="width: 100%">
          <el-option v-for="bd in bdOptions.filter(b => b.id !== outBdId)" :key="bd.id" :label="bd.name" :value="bd.id" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>接管时间</div>
        <el-date-picker v-model="transferTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
      </div>
      <div class="form-item">
        <div class="form-label">转移原因</div>
        <el-input v-model="reason" type="textarea" :rows="3" placeholder="请输入转移原因" maxlength="100" show-word-limit />
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
  modelValue: Boolean,
  leader: { type: Object, default: null },
  bdOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const outBdId = ref('')
const inBdId = ref('')
const transferTime = ref('')
const reason = ref('')

function handleClose() {
  dialogVisible.value = false
  outBdId.value = ''
  inBdId.value = ''
  transferTime.value = ''
  reason.value = ''
}

function handleConfirm() {
  if (!outBdId.value) { ElMessage.warning('请选择转出BD'); return }
  if (!inBdId.value) { ElMessage.warning('请选择接管BD'); return }
  if (inBdId.value === outBdId.value) { ElMessage.warning('接管BD不能与转出BD相同'); return }
  if (!transferTime.value) { ElMessage.warning('请选择接管日期'); return }
  emit('success')
}
</script>

<style scoped>
.transfer-tip {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
}
.form { padding: 8px 0; }
.form-item { margin-bottom: 16px; }
.form-label { font-size: 14px; color: #333; margin-bottom: 8px; }
.required { color: #ff4d4f; margin-right: 4px; }
</style>

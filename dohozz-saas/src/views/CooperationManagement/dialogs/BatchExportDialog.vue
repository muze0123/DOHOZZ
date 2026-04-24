<template>
  <el-dialog v-model="dialogVisible" title="批量导出合作单" width="480px" @close="handleClose">
    <div class="export-form">
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>导出格式</div>
        <el-select v-model="exportFormat" placeholder="请选择导出格式" style="width: 100%">
          <el-option label="Excel" value="excel" />
          <el-option label="CSV" value="csv" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>导出范围</div>
        <el-radio-group v-model="exportScope">
          <el-radio label="current">当前页</el-radio>
          <el-radio label="selected">已选中</el-radio>
        </el-radio-group>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定导出</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
const props = defineProps({ modelValue: Boolean, selectedCount: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue'])
const dialogVisible = computed({ get: () => props.modelValue, set: (val) => emit('update:modelValue', val) })
const exportFormat = ref('excel')
const exportScope = ref('current')
function handleClose() { dialogVisible.value = false }
function handleConfirm() {
  if (exportScope.value === 'selected' && props.selectedCount === 0) { ElMessage.warning('请至少选择一个合作单'); return }
  ElMessage.success('导出成功')
  dialogVisible.value = false
}
</script>

<style scoped>
.export-form { padding: 8px 0; }
.form-item { margin-bottom: 20px; .form-label { font-size: 14px; color: #333; margin-bottom: 8px; .required { color: #ff4d4f; margin-right: 4px; } } }
</style>

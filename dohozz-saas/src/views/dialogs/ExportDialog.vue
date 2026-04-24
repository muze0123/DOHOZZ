<template>
  <el-dialog
    v-model="dialogVisible"
    title="导出数据"
    width="420px"
    @close="handleClose"
  >
    <el-form :model="form" ref="formRef" label-width="80px">
      <el-form-item label="导出格式">
        <el-radio-group v-model="form.format">
          <el-radio label="excel">Excel</el-radio>
          <el-radio label="csv">CSV</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="导出范围">
        <el-radio-group v-model="form.scope">
          <el-radio label="current">当前页</el-radio>
          <el-radio label="all">全部数据</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="export-tip">
        <el-alert
          v-if="form.scope === 'all'"
          title="数据量较大，建议按页导出"
          type="warning"
          :closable="false"
          show-icon
        />
      </div>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  format: 'excel',
  scope: 'current'
})

function handleClose() {
  form.format = 'excel'
  form.scope = 'current'
}

function handleSubmit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    emit('success')
  }, 500)
}
</script>

<style scoped>
.export-tip {
  margin-top: 8px;
}
</style>

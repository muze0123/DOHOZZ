<template>
  <el-dialog v-model="dialogVisible" title="手动添加团长" width="560px" @close="handleClose">
    <div class="form">
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>团长名称</div>
          <el-input v-model="name" placeholder="请输入团长名称" />
        </div>
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>团长主页链接</div>
          <el-input v-model="homeUrl" placeholder="请输入团长主页链接" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>所属BD</div>
          <el-select v-model="bdId" placeholder="请选择BD" filterable style="width: 100%">
            <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
          </el-select>
        </div>
        <div class="form-item">
          <div class="form-label">带货类目</div>
          <el-input v-model="category" placeholder="请输入带货类目" />
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">备注</div>
        <el-input v-model="remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="200" show-word-limit />
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
  bdOptions: { type: Array, default: () => [] },
  shopOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const name = ref('')
const homeUrl = ref('')
const bdId = ref('')
const category = ref('')
const remark = ref('')

function handleClose() {
  dialogVisible.value = false
  name.value = ''
  homeUrl.value = ''
  bdId.value = ''
  category.value = ''
  remark.value = ''
}

function handleConfirm() {
  if (!name.value) { ElMessage.warning('请输入团长名称'); return }
  if (!homeUrl.value) { ElMessage.warning('请输入团长主页链接'); return }
  if (!bdId.value) { ElMessage.warning('请选择所属BD'); return }
  emit('success')
}
</script>

<style scoped>
.form { padding: 8px 0; }
.form-item { margin-bottom: 16px; }
.form-row { display: flex; gap: 16px; .form-item { flex: 1; } }
.form-label { font-size: 14px; color: #333; margin-bottom: 8px; }
.required { color: #ff4d4f; margin-right: 4px; }
</style>

<template>
  <el-drawer v-model="dialogVisible" title="添加团长合作" size="560px" @close="handleClose">
    <div class="form">
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>团长名称</div>
          <el-input v-model="form.leaderName" placeholder="请输入团长名称" />
        </div>
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>团长主页链接</div>
          <el-input v-model="form.homeUrl" placeholder="请输入团长主页链接" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>合作BD</div>
          <el-select v-model="form.bdId" placeholder="请选择合作BD" filterable style="width: 100%">
            <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
          </el-select>
        </div>
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>归属模式</div>
          <el-select v-model="form.mode" placeholder="请选择归属模式" style="width: 100%">
            <el-option v-for="mode in modeOptions" :key="mode.value" :label="mode.label" :value="mode.value" />
          </el-select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>合作开始时间</div>
          <el-date-picker v-model="form.startTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
        </div>
        <div class="form-item">
          <div class="form-label">合作结束时间</div>
          <el-date-picker v-model="form.endTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">备注</div>
        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="200" show-word-limit />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const form = ref({
  leaderName: '',
  homeUrl: '',
  bdId: null,
  mode: null,
  startTime: '',
  endTime: '',
  remark: ''
})

const bdOptions = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' }
])

const modeOptions = [
  { value: 'leader', label: '团长归属' },
  { value: 'activity', label: '活动归属' },
  { value: 'influencer', label: '达人归属' },
  { value: 'product', label: '商品归属' }
]

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

function resetForm() {
  form.value = {
    leaderName: '',
    homeUrl: '',
    bdId: null,
    mode: null,
    startTime: '',
    endTime: '',
    remark: ''
  }
}

function handleConfirm() {
  if (!form.value.leaderName) { ElMessage.warning('请输入团长名称'); return }
  if (!form.value.homeUrl) { ElMessage.warning('请输入团长主页链接'); return }
  if (!form.value.bdId) { ElMessage.warning('请选择合作BD'); return }
  if (!form.value.mode) { ElMessage.warning('请选择归属模式'); return }
  if (!form.value.startTime) { ElMessage.warning('请选择合作开始时间'); return }
  emit('success')
  handleClose()
}
</script>

<style scoped>
.form { padding: 8px 0; }
.form-item { margin-bottom: 16px; }
.form-row { display: flex; gap: 16px; .form-item { flex: 1; } }
.form-label { font-size: 14px; color: #333; margin-bottom: 8px; }
.required { color: #ff4d4f; margin-right: 4px; }
</style>

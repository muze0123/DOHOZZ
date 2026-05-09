<template>
  <el-dialog v-model="dialogVisible" title="修改团长备注" width="520px" @close="handleClose">
    <div class="form">
      <div class="form-item">
        <div class="form-label">团长名称</div>
        <div class="form-value">{{ leader?.name }}</div>
      </div>
      <div class="form-item">
        <div class="form-label">团长主页链接</div>
        <div class="form-value url">{{ leader?.homeUrl }}</div>
      </div>
      <div class="form-item">
        <div class="form-label">团长备注</div>
        <el-input v-model="remark" type="textarea" :rows="4" placeholder="请输入备注" maxlength="200" show-word-limit />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  leader: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const remark = ref('')

watch(() => props.leader, (l) => {
  if (l) remark.value = l.remark || ''
}, { immediate: true })

function handleClose() { dialogVisible.value = false }
function handleConfirm() { emit('success') }
</script>

<style scoped>
.form { padding: 8px 0; }
.form-item { margin-bottom: 16px; }
.form-label { font-size: 14px; color: #333; margin-bottom: 8px; }
.form-value { font-size: 14px; color: #666; &.url { word-break: break-all; font-size: 12px; } }
</style>

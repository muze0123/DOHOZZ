<template>
  <el-dialog v-model="dialogVisible" title="删除合作单" width="480px" @close="handleClose">
    <div class="dialog-tip warning">确定要删除合作单 <span class="highlight">{{ cooperation?.id }}</span> 吗？</div>
    <div class="dialog-sub-tip">删除后将无法恢复，请谨慎操作。</div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="danger" @click="handleConfirm">删除</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ modelValue: Boolean, cooperation: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'success'])
const dialogVisible = computed({ get: () => props.modelValue, set: (val) => emit('update:modelValue', val) })
function handleClose() { dialogVisible.value = false }
function handleConfirm() { emit('success') }
</script>

<style scoped>
.dialog-tip { font-size: 14px; color: #666; margin-bottom: 8px; line-height: 1.6; &.warning { color: #ff4d4f; } .highlight { font-weight: 600; color: #ff4d4f; } }
.dialog-sub-tip { font-size: 13px; color: #999; margin-top: -4px; }
</style>

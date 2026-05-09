<template>
  <el-dialog v-model="dialogVisible" title="创建类型说明" width="480px" @close="handleClose">
    <div class="rule-content">
      <p>1. <b>手动创建</b>：由运营人员手动填写的合作单信息</p>
      <p>2. <b>系统自动创建</b>：由系统根据达人申请自动生成的合作单</p>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleClose">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const dialogVisible = computed({ get: () => props.modelValue, set: (val) => emit('update:modelValue', val) })
function handleClose() { dialogVisible.value = false }
</script>

<style scoped>
.rule-content { p { font-size: 14px; color: #666; line-height: 1.8; margin: 0 0 8px 0; b { color: #333; } &:last-child { margin-bottom: 0; } } }
</style>

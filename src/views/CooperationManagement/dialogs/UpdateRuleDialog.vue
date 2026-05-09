<template>
  <el-dialog v-model="dialogVisible" title="数据更新规则" width="480px" @close="handleClose">
    <div class="rule-content">
      <p>1. 合作单数据每30分钟自动刷新一次</p>
      <p>2. 成交金额、结算金额等财务数据实时更新</p>
      <p>3. 状态变更会实时通知</p>
      <p>4. 数据更新为静默更新，不影响页面正常操作</p>
      <p>5. 如发现数据异常，请稍后刷新页面</p>
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
.rule-content { p { font-size: 14px; color: #666; line-height: 1.8; margin: 0 0 8px 0; &:last-child { margin-bottom: 0; } } }
</style>

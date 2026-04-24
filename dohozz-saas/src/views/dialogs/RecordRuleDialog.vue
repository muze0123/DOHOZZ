<template>
  <el-dialog
    v-model="dialogVisible"
    title="记录统计规则"
    width="480px"
    @close="handleClose"
  >
    <div class="rule-content">
      <p>1. 总记录数 = 手动记录数 + 系统记录数</p>
      <p>2. 手动记录：由运营人员手动添加的跟进记录</p>
      <p>3. 系统记录：由系统自动生成的跟进记录（如样品发货通知、合作状态变更等）</p>
      <p>4. 记录统计以创建时间为准，不受筛选条件影响</p>
      <p>5. 删除记录后，统计数据会实时更新</p>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleClose">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}
</script>

<style scoped>
.rule-content {
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.8;
    margin: 0 0 8px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

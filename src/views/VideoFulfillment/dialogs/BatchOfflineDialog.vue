<template>
  <el-dialog
    v-model="dialogVisible"
    title="批量下架视频"
    width="480px"
    @close="handleClose"
  >
    <div class="dialog-tip">
      您已选择 <span class="highlight">{{ selectedCount }}</span> 个视频，确定要批量下架吗？
    </div>
    <div class="dialog-sub-tip">
      下架后这些视频将不再展示。
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  selectedCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

function handleConfirm() {
  emit('success')
}
</script>

<style scoped>
.dialog-tip {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.6;
}

.highlight {
  font-weight: 600;
  color: #1677ff;
}

.dialog-sub-tip {
  font-size: 13px;
  color: #999;
  margin-top: -4px;
}
</style>

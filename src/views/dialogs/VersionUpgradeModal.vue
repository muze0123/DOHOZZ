<template>
  <el-dialog
    :model-value="visible"
    title="产品动态"
    width="480px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="version-modal-content">
      <div v-for="(line, idx) in contentLines" :key="idx" class="version-line">
        {{ line }}
      </div>
    </div>
    <template #footer>
      <div class="version-modal-footer">
        <button class="btn-know" @click="handleClose">我知道了</button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { ElDialog } from 'element-plus'

const props = defineProps({
  visible: { type: Boolean, default: false },
  content: { type: String, default: '' }
})

const emit = defineEmits(['update:visible', 'close'])

const contentLines = computed(() => {
  return props.content.split('\n').filter(line => line.trim())
})

function handleClose() {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
.version-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  font-size: 13px;
  color: #262626;
  line-height: 2;
}

.version-line {
  margin-bottom: 4px;
}

.version-modal-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #F0F0F0;
}

.btn-know {
  width: 100px;
  height: 32px;
  background: #1677FF;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.btn-know:hover {
  background: #4096FF;
}
</style>

<template>
  <el-dialog
    v-model="visible"
    title="表格设置"
    width="520px"
    :close-on-click-modal="false"
  >
    <div class="config-content">
      <el-checkbox-group v-model="selectedColumns">
        <div class="checkbox-grid">
          <el-checkbox
            v-for="col in allColumns"
            :key="col.key"
            :label="col.key"
            :disabled="selectedColumns.length <= 1 && selectedColumns.includes(col.key)"
          >
            {{ col.label }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  visibleColumns: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const allColumns = [
  { key: 'employee', label: '媒介/部门' },
  { key: 'followStreamerCount', label: '跟进达人' },
  { key: 'connectStreamerCount', label: '建联达人' },
  { key: 'cooperateStreamerCount', label: '合作达人' },
  { key: 'deliverStreamerCount', label: '交付达人' },
  { key: 'cooperationContentCount', label: '合作内容数' },
  { key: 'viewReadCount', label: '播放量/阅读量' },
  { key: 'interactionCount', label: '互动数' },
  { key: 'likeCount', label: '点赞' }
]

const selectedColumns = ref([])

watch(() => props.visibleColumns, (val) => {
  selectedColumns.value = val.map(c => c.key)
}, { immediate: true, deep: true })

const handleCancel = () => {
  selectedColumns.value = props.visibleColumns.map(c => c.key)
  visible.value = false
}

const handleConfirm = () => {
  const confirmed = selectedColumns.value.map(key => allColumns.find(c => c.key === key))
  emit('confirm', confirmed)
  visible.value = false
}
</script>

<style lang="scss" scoped>
.config-content {
  padding: 16px 0;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
<template>
  <el-dialog
    v-model="visible"
    title="选择时间范围"
    width="420px"
    :close-on-click-modal="false"
  >
    <div class="dialog-content">
      <div class="section">
        <div class="section-title">时间维度：</div>
        <div class="dimension-btns">
          <span
            v-for="dim in dimensions"
            :key="dim.key"
            class="dim-btn"
            :class="{ active: selectedDimension === dim.key }"
            @click="selectedDimension = dim.key"
          >
            {{ dim.label }}
          </span>
        </div>
      </div>
      <div class="section" v-if="selectedDimension === 'custom'">
        <div class="section-title">自定义时间范围：</div>
        <div class="date-range">
          <el-date-picker
            v-model="customRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            size="small"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedDimension = ref('all')
const customRange = ref([])

const dimensions = [
  { key: 'all', label: '全部' },
  { key: 'naturalDay', label: '自然日' },
  { key: 'naturalWeek', label: '自然周' },
  { key: 'naturalMonth', label: '自然月' },
  { key: 'custom', label: '自定义' }
]

const handleConfirm = () => {
  emit('confirm', {
    dimension: selectedDimension.value,
    customRange: customRange.value
  })
  visible.value = false
}
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 8px 0;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.dimension-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dim-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 150ms ease;

  &:hover {
    border-color: #1677ff;
    color: #1677ff;
  }

  &.active {
    background: #1677ff;
    border-color: #1677ff;
    color: #fff;
  }
}

.date-range {
  display: flex;
  gap: 12px;
}
</style>
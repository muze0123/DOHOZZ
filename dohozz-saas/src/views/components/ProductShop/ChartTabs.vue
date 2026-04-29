<template>
  <div class="chart-tabs">
    <span
      v-for="tab in tabs"
      :key="tab.value"
      class="chart-tab"
      :class="{ active: modelValue === tab.value }"
      @click="handleClick(tab.value)"
    >
      {{ tab.label }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'shop' },
  tabs: { type: Array, default: () => [{ label: '店铺指标分析', value: 'shop' }, { label: '商品指标分析', value: 'product' }] }
})

const emit = defineEmits(['update:modelValue', 'change'])

function handleClick(val) {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style scoped>
.chart-tabs {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.chart-tab {
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.2s;
}

.chart-tab:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.chart-tab.active {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}
</style>

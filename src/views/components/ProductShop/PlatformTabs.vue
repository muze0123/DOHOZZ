<template>
  <div class="platform-tabs">
    <span
      v-for="p in platforms"
      :key="p"
      class="platform-tab"
      :class="{ active: modelValue === p }"
      @click="handleClick(p)"
    >
      {{ p }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '全部' },
  platforms: { type: Array, default: () => ['全部', '抖音', '快手', '视频号', '小红书'] }
})

const emit = defineEmits(['update:modelValue', 'change'])

function handleClick(platform) {
  emit('update:modelValue', platform)
  emit('change', platform)
}
</script>

<style scoped>
.platform-tabs {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.platform-tab {
  cursor: pointer;
  padding: 4px 8px;
  color: #666;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.platform-tab:hover {
  color: #333;
}

.platform-tab.active {
  color: #333;
  font-weight: 600;
  border-bottom-color: #333;
}
</style>

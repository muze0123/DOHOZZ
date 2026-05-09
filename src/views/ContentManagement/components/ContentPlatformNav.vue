<template>
  <div class="platform-nav">
    <div class="platform-tabs">
      <div
        v-for="tab in platforms"
        :key="tab.key"
        class="platform-tab"
        :class="{ active: active === tab.key }"
        @click="handleChange(tab.key)"
      >
        <span>{{ tab.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  platforms: {
    type: Array,
    default: () => [
      { key: 'douyin', label: '抖音' },
      { key: 'xiaohongshu', label: '小红书' }
    ]
  },
  active: {
    type: String,
    default: 'douyin'
  }
})

const emit = defineEmits(['change'])

function handleChange(key) {
  emit('change', key)
}
</script>

<style scoped lang="scss">
.platform-nav {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.platform-tabs {
  display: flex;
  gap: 0;
  padding: 0 20px;
}

.platform-tab {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: #333;
  }

  &.active {
    color: #1677ff;
    font-weight: 500;
    border-bottom-color: #1677ff;
  }
}
</style>

<template>
  <div class="platform-tabs">
    <div
      v-for="platform in platforms"
      :key="platform.value"
      class="tab-item"
      :class="{ active: modelValue === platform.value }"
      @click="handleTabClick(platform.value)"
    >
      <div class="tab-icon">
        <svg v-if="platform.value === 'tiktok'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.14a8.18 8.18 0 0 0 4.76 1.45v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
        <svg v-else-if="platform.value === 'instagram'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
        </svg>
        <svg v-else-if="platform.value === 'shopee'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12.15 2.25a.75.75 0 0 0-.75.75v1.52a5.25 5.25 0 0 0-3.57 9.23.75.75 0 1 0 1.28.78A6.75 6.75 0 0 1 17.9 15.6V10.8a.75.75 0 0 0-.57-.73 1.49 1.49 0 0 0-1.18.25l-2.46 1.68a2.25 2.25 0 0 1-2.24.16l-.73-.34a1.25 1.25 0 0 0-1.18.25.75.75 0 0 0-.32.8v2.38a.75.75 0 0 0 .75.75h9.14a.75.75 0 0 0 .75-.75V5.01a.75.75 0 0 0-.65-.75h-4.89a.75.75 0 0 0 0 1.5h3.34V2.99a.75.75 0 0 0-.75-.75h-.89z"/>
        </svg>
        <svg v-else-if="platform.value === 'lazada'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M21.1 8.1c-.1-.3-.3-.6-.6-.8-.1-.1-.3-.1-.4-.2-.5-.2-1-.3-1.6-.3H5.9L5.2 2.1c0-.1-.1-.1-.2-.1H1.1c-.4 0-.8.3-.8.8v16.5c0 .4.3.8.8.8h5.2c.3 0 .5-.1.6-.4l.6-1.5h12.6c.5 0 .9-.4.9-.9V8.9c.1-.3 0-.6-.1-.8zm-1.2 7.4H6.5l-.6 1.5H4.5V3.8h13.8l.6 1.5h1.6v9.2h-.6z"/>
        </svg>
      </div>
      <span class="tab-name">{{ platform.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'tiktok',
    validator: (value) => ['tiktok', 'instagram', 'shopee', 'lazada'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const platforms = [
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Shopee', value: 'shopee' },
  { label: 'Lazada', value: 'lazada' }
]

const handleTabClick = (value) => {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
$meta-blue: #0064E0;
$primary-text: #050505;
$secondary-text: #65676B;
$divider: #E8E8E8;

.platform-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid $divider;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  transition: all 150ms ease;
  color: $secondary-text;

  &:hover {
    color: $primary-text;
  }

  &.active {
    color: $meta-blue;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: -13px;
      left: 0;
      width: 100%;
      height: 2px;
      background: $meta-blue;
      border-radius: 2px;
    }
  }
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
}

.tab-name {
  font-size: 14px;
  font-weight: 500;
}
</style>

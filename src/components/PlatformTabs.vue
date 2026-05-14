<template>
  <div class="platform-tabs-bar">
    <div class="platform-tabs">
      <div
        v-for="platform in displayPlatforms"
        :key="platform.id"
        class="platform-tab"
        :class="{ active: modelValue === platform.id }"
        @click="handleSelect(platform.id)"
      >
        <div class="platform-icon tiktok-icon" v-if="platform.id === 'tiktok'">
          <img src="@/assets/images/TikTok.png" alt="TikTok" />
        </div>
        <div class="platform-icon instagram-icon" v-else-if="platform.id === 'instagram'">
          <img src="@/assets/images/Instagram.png" alt="Instagram" />
        </div>
        <div class="platform-icon shopee-icon" v-else-if="platform.id === 'shopee'">
          <img src="@/assets/images/Shopee.png" alt="Shopee" />
        </div>
        <div class="platform-icon lazada-icon" v-else-if="platform.id === 'lazada'">
          <img src="@/assets/images/Lazada.png" alt="Lazada" />
        </div>
        <div class="platform-icon all-icon" v-else-if="platform.id === 'all'">
          <IconAllPlatform />
        </div>
        <span>{{ platform.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IconAllPlatform from './icons/IconAllPlatform.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'tiktok'
  },
  showAll: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const allPlatforms = [
  { id: 'all', name: '全部' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'shopee', name: 'Shopee' },
  { id: 'lazada', name: 'Lazada' }
]

const platformsWithoutAll = [
  { id: 'tiktok', name: 'TikTok' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'shopee', name: 'Shopee' },
  { id: 'lazada', name: 'Lazada' }
]

const displayPlatforms = computed(() => {
  return props.showAll ? allPlatforms : platformsWithoutAll
})

const handleSelect = (platformId) => {
  emit('update:modelValue', platformId)
  emit('change', platformId)
}
</script>

<style lang="scss" scoped>
$primary-color: #0064E0;
$text-primary: #050505;
$text-secondary: #65676B;
$white: #FFFFFF;
$border-radius-lg: 12px;
$transition-fast: 150ms ease;

.platform-tabs-bar {
  background: $white;
  border: none;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  padding: 0 16px;
  margin: 0;
}

.platform-tabs {
  display: flex;
  gap: 32px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: $text-secondary;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all $transition-fast;
  position: relative;
  top: 1px;

  &:hover {
    color: $text-primary;
  }

  &.active {
    color: $primary-color;
    font-weight: 500;
    border-bottom-color: $primary-color;
  }

  .platform-icon {
    width: 20px;
    height: 20px;

    &.tiktok-icon {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
    }

    &.instagram-icon {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    &.shopee-icon {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    &.lazada-icon {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    &.all-icon {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      overflow: hidden;
      color: #1677ff;
    }
  }
}
</style>
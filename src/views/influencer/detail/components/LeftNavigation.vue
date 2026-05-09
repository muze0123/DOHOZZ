<template>
  <nav class="left-navigation">
    <div
      v-for="item in menuItems"
      :key="item.name"
      class="menu-item"
      :class="{ active: activeMenu === item.name }"
      @click="handleMenuClick(item.name)"
    >
      <span class="menu-icon">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="4" fill="currentColor" />
        </svg>
      </span>
      <span class="menu-text">{{ item.name }}</span>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  activeMenu: {
    type: String,
    default: '基础分析'
  }
})

const emit = defineEmits(['menu-change'])

const menuItems = ref([
  { name: '基础分析', active: true },
  { name: '直播分析', active: false },
  { name: '视频分析', active: false },
  { name: '带货分析', active: false },
  { name: '粉丝分析', active: false },
  { name: '跟进分析', active: false }
])

// Sync active menu from props
watch(
  () => props.activeMenu,
  (newVal) => {
    menuItems.value.forEach((item) => {
      item.active = item.name === newVal
    })
  },
  { immediate: true }
)

const handleMenuClick = (menuName) => {
  emit('menu-change', menuName)
}
</script>

<style scoped>
.left-navigation {
  width: 140px;
  min-width: 140px;
  background: #ffffff;
  border-right: 1px solid #f0f0f0;
  padding: 16px 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
}

.menu-item {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #595959;
  font-size: 14px;
  position: relative;
  transition: all 0.2s ease;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  transition: background 0.2s ease;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #262626;
}

.menu-item.active {
  color: #1677ff;
  font-weight: 500;
  background: #f0f7ff;
}

.menu-item.active::before {
  background: #1677ff;
}

.menu-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon svg {
  width: 16px;
  height: 16px;
}

.menu-text {
  white-space: nowrap;
}
</style>
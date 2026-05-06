<template>
  <div class="filter-section">
    <!-- 平台Tab -->
    <div class="platform-tabs-bar">
      <div class="platform-tabs">
        <div
          v-for="p in platformTabs"
          :key="p.id"
          class="platform-tab"
          :class="{ active: modelValue.platform === p.id }"
          @click="handlePlatformChange(p.id)"
        >
          <div class="platform-icon" v-html="p.icon"></div>
          <span>{{ p.name }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选条件区块 -->
    <div class="filter-toolbar" ref="filterToolbarRef">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">全部部门</span>
          <el-select
            v-model="localDepartment"
            placeholder="全部部门"
            filterable
            clearable
            size="small"
            class="filter-select"
            @change="handleFilterChange"
          >
            <el-option label="全部部门" value="" />
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">全部媒介</span>
          <el-select
            v-model="localMedium"
            placeholder="全部媒介"
            filterable
            clearable
            size="small"
            class="filter-select"
            @change="handleFilterChange"
          >
            <el-option label="全部媒介" value="" />
            <el-option
              v-for="medium in mediumList"
              :key="medium.id"
              :label="medium.name"
              :value="medium.id"
            />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      platform: 'all',
      department: '',
      medium: ''
    })
  },
  departmentList: {
    type: Array,
    default: () => []
  },
  mediumList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const filterToolbarRef = ref(null)

const checkFilterToolbarSticky = () => {
  const el = filterToolbarRef.value
  if (el) {
    const rect = el.getBoundingClientRect()
    if (rect.top <= 60) {
      el.classList.add('is-stuck')
    } else {
      el.classList.remove('is-stuck')
    }
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', checkFilterToolbarSticky)
    checkFilterToolbarSticky()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', checkFilterToolbarSticky)
  }
})

const localDepartment = ref(props.modelValue.department)
const localMedium = ref(props.modelValue.medium)

watch(() => props.modelValue, (val) => {
  localDepartment.value = val.department
  localMedium.value = val.medium
}, { deep: true })

const platformTabs = [
  {
    id: 'all',
    name: '全部',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>'
  },
  {
    id: 'douyin',
    name: '抖音',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>'
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>'
  }
]

const handlePlatformChange = (platform) => {
  emit('update:modelValue', { ...props.modelValue, platform })
  emit('change', props.modelValue)
}

const handleFilterChange = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    department: localDepartment.value,
    medium: localMedium.value
  })
  emit('change', props.modelValue)
}
</script>

<style lang="scss" scoped>
$primary: #1677ff;
$primary-text: #050505;
$secondary-text: #65676B;
$text-2: #65676B;
$white: #ffffff;
$fast: 150ms ease;
$border-radius-lg: 12px;

.platform-tabs-bar {
  background: $white;
  border: none;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  padding: 0 16px;
  margin-top: 16px;
}
.platform-tabs { display: flex; gap: 32px; }
.platform-tab {
  display: flex; align-items: center; gap: 8px; padding: 12px 0;
  color: $secondary-text; cursor: pointer; border-bottom: 2px solid transparent;
  transition: all $fast; position: relative; top: 1px;
  &:hover { color: $primary-text; }
  &.active { color: $primary; font-weight: 500; border-bottom-color: $primary; }
  .platform-icon {
    width: 20px; height: 20px;
  }
}
.filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: $white;
  border-top: 1px solid #E8E8E8;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  position: sticky;
  top: 60px;
  z-index: 89;
  transition: box-shadow 0.3s ease;
}
.filter-toolbar.is-stuck {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.filter-row { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
.filter-item { display: flex; align-items: center; flex-shrink: 0; }
.filter-label { margin-right: 10px; color: #4e5969; font-family: PingFang SC; font-size: 13px; font-style: normal; font-weight: 400; white-space: nowrap; text-align: right; }
.filter-select {
  width: 200px;
  :deep(.el-select__wrapper) {
    height: 32px !important;
  }
}
:deep(.el-input__wrapper) {
  height: 32px !important;
}
</style>

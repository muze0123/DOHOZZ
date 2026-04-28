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
    <div class="filter-toolbar">
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
import { ref, watch } from 'vue'

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
$primary-text: #333333;
$secondary-text: #666666;
$border: #e8e8e8;
$white: #ffffff;
$bg: #f5f5f5;
$radius: 8px;

.filter-section {
  margin-bottom: 16px;
}

.platform-tabs-bar {
  background: $white;
  border: 1px solid $border;
  border-bottom: none;
  border-radius: $radius $radius 0 0;
  padding: 0 16px;
}

.platform-tabs {
  display: flex;
  gap: 24px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: $secondary-text;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 150ms ease;
  position: relative;
  top: 1px;

  .platform-icon {
    display: flex;
    align-items: center;
  }

  &:hover {
    color: $primary-text;
  }

  &.active {
    color: $primary;
    font-weight: 500;
    border-bottom-color: $primary;
  }
}

.filter-toolbar {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid $border;
  border-top: none;
  border-radius: 0 0 $radius $radius;
  background: $white;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.filter-label {
  font-size: 13px;
  color: $primary-text;
  font-weight: 500;
  white-space: nowrap;
}

.filter-select {
  width: 160px;
}
</style>

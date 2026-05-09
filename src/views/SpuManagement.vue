<template>
  <div class="spu-management">
    <!-- 平台Tab -->
    <div class="platform-tabs-bar">
      <div class="platform-tabs">
        <div
          v-for="platform in platforms"
          :key="platform.id"
          class="platform-tab"
          :class="{ active: activePlatform === platform.id }"
          @click="activePlatform = platform.id"
        >
          <div class="platform-icon" v-html="platform.icon"></div>
          <span>{{ platform.name }}</span>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-item">
        <el-input
          v-model="searchSpuName"
          placeholder="请输入SPU名称"
          class="search-input"
          size="small"
        >
          <template #suffix>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
            </svg>
          </template>
        </el-input>
      </div>
      <div class="search-item">
        <el-input
          v-model="searchPlan"
          placeholder="请输入计划标题/ID搜索"
          class="search-input"
          size="small"
        >
          <template #suffix>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
            </svg>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="main-area">
      <div class="section-header">
        <div class="section-title-group">
          <span class="section-title">SPU列表</span>
          <span class="update-time">数据更新时间：2026.03.20-2026.3.26</span>
        </div>
        <div class="header-right">
          <div class="time-tabs">
            <span
              v-for="tab in timeTabs"
              :key="tab.key"
              class="time-tab"
              :class="{ active: selectedTimeTab === tab.key }"
              @click="selectedTimeTab = tab.key"
            >
              {{ tab.label }}
            </span>
          </div>
          <span class="time-range">近7天（2025/11/20 - 2025/11/26）</span>
          <el-button size="small" type="primary" class="add-btn">
            添加SPU
          </el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>SPU信息</th>
              <th class="sortable">推广计划 <span class="sort-arrow">↕</span></th>
              <th class="sortable">关联内容 <span class="sort-arrow">↕</span></th>
              <th class="sortable">推广达人 <span class="sort-arrow">↕</span></th>
              <th class="sortable">播放量 <span class="sort-arrow">↕</span></th>
              <th class="sortable">互动数 <span class="sort-arrow">↕</span></th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData" :key="index">
              <td>
                <div class="spu-info">
                  <div class="spu-placeholder">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#ccc">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  <div class="spu-detail">
                    <div class="spu-name">{{ row.name }}</div>
                    <div class="spu-desc">{{ row.desc }}</div>
                  </div>
                </div>
              </td>
              <td>{{ row.plans }}</td>
              <td>{{ row.contents }}</td>
              <td>{{ row.influencers }}</td>
              <td>{{ row.views }}</td>
              <td>{{ row.interactions }}</td>
              <td>
                <span class="action-link edit">编辑</span>
                <span class="action-divider">|</span>
                <span class="action-link delete">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <div class="pagination-controls">
          <div class="page-btn" @click="prevPage">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </div>
          <div
            v-for="page in visiblePages"
            :key="page"
            class="page-btn"
            :class="{ active: currentPage === page, ellipsis: page === '...' }"
            @click="page !== '...' && (currentPage = page)"
          >
            {{ page }}
          </div>
          <div class="page-btn" @click="nextPage">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </div>
        </div>
        <div class="page-info">
          <span>10条/页</span>
          <span class="page-jump">
            跳至 <input type="number" v-model="jumpPage" min="1" :max="totalPages" @keyup.enter="jumpToPage" /> 页
          </span>
          <span>共40条记录 第{{ currentPage }}/{{ totalPages }}页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const activePlatform = ref('all')
const searchSpuName = ref('')
const searchPlan = ref('')
const selectedTimeTab = ref('all')
const currentPage = ref(1)
const jumpPage = ref(1)

const platforms = [
  { id: 'all', name: '全部', icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>' },
  { id: 'tiktok', name: 'Tiktok', icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>' },
  { id: 'instagram', name: 'Instagram', icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' },
  { id: 'shopee', name: 'Shopee', icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><circle cx="12" cy="12" r="10"/></svg>' },
  { id: 'lazada', name: 'Lazada', icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>' }
]

const timeTabs = [
  { key: 'all', label: '全部' },
  { key: 'recentN', label: '近N天' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'custom', label: '自定义' }
]

const tableData = reactive([
  { name: 'SPU名称', desc: '关联30个商品规格', plans: 10, contents: 100, influencers: 100, views: 100, interactions: 100 }
])

const totalPages = ref(8)

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  return pages
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const jumpToPage = () => {
  const page = parseInt(jumpPage.value)
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  } else {
    jumpPage.value = currentPage.value
  }
}
</script>

<style lang="scss" scoped>
$meta-blue: #0064E0;
$meta-blue-hover: #0143B5;
$white: #FFFFFF;
$soft-gray: #F5F6F7;
$primary-text: #050505;
$secondary-text: #65676B;
$disabled-text: #BCC0C4;
$divider: #E8E8E8;

$border-radius-sm: 4px;
$border-radius-md: 8px;

.spu-management {
  min-height: 100%;
  background: $soft-gray;
  padding: 16px;
}

// 平台Tab
.platform-tabs-bar {
  background: $white;
  border: 1px solid $divider;
  border-radius: $border-radius-md $border-radius-md 0 0;
  padding: 0 16px;
  margin: 0;
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
  transition: all 0.15s ease;
  position: relative;
  top: 1px;

  &:hover {
    color: $primary-text;
  }

  &.active {
    color: $meta-blue;
    font-weight: 500;
    border-bottom-color: $meta-blue;
  }

  .platform-icon {
    width: 18px;
    height: 18px;

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
}

// 搜索栏
.search-bar {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  background: $white;
  border: 1px solid $divider;
  border-top: none;
}

.search-item {
  flex: 1;
  max-width: 280px;
}

.search-input {
  width: 100%;
}

// 主体区域
.main-area {
  margin-top: 16px;
  background: $white;
  border: 1px solid $divider;
  border-radius: $border-radius-md;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid $divider;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $primary-text;
}

.update-time {
  font-size: 12px;
  color: $disabled-text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-tabs {
  display: flex;
  gap: 4px;
}

.time-tab {
  padding: 4px 12px;
  font-size: 13px;
  color: $secondary-text;
  cursor: pointer;
  border-radius: $border-radius-sm;
  transition: all 0.15s ease;

  &:hover {
    color: $primary-text;
  }

  &.active {
    background: $meta-blue;
    color: $white;
  }
}

.time-range {
  font-size: 12px;
  color: $disabled-text;
}

.add-btn {
  padding: 6px 16px;
}

// 数据表格
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid $divider;
  }

  th {
    color: $secondary-text;
    font-weight: 500;
    font-size: 12px;
    background: $soft-gray;
    white-space: nowrap;
  }

  .sortable {
    cursor: pointer;
    position: relative;
  }

  .sort-arrow {
    font-size: 10px;
    margin-left: 4px;
    color: $disabled-text;
  }

  tbody tr:hover {
    background: rgba($meta-blue, 0.03);
  }
}

.spu-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spu-placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $soft-gray;
  border-radius: $border-radius-sm;
}

.spu-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.spu-name {
  font-weight: 500;
  color: $primary-text;
}

.spu-desc {
  font-size: 12px;
  color: $disabled-text;
}

.action-link {
  font-size: 12px;
  cursor: pointer;
  transition: color 0.15s ease;

  &.edit {
    color: $meta-blue;
    &:hover {
      text-decoration: underline;
    }
  }

  &.delete {
    color: #E41E3F;
    &:hover {
      text-decoration: underline;
    }
  }
}

.action-divider {
  margin: 0 8px;
  color: $divider;
}

// 分页
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid $divider;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $divider;
  border-radius: $border-radius-sm;
  font-size: 13px;
  color: $secondary-text;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: $meta-blue;
    color: $meta-blue;
  }

  &.active {
    background: $meta-blue;
    border-color: $meta-blue;
    color: $white;
  }

  &.ellipsis {
    border: none;
    cursor: default;
    &:hover {
      color: $secondary-text;
    }
  }
}

.page-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: $secondary-text;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 4px;

  input {
    width: 48px;
    height: 28px;
    border: 1px solid $divider;
    border-radius: $border-radius-sm;
    text-align: center;
    outline: none;

    &:focus {
      border-color: $meta-blue;
    }
  }
}
</style>
<template>
  <div class="product-link">
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
          v-model="searchProduct"
          placeholder="商品标题/ID"
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
        <el-select v-model="productStatus" placeholder="商品状态" size="small" class="search-select">
          <el-option label="全部" value="all" />
          <el-option label="上架" value="online" />
          <el-option label="下架" value="offline" />
        </el-select>
      </div>
      <div class="search-item">
        <el-input
          v-model="searchChannel"
          placeholder="渠道名称/店铺名称搜索"
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
      <!-- 商品列表标题栏 -->
      <div class="section-header">
        <div class="section-title-group">
          <span class="section-title">商品列表</span>
          <div class="status-tabs">
            <span
              v-for="tab in statusTabs"
              :key="tab.key"
              class="status-tab"
              :class="{ active: selectedStatus === tab.key }"
              @click="selectedStatus = tab.key"
            >
              {{ tab.label }}
              <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
            </span>
          </div>
        </div>
        <div class="header-right">
          <span class="update-time">数据更新时间：2026-04-28 11:50</span>
          <el-button size="small" class="sync-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            同步数据
          </el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th></th>
              <th>商品信息</th>
              <th>商品来源</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData" :key="index">
              <td>
                <div class="checkbox-wrapper">
                  <input type="checkbox" :id="'checkbox-' + index" />
                  <label :for="'checkbox-' + index"></label>
                </div>
              </td>
              <td>
                <div class="product-info">
                  <div class="product-image">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="#ccc">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  <div class="product-detail">
                    <div class="product-name">{{ row.name }}</div>
                    <div class="product-id">{{ row.id }}</div>
                  </div>
                </div>
              </td>
              <td>{{ row.source }}</td>
              <td>
                <span class="status-badge" :class="row.statusClass">{{ row.status }}</span>
              </td>
              <td>{{ row.createTime }}</td>
              <td>
                <span class="action-link">查看报告</span>
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

const activePlatform = ref('douyin')
const searchProduct = ref('')
const productStatus = ref('all')
const searchChannel = ref('')
const selectedStatus = ref('all')
const currentPage = ref(1)
const jumpPage = ref(1)

const platforms = [
  { id: 'douyin', name: '抖音', icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12.521.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.62 3.09 1.75 4.15 1.13 1.07 2.69 1.61 4.22 1.75-.01 1.3-.02 2.6-.02 3.9 0 1.31.01 2.61.02 3.91-1.53.08-3.09.62-4.15 1.75-1.07 1.13-1.61 2.69-1.75 4.22-1.3.01-2.6.02-3.9.02-1.31 0-2.61-.01-3.91-.02-.08-1.53-.62-3.09-1.75-4.15C2.39 15.34 1.85 13.78 1.71 12.25c-.01-1.3-.02-2.6-.02-3.9 0-1.31-.01-2.61-.02-3.91 1.53-.08 3.09-.62 4.15-1.75C8.66 2.39 10.22 1.85 11.75 1.71c1.3-.01 2.6-.02 3.9-.02zm-.02 1.5c-1.26.01-2.52.01-3.77.02-.05 1.19-.35 2.4-.98 3.48-.63 1.08-1.52 2.06-2.61 2.69-.48.27-.71.41-.69.81.03.53.39 1.09.92 1.41.49.28 1.09.25 1.63.24.54.01 1.11.01 1.67.01.57 0 1.14 0 1.71-.01.46.01 1.06.04 1.55-.24.53-.32.89-.88.92-1.41.02-.39-.19-.56-.66-.83-1.05-.6-1.9-1.53-2.5-2.55-.63-1.08-.93-2.23-.98-3.38-.01-1.25-.01-2.51.02-3.76zm.01 1.5c-1.18.01-2.36 0-3.54.02-.02 1.02-.27 2.07-.82 3.02-.55.95-1.36 1.79-2.35 2.34-.48.26-.66.39-.64.79.03.5.41.96.91 1.21.49.25 1.04.22 1.57.21.53.01 1.06.01 1.59.01.53 0 1.07 0 1.6-.01.45.01 1.01.04 1.5-.21.5-.25.88-.71.91-1.21.02-.4-.16-.55-.63-.82-.96-.53-1.74-1.35-2.27-2.27-.54-.93-.79-1.95-.81-2.95-.02-1.18-.01-2.36.02-3.54zm.01 1.5c-.01.79.17 1.59.58 2.28.41.69 1.05 1.27 1.84 1.64.79.38 1.67.42 2.46.38-.01-.79-.17-1.59-.58-2.28-.41-.69-1.05-1.27-1.84-1.64-.79-.38-1.67-.42-2.46-.38zm0 .01c.68.02 1.37.22 2 .62.63.4 1.12 1 1.42 1.69-.68-.23-1.41-.35-2.14-.33-.73.02-1.46.17-2.14.38.3-.69.79-1.29 1.42-1.69.63-.4 1.32-.62 2-.62z"/></svg>' },
  { id: 'xiaohongshu', name: '小红书', icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.58-.54 1.09-1.08 1.41-.99.58-2.23.92-3.56.92s-2.57-.34-3.56-.92c-.54-.32-.93-.83-1.08-1.41-.15-.58-.01-1.2.39-1.69.4-.48 1.06-.69 1.74-.62.14.01 2.41.15 3.81 1.39 1.4-1.24 3.67-1.38 3.81-1.39.68-.07 1.34.14 1.74.62.4.49.54 1.11.39 1.69zM12 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>' }
]

const statusTabs = [
  { key: 'all', label: '全部', count: 100 },
  { key: 'pending', label: '待分发', count: 3 },
  { key: 'distributed', label: '已分发', count: 85 },
  { key: 'invalid', label: '已失效', count: 12 },
  { key: 'more', label: '更多' }
]

const tableData = reactive([
  { name: '【预售】DOHOZZ男士小白鞋百搭潮流休闲鞋简约板鞋', id: 'ID: 123456', source: '唯品会-广州DOHOZZ官方奥莱店', status: '已分发', statusClass: 'status-distributed', createTime: '2025-06-14 16:06' },
  { name: '【预售】DOHOZZ女士小白鞋百搭潮流休闲鞋简约板鞋', id: 'ID: 123457', source: '唯品会-广州DOHOZZ官方奥莱店', status: '已分发', statusClass: 'status-distributed', createTime: '2025-06-14 16:06' },
  { name: '【预售】DOHOZZ情侣小白鞋百搭潮流休闲鞋简约板鞋', id: 'ID: 123458', source: '唯品会-广州DOHOZZ官方奥莱店', status: '已分发', statusClass: 'status-distributed', createTime: '2025-06-14 16:06' },
  { name: '【预售】DOHOZZ新款小白鞋百搭潮流休闲鞋简约板鞋', id: 'ID: 123459', source: '唯品会-广州DOHOZZ官方奥莱店', status: '已分发', statusClass: 'status-distributed', createTime: '2025-06-14 16:06' },
  { name: '【预售】DOHOZZ限量版小白鞋百搭潮流休闲鞋简约板鞋', id: 'ID: 123460', source: '唯品会-广州DOHOZZ官方奥莱店', status: '已分发', statusClass: 'status-distributed', createTime: '2025-06-14 16:06' }
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
$success-green: #31A24C;

$border-radius-sm: 4px;
$border-radius-md: 8px;

.product-link {
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

.search-select {
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

.status-tabs {
  display: flex;
  gap: 4px;
}

.status-tab {
  padding: 4px 12px;
  font-size: 13px;
  color: $secondary-text;
  cursor: pointer;
  border-radius: $border-radius-sm;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: $primary-text;
  }

  &.active {
    background: $meta-blue;
    color: $white;
  }

  .tab-count {
    background: rgba(0, 0, 0, 0.2);
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 11px;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.update-time {
  font-size: 12px;
  color: $disabled-text;
}

.sync-btn {
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
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

  tbody tr:hover {
    background: rgba($meta-blue, 0.03);
  }
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  input {
    display: none;
  }

  label {
    width: 16px;
    height: 16px;
    border: 1px solid $divider;
    border-radius: 2px;
    cursor: pointer;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 4px;
      width: 5px;
      height: 10px;
      border: solid $white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
    }
  }

  input:checked + label {
    background: $meta-blue;
    border-color: $meta-blue;

    &::after {
      opacity: 1;
    }
  }
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $soft-gray;
  border-radius: $border-radius-sm;
  overflow: hidden;
}

.product-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 200px;
}

.product-name {
  font-weight: 500;
  color: $primary-text;
  font-size: 13px;
  line-height: 1.4;
}

.product-id {
  font-size: 11px;
  color: $disabled-text;
}

.status-badge {
  padding: 2px 8px;
  border-radius: $border-radius-sm;
  font-size: 12px;

  &.status-distributed {
    background: rgba($success-green, 0.1);
    color: $success-green;
  }
}

.action-link {
  font-size: 12px;
  color: $meta-blue;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    text-decoration: underline;
  }
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
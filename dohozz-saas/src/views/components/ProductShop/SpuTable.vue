<template>
  <div class="spu-table">
    <div class="section-header">
      <div class="header-left">
        <span class="section-title">出单SPU</span>
        <span class="data-range">数据范围: 2026/04/01-2026/04/29</span>
        <span class="update-time">数据更新时间: 2026-04-29 09:30</span>
      </div>

      <div class="header-actions">
        <el-button size="small" @click="handleExport">
          <span>导出</span>
        </el-button>

        <div class="tab-btns">
          <span
            class="tab-btn"
            :class="{ active: activeTab === 'spu' }"
            @click="activeTab = 'spu'"
          >
            SPU
          </span>
          <span
            class="tab-btn"
            :class="{ active: activeTab === 'link' }"
            @click="activeTab = 'link'"
          >
            商品链接
          </span>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入商品ID搜索"
        size="small"
        style="width: 240px;"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button icon="Search" @click="handleSearch" />
        </template>
      </el-input>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :default-sort="{ prop: 'salesAmount', order: 'descending' }"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="spuName" label="商品" min-width="180">
        <template #default="{ row }">
          <span class="product-name">{{ row.spuName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salesAmount" label="成交金额" sortable min-width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.salesAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="settlementAmount" label="结算金额" sortable min-width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.settlementAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="refundAmount" label="退款金额" sortable min-width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.refundAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="creatorCount" label="出单达人数" sortable min-width="100">
        <template #default="{ row }">
          {{ row.creatorCount }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <span class="action-link" @click="handleViewDetail(row)">查看详情</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <span class="total-count">共 {{ total }} 条</span>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
      <el-select v-model="pageSize" size="small" style="width: 100px;" @change="handlePageSizeChange">
        <el-option label="10条/页" :value="10" />
        <el-option label="20条/页" :value="20" />
        <el-option label="50条/页" :value="50" />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      list: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    })
  }
})

const activeTab = ref('spu')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const sortProp = ref('salesAmount')
const sortOrder = ref('descending')

const total = computed(() => props.data.total)

const tableData = computed(() => {
  let list = [...props.data.list]

  // 搜索过滤
  if (searchKeyword.value) {
    list = list.filter(item =>
      item.spuId.includes(searchKeyword.value) ||
      item.spuName.includes(searchKeyword.value)
    )
  }

  // 排序
  list.sort((a, b) => {
    const aVal = a[sortProp.value]
    const bVal = b[sortProp.value]
    const order = sortOrder.value === 'ascending' ? 1 : -1
    return (aVal - bVal) * order
  })

  return list
})

function formatAmount(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(2) + 'w'
  }
  return value.toLocaleString()
}

function handleSearch() {
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

function handleSortChange({ prop, order }) {
  sortProp.value = prop
  sortOrder.value = order
}

function handlePageChange(page) {
  currentPage.value = page
}

function handlePageSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
}

function handleExport() {
  ElMessage.success('导出成功')
}

function handleViewDetail(row) {
  // TODO: 跳转到SPU详情页
  console.log('查看详情', row)
}
</script>

<style scoped>
.spu-table {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.data-range,
.update-time {
  font-size: 13px;
  color: #999;
}

.tab-btns {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.2s;
}

.tab-btn.active {
  border-color: #1677ff;
  color: #1677ff;
}

.search-bar {
  margin-bottom: 16px;
}

.product-name {
  color: #1677ff;
  cursor: pointer;
}

.product-name:hover {
  text-decoration: underline;
}

.action-link {
  color: #ff4d4f;
  cursor: pointer;
}

.action-link:hover {
  text-decoration: underline;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.total-count {
  font-size: 13px;
  color: #666;
}
</style>

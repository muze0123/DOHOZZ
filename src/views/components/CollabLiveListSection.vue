<template>
  <div class="collab-live-list-section">
    <!-- 列表标题栏 -->
    <div class="list-header">
      <div class="header-left">
        <div class="sub-tabs">
          <span
            class="sub-tab"
            :class="{ active: currentSubTab === 'all' }"
            @click="handleSubTabChange('all')"
          >
            全部({{ safeSubTabs.allCount }})
          </span>
          <span
            class="sub-tab"
            :class="{ active: currentSubTab === 'hasOrder' }"
            @click="handleSubTabChange('hasOrder')"
          >
            有出单({{ safeSubTabs.hasOrderCount }})
          </span>
          <span
            class="sub-tab"
            :class="{ active: currentSubTab === 'noOrder' }"
            @click="handleSubTabChange('noOrder')"
          >
            未出单({{ safeSubTabs.noOrderCount }})
          </span>
        </div>
        <div class="update-time">
          数据更新时间：{{ updateTime }}
        </div>
      </div>
      <div class="header-right">
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <!-- 列表工具栏 -->
    <div class="list-toolbar">
      <el-input
        v-model="searchTitle"
        placeholder="搜索直播标题"
        clearable
        style="width: 200px"
        size="small"
        @keyup.enter="handleSearch"
      />
      <el-select
        v-model="currentHasPromote"
        placeholder="是否有投放"
        clearable
        style="width: 120px"
        size="small"
      >
        <el-option label="全部" value="" />
        <el-option label="是" value="true" />
        <el-option label="否" value="false" />
      </el-select>
    </div>

    <!-- 直播列表表格 -->
    <div class="table-container">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <el-table
        v-else
        :data="listData"
        style="width: 100%; min-width: 1800px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column label="视频 | 直播时间" min-width="200" fixed="left">
          <template #default="{ row }">
            <div class="video-cell">
              <div class="video-cover">
                <el-icon><VideoPlay /></el-icon>
              </div>
              <div class="video-info">
                <div class="video-title">{{ row.title }}</div>
                <div class="video-time">{{ row.liveTime }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="达人" min-width="150">
          <template #default="{ row }">
            <div class="influencer-cell">
              <div class="influencer-avatar">
                <el-icon><User /></el-icon>
              </div>
              <div class="influencer-info">
                <div class="influencer-name">{{ row.influencerName }}</div>
                <div class="influencer-followers">{{ row.followers }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合作商品" min-width="80">
          <template #default="{ row }">
            <el-tooltip
              v-if="row.productImage"
              :content="row.productName"
              placement="top"
              effect="dark"
            >
              <div class="product-thumbnail">
                <img :src="row.productImage" alt="" />
              </div>
            </el-tooltip>
            <span v-else class="no-product">--</span>
          </template>
        </el-table-column>
        <el-table-column label="归属员工" min-width="100">
          <template #default="{ row }">
            <span class="employee-name">{{ row.employee || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交金额 + 直播GMV占比" min-width="140">
          <template #default="{ row }">
            <div class="amount-cell">
              <div class="amount-value">¥{{ formatMoney(row.dealAmount) }}</div>
              <div class="amount-ratio">{{ row.gmvRatio || '--' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="销量" min-width="80">
          <template #default="{ row }">
            <span class="sales-value">{{ formatNumber(row.sales) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额 + 退款占比" min-width="140">
          <template #default="{ row }">
            <div class="amount-cell">
              <div class="amount-value warning">¥{{ formatMoney(row.refundAmount) }}</div>
              <div class="amount-ratio">{{ row.refundRatio || '--' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预估达人佣金" min-width="120">
          <template #default="{ row }">
            <span class="commission-value">¥{{ formatMoney(row.estimatedCommission) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否有投流" min-width="90">
          <template #default="{ row }">
            <span class="promote-tag" :class="row.hasPromote ? 'yes' : 'no'">
              {{ row.hasPromote ? '是' : '否' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="消耗金额" min-width="100">
          <template #default="{ row }">
            <span class="consume-value">¥{{ formatMoney(row.consumeAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交金额（投放）" min-width="120">
          <template #default="{ row }">
            <span class="deal-value">¥{{ formatMoney(row.promoDealAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交订单数（投放）" min-width="120">
          <template #default="{ row }">
            <span class="order-count">{{ formatNumber(row.promoOrderCount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付ROI" min-width="80">
          <template #default="{ row }">
            <span class="roi-value">{{ row.payRoi || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="直播时长" min-width="100">
          <template #default="{ row }">
            <span class="duration-value">{{ row.duration || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="观看人次" min-width="90">
          <template #default="{ row }">
            <span class="viewer-value">{{ formatNumber(row.viewers) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预估UV价值" min-width="100">
          <template #default="{ row }">
            <span class="uv-value">¥{{ formatMoney(row.uvValue) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && listData.length === 0" description="暂无直播数据" />
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <Pagination
        v-model="paginationState"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { VideoPlay, User, Goods, Loading } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination.vue'

const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  subTabs: {
    type: Object,
    default: () => ({
      allCount: 0,
      hasOrderCount: 0,
      noOrderCount: 0
    })
  },
  hasPromote: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  updateTime: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['filter-change', 'detail', 'export'])

// 安全访问subTabs
const safeSubTabs = computed(() => props.subTabs || {})

// 内部状态
const currentSubTab = ref('all')
const searchTitle = ref('')
const currentHasPromote = ref(props.hasPromote || '')
const paginationState = ref({ page: 1, pageSize: 10 })

// 监听hasPromote prop变化
watch(
  () => props.hasPromote,
  (val) => {
    currentHasPromote.value = val
  }
)

// 监听内部筛选条件变化，触发filter-change
watch(
  [currentSubTab, searchTitle, currentHasPromote],
  () => {
    emit('filter-change', {
      page: currentPage.value,
      pageSize: currentPageSize.value,
      subTab: currentSubTab.value,
      title: searchTitle.value,
      hasPromote: currentHasPromote.value
    })
  }
)

// SubTab切换
const handleSubTabChange = (tab) => {
  currentSubTab.value = tab
  currentPage.value = 1 // 切换Tab时重置页码
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  emit('filter-change', {
    page: currentPage.value,
    pageSize: currentPageSize.value,
    subTab: currentSubTab.value,
    title: searchTitle.value,
    hasPromote: currentHasPromote.value
  })
}

// 导出
const handleExport = () => {
  emit('export')
}

// 分页大小变化
const handleSizeChange = (size) => {
  currentPageSize.value = size
  currentPage.value = 1
  emit('filter-change', {
    page: currentPage.value,
    pageSize: currentPageSize.value,
    subTab: currentSubTab.value,
    title: searchTitle.value,
    hasPromote: currentHasPromote.value
  })
}

// 页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  emit('filter-change', {
    page: currentPage.value,
    pageSize: currentPageSize.value,
    subTab: currentSubTab.value,
    title: searchTitle.value,
    hasPromote: currentHasPromote.value
  })
}

// 详情
const handleDetail = (row) => {
  emit('detail', row)
}

// 选中变化
const selectedRows = ref([])
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 格式化金额
function formatMoney(value) {
  if (value == null || typeof value !== 'number') return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 格式化数字
function formatNumber(value) {
  if (value == null || typeof value !== 'number') return '0'
  return value.toLocaleString('zh-CN')
}

// 重置筛选条件（暴露给父组件调用）
const resetFilters = () => {
  currentSubTab.value = 'all'
  searchTitle.value = ''
  currentHasPromote.value = ''
  currentPage.value = 1
  currentPageSize.value = 10
}

// 暴露方法
defineExpose({
  resetFilters
})
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.collab-live-list-section {
  background: #fff;
  border-radius: 8px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.sub-tabs {
  display: flex;
  gap: 16px;
}

.sub-tab {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    color: #1677ff;
    background: #e6f4ff;
  }
}

.update-time {
  font-size: 12px;
  color: #999;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.table-container {
  padding: 0;
  overflow-x: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
  gap: 8px;
  font-size: 14px;
}

.video-cell {
  display: flex;
  gap: 12px;
}

.video-cover {
  width: 64px;
  height: 48px;
  flex-shrink: 0;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 20px;
}

.video-info {
  flex: 1;
  min-width: 0;

  .video-title {
    font-size: 13px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .video-time {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}

.influencer-cell {
  display: flex;
  gap: 8px;

  .influencer-avatar {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    background: #e6f4ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1677ff;
  }

  .influencer-info {
    flex: 1;
    min-width: 0;

    .influencer-name {
      font-size: 13px;
      color: #1677ff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .influencer-followers {
      font-size: 11px;
      color: #999;
      margin-top: 2px;
    }
  }
}

.product-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .el-icon {
    color: #999;
    font-size: 16px;
  }
}

.no-product {
  color: #999;
  font-size: 12px;
}

.employee-name {
  font-size: 13px;
  color: #333;
}

.amount-cell {
  .amount-value {
    font-size: 13px;
    color: #333;
  }

  .amount-ratio {
    font-size: 11px;
    color: #999;
    margin-top: 2px;
  }

  .amount-value.warning {
    color: #ff4d4f;
  }
}

.sales-value {
  font-size: 13px;
  color: #333;
}

.commission-value {
  font-size: 13px;
  color: #00cc66;
}

.promote-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;

  &.yes {
    background: #e6f4ff;
    color: #1677ff;
  }

  &.no {
    background: #f5f5f5;
    color: #999;
  }
}

.consume-value,
.deal-value {
  font-size: 13px;
  color: #333;
}

.order-count {
  font-size: 13px;
  color: #333;
}

.roi-value,
.duration-value,
.viewer-value,
.uv-value {
  font-size: 13px;
  color: #333;
}

.action-btns {
  display: flex;
  gap: 4px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
}

:deep(.el-table) {
  .el-table__header th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
    font-size: 13px;
  }

  .el-table__row {
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>

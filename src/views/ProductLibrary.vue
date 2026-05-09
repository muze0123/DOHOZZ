<template>
  <div class="product-library">
    <!-- 平台Tab区 -->
    <div class="platform-section">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key, disabled: !tab.enabled }"
          @click="tab.enabled && handlePlatformChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
          <svg v-if="tab.icon" class="platform-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path :d="tab.icon" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 筛选条件区 -->
    <div class="filter-section">
      <div class="filter-header" @click="filterCollapsed = !filterCollapsed">
        <span>筛选条件</span>
        <svg class="collapse-icon" :class="{ collapsed: filterCollapsed }" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div v-show="!filterCollapsed" class="filter-content">
        <div class="filter-row">
          <div class="filter-item">
            <label>商品搜索</label>
            <el-input v-model="filters.productSearch" placeholder="请输入商品名称/商品ID" clearable style="width: 220px" @keyup.enter="handleQuery" />
          </div>
          <div class="filter-item">
            <label>商品状态</label>
            <el-select v-model="filters.status" placeholder="请选择状态" filterable clearable style="width: 150px">
              <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>来源店铺</label>
            <el-select v-model="filters.shopIds" placeholder="所有店铺" filterable multiple clearable style="width: 220px">
              <el-option v-for="shop in shopOptions" :key="shop.id" :label="shop.name" :value="shop.id" />
            </el-select>
          </div>
        </div>
        <div class="filter-row filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-bar">
      <div class="action-left">
        <el-button :loading="syncing" :disabled="syncing" @click="handleSync">
          {{ syncing ? '同步中...' : '同步数据' }}
        </el-button>
        <el-button disabled title="批量导出功能开发中">批量导出</el-button>
      </div>
    </div>

    <!-- 商品列表标题区 -->
    <div class="list-header">
      <div class="list-title">商品列表</div>
      <div class="sync-time">
        数据同步时间：{{ lastSyncTime }}
        <el-tooltip content="每隔1小时更新1次" placement="top">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="total-count">（共 {{ total }} 个商品）</div>
    </div>

    <!-- 数据列表区 -->
    <div class="list-section">
      <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%; min-width: 900px"
        row-key="id"
      >
        <el-table-column label="商品信息" min-width="260" fixed="left">
          <template #default="{ row }">
            <div class="product-info">
              <el-image :src="row.productImage" class="product-image" fit="cover">
                <template #error>
                  <div class="image-placeholder"><el-icon><Picture /></el-icon></div>
                </template>
              </el-image>
              <div class="product-detail">
                <div class="product-name" @click="handleDetail(row)">{{ row.productName }}</div>
                <div class="product-id">
                  <span class="id-text" @click.stop="handleCopyId(row)">ID:{{ row.productId }}</span>
                  <el-icon class="copy-icon" @click.stop="handleCopyId(row)"><CopyDocument /></el-icon>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="来源店铺" min-width="140">
          <template #default="{ row }">
            <div class="shop-info">
              <el-image :src="row.shopImage" class="shop-image" fit="cover">
                <template #error>
                  <div class="image-placeholder small"><el-icon><Shop /></el-icon></div>
                </template>
              </el-image>
              <div class="shop-detail">
                <div class="shop-name">{{ row.shopName }}</div>
                <div class="shop-region">
                  <span class="region-icon">{{ getRegionIcon(row.shopRegion) }}</span>
                  {{ row.shopRegion }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品价格" min-width="100" sortable :sort-orders="['ascending', 'descending']" align="right">
          <template #default="{ row }">
            <span class="price">¥{{ formatMoney(row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公开佣金率" min-width="100" sortable :sort-orders="['ascending', 'descending']" align="right">
          <template #default="{ row }">
            <span class="commission">{{ row.commissionRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="80" align="right">
          <template #default="{ row }">
            <span>{{ row.inventory }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品状态" min-width="90">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ getStatusText(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="同步时间" min-width="160" sortable :sort-orders="['ascending', 'descending']">
          <template #default="{ row }">
            <span>{{ row.syncTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <span class="action-link" @click="handleCopyLink(row)">复制链接</span>
              <span class="action-link" @click="handleDetail(row)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区 -->
    <div class="pagination-section">
      <Pagination
        v-model="paginationState"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
      />
    </div>

    <!-- 商品详情抽屉 -->
    <ProductDetailDrawer v-model="detailDrawerVisible" :product="currentProduct" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled, Picture, CopyDocument, Shop } from '@element-plus/icons-vue'
import ProductDetailDrawer from './ProductLibrary/dialogs/ProductDetailDrawer.vue'
import Pagination from '@/components/Pagination.vue'

// 平台Tab配置
const platformTabs = [
  { key: 'tiktok', label: 'TikTok', enabled: true, icon: '<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.84a4.83 4.83 0 0 1-1.01-.15z"/>' },
  { key: 'instagram', label: 'Instagram', enabled: false, icon: '<path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>' },
  { key: 'shopee', label: 'Shopee', enabled: false, icon: '<path d="M22 12.22a1.88 1.88 0 0 0-1.05-1.65 9.88 9.88 0 0 0-5.6-1.8l1.3-1.8a.6.6 0 0 0-.09-.86.61.61 0 0 0-.82.12l-2.73 3.76a.6.6 0 0 0 .2.83l1.42 1a.62.62 0 0 0 .76-.14l1.4-1.95a11.7 11.7 0 0 1 6.4 2.1.6.6 0 0 0 .79-.47l.77-3.34a.59.59 0 0 0-.2-.67z"/>' },
  { key: 'lazada', label: 'Lazada', enabled: false, icon: '<path d="M22 8.18L11.28 1.07a1.12 1.12 0 0 0-1.03 0L.54 8.18a1.02 1.02 0 0 0-.4.81v5.5a1.02 1.02 0 0 0 .53.9l8.94 5.19a1.12 1.12 0 0 0 1.06 0l8.94-5.19a1.02 1.02 0 0 0 .53-.9v-5.5a1.02 1.02 0 0 0-.54-.81z"/>' }
]

const activePlatform = ref('tiktok')
const filterCollapsed = ref(false)

// 筛选条件
const filters = reactive({
  productSearch: '',
  status: null,
  shopIds: []
})

// 选项数据
const shopOptions = ref([
  { id: 1, name: '美妆旗舰店' },
  { id: 2, name: '服饰专营店' },
  { id: 3, name: '数码专营店' },
  { id: 4, name: '母婴用品店' }
])

const statusOptions = [
  { value: 'online', label: '已上架' },
  { value: 'offline', label: '已下架' },
  { value: 'deleted', label: '已删除' }
]

// Mock数据
const mockTableData = [
  { id: 1, productId: '71200120132001', productName: '美妆蛋套装组合 专业化妆工具 初学者适用', productImage: '', shopId: 1, shopName: '美妆旗舰店', shopImage: '', shopRegion: '菲律宾', price: 29.99, commissionRate: 2.75, inventory: 9999, status: 'online', syncTime: '2026-04-24 10:30:00' },
  { id: 2, productId: '71200120132002', productName: '春季新款女装连衣裙 气质优雅', productImage: '', shopId: 2, shopName: '服饰专营店', shopImage: '', shopRegion: '马来西亚', price: 89.00, commissionRate: 3.20, inventory: 500, status: 'online', syncTime: '2026-04-24 09:15:00' },
  { id: 3, productId: '71200120132003', productName: '无线蓝牙耳机 降噪耳机 运动耳机', productImage: '', shopId: 3, shopName: '数码专营店', shopImage: '', shopRegion: '新加坡', price: 159.00, commissionRate: 5.00, inventory: 200, status: 'offline', syncTime: '2026-04-23 18:45:00' },
  { id: 4, productId: '71200120132004', productName: '婴儿奶瓶消毒器 温奶器多功能', productImage: '', shopId: 4, shopName: '母婴用品店', shopImage: '', shopRegion: '泰国', price: 199.00, commissionRate: 4.50, inventory: 0, status: 'deleted', syncTime: '2026-04-22 14:20:00' },
  { id: 5, productId: '71200120132005', productName: '智能手环 运动手环 心率监测', productImage: '', shopId: 3, shopName: '数码专营店', shopImage: '', shopRegion: '越南', price: 79.00, commissionRate: 4.00, inventory: 1500, status: 'online', syncTime: '2026-04-24 08:00:00' }
]

const tableData = ref(mockTableData)
const tableRef = ref(null)

// 分页
const paginationState = ref({ page: 1, pageSize: 10 })
const total = ref(666)
const totalPages = computed(() => Math.ceil(total.value / paginationState.value.pageSize))

// 同步状态
const syncing = ref(false)
const lastSyncTime = ref('2026-04-24 10:30:00')

// 抽屉状态
const detailDrawerVisible = ref(false)
const currentProduct = ref(null)

// 方法
function handlePlatformChange(platform) {
  activePlatform.value = platform
  handleReset()
}

function handleQuery() {
  ElMessage.success('查询成功')
  currentPage.value = 1
}

function handleReset() {
  filters.productSearch = ''
  filters.status = null
  filters.shopIds = []
  ElMessage.success('重置成功')
  currentPage.value = 1
}

function handleSync() {
  syncing.value = true
  ElMessage.success('同步请求成功，请稍等一些时间，系统将自动同步数据')

  setTimeout(() => {
    syncing.value = false
    lastSyncTime.value = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')
    ElMessage.success('数据同步完成')
  }, 3000)
}

function handleDetail(row) {
  currentProduct.value = row
  detailDrawerVisible.value = true
}

function handleCopyId(row) {
  navigator.clipboard.writeText(row.productId).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

function handleCopyLink(row) {
  const link = `https://shop.tiktok.com/product/${row.productId}`
  navigator.clipboard.writeText(link).then(() => {
    ElMessage.success('复制商品链接成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

function handleSizeChange() {
  currentPage.value = 1
}

function handleCurrentChange() {
  // 重新加载数据
}

function getStatusText(status) {
  return { online: '已上架', offline: '已下架', deleted: '已删除' }[status] || status
}

function getRegionIcon(region) {
  const icons = { 菲律宾: '🇵🇭', 马来西亚: '🇲🇾', 新加坡: '🇸🇬', 泰国: '🇹🇭', 越南: '🇻🇳' }
  return icons[region] || '🌐'
}

function formatMoney(v) {
  return v ? v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '0.00'
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.product-library {
  padding: 16px 0 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.platform-section {
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.platform-tabs {
  display: flex;
  gap: 8px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;

  &:hover:not(.disabled) {
    background: #f0f5ff;
    color: #0064e0;
  }

  &.active {
    background: #0064e0;
    color: #fff;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .platform-icon {
    width: 16px;
    height: 16px;
  }
}

.filter-section {
  background: #fff;
  padding: 0 16px 16px;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;

  .collapse-icon {
    transition: transform 0.3s;

    &.collapsed {
      transform: rotate(-90deg);
    }
  }
}

.filter-content {
  .filter-row {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    flex-wrap: wrap;

    &.filter-actions {
      justify-content: flex-end;
      margin-top: 8px;
    }
  }

  .filter-item {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      font-size: 13px;
      color: #666;
      white-space: nowrap;
    }
  }
}

.action-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;

  .list-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .sync-time {
    font-size: 13px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;

    .help-icon {
      cursor: help;
      color: #999;
    }
  }

  .total-count {
    font-size: 13px;
    color: #999;
  }
}

.list-section {
  background: #fff;
  padding: 16px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .product-image {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    flex-shrink: 0;
    background: #f5f5f5;
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 20px;
  }

  .product-detail {
    min-width: 0;
  }

  .product-name {
    font-size: 14px;
    color: #1677ff;
    cursor: pointer;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }

  .product-id {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;

    .id-text {
      cursor: pointer;

      &:hover {
        color: #1677ff;
      }
    }

    .copy-icon {
      cursor: pointer;
      color: #999;

      &:hover {
        color: #1677ff;
      }
    }
  }
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 10px;

  .shop-image {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    flex-shrink: 0;
    background: #f5f5f5;
  }

  .shop-detail {
    min-width: 0;
  }

  .shop-name {
    font-size: 13px;
    color: #333;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .shop-region {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.price {
  font-size: 14px;
  color: #00cc66;
  font-weight: 500;
}

.commission {
  font-size: 14px;
  color: #333;
}

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;

  &.online { background: #e6fffb; color: #00856a; }
  &.offline { background: #f5f5f5; color: #999; }
  &.deleted { background: #fff2f0; color: #ff4d4f; }
}

.action-buttons {
  display: flex;
  gap: 12px;
  font-size: 13px;

  .action-link {
    color: #1677ff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;

  .pagination-info {
    font-size: 14px;
    color: #666;
  }
}
</style>

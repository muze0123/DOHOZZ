<template>
  <div class="natural-order-influencer">
    <!-- 页面容器 -->
    <div class="page-container">
      <!-- 内容卡片 -->
      <div class="content-card">
        <!-- 区域A：顶部筛选区 -->
        <div class="filter-section">
          <!-- 平台Tab -->
          <div class="platform-row">
            <PlatformTabs v-model="selectedPlatform" @change="selectPlatform" />
          </div>

          <!-- 搜索框 -->
          <div class="search-row">
            <div class="search-input-wrapper">
              <el-input
                v-model="searchKeyword"
                class="search-input"
                placeholder="搜索达人名称/ID"
                clearable
                @keyup.enter="handleSearch"
                @clear="handleSearch"
              >
                <template #append>
                  <el-button @click="handleSearch">搜索</el-button>
                </template>
              </el-input>
            </div>
          </div>

          <!-- 筛选条件行1 -->
          <div class="filter-row">
            <div class="filter-item">
              <span class="filter-label">达人信息</span>
              <el-select v-model="filters.influencerType" placeholder="请选择" clearable class="filter-select">
                <el-option label="全部" value="" />
                <el-option label="个人" value="personal" />
                <el-option label="企业" value="enterprise" />
              </el-select>
            </div>
            <div class="filter-item">
              <span class="filter-label">开始时间</span>
              <el-date-picker
                v-model="filters.startDate"
                type="date"
                placeholder="选择日期"
                class="filter-date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="filter-item">
              <span class="filter-label">结束时间</span>
              <el-date-picker
                v-model="filters.endDate"
                type="date"
                placeholder="选择日期"
                class="filter-date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
            <div class="filter-item">
              <span class="filter-label">所属店铺</span>
              <el-select v-model="filters.shopId" placeholder="请选择" clearable filterable class="filter-select" style="width: 160px">
                <el-option label="全部店铺" value="" />
                <el-option v-for="shop in shopList" :key="shop.id" :label="shop.name" :value="shop.id" />
              </el-select>
            </div>
          </div>

          <!-- 筛选条件行2 -->
          <div class="filter-row">
            <div class="filter-item">
              <span class="filter-label">达人类型</span>
              <el-select v-model="filters.certifiedType" placeholder="请选择" clearable class="filter-select">
                <el-option label="全部" value="" />
                <el-option label="认证达人" value="certified" />
                <el-option label="普通达人" value="normal" />
              </el-select>
            </div>
            <div class="filter-item">
              <span class="filter-label">粉丝数</span>
              <el-select v-model="filters.fansRange" placeholder="请选择" clearable class="filter-select">
                <el-option label="全部" value="" />
                <el-option label="1万以下" value="0-10000" />
                <el-option label="1-10万" value="10000-100000" />
                <el-option label="10-50万" value="100000-500000" />
                <el-option label="50-100万" value="500000-1000000" />
                <el-option label="100万以上" value="1000000+" />
              </el-select>
            </div>
            <div class="filter-item">
              <span class="filter-label">联系方式</span>
              <el-select v-model="filters.contactType" placeholder="请选择" clearable class="filter-select">
                <el-option label="全部" value="" />
                <el-option label="有联系方式" value="has_contact" />
                <el-option label="无联系方式" value="no_contact" />
              </el-select>
            </div>
            <div class="filter-item">
              <span class="filter-label">账号类型</span>
              <el-select v-model="filters.accountType" placeholder="请选择" clearable class="filter-select">
                <el-option label="全部" value="" />
                <el-option label="达人账号" value="influencer" />
                <el-option label="商家账号" value="merchant" />
              </el-select>
            </div>
            <button class="btn-reset" @click="resetFilters">重置</button>
          </div>
        </div>

        <!-- 区域B：工具栏 -->
        <div class="toolbar">
          <div class="toolbar-left"></div>
          <div class="toolbar-right">
            <button
              class="btn-batch-assign"
              :disabled="selectedRows.length === 0"
              @click="openBatchAssignModal"
            >
              批量分配
            </button>
          </div>
        </div>

        <!-- 区域C：数据列表 -->
        <div class="table-container">
          <el-table
            v-loading="loading"
            :data="influencerList"
            style="width: 100%"
            empty-text="暂无达人数据"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column label="达人信息" min-width="220">
              <template #default="{ row }">
                <div class="influencer-cell" @click="goToInfluencerDetail(row)">
                  <el-avatar :size="48" :src="row.avatar" class="inf-avatar clickable" />
                  <div class="inf-info">
                    <div class="inf-name">
                      <span class="clickable">{{ row.name }}</span>
                      <el-tag size="small" class="level-tag">{{ row.level }}</el-tag>
                    </div>
                    <div class="inf-username">{{ row.username }}</div>
                    <div class="inf-country">
                      <span>{{ row.countryFlag }}</span> {{ row.country }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="粉丝数" prop="fansCount" width="120" sortable>
              <template #default="{ row }">
                <span>{{ formatNumber(row.fansCount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="出单店铺" prop="shopName" width="140" />
            <el-table-column label="带货类目" width="150">
              <template #default="{ row }">
                <div class="category-tags">
                  <el-tag v-for="cat in row.categories.slice(0, 2)" :key="cat" size="small">{{ cat }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="成交商品" width="100">
              <template #default="{ row }">
                <el-button type="primary" link @click="openProductModal(row)">{{ row.productCount }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="成交金额" prop="salesAmount" width="130" sortable>
              <template #default="{ row }">
                <span>¥{{ formatNumber(row.salesAmount) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="销量" prop="salesVolume" width="110" sortable>
              <template #default="{ row }">
                <span>{{ formatNumber(row.salesVolume) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="直播占比" prop="livePercent" width="100">
              <template #default="{ row }">{{ row.livePercent }}%</template>
            </el-table-column>
            <el-table-column label="视频占比" prop="videoPercent" width="100">
              <template #default="{ row }">{{ row.videoPercent }}%</template>
            </el-table-column>
            <el-table-column label="橱窗占比" prop="showcasePercent" width="100">
              <template #default="{ row }">{{ row.showcasePercent }}%</template>
            </el-table-column>
            <el-table-column label="最近出单时间" prop="lastOrderTime" width="150" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="openAssignModal(row)">分配</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 区域D：分页区 -->
        <div class="pagination-area">
          <Pagination
            v-model="paginationState"
            :total="totalRecords"
            :page-sizes="[10, 20, 50]"
          />
        </div>
      </div>
    </div>

    <!-- 分配弹窗 -->
    <div v-if="showAssignModal" class="modal-mask" @click.self="closeAssignModal">
      <div class="modal assign-modal">
        <div class="modal-header">
          <h3>自然出单达人分配</h3>
          <button class="modal-close" @click="closeAssignModal">×</button>
        </div>
        <div class="modal-body">
          <p class="assign-tip">
            您选择了出单达人
            <template v-if="selectedRows.length === 1">
              "{{ singleSelectedInfluencer?.name }}"
            </template>
            <template v-else>
              共{{ selectedRows.length }}个
            </template>
          </p>
          <div class="form-item">
            <label class="form-label required">分配BD</label>
            <el-select v-model="selectedBD" placeholder="请选择BD" filterable class="bd-select">
              <el-option v-for="bd in bdList" :key="bd.id" :label="bd.name" :value="bd.id" />
            </el-select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeAssignModal">取消</button>
          <button class="btn-confirm" :disabled="!selectedBD" @click="confirmAssign">确定</button>
        </div>
      </div>
    </div>

    <!-- 分配结果弹窗 -->
    <div v-if="showResultModal" class="modal-mask" @click.self="closeResultModal">
      <div class="modal result-modal">
        <div class="modal-header">
          <h3>分配结果</h3>
          <button class="modal-close" @click="closeResultModal">×</button>
        </div>
        <div class="modal-body">
          <div class="result-stats">
            <div class="stat-item success">
              <span class="stat-value">{{ assignResult.success }}</span>
              <span class="stat-label">成功</span>
            </div>
            <div class="stat-item fail" v-if="assignResult.fail > 0">
              <span class="stat-value">{{ assignResult.fail }}</span>
              <span class="stat-label">失败</span>
            </div>
          </div>
          <div v-if="assignResult.fail > 0" class="fail-list">
            <p class="fail-title">失败原因：</p>
            <ul>
              <li v-for="(reason, index) in assignResult.failReasons" :key="index">{{ reason }}</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-confirm" @click="closeResultModal">我知道了</button>
        </div>
      </div>
    </div>

    <!-- 商品TOP10弹窗 -->
    <div v-if="showProductModal" class="modal-mask" @click.self="closeProductModal">
      <div class="modal product-modal">
        <div class="modal-header">
          <h3>成交商品TOP10</h3>
          <button class="modal-close" @click="closeProductModal">×</button>
        </div>
        <div class="modal-body">
          <div class="product-list">
            <div v-for="(product, index) in topProducts" :key="product.id" class="product-item">
              <span class="product-rank">{{ index + 1 }}</span>
              <img :src="product.image" :alt="product.name" class="product-image" @error="handleProductImageError" />
              <div class="product-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-sales">成交金额: ¥{{ formatNumber(product.salesAmount) }}</span>
              </div>
              <span class="product-volume">{{ formatNumber(product.salesVolume) }}件</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeProductModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import PlatformTabs from '@/components/PlatformTabs.vue'
import Pagination from '@/components/Pagination.vue'

// 状态
const selectedPlatform = ref('tiktok')
const searchKeyword = ref('')
const loading = ref(false)
const influencerList = ref([])
const selectedRows = ref([])

// 筛选条件
const filters = reactive({
  influencerType: '',
  startDate: '',
  endDate: '',
  shopId: '',
  certifiedType: '',
  fansRange: '',
  contactType: '',
  accountType: ''
})

// 店铺列表
const shopList = [
  { id: 1, name: '旗舰店A' },
  { id: 2, name: '专营店B' },
  { id: 3, name: '直营店C' }
]

// BD列表
const bdList = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' }
]

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)

// 弹窗状态
const showAssignModal = ref(false)
const showResultModal = ref(false)
const showProductModal = ref(false)
const selectedBD = ref('')
const currentAssignInfluencer = ref(null)

// 分配结果
const assignResult = reactive({
  success: 0,
  fail: 0,
  failReasons: []
})

// 商品TOP10
const topProducts = ref([])

// Mock数据结构对齐达人库页面的达人字段，并补充自然出单指标
const allMockData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: '@sarahj_official',
    avatar: 'https://i.pravatar.cc/150?img=1',
    platformId: 'tiktok',
    fansCount: 1250000,
    country: 'United States',
    countryFlag: '🇺🇸',
    categories: ['美妆护肤', '时尚配件'],
    level: 'L8',
    shopName: 'TikTok 官方旗舰店',
    productCount: 86,
    salesAmount: 1560000,
    salesVolume: 8920,
    livePercent: 21,
    videoPercent: 68,
    showcasePercent: 11,
    lastOrderTime: '2026-04-23'
  },
  {
    id: '2',
    name: 'Michael Chen',
    username: '@mikechen_tiktok',
    avatar: 'https://i.pravatar.cc/150?img=3',
    platformId: 'tiktok',
    fansCount: 890000,
    country: 'Malaysia',
    countryFlag: '🇲🇾',
    categories: ['手机数码', '科技'],
    level: 'L6',
    shopName: '数码海外专营店',
    productCount: 54,
    salesAmount: 980000,
    salesVolume: 5600,
    livePercent: 76,
    videoPercent: 19,
    showcasePercent: 5,
    lastOrderTime: '2026-04-22'
  },
  {
    id: '3',
    name: 'Emma Williams',
    username: '@emmawilliams_fash',
    avatar: 'https://i.pravatar.cc/150?img=5',
    platformId: 'tiktok',
    fansCount: 2100000,
    country: 'Indonesia',
    countryFlag: '🇮🇩',
    categories: ['时尚配件', '鞋靴箱包'],
    level: 'L9',
    shopName: '时尚品牌旗舰店',
    productCount: 128,
    salesAmount: 3200000,
    salesVolume: 18500,
    livePercent: 25,
    videoPercent: 70,
    showcasePercent: 5,
    lastOrderTime: '2026-04-21'
  },
  {
    id: '4',
    name: 'Lisa Anderson',
    username: '@lisa_lifestyle',
    avatar: 'https://i.pravatar.cc/150?img=9',
    platformId: 'instagram',
    fansCount: 1800000,
    country: 'Philippines',
    countryFlag: '🇵🇭',
    categories: ['居家日用', '母婴用品'],
    level: 'L8',
    shopName: '生活方式官方店',
    productCount: 73,
    salesAmount: 2100000,
    salesVolume: 12000,
    livePercent: 18,
    videoPercent: 62,
    showcasePercent: 20,
    lastOrderTime: '2026-04-20'
  },
  {
    id: '5',
    name: 'James Wong',
    username: '@jameswong_food',
    avatar: 'https://i.pravatar.cc/150?img=12',
    platformId: 'shopee',
    fansCount: 720000,
    country: 'Singapore',
    countryFlag: '🇸🇬',
    categories: ['食品饮料'],
    level: 'L6',
    shopName: '食品饮料旗舰店',
    productCount: 61,
    salesAmount: 890000,
    salesVolume: 6800,
    livePercent: 81,
    videoPercent: 12,
    showcasePercent: 7,
    lastOrderTime: '2026-04-19'
  },
  {
    id: '6',
    name: 'Maria Garcia',
    username: '@mariagarcia_beauty',
    avatar: 'https://i.pravatar.cc/150?img=16',
    platformId: 'lazada',
    fansCount: 1500000,
    country: 'Mexico',
    countryFlag: '🇲🇽',
    categories: ['美妆护肤', '个人护理'],
    level: 'L8',
    shopName: '美妆海外旗舰店',
    productCount: 97,
    salesAmount: 1800000,
    salesVolume: 10500,
    livePercent: 23,
    videoPercent: 65,
    showcasePercent: 12,
    lastOrderTime: '2026-04-18'
  }
]

const paginationState = computed({
  get: () => ({
    page: currentPage.value,
    pageSize: pageSize.value
  }),
  set: (value) => {
    currentPage.value = value.page
    pageSize.value = value.pageSize
    loadData()
  }
})

const singleSelectedInfluencer = computed(() => {
  if (selectedRows.value.length === 1) {
    return influencerList.value.find(i => i.id === selectedRows.value[0])
  }
  return null
})

// 方法
const selectPlatform = (platform) => {
  selectedPlatform.value = platform
  currentPage.value = 1
  loadData()
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const resetFilters = () => {
  Object.keys(filters).forEach(key => filters[key] = '')
  searchKeyword.value = ''
  currentPage.value = 1
  loadData()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection.map(i => i.id)
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

const handleProductImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/48?text=Product'
}

// 加载数据
const loadData = () => {
  loading.value = true

  setTimeout(() => {
    let filtered = allMockData.filter(i => i.platformId === selectedPlatform.value)

    // 关键词过滤
    if (searchKeyword.value) {
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        i.id.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        i.username.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }

    totalRecords.value = filtered.length
    const start = (currentPage.value - 1) * pageSize.value
    influencerList.value = filtered.slice(start, start + pageSize.value)
    selectedRows.value = []
    loading.value = false
  }, 600)
}

// 跳转达人详情
const goToInfluencerDetail = (influencer) => {
  console.log('跳转到达人详情:', influencer.id)
}

// 分配弹窗
const openAssignModal = (influencer) => {
  if (influencer) {
    selectedRows.value = [influencer.id]
  }
  selectedBD.value = ''
  showAssignModal.value = true
}

const openBatchAssignModal = () => {
  if (selectedRows.value.length === 0) return
  selectedBD.value = ''
  showAssignModal.value = true
}

const closeAssignModal = () => {
  showAssignModal.value = false
  selectedBD.value = ''
}

const confirmAssign = () => {
  if (!selectedBD.value) return

  // Mock分配结果
  const successCount = selectedRows.value.length
  const failCount = Math.floor(Math.random() * 2)
  const failReasons = []
  if (failCount > 0) {
    failReasons.push('已分配')
    if (failCount > 1) failReasons.push('已跟进')
  }

  assignResult.success = successCount
  assignResult.fail = failCount
  assignResult.failReasons = failReasons

  closeAssignModal()
  showResultModal.value = true
}

const closeResultModal = () => {
  showResultModal.value = false
  selectedRows.value = []
}

// 商品TOP10弹窗
const openProductModal = (influencer) => {
  // Mock商品数据
  topProducts.value = Array.from({ length: 10 }, (_, i) => ({
    id: `P${1000 + i}`,
    name: `${influencer.name}相关商品${i + 1}`,
    image: `https://via.placeholder.com/48?text=P${i + 1}`,
    salesAmount: Math.floor(Math.random() * 50000) + 5000,
    salesVolume: Math.floor(Math.random() * 1000) + 100
  }))
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  topProducts.value = []
}

// 初始化
loadData()
</script>

<style lang="scss" scoped>
$primary-blue: #1677FF;
$light-blue-bg: #E6F4FF;
$light-blue-border: #91CAFF;
$text-primary: #262626;
$text-secondary: #595959;
$text-placeholder: #BFBFBF;
$text-hint: #8C8C8C;
$border-default: #D9D9D9;
$border-light: #EBEBEB;
$bg-page: #F5F6F8;
$bg-card: #FFFFFF;
$success: #31A24C;
$error: #E41E3F;

.natural-order-influencer {
  padding: 0 0 24px;
  min-height: 100vh;
  background: #f5f5f5;
}

.page-container {
  padding: 0;
}

.content-card {
  background: $bg-card;
  border-radius: 8px;
  border: none;
  overflow: hidden;
}

// 筛选区
.filter-section {
  padding: 0;
  border-bottom: 1px solid $border-light;
}

.platform-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

.search-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}

.search-input-wrapper {
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 500px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: $text-secondary;
  white-space: nowrap;
}

.filter-select {
  width: 160px;
}

.filter-date {
  width: 160px;
}

.btn-reset {
  height: 32px;
  padding: 0 16px;
  background: #fff;
  border: 1px solid $border-default;
  border-radius: 4px;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;

  &:hover {
    border-color: $primary-blue;
    color: $primary-blue;
  }
}

// 工具栏
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.btn-batch-assign {
  height: 32px;
  padding: 0 20px;
  background: $primary-blue;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #4096FF;
  }

  &:disabled {
    background: $border-light;
    color: $text-placeholder;
    cursor: not-allowed;
  }
}

// 表格
.table-container {
  min-height: 400px;
  padding: 16px;
}

.table-container {
  :deep(.el-table) {
    .el-table__header th {
      background: #fafafa;
      font-weight: 600;
      color: #333;
      font-size: 13px;
    }
  }
}

.loading-state {
  padding: 40px 0;
}

.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  display: flex;
  gap: 16px;
  padding: 12px;
}

.skeleton-cell {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: $text-hint;

  p {
    font-size: 16px;
    margin-top: 16px;
    color: $text-secondary;
  }

  span {
    font-size: 13px;
    margin-top: 8px;
  }
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  thead tr {
    background: #FAFAFA;
  }

  thead th {
    padding: 12px 8px;
    font-weight: 500;
    color: $text-hint;
    text-align: left;
    white-space: nowrap;
    border-bottom: 1px solid $border-light;
  }

  tbody tr {
    border-bottom: 1px solid #F0F0F0;
    transition: background 0.15s;

    &:hover {
      background: #FAFAFA;
    }
  }

  tbody td {
    padding: 12px 8px;
    color: $text-primary;
    vertical-align: middle;
  }
}

.sortable {
  cursor: pointer;
  user-select: none;

  .sort-icon {
    font-size: 10px;
    color: $text-placeholder;
    margin-left: 4px;
  }

  &.asc .sort-icon, &.desc .sort-icon {
    color: $primary-blue;
  }
}

.influencer-cell {
  display: flex;
  gap: 12px;
  cursor: pointer;
}

.inf-avatar {
  flex-shrink: 0;
}

.inf-info {
  flex: 1;
  min-width: 0;
}

.inf-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;

  .clickable:hover {
    color: $primary-blue;
  }
}

.level-tag {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #fff;
  border: none;
}

.inf-username {
  font-size: 12px;
  color: $text-hint;
}

.inf-country {
  font-size: 12px;
  color: $text-secondary;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

// 分页
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid $border-light;
}

.pagination-area {
  display: flex;
  justify-content: flex-end;
  padding: 0 16px 16px;
}

.pagination-info {
  font-size: 13px;
  color: $text-hint;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid $border-default;
  border-radius: 4px;
  background: #fff;
  color: $text-secondary;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled):not(.active) {
    border-color: $primary-blue;
    color: $primary-blue;
  }

  &.active {
    background: $primary-blue;
    border-color: $primary-blue;
    color: #fff;
  }

  &:disabled {
    color: $text-placeholder;
    cursor: not-allowed;
  }
}

.page-ellipsis {
  color: $text-placeholder;
}

.page-size-select {
  height: 32px;
  padding: 0 8px;
  border: 1px solid $border-default;
  border-radius: 4px;
  font-size: 13px;
  color: $text-secondary;
}

.jump-to {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: $text-secondary;
}

.jump-input {
  width: 48px;
  height: 32px;
  border: 1px solid $border-default;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
}

// 弹窗
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 2000;
}

.assign-modal {
  width: 520px;
}

.result-modal {
  width: 400px;
}

.product-modal {
  width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid $border-light;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.modal-close {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  font-size: 20px;
  color: $text-hint;
  cursor: pointer;

  &:hover {
    color: $text-secondary;
  }
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid $border-light;
}

.assign-tip {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 8px;

  &.required::before {
    content: '*';
    color: $error;
    margin-right: 4px;
  }
}

.bd-select {
  width: 100%;
}

.result-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  border-radius: 8px;

  &.success {
    background: #F6FFED;
    border: none;
  }

  &.fail {
    background: #FFF1F0;
    border: none;
  }
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
}

.stat-label {
  font-size: 13px;
  color: $text-secondary;
  margin-top: 4px;
}

.stat-item.success .stat-value {
  color: $success;
}

.stat-item.fail .stat-value {
  color: $error;
}

.fail-list {
  background: #FFF1F0;
  border-radius: 4px;
  padding: 12px;

  .fail-title {
    font-size: 13px;
    color: $error;
    margin-bottom: 8px;
  }

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      font-size: 13px;
      color: $text-secondary;
      margin-bottom: 4px;
    }
  }
}

.product-list {
  max-height: 400px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid $border-light;

  &:last-child {
    border-bottom: none;
  }
}

.product-rank {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $light-blue-bg;
  color: $primary-blue;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
  color: $text-primary;
}

.product-sales {
  font-size: 12px;
  color: $text-hint;
  margin-top: 4px;
}

.product-volume {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.btn-cancel {
  height: 32px;
  padding: 0 20px;
  background: #fff;
  border: 1px solid $border-default;
  border-radius: 4px;
  font-size: 14px;
  color: $text-secondary;
  cursor: pointer;

  &:hover {
    border-color: $primary-blue;
    color: $primary-blue;
  }
}

.btn-confirm {
  height: 32px;
  padding: 0 20px;
  background: $primary-blue;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #4096FF;
  }

  &:disabled {
    background: $border-light;
    color: $text-placeholder;
    cursor: not-allowed;
  }
}

// Element Plus 覆盖样式
:deep(.el-select) {
  .el-input__wrapper {
    height: 32px;
    font-size: 13px;
  }
}

:deep(.el-date-editor) {
  .el-input__wrapper {
    height: 32px;
    font-size: 13px;
  }
}
</style>

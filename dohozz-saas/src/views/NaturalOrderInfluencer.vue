<template>
  <div class="natural-order-influencer">
    <!-- 页面容器 -->
    <div class="page-container">
      <!-- 内容卡片 -->
      <div class="content-card">
        <!-- 区域A：顶部筛选区 -->
        <div class="filter-section">
          <!-- 平台Tab -->
          <div class="platform-tabs">
            <span
              v-for="platform in platforms"
              :key="platform.value"
              class="platform-tab"
              :class="{ active: selectedPlatform === platform.value }"
              @click="selectPlatform(platform.value)"
            >
              <span class="platform-icon" v-html="platform.icon"></span>
              {{ platform.label }}
            </span>
          </div>

          <!-- 搜索框 -->
          <div class="search-row">
            <div class="search-input-wrapper">
              <input
                v-model="searchKeyword"
                type="text"
                class="search-input"
                placeholder="搜索达人名称/ID"
                @keyup.enter="handleSearch"
              />
            </div>
            <button class="btn-search" @click="handleSearch">搜索</button>
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
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <div class="skeleton-table">
              <div v-for="i in 5" :key="i" class="skeleton-row">
                <div class="skeleton-cell" style="width: 40px;"></div>
                <div class="skeleton-cell" style="width: 200px;"></div>
                <div class="skeleton-cell" style="width: 80px;"></div>
                <div class="skeleton-cell" style="width: 100px;"></div>
                <div class="skeleton-cell" style="width: 80px;"></div>
                <div class="skeleton-cell" style="width: 80px;"></div>
                <div class="skeleton-cell" style="width: 100px;"></div>
                <div class="skeleton-cell" style="width: 60px;"></div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="influencerList.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="#d9d9d9">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-4h2v-2h-2v2zm1-10c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
            </svg>
            <p>暂无达人数据</p>
            <span>请调整筛选条件</span>
          </div>

          <!-- 数据表格 -->
          <table v-else class="data-table">
            <thead>
              <tr>
                <th style="width: 40px;">
                  <input type="checkbox" v-model="selectAll" @change="handleSelectAll" />
                </th>
                <th style="width: 200px;">达人信息</th>
                <th style="width: 100px;" class="sortable" :class="getSortClass('fansCount')" @click="toggleSort('fansCount')">
                  粉丝数 <span class="sort-icon">↕</span>
                </th>
                <th style="width: 120px;">出单店铺</th>
                <th style="width: 100px;">带货类目</th>
                <th style="width: 80px;">成交商品</th>
                <th style="width: 120px;" class="sortable" :class="getSortClass('salesAmount')" @click="toggleSort('salesAmount')">
                  成交金额 <span class="sort-icon">↕</span>
                </th>
                <th style="width: 100px;" class="sortable" :class="getSortClass('salesVolume')" @click="toggleSort('salesVolume')">
                  销量 <span class="sort-icon">↕</span>
                </th>
                <th style="width: 80px;">直播占比</th>
                <th style="width: 80px;">视频占比</th>
                <th style="width: 80px;">橱窗占比</th>
                <th style="width: 140px;">最近出单时间</th>
                <th style="width: 80px;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="influencer in influencerList" :key="influencer.id" class="data-row">
                <td>
                  <input type="checkbox" :value="influencer.id" v-model="selectedRows" />
                </td>
                <td>
                  <div class="influencer-cell" @click="goToInfluencerDetail(influencer)">
                    <img :src="influencer.avatar" :alt="influencer.name" class="influencer-avatar" @error="handleAvatarError" />
                    <div class="influencer-info">
                      <span class="influencer-name">{{ influencer.name }}</span>
                      <span class="influencer-id">ID: {{ influencer.id }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ formatNumber(influencer.fansCount) }}</td>
                <td>{{ influencer.shopName }}</td>
                <td>{{ influencer.category }}</td>
                <td>
                  <span class="link-text" @click="openProductModal(influencer)">{{ influencer.productCount }}</span>
                </td>
                <td>¥{{ formatNumber(influencer.salesAmount) }}</td>
                <td>{{ formatNumber(influencer.salesVolume) }}</td>
                <td>{{ influencer.livePercent }}%</td>
                <td>{{ influencer.videoPercent }}%</td>
                <td>{{ influencer.showcasePercent }}%</td>
                <td>{{ influencer.lastOrderTime }}</td>
                <td>
                  <button class="btn-assign" @click="openAssignModal(influencer)">分配</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 区域D：分页区 -->
        <div class="pagination-bar">
          <div class="pagination-info">
            共{{ totalRecords }}条记录 第{{ currentPage }}/{{ totalPages }}页
          </div>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <template v-for="page in visiblePages" :key="page">
              <span v-if="page === '...'" class="page-ellipsis">...</span>
              <button
                v-else
                class="page-btn"
                :class="{ active: page === currentPage }"
                @click="goToPage(page)"
              >{{ page }}</button>
            </template>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
            <select v-model="pageSize" class="page-size-select" @change="changePageSize">
              <option :value="10">10条/页</option>
              <option :value="20">20条/页</option>
              <option :value="50">50条/页</option>
            </select>
            <div class="jump-to">
              跳至 <input type="number" class="jump-input" v-model="jumpPage" @keyup.enter="handleJump" /> 页
            </div>
          </div>
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

// 平台数据
const platforms = [
  { label: 'TikTok', value: 'tiktok', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.44 6.26 6.26 0 001.88-4.48V8.73a8.26 8.26 0 004.7 1.54V6.79a4.83 4.83 0 01-1-.1z"/></svg>' },
  { label: 'Instagram', value: 'instagram', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z"/></svg>' },
  { label: 'Shopee', value: 'shopee', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>' },
  { label: 'Lazada', value: 'lazada', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>' }
]

// 状态
const selectedPlatform = ref('tiktok')
const searchKeyword = ref('')
const loading = ref(false)
const influencerList = ref([])
const selectedRows = ref([])
const selectAll = ref(false)

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
const jumpPage = ref(1)

// 排序
const sortKey = ref('')
const sortOrder = ref('')

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

// Mock数据
const generateMockData = () => {
  const names = ['美妆达人小A', '数码评测师', '生活家小李', '时尚博主M', '美食创作者', '母婴达人', '健身教练阿明', '旅行博主小花', '家居达人老王', '宠物博主小青']
  const shops = ['旗舰店A', '专营店B', '直营店C', '海外旗舰店', '官方店']
  const categories = ['美妆护肤', '3C数码', '服饰内衣', '食品饮料', '家居日用', '母婴用品', '运动户外']

  return Array.from({ length: 20 }, (_, i) => ({
    id: `IF${10001 + i}`,
    name: names[i % names.length] + (i > 9 ? i : ''),
    avatar: `https://via.placeholder.com/40?text=${names[i % names.length].charAt(0)}`,
    fansCount: Math.floor(Math.random() * 500000) + 10000,
    shopName: shops[i % shops.length],
    category: categories[i % categories.length],
    productCount: Math.floor(Math.random() * 200) + 10,
    salesAmount: Math.floor(Math.random() * 1000000) + 50000,
    salesVolume: Math.floor(Math.random() * 50000) + 1000,
    livePercent: Math.floor(Math.random() * 40) + 10,
    videoPercent: Math.floor(Math.random() * 30) + 5,
    showcasePercent: Math.floor(Math.random() * 30) + 5,
    lastOrderTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
  }))
}

const allMockData = generateMockData()

// 计算属性
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value) || 1)

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  return pages
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

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedRows.value = influencerList.value.map(i => i.id)
  } else {
    selectedRows.value = []
  }
}

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
  loadData()
}

const getSortClass = (key) => {
  if (sortKey.value !== key) return ''
  return sortOrder.value === 'asc' ? 'asc' : 'desc'
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

const handleAvatarError = (e) => {
  e.target.src = 'https://via.placeholder.com/40?text=User'
}

const handleProductImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/48?text=Product'
}

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadData()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadData()
  }
}

const goToPage = (page) => {
  if (page === '...' || page === currentPage.value) return
  currentPage.value = page
  loadData()
}

const changePageSize = () => {
  currentPage.value = 1
  loadData()
}

const handleJump = () => {
  const page = parseInt(jumpPage.value)
  if (page < 1 || page > totalPages.value) {
    return
  }
  currentPage.value = page
  loadData()
}

// 加载数据
const loadData = () => {
  loading.value = true

  setTimeout(() => {
    let filtered = [...allMockData]

    // 关键词过滤
    if (searchKeyword.value) {
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        i.id.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }

    // 排序
    if (sortKey.value) {
      filtered.sort((a, b) => {
        const aVal = a[sortKey.value]
        const bVal = b[sortKey.value]
        return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    totalRecords.value = filtered.length
    const start = (currentPage.value - 1) * pageSize.value
    influencerList.value = filtered.slice(start, start + pageSize.value)
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
  selectAll.value = false
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
  width: 100%;
  min-height: 100%;
  background: $bg-page;
}

.page-container {
  padding: 16px 24px;
}

.content-card {
  background: $bg-card;
  border-radius: 8px;
  padding: 16px;
}

// 筛选区
.filter-section {
  padding-bottom: 16px;
  border-bottom: 1px solid $border-light;
}

.platform-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  color: $text-secondary;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: $light-blue-bg;
    color: $primary-blue;
  }

  &.active {
    background: $primary-blue;
    color: #fff;
  }
}

.platform-icon {
  display: flex;
  align-items: center;
}

.search-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input-wrapper {
  flex: 1;
  max-width: 320px;
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 0 12px;
  border: 1px solid $border-default;
  border-radius: 4px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: $primary-blue;
  }

  &::placeholder {
    color: $text-placeholder;
  }
}

.btn-search {
  height: 32px;
  padding: 0 20px;
  background: $primary-blue;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #4096FF;
  }
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
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
  width: 140px;
}

.filter-date {
  width: 140px;
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
  padding: 16px 0;
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
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.influencer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.influencer-info {
  display: flex;
  flex-direction: column;
}

.influencer-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.influencer-id {
  font-size: 12px;
  color: $text-hint;
}

.link-text {
  color: $primary-blue;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.btn-assign {
  padding: 4px 12px;
  background: $primary-blue;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #4096FF;
  }
}

// 分页
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid $border-light;
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
    border: 1px solid #B7EB8F;
  }

  &.fail {
    background: #FFF1F0;
    border: 1px solid #FFCCC7;
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

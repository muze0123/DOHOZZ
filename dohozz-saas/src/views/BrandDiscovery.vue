<template>
  <div class="brand-discovery">
    <!-- 初始态：居中搜索布局 -->
    <div v-if="!hasSearched" class="search-initial-container">
      <div class="search-inner">
        <!-- 页面标题 -->
        <h1 class="page-title">品牌找达人</h1>

        <!-- 搜索框区域 -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              placeholder="请输入品牌名称"
              @keyup.enter="handleSearch"
            />
            <span v-if="searchKeyword" class="search-clear-icon" @click="clearInput">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </span>
          </div>
          <button class="btn-search" @click="handleSearch">搜索</button>
        </div>

        <!-- 搜索历史区域 -->
        <div class="search-history">
          <div class="history-title">搜索历史（展示近20条搜索记录）</div>
          <div class="history-tags">
            <template v-if="searchHistory.length > 0">
              <span
                v-for="(keyword, index) in searchHistory"
                :key="index"
                class="history-tag"
                @click="handleHistoryClick(keyword)"
              >
                {{ keyword }}
                <span class="history-tag-close" @click.stop="removeHistory(keyword)">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </span>
              </span>
            </template>
            <span v-else class="history-empty">暂无</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果态：搜索结果布局 -->
    <div v-else class="search-result-container">
      <!-- 顶部搜索区 -->
      <div class="search-result-top">
        <h1 class="result-page-title">品牌找达人</h1>
        <div class="search-bar result-search-bar">
          <div class="search-input-wrapper">
            <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              placeholder="请输入品牌名称"
              @keyup.enter="handleSearch"
            />
            <span v-if="searchKeyword" class="search-clear-icon" @click="clearInput">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </span>
          </div>
          <button class="btn-search" @click="handleSearch">搜索</button>
        </div>
      </div>

      <!-- 筛选区 -->
      <div class="filter-area">
        <!-- 带货分类行 -->
        <div class="filter-row">
          <span class="filter-row-label">带货分类</span>
          <div class="category-tags" :class="{ expanded: categoryExpanded }">
            <span
              class="category-tag"
              :class="{ active: selectedCategory === '' }"
              @click="selectCategory('')"
            >全部</span>
            <span
              v-for="cat in displayCategories"
              :key="cat"
              class="category-tag"
              :class="{ active: selectedCategory === cat }"
              @click="selectCategory(cat)"
            >{{ cat }}</span>
          </div>
          <span v-if="!categoryExpanded" class="category-expand-btn" @click="categoryExpanded = true">展开 <span style="font-size:10px">↓</span></span>
          <span v-else class="category-expand-btn" @click="categoryExpanded = false">收起 <span style="font-size:10px">↑</span></span>
        </div>

        <!-- 带货信息行 -->
        <div class="filter-row">
          <span class="filter-row-label">带货信息</span>
          <div class="info-filter-row">
            <div
              v-for="item in infoFilters"
              :key="item.key"
              class="filter-dropdown"
              :class="{ active: item.active }"
              @click="toggleInfoFilter(item)"
            >
              {{ item.label }}
              <span class="arrow">↓</span>
            </div>
          </div>
        </div>

        <!-- 带货方式行 -->
        <div class="filter-row method-filter-row">
          <span class="filter-row-label">带货方式</span>
          <label v-for="method in salesMethods" :key="method.value" class="method-checkbox">
            <input type="checkbox" :value="method.value" v-model="selectedMethods" />
            {{ method.label }}
          </label>
        </div>

        <!-- 受众画像行 -->
        <div class="filter-row">
          <span class="filter-row-label">受众画像</span>
          <div class="info-filter-row">
            <div class="filter-dropdown">
              粉丝地区 <span class="arrow">↓</span>
            </div>
            <div class="filter-dropdown">
              粉丝性别 <span class="arrow">↓</span>
            </div>
            <div class="filter-dropdown">
              粉丝年龄 <span class="arrow">↓</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间切换栏 -->
      <div class="time-bar">
        <div class="time-tabs">
          <span
            v-for="tab in timeTabs"
            :key="tab.value"
            class="time-tab"
            :class="{ active: selectedTime === tab.value }"
            @click="selectTime(tab.value)"
          >{{ tab.label }}</span>
        </div>
        <div class="time-date-info">
          数据统计日期：{{ dateRange }}
          <span class="info-icon" title="数据更新频率：每日更新">①</span>
        </div>
      </div>

      <!-- 品牌数据表格列表 -->
      <div class="table-container">
        <!-- 加载中状态 -->
        <div v-if="loading" class="state-loading">
          <div class="loading-spinner"></div>
          <span>数据加载中…</span>
        </div>

        <!-- 请求超时状态 -->
        <div v-else-if="timeout" class="state-empty">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="#d9d9d9">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>请求超时，请稍后重试</span>
          <span class="retry-btn" @click="retryLoad">重试</span>
        </div>

        <!-- 暂无数据状态 -->
        <div v-else-if="brandList.length === 0" class="state-empty">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="#d9d9d9">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-4h2v-2h-2v2zm1-10c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
          </svg>
          <span>该关键词暂无相关数据</span>
        </div>

        <!-- 品牌数据表格 -->
        <table v-else class="brand-table">
          <thead>
            <tr>
              <th class="brand-col">品牌</th>
              <th class="sortable-th" :class="getSortClass('products')" @click="toggleSort('products')">推广商品数 <span class="sort-icon">↕</span></th>
              <th class="sortable-th" :class="getSortClass('salesAmount')" @click="toggleSort('salesAmount')">成交金额 <span class="sort-icon">↕</span></th>
              <th class="sortable-th" :class="getSortClass('orders')" @click="toggleSort('orders')">成交订单数 <span class="sort-icon">↕</span></th>
              <th>关联达人</th>
              <th>关联直播</th>
              <th>关联视频</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brand in brandList" :key="brand.id" class="brand-row">
              <td>
                <div class="brand-cell" @click="goToBrandDetail(brand)">
                  <img :src="brand.logo" :alt="brand.name" class="brand-logo" @error="handleLogoError" />
                  <span class="brand-name">{{ brand.name }}</span>
                </div>
              </td>
              <td>{{ brand.products }}</td>
              <td>¥{{ formatNumber(brand.salesAmount) }}</td>
              <td>{{ formatNumber(brand.orders) }}</td>
              <td>{{ brand.influencers }}</td>
              <td>{{ brand.lives }}</td>
              <td>{{ brand.videos }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页栏 -->
      <div v-if="brandList.length > 0" class="pagination-bar">
        <span class="page-item" @click="prevPage">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </span>
        <span
          v-for="page in visiblePages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >{{ page }}</span>
        <span class="page-item" @click="nextPage">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </span>
        <select v-model="pageSize" class="page-size-select" @change="changePageSize">
          <option :value="10">10条/页</option>
          <option :value="20">20条/页</option>
          <option :value="50">50条/页</option>
        </select>
        <div class="jump-to">
          跳至 <input type="number" class="jump-input" v-model="jumpPage" @keyup.enter="handleJump" /> 页
        </div>
        <span class="total-info">共{{ totalRecords }}条记录 第{{ currentPage }}/{{ totalPages }}页</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// 状态管理
const hasSearched = ref(false)
const searchKeyword = ref('')
const searchHistory = ref(JSON.parse(localStorage.getItem('brandSearchHistory') || '[]'))
const loading = ref(false)
const timeout = ref(false)
const categoryExpanded = ref(false)

// 分类数据
const allCategories = [
  '服饰内衣', '鞋靴箱包', '食品饮料', '珠宝饰品', '运动户外', '日用百货',
  '家居家纺', '家具建材', '礼品文创', '美妆护肤', '玩具乐器', '二手商品',
  '厨卫家电', '图书教育', '3C数码', '生鲜蔬果', '鲜花绿植', '母婴用品'
]

const displayCategories = computed(() => {
  return categoryExpanded.value ? allCategories : allCategories.slice(0, 10)
})

const selectedCategory = ref('')

// 带货信息筛选
const infoFilters = reactive([
  { key: 'salesAmount', label: '销售额', active: false, order: '' },
  { key: 'orders', label: '销量', active: false, order: '' },
  { key: 'influencers', label: '关联达人数', active: false, order: '' },
  { key: 'videos', label: '关联视频数', active: false, order: '' },
  { key: 'lives', label: '关联直播数', active: false, order: '' },
  { key: 'products', label: '商品数', active: false, order: '' }
])

// 带货方式
const salesMethods = [
  { label: '直播带货为主', value: 'live' },
  { label: '视频带货为主', value: 'video' },
  { label: '品牌自播为主', value: 'self' },
  { label: '小店播为主', value: 'shop' },
  { label: '达人播为主', value: 'influencer' }
]
const selectedMethods = ref([])

// 时间切换
const timeTabs = [
  { label: '昨天', value: 'yesterday' },
  { label: '近7天', value: 'week' },
  { label: '近30天', value: 'month' }
]
const selectedTime = ref('week')

const dateRange = computed(() => {
  const now = new Date()
  const formatDate = (d) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  if (selectedTime.value === 'yesterday') {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    return `${formatDate(yesterday)}-${formatDate(yesterday)}`
  } else if (selectedTime.value === 'week') {
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    return `${formatDate(weekAgo)}-${formatDate(now)}`
  } else {
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)
    return `${formatDate(monthAgo)}-${formatDate(now)}`
  }
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const jumpPage = ref(1)

// 排序
const sortKey = ref('')
const sortOrder = ref('')

// Mock数据
const mockBrands = [
  { id: 1, name: 'SK-II', logo: 'https://via.placeholder.com/36?text=SK', products: 209, salesAmount: 1234567, orders: 8932, influencers: 156, lives: 89, videos: 342 },
  { id: 2, name: '雅诗兰黛', logo: 'https://via.placeholder.com/36?text=EL', products: 185, salesAmount: 2345678, orders: 12345, influencers: 234, lives: 156, videos: 567 },
  { id: 3, name: '兰蔻', logo: 'https://via.placeholder.com/36?text=LC', products: 167, salesAmount: 1890345, orders: 9876, influencers: 198, lives: 123, videos: 456 },
  { id: 4, name: '迪奥', logo: 'https://via.placeholder.com/36?text=DI', products: 143, salesAmount: 3456789, orders: 15678, influencers: 267, lives: 178, videos: 623 },
  { id: 5, name: '香奈儿', logo: 'https://via.placeholder.com/36?text=CH', products: 98, salesAmount: 4567890, orders: 18765, influencers: 312, lives: 201, videos: 734 },
  { id: 6, name: '阿迪达斯', logo: 'https://via.placeholder.com/36?text=AD', products: 287, salesAmount: 5678901, orders: 23456, influencers: 445, lives: 289, videos: 892 },
  { id: 7, name: '耐克', logo: 'https://via.placeholder.com/36?text=NK', products: 312, salesAmount: 6789012, orders: 28901, influencers: 523, lives: 334, videos: 1023 },
  { id: 8, name: '苹果', logo: 'https://via.placeholder.com/36?text=AP', products: 156, salesAmount: 7890123, orders: 31234, influencers: 612, lives: 401, videos: 1156 },
  { id: 9, name: '华为', logo: 'https://via.placeholder.com/36?text=HW', products: 234, salesAmount: 8901234, orders: 34567, influencers: 701, lives: 467, videos: 1289 },
  { id: 10, name: '小米', logo: 'https://via.placeholder.com/36?text=MI', products: 289, salesAmount: 9012345, orders: 37890, influencers: 789, lives: 523, videos: 1423 },
  { id: 11, name: '蒙牛', logo: 'https://via.placeholder.com/36?text=MN', products: 198, salesAmount: 1123456, orders: 41234, influencers: 834, lives: 556, videos: 1534 },
  { id: 12, name: '伊利', logo: 'https://via.placeholder.com/36?text=YL', products: 187, salesAmount: 1234567, orders: 44567, influencers: 878, lives: 589, videos: 1645 }
]

const brandList = ref([])

// 计算总页数
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value) || 1)

// 计算可见页码
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

// 搜索行为
const handleSearch = () => {
  // 保存搜索历史
  if (searchKeyword.value && !searchHistory.value.includes(searchKeyword.value)) {
    searchHistory.value.unshift(searchKeyword.value)
    if (searchHistory.value.length > 20) {
      searchHistory.value.pop()
    }
    localStorage.setItem('brandSearchHistory', JSON.stringify(searchHistory.value))
  }

  hasSearched.value = true
  currentPage.value = 1
  loadData()
}

const handleHistoryClick = (keyword) => {
  searchKeyword.value = keyword
  handleSearch()
}

const removeHistory = (keyword) => {
  searchKeyword.value = ''
  searchHistory.value = searchHistory.value.filter(k => k !== keyword)
  localStorage.setItem('brandSearchHistory', JSON.stringify(searchHistory.value))
}

const clearInput = () => {
  searchKeyword.value = ''
}

// 分类选择
const selectCategory = (category) => {
  selectedCategory.value = category
  currentPage.value = 1
  loadData()
}

// 带货信息筛选
const toggleInfoFilter = (item) => {
  item.active = !item.active
  if (item.active && !item.order) {
    item.order = 'desc'
  } else if (!item.active) {
    item.order = ''
  }
  currentPage.value = 1
  loadData()
}

// 时间选择
const selectTime = (time) => {
  selectedTime.value = time
  currentPage.value = 1
  loadData()
}

// 排序
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

// 分页
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
    // Toast提示
    return
  }
  currentPage.value = page
  loadData()
}

// 加载数据（Mock实现）
const loadData = () => {
  loading.value = true
  timeout.value = false

  setTimeout(() => {
    // 模拟数据过滤
    let filtered = [...mockBrands]

    // 关键词过滤
    if (searchKeyword.value) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }

    // 分类过滤（Mock数据随机分配分类，此处简化处理）
    if (selectedCategory.value) {
      filtered = filtered.filter(() => Math.random() > 0.3)
    }

    // 排序
    if (sortKey.value) {
      filtered.sort((a, b) => {
        const aVal = a[sortKey.value]
        const bVal = b[sortKey.value]
        return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    totalRecords.value = filtered.length || 12
    brandList.value = filtered.slice(0, pageSize.value)
    loading.value = false
  }, 800)
}

// 重试
const retryLoad = () => {
  timeout.value = false
  loadData()
}

// Logo加载失败处理
const handleLogoError = (e) => {
  e.target.src = 'https://via.placeholder.com/36?text=Brand'
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

// 跳转品牌详情
const goToBrandDetail = (brand) => {
  console.log('跳转到品牌详情:', brand.name)
}
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
$bg-page: #FAFAFA;
$bg-card: #FFFFFF;

.brand-discovery {
  width: 100%;
  min-height: 100%;
  background: $bg-card;
}

// 初始态样式
.search-initial-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120px;
  min-height: 60vh;
}

.search-inner {
  width: 480px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: $text-primary;
  text-align: center;
  margin-bottom: 28px;
  letter-spacing: 0;
}

.result-page-title {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
  text-align: center;
  margin-bottom: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
  gap: 0;
}

.result-search-bar {
  margin-bottom: 0;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 36px 0 12px;
  border: 1px solid $border-default;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  color: $text-primary;
  outline: none;

  &::placeholder {
    color: $text-placeholder;
  }

  &:focus {
    border-color: $primary-blue;
    box-shadow: none;
  }
}

.search-clear-icon {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: $text-placeholder;

  &:hover {
    color: $text-secondary;
  }
}

.btn-search {
  width: 72px;
  height: 40px;
  background: $primary-blue;
  border: none;
  border-radius: 0 4px 4px 0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #4096FF;
  }
}

.search-history {
  width: 100%;
}

.history-title {
  font-size: 12px;
  color: $text-hint;
  margin-bottom: 10px;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  background: #F5F5F5;
  border-radius: 14px;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;
  gap: 6px;
  border: 1px solid $border-light;
  transition: all 0.15s;

  &:hover {
    background: $light-blue-bg;
    border-color: $light-blue-border;
    color: $primary-blue;
  }
}

.history-tag-close {
  width: 14px;
  height: 14px;
  color: $text-placeholder;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: $text-secondary;
  }
}

.history-empty {
  color: $text-hint;
  font-size: 13px;
}

// 结果态样式
.search-result-container {
  width: 100%;
}

.search-result-top {
  padding-top: 32px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $bg-card;
}

.filter-area {
  width: 100%;
  padding: 0 24px;
  background: $bg-page;
  border-bottom: 1px solid #F0F0F0;
}

.filter-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  gap: 8px;
  border-bottom: 1px solid #F5F5F5;
  flex-wrap: wrap;

  &:last-child {
    border-bottom: none;
  }
}

.filter-row-label {
  font-size: 12px;
  color: $text-hint;
  white-space: nowrap;
  min-width: 52px;
}

.category-tags {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  flex: 1;
  overflow: hidden;
  align-items: center;

  &.expanded {
    flex-wrap: wrap;
    overflow: visible;
  }
}

.category-tag {
  height: 26px;
  padding: 0 12px;
  border-radius: 13px;
  border: 1px solid $border-light;
  background: #fff;
  font-size: 12px;
  color: $text-secondary;
  cursor: pointer;
  white-space: nowrap;

  &.active {
    background: $light-blue-bg;
    border-color: $light-blue-border;
    color: $primary-blue;
    font-weight: 500;
  }

  &:hover:not(.active) {
    border-color: $light-blue-border;
    color: $primary-blue;
  }
}

.category-expand-btn {
  color: $primary-blue;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.info-filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid $border-light;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: $text-secondary;
  cursor: pointer;
  white-space: nowrap;

  .arrow {
    font-size: 10px;
    color: $text-hint;
  }

  &:hover {
    border-color: $light-blue-border;
    color: $primary-blue;
  }

  &.active {
    border-color: $primary-blue;
    color: $primary-blue;
    background: $light-blue-bg;
  }
}

.method-filter-row {
  gap: 16px;
}

.method-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: $text-secondary;
  cursor: pointer;

  input[type='checkbox'] {
    accent-color: $primary-blue;
    width: 14px;
    height: 14px;
  }
}

.time-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;
}

.time-tabs {
  display: flex;
  gap: 0;
}

.time-tab {
  height: 28px;
  padding: 0 14px;
  border: 1px solid $border-default;
  background: #fff;
  font-size: 12px;
  color: $text-secondary;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }

  & + & {
    border-left: none;
  }

  &.active {
    background: $light-blue-bg;
    border-color: $primary-blue;
    color: $primary-blue;
    font-weight: 500;
    z-index: 1;
  }
}

.time-date-info {
  font-size: 12px;
  color: $text-hint;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid $text-hint;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
}

.table-container {
  padding: 0 24px;
  background: #fff;
}

.state-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  color: $text-hint;
  font-size: 14px;
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid $border-light;
  border-top-color: $primary-blue;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
  color: $text-hint;
  font-size: 14px;
  gap: 12px;

  svg {
    opacity: 0.5;
  }
}

.retry-btn {
  color: $primary-blue;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    text-decoration: underline;
  }
}

.brand-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  thead tr {
    background: $bg-page;
    border-bottom: 1px solid #F0F0F0;
  }

  thead th {
    padding: 12px 16px;
    color: $text-hint;
    font-weight: 400;
    text-align: left;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid #F5F5F5;
    transition: background 0.15s;

    &:hover {
      background: $bg-page;
    }
  }

  tbody td {
    padding: 16px;
    color: $text-primary;
    vertical-align: middle;
  }
}

.brand-col {
  flex: 2;
}

.sortable-th {
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .sort-icon {
    font-size: 10px;
    color: $text-placeholder;
  }

  &.asc .sort-icon {
    color: $primary-blue;
  }

  &.desc .sort-icon {
    color: $primary-blue;
  }
}

.brand-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background: #F5F5F5;
  object-fit: contain;
  flex-shrink: 0;
}

.brand-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;

  &:hover {
    color: $primary-blue;
  }
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  gap: 8px;
  background: #fff;
}

.page-item {
  min-width: 32px;
  height: 32px;
  border: 1px solid $border-default;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;

  &.active {
    background: $primary-blue;
    border-color: $primary-blue;
    color: #fff;
  }

  &:hover:not(.active) {
    border-color: $primary-blue;
    color: $primary-blue;
  }
}

.page-size-select {
  height: 32px;
  border: 1px solid $border-default;
  border-radius: 4px;
  padding: 0 8px;
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

.total-info {
  font-size: 13px;
  color: $text-hint;
  margin-left: 12px;
}
</style>

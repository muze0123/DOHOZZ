<template>
  <div class="product-search-influencer">
    <!-- 页面容器 -->
    <div class="page-wrapper">
      <!-- 初始态：居中搜索布局 -->
      <div v-if="!hasSearched" class="search-initial-container">
        <div class="search-center-box">
          <!-- 标题 -->
          <h1 class="page-title">商品找达人</h1>

          <!-- 搜索框区域 -->
          <div class="search-bar">
            <div class="search-input-wrapper">
              <input
                v-model="searchKeyword"
                type="text"
                class="search-input"
                placeholder="请输入商品名称/ID"
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
          <h1 class="result-page-title">商品找达人</h1>
          <div class="search-bar result-search-bar">
            <div class="search-input-wrapper">
              <input
                v-model="searchKeyword"
                type="text"
                class="search-input"
                placeholder="请输入商品名称/ID"
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
          <!-- 一级分类 -->
          <div class="filter-row category-row">
            <span class="filter-row-label">商品分类</span>
            <div class="category-tags">
              <span
                v-for="cat in displayCategories"
                :key="cat.value"
                class="category-tag"
                :class="{ active: selectedCategory === cat.value }"
                @click="selectCategory(cat.value)"
              >
                {{ cat.label }}
              </span>
            </div>
            <span v-if="selectedCategory" class="category-expand-btn" @click="showAllCategories = !showAllCategories">
              {{ showAllCategories ? '收起' : '展开' }}
              <span class="arrow">{{ showAllCategories ? '↑' : '↓' }}</span>
            </span>
          </div>

          <!-- 二级分类 -->
          <div v-if="selectedCategory && currentSubCategories.length > 0" class="filter-row subcategory-row">
            <span class="filter-row-label"></span>
            <div class="subcategory-tags">
              <span
                v-for="sub in currentSubCategories"
                :key="sub"
                class="subcategory-tag"
                :class="{ active: selectedSubCategory === sub }"
                @click="selectSubCategory(sub)"
              >
                {{ sub }}
              </span>
            </div>
          </div>

          <!-- 多维筛选 -->
          <div class="filter-row filter-dimensions-row">
            <div class="filter-dropdown" :class="{ active: showFilterDropdown.source }" @click="toggleFilterDropdown('source')">
              商品来源 <span class="arrow">↓</span>
            </div>
            <div class="filter-dropdown" :class="{ active: filters.commissionRange }" @click="toggleFilterDropdown('commission')">
              佣金比例 <span class="arrow">{{ filters.commissionRange ? '✓' : '↓' }}</span>
            </div>
            <div class="filter-dropdown" :class="{ active: filters.salesRange }" @click="toggleFilterDropdown('sales')">
              销售额 <span class="arrow">{{ filters.salesRange ? '✓' : '↓' }}</span>
            </div>
            <div class="filter-dropdown" :class="{ active: filters.dailySalesRange }" @click="toggleFilterDropdown('dailySales')">
              日均带货销售额 <span class="arrow">{{ filters.dailySalesRange ? '✓' : '↓' }}</span>
            </div>
            <div class="filter-dropdown" :class="{ active: filters.priceRange }" @click="toggleFilterDropdown('price')">
              价格 <span class="arrow">{{ filters.priceRange ? '✓' : '↓' }}</span>
            </div>
            <div class="filter-dropdown" :class="{ active: filters.influencerRange }" @click="toggleFilterDropdown('influencer')">
              关联达人 <span class="arrow">{{ filters.influencerRange ? '✓' : '↓' }}</span>
            </div>
          </div>

          <!-- 筛选下拉面板 -->
          <div v-if="activeFilterDropdown" class="filter-dropdown-panel" @click.stop>
            <div class="panel-header">
              <span class="panel-title">{{ filterDropdownTitles[activeFilterDropdown] }}</span>
              <button class="panel-close" @click="closeFilterDropdown">×</button>
            </div>
            <div class="panel-body">
              <!-- 商品来源 -->
              <template v-if="activeFilterDropdown === 'source'">
                <div class="radio-options">
                  <label v-for="opt in sourceOptions" :key="opt.value" class="radio-option">
                    <input type="radio" :value="opt.value" v-model="filters.source" />
                    {{ opt.label }}
                  </label>
                </div>
              </template>

              <!-- 佣金比例 -->
              <template v-if="activeFilterDropdown === 'commission'">
                <div class="range-options">
                  <label v-for="opt in commissionOptions" :key="opt.value" class="radio-option">
                    <input type="radio" :value="opt.value" v-model="filters.commissionRange" />
                    {{ opt.label }}
                  </label>
                </div>
                <div class="custom-range">
                  <input type="number" v-model="filters.commissionMin" placeholder="最小值" class="range-input" /> -
                  <input type="number" v-model="filters.commissionMax" placeholder="最大值" class="range-input" /> %
                  <button class="btn-apply" @click="applyFilter('commission')">确定</button>
                </div>
              </template>

              <!-- 销售额 -->
              <template v-if="activeFilterDropdown === 'sales'">
                <div class="range-options">
                  <label v-for="opt in salesOptions" :key="opt.value" class="radio-option">
                    <input type="radio" :value="opt.value" v-model="filters.salesRange" />
                    {{ opt.label }}
                  </label>
                </div>
                <div class="custom-range">
                  <input type="number" v-model="filters.salesMin" placeholder="最小值" class="range-input" /> -
                  <input type="number" v-model="filters.salesMax" placeholder="最大值" class="range-input" />
                  <button class="btn-apply" @click="applyFilter('sales')">确定</button>
                </div>
              </template>

              <!-- 日均带货销售额 -->
              <template v-if="activeFilterDropdown === 'dailySales'">
                <div class="range-options">
                  <label v-for="opt in dailySalesOptions" :key="opt.value" class="radio-option">
                    <input type="radio" :value="opt.value" v-model="filters.dailySalesRange" />
                    {{ opt.label }}
                  </label>
                </div>
                <div class="custom-range">
                  <input type="number" v-model="filters.dailySalesMin" placeholder="最小值" class="range-input" /> -
                  <input type="number" v-model="filters.dailySalesMax" placeholder="最大值" class="range-input" />
                  <button class="btn-apply" @click="applyFilter('dailySales')">确定</button>
                </div>
              </template>

              <!-- 价格 -->
              <template v-if="activeFilterDropdown === 'price'">
                <div class="range-options">
                  <label v-for="opt in priceOptions" :key="opt.value" class="radio-option">
                    <input type="radio" :value="opt.value" v-model="filters.priceRange" />
                    {{ opt.label }}
                  </label>
                </div>
                <div class="custom-range">
                  <input type="number" v-model="filters.priceMin" placeholder="最小值" class="range-input" /> -
                  <input type="number" v-model="filters.priceMax" placeholder="最大值" class="range-input" />
                  <button class="btn-apply" @click="applyFilter('price')">确定</button>
                </div>
              </template>

              <!-- 关联达人 -->
              <template v-if="activeFilterDropdown === 'influencer'">
                <div class="range-options">
                  <label v-for="opt in influencerOptions" :key="opt.value" class="radio-option">
                    <input type="radio" :value="opt.value" v-model="filters.influencerRange" />
                    {{ opt.label }}
                  </label>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 数据列表 -->
        <div class="table-container">
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <div class="skeleton-table">
              <div v-for="i in 5" :key="i" class="skeleton-row">
                <div class="skeleton-cell" style="width: 280px;"></div>
                <div class="skeleton-cell" style="width: 80px;"></div>
                <div class="skeleton-cell" style="width: 80px;"></div>
                <div class="skeleton-cell" style="width: 100px;"></div>
                <div class="skeleton-cell" style="width: 100px;"></div>
                <div class="skeleton-cell" style="width: 100px;"></div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="productList.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" width="80" height="80" fill="#d9d9d9">
              <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
            </svg>
            <span>暂无商品数据</span>
          </div>

          <!-- 数据表格 -->
          <table v-else class="data-table">
            <thead>
              <tr>
                <th class="product-col">商品</th>
                <th class="sortable" :class="getSortClass('price')" @click="toggleSort('price')">
                  价格 <span class="sort-icon">↕</span>
                </th>
                <th class="sortable" :class="getSortClass('commissionRate')" @click="toggleSort('commissionRate')">
                  佣金比例 <span class="sort-icon">↕</span>
                </th>
                <th class="sortable" :class="getSortClass('totalSales')" @click="toggleSort('totalSales')">
                  总销售额 <span class="sort-icon">↕</span>
                </th>
                <th>直播销售额</th>
                <th>视频销售额</th>
                <th>商品卡销量</th>
                <th class="sortable" :class="getSortClass('influencerCount')" @click="toggleSort('influencerCount')">
                  关联达人 <span class="sort-icon">↕</span>
                </th>
                <th>关联直播</th>
                <th>关联视频</th>
                <th class="sortable" :class="getSortClass('views')" @click="toggleSort('views')">
                  浏览量 <span class="sort-icon">↕</span>
                </th>
                <th class="sortable" :class="getSortClass('conversionRate')" @click="toggleSort('conversionRate')">
                  转化率 <span class="sort-icon">↕</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in productList" :key="product.id" class="data-row">
                <td>
                  <div class="product-cell">
                    <img :src="product.image" :alt="product.name" class="product-image" @error="handleImageError" />
                    <div class="product-info">
                      <span class="product-name">{{ product.name }}</span>
                      <span class="product-id">ID: {{ product.id }}</span>
                    </div>
                  </div>
                </td>
                <td>¥{{ product.price }}</td>
                <td>{{ product.commissionRate }}%</td>
                <td>¥{{ formatNumber(product.totalSales) }}</td>
                <td>¥{{ formatNumber(product.liveSales) }}</td>
                <td>¥{{ formatNumber(product.videoSales) }}</td>
                <td>{{ formatNumber(product.productCardSales) }}</td>
                <td>{{ product.influencerCount }}</td>
                <td>{{ product.liveCount }}</td>
                <td>{{ product.videoCount }}</td>
                <td>{{ formatNumber(product.views) }}</td>
                <td>{{ product.conversionRate }}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页区 -->
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
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// 状态
const hasSearched = ref(false)
const searchKeyword = ref('')
const searchHistory = ref(JSON.parse(localStorage.getItem('productSearchHistory') || '[]'))
const loading = ref(false)
const selectedCategory = ref('')
const selectedSubCategory = ref('')
const showAllCategories = ref(false)
const activeFilterDropdown = ref('')

// 分类数据
const categories = [
  { value: 'meizhuang', label: '美妆', subCategories: ['护肤品', '彩妆', '香水', '美妆工具'] },
  { value: 'gehug', label: '个护', subCategories: ['口腔护理', '身体护理', '头发护理', '护肤工具'] },
  { value: 'jiadian', label: '家电', subCategories: ['厨房小电', '生活电器', '个护电器', '环境电器'] },
  { value: 'shuma', label: '数码', subCategories: ['手机', '电脑', '平板', '配件'] },
  { value: 'shipin', label: '食品', subCategories: ['零食', '饮料', '生鲜', '粮油'] },
  { value: 'yongpin', label: '用品', subCategories: ['家居', '餐厨', '收纳', '清洁'] },
  { value: 'muying', label: '母婴', subCategories: ['奶粉', '纸尿裤', '玩具', '童装'] },
  { value: 'fushi', label: '服饰', subCategories: ['女装', '男装', '童装', '鞋靴'] },
  { value: 'jiaju', label: '家居', subCategories: ['家具', '家纺', '装饰', '灯具'] },
  { value: 'sport', label: '运动', subCategories: ['运动鞋服', '健身器材', '户外装备', '运动包'] },
  { value: 'peishi', label: '配饰', subCategories: ['手表', '眼镜', '首饰', '箱包'] },
  { value: 'book', label: '图书', subCategories: ['童书', '文学', '社科', '生活'] }
]

const displayCategories = computed(() => {
  if (showAllCategories.value) return categories
  return categories.slice(0, 8)
})

const currentSubCategories = computed(() => {
  if (!selectedCategory.value) return []
  const cat = categories.find(c => c.value === selectedCategory.value)
  return cat ? cat.subCategories : []
})

// 筛选数据
const filters = reactive({
  source: '',
  commissionRange: '',
  commissionMin: '',
  commissionMax: '',
  salesRange: '',
  salesMin: '',
  salesMax: '',
  dailySalesRange: '',
  dailySalesMin: '',
  dailySalesMax: '',
  priceRange: '',
  priceMin: '',
  priceMax: '',
  influencerRange: ''
})

const filterDropdownTitles = {
  source: '商品来源',
  commission: '佣金比例',
  sales: '销售额',
  dailySales: '日均带货销售额',
  price: '价格',
  influencer: '关联达人'
}

const sourceOptions = [
  { label: '不限', value: '' },
  { label: '抖音电商', value: 'douyin' },
  { label: '天猫旗舰店', value: 'tmall' },
  { label: '京东自营', value: 'jd' },
  { label: '拼多多', value: 'pdd' }
]

const commissionOptions = [
  { label: '不限', value: '' },
  { label: '0%-5%', value: '0-5' },
  { label: '5%-10%', value: '5-10' },
  { label: '10%-20%', value: '10-20' },
  { label: '20%-30%', value: '20-30' },
  { label: '30%以上', value: '30+' }
]

const salesOptions = [
  { label: '不限', value: '' },
  { label: '1万以下', value: '0-10000' },
  { label: '1-10万', value: '10000-100000' },
  { label: '10-50万', value: '100000-500000' },
  { label: '50-100万', value: '500000-1000000' },
  { label: '100万以上', value: '1000000+' }
]

const dailySalesOptions = [
  { label: '不限', value: '' },
  { label: '1000以下', value: '0-1000' },
  { label: '1000-5000', value: '1000-5000' },
  { label: '5000-10000', value: '5000-10000' },
  { label: '10000-50000', value: '10000-50000' },
  { label: '50000以上', value: '50000+' }
]

const priceOptions = [
  { label: '不限', value: '' },
  { label: '0-50元', value: '0-50' },
  { label: '50-100元', value: '50-100' },
  { label: '100-200元', value: '100-200' },
  { label: '200-500元', value: '200-500' },
  { label: '500元以上', value: '500+' }
]

const influencerOptions = [
  { label: '不限', value: '' },
  { label: '10人以下', value: '0-10' },
  { label: '10-50人', value: '10-50' },
  { label: '50-100人', value: '50-100' },
  { label: '100-500人', value: '100-500' },
  { label: '500人以上', value: '500+' }
]

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const jumpPage = ref(1)

// 排序
const sortKey = ref('')
const sortOrder = ref('')

// 商品列表
const productList = ref([])

// Mock数据
const mockProducts = [
  { id: 'P10001', name: 'SK-II 护肤精华露230ml', image: 'https://via.placeholder.com/60?text=SK', price: 1199, commissionRate: 15, totalSales: 1234567, liveSales: 456789, videoSales: 345678, productCardSales: 432100, influencerCount: 234, liveCount: 89, videoCount: 156, views: 567890, conversionRate: 3.2 },
  { id: 'P10002', name: '雅诗兰黛小棕瓶精华50ml', image: 'https://via.placeholder.com/60?text=EL', price: 899, commissionRate: 12, totalSales: 2345678, liveSales: 789012, videoSales: 567890, productCardSales: 988776, influencerCount: 345, liveCount: 123, videoCount: 234, views: 890123, conversionRate: 2.8 },
  { id: 'P10003', name: '兰蔻小黑瓶精华50ml', image: 'https://via.placeholder.com/60?text=LC', price: 1080, commissionRate: 14, totalSales: 1890345, liveSales: 623456, videoSales: 456789, productCardSales: 811100, influencerCount: 289, liveCount: 98, videoCount: 198, views: 678901, conversionRate: 3.5 },
  { id: 'P10004', name: '迪奥999口红', image: 'https://via.placeholder.com/60?text=DI', price: 358, commissionRate: 18, totalSales: 3456789, liveSales: 1234567, videoSales: 890123, productCardSales: 1332100, influencerCount: 456, liveCount: 167, videoCount: 289, views: 1234567, conversionRate: 4.1 },
  { id: 'P10005', name: '香奈儿5号香水50ml', image: 'https://via.placeholder.com/60?text=CH', price: 1280, commissionRate: 10, totalSales: 4567890, liveSales: 1567890, videoSales: 1234567, productCardSales: 1765440, influencerCount: 378, liveCount: 134, videoCount: 245, views: 1567890, conversionRate: 2.5 },
  { id: 'P10006', name: '阿迪达斯运动鞋', image: 'https://via.placeholder.com/60?text=AD', price: 699, commissionRate: 20, totalSales: 5678901, liveSales: 2345678, videoSales: 1567890, productCardSales: 1765330, influencerCount: 567, liveCount: 201, videoCount: 366, views: 2345678, conversionRate: 3.8 },
  { id: 'P10007', name: '耐克跑步鞋', image: 'https://via.placeholder.com/60?text=NK', price: 799, commissionRate: 18, totalSales: 6789012, liveSales: 2890123, videoSales: 1789012, productCardSales: 2109877, influencerCount: 623, liveCount: 223, videoCount: 400, views: 2890123, conversionRate: 3.6 },
  { id: 'P10008', name: '苹果AirPods Pro', image: 'https://via.placeholder.com/60?text=AP', price: 1999, commissionRate: 8, totalSales: 7890123, liveSales: 3123456, videoSales: 2345678, productCardSales: 2420989, influencerCount: 712, liveCount: 267, videoCount: 445, views: 3456789, conversionRate: 2.1 },
  { id: 'P10009', name: '华为FreeBuds耳机', image: 'https://via.placeholder.com/60?text=HW', price: 899, commissionRate: 12, totalSales: 8901234, liveSales: 3456789, videoSales: 2678901, productCardSales: 2765544, influencerCount: 789, liveCount: 289, videoCount: 500, views: 4012345, conversionRate: 2.9 },
  { id: 'P10010', name: '小米空气净化器', image: 'https://via.placeholder.com/60?text=MI', price: 599, commissionRate: 15, totalSales: 9012345, liveSales: 3789012, videoSales: 3012345, productCardSales: 2210988, influencerCount: 834, liveCount: 312, videoCount: 522, views: 4567890, conversionRate: 3.3 },
  { id: 'P10011', name: '蒙牛纯牛奶250ml*24盒', image: 'https://via.placeholder.com/60?text=MN', price: 68, commissionRate: 25, totalSales: 11234567, liveSales: 4567890, videoSales: 3567890, productCardSales: 3298767, influencerCount: 923, liveCount: 345, videoCount: 578, views: 5678901, conversionRate: 5.2 },
  { id: 'P10012', name: '伊利金典纯牛奶250ml*20盒', image: 'https://via.placeholder.com/60?text=YL', price: 58, commissionRate: 25, totalSales: 12345678, liveSales: 5012345, videoSales: 3890123, productCardSales: 3432110, influencerCount: 978, liveCount: 367, videoCount: 611, views: 6234567, conversionRate: 5.0 }
]

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

// 方法
const handleSearch = () => {
  if (searchKeyword.value && !searchHistory.value.includes(searchKeyword.value)) {
    searchHistory.value.unshift(searchKeyword.value)
    if (searchHistory.value.length > 20) {
      searchHistory.value.pop()
    }
    localStorage.setItem('productSearchHistory', JSON.stringify(searchHistory.value))
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
  searchHistory.value = searchHistory.value.filter(k => k !== keyword)
  localStorage.setItem('productSearchHistory', JSON.stringify(searchHistory.value))
}

const clearInput = () => {
  searchKeyword.value = ''
}

const selectCategory = (value) => {
  selectedCategory.value = value
  selectedSubCategory.value = ''
  currentPage.value = 1
  loadData()
}

const selectSubCategory = (sub) => {
  selectedSubCategory.value = selectedSubCategory.value === sub ? '' : sub
  currentPage.value = 1
  loadData()
}

const toggleFilterDropdown = (type) => {
  activeFilterDropdown.value = activeFilterDropdown.value === type ? '' : type
}

const closeFilterDropdown = () => {
  activeFilterDropdown.value = ''
}

const applyFilter = (type) => {
  closeFilterDropdown()
  currentPage.value = 1
  loadData()
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

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/60?text=Product'
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
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadData()
}

// 加载数据
const loadData = () => {
  loading.value = true

  setTimeout(() => {
    let filtered = [...mockProducts]

    // 关键词过滤
    if (searchKeyword.value) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        p.id.toLowerCase().includes(searchKeyword.value.toLowerCase())
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

    totalRecords.value = filtered.length || 12
    const start = (currentPage.value - 1) * pageSize.value
    productList.value = filtered.slice(start, start + pageSize.value)
    loading.value = false
  }, 600)
}

// 点击其他区域关闭筛选面板
document.addEventListener('click', () => {
  if (activeFilterDropdown.value) {
    activeFilterDropdown.value = ''
  }
})
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

.product-search-influencer {
  min-height: 805px;
  min-height: min(805px, calc(100vh - 60px - 32px));
  background: #ffffff;
  padding: 16px 24px;
  border-radius: 8px;
}

.page-wrapper {
  max-width: none;
  margin: 0;
  padding: 0;
}

// 初始态样式
.search-initial-container {
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

.search-center-box {
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 24px;
}

.result-page-title {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 16px;
}

.search-bar {
  display: flex;
  width: 100%;
}

.result-search-bar {
  width: 600px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 12px;
  border: 1px solid $border-default;
  border-right: none;
  border-radius: 6px 0 0 6px;
  font-size: 14px;
  color: $text-primary;
  outline: none;

  &::placeholder {
    color: $text-placeholder;
  }

  &:focus {
    border-color: $primary-blue;
  }
}

.search-clear-icon {
  position: absolute;
  right: 100px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: $text-placeholder;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: $text-secondary;
  }
}

.btn-search {
  width: 88px;
  height: 40px;
  background: $primary-blue;
  border: none;
  border-radius: 0 6px 6px 0;
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
  margin-top: 16px;
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
  padding: 4px 10px;
  background: #F0F2F5;
  border-radius: 4px;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;
  gap: 6px;
  transition: all 0.15s;

  &:hover {
    background: $light-blue-bg;
    color: $primary-blue;
  }
}

.history-tag-close {
  width: 14px;
  height: 14px;
  color: $text-placeholder;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 16px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  border: none;
  border-bottom: none;
}

.filter-area {
  position: relative;
  width: 100%;
  padding: 0 16px;
  background: #fff;
  border: none;
  border-top: none;
}

.filter-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid $border-light;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-row-label {
  font-size: 13px;
  color: $text-hint;
  min-width: 60px;
}

.category-row {
  border-bottom: none;
}

.category-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: $primary-blue;
  }

  &.active {
    background: $primary-blue;
    color: #fff;
  }
}

.category-expand-btn {
  font-size: 13px;
  color: $primary-blue;
  cursor: pointer;
  margin-left: auto;
}

.subcategory-row {
  padding: 8px 0;
  border-bottom: 1px solid $border-light;
}

.subcategory-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.subcategory-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: $text-secondary;
  cursor: pointer;

  &:hover {
    color: $primary-blue;
  }

  &.active {
    background: $light-blue-bg;
    color: $primary-blue;
  }
}

.filter-dimensions-row {
  border-bottom: none;
}

.filter-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid $border-light;
  border-radius: 4px;
  font-size: 13px;
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

.filter-dropdown-panel {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  background: #fff;
  border: 1px solid $border-light;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid $border-light;
}

.panel-title {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.panel-close {
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  font-size: 18px;
  color: $text-hint;
  cursor: pointer;

  &:hover {
    color: $text-secondary;
  }
}

.panel-body {
  padding: 16px;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;

  input[type="radio"] {
    accent-color: $primary-blue;
  }

  &:hover {
    color: $primary-blue;
  }
}

.custom-range {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed $border-light;
}

.range-input {
  width: 80px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid $border-default;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
}

.btn-apply {
  height: 28px;
  padding: 0 12px;
  background: $primary-blue;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background: #4096FF;
  }
}

.table-container {
  padding: 16px;
  background: #fff;
  min-height: 400px;
  border: none;
  border-top: none;
  border-radius: 0 0 8px 8px;
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
  padding: 100px 0;
  color: $text-hint;

  svg {
    opacity: 0.5;
  }

  span {
    font-size: 14px;
    margin-top: 16px;
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
      background: #F5F7FA;
    }
  }

  tbody td {
    padding: 12px 8px;
    color: $text-primary;
    vertical-align: middle;
  }
}

.product-col {
  min-width: 280px;
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

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.product-id {
  font-size: 12px;
  color: $text-hint;
  margin-top: 4px;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
  background: #fff;
  border: none;
  border-top: none;
  border-radius: 0 0 8px 8px;
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
</style>

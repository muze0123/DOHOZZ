# 合作直播页面实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建合作直播页面（CollaborationLive.vue），包含平台Tab切换、11个筛选控件、追踪横幅、数据概览区、直播列表及分页功能。

**Architecture:** 遵循现有项目模式，创建4个组件文件（1个主页面 + 3个区域组件），集成到Dashboard侧边栏菜单。

**Tech Stack:** Vue 3 + Element Plus + SCSS

---

## 文件结构

```
dohozz-saas/src/
├── views/
│   └── CollaborationLive.vue          # 主页面容器
└── views/components/
    ├── CollabLiveFilterSection.vue    # 区域B筛选 + 区域C追踪横幅
    ├── CollabLiveStatsSection.vue     # 区域D数据概览
    └── CollabLiveListSection.vue      # 区域E直播列表
```

**Dashboard.vue 修改：**
- 添加 `CollaborationLive` 组件import
- 添加 `CollabLiveFilterSection`、`CollabLiveStatsSection`、`CollabLiveListSection` 组件import
- 添加条件渲染 `<CollaborationLive v-else-if="activeSidebarMenu === '合作直播'" />`
- 修改侧边栏菜单，将"合作内容"的children添加"合作直播"

---

## Task 1: 创建 CollabLiveFilterSection.vue

**Files:**
- Create: `dohozz-saas/src/views/components/CollabLiveFilterSection.vue`

- [ ] **Step 1: 创建筛选区组件基础结构**

```vue
<template>
  <div class="collab-live-filter-section">
    <!-- 区域A: 平台Tab切换 -->
    <div class="platform-tabs">
      <div
        v-for="platform in platforms"
        :key="platform.value"
        class="platform-tab"
        :class="{ active: activePlatform === platform.value }"
        @click="handlePlatformChange(platform.value)"
      >
        <img :src="platform.icon" class="platform-icon" />
        <span>{{ platform.label }}</span>
      </div>
    </div>

    <!-- 区域B: 筛选工具栏 -->
    <div class="filter-toolbar">
      <!-- 店铺名称 -->
      <el-select v-model="filters.shopId" placeholder="店铺名称" clearable>
        <el-option v-for="shop in shopList" :key="shop.id" :label="shop.name" :value="shop.id" />
      </el-select>

      <!-- 达人搜索 -->
      <el-input v-model="filters.influencerKeyword" placeholder="请输入达人名称/达人ID" clearable @keyup.enter="handleSearch" />

      <!-- 所属BD -->
      <el-select v-model="filters.bdId" placeholder="所属BD" clearable>
        <el-option v-for="bd in bdList" :key="bd.id" :label="bd.name" :value="bd.id" />
      </el-select>

      <!-- 所属部门 -->
      <el-select v-model="filters.departmentId" placeholder="所属部门" clearable>
        <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id" />
      </el-select>

      <!-- 商品搜索 -->
      <el-input v-model="filters.productKeyword" placeholder="请输入商品名称/商品ID" clearable @keyup.enter="handleSearch" />

      <!-- 销量筛选 -->
      <el-dropdown trigger="click" @command="handleSalesFilter">
        <span class="filter-dropdown">
          {{ salesFilterLabel }}
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="unlimited">不限</el-dropdown-item>
            <el-dropdown-item command="0-10">0-10</el-dropdown-item>
            <el-dropdown-item command="10-100">10-100</el-dropdown-item>
            <el-dropdown-item command="1000+">1000以上</el-dropdown-item>
            <el-dropdown-item command="custom">自定义</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 成交金额筛选 -->
      <el-dropdown trigger="click" @command="handleAmountFilter">
        <span class="filter-dropdown">
          {{ amountFilterLabel }}
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="unlimited">不限</el-dropdown-item>
            <el-dropdown-item command="0-500">¥0-500</el-dropdown-item>
            <el-dropdown-item command="500-2000">¥500-2000</el-dropdown-item>
            <el-dropdown-item command="2000-5000">¥2000-5000</el-dropdown-item>
            <el-dropdown-item command="5000+">¥5000以上</el-dropdown-item>
            <el-dropdown-item command="custom">自定义</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 是否有投放 -->
      <el-select v-model="filters.hasPromote" placeholder="是否有投放">
        <el-option label="全部" value="" />
        <el-option label="是" value="true" />
        <el-option label="否" value="false" />
      </el-select>

      <!-- 发布时间 -->
      <el-date-picker v-model="filters.dateRange" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD" />

      <!-- 是否有寄样 -->
      <el-select v-model="filters.hasSample" placeholder="是否有寄样">
        <el-option label="全部" value="" />
        <el-option label="是" value="true" />
        <el-option label="否" value="false" />
      </el-select>

      <!-- 有录屏 -->
      <el-checkbox v-model="filters.hasRecording" label="有录屏" />
    </div>

    <!-- 区域C: 追踪统计横幅 -->
    <div class="tracking-banner">
      <div class="banner-text">
        系统已为您累计追踪到
        <span class="highlight">{{ trackingData.influencerCount }}</span> 位达人的
        <span class="highlight">{{ trackingData.videoCount }}</span> 个视频及
        <span class="highlight">{{ trackingData.liveCount }}</span> 场直播
      </div>
      <div class="banner-actions">
        <el-button link @click="handleMyTrackInfluencers">我的追踪达人</el-button>
        <el-button link @click="handleMonitorRules">监控规则</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const emit = defineEmits(['filter-change', 'platform-change'])

// 平台列表
const platforms = [
  { label: 'TikTok', value: 'tiktok', icon: '/assets/platform/tiktok.png' },
  { label: 'Instagram', value: 'instagram', icon: '/assets/platform/instagram.png' },
  { label: 'Shopee', value: 'shopee', icon: '/assets/platform/shopee.png' },
  { label: 'Lazada', value: 'lazada', icon: '/assets/platform/lazada.png' }
]

const activePlatform = ref('tiktok')

// 筛选条件
const filters = reactive({
  shopId: '',
  influencerKeyword: '',
  bdId: '',
  departmentId: '',
  productKeyword: '',
  salesRange: null,      // [min, max]
  amountRange: null,     // [min, max]
  hasPromote: '',
  dateRange: [],
  hasSample: '',
  hasRecording: false
})

// 追踪数据（mock）
const trackingData = ref({
  influencerCount: 0,
  videoCount: 0,
  liveCount: 0
})

const salesFilterLabel = computed(() => {
  if (!filters.salesRange) return '销量'
  const [min, max] = filters.salesRange
  if (max === null) return `${min}以上`
  return `${min}-${max}`
})

const amountFilterLabel = computed(() => {
  if (!filters.amountRange) return '成交金额'
  const [min, max] = filters.amountRange
  if (max === null) return `${min}以上`
  return `${min}-${max}`
})

// 方法
const handlePlatformChange = (platform) => {
  activePlatform.value = platform
  emit('platform-change', platform)
}

const handleSalesFilter = (command) => {
  // 处理销量筛选
}

const handleAmountFilter = (command) => {
  // 处理成交金额筛选
}

const handleSearch = () => {
  emit('filter-change', { ...filters })
}

// 暴露方法给父组件
defineExpose({
  getFilters: () => ({ ...filters }),
  resetFilters: () => {
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key])) filters[key] = []
      else if (typeof filters[key] === 'boolean') filters[key] = false
      else filters[key] = ''
    })
  },
  setTrackingData: (data) => { trackingData.value = data }
})
</script>

<style lang="scss" scoped>
.collab-live-filter-section {
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.platform-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #E8E8E8;
  padding-bottom: 12px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 0;
  color: #65676B;
  font-size: 14px;

  &.active {
    color: #0064E0;
    font-weight: 600;
    border-bottom: 2px solid #0064E0;
  }

  .platform-icon {
    width: 20px;
    height: 20px;
  }
}

.filter-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-dropdown {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #F5F6F7;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #050505;

  &:hover {
    background: #E8E8E8;
  }
}

.tracking-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px 16px;
  background: #F0F2F5;
  border-radius: 6px;
}

.banner-text {
  font-size: 14px;
  color: #65676B;

  .highlight {
    color: #0064E0;
    font-weight: 600;
    font-size: 16px;
  }
}

.banner-actions {
  display: flex;
  gap: 16px;
}
</style>
```

- [ ] **Step 2: 运行验证**

验证文件创建成功，无语法错误。

---

## Task 2: 创建 CollabLiveStatsSection.vue

**Files:**
- Create: `dohozz-saas/src/views/components/CollabLiveStatsSection.vue`

- [ ] **Step 1: 创建数据概览组件**

```vue
<template>
  <div class="collab-live-stats-section">
    <!-- 统计范围说明 -->
    <div class="stats-range">
      <span>统计在 {{ dateRangeText }} 期间开播的达人直播间数据</span>
    </div>

    <!-- 概览卡片区 -->
    <div class="stats-cards">
      <!-- 合作直播数据汇总 -->
      <div class="stats-card-group">
        <div class="group-title">合作直播数据汇总</div>
        <div class="cards-row">
          <div class="stat-card">
            <div class="card-label">直播场次</div>
            <div class="card-value">{{ statsData.liveCount?.toLocaleString() ?? '——' }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">直播成交金额</div>
            <div class="card-value">{{ formatMoney(statsData.totalAmount) }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">直播销量</div>
            <div class="card-value">{{ statsData.salesCount?.toLocaleString() ?? '——' }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">直播退款金额</div>
            <div class="card-value warning">{{ formatMoney(statsData.refundAmount) }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">预估达人佣金</div>
            <div class="card-value success">{{ formatMoney(statsData.commission) }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">直播达人数</div>
            <div class="card-value">{{ statsData.influencerCount?.toLocaleString() ?? '——' }}</div>
          </div>
        </div>
      </div>

      <!-- 投放直播数据汇总 -->
      <div class="stats-card-group">
        <div class="group-title">投放直播数据汇总</div>
        <div class="cards-row">
          <div class="stat-card">
            <div class="card-label">投放直播数</div>
            <div class="card-value">{{ statsData.promoteLiveCount?.toLocaleString() ?? '——' }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">消耗金额</div>
            <div class="card-value">{{ formatMoney(statsData.consumeAmount) }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">成交金额（投放）</div>
            <div class="card-value">{{ formatMoney(statsData.promoteAmount) }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">成交订单数</div>
            <div class="card-value">{{ statsData.promoteOrderCount?.toLocaleString() ?? '——' }}</div>
          </div>
          <div class="stat-card">
            <div class="card-label">支付ROI</div>
            <div class="card-value">{{ formatROI(statsData.roi) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  statsData: {
    type: Object,
    default: () => ({})
  },
  dateRange: {
    type: Array,
    default: () => []
  }
})

const dateRangeText = computed(() => {
  if (!props.dateRange || props.dateRange.length !== 2) {
    return '近30天'
  }
  return `${props.dateRange[0]} - ${props.dateRange[1]}`
})

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') return '——'
  return '¥' + Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatROI = (value) => {
  if (value === null || value === undefined || value === '') return '——'
  return Number(value).toFixed(2)
}
</script>

<style lang="scss" scoped>
.collab-live-stats-section {
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.stats-range {
  font-size: 13px;
  color: #65676B;
  margin-bottom: 16px;
}

.stats-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-card-group {
  .group-title {
    font-size: 14px;
    font-weight: 600;
    color: #050505;
    margin-bottom: 12px;
  }
}

.cards-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.stat-card {
  flex: 1;
  min-width: 140px;
  padding: 16px;
  background: #F5F6F7;
  border-radius: 8px;

  .card-label {
    font-size: 13px;
    color: #65676B;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 20px;
    font-weight: 600;
    color: #050505;

    &.warning {
      color: #F7B928;
    }

    &.success {
      color: #31A24C;
    }
  }
}
</style>
```

- [ ] **Step 2: 运行验证**

---

## Task 3: 创建 CollabLiveListSection.vue

**Files:**
- Create: `dohozz-saas/src/views/components/CollabLiveListSection.vue`

- [ ] **Step 1: 创建直播列表组件**

```vue
<template>
  <div class="collab-live-list-section">
    <!-- 列表标题栏 -->
    <div class="list-header">
      <div class="header-left">
        <span class="page-title">直播列表</span>
        <div class="update-time">
          <span>数据更新时间：{{ updateTime }}</span>
          <el-tooltip content="收录达人有挂链合作商品的直播；监控规则：1.有寄样达人从发货时间起监控60天；2.有合作单达人从合作单创建监控至结束。达人被释放或单据删除/取消则停止监控。">
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </div>
      <div class="header-right">
        <el-input v-model="searchTitle" placeholder="请输入直播标题" clearable @keyup.enter="handleSearch" style="width: 200px;" />
        <el-select v-model="filterHasPromote" placeholder="是否有投放" style="width: 120px;" @change="handlePromoteFilter">
          <el-option label="全部" value="" />
          <el-option label="是" value="true" />
          <el-option label="否" value="false" />
        </el-select>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </div>
    </div>

    <!-- 子Tab -->
    <div class="sub-tabs">
      <span
        v-for="tab in subTabs"
        :key="tab.key"
        class="sub-tab"
        :class="{ active: activeSubTab === tab.key }"
        @click="handleSubTabChange(tab.key)"
      >
        {{ tab.label }}（{{ tab.count }}）
      </span>
    </div>

    <!-- 直播列表 -->
    <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick" highlight-current-row>
      <el-table-column type="selection" width="50" />
      <el-table-column label="视频 | 直播时间" min-width="200">
        <template #default="{ row }">
          <div class="video-cell">
            <img :src="row.coverUrl" class="video-cover" />
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
            <el-avatar :src="row.influencerAvatar" :size="32" />
            <div class="influencer-info">
              <div class="influencer-name">{{ row.influencerName }}</div>
              <div class="influencer-fans">{{ row.fansCount }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="合作商品" width="100">
        <template #default="{ row }">
          <el-tooltip v-if="row.productImg" placement="top">
            <img :src="row.productImg" class="product-thumb" />
            <template #content>
              <div class="product-tooltip">
                <div>{{ row.productName }}</div>
                <div>¥{{ row.productPrice }}</div>
              </div>
            </template>
          </el-tooltip>
          <span v-else class="empty-text">- -</span>
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" label="归属员工" width="100" />
      <el-table-column label="成交金额" min-width="120">
        <template #default="{ row }">
          <div class="amount-cell">
            <div>¥{{ row.amount }}</div>
            <div class="gmv-ratio">直播GMV占比：{{ row.gmvRatio }}%</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="salesCount" label="销量" width="80" />
      <el-table-column label="退款金额" min-width="100">
        <template #default="{ row }">
          <div class="amount-cell">
            <div>¥{{ row.refundAmount }}</div>
            <div class="refund-ratio">退款占比：{{ row.refundRatio }}%</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="预估达人佣金" width="110">
        <template #default="{ row }">
          <span>¥{{ row.commission }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有投流" width="90">
        <template #default="{ row }">
          <span :class="row.hasPromote ? 'text-success' : 'text-muted'">{{ row.hasPromote ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消耗金额" width="100">
        <template #default="{ row }">
          <span>{{ row.consumeAmount ? '¥' + row.consumeAmount : '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交金额（投放）" width="120">
        <template #default="{ row }">
          <span>{{ row.promoteAmount || '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交订单数（投放）" width="120">
        <template #default="{ row }">
          <span>{{ row.promoteOrderCount || '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付ROI" width="80">
        <template #default="{ row }">
          <span>{{ row.roi || '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="直播时长" width="120">
        <template #default="{ row }">
          <span>{{ row.duration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="观看人次" width="100">
        <template #default="{ row }">
          <span>{{ row.viewCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预估UV价值" width="100">
        <template #default="{ row }">
          <span>{{ row.uvValue || '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click.stop="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <span class="pagination-info">共 {{ total }} 条记录 第 {{ currentPage }}/{{ totalPages }} 页</span>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['filter-change', 'detail'])

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
    type: Array,
    default: () => []
  },
  hasPromote: {
    type: String,
    default: ''
  }
})

const searchTitle = ref('')
const activeSubTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const updateTime = ref('')

const tableData = ref([])

watch(() => props.listData, (val) => {
  tableData.value = val
}, { immediate: true, deep: true })

const totalPages = computed(() => Math.ceil(props.total / pageSize.value))

const subTabs = computed(() => [
  { key: 'all', label: '全部', count: props.subTabs.allCount || 0 },
  { key: 'hasOrder', label: '有出单', count: props.subTabs.hasOrderCount || 0 },
  { key: 'noOrder', label: '未出单', count: props.subTabs.noOrderCount || 0 }
])

const handleSearch = () => {
  emit('filter-change', { title: searchTitle.value, subTab: activeSubTab.value })
}

const handleSubTabChange = (key) => {
  activeSubTab.value = key
  currentPage.value = 1
  emit('filter-change', { subTab: key, page: 1 })
}

const handlePromoteFilter = () => {
  emit('filter-change', { hasPromote: props.hasPromote })
}

const handleExport = () => {
  ElMessage.success('导出成功，请查收')
}

const handleDetail = (row) => {
  emit('detail', row)
}

const handlePageChange = (page) => {
  emit('filter-change', { page })
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  emit('filter-change', { page: 1, pageSize: size })
}

const handleRowClick = (row) => {
  // 行点击高亮效果由 highlight-current-row 处理
}
</script>

<style lang="scss" scoped>
.collab-live-list-section {
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .page-title {
    font-size: 16px;
    font-weight: 600;
    color: #050505;
  }

  .update-time {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #65676B;
  }
}

.header-right {
  display: flex;
  gap: 12px;
}

.sub-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E8E8E8;
}

.sub-tab {
  font-size: 14px;
  color: #65676B;
  cursor: pointer;
  padding: 4px 0;

  &.active {
    color: #0064E0;
    font-weight: 600;
    border-bottom: 2px solid #0064E0;
  }
}

.video-cell {
  display: flex;
  gap: 12px;
  align-items: center;

  .video-cover {
    width: 60px;
    height: 36px;
    border-radius: 4px;
    object-fit: cover;
  }

  .video-info {
    .video-title {
      font-size: 13px;
      color: #050505;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .video-time {
      font-size: 12px;
      color: #65676B;
      margin-top: 4px;
    }
  }
}

.influencer-cell {
  display: flex;
  gap: 8px;
  align-items: center;

  .influencer-info {
    .influencer-name {
      font-size: 13px;
      color: #050505;
    }

    .influencer-fans {
      font-size: 12px;
      color: #65676B;
    }
  }
}

.product-thumb {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
}

.product-tooltip {
  font-size: 12px;
}

.amount-cell {
  .gmv-ratio,
  .refund-ratio {
    font-size: 11px;
    color: #65676B;
    margin-top: 2px;
  }
}

.text-success {
  color: #31A24C;
}

.text-muted {
  color: #65676B;
}

.empty-text {
  color: #BCC0C4;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;

  .pagination-info {
    font-size: 13px;
    color: #65676B;
  }
}
</style>
```

- [ ] **Step 2: 运行验证**

---

## Task 4: 创建 CollaborationLive.vue 主页面

**Files:**
- Create: `dohozz-saas/src/views/CollaborationLive.vue`

- [ ] **Step 1: 创建主页面组件**

```vue
<template>
  <div class="collaboration-live-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <template v-else>
      <!-- 区域A + 区域B + 区域C -->
      <CollabLiveFilterSection
        ref="filterRef"
        @filter-change="handleFilterChange"
        @platform-change="handlePlatformChange"
      />

      <!-- 区域D -->
      <CollabLiveStatsSection
        :stats-data="statsData"
        :date-range="filters.dateRange"
      />

      <!-- 区域E -->
      <CollabLiveListSection
        :list-data="listData"
        :total="total"
        :sub-tabs="subTabs"
        :has-promote="filters.hasPromote"
        @filter-change="handleListFilterChange"
        @detail="handleDetail"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import CollabLiveFilterSection from './components/CollabLiveFilterSection.vue'
import CollabLiveStatsSection from './components/CollabLiveStatsSection.vue'
import CollabLiveListSection from './components/CollabLiveListSection.vue'
import { ElMessage } from 'element-plus'

// 状态
const loading = ref(false)
const activePlatform = ref('tiktok')
const total = ref(0)
const listData = ref([])
const statsData = ref({})

// 筛选条件
const filters = reactive({
  shopId: '',
  influencerKeyword: '',
  bdId: '',
  departmentId: '',
  productKeyword: '',
  salesRange: null,
  amountRange: null,
  hasPromote: '',
  dateRange: [],
  hasSample: '',
  hasRecording: false,
  title: '',
  subTab: 'all',
  page: 1,
  pageSize: 10
})

const filterRef = ref(null)

// 子Tab统计
const subTabs = computed(() => ({
  allCount: statsData.value.totalLiveCount || 0,
  hasOrderCount: statsData.value.hasOrderLiveCount || 0,
  noOrderCount: statsData.value.noOrderLiveCount || 0
}))

// 方法
const handlePlatformChange = (platform) => {
  activePlatform.value = platform
  resetFilters()
  fetchData()
}

const handleFilterChange = (newFilters) => {
  Object.assign(filters, newFilters)
  filters.page = 1
  fetchData()
}

const handleListFilterChange = (params) => {
  if (params.subTab !== undefined) filters.subTab = params.subTab
  if (params.page !== undefined) filters.page = params.page
  if (params.pageSize !== undefined) filters.pageSize = params.pageSize
  if (params.title !== undefined) filters.title = params.title
  if (params.hasPromote !== undefined) filters.hasPromote = params.hasPromote
  fetchData()
}

const handleDetail = (row) => {
  window.open(`/collab-live-detail?id=${row.id}`, '_blank')
}

const resetFilters = () => {
  if (filterRef.value) {
    filterRef.value.resetFilters()
  }
  Object.assign(filters, {
    shopId: '',
    influencerKeyword: '',
    bdId: '',
    departmentId: '',
    productKeyword: '',
    salesRange: null,
    amountRange: null,
    hasPromote: '',
    dateRange: [],
    hasSample: '',
    hasRecording: false,
    title: '',
    subTab: 'all',
    page: 1,
    pageSize: 10
  })
}

const fetchData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取数据
    // const res = await api.getCollabLiveList({ platform: activePlatform.value, ...filters })
    // listData.value = res.data.list
    // total.value = res.data.total
    // statsData.value = res.data.stats

    // Mock数据
    listData.value = []
    total.value = 0
    statsData.value = {}
  } catch (error) {
    ElMessage.error('数据加载失败，请刷新重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.collaboration-live-page {
  padding: 16px 20px;
  min-height: calc(100vh - 120px);
}

.loading-container {
  padding: 20px;
}
</style>
```

- [ ] **Step 2: 运行验证**

---

## Task 5: 集成到 Dashboard

**Files:**
- Modify: `dohozz-saas/src/views/Dashboard.vue:319-330` (imports)
- Modify: `dohozz-saas/src/views/Dashboard.vue:210-220` (component registration area)
- Modify: `dohozz-saas/src/views/Dashboard.vue:618-622` (sidebar menu)

- [ ] **Step 1: 添加组件 import**

在 Dashboard.vue 的 script setup 区域，import 语句部分添加：

```js
import CollaborationLive from './CollaborationLive.vue'
```

- [ ] **Step 2: 添加条件渲染**

在 Dashboard.vue 的主内容区条件渲染部分，找到适当位置添加：

```vue
<!-- 合作直播页面 -->
<CollaborationLive v-else-if="activeSidebarMenu === '合作直播'" />
```

- [ ] **Step 3: 修改侧边栏菜单**

找到 `内容中心` 下的 `合作内容` children，添加 `合作直播`：

```js
{ name: '合作内容', icon: icons.content, children: [
  { name: '直播录屏', tag: 'New' },
  { name: '违规情况' },
  { name: '素材库' },
  { name: '合作直播' }  // 新增
]}
```

- [ ] **Step 4: 运行验证**

构建项目并检查是否无错误。

---

## Task 6: 验证与提交

- [ ] **Step 1: 构建验证**

```bash
cd dohozz-saas && npm run build
```

- [ ] **Step 2: 提交代码**

```bash
git add .
git commit -m "feat(合作直播): 创建合作直播页面

- 添加 CollaborationLive.vue 主页面
- 添加 CollabLiveFilterSection.vue 筛选组件
- 添加 CollabLiveStatsSection.vue 数据概览组件
- 添加 CollabLiveListSection.vue 直播列表组件
- 集成到 Dashboard 侧边栏菜单

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## 实现检查清单

- [ ] 平台Tab切换功能正常
- [ ] 11个筛选控件正常工作
- [ ] 追踪统计横幅显示正确
- [ ] 数据概览区两栏卡片显示正确
- [ ] 子Tab（全部/有出单/未出单）切换正常
- [ ] 列表工具栏（搜索、导出、是否有投放筛选）正常
- [ ] 分页功能正常
- [ ] 详情按钮跳转新标签页
- [ ] 空状态、加载状态符合PRD规范
- [ ] Toast提示正常工作

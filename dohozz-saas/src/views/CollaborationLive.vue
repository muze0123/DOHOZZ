<template>
  <div class="collaboration-live">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-filter"></div>
      <div class="skeleton-stats"></div>
      <div class="skeleton-list"></div>
    </div>

    <!-- 主内容 -->
    <template v-else>
      <!-- 区域A+B+C: 筛选区 -->
      <CollabLiveFilterSection
        ref="filterSectionRef"
        :shop-list="shopList"
        :bd-list="bdList"
        :dept-list="deptList"
        :tracking-data="trackingData"
        @filter-change="handleFilterChange"
        @platform-change="handlePlatformChange"
      />

      <!-- 区域D: 数据概览 -->
      <CollabLiveStatsSection
        :stats-data="statsData"
        :date-range="currentFilters.dateRange || []"
      />

      <!-- 区域E: 直播列表 -->
      <CollabLiveListSection
        ref="listSectionRef"
        :list-data="listData"
        :total="pagination.total"
        :sub-tabs="subTabs"
        :has-promote="currentFilters.hasPromote || ''"
        :loading="listLoading"
        :update-time="updateTime"
        @filter-change="handleListFilterChange"
        @detail="handleDetail"
        @export="handleExport"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CollabLiveFilterSection from './components/CollabLiveFilterSection.vue'
import CollabLiveStatsSection from './components/CollabLiveStatsSection.vue'
import CollabLiveListSection from './components/CollabLiveListSection.vue'

// ==================== 状态管理 ====================
const loading = ref(true)
const listLoading = ref(false)
const filterSectionRef = ref(null)
const listSectionRef = ref(null)

// 当前平台
const activePlatform = ref('tiktok')

// 当前筛选条件
const currentFilters = reactive({
  platform: 'tiktok',
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
  // 列表筛选
  subTab: 'all',
  title: '',
  page: 1,
  pageSize: 10
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// ==================== Mock 数据 ====================

// 店铺列表
const shopList = ref([
  { id: 'shop001', name: '美妆旗舰店' },
  { id: 'shop002', name: '服饰专营店' },
  { id: 'shop003', name: '数码海外店' },
  { id: 'shop004', name: '家居生活馆' }
])

// BD列表
const bdList = ref([
  { id: 'bd001', name: '张三' },
  { id: 'bd002', name: '李四' },
  { id: 'bd003', name: '王五' },
  { id: 'bd004', name: '赵六' }
])

// 部门列表
const deptList = ref([
  { id: 'dept001', name: '美妆部' },
  { id: 'dept002', name: '服饰部' },
  { id: 'dept003', name: '数码部' },
  { id: 'dept004', name: '家居部' }
])

// 追踪数据
const trackingData = ref({
  influencerCount: 156,
  videoCount: 428,
  liveCount: 89
})

// 统计数据
const statsData = ref({
  // 合作直播数据
  collabLiveCount: 236,
  collabLiveAmount: 1256800.50,
  collabLiveSales: 8920,
  collabLiveRefund: 35800.00,
  estimatedCommission: 62840.25,
  collabLiveInfluencerCount: 156,
  // 投放直播数据
  promoLiveCount: 89,
  consumeAmount: 156000.00,
  promoLiveAmount: 468000.00,
  promoOrderCount: 3568,
  payRoi: 3.00
})

// 子Tab统计
const subTabs = ref({
  allCount: 236,
  hasOrderCount: 178,
  noOrderCount: 58
})

// 直播列表数据
const listData = ref([
  {
    id: 'live001',
    title: '春季新品首发专场直播',
    liveTime: '2026-04-26 20:00-22:30',
    influencerName: '美妆达人小雪',
    followers: '128.5万粉丝',
    productImage: 'https://picsum.photos/80/80?random=1',
    productName: '新款口红套装',
    employee: '张三',
    dealAmount: 25680.00,
    gmvRatio: '15.8%',
    sales: 128,
    refundAmount: 1200.00,
    refundRatio: '4.7%',
    estimatedCommission: 1284.00,
    hasPromote: true,
    consumeAmount: 5600.00,
    promoDealAmount: 18600.00,
    promoOrderCount: 86,
    payRoi: 3.32,
    duration: '2.5小时',
    viewers: 56800,
    uvValue: 0.45
  },
  {
    id: 'live002',
    title: '夏日防晒好物分享',
    liveTime: '2026-04-25 15:00-17:00',
    influencerName: '护肤博主莉莉',
    followers: '89.2万粉丝',
    productImage: 'https://picsum.photos/80/80?random=2',
    productName: '防晒霜SPF50+',
    employee: '李四',
    dealAmount: 15800.00,
    gmvRatio: '9.7%',
    sales: 79,
    refundAmount: 450.00,
    refundRatio: '2.8%',
    estimatedCommission: 790.00,
    hasPromote: false,
    consumeAmount: 0,
    promoDealAmount: 0,
    promoOrderCount: 0,
    payRoi: '--',
    duration: '2小时',
    viewers: 32600,
    uvValue: 0.48
  },
  {
    id: 'live003',
    title: '数码科技专场直播带货',
    liveTime: '2026-04-24 19:30-22:00',
    influencerName: '科技评测家阿明',
    followers: '256.8万粉丝',
    productImage: 'https://picsum.photos/80/80?random=3',
    productName: '无线蓝牙耳机',
    employee: '王五',
    dealAmount: 89200.00,
    gmvRatio: '35.2%',
    sales: 356,
    refundAmount: 2680.00,
    refundRatio: '3.0%',
    estimatedCommission: 4460.00,
    hasPromote: true,
    consumeAmount: 12800.00,
    promoDealAmount: 52600.00,
    promoOrderCount: 218,
    payRoi: 4.11,
    duration: '2.5小时',
    viewers: 128600,
    uvValue: 0.69
  },
  {
    id: 'live004',
    title: '家居好物推荐专场',
    liveTime: '2026-04-23 14:00-16:30',
    influencerName: '生活博主小绿',
    followers: '67.3万粉丝',
    productImage: null,
    productName: null,
    employee: '赵六',
    dealAmount: 8600.00,
    gmvRatio: '5.3%',
    sales: 43,
    refundAmount: 0,
    refundRatio: '0%',
    estimatedCommission: 430.00,
    hasPromote: false,
    consumeAmount: 0,
    promoDealAmount: 0,
    promoOrderCount: 0,
    payRoi: '--',
    duration: '2.5小时',
    viewers: 18900,
    uvValue: 0.45
  },
  {
    id: 'live005',
    title: '周末美妆狂欢夜',
    liveTime: '2026-04-22 20:00-23:00',
    influencerName: '美妆达人可可',
    followers: '156.7万粉丝',
    productImage: 'https://picsum.photos/80/80?random=5',
    productName: '护肤套装礼盒',
    employee: '张三',
    dealAmount: 45680.00,
    gmvRatio: '28.1%',
    sales: 228,
    refundAmount: 1890.00,
    refundRatio: '4.1%',
    estimatedCommission: 2284.00,
    hasPromote: true,
    consumeAmount: 8600.00,
    promoDealAmount: 32800.00,
    promoOrderCount: 156,
    payRoi: 3.81,
    duration: '3小时',
    viewers: 89200,
    uvValue: 0.51
  }
])

// 数据更新时间
const updateTime = ref('2026-04-27 15:30:00')

// ==================== 生命周期 ====================
onMounted(() => {
  fetchData()
})

// ==================== 数据获取 ====================
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟接口延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 更新默认日期范围（最近30天）
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    currentFilters.dateRange = [
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    ]

    // 更新分页总数
    pagination.total = listData.value.length
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// ==================== 事件处理 ====================

// 筛选条件变化
const handleFilterChange = (filters) => {
  if (filters.action === 'myTrackInfluencers') {
    ElMessage.info('跳转至我的追踪达人页面')
    return
  }
  if (filters.action === 'monitorRules') {
    ElMessage.info('跳转至监控规则页面')
    return
  }

  // 合并筛选条件
  Object.assign(currentFilters, filters)
  currentFilters.page = 1 // 重置页码
  listLoading.value = true

  // 模拟数据刷新
  setTimeout(() => {
    listLoading.value = false
  }, 300)
}

// 平台切换
const handlePlatformChange = (platform) => {
  activePlatform.value = platform
  currentFilters.platform = platform
  currentFilters.page = 1

  // 模拟平台切换数据刷新
  listLoading.value = true
  setTimeout(() => {
    listLoading.value = false
  }, 500)
}

// 列表筛选变化
const handleListFilterChange = (params) => {
  Object.assign(currentFilters, params)
  listLoading.value = true

  // 模拟数据刷新
  setTimeout(() => {
    listLoading.value = false
  }, 300)
}

// 查看详情
const handleDetail = (row) => {
  ElMessage.info(`查看直播详情: ${row.title}`)
  // TODO: 打开详情弹窗
}

// 导出
const handleExport = () => {
  ElMessage.info('开始导出直播数据')
  // TODO: 执行导出逻辑
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.collaboration-live {
  padding: 16px;
  min-height: 100%;
  background: #F5F6F7;
}

// 加载骨架屏
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-filter {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-stats {
  height: 180px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-list {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

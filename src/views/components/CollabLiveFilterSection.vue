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
        <span>{{ platform.label }}</span>
      </div>
    </div>

    <!-- 区域B: 筛选工具栏 -->
    <div class="filter-toolbar">
      <!-- 店铺名称 -->
      <div class="filter-item">
        <span class="filter-label">店铺名称</span>
        <el-select
          v-model="filters.shopId"
          placeholder="所有店铺"
          clearable
          filterable
          style="width: 140px"
          size="small"
        >
          <el-option
            v-for="shop in shopList"
            :key="shop.id"
            :label="shop.name"
            :value="shop.id"
          />
        </el-select>
      </div>

      <!-- 达人搜索 -->
      <div class="filter-item">
        <span class="filter-label">达人搜索</span>
        <el-input
          v-model="filters.influencerKeyword"
          placeholder="达人名称/达人ID"
          clearable
          style="width: 140px"
          size="small"
        />
      </div>

      <!-- 所属BD -->
      <div class="filter-item">
        <span class="filter-label">所属BD</span>
        <el-select
          v-model="filters.bdId"
          placeholder="全部BD"
          clearable
          filterable
          style="width: 120px"
          size="small"
        >
          <el-option
            v-for="bd in bdList"
            :key="bd.id"
            :label="bd.name"
            :value="bd.id"
          />
        </el-select>
      </div>

      <!-- 所属部门 -->
      <div class="filter-item">
        <span class="filter-label">所属部门</span>
        <el-select
          v-model="filters.departmentId"
          placeholder="全部部门"
          clearable
          filterable
          style="width: 120px"
          size="small"
        >
          <el-option
            v-for="dept in deptList"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
      </div>

      <!-- 商品搜索 -->
      <div class="filter-item">
        <span class="filter-label">商品搜索</span>
        <el-input
          v-model="filters.productKeyword"
          placeholder="商品名称/商品ID"
          clearable
          style="width: 140px"
          size="small"
        />
      </div>

      <!-- 销量 -->
      <div class="filter-item">
        <span class="filter-label">销量</span>
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
              <el-dropdown-item command="100-1000">100-1000</el-dropdown-item>
              <el-dropdown-item command="1000+">1000以上</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 成交金额 -->
      <div class="filter-item">
        <span class="filter-label">成交金额</span>
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
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 是否有投放 -->
      <div class="filter-item">
        <span class="filter-label">是否有投放</span>
        <el-select
          v-model="filters.hasPromote"
          placeholder="全部"
          clearable
          style="width: 100px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="是" value="true" />
          <el-option label="否" value="false" />
        </el-select>
      </div>

      <!-- 发布时间 -->
      <div class="filter-item">
        <span class="filter-label">发布时间</span>
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 220px"
          size="small"
        />
      </div>

      <!-- 是否有寄样 -->
      <div class="filter-item">
        <span class="filter-label">是否有寄样</span>
        <el-select
          v-model="filters.hasSample"
          placeholder="全部"
          clearable
          style="width: 100px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="是" value="true" />
          <el-option label="否" value="false" />
        </el-select>
      </div>

      <!-- 有录屏 -->
      <div class="filter-item">
        <el-checkbox v-model="filters.hasRecording" label="有录屏" size="small" />
      </div>
    </div>

    <!-- 区域C: 追踪统计横幅 -->
    <div class="tracking-banner">
      <div class="banner-text">
        系统已为您累计追踪到
        <span class="highlight">{{ props.trackingData.influencerCount }}</span> 位达人的
        <span class="highlight">{{ props.trackingData.videoCount }}</span> 个视频及
        <span class="highlight">{{ props.trackingData.liveCount }}</span> 场直播
      </div>
      <div class="banner-actions">
        <el-button link @click="handleMyTrackInfluencers">我的追踪达人</el-button>
        <el-button link @click="handleMonitorRules">监控规则</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  shopList: {
    type: Array,
    default: () => []
  },
  bdList: {
    type: Array,
    default: () => []
  },
  deptList: {
    type: Array,
    default: () => []
  },
  trackingData: {
    type: Object,
    default: () => ({
      influencerCount: 0,
      videoCount: 0,
      liveCount: 0
    })
  }
})

const emit = defineEmits(['filter-change', 'platform-change'])

// 平台列表
const platforms = [
  { label: 'Tiktok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Shopee', value: 'shopee' },
  { label: 'Lazada', value: 'lazada' }
]

const activePlatform = ref('tiktok')

// 计算默认日期范围（最近30天）
const getDefaultDateRange = () => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return [
    start.toISOString().split('T')[0],
    end.toISOString().split('T')[0]
  ]
}

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
  dateRange: getDefaultDateRange(),
  hasSample: '',
  hasRecording: false
})

// 追踪数据 - 使用reactive保持一致性
const trackingData = reactive({
  influencerCount: 0,
  videoCount: 0,
  liveCount: 0
})

const salesFilterLabel = computed(() => {
  if (!filters.salesRange) return '不限'
  const [min, max] = filters.salesRange
  if (max === null) return `${min}以上`
  return `${min}-${max}`
})

const amountFilterLabel = computed(() => {
  if (!filters.amountRange) return '不限'
  const [min, max] = filters.amountRange
  if (max === null) return `${min}以上`
  return `${min}-${max}`
})

// 平台切换
const handlePlatformChange = (platform) => {
  activePlatform.value = platform
  emit('platform-change', platform)
}

// 销量筛选
const handleSalesFilter = (command) => {
  if (command === 'unlimited') {
    filters.salesRange = null
  } else if (command === '0-10') {
    filters.salesRange = [0, 10]
  } else if (command === '10-100') {
    filters.salesRange = [10, 100]
  } else if (command === '100-1000') {
    filters.salesRange = [100, 1000]
  } else if (command === '1000+') {
    filters.salesRange = [1000, null]
  }
  emit('filter-change', getFilters())
}

// 成交金额筛选
const handleAmountFilter = (command) => {
  if (command === 'unlimited') {
    filters.amountRange = null
  } else if (command === '0-500') {
    filters.amountRange = [0, 500]
  } else if (command === '500-2000') {
    filters.amountRange = [500, 2000]
  } else if (command === '2000-5000') {
    filters.amountRange = [2000, 5000]
  } else if (command === '5000+') {
    filters.amountRange = [5000, null]
  }
  emit('filter-change', getFilters())
}

// 获取当前筛选条件
const getFilters = () => {
  return {
    platform: activePlatform.value,
    ...filters
  }
}

// 重置筛选条件
const resetFilters = () => {
  filters.shopId = ''
  filters.influencerKeyword = ''
  filters.bdId = ''
  filters.departmentId = ''
  filters.productKeyword = ''
  filters.salesRange = null
  filters.amountRange = null
  filters.hasPromote = ''
  filters.dateRange = []
  filters.hasSample = ''
  filters.hasRecording = false
}

// 设置追踪数据
const setTrackingData = (data) => {
  Object.assign(trackingData, data)
}

// 添加 watchers 实现立即触发全页数据刷新
watch(
  () => [filters.shopId, filters.influencerKeyword, filters.bdId, filters.departmentId],
  () => {
    emit('filter-change', getFilters())
  }
)

watch(
  () => [filters.productKeyword, filters.hasPromote, filters.hasSample, filters.hasRecording],
  () => {
    emit('filter-change', getFilters())
  }
)

watch(
  () => filters.dateRange,
  () => {
    emit('filter-change', getFilters())
  }
)

// 追踪达人点击
const handleMyTrackInfluencers = () => {
  emit('filter-change', { action: 'myTrackInfluencers' })
}

// 监控规则点击
const handleMonitorRules = () => {
  emit('filter-change', { action: 'monitorRules' })
}

// 暴露方法给父组件
defineExpose({
  getFilters,
  resetFilters,
  setTrackingData
})
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.collab-live-filter-section {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.platform-tabs {
  display: flex;
  gap: 24px;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #E8E8E8;
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
}

.filter-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: center;
  padding: 16px 20px;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-label {
  margin-right: 10px;
  text-align: right;
  color: #4e5969;
  font-family: PingFang SC;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  white-space: nowrap;
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
  margin: 0 20px 16px;
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

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  height: 32px;
}
</style>

<template>
  <div class="performance-target">
    <!-- 区块A：平台Tab + 筛选区 -->
    <div class="filter-area">
      <!-- 平台Tab -->
      <div class="platform-tabs-bar">
        <div class="platform-tabs">
          <div
            v-for="platform in platforms"
            :key="platform.value"
            class="platform-tab"
            :class="{ active: currentPlatform === platform.value }"
            @click="handlePlatformChange(platform.value)"
          >
            <div class="platform-icon tiktok-icon" v-if="platform.value === 'tiktok'">
              <img src="@/assets/images/TikTok.png" alt="TikTok" />
            </div>
            <div class="platform-icon instagram-icon" v-else-if="platform.value === 'instagram'">
              <img src="@/assets/images/Instagram.png" alt="Instagram" />
            </div>
            <div class="platform-icon shopee-icon" v-else-if="platform.value === 'shopee'">
              <img src="@/assets/images/Shopee.png" alt="Shopee" />
            </div>
            <div class="platform-icon lazada-icon" v-else-if="platform.value === 'lazada'">
              <img src="@/assets/images/Lazada.png" alt="Lazada" />
            </div>
            <span>{{ platform.name }}</span>
          </div>
        </div>
      </div>
      <!-- 筛选条件区块 -->
      <div class="filter-toolbar">
        <div class="filter-row">
          <div class="filter-item">
            <span class="filter-label">目标月度</span>
            <el-date-picker
              v-model="filters.month"
              type="month"
              value-format="YYYY-MM"
              placeholder="选择月份"
              size="small"
              class="filter-select"
            />
          </div>
          <div class="filter-item">
            <span class="filter-label">所属部门</span>
            <el-select v-model="filters.department" placeholder="全部部门" clearable filterable size="small" class="filter-select">
              <el-option label="全部部门" value="" />
              <el-option label="销售一部" value="sales1" />
              <el-option label="销售二部" value="sales2" />
              <el-option label="运营部" value="ops" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">所属BD</span>
            <el-select v-model="filters.bd" placeholder="全部BD" clearable filterable size="small" class="filter-select">
              <el-option label="全部BD" value="" />
              <el-option label="BD-张三" value="zhangsan" />
              <el-option label="BD-李四" value="lisi" />
              <el-option label="BD-王五" value="wangwu" />
            </el-select>
          </div>
          <FilterActions @query="handleQuery" @reset="handleReset" />
        </div>
      </div>
    </div>

    <!-- 月度销售战绩区块 -->
    <div class="section chart-section">
      <div class="chart-header">
        <div class="chart-title">
          <span class="title-text">{{ currentMonthText }} 月度销售战绩</span>
        </div>
        <div class="chart-header-right">
          <span class="days-left">距离月底还有 {{ daysLeft }} 天</span>
        </div>
      </div>
      <div class="chart-cards">
        <div
          v-for="card in chartCards"
          :key="card.key"
          class="chart-card"
        >
          <div class="card-label">{{ card.name }}</div>
          <div class="card-values">
            <span v-if="card.type === 'money'" class="card-current">￥{{ formatMoney(card.current) }}</span>
            <span v-else class="card-current">{{ card.current }}</span>
            <span class="card-separator">/</span>
            <span v-if="card.type === 'money'" class="card-target">￥{{ formatMoney(card.target) }}</span>
            <span v-else class="card-target">{{ card.target }}</span>
          </div>
          <div class="card-progress">
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: Math.min(card.rate, 100) + '%' }"
                :class="{ over: card.rate > 100 }"
              ></div>
            </div>
          </div>
          <div class="card-rate" :class="{ over: card.rate > 100 }">
            <span v-if="card.target === 0">—</span>
            <span v-else>{{ card.rate.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 区块C：数据列表 -->
    <div class="section table-section">
      <div class="toolbar">
        <div class="section-header">
          <span class="section-title">业绩目标</span>
        </div>
        <el-button type="primary" @click="handleAdd">+ 新增业绩目标</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        @row-click="handleRowClick"
        :row-class-name="getRowClassName"
        highlight-current-row
      >
        <el-table-column prop="memberName" label="成员名称" width="180" fixed>
          <template #default="{ row }">
            <div class="member-cell">
              <el-avatar :size="32" :src="row.avatar" />
              <span class="member-name">{{ row.memberName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="所属部门" width="160">
          <template #default="{ row }">
            <span class="department-text">{{ row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="metric in metrics"
          :key="metric.key"
          :prop="metric.key"
          :label="metric.name"
          min-width="180"
        >
          <template #default="{ row }">
            <div class="metric-cell">
              <div class="metric-value">
                <span v-if="metric.type === 'money'" class="money">￥{{ formatMoney(row[metric.key].current) }}</span>
                <span v-else class="number">{{ row[metric.key].current }}</span>
                <span class="separator">/</span>
                <span v-if="metric.type === 'money'" class="money target">￥{{ formatMoney(row[metric.key].target) }}</span>
                <span v-else class="number target">{{ row[metric.key].target }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-track">
                  <div
                    class="progress-fill"
                    :style="{ width: Math.min(row[metric.key].rate, 100) + '%' }"
                    :class="{ over: row[metric.key].rate > 100 }"
                  ></div>
                </div>
              </div>
              <div class="rate-text" :class="{ over: row[metric.key].rate > 100 }">
                <span v-if="row[metric.key].target === 0">—</span>
                <span v-else>{{ row[metric.key].rate.toFixed(2) }}%</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        v-if="total > 0"
        v-model="pagination"
        :total="total"
        @change="handlePageChange"
      />
    </div>

    <!-- 区块D+E：绩效设置抽屉 -->
    <PerformanceTargetDrawer v-model="drawerVisible" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'
import FilterActions from '@/components/FilterActions.vue'
import PerformanceTargetDrawer from '@/components/PerformanceTargetDrawer.vue'

// 平台选项
const platforms = [
  { name: 'TikTok', value: 'tiktok', icon: 'TT' },
  { name: 'Instagram', value: 'instagram', icon: 'IG' },
  { name: 'Shopee', value: 'shopee', icon: 'SP' },
  { name: 'Lazada', value: 'lazada', icon: 'LZ' }
]

// 当前平台
const currentPlatform = ref('tiktok')

// 筛选条件
const filters = reactive({
  department: '',
  bd: '',
  month: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10
})
const total = ref(0)

// 加载状态
const loading = ref(false)

// 当前选中行
const currentRow = ref(null)

// 指标配置
const metrics = [
  { key: 'dealAmount', name: '达人成交金额', type: 'money' },
  { key: 'contactCount', name: '建联达人数', type: 'number' },
  { key: 'sampleCount', name: '寄样达人数', type: 'number' },
  { key: 'orderCount', name: '出单达人数', type: 'number' },
  { key: 'deliveryVideoCount', name: '交付视频数', type: 'number' },
  { key: 'orderVideoCount', name: '出单视频数', type: 'number' }
]

// 表格数据
const tableData = ref([])

// 抽屉相关
const drawerVisible = ref(false)

// 计算当月剩余天数
const daysLeft = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()
  return lastDay - now.getDate()
})

// 当前月份文本
const currentMonthText = computed(() => {
  return filters.month || new Date().toISOString().slice(0, 7)
})

// 图表卡片数据
const chartCards = computed(() => {
  const totalData = {
    dealAmount: { current: 1250000, target: 2000000 },
    contactCount: { current: 580, target: 800 },
    sampleCount: { current: 320, target: 500 },
    orderCount: { current: 180, target: 300 },
    deliveryVideoCount: { current: 1560, target: 2000 },
    orderVideoCount: { current: 890, target: 1200 }
  }
  return metrics.map(m => ({
    key: m.key,
    name: m.name,
    type: m.type,
    current: totalData[m.key].current,
    target: totalData[m.key].target,
    rate: totalData[m.key].target > 0 ? (totalData[m.key].current / totalData[m.key].target) * 100 : 0
  }))
})

// 格式化金额
const formatMoney = (value) => {
  if (!value) return '0.00'
  return Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 平台切换
const handlePlatformChange = (value) => {
  currentPlatform.value = value
}

// 查询
const handleQuery = () => {
  fetchData()
}

// 重置
const handleReset = () => {
  filters.department = ''
  filters.bd = ''
  filters.month = ''
  fetchData()
}

// 分页切换
const handlePageChange = (pageInfo) => {
  pagination.page = pageInfo.page
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

// 行点击
const handleRowClick = (row) => {
  currentRow.value = row
}

// 获取行样式
const getRowClassName = ({ row }) => {
  const isAchieved = metrics.every(m => row[m.key].current >= row[m.key].target)
  return isAchieved ? 'achieved-row' : ''
}

// 新增业绩目标
const handleAdd = () => {
  drawerVisible.value = true
}

// 关闭抽屉
const handleDrawerClose = () => {
  drawerVisible.value = false
}

// Mock 数据
const mockTableData = () => {
  return [
    {
      id: '1',
      memberName: '张三',
      avatar: '',
      department: '销售一部',
      dealAmount: { current: 450000, target: 500000, rate: 90 },
      contactCount: { current: 120, target: 150, rate: 80 },
      sampleCount: { current: 80, target: 100, rate: 80 },
      orderCount: { current: 45, target: 60, rate: 75 },
      deliveryVideoCount: { current: 320, target: 400, rate: 80 },
      orderVideoCount: { current: 180, target: 200, rate: 90 }
    },
    {
      id: '2',
      memberName: '李四',
      avatar: '',
      department: '销售二部',
      dealAmount: { current: 520000, target: 500000, rate: 104 },
      contactCount: { current: 160, target: 150, rate: 106.67 },
      sampleCount: { current: 95, target: 100, rate: 95 },
      orderCount: { current: 55, target: 60, rate: 91.67 },
      deliveryVideoCount: { current: 380, target: 400, rate: 95 },
      orderVideoCount: { current: 220, target: 200, rate: 110 }
    },
    {
      id: '3',
      memberName: '王五',
      avatar: '',
      department: '运营部',
      dealAmount: { current: 280000, target: 400000, rate: 70 },
      contactCount: { current: 90, target: 120, rate: 75 },
      sampleCount: { current: 60, target: 80, rate: 75 },
      orderCount: { current: 30, target: 45, rate: 66.67 },
      deliveryVideoCount: { current: 240, target: 300, rate: 80 },
      orderVideoCount: { current: 130, target: 150, rate: 86.67 }
    }
  ]
}

// 获取数据
const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = mockTableData()
    total.value = tableData.value.length
    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.performance-target {
  min-height: 100%;
  background: $background-light;
}

.filter-area { margin-bottom: 16px; }
.platform-tabs-bar {
  background: $background-white;
  border: none;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  padding: 0 16px;
  margin: 0;
}
.platform-tabs { display: flex; gap: 32px; }
.platform-tab {
  display: flex; align-items: center; gap: 8px; padding: 12px 0;
  color: $text-secondary; cursor: pointer; border-bottom: 2px solid transparent;
  transition: all $transition-fast; position: relative; top: 1px;
  &:hover { color: $text-primary; }
  &.active { color: $primary-color; font-weight: 500; border-bottom-color: $primary-color; }
  .platform-icon {
    width: 20px; height: 20px;
    &.tiktok-icon {
      width: 20px; height: 20px; border-radius: 6px; overflow: hidden;
      img { width: 100%; height: 100%; border-radius: 6px; }
    }
    &.instagram-icon {
      width: 20px; height: 20px; border-radius: 4px; overflow: hidden;
      img { width: 100%; height: 100%; border-radius: 4px; }
    }
    &.shopee-icon {
      width: 20px; height: 20px; border-radius: 4px; overflow: hidden;
      img { width: 100%; height: 100%; border-radius: 4px; }
    }
    &.lazada-icon {
      width: 20px; height: 20px; border-radius: 4px; overflow: hidden;
      img { width: 100%; height: 100%; border-radius: 4px; }
    }
  }
}
.filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: $background-white;
  border-top: 1px solid #E8E8E8;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 32px;
  margin: 0;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
}

.filter-label {
  font-size: 13px;
  color: $text-secondary;
  margin-right: 10px;
  text-align: right;
  white-space: nowrap;
}

.date-filter {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.section {
  background: $background-white;
  border-radius: $border-radius-lg;
  padding: 20px;
  margin-bottom: 20px;
}

.chart-section {
  padding-bottom: 24px;
  margin-bottom: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
}

.title-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.days-left {
  font-size: 13px;
  color: $text-secondary;
}

.chart-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.chart-card {
  background: $background-light;
  border-radius: $border-radius-sm;
  padding: 16px;
}

.card-label {
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 8px;
}

.card-values {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.card-current {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
}

.card-separator {
  color: $text-secondary;
}

.card-target {
  font-size: 14px;
  color: $text-secondary;
}

.card-progress {
  margin-bottom: 8px;
}

.progress-track {
  height: 6px;
  background: $background-white;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $success-color;
  border-radius: 3px;
  transition: width $transition-fast;

  &.over {
    background: $primary-color;
  }
}

.card-rate {
  font-size: 13px;
  font-weight: 500;
  color: $success-color;

  &.over {
    color: $primary-color;
  }
}

.table-section {
  padding-bottom: 24px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #050505;
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-name {
  font-size: 14px;
  color: $text-primary;
}

.department-text {
  font-size: 14px;
  color: $text-secondary;
}

.metric-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.money {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;

  &.target {
    color: $text-secondary;
    font-weight: 400;
  }
}

.number {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;

  &.target {
    color: $text-secondary;
    font-weight: 400;
  }
}

.separator {
  color: $border-color;
  margin: 0 2px;
}

.progress-bar {
  width: 100%;
}

.progress-track {
  height: 4px;
  background: $background-light;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $success-color;
  border-radius: 2px;
  transition: width $transition-fast;

  &.over {
    background: $primary-color;
  }
}

.rate-text {
  font-size: 12px;
  color: $success-color;
  text-align: right;

  &.over {
    color: $primary-color;
  }
}

.achieved-row {
  background: #E8F4FF !important;
}

:deep(.el-table__row) {
  &:hover {
    background: $background-light !important;
  }
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover>td) {
  background: $background-light;
}

:deep(.el-table__body tr.current-row>td) {
  background: #E8F4FF;
}

:deep(.el-table th.el-table__cell) {
  background-color: $background-light;
  color: $text-primary;
  font-weight: 600;
  font-size: 13px;
}
</style>
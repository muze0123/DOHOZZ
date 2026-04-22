<template>
  <div class="performance-target">
    <!-- 区块A：筛选区 + 操作工具栏 -->
    <div class="section filter-section">
      <!-- 平台Tab -->
      <div class="platform-tabs">
        <div
          v-for="platform in platforms"
          :key="platform.value"
          class="platform-tab"
          :class="{ active: currentPlatform === platform.value }"
          @click="handlePlatformChange(platform.value)"
        >
          <span class="platform-icon">{{ platform.icon }}</span>
          <span class="platform-name">{{ platform.name }}</span>
        </div>
      </div>

      <!-- 筛选条件 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">所属部门</span>
          <el-select v-model="filters.department" placeholder="全部部门" clearable filterable style="width: 140px">
            <el-option label="全部部门" value="" />
            <el-option label="销售一部" value="sales1" />
            <el-option label="销售二部" value="sales2" />
            <el-option label="运营部" value="ops" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">所属BD</span>
          <el-select v-model="filters.bd" placeholder="全部BD" clearable filterable style="width: 140px">
            <el-option label="全部BD" value="" />
            <el-option label="BD-张三" value="zhangsan" />
            <el-option label="BD-李四" value="lisi" />
            <el-option label="BD-王五" value="wangwu" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">目标月度</span>
          <el-date-picker
            v-model="filters.month"
            type="month"
            value-format="YYYY-MM"
            placeholder="选择月份"
            style="width: 130px"
          />
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <!-- 操作工具栏 -->
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">+ 新增业绩目标</el-button>
      </div>
    </div>

    <!-- 区块B：数据列表 -->
    <div class="section table-section">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
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
          width="200"
        >
          <template #default="{ row }">
            <div class="metric-cell">
              <div class="metric-value">
                <span v-if="metric.type === 'money'" class="money">￥{{ row[metric.key].current }}</span>
                <span v-else class="number">{{ row[metric.key].current }}</span>
                <span class="separator">/</span>
                <span v-if="metric.type === 'money'" class="money target">￥{{ row[metric.key].target }}</span>
                <span v-else class="number target">{{ row[metric.key].target }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-track">
                  <div
                    class="progress-fill"
                    :style="{ width: Math.min(row[metric.key].rate, 100) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="rate-text" :class="{ over: row[metric.key].rate > 100 }">
                {{ row[metric.key].rate.toFixed(2) }}%
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

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

// 生成模拟数据
const generateMockData = () => {
  const data = []
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const departments = ['销售一部 / A组', '销售一部 / B组', '销售二部 / C组', '运营部 / D组']

  for (let i = 0; i < 8; i++) {
    const row = {
      memberName: names[i],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[i]}`,
      department: departments[i % departments.length],
      dealAmount: {
        current: (Math.random() * 100).toFixed(2),
        target: 100,
        rate: Math.random() * 150
      },
      contactCount: {
        current: Math.floor(Math.random() * 100),
        target: 100,
        rate: Math.random() * 150
      },
      sampleCount: {
        current: Math.floor(Math.random() * 80),
        target: 100,
        rate: Math.random() * 150
      },
      orderCount: {
        current: Math.floor(Math.random() * 60),
        target: 100,
        rate: Math.random() * 150
      },
      deliveryVideoCount: {
        current: Math.floor(Math.random() * 50),
        target: 100,
        rate: Math.random() * 150
      },
      orderVideoCount: {
        current: Math.floor(Math.random() * 40),
        target: 100,
        rate: Math.random() * 150
      }
    }
    data.push(row)
  }
  return data
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  tableData.value = generateMockData()
  total.value = 40
  loading.value = false
}

// 平台切换
const handlePlatformChange = (platform) => {
  currentPlatform.value = platform
  handleQuery()
}

// 查询
const handleQuery = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  filters.department = ''
  filters.bd = ''
  filters.month = ''
  pagination.page = 1
  handleQuery()
}

// 新增
const handleAdd = () => {
  ElMessage.info('新增业绩目标功能待提供PRD后开发')
}

// 分页变化
const handlePageChange = ({ page, pageSize }) => {
  pagination.page = page
  pagination.pageSize = pageSize
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
$primary: #0064E0;
$white: #FFFFFF;
$bg: #f5f7fa;
$divider: #e5e7eb;
$text-1: #050505;
$text-2: #65676B;
$text-3: #BCC0C4;
$primary-text: #050505;
$secondary-text: #65676B;
$border-radius-lg: 12px;

.performance-target {
  padding: 16px 0 24px;
  min-height: 100%;
  background: $bg;
}

// 通用区块样式
.section {
  background: $white;
  border-radius: $border-radius-lg;
  padding: 16px;
  margin: 0 0 16px 0;
  border: 1px solid $divider;
}

// 平台Tab
.platform-tabs {
  display: flex;
  gap: 0;
  border: 1px solid $divider;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  margin-bottom: 16px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  cursor: pointer;
  border-right: 1px solid $divider;
  transition: all 0.2s;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: $bg;
  }

  &.active {
    background: $primary;

    .platform-icon {
      background: $white;
      color: $primary;
    }

    .platform-name {
      color: $white;
    }
  }
}

.platform-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: $bg;
  font-size: 10px;
  font-weight: 600;
  color: $text-2;
}

.platform-name {
  font-size: 13px;
  color: $text-2;
}

// 筛选区
.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: $secondary-text;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

// 操作工具栏
.toolbar {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $divider;
}

// 成员名称
.member-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-name {
  font-size: 13px;
  color: $primary-text;
}

// 所属部门
.department-text {
  font-size: 12px;
  color: $secondary-text;
}

// 指标单元格
.metric-cell {
  .metric-value {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-bottom: 6px;
  }

  .money {
    font-size: 13px;
    font-weight: 500;
    color: $primary-text;

    &.target {
      color: $text-3;
    }
  }

  .number {
    font-size: 13px;
    font-weight: 500;
    color: $primary-text;

    &.target {
      color: $text-3;
    }
  }

  .separator {
    color: $text-3;
    margin: 0 2px;
  }
}

// 进度条
.progress-bar {
  margin-bottom: 4px;
}

.progress-track {
  height: 6px;
  background: $bg;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $primary;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.rate-text {
  font-size: 12px;
  color: $secondary-text;

  &.over {
    color: $primary;
  }
}

// 表格样式
:deep(.el-table) {
  th.el-table__cell {
    background-color: $bg;
    color: $primary-text;
    font-weight: 600;
    font-size: 13px;
  }
  td.el-table__cell {
    font-size: 13px;
  }
}
</style>

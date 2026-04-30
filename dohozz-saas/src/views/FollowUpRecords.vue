<template>
  <div class="follow-up-records">
    <!-- ==================== 顶部平台导航区 ==================== -->
    <div class="platform-section">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key }"
          @click="handlePlatformChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <!-- ==================== 筛选查询区 ==================== -->
    <div class="filter-section">
      <!-- 第一排筛选项 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">记录时间:</span>
          <el-date-picker
            v-model="filterParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="date-picker"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">达人搜索:</span>
          <el-input
            v-model="filterParams.influencerKeyword"
            placeholder="请输入达人名称/达人ID"
            class="search-input"
            clearable
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">部门筛选:</span>
          <el-select v-model="filterParams.departmentId" placeholder="全部部门" clearable class="filter-select">
            <el-option v-for="dept in departmentOptions" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">BD筛选:</span>
          <el-select v-model="filterParams.bdId" placeholder="全部BD" clearable class="filter-select">
            <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
          </el-select>
        </div>
      </div>
      <!-- 第二排筛选项 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">店铺筛选:</span>
          <el-select v-model="filterParams.shopId" placeholder="所有店铺" clearable class="filter-select">
            <el-option v-for="shop in shopOptions" :key="shop.id" :label="shop.name" :value="shop.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">手动记录:</span>
          <el-input
            v-model="filterParams.contentKeyword"
            placeholder="请输入手动记录内容或关键词"
            class="search-input-wide"
            clearable
          />
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- ==================== 数据概览与操作区 ==================== -->
    <div class="overview-section">
      <div class="overview-header">
        <div class="overview-left">
          <h3 class="page-title">
            跟进记录({{ totalRecords }})
            <el-icon class="question-icon" @click="showRecordRuleDialog"><QuestionFilled /></el-icon>
          </h3>
          <span class="update-time">
            数据更新时间: {{ dataUpdateTime }}
            <el-icon class="question-icon" @click="showUpdateRuleDialog"><QuestionFilled /></el-icon>
          </span>
        </div>
        <div class="overview-right">
          <el-button @click="handleExport">导出数据</el-button>
          <el-button type="primary" class="add-btn" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            新增记录
          </el-button>
        </div>
      </div>

      <!-- 记录类型标签页 -->
      <div class="type-tabs">
        <div
          v-for="tab in recordTypeTabs"
          :key="tab.key"
          class="type-tab"
          :class="{ active: activeRecordType === tab.key }"
          @click="handleRecordTypeChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
          <span class="tab-count">({{ tab.count }})</span>
        </div>
      </div>

      <!-- 记录类型占比卡片 -->
      <div class="percentage-cards">
        <div class="percentage-card manual" @click="handleRecordTypeChange('manual')">
          <div class="card-info">
            <span class="card-label">手动记录</span>
            <span class="card-count">{{ manualRecordCount }}</span>
          </div>
          <div class="card-percent">{{ manualRecordPercent }}%</div>
          <div class="progress-bar">
            <div class="progress-fill manual" :style="{ width: manualRecordPercent + '%' }"></div>
          </div>
        </div>
        <div class="percentage-card system" @click="handleRecordTypeChange('system')">
          <div class="card-info">
            <span class="card-label">系统记录</span>
            <span class="card-count">{{ systemRecordCount }}</span>
          </div>
          <div class="card-percent">{{ systemRecordPercent }}%</div>
          <div class="progress-bar">
            <div class="progress-fill system" :style="{ width: systemRecordPercent + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 趋势图表 -->
      <div class="trend-section">
        <div class="trend-header">
          <h4 class="trend-title">记录数量趋势</h4>
          <el-select v-model="trendDimension" class="dimension-select">
            <el-option label="日" value="day" />
            <el-option label="周" value="week" />
            <el-option label="月" value="month" />
          </el-select>
        </div>
        <div class="trend-chart" ref="trendChartRef"></div>
      </div>
    </div>

    <!-- ==================== 记录列表与详情区 ==================== -->
    <div class="records-section">
      <!-- 左侧记录列表 -->
      <div class="records-list">
        <div
          v-for="record in paginatedRecords"
          :key="record.id"
          class="record-item"
          :class="{ active: selectedRecord?.id === record.id }"
          @click="handleSelectRecord(record)"
        >
          <div class="record-influencer">
            <el-avatar :size="40" :src="record.influencerAvatar" class="inf-avatar clickable">
              <template #default>
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI0U4QThFOiIvPjwvc3ZnPg==" />
              </template>
            </el-avatar>
            <div class="inf-info">
              <div class="inf-name">{{ record.influencerName }}</div>
              <div class="inf-stats">
                <span class="manual-count">手动{{ record.manualCount }}</span>
                <span class="separator">|</span>
                <span class="system-count">系统{{ record.systemCount }}</span>
              </div>
            </div>
          </div>
          <div class="record-preview">
            <span class="preview-content">{{ record.latestContent }}</span>
            <span class="preview-time">{{ record.latestTime }}</span>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredRecords.length === 0" class="empty-state">
          <el-empty description="暂无记录" />
        </div>
      </div>

      <!-- 右侧记录详情 -->
      <div class="record-detail">
        <div v-if="selectedRecord" class="detail-content">
          <div class="detail-header">
            <h4 class="detail-title">{{ selectedRecord.influencerName }}</h4>
            <div class="detail-actions">
              <el-button type="primary" link size="small" @click="handleViewInfluencer">查看达人</el-button>
              <el-button type="primary" link size="small" @click="handleViewProducts">
                共{{ selectedRecord.productCount }}个商品 &gt;
              </el-button>
            </div>
          </div>

          <!-- 时间轴 -->
          <div class="timeline">
            <div v-for="(group, date) in groupedDetails" :key="date" class="timeline-group">
              <div class="timeline-date">{{ date }}</div>
              <div class="timeline-items">
                <div v-for="item in group" :key="item.id" class="timeline-item">
                  <div class="item-header">
                    <div class="item-tags">
                      <el-tag size="small" :type="item.source === 'manual' ? 'warning' : 'primary'">
                        {{ item.source === 'manual' ? '手动记录' : '系统记录' }}
                      </el-tag>
                      <el-tag size="small" type="info">{{ item.recordType }}</el-tag>
                    </div>
                    <div class="item-actions">
                      <el-icon v-if="item.source === 'manual'" class="action-icon" @click="openEditDialog(item)"><Edit /></el-icon>
                      <el-icon v-if="item.source === 'manual'" class="action-icon" @click="openDeleteDialog(item)"><Delete /></el-icon>
                    </div>
                  </div>
                  <div class="item-operator">操作人: {{ item.operator }}</div>
                  <div class="item-desc">{{ item.description }}</div>
                  <div class="item-products" v-if="item.products && item.products.length">
                    合作商品: {{ item.products.join(', ') }}
                  </div>
                  <div class="item-content">{{ item.content }}</div>
                  <div class="item-time">{{ item.createTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-detail">
          <el-empty description="请选择一条记录查看详情" />
        </div>
      </div>
    </div>

    <!-- ==================== 分页区 ==================== -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="filteredRecords.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- ==================== 弹窗组件 ==================== -->
    <AddRecordDialog
      v-model="addDialogVisible"
      :influencer-options="influencerOptions"
      :record-type-options="recordTypeOptions"
      :shop-product-options="shopProductOptions"
      @success="handleAddSuccess"
    />

    <EditRecordDialog
      v-model="editDialogVisible"
      :record="currentRecord"
      :influencer-options="influencerOptions"
      :record-type-options="recordTypeOptions"
      :shop-product-options="shopProductOptions"
      @success="handleEditSuccess"
    />

    <DeleteRecordDialog
      v-model="deleteDialogVisible"
      :record="currentRecord"
      @success="handleDeleteSuccess"
    />

    <ExportDialog
      v-model="exportDialogVisible"
      @success="handleExportSuccess"
    />

    <RecordRuleDialog
      v-model="recordRuleDialogVisible"
    />

    <UpdateRuleDialog
      v-model="updateRuleDialogVisible"
    />

    <ProductListDialog
      v-model="productListDialogVisible"
      :products="currentProducts"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { Plus, Edit, Delete, QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import AddRecordDialog from './dialogs/AddRecordDialog.vue'
import EditRecordDialog from './dialogs/EditRecordDialog.vue'
import DeleteRecordDialog from './dialogs/DeleteRecordDialog.vue'
import ExportDialog from './dialogs/ExportDialog.vue'
import RecordRuleDialog from './dialogs/RecordRuleDialog.vue'
import UpdateRuleDialog from './dialogs/UpdateRuleDialog.vue'
import ProductListDialog from './dialogs/ProductListDialog.vue'

// ==================== 平台Tab ====================
const platformTabs = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('tiktok')

// ==================== 筛选参数 ====================
const filterParams = reactive({
  dateRange: [],
  influencerKeyword: '',
  departmentId: '',
  bdId: '',
  shopId: '',
  contentKeyword: ''
})

const departmentOptions = ref([
  { id: 'dept1', name: '销售部' },
  { id: 'dept2', name: '市场部' },
  { id: 'dept3', name: '运营部' }
])

const bdOptions = ref([
  { id: 'bd1', name: '张三' },
  { id: 'bd2', name: '李四' },
  { id: 'bd3', name: '王五' }
])

const shopOptions = ref([
  { id: 'shop1', name: '官方旗舰店' },
  { id: 'shop2', name: '京东自营店' },
  { id: 'shop3', name: '天猫旗舰店' }
])

// ==================== 数据概览 ====================
const totalRecords = ref(86)
const manualRecordCount = ref(12)
const systemRecordCount = ref(74)
const dataUpdateTime = ref('2026-04-24 10:00:00')

const manualRecordPercent = computed(() => {
  if (totalRecords.value === 0) return 0
  return Math.round((manualRecordCount.value / totalRecords.value) * 100)
})

const systemRecordPercent = computed(() => {
  if (totalRecords.value === 0) return 0
  return Math.round((systemRecordCount.value / totalRecords.value) * 100)
})

// ==================== 记录类型标签页 ====================
const recordTypeTabs = computed(() => [
  { key: 'all', label: '全部记录', count: totalRecords.value },
  { key: 'manual', label: '手动记录', count: manualRecordCount.value },
  { key: 'system', label: '系统记录', count: systemRecordCount.value }
])
const activeRecordType = ref('all')

// ==================== 趋势图表 ====================
const trendDimension = ref('day')
const trendChartRef = ref(null)
let trendChart = null

// ==================== 记录列表 ====================
const records = ref([
  {
    id: 1,
    influencerName: '@fashionqueen_k',
    influencerAvatar: '',
    manualCount: 3,
    systemCount: 8,
    latestContent: '已发送合作邮件，等待回复...',
    latestTime: '2026-04-23 15:30',
    productCount: 5,
    details: [
      { id: 101, source: 'manual', recordType: '待触达', operator: '张三', description: '邮件跟进', products: ['商品A', '商品B'], content: '已发送合作邮件，等待回复，预计3天内反馈', createTime: '2026-04-23 15:30:00' },
      { id: 102, source: 'system', recordType: '系统自动', operator: '系统', description: '系统记录样品发货', products: ['商品A'], content: '样品单号: SPP20260420001 已发货', createTime: '2026-04-22 10:00:00' },
      { id: 103, source: 'manual', recordType: '承诺记录', operator: '张三', description: '确认合作意向', products: [], content: '达人确认参与618大促活动', createTime: '2026-04-21 14:20:00' }
    ]
  },
  {
    id: 2,
    influencerName: '@techreview_mike',
    influencerAvatar: '',
    manualCount: 5,
    systemCount: 12,
    latestContent: '视频素材审核中...',
    latestTime: '2026-04-23 11:20',
    productCount: 3,
    details: [
      { id: 201, source: 'manual', recordType: '样品发货', operator: '李四', description: '样品已寄出', products: ['商品C'], content: '样品已通过顺丰发出，单号: SF1234567890', createTime: '2026-04-23 11:20:00' }
    ]
  },
  {
    id: 3,
    influencerName: '@beauty_sarah',
    influencerAvatar: '',
    manualCount: 2,
    systemCount: 6,
    latestContent: '合作达成，准备签署合同',
    latestTime: '2026-04-22 16:45',
    productCount: 8,
    details: [
      { id: 301, source: 'manual', recordType: '寄样备注', operator: '王五', description: '补充合作细节', products: ['商品D', '商品E'], content: '达人提出修改合作条款，已反馈给商务团队', createTime: '2026-04-22 16:45:00' }
    ]
  },
  {
    id: 4,
    influencerName: '@foodie_james',
    influencerAvatar: '',
    manualCount: 1,
    systemCount: 4,
    latestContent: '已完成第一阶段合作',
    latestTime: '2026-04-21 09:30',
    productCount: 2,
    details: [
      { id: 401, source: 'system', recordType: '系统自动', operator: '系统', description: '系统记录合作完成', products: ['商品F'], content: '第一阶段合作已完成，GMV达成率105%', createTime: '2026-04-21 09:30:00' }
    ]
  },
  {
    id: 5,
    influencerName: '@sports_pro',
    influencerAvatar: '',
    manualCount: 4,
    systemCount: 9,
    latestContent: '等待达人确认档期',
    latestTime: '2026-04-20 18:00',
    productCount: 4,
    details: []
  }
])

const filteredRecords = computed(() => {
  let result = records.value

  if (activeRecordType.value === 'manual') {
    result = result.filter(r => r.manualCount > 0)
  } else if (activeRecordType.value === 'system') {
    result = result.filter(r => r.systemCount > 0)
  }

  if (filterParams.influencerKeyword) {
    const keyword = filterParams.influencerKeyword.toLowerCase()
    result = result.filter(r => r.influencerName.toLowerCase().includes(keyword))
  }

  return result
})

const paginatedRecords = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredRecords.value.slice(start, end)
})

// ==================== 选中记录 & 详情 ====================
const selectedRecord = ref(null)

const groupedDetails = computed(() => {
  if (!selectedRecord.value) return {}
  const groups = {}
  selectedRecord.value.details.forEach(item => {
    const date = item.createTime.split(' ')[0]
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  })
  return groups
})

// ==================== 分页 ====================
const pagination = reactive({
  page: 1,
  pageSize: 10
})

// ==================== 弹窗状态 ====================
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const exportDialogVisible = ref(false)
const recordRuleDialogVisible = ref(false)
const updateRuleDialogVisible = ref(false)
const productListDialogVisible = ref(false)

const currentRecord = ref(null)
const currentProducts = ref([])

// ==================== 下拉选项数据 ====================
const influencerOptions = ref([
  { id: 1, name: '@fashionqueen_k' },
  { id: 2, name: '@techreview_mike' },
  { id: 3, name: '@beauty_sarah' },
  { id: 4, name: '@foodie_james' },
  { id: 5, name: '@sports_pro' }
])

const recordTypeOptions = ref([
  { value: 'promise', label: '承诺记录' },
  { value: 'sample_send', label: '样品发货' },
  { value: 'sample_note', label: '寄样备注' },
  { value: 'to_contact', label: '待触达' }
])

const shopProductOptions = ref({
  shop1: [
    { id: 'p1', name: '商品A' },
    { id: 'p2', name: '商品B' }
  ],
  shop2: [
    { id: 'p3', name: '商品C' }
  ],
  shop3: [
    { id: 'p4', name: '商品D' },
    { id: 'p5', name: '商品E' }
  ]
})

// ==================== 方法 ====================

// 平台切换
function handlePlatformChange(platform) {
  activePlatform.value = platform
  handleReset()
}

// 记录类型切换
function handleRecordTypeChange(type) {
  activeRecordType.value = type
  pagination.page = 1
}

// 查询
function handleQuery() {
  pagination.page = 1
  ElMessage.success('查询成功')
}

// 重置
function handleReset() {
  filterParams.dateRange = []
  filterParams.influencerKeyword = ''
  filterParams.departmentId = ''
  filterParams.bdId = ''
  filterParams.shopId = ''
  filterParams.contentKeyword = ''
  pagination.page = 1
  ElMessage.success('重置成功')
}

// 选择记录
function handleSelectRecord(record) {
  selectedRecord.value = record
}

// 查看达人
function handleViewInfluencer() {
  ElMessage.info('跳转达人详情页')
}

// 查看商品
function handleViewProducts() {
  if (selectedRecord.value) {
    currentProducts.value = selectedRecord.value.details
      .flatMap(d => d.products || [])
      .filter((p, i, arr) => arr.indexOf(p) === i)
    productListDialogVisible.value = true
  }
}

// 新增记录
function openAddDialog() {
  addDialogVisible.value = true
}

function handleAddSuccess() {
  ElMessage.success('添加成功')
  addDialogVisible.value = false
}

// 编辑记录
function openEditDialog(item) {
  if (item.source === 'system') {
    ElMessage.warning('系统记录不可编辑')
    return
  }
  currentRecord.value = item
  editDialogVisible.value = true
}

function handleEditSuccess() {
  ElMessage.success('编辑成功')
  editDialogVisible.value = false
}

// 删除记录
function openDeleteDialog(item) {
  if (item.source === 'system') {
    ElMessage.warning('系统记录不可删除')
    return
  }
  currentRecord.value = item
  deleteDialogVisible.value = true
}

function handleDeleteSuccess() {
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
  if (selectedRecord.value) {
    const index = selectedRecord.value.details.findIndex(d => d.id === currentRecord.value.id)
    if (index > -1) {
      selectedRecord.value.details.splice(index, 1)
    }
  }
}

// 导出数据
function handleExport() {
  if (filteredRecords.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  exportDialogVisible.value = true
}

function handleExportSuccess() {
  ElMessage.success('导出成功')
  exportDialogVisible.value = false
}

// 统计规则弹窗
function showRecordRuleDialog() {
  recordRuleDialogVisible.value = true
}

// 更新规则弹窗
function showUpdateRuleDialog() {
  updateRuleDialogVisible.value = true
}

// 初始化趋势图表
function initTrendChart() {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)

  const dates = trendDimension.value === 'day'
    ? ['04-18', '04-19', '04-20', '04-21', '04-22', '04-23', '04-24']
    : trendDimension.value === 'week'
    ? ['第15周', '第16周', '第17周', '第18周', '第19周']
    : ['1月', '2月', '3月', '4月']

  const data = trendDimension.value === 'day'
    ? [12, 15, 18, 14, 20, 16, 11]
    : trendDimension.value === 'week'
    ? [85, 92, 78, 105, 98]
    : [320, 380, 420, 390, 456]

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        name: '记录数量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#1677ff'
        },
        lineStyle: {
          color: '#1677ff',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(22, 119, 255, 0.3)' },
            { offset: 1, color: 'rgba(22, 119, 255, 0.05)' }
          ])
        },
        data: data
      }
    ]
  }

  trendChart.setOption(option)
}

// 监听趋势维度变化
watch(trendDimension, () => {
  if (trendChart) {
    initTrendChart()
  }
})

onMounted(() => {
  initTrendChart()
  window.addEventListener('resize', () => {
    trendChart && trendChart.resize()
  })
})

onUnmounted(() => {
  if (trendChart) {
    trendChart.dispose()
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.follow-up-records {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

// ==================== 平台导航区 ====================
.platform-section {
  @extend .platform-section;
}

.platform-tabs {
  @extend .platform-tabs;
}

.platform-tab {
  @extend .platform-tab;
}

// ==================== 筛选查询区 ====================
.filter-section {
  @include filter-section;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.search-input {
  width: 200px;
}

.search-input-wide {
  width: 280px;
}

.date-picker {
  width: 260px;
}

.filter-select {
  width: 140px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

// ==================== 数据概览与操作区 ====================
.overview-section {
  background: #fff;
  border: none;
  border-radius: 8px;
  margin-top: 16px;
  padding: 16px;
}

.overview-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.overview-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.question-icon {
  cursor: pointer;
  color: #999;
  &:hover {
    color: #1677ff;
  }
}

.update-time {
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.overview-right {
  display: flex;
  gap: 8px;
}

.add-btn {
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

// 记录类型标签页
.type-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.type-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  background: #f5f7fa;
  transition: all 0.2s;

  &:hover {
    color: #1677ff;
  }

  &.active {
    color: #fff;
    background: #1677ff;
  }

  .tab-count {
    font-size: 12px;
  }
}

// 记录类型占比卡片
.percentage-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.percentage-card {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &.manual {
    background: #fff7e6;
    &:hover {
      background: #ffe6cc;
    }
  }

  &.system {
    background: #e6f4ff;
    &:hover {
      background: #cce5ff;
    }
  }
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #666;
}

.card-count {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.card-percent {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;

  &.manual {
    background: #ff9c3a;
  }

  &.system {
    background: #1677ff;
  }
}

// 趋势图表
.trend-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.trend-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dimension-select {
  width: 100px;
}

.trend-chart {
  height: 200px;
}

// ==================== 记录列表与详情区 ====================
.records-section {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  min-height: 400px;
}

.records-list {
  width: 40%;
  background: #fff;
  border: none;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 500px;
}

.record-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fafafa;
  }

  &.active {
    background: #e6f0ff;
    border-left: 3px solid #1677ff;
  }

  &:last-child {
    border-bottom: none;
  }
}

.record-influencer {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.inf-avatar {
  flex-shrink: 0;
  background: #e8e8e8;
}

.inf-info {
  flex: 1;
  min-width: 0;
}

.inf-name {
  font-size: 14px;
  font-weight: 500;
  color: #1677ff;
  margin-bottom: 2px;
}

.inf-stats {
  font-size: 12px;
  color: #999;

  .separator {
    margin: 0 4px;
  }
}

.record-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 52px;
}

.preview-content {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.preview-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.empty-state {
  padding: 40px 0;
}

// 右侧详情
.record-detail {
  width: 60%;
  background: #fff;
  border: none;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 500px;
}

.detail-content {
  padding: 16px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.detail-actions {
  display: flex;
  gap: 8px;
}

// 时间轴
.timeline {
  .timeline-group {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.timeline-date {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid #1677ff;
}

.timeline-items {
  padding-left: 16px;
}

.timeline-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-tags {
  display: flex;
  gap: 4px;
}

.item-actions {
  display: flex;
  gap: 4px;
}

.action-icon {
  cursor: pointer;
  color: #999;
  font-size: 14px;
  &:hover {
    color: #1677ff;
  }
}

.item-operator {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.item-desc {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.item-products {
  font-size: 12px;
  color: #1677ff;
  margin-bottom: 4px;
}

.item-content {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.5;
}

.item-time {
  font-size: 12px;
  color: #999;
}

.empty-detail {
  padding: 60px 0;
}

// ==================== 分页区 ====================
.pagination-section {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

// ==================== 表格样式覆盖 ====================
:deep(.el-table) {
  .el-table__header th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
    font-size: 13px;
  }

  .el-table__row {
    border-bottom: 1px solid #f0f0f0;
  }
}

// ==================== Toast提示样式 ====================
:deep(.success-toast) {
  --el-message-bg-color: #00cc66;
}

:deep(.warning-toast) {
  --el-message-bg-color: #ff6600;
}
</style>

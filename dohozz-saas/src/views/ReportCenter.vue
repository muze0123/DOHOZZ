<template>
  <div class="report-center">
    <!-- 区域A：筛选区 -->
    <div class="section-block filter-area">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">报表搜索</span>
          <el-input
            v-model="searchKeyword"
            placeholder="请输入报表名称"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">平台</span>
          <el-select v-model="platform" placeholder="全部" style="width: 130px">
            <el-option label="全部" value="" />
            <el-option label="TikTok" value="tiktok" />
            <el-option label="Shopee" value="shopee" />
            <el-option label="Lazada" value="lazada" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">分析对象</span>
          <el-select v-model="analysisType" placeholder="全部" style="width: 130px">
            <el-option label="全部" value="" />
            <el-option label="出单达人" value="talent" />
            <el-option label="员工" value="employee" />
            <el-option label="商品链接" value="product" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">创建人</span>
          <el-select
            v-model="creator"
            placeholder="全部"
            filterable
            clearable
            style="width: 130px"
          >
            <el-option label="全部" value="" />
            <el-option label="张三" value="zhangsan" />
            <el-option label="李四" value="lisi" />
            <el-option label="王五" value="wangwu" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">创建时间</span>
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 320px"
          />
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 区域B：操作区 -->
    <div class="action-area">
      <el-button type="primary" @click="handleCreate">
        <span class="btn-icon">+</span> 创建报表
      </el-button>
    </div>

    <!-- 区域C：数据列表区 -->
    <div class="section-block table-area">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="reportName" label="报表名称" min-width="150">
          <template #default="{ row }">
            <span class="report-name">{{ row.reportName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="platform" label="平台" width="120">
          <template #default="{ row }">
            <div class="platform-cell">
              <span class="platform-logo">{{ getPlatformLogo(row.platform) }}</span>
              <span class="platform-name">{{ getPlatformName(row.platform) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="filters" label="筛选条件" min-width="220">
          <template #default="{ row }">
            <el-tooltip :content="row.filters" placement="top" :disabled="row.filters.length < 40">
              <span class="filter-text">{{ row.filters }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="analysisType" label="分析对象" width="100">
          <template #default="{ row }">
            <span>{{ getAnalysisTypeName(row.analysisType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <div class="status-cell">
              <span class="status-dot" :class="row.status"></span>
              <span class="status-text">{{ row.status === 'processing' ? '处理中' : '已完成' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dateRange" label="时间范围" width="180">
          <template #default="{ row }">
            <span class="date-range-text">{{ row.dateRange }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" width="90">
          <template #default="{ row }">
            <span>{{ row.creator }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template #default="{ row }">
            <span class="created-time">{{ row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-cell">
              <template v-if="row.status === 'done'">
                <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                <el-button type="success" link @click="handleDownload(row)">下载</el-button>
              </template>
              <template v-else>
                <span class="no-action">— —</span>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div v-if="!loading && tableData.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#d9d9d9" stroke-width="2"/>
            <path d="M32 18c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14z" fill="none" stroke="#d9d9d9" stroke-width="2"/>
            <path d="M32 24v8M32 36h8" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="empty-text">暂无报表数据</div>
      </div>
    </div>

    <!-- 区域D：分页区 -->
    <div v-if="total > 0" class="pagination-area">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 删除确认弹窗 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="delete-dialog-content">
        <p>确认删除该报表吗？</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 筛选条件
const searchKeyword = ref('')
const platform = ref('')
const analysisType = ref('')
const creator = ref('')
const dateRange = ref([])

// 表格数据
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 删除弹窗
const deleteDialogVisible = ref(false)
const currentDeleteRow = ref(null)

// 平台映射
const platformMap = {
  tiktok: { logo: 'TT', name: 'TikTok' },
  shopee: { logo: 'SP', name: 'Shopee' },
  lazada: { logo: 'LZ', name: 'Lazada' }
}

// 分析对象映射
const analysisTypeMap = {
  talent: '出单达人',
  employee: '员工',
  product: '商品链接'
}

// 模拟数据
const mockData = [
  {
    reportId: '1',
    reportName: '12月达人业绩分析报表',
    platform: 'tiktok',
    filters: '达人类型：出单达人；部门：全部；员工：全部',
    analysisType: 'talent',
    status: 'done',
    dateRange: '2025-12-01 至 2025-12-31',
    creator: '张三',
    createdAt: '2025-12-09 14:07:13'
  },
  {
    reportId: '2',
    reportName: 'Q4季度销售汇总报表',
    platform: 'shopee',
    filters: '达人类型：全部；部门：销售部；员工：全部',
    analysisType: 'talent',
    status: 'done',
    dateRange: '2025-10-01 至 2025-12-31',
    creator: '李四',
    createdAt: '2025-12-08 10:30:00'
  },
  {
    reportId: '3',
    reportName: '商品链接转化分析',
    platform: 'lazada',
    filters: '商品分类：美妆；品牌：全部',
    analysisType: 'product',
    status: 'processing',
    dateRange: '2025-12-01 至 2025-12-15',
    creator: '王五',
    createdAt: '2025-12-10 09:15:00'
  },
  {
    reportId: '4',
    reportName: '员工绩效排名报表',
    platform: 'tiktok',
    filters: '部门：全部；员工：全部',
    analysisType: 'employee',
    status: 'done',
    dateRange: '2025-12-01 至 2025-12-31',
    creator: '张三',
    createdAt: '2025-12-07 16:45:00'
  },
  {
    reportId: '5',
    reportName: 'TikTok达人合作分析',
    platform: 'tiktok',
    filters: '达人类型：建联达人；部门：全部；员工：小李',
    analysisType: 'talent',
    status: 'done',
    dateRange: '2025-11-01 至 2025-11-30',
    creator: '李四',
    createdAt: '2025-12-05 11:20:00'
  }
]

// 获取平台Logo
const getPlatformLogo = (platform) => {
  return platformMap[platform]?.logo || '--'
}

// 获取平台名称
const getPlatformName = (platform) => {
  return platformMap[platform]?.name || '--'
}

// 获取分析对象名称
const getAnalysisTypeName = (type) => {
  return analysisTypeMap[type] || '--'
}

// 查询
const handleQuery = () => {
  currentPage.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchKeyword.value = ''
  platform.value = ''
  analysisType.value = ''
  creator.value = ''
  dateRange.value = []
  currentPage.value = 1
  fetchData()
}

// 创建报表
const handleCreate = () => {
  ElMessage.info('跳转至创建报表页面')
}

// 编辑报表
const handleEdit = (row) => {
  ElMessage.info(`编辑报表：${row.reportName}`)
}

// 删除报表
const handleDelete = (row) => {
  currentDeleteRow.value = row
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  if (currentDeleteRow.value) {
    const index = tableData.value.findIndex(item => item.reportId === currentDeleteRow.value.reportId)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value--
    }
    ElMessage.success('删除成功')
  }
  deleteDialogVisible.value = false
  currentDeleteRow.value = null
}

// 下载报表
const handleDownload = (row) => {
  ElMessage.success(`开始下载：${row.reportName}.xlsx`)
}

// 分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchData()
}

// 页码变化
const handlePageChange = (val) => {
  currentPage.value = val
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  let filteredData = [...mockData]
  if (searchKeyword.value) {
    filteredData = filteredData.filter(item =>
      item.reportName.includes(searchKeyword.value)
    )
  }
  if (platform.value) {
    filteredData = filteredData.filter(item => item.platform === platform.value)
  }
  if (analysisType.value) {
    filteredData = filteredData.filter(item => item.analysisType === analysisType.value)
  }
  if (creator.value) {
    filteredData = filteredData.filter(item => item.creator === creator.value)
  }

  tableData.value = filteredData
  total.value = filteredData.length
  loading.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
$primary: #0064E0;
$primary-hover: #0143B5;
$primary-light: #47A5FA;
$white: #FFFFFF;
$bg: #f5f7fa;
$border: #e5e7eb;
$text-1: #050505;
$text-2: #65676B;
$text-3: #BCC0C4;
$primary-text: #050505;
$secondary-text: #65676B;
$border-radius-lg: 14px;
$success-green: #31A24C;
$error-red: #E41E3F;

.report-center {
  padding: 16px 0;
  min-height: 100%;
  background: $bg;
}

// 筛选区
.filter-area {
  padding: 16px;
  margin: 0;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
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

// 操作区
.action-area {
  padding: 12px 16px;
}

.btn-icon {
  margin-right: 4px;
}

// 表格区
.table-area {
  padding: 0;
}

.report-name {
  color: $primary;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
}

.platform-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: $bg;
  font-size: 10px;
  font-weight: 600;
  color: $text-2;
}

.platform-name {
  font-size: 13px;
  color: $primary-text;
}

.filter-text {
  font-size: 13px;
  color: $secondary-text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
  display: inline-block;
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  &.processing {
    background: $text-3;
  }
  &.done {
    background: $success-green;
  }
}

.status-text {
  font-size: 13px;
  color: $primary-text;
}

.date-range-text {
  font-size: 12px;
  color: $secondary-text;
}

.created-time {
  font-size: 12px;
  color: $text-3;
}

.action-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.no-action {
  color: $text-3;
  font-size: 13px;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: $text-3;
}

// 分页区
.pagination-area {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}

// 删除弹窗
.delete-dialog-content {
  text-align: center;
  padding: 20px 0;
  p {
    font-size: 15px;
    color: $primary-text;
  }
}

// 表格样式覆盖
:deep(.el-table) {
  --el-table-border-color: #{$border};
  --el-table-header-bg-color: #{$bg};
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

// 分页样式覆盖
:deep(.el-pagination) {
  --el-pagination-button-bg-color: #{$white};
  --el-pagination-hover-color: #{$primary};
}
</style>

<template>
  <div class="team-analysis-page">
    <!-- 顶部导航区 -->
    <div class="top-filter-section">
      <div class="top-right-actions">
        <el-button type="warning" size="small" @click="handleTutorial">一分钟看懂指挥中台</el-button>
        <el-button size="small" @click="handleExportImage">导出页面为图片</el-button>
        <el-button size="small" @click="handleTutorial">教程</el-button>
      </div>

      <div class="filter-row-main">
        <div class="platform-tabs">
          <span v-for="p in platforms" :key="p" class="platform-tab" :class="{ active: activePlatform === p }" @click="handlePlatformChange(p)">{{ p }}</span>
        </div>

        <div class="time-filter">
          <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" size="small" style="width: 240px;" />
          <div class="quick-time-btns">
            <span v-for="opt in quickTimeOptions" :key="opt.value" class="quick-btn" :class="{ active: activeQuickTime === opt.value }" @click="handleQuickTimeChange(opt.value)">{{ opt.label }}</span>
          </div>
        </div>
      </div>

      <div class="filter-row-sub">
        <div class="filter-item">
          <span class="filter-label">部门:</span>
          <el-select v-model="activeDept" size="small" style="width: 120px;">
            <el-option label="全部部门" value="全部部门" />
            <el-option label="商务1组" value="商务1组" />
            <el-option label="商务2组" value="商务2组" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">媒介:</span>
          <el-select v-model="activeMedia" size="small" style="width: 120px;">
            <el-option label="全部媒介" value="全部媒介" />
            <el-option label="媒介甲" value="媒介甲" />
            <el-option label="媒介乙" value="媒介乙" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">店铺:</span>
          <el-select v-model="activeShop" size="small" style="width: 140px;">
            <el-option label="所有店铺" value="所有店铺" />
            <el-option label="DOHOZZ旗舰店" value="DOHOZZ旗舰店" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 数据指标概览区 -->
    <div class="metrics-section">
      <div class="section-header">
        <span class="section-title">数据指标</span>
        <span class="section-sub">数据范围: 2026/04/01-2026/04/29 | 数据更新时间: 2026-04-29 09:30</span>
        <span class="refresh-icon" @click="handleRefresh">🔄</span>
      </div>

      <div class="metrics-content">
        <!-- 左侧金额指标 -->
        <div class="metrics-left">
          <div class="metric-card pink-bg">
            <div class="metric-row">
              <div class="metric-item">
                <span class="metric-label">达播成交金额</span>
                <span class="metric-value">¥0</span>
                <span class="metric-trend down">环比 ↓-100%</span>
              </div>
              <el-tooltip content="达播成交金额说明"><span class="help-icon">?</span></el-tooltip>
            </div>
            <div class="metric-sub">
              <div class="sub-item">
                <span class="sub-label">达人成交金额</span>
                <span class="sub-value">¥0</span>
                <span class="trend-text down">↓-100%</span>
              </div>
              <div class="sub-item">
                <span class="sub-label">团长成交金额</span>
                <span class="sub-value">¥0</span>
                <span class="trend-text down">↓-100%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧其他指标 -->
        <div class="metrics-right">
          <div class="metric-grid">
            <div class="metric-cell">
              <span class="cell-label">建联达人数</span>
              <span class="cell-value">46</span>
              <span class="trend-text down">↓-13.21%</span>
            </div>
            <div class="metric-cell">
              <span class="cell-label">寄样达人数</span>
              <span class="cell-value">1</span>
              <span class="trend-text down">↓-85.71%</span>
            </div>
            <div class="metric-cell">
              <span class="cell-label">寄样次数</span>
              <span class="cell-value">1</span>
              <span class="trend-text down">↓-85.71%</span>
            </div>
            <div class="metric-cell">
              <span class="cell-label">签收出单率</span>
              <span class="cell-value">0%</span>
              <span class="trend-text up">↑0%</span>
            </div>
            <div class="metric-cell">
              <span class="cell-label">出单达人数</span>
              <span class="cell-value">0</span>
              <span class="trend-text down">↓-100%</span>
            </div>
            <div class="metric-cell">
              <span class="cell-label">出单视频数</span>
              <span class="cell-value">0</span>
              <span class="trend-text down">↓-100%</span>
            </div>
            <div class="metric-cell">
              <span class="cell-label">出单直播数</span>
              <span class="cell-value">0</span>
              <span class="trend-text up">↑0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 团队跟进趋势图表区 -->
    <div class="trend-section">
      <div class="section-header">
        <span class="section-title">团队跟进趋势</span>
        <span class="section-sub">数据范围: 2026/04/01-2026/04/29 | 数据更新时间: 2026-04-29 09:30</span>
        <span class="refresh-icon" @click="handleRefresh">🔄</span>
      </div>
      <div class="chart-legend">
        <div class="legend-item" v-for="item in chartLegend" :key="item.name">
          <span class="legend-dot" :style="{ background: item.color }"></span>
          {{ item.name }}
        </div>
      </div>
      <div class="bar-chart">
        <div class="chart-y-axis">
          <span>1200</span><span>900</span><span>600</span><span>300</span><span>0</span>
        </div>
        <div class="chart-bars">
          <div class="bar-item" v-for="(val, idx) in chartData" :key="idx" :style="{ height: (val / 1200 * 100) + '%' }">
            <div class="bar-fill" :style="{ height: '100%', background: idx === 13 ? '#FF6B00' : '#1677FF' }"></div>
          </div>
        </div>
        <div class="chart-x-axis">
          <span>04/01</span><span>04/08</span><span>04/15</span><span>04/22</span><span>04/29</span>
        </div>
      </div>
    </div>

    <!-- 达人合作漏斗区 -->
    <div class="funnel-section">
      <div class="section-header">
        <span class="section-title">达人合作漏斗</span>
        <span class="section-sub">数据范围: 2026/04/01-2026/04/29 | 数据更新时间: 2026-04-29 09:30</span>
        <span class="refresh-icon" @click="handleRefresh">🔄</span>
      </div>

      <!-- 达人转化分析 -->
      <div class="funnel-block">
        <div class="block-title">达人转化分析</div>
        <div class="filter-row-sub" style="margin-bottom: 16px;">
          <div class="filter-item">
            <span class="filter-label">部门:</span>
            <el-select v-model="activeDept" size="small" style="width: 120px;">
              <el-option label="全部部门" value="全部部门" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">媒介:</span>
            <el-select v-model="activeMedia" size="small" style="width: 120px;">
              <el-option label="全部媒介" value="全部媒介" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">店铺:</span>
            <el-select v-model="activeShop" size="small" style="width: 140px;">
              <el-option label="所有店铺" value="所有店铺" />
            </el-select>
          </div>
        </div>
        <div class="conversion-content">
          <div class="conversion-left">
            <div class="conversion-box">
              <span class="box-label">出单达人</span>
              <span class="box-value">0</span>
              <span class="box-arrow">→</span>
            </div>
            <div class="conversion-box">
              <span class="box-label">深度合作达人</span>
              <span class="box-value">0</span>
              <span class="box-arrow">→</span>
            </div>
          </div>
          <div class="conversion-right">
            <div class="rate-item">
              <span class="rate-label">达人出单率:</span>
              <span class="rate-value">0%</span>
              <span class="rate-tag">(中)</span>
              <span class="rate-avg">平均达人出单率: 0%</span>
              <el-tooltip content="达人出单率说明"><span class="help-icon">?</span></el-tooltip>
            </div>
            <div class="rate-item">
              <span class="rate-label">深度合作率:</span>
              <span class="rate-value">0%</span>
              <span class="rate-tag">(中)</span>
              <span class="rate-avg">平均深度合作率: 0%</span>
              <el-tooltip content="深度合作率说明"><span class="help-icon">?</span></el-tooltip>
            </div>
          </div>
        </div>
      </div>

      <!-- 寄样转化分析 -->
      <div class="funnel-block">
        <div class="block-title">寄样转化分析</div>
        <div class="funnel-flow">
          <div class="flow-item">
            <span class="flow-label">申请寄样</span>
            <span class="flow-value">16</span>
            <span class="flow-arrow">↓</span>
          </div>
          <div class="flow-item">
            <span class="flow-label">寄样发货</span>
            <span class="flow-value">1</span>
            <span class="flow-arrow">↓</span>
          </div>
          <div class="flow-item">
            <span class="flow-label">样品签收</span>
            <span class="flow-value">1</span>
            <span class="flow-arrow">↓</span>
          </div>
          <div class="flow-item">
            <span class="flow-label">签收交付</span>
            <span class="flow-value">0</span>
            <span class="flow-arrow">↓</span>
          </div>
          <div class="flow-item">
            <span class="flow-label">交付出单</span>
            <span class="flow-value">0</span>
          </div>
        </div>
        <div class="funnel-rates">
          <div class="rate-row">
            <div class="rate-item">
              <span class="rate-label">申样成功率:</span>
              <span class="rate-value">6.25%</span>
              <span class="rate-tag">(中)</span>
              <span class="rate-avg">平均申样成功率: 6.25%</span>
            </div>
            <div class="rate-item">
              <span class="rate-label">发货签收率:</span>
              <span class="rate-value">100%</span>
              <span class="rate-tag">(中)</span>
              <span class="rate-avg">平均发货签收率: 100%</span>
            </div>
          </div>
          <div class="rate-row">
            <div class="rate-item">
              <span class="rate-label">签收交付率:</span>
              <span class="rate-value">0%</span>
              <span class="rate-tag">(中)</span>
              <span class="rate-avg">平均签收交付率: 0%</span>
            </div>
            <div class="rate-item">
              <span class="rate-label">交付出单率:</span>
              <span class="rate-value">0%</span>
              <span class="rate-tag">(中)</span>
              <span class="rate-avg">平均交付出单率: 0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 员工业绩分析表格区 -->
    <div class="performance-section">
      <div class="section-tabs">
        <span class="section-tab" :class="{ active: activeTab === 'employee' }" @click="activeTab = 'employee'">员工业绩分析</span>
        <span class="section-tab" :class="{ active: activeTab === 'department' }" @click="activeTab = 'department'">部门业绩分析</span>
      </div>

      <div class="table-header">
        <div class="header-left">
          <el-select v-model="performanceMonth" size="small" style="width: 100px;">
            <el-option label="2026-04" value="2026-04" />
            <el-option label="2026-03" value="2026-03" />
          </el-select>
          <span class="view-more" @click="handleViewMore">查看更多数据 ></span>
        </div>
        <div class="header-right">
          <el-button size="small" @click="handleSetTarget">设置目标</el-button>
          <el-button size="small" type="primary" @click="handleExportTable">导出</el-button>
        </div>
      </div>

      <table class="performance-table">
        <thead>
          <tr>
            <th style="width: 60px">排名</th>
            <th>员工/部门</th>
            <th @click="handleSort('sales')" style="width: 120px">达播成交金额 ↕</th>
            <th @click="handleSort('connect')" style="width: 100px">建联达人数 ↕</th>
            <th @click="handleSort('sample')" style="width: 100px">寄样达人数 ↕</th>
            <th @click="handleSort('order')" style="width: 100px">出单达人数 ↕</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in performanceList" :key="item.id">
            <td><span class="rank-badge" :class="{ top3: item.rank <= 3 }">{{ item.rank }}</span></td>
            <td>
              <div class="employee-info">
                <div class="employee-avatar" :class="{ disabled: item.disabled }">
                  {{ item.disabled ? '0.0' : item.name.charAt(0) }}
                </div>
                <div class="employee-detail">
                  <span class="employee-name" :class="{ disabled: item.disabled }">
                    {{ item.name }}{{ item.disabled ? '(已禁用)' : '' }}
                  </span>
                  <span class="employee-dept">-</span>
                </div>
              </div>
            </td>
            <td>¥{{ item.sales }}</td>
            <td>{{ item.connect }}</td>
            <td>{{ item.sample }}</td>
            <td>{{ item.order }}</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="totalCount"
          layout="prev, pager, next, sizes, total"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const platforms = ['全部', '抖音', '快手', '视频号', '小红书']
const activePlatform = ref('抖音')
const activeDept = ref('全部部门')
const activeMedia = ref('全部媒介')
const activeShop = ref('所有店铺')
const dateRange = ref(['2026-04-01', '2026-04-29'])
const quickTimeOptions = [
  { label: '近N天', value: 'nday' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '大促', value: 'promo' },
  { label: '自定义', value: 'custom' },
]
const activeQuickTime = ref('month')
const activeTab = ref('employee')
const performanceMonth = ref('2026-04')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(480)

const chartLegend = [
  { name: '成交金额', color: '#8C8C8C' },
  { name: '跟进', color: '#1677FF' },
  { name: '建联', color: '#52C41A' },
  { name: '寄样', color: '#FA8C16' },
  { name: '出单', color: '#FF4D4F' },
]

// Generate chart data with peak at day 14
const chartData = ref([
  50, 80, 30, 60, 40, 70, 20, 90, 45, 55,
  35, 65, 25, 950, 30, 50, 40, 60, 35, 55,
  25, 45, 15, 70, 40, 60, 30, 50, 20, 40
])

const performanceList = ref([
  { id: '1', rank: 1, name: '艺伟', disabled: false, sales: '0', connect: 0, sample: 0, order: 0 },
  { id: '2', rank: 2, name: '0.0', disabled: true, sales: '0', connect: 0, sample: 0, order: 0 },
  { id: '3', rank: 3, name: '测试员工', disabled: false, sales: '0', connect: 0, sample: 0, order: 0 },
  { id: '4', rank: 4, name: '王五', disabled: false, sales: '0', connect: 0, sample: 0, order: 0 },
  { id: '5', rank: 5, name: '赵六', disabled: false, sales: '0', connect: 0, sample: 0, order: 0 },
])

const handlePlatformChange = (platform) => {
  activePlatform.value = platform
}

const handleQuickTimeChange = (opt) => {
  activeQuickTime.value = opt
}

const handleTutorial = () => {
  ElMessage.info('教程功能开发中')
}

const handleExportImage = () => {
  ElMessage.success('导出成功')
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleSetTarget = () => {
  ElMessage.info('设置目标功能开发中')
}

const handleExportTable = () => {
  ElMessage.success('导出成功')
}

const handleViewMore = () => {
  ElMessage.info('查看更多数据')
}

const handleSort = (field) => {
  ElMessage.info(`按${field}排序`)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
}
</script>

<style lang="scss" scoped>
.team-analysis-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
  padding-bottom: 16px;
}

/* 顶部导航区 */
.top-filter-section {
  background: #FFFFFF;
  padding: 16px 24px;
  margin-bottom: 16px;
}

.top-right-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-row-main {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 12px;
}

.platform-tabs {
  display: flex;
  gap: 4px;
}

.platform-tab {
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #595959;
  transition: all 0.2s;

  &:hover { color: #262626; }
  &.active {
    background: #262626;
    color: #FFFFFF;
  }
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quick-time-btns {
  display: flex;
  gap: 4px;
}

.quick-btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #595959;
  transition: all 0.2s;

  &:hover { color: #262626; }
  &.active {
    background: #FF6B00;
    color: #FFFFFF;
  }
}

.filter-row-sub {
  display: flex;
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
  color: #595959;
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #E8E8E8;
  color: #8C8C8C;
  font-size: 11px;
  cursor: pointer;

  &:hover { background: #D9D9D9; }
}

/* 数据指标概览区 */
.metrics-section {
  background: #FFFFFF;
  margin: 0 24px 16px;
  padding: 16px;
  border-radius: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
}

.section-sub {
  font-size: 12px;
  color: #8C8C8C;
}

.refresh-icon {
  cursor: pointer;
  margin-left: auto;
  font-size: 14px;

  &:hover { opacity: 0.7; }
}

.metrics-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.metric-card.pink-bg {
  background: linear-gradient(135deg, #FFF1F0 0%, #FFECE8 100%);
  border-radius: 8px;
  padding: 16px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 13px;
  color: #595959;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #262626;
}

.metric-trend {
  font-size: 13px;

  &.up { color: #FF4D4F; }
  &.down { color: #52C41A; }
}

.metric-sub {
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sub-label {
  font-size: 12px;
  color: #8C8C8C;
  width: 80px;
}

.sub-value {
  font-size: 14px;
  color: #262626;
}

.trend-text {
  font-size: 12px;

  &.up { color: #FF4D4F; }
  &.down { color: #52C41A; }
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.metric-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #F7F8FA;
  border-radius: 8px;
}

.cell-label {
  font-size: 12px;
  color: #8C8C8C;
}

.cell-value {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

/* 团队跟进趋势图表区 */
.trend-section {
  background: #FFFFFF;
  margin: 0 24px 16px;
  padding: 16px;
  border-radius: 8px;
}

.chart-legend {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #595959;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.bar-chart {
  display: flex;
  gap: 8px;
  height: 200px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 45px;
  font-size: 11px;
  color: #8C8C8C;
  text-align: right;
  padding: 5px 0;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  border-bottom: 1px solid #E8E8E8;
  padding-bottom: 5px;
}

.bar-item {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  border-radius: 2px 2px 0 0;
  min-height: 2px;
}

.chart-x-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  font-size: 11px;
  color: #8C8C8C;
}

/* 达人合作漏斗区 */
.funnel-section {
  background: #FFFFFF;
  margin: 0 24px 16px;
  padding: 16px;
  border-radius: 8px;
}

.funnel-block {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.block-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.conversion-content {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}

.conversion-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.conversion-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #F7F8FA;
  border-radius: 8px;
}

.box-label {
  font-size: 13px;
  color: #595959;
  flex: 1;
}

.box-value {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.box-arrow {
  color: #8C8C8C;
  font-size: 16px;
}

.conversion-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rate-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rate-label {
  font-size: 13px;
  color: #595959;
}

.rate-value {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.rate-tag {
  font-size: 12px;
  color: #FA8C16;
  background: #FFF7E6;
  padding: 2px 6px;
  border-radius: 4px;
}

.rate-avg {
  font-size: 12px;
  color: #8C8C8C;
  margin-left: 8px;
}

.funnel-flow {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.flow-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #F7F8FA;
  border-radius: 8px;
}

.flow-label {
  font-size: 13px;
  color: #595959;
}

.flow-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.flow-arrow {
  color: #8C8C8C;
  font-size: 16px;
}

.funnel-rates {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rate-row {
  display: flex;
  gap: 24px;
}

/* 员工业绩分析表格区 */
.performance-section {
  background: #FFFFFF;
  margin: 0 24px;
  padding: 16px;
  border-radius: 8px;
}

.section-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.section-tab {
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #595959;
  transition: all 0.2s;

  &:hover { color: #262626; }
  &.active {
    background: #262626;
    color: #FFFFFF;
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-more {
  color: #1677FF;
  font-size: 13px;
  cursor: pointer;

  &:hover { text-decoration: underline; }
}

.header-right {
  display: flex;
  gap: 8px;
}

.performance-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 13px;
    color: #8C8C8C;
    font-weight: 400;
    border-bottom: 1px solid #F0F0F0;
    cursor: pointer;

    &:hover { color: #1677FF; }
  }

  td {
    padding: 12px 16px;
    font-size: 13px;
    color: #262626;
    border-bottom: 1px solid #F5F5F5;
  }

  tr:hover td {
    background: #FAFAFA;
  }
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #E8E8E8;
  font-size: 12px;
  color: #595959;

  &.top3 {
    background: #FFF2F0;
    color: #FF4D4F;
  }
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.employee-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1677FF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  &.disabled {
    background: #D9D9D9;
    color: #8C8C8C;
  }
}

.employee-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.employee-name {
  font-size: 13px;
  color: #262626;

  &.disabled {
    color: #8C8C8C;
  }
}

.employee-dept {
  font-size: 11px;
  color: #8C8C8C;
}

.pagination {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}
</style>

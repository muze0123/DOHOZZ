<template>
  <div class="content-analysis-page">
    <!-- 顶部导航区 -->
    <div class="top-nav-section">
      <div class="platform-brand">
        <span class="platform-logo">📺</span>
        <span class="platform-name">抖音</span>
      </div>
      <div class="top-actions">
        <el-button size="small" @click="handleExportImage">导出页面为图片</el-button>
        <el-button type="warning" size="small" @click="handleTutorial">一分钟看懂指挥中台</el-button>
        <el-button size="small" @click="handleTutorial">教程</el-button>
      </div>
    </div>

    <!-- 时间栏 -->
    <div class="time-bar">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        size="small"
        style="width: 240px;"
      />
      <div class="quick-time-btns">
        <span v-for="opt in quickTimeOptions" :key="opt.value" class="quick-btn" :class="{ active: activeQuickTime === opt.value }" @click="handleQuickTimeChange(opt.value)">{{ opt.label }}</span>
      </div>
    </div>

    <!-- 筛选控制区 -->
    <div class="filter-bar">
      <div class="attr-filter">
        <span class="filter-label">归属:</span>
        <div class="attr-tabs">
          <span v-for="a in attrOptions" :key="a" class="attr-tab" :class="{ active: activeAttr === a }" @click="activeAttr = a">{{ a }}</span>
        </div>
        <el-tooltip content="归属筛选说明"><span class="help-icon">?</span></el-tooltip>
      </div>
      <div class="shop-filter">
        <span class="filter-label">店铺:</span>
        <el-select v-model="activeShop" size="small" style="width: 140px;">
          <el-option label="所有店铺" value="所有店铺" />
          <el-option label="DOHOZZ旗舰店" value="DOHOZZ旗舰店" />
        </el-select>
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
        <div class="ring-chart-area">
          <div class="ring-chart">
            <div class="ring-segment live" style="--pct: 65%"></div>
          </div>
          <div class="ring-legend">
            <div class="legend-item red"><span class="dot"></span>直播 65%</div>
            <div class="legend-item green"><span class="dot"></span>视频 35%</div>
          </div>
        </div>

        <div class="type-tabs">
          <span class="type-tab" :class="{ active: contentType === 'live' }" @click="contentType = 'live'">直播</span>
          <span class="type-tab" :class="{ active: contentType === 'video' }" @click="contentType = 'video'">视频</span>
        </div>

        <div class="metrics-cards">
          <div class="metric-card">
            <span class="card-label">交付直播数</span>
            <span class="card-value">369</span>
            <span class="card-trend up">环比 ↑412.5%</span>
          </div>
          <div class="metric-card">
            <span class="card-label">出单直播数</span>
            <span class="card-value">1,655</span>
            <span class="card-trend down">环比 ↓-8.97%</span>
          </div>
          <div class="metric-card">
            <span class="card-label">直播成交金额</span>
            <span class="card-value">¥15.43w</span>
            <span class="card-trend down">环比 ↓-18.72%</span>
          </div>
          <div class="metric-card">
            <span class="card-label">直播退款金额</span>
            <span class="card-value">¥2.71w</span>
            <span class="card-trend down">环比 ↓-35.49%</span>
          </div>
          <div class="metric-card">
            <span class="card-label">直播出单达人数</span>
            <span class="card-value">321</span>
            <span class="card-trend up">环比 ↑8.08%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容趋势图表区 -->
    <div class="trend-section">
      <div class="section-header">
        <span class="section-title">内容趋势</span>
        <span class="section-sub">数据范围: 2026/04/01-2026/04/29 | 数据更新时间: 2026-04-29 09:30</span>
        <span class="refresh-icon" @click="handleRefresh">🔄</span>
      </div>

      <div class="type-tabs secondary">
        <span class="type-tab" :class="{ active: contentType === 'live' }" @click="contentType = 'live'">直播</span>
        <span class="type-tab" :class="{ active: contentType === 'video' }" @click="contentType = 'video'">视频</span>
      </div>

      <div class="chart-legend">
        <div class="legend-item red"><span class="line-dot"></span>直播成交金额</div>
        <div class="legend-item green"><span class="line-dot"></span>直播退款金额</div>
        <div class="legend-item blue"><span class="line-dot"></span>出单直播数</div>
        <div class="legend-item yellow"><span class="line-dot"></span>直播出单达人数</div>
      </div>

      <div class="dual-axis-chart">
        <div class="chart-y-axis left">
          <span>8300</span><span>6200</span><span>4100</span><span>2000</span>
        </div>
        <div class="chart-y-axis right">
          <span>100</span><span>75</span><span>50</span><span>25</span><span>10</span>
        </div>
        <div class="chart-canvas">
          <svg class="line-svg" viewBox="0 0 600 180" preserveAspectRatio="none">
            <polyline fill="none" stroke="#FF4D4F" stroke-width="2" points="20,140 50,120 80,130 110,100 140,90 170,85 200,80 230,70 260,75 290,60 320,65 350,50 380,55 410,45 440,40 470,35 500,30 530,25 560,20" />
            <polyline fill="none" stroke="#52C41A" stroke-width="2" points="20,150 50,145 80,150 110,140 140,138 170,135 200,130 230,135 260,130 290,125 320,130 350,125 380,128 410,120 440,125 470,118 500,115 530,120 560,118" />
            <polyline fill="none" stroke="#1677FF" stroke-width="2" stroke-dasharray="4,2" points="20,155 50,150 80,155 110,148 140,145 170,140 200,135 230,140 260,135 290,130 320,135 350,130 380,132 410,128 440,125 470,120 500,115 530,118 560,115" />
            <polyline fill="none" stroke="#FAAD14" stroke-width="2" stroke-dasharray="4,2" points="20,160 50,155 80,160 110,152 140,150 170,148 200,145 230,150 260,145 290,140 320,145 350,140 380,142 410,138 440,135 470,130 500,125 530,128 560,125" />
          </svg>
          <div class="chart-x-axis">
            <span>04/01</span><span>04/08</span><span>04/15</span><span>04/22</span><span>04/29</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 出单内容趋势区 -->
    <div class="order-trend-section">
      <div class="section-header">
        <span class="section-title">出单内容趋势</span>
        <span class="section-sub">数据范围: 2026/04/01-2026/04/29 | 数据更新时间: 2026-04-29 09:30</span>
        <span class="refresh-icon" @click="handleRefresh">🔄</span>
      </div>

      <div class="stacked-chart">
        <div class="chart-y-axis">
          <span>20000</span><span>15000</span><span>10000</span><span>5000</span><span>0</span>
        </div>
        <div class="chart-bars">
          <div class="bar-item" v-for="(val, idx) in stackedChartData" :key="idx" :style="{ height: (val / 20000 * 100) + '%' }">
            <div class="bar-fill live" :style="{ height: (val * 0.7 / val * 100) + '%' }"></div>
            <div class="bar-fill video" :style="{ height: (val * 0.3 / val * 100) + '%' }"></div>
          </div>
        </div>
        <div class="chart-x-axis">
          <span>04/01</span><span>04/08</span><span>04/15</span><span>04/22</span><span>04/29</span>
        </div>
      </div>

      <div class="chart-legend stacked">
        <div class="legend-item red"><span class="bar-dot"></span>直播出单</div>
        <div class="legend-item green"><span class="bar-dot"></span>视频出单</div>
      </div>

      <div class="filter-bar bottom">
        <div class="attr-filter">
          <span class="filter-label">归属:</span>
          <div class="attr-tabs">
            <span v-for="a in attrOptions" :key="a" class="attr-tab" :class="{ active: activeAttr === a }" @click="activeAttr = a">{{ a }}</span>
          </div>
        </div>
        <div class="shop-filter">
          <span class="filter-label">店铺:</span>
          <el-select v-model="activeShop" size="small" style="width: 140px;">
            <el-option label="所有店铺" value="所有店铺" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 出单明细表格区 -->
    <div class="table-section">
      <div class="table-tabs">
        <span class="table-tab" :class="{ active: tableType === 'live' }" @click="tableType = 'live'">出单直播列表</span>
        <span class="table-tab" :class="{ active: tableType === 'video' }" @click="tableType = 'video'">出单视频列表</span>
        <el-button size="small" class="export-btn" @click="handleExportTable">导出</el-button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 60px">排名</th>
            <th>直播间信息</th>
            <th>达人</th>
            <th style="width: 80px">商品链接</th>
            <th style="width: 100px" @click="handleSort('amount')">成交金额 ↕</th>
            <th style="width: 100px" @click="handleSort('refund')">退款金额 ↕</th>
            <th style="width: 100px">预估佣金</th>
            <th style="width: 100px">在线人数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableList" :key="item.id">
            <td>
              <span class="rank-badge" :class="{ top1: item.rank === 1 }">
                {{ item.rank === 1 ? '👑' : item.rank }}
              </span>
            </td>
            <td>
              <div class="live-info">
                <span class="live-title">{{ item.title }}</span>
                <span class="live-time">{{ item.startTime }}</span>
              </div>
            </td>
            <td>
              <div class="creator-info">
                <div class="creator-avatar">{{ item.creatorName.charAt(0) }}</div>
                <div class="creator-detail">
                  <span class="creator-name">{{ item.creatorName }}</span>
                  <span class="creator-fans">{{ item.fans }}粉丝</span>
                </div>
              </div>
            </td>
            <td>
              <span class="product-icon" :class="{ multi: item.productCount > 1 }">
                {{ item.productCount === 1 ? '📦' : '📦×' + item.productCount }}
              </span>
            </td>
            <td>¥{{ item.amount }}</td>
            <td>¥{{ item.refund }}</td>
            <td>¥{{ item.commission }}</td>
            <td>{{ item.onlineCount }}w</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <Pagination
          v-model="pagination"
          :total="totalCount"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

const dateRange = ref(['2026-04-01', '2026-04-29'])
const activeQuickTime = ref('month')
const quickTimeOptions = [
  { label: '近N天', value: 'nday' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '大促', value: 'promo' },
  { label: '自定义', value: 'custom' },
]
const attrOptions = ['全部出单达人', '团队建联达人']
const activeAttr = ref('全部出单达人')
const activeShop = ref('所有店铺')
const contentType = ref('live')
const tableType = ref('live')
const pagination = reactive({
  page: 1,
  pageSize: 10
})
const totalCount = ref(1655)

const stackedChartData = ref([1200, 1800, 900, 2100, 1500, 2000, 800, 1900, 1400, 2200, 1100, 1700, 1300, 1600, 900, 2000, 1500, 1800, 1200, 1600, 1000, 1400, 1700, 1900, 1300, 1500, 1100, 2000, 1400])

const tableList = ref([
  { id: '1', rank: 1, title: '好生活,高品质!', startTime: '2026-04-28 20:30', creatorName: '^山-嶋^', fans: '89.2w', productCount: 1, amount: '4,519.74', refund: '1,269.18', commission: '918.36', onlineCount: '188.39' },
  { id: '2', rank: 2, title: '终于开通了....', startTime: '2026-04-28 15:00', creatorName: '三||嶋^线上', fans: '56.3w', productCount: 1, amount: '2,943.80', refund: '1,035.99', commission: '590.04', onlineCount: '105.57' },
  { id: '3', rank: 3, title: '宠粉福利专场', startTime: '2026-04-28 19:00', creatorName: '小熊美妆', fans: '128.8w', productCount: 3, amount: '2,876.50', refund: '456.20', commission: '580.50', onlineCount: '98.23' },
  { id: '4', rank: 4, title: '春季新品首发', startTime: '2026-04-28 14:00', creatorName: '时尚前线', fans: '45.6w', productCount: 2, amount: '2,543.20', refund: '320.80', commission: '510.20', onlineCount: '87.45' },
  { id: '5', rank: 5, title: '母亲节特惠', startTime: '2026-04-28 18:30', creatorName: '品质生活馆', fans: '38.9w', productCount: 1, amount: '2,198.30', refund: '280.50', commission: '440.30', onlineCount: '76.12' },
])

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

const handleExportTable = () => {
  ElMessage.success('导出成功')
}

const handleSort = (field) => {
  ElMessage.info(`按${field}排序`)
}

const handlePageChange = (val) => {
  pagination.page = val
}

const handlePageSizeChange = (val) => {
  pagination.pageSize = val
}
</script>

<style lang="scss" scoped>
.content-analysis-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
  padding-bottom: 16px;
}

/* 顶部导航区 */
.top-nav-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  padding: 16px 24px;
  margin-bottom: 16px;
}

.platform-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-logo {
  font-size: 24px;
}

.platform-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.top-actions {
  display: flex;
  gap: 8px;
}

/* 时间栏 */
.time-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #FFFFFF;
  padding: 0 24px 16px;
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

/* 筛选控制区 */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #FFFFFF;
  padding: 0 24px 16px;

  &.bottom {
    border-top: 1px solid #F0F0F0;
    padding-top: 16px;
    margin-top: 16px;
  }
}

.attr-filter, .shop-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: #595959;
}

.attr-tabs {
  display: flex;
  gap: 4px;
}

.attr-tab {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #595959;
  transition: all 0.2s;

  &:hover { color: #262626; }
  &.active {
    background: #E6F4FF;
    color: #1677FF;
  }
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
  display: flex;
  align-items: center;
  gap: 24px;
}

.ring-chart-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ring-chart {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(#FF4D4F var(--pct), #52C41A 0);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #FFFFFF;
  }
}

.ring-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #595959;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &.red { background: #FF4D4F; }
    &.green { background: #52C41A; }
    &.blue { background: #1677FF; }
    &.yellow { background: #FAAD14; }
  }

  &.red .dot { background: #FF4D4F; }
  &.green .dot { background: #52C41A; }
  &.blue .dot { background: #1677FF; }
  &.yellow .dot { background: #FAAD14; }
}

.type-tabs {
  display: flex;
  gap: 4px;

  &.secondary {
    margin-bottom: 12px;
  }
}

.type-tab {
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #595959;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:hover { color: #262626; }
  &.active {
    border-color: #FF6B00;
    color: #FF6B00;
  }
}

.metrics-cards {
  display: flex;
  gap: 16px;
  flex: 1;
}

.metric-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #F7F8FA;
  border-radius: 8px;
}

.card-label {
  font-size: 12px;
  color: #8C8C8C;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.card-trend {
  font-size: 12px;

  &.up { color: #FF4D4F; }
  &.down { color: #52C41A; }
}

/* 内容趋势图表区 */
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

  .legend-item {
    .line-dot {
      width: 16px;
      height: 3px;
      border-radius: 2px;
      display: inline-block;
    }

    &.red .line-dot { background: #FF4D4F; }
    &.green .line-dot { background: #52C41A; }
    &.blue .line-dot { background: #1677FF; }
    &.yellow .line-dot { background: #FAAD14; }
  }
}

.dual-axis-chart {
  display: flex;
  gap: 8px;
  height: 180px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 40px;
  font-size: 11px;
  color: #8C8C8C;
  text-align: right;
  padding: 5px 0;

  &.right {
    width: 35px;
  }
}

.chart-canvas {
  flex: 1;
  position: relative;
}

.line-svg {
  width: 100%;
  height: 180px;
}

.chart-x-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  font-size: 11px;
  color: #8C8C8C;
}

/* 出单内容趋势区 */
.order-trend-section {
  background: #FFFFFF;
  margin: 0 24px 16px;
  padding: 16px;
  border-radius: 8px;
}

.stacked-chart {
  display: flex;
  gap: 8px;
  height: 150px;
  margin-bottom: 12px;

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
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  min-height: 2px;
}

.bar-fill {
  width: 100%;

  &.live { background: #FF4D4F; }
  &.video { background: #52C41A; }
}

.chart-legend.stacked {
  display: flex;
  gap: 24px;
  margin-top: 8px;

  .bar-dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    display: inline-block;
  }

  &.red .bar-dot { background: #FF4D4F; }
  &.green .bar-dot { background: #52C41A; }
}

/* 出单明细表格区 */
.table-section {
  background: #FFFFFF;
  margin: 0 24px;
  padding: 16px;
  border-radius: 8px;
}

.table-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.table-tab {
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

.export-btn {
  margin-left: auto;
}

.data-table {
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

  &.top1 {
    background: #FFF2F0;
    color: #FF4D4F;
    font-size: 16px;
  }
}

.live-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.live-title {
  font-size: 13px;
  color: #262626;
}

.live-time {
  font-size: 11px;
  color: #8C8C8C;
}

.creator-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.creator-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1677FF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.creator-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.creator-name {
  font-size: 13px;
  color: #262626;
}

.creator-fans {
  font-size: 11px;
  color: #8C8C8C;
}

.product-icon {
  font-size: 13px;

  &.multi {
    color: #FA8C16;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}
</style>

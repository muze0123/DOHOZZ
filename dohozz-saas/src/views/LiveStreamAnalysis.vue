<template>
  <div class="live-stream-page">
    <!-- 顶部导航与筛选区 -->
    <div class="top-filter-section">
      <div class="top-right-actions">
        <el-button type="warning" size="small" @click="handleTutorial">
          一分钟看懂指挥中台
        </el-button>
        <el-button size="small" @click="handleExportImage">
          导出页面为图片
        </el-button>
      </div>

      <div class="filter-row-main">
        <div class="platform-tabs">
          <span
            v-for="p in platforms"
            :key="p"
            class="platform-tab"
            :class="{ active: activePlatform === p }"
            @click="handlePlatformChange(p)"
          >
            {{ p }}
          </span>
        </div>

        <div class="time-filter">
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
            <span
              v-for="opt in quickTimeOptions"
              :key="opt.value"
              class="quick-btn"
              :class="{ active: activeQuickTime === opt.value }"
              @click="handleQuickTimeChange(opt.value)"
            >
              {{ opt.label }}
            </span>
          </div>
          <el-button size="small" @click="handleTutorial">教程</el-button>
        </div>
      </div>

      <div class="filter-row-sub">
        <div class="attr-filter">
          <span class="filter-label">归属:</span>
          <div class="attr-tabs">
            <span
              v-for="a in attrOptions"
              :key="a"
              class="attr-tab"
              :class="{ active: activeAttr === a }"
              @click="activeAttr = a"
            >
              {{ a }}
            </span>
          </div>
          <el-tooltip content="归属筛选说明" placement="top">
            <span class="help-icon">?</span>
          </el-tooltip>
        </div>
        <div class="shop-filter">
          <span class="filter-label">店铺:</span>
          <el-select v-model="activeShop" size="small" style="width: 140px;">
            <el-option label="所有店铺" value="所有店铺" />
            <el-option label="DOHOZZ旗舰店" value="DOHOZZ旗舰店" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 核心数据概览区 -->
    <div class="overview-section">
      <div class="analysis-tabs">
        <span
          v-for="tab in analysisTabs"
          :key="tab"
          class="analysis-tab"
          :class="{ active: activeAnalysisTab === tab }"
          @click="activeAnalysisTab = tab"
        >
          {{ tab }}
        </span>
      </div>

      <div class="overview-cards">
        <!-- 出单达人数卡片 -->
        <div class="overview-card pink-bg">
          <div class="card-header">
            <span class="card-title">出单达人数</span>
            <el-tooltip content="出单达人数说明" placement="top">
              <span class="help-icon">?</span>
            </el-tooltip>
          </div>
          <div class="card-value">2,097</div>
          <div class="card-trend down">
            <span class="trend-arrow">↓</span>
            环比 -1.46%
          </div>
          <div class="card-extra">
            <div class="extra-item">
              <span class="extra-label">环比上涨达人数</span>
              <span class="extra-value up">1,553</span>
            </div>
            <div class="extra-item">
              <span class="extra-label">环比下降达人数</span>
              <span class="extra-value down">493</span>
            </div>
          </div>
          <div class="mini-ring-chart">
            <div class="ring-bg"></div>
            <div class="ring-progress" style="--pct: 74%"></div>
          </div>
        </div>

        <!-- 首次出单达人数卡片 -->
        <div class="overview-card purple-bg">
          <div class="card-header">
            <span class="card-title">首次出单达人数</span>
            <el-tooltip content="首次出单达人数说明" placement="top">
              <span class="help-icon">?</span>
            </el-tooltip>
          </div>
          <div class="card-value">0</div>
          <div class="card-trend up">
            <span class="trend-arrow">↑</span>
            环比 0%
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势图表分析区 -->
    <div class="trend-section">
      <div class="section-header">
        <span class="section-title">趋势图表分析区</span>
      </div>
      <div class="chart-legend">
        <div class="legend-item gray"><span class="line-dot gray"></span>成交金额</div>
        <div class="legend-item blue"><span class="bar-dot blue"></span>抖音</div>
      </div>
      <div class="mixed-chart">
        <div class="chart-y-axis">
          <span>300w</span>
          <span>200w</span>
          <span>100w</span>
          <span>0</span>
        </div>
        <div class="chart-canvas">
          <div class="bars-container">
            <div class="bar" v-for="n in 29" :key="n" :style="{ height: Math.random() * 100 + '%' }">
              <div class="bar-fill" style="height: 100%; background: #1677FF;"></div>
            </div>
          </div>
          <svg class="line-svg" viewBox="0 0 600 150" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#8C8C8C"
              stroke-width="2"
              points="20,120 50,100 80,110 110,90 140,80 170,70 200,75 230,60 260,65 290,50 320,55 350,40 380,45 410,35 440,40 470,30 500,25 530,20 560,15"
            />
          </svg>
          <div class="chart-x-axis">
            <span>04/01</span>
            <span>04/08</span>
            <span>04/15</span>
            <span>04/22</span>
            <span>04/29</span>
          </div>
        </div>
      </div>

      <div class="trend-filter-bar">
        <div class="attr-filter">
          <span class="filter-label">归属:</span>
          <div class="attr-tabs">
            <span
              v-for="a in attrOptions"
              :key="a"
              class="attr-tab"
              :class="{ active: activeAttr === a }"
              @click="activeAttr = a"
            >
              {{ a }}
            </span>
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

    <!-- 达人分层统计区 -->
    <div class="stratify-section">
      <div class="stratify-tabs">
        <span
          v-for="tab in stratifyTabs"
          :key="tab"
          class="stratify-tab"
          :class="{ active: activeStratifyTab === tab }"
          @click="activeStratifyTab = tab"
        >
          {{ tab }}
        </span>
      </div>

      <!-- 达人成交分层表格 -->
      <div class="stratify-table" v-if="activeStratifyTab === '达人成交分层'">
        <table>
          <thead>
            <tr>
              <th>成交金额层级</th>
              <th>出单达人人数</th>
              <th>累计成交金额</th>
              <th>人均成交金额</th>
              <th>达人佣金</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in salesLevelData" :key="item.level">
              <td>{{ item.level }}</td>
              <td>{{ item.count }}</td>
              <td>¥{{ item.totalAmount }}</td>
              <td>¥{{ item.avgAmount }}</td>
              <td>¥{{ item.commission }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 达人粉丝分层/类型分层 -->
      <div class="stratify-table" v-else-if="activeStratifyTab === '达人粉丝分层'">
        <table>
          <thead>
            <tr>
              <th>粉丝量级</th>
              <th>对应数据</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in fansLevelData" :key="item.level">
              <td>{{ item.level }}</td>
              <td>
                <span :class="{ highlight: item.isHighlight }">{{ item.data }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="stratify-table">
        <table>
          <thead>
            <tr>
              <th>达人类型</th>
              <th>对应数据</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in typeLevelData" :key="item.type">
              <td>{{ item.type }}</td>
              <td>{{ item.data }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 标签切换 -->
      <div class="analysis-tabs secondary">
        <span
          v-for="tab in analysisTabs"
          :key="tab"
          class="analysis-tab"
          :class="{ active: activeAnalysisTab === tab }"
          @click="activeAnalysisTab = tab"
        >
          {{ tab }}
        </span>
      </div>

      <!-- 下部分层图表区 -->
      <div class="fans-chart">
        <div class="fans-chart-inner">
          <div class="fans-bubble" style="left: 10%; top: 20%; width: 30px; height: 30px;">无数据</div>
          <div class="fans-bubble" style="left: 20%; top: 35%; width: 40px; height: 40px;">1.65w</div>
          <div class="fans-bubble" style="left: 35%; top: 45%; width: 45px; height: 45px;">1.97w</div>
          <div class="fans-bubble" style="left: 50%; top: 55%; width: 60px; height: 60px;">14.52w</div>
          <div class="fans-bubble highlight" style="left: 65%; top: 60%; width: 80px; height: 80px;">69.63w</div>
          <div class="fans-bubble" style="left: 75%; top: 70%; width: 55px; height: 55px;">18.08w</div>
          <div class="fans-bubble" style="left: 85%; top: 75%; width: 50px; height: 50px;">1.23w</div>
        </div>
        <div class="fans-axis">
          <span>500w+</span>
          <span>100w</span>
          <span>50w</span>
          <span>10w</span>
          <span>5w</span>
          <span>1w</span>
          <span>5k</span>
          <span>0</span>
        </div>
      </div>
    </div>

    <!-- 出单达人分布区 -->
    <div class="distribution-section">
      <div class="section-header">
        <div class="header-left">
          <span class="section-title">出单达人分布</span>
          <span class="section-sub">数据范围:2026/04/01-2026/04/29 | 数据更新时间:2026-04-27 13:00</span>
        </div>
        <div class="header-right">
          <el-button size="small" @click="handleRefresh">
            <span class="refresh-icon">🔄</span>
          </el-button>
          <span class="view-more">查看全部出单达人 ></span>
        </div>
      </div>

      <div class="dist-tabs">
        <span
          v-for="tab in creatorTypeTabs"
          :key="tab"
          class="dist-tab"
          :class="{ active: activeCreatorType === tab }"
          @click="activeCreatorType = tab"
        >
          {{ tab }}
        </span>
      </div>

      <div class="dist-content">
        <!-- 左侧四象限图 -->
        <div class="quadrant-area">
          <div class="quadrant-filters">
            <div class="filter-item">
              <span class="filter-label">达人分层:</span>
              <el-select v-model="quadrantType" size="small" style="width: 100px;">
                <el-option label="粉丝量级" value="fans" />
                <el-option label="成交金额" value="sales" />
              </el-select>
            </div>
            <div class="filter-item">
              <span class="filter-label">退款金额:</span>
              <el-select v-model="refundLevel" size="small" style="width: 120px;">
                <el-option label="均值:108.89" value="avg" />
                <el-option label="高" value="high" />
                <el-option label="中" value="mid" />
                <el-option label="低" value="low" />
              </el-select>
            </div>
          </div>

          <div class="quadrant-chart">
            <div class="quadrant-grid">
              <div class="quadrant-cell top-left">
                <span class="cell-label">高成交高退款</span>
                <span class="cell-count">140</span>
              </div>
              <div class="quadrant-cell top-right">
                <span class="cell-label">高成交高退款</span>
                <span class="cell-count">27</span>
              </div>
              <div class="quadrant-cell bottom-left active">
                <span class="cell-label">低成交高退款</span>
                <span class="cell-count highlight">39</span>
              </div>
              <div class="quadrant-cell bottom-right">
                <span class="cell-label">低成交低退款</span>
                <span class="cell-count">1,891</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧达人数据表格 -->
        <div class="table-area">
          <div class="table-tabs">
            <span
              v-for="tab in quadrantTabs"
              :key="tab"
              class="quadrant-tab"
              :class="{ active: activeQuadrantTab === tab }"
              @click="activeQuadrantTab = tab"
            >
              {{ tab }}
            </span>
            <el-button size="small" class="export-btn" @click="handleExportTable">
              导出
            </el-button>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>达人类型</th>
                <th>达人</th>
                <th @click="handleSort('fans')">粉丝数 ↕</th>
                <th @click="handleSort('sales')">成交金额 ↕</th>
                <th @click="handleSort('salesMom')">成交金额环比 ↕</th>
                <th @click="handleSort('refund')">退款金额 ↕</th>
                <th @click="handleSort('commission')">达人佣金 ↕</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in creatorList" :key="item.id">
                <td>视频</td>
                <td>
                  <div class="creator-info">
                    <div class="creator-avatar">{{ item.name.charAt(0) }}</div>
                    <div class="creator-detail">
                      <span class="creator-name">{{ item.name }}</span>
                      <span class="creator-id">
                        ID：{{ item.id }}
                        <span class="copy-icon" @click="handleCopyId(item.id)">📋</span>
                      </span>
                    </div>
                  </div>
                </td>
                <td>{{ item.fans }}</td>
                <td>¥{{ item.sales }}</td>
                <td>
                  <span class="trend-text" :class="item.salesMom > 0 ? 'up' : 'down'">
                    {{ item.salesMom > 0 ? '↑' : '↓' }} {{ Math.abs(item.salesMom) }}%
                  </span>
                </td>
                <td>¥{{ item.refund }}</td>
                <td>¥{{ item.commission }}</td>
              </tr>
            </tbody>
          </table>

          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50]"
              :total="totalCount"
              layout="prev, pager, next, sizes"
              @size-change="handlePageSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const platforms = ['全部', '抖音', '快手', '视频号', '小红书']
const activePlatform = ref('抖音')
const attrOptions = ['全部出单达人', '团队建联达人']
const activeAttr = ref('全部出单达人')
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
const analysisTabs = ['达人分析', '团长分析']
const activeAnalysisTab = ref('达人分析')
const stratifyTabs = ['达人成交分层', '达人粉丝分层', '达人类型分层']
const activeStratifyTab = ref('达人成交分层')
const creatorTypeTabs = ['全部达人', '直播达人', '视频达人']
const activeCreatorType = ref('全部达人')
const quadrantTabs = ['低成交高退款', '高成交高退款', '低成交低退款', '高成交低退款']
const activeQuadrantTab = ref('低成交高退款')
const quadrantType = ref('fans')
const refundLevel = ref('avg')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(50)

const salesLevelData = ref([
  { level: '10w+', count: 1, totalAmount: '54.3w', avgAmount: '54.3w', commission: '0' },
  { level: '5w-10w', count: 1, totalAmount: '7.92w', avgAmount: '7.92w', commission: '2.17w' },
  { level: '1w-5w', count: 11, totalAmount: '20.71w', avgAmount: '1.88w', commission: '3.53w' },
  { level: '5k-1w', count: 13, totalAmount: '8.15w', avgAmount: '6,270.3', commission: '1.48w' },
  { level: '2k-5k', count: 38, totalAmount: '11.99w', avgAmount: '3,154.78', commission: '2.54w' },
])

const fansLevelData = ref([
  { level: '500w-1000w', data: '无数据', isHighlight: false },
  { level: '100w-500w', data: '1.65w', isHighlight: false },
  { level: '50w-100w', data: '1.97w', isHighlight: false },
  { level: '10w-50w', data: '14.52w', isHighlight: false },
  { level: '5w-10w', data: '69.63w', isHighlight: true },
  { level: '1w-5w', data: '18.08w / 1.23w', isHighlight: false },
  { level: '5k-1w', data: '13.32w', isHighlight: false },
  { level: '0-5k', data: '2.61w / 4,945.86', isHighlight: false },
])

const typeLevelData = ref([
  { type: '视频达人', data: '1,234' },
  { type: '直播达人', data: '567' },
  { type: '混合达人', data: '296' },
])

const creatorList = ref([
  { id: '001', name: '小李的家', fans: '5,422', sales: '617.18', salesMom: -22.47, refund: '111.4', commission: '130.19' },
  { id: '002', name: '小酒窝的家', fans: '1.41w', sales: '603.7', salesMom: 506.12, refund: '113.9', commission: '107.79' },
  { id: '003', name: '珍珍好物', fans: '1.08w', sales: '586', salesMom: -1.68, refund: '149', commission: '146.5' },
  { id: '004', name: '玖月家', fans: '1.08w', sales: '577.5', salesMom: 840.55, refund: '221.9', commission: '118.95' },
  { id: '005', name: '鑫姐的小屋', fans: '35.7w', sales: '554.3', salesMom: -68.81, refund: '303.7', commission: '129.36' },
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

const handleExportTable = () => {
  ElMessage.success('导出成功')
}

const handleCopyId = (id) => {
  navigator.clipboard.writeText(id).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
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
.live-stream-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
  padding-bottom: 16px;
}

/* 顶部导航与筛选区 */
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
  gap: 24px;
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

/* 核心数据概览区 */
.overview-section {
  padding: 0 24px;
  margin-bottom: 16px;
}

.analysis-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.analysis-tab {
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #595959;
  transition: all 0.2s;
  background: #F5F5F5;

  &:hover { color: #262626; }
  &.active {
    background: #262626;
    color: #FFFFFF;
  }
}

.overview-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.overview-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  position: relative;

  &.pink-bg {
    background: linear-gradient(135deg, #FFF1F0 0%, #FFECE8 100%);
  }
  &.purple-bg {
    background: linear-gradient(135deg, #F9F0FF 0%, #E8D5FF 100%);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  color: #595959;
}

.card-value {
  font-size: 32px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
}

.card-trend {
  font-size: 14px;
  margin-bottom: 12px;

  &.up { color: #FF4D4F; }
  &.down { color: #52C41A; }
}

.trend-arrow {
  margin-right: 2px;
}

.card-extra {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.extra-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.extra-label {
  font-size: 12px;
  color: #8C8C8C;
}

.extra-value {
  font-size: 14px;
  font-weight: 500;

  &.up { color: #FF4D4F; }
  &.down { color: #52C41A; }
}

.mini-ring-chart {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #E8E8E8;
  overflow: hidden;
}

.ring-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #D9D9D9;
}

.ring-progress {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(#FF4D4F var(--pct), transparent var(--pct));
}

/* 趋势图表分析区 */
.trend-section {
  background: #FFFFFF;
  margin: 0 24px 16px;
  padding: 16px;
  border-radius: 8px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
}

.chart-legend {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #595959;

  .line-dot {
    width: 12px;
    height: 3px;
    border-radius: 2px;
    background: #8C8C8C;
  }
  .bar-dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: #1677FF;
  }
}

.mixed-chart {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
  font-size: 11px;
  color: #8C8C8C;
  width: 45px;
  text-align: right;
}

.chart-canvas {
  flex: 1;
  position: relative;
  height: 150px;
}

.bars-container {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 120px;
  border-bottom: 1px solid #E8E8E8;
}

.bar {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  border-radius: 2px 2px 0 0;
}

.line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
}

.chart-x-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  font-size: 11px;
  color: #8C8C8C;
}

.trend-filter-bar {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #F0F0F0;
}

/* 达人分层统计区 */
.stratify-section {
  background: #FFFFFF;
  margin: 0 24px 16px;
  padding: 16px;
  border-radius: 8px;
}

.stratify-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.stratify-tab {
  padding: 6px 16px;
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

.stratify-table {
  margin-bottom: 16px;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid #F0F0F0;
  }

  th {
    font-size: 13px;
    color: #8C8C8C;
    font-weight: 400;
    background: #FAFAFA;
  }

  td {
    font-size: 13px;
    color: #262626;
  }

  .highlight {
    color: #FF6B00;
    font-weight: 600;
  }
}

.analysis-tabs.secondary {
  margin-top: 24px;
  margin-bottom: 24px;
}

/* 粉丝量级图表 */
.fans-chart {
  position: relative;
  height: 200px;
  padding-left: 60px;
}

.fans-chart-inner {
  position: relative;
  height: 100%;
  border-bottom: 1px solid #E8E8E8;
  border-left: 1px solid #E8E8E8;
}

.fans-bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 107, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #595959;
  transform: translate(-50%, -50%);

  &.highlight {
    background: #FF6B00;
    color: #FFFFFF;
    font-weight: 600;
  }
}

.fans-axis {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 55px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  color: #8C8C8C;
  text-align: right;
  padding: 5px 0;
}

/* 出单达人分布区 */
.distribution-section {
  background: #FFFFFF;
  margin: 0 24px;
  padding: 16px;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-sub {
  font-size: 12px;
  color: #8C8C8C;
}

.view-more {
  color: #1677FF;
  font-size: 13px;
  cursor: pointer;

  &:hover { text-decoration: underline; }
}

.refresh-icon {
  font-size: 14px;
}

.dist-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.dist-tab {
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

.dist-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
}

/* 四象限图 */
.quadrant-area {
  .quadrant-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-label {
    font-size: 12px;
    color: #595959;
  }
}

.quadrant-chart {
  .quadrant-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 8px;
    height: 200px;
  }

  .quadrant-cell {
    background: #F7F8FA;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover { background: #F0F0F0; }
    &.active {
      background: #FFF2E8;
    }
  }

  .cell-label {
    font-size: 12px;
    color: #595959;
  }

  .cell-count {
    font-size: 20px;
    font-weight: 600;
    color: #262626;

    &.highlight {
      color: #FF6B00;
    }
  }
}

/* 达人数据表格 */
.table-area {
  .table-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
  }

  .quadrant-tab {
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: #595959;
    transition: all 0.2s;

    &:hover { color: #262626; }
    &.active {
      background: #FF6B00;
      color: #FFFFFF;
    }
  }

  .export-btn {
    margin-left: auto;
  }
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 10px 12px;
    font-size: 12px;
    color: #8C8C8C;
    font-weight: 400;
    border-bottom: 1px solid #F0F0F0;
    cursor: pointer;

    &:hover { color: #1677FF; }
  }

  td {
    padding: 12px;
    font-size: 13px;
    color: #262626;
    border-bottom: 1px solid #F5F5F5;
  }

  tr:hover td {
    background: #FAFAFA;
  }
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

.creator-id {
  font-size: 11px;
  color: #8C8C8C;
  display: flex;
  align-items: center;
  gap: 4px;
}

.copy-icon {
  cursor: pointer;
  &:hover { color: #1677FF; }
}

.trend-text {
  &.up { color: #FF4D4F; }
  &.down { color: #52C41A; }
}

.pagination {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}
</style>

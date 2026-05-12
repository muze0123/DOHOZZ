<template>
  <div class="seeding-data-overview">
    <!-- 顶部筛选区 -->
    <div class="top-filter">
      <div class="left-selects">
        <el-select v-model="filters.departmentId" class="select" placeholder="全部部门" clearable>
          <el-option v-for="d in departmentOptions" :key="d.id" :label="d.name" :value="d.id" />
        </el-select>
        <el-select v-model="filters.mediaId" class="select" placeholder="全部媒介" clearable>
          <el-option v-for="m in mediaOptions" :key="m.id" :label="m.name" :value="m.id" />
        </el-select>
        <el-select v-model="filters.planId" class="select" placeholder="全部计划" clearable>
          <el-option v-for="p in planOptions" :key="p.id" :label="p.name" :value="p.id" />
        </el-select>
      </div>

      <div class="right-time-tabs">
        <div
          v-for="t in timeTabs"
          :key="t.key"
          class="time-tab"
          :class="{ active: filters.timeType === t.key }"
          @click="handleTimeTabClick(t.key)"
        >
          <span>{{ t.label }}</span>
          <span v-if="t.key === 'more'" class="arrow"></span>
        </div>
      </div>
    </div>

    <!-- 数据大盘 -->
    <div class="card board-card">
      <div class="card-head">
        <div class="head-left">
          <div class="title">数据大盘</div>
          <div class="sub">数据更新时间：{{ updateTime }}</div>
          <div class="icon-btn" @click="boardHelpVisible = true" title="说明">?</div>
        </div>
        <div class="head-right">
          <div class="icon-btn" title="全屏" @click="boardFullscreenVisible = true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm0-4h2V7h3V5H5v5zm10 7h-3v2h5v-5h-2v3zm0-12V7h-3v2h5V4h-2z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="board-grid">
        <div
          v-for="k in boardKpis"
          :key="k.key"
          class="kpi"
          :class="{ highlight: activeBoardKpi === k.key }"
          @click="handleKpiClick(k.key)"
        >
          <div class="kpi-top">
            <div class="kpi-name">
              {{ k.label }}
              <span class="qmark" @click.stop="openKpiExplain(k)">?</span>
            </div>
          </div>
          <div class="kpi-value">{{ k.value }}</div>
          <div class="kpi-mom">
            <span class="mom up">环比 ↑ {{ k.mom }}</span>
          </div>
          <div class="kpi-bottom">
            <span class="pill green">平 {{ k.flat }}</span>
            <span class="pill orange">中 {{ k.mid }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势图表 -->
    <div class="card chart-card">
      <div class="card-head">
        <div class="title">趋势图表区域</div>
        <div class="sub">日期：{{ trendRangeText }} <span class="legend-inline"><span class="dot blue"></span>内容数 <span class="dot purple"></span>点赞量</span></div>
      </div>
      <div ref="trendChartEl" class="echart" />
    </div>

    <!-- 占比统计区 -->
    <div class="ratio-row">
      <!-- 平台占比 -->
      <div class="card ratio-card">
        <div class="card-head">
          <div class="head-left">
            <div class="title">平台占比</div>
            <div class="seg">
              <span class="seg-btn" :class="{ active: platformRatioMode === 'content' }" @click="platformRatioMode = 'content'">内容</span>
              <span class="seg-btn" :class="{ active: platformRatioMode === 'view' }" @click="platformRatioMode = 'view'">播放量</span>
            </div>
          </div>
        </div>
        <div class="ratio-body">
          <div ref="platformDonutEl" class="donut" @click="ElMessage.info('平台占比详情 - 待接入')" />
          <el-table :data="platformRankRows" size="small" class="mini-table" @row-click="() => ElMessage.info('平台详情 - 待接入')">
            <el-table-column prop="rank" label="排名" width="60" />
            <el-table-column prop="platform" label="平台" min-width="90" />
            <el-table-column prop="streamerCount" label="达人数" width="80" />
            <el-table-column prop="value" :label="platformRatioMode === 'content' ? '内容数' : '播放量'" width="90" />
            <el-table-column prop="ratio" label="占比" width="80" />
          </el-table>
        </div>
      </div>

      <!-- 预算占比 -->
      <div class="card ratio-card">
        <div class="card-head">
          <div class="head-left">
            <div class="title">预算占比</div>
            <div class="sub">CPM {{ cpmText }} | CPE {{ cpeText }}</div>
          </div>
        </div>
        <div class="ratio-body">
          <div ref="budgetDonutEl" class="donut" @click="ElMessage.info('预算占比详情 - 待接入')" />
          <el-table :data="budgetRankRows" size="small" class="mini-table" @row-click="() => ElMessage.info('项目详情 - 待接入')">
            <el-table-column prop="rank" label="排名" width="60" />
            <el-table-column prop="name" label="项目" min-width="120" />
            <el-table-column prop="amount" label="金额" width="90" />
            <el-table-column prop="ratio" label="占比" width="80" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 商品TOP5 -->
    <div class="card top-card">
      <div class="card-head">
        <div class="head-left">
          <div class="title">商品TOP5</div>
        </div>
        <div class="head-right link" @click="ElMessage.info('商品详情 - 待接入')">查看更多&gt;</div>
      </div>
      <div v-if="productTop5.length === 0" class="empty">
        <EmptyBox />
      </div>
      <el-table v-else :data="productTop5" size="small" class="top-table" @row-click="() => ElMessage.info('商品详情 - 待接入')">
        <el-table-column label="排名" width="70">
          <template #default="{ row }">
            <RankBadge :rank="row.rank" />
          </template>
        </el-table-column>
        <el-table-column label="商品" min-width="220">
          <template #default="{ row }">
            <div class="cell-product">
              <div class="img" />
              <div class="meta">
                <div class="name link" @click.stop="ElMessage.info('商品详情 - 待接入')">{{ row.productName }}</div>
                <div class="sub">ID：{{ row.productId }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="promoterCount" label="推广达人" width="100">
          <template #default="{ row }">
            <span class="link" @click.stop="ElMessage.info('达人详情 - 待接入')">{{ row.promoterCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contentCount" label="内容数" width="90" />
        <el-table-column prop="viewCount" label="播放量/阅读量" width="130" />
        <el-table-column prop="interactionCount" label="互动数" width="90" />
        <el-table-column prop="salesAmount" label="成交金额" width="110" />
        <el-table-column prop="exposureTrend" label="曝光趋势" width="110" />
      </el-table>
    </div>

    <!-- 内容TOP5 + 达人TOP5 -->
    <div class="two-col">
      <div class="card top-card">
        <div class="card-head">
          <div class="title">内容TOP5</div>
          <div class="head-right link" @click="ElMessage.info('内容详情 - 待接入')">查看更多&gt;</div>
        </div>
        <div v-if="contentTop5.length === 0" class="empty">
          <EmptyBox />
        </div>
        <el-table v-else :data="contentTop5" size="small" class="top-table" @row-click="() => ElMessage.info('内容详情 - 待接入')">
          <el-table-column label="排名" width="70">
            <template #default="{ row }"><RankBadge :rank="row.rank" /></template>
          </el-table-column>
          <el-table-column prop="title" label="内容" min-width="220" />
          <el-table-column prop="adCost" label="投放费用" width="110" />
          <el-table-column prop="viewCount" label="播放量" width="90" />
          <el-table-column prop="interactionCount" label="互动数" width="90" />
        </el-table>
      </div>

      <div class="card top-card">
        <div class="card-head">
          <div class="title">达人TOP5</div>
          <div class="head-right link" @click="ElMessage.info('达人详情 - 待接入')">查看更多&gt;</div>
        </div>
        <div v-if="streamerTop5.length === 0" class="empty">
          <EmptyBox />
        </div>
        <el-table v-else :data="streamerTop5" size="small" class="top-table" @row-click="() => ElMessage.info('达人详情 - 待接入')">
          <el-table-column label="排名" width="70">
            <template #default="{ row }"><RankBadge :rank="row.rank" /></template>
          </el-table-column>
          <el-table-column prop="name" label="达人" min-width="220" />
          <el-table-column prop="contentCount" label="内容数" width="90" />
          <el-table-column prop="viewCount" label="播放量" width="90" />
          <el-table-column prop="interactionCount" label="互动数" width="90" />
        </el-table>
      </div>
    </div>

    <!-- 员工TOP5 + 系统通知 -->
    <div class="two-col">
      <div class="card top-card">
        <div class="card-head">
          <div class="title">员工TOP5</div>
          <div class="head-right link" @click="ElMessage.info('员工详情 - 待接入')">查看更多&gt;</div>
        </div>
        <div v-if="employeeTop5.length === 0" class="empty">
          <EmptyBox />
        </div>
        <el-table v-else :data="employeeTop5" size="small" class="top-table" @row-click="() => ElMessage.info('员工详情 - 待接入')">
          <el-table-column label="排名" width="70">
            <template #default="{ row }"><RankBadge :rank="row.rank" /></template>
          </el-table-column>
          <el-table-column prop="name" label="员工" min-width="220" />
          <el-table-column prop="contentCount" label="内容数" width="90" />
          <el-table-column prop="viewCount" label="播放量" width="90" />
          <el-table-column prop="interactionCount" label="互动数" width="90" />
        </el-table>
      </div>

      <div class="card notify-card">
        <div class="card-head">
          <div class="title">系统通知（{{ notifications.length }}）</div>
          <div class="head-right">
            <span class="link" @click="notifySettingVisible = true">设置</span>
            <span class="sep">|</span>
            <span class="link" @click="ElMessage.info('通知详情 - 待接入')">查看更多&gt;</span>
          </div>
        </div>

        <div v-if="notifications.length === 0" class="empty">
          <EmptyBox />
        </div>
        <div v-else class="notify-list">
          <div v-for="n in notifications" :key="n.id" class="notify-item" @click="ElMessage.info('通知详情 - 待接入')">
            <div class="n-title">{{ n.title }}</div>
            <div class="n-time">{{ n.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据大盘说明弹窗 -->
    <el-dialog v-model="boardHelpVisible" title="数据大盘说明" width="520px">
      <div class="dialog-content">
        <div>数据大盘展示内容投放的核心数据指标，包括：</div>
        <ol class="ol">
          <li>内容数：发布的内容总数</li>
          <li>播放量/阅读量：内容的播放或阅读次数</li>
          <li>点赞量：内容获得的点赞数量</li>
          <li>评论数：内容获得的评论数量</li>
          <li>收藏数：内容获得的收藏数量</li>
          <li>转发数：内容获得的转发数量</li>
        </ol>
        <div>环比数据表示与上一周期相比的变化情况：↑表示增长，↓表示下降，-表示持平</div>
      </div>
      <template #footer>
        <el-button type="primary" @click="boardHelpVisible = false">确定</el-button>
      </template>
    </el-dialog>

    <!-- 更多时间选择弹窗 -->
    <el-dialog v-model="moreTimeVisible" title="选择时间范围" width="520px" :close-on-click-modal="true">
      <div class="more-time">
        <div class="row">
          <div class="label">时间维度：</div>
          <div class="btns">
            <el-button size="small" :type="moreTime.mode === 'last90days' ? 'primary' : 'default'" @click="moreTime.mode = 'last90days'">近90天</el-button>
            <el-button size="small" :type="moreTime.mode === 'last180days' ? 'primary' : 'default'" @click="moreTime.mode = 'last180days'">近180天</el-button>
            <el-button size="small" :type="moreTime.mode === 'custom' ? 'primary' : 'default'" @click="moreTime.mode = 'custom'">自定义</el-button>
          </div>
        </div>

        <div class="row" v-if="moreTime.mode === 'custom'">
          <div class="label">自定义时间范围：</div>
          <el-date-picker v-model="moreTime.range" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </div>
      </div>
      <template #footer>
        <el-button @click="moreTimeVisible = false">取消</el-button>
        <el-button type="primary" @click="applyMoreTime">确定</el-button>
      </template>
    </el-dialog>

    <!-- 通知设置弹窗 -->
    <el-dialog v-model="notifySettingVisible" title="通知设置" width="520px" :close-on-click-modal="true">
      <div class="notify-setting">
        <div class="block">
          <div class="block-title">通知类型：</div>
          <el-checkbox-group v-model="notifySetting.types">
            <el-checkbox label="content">内容发布通知</el-checkbox>
            <el-checkbox label="abnormal">数据异常通知</el-checkbox>
            <el-checkbox label="system">系统消息通知</el-checkbox>
            <el-checkbox label="other">其他通知</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="block">
          <div class="block-title">通知方式：</div>
          <el-checkbox-group v-model="notifySetting.channels">
            <el-checkbox label="inapp">站内通知</el-checkbox>
            <el-checkbox label="email">邮件通知</el-checkbox>
            <el-checkbox label="sms">短信通知</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <template #footer>
        <el-button @click="notifySettingVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNotifySetting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 数据大盘全屏弹窗 -->
    <el-dialog v-model="boardFullscreenVisible" title="数据大盘" fullscreen :destroy-on-close="true">
      <div class="fullscreen-board">
        <div class="sub">数据更新时间：{{ updateTime }}</div>
        <div class="board-grid fullscreen">
          <div v-for="k in boardKpis" :key="k.key" class="kpi">
            <div class="kpi-name">{{ k.label }}</div>
            <div class="kpi-value">{{ k.value }}</div>
            <div class="kpi-mom"><span class="mom up">环比 ↑ {{ k.mom }}</span></div>
            <div class="kpi-bottom">
              <span class="pill green">平 {{ k.flat }}</span>
              <span class="pill orange">中 {{ k.mid }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- KPI 指标说明弹窗 -->
    <el-dialog v-model="kpiExplainVisible" :title="kpiExplainTitle" width="520px">
      <div class="dialog-content">
        {{ kpiExplainContent }}
      </div>
      <template #footer>
        <el-button type="primary" @click="kpiExplainVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

// ========== 筛选 ==========
const departmentOptions = ref([
  { id: '', name: '全部部门' },
  { id: 'dept1', name: '部门1' },
  { id: 'dept2', name: '部门2' }
])
const mediaOptions = ref([
  { id: '', name: '全部媒介' },
  { id: 'douyin', name: '抖音' },
  { id: 'xiaohongshu', name: '小红书' }
])
const planOptions = ref([
  { id: '', name: '全部计划' },
  { id: 'plan1', name: '计划1' },
  { id: 'plan2', name: '计划2' }
])

const filters = reactive({
  departmentId: '',
  mediaId: '',
  planId: '',
  timeType: 'last7days',
  startDate: '',
  endDate: ''
})

const timeTabs = [
  { key: 'all', label: '全部' },
  { key: 'yesterday', label: '昨天' },
  { key: 'today', label: '今天' },
  { key: 'last7days', label: '近7天' },
  { key: 'last30days', label: '近30天' },
  { key: 'more', label: '更多' }
]

function handleTimeTabClick(key) {
  if (key === 'more') {
    moreTimeVisible.value = true
    return
  }
  filters.timeType = key
  ElMessage.success('筛选成功')
  refreshAll()
}

watch(
  () => [filters.departmentId, filters.mediaId, filters.planId],
  () => {
    ElMessage.success('筛选成功')
    refreshAll()
  }
)

// ========== 数据大盘（mock，后续替换 API） ==========
const updateTime = ref('2026-04-26 16:20')
const activeBoardKpi = ref('like_count')

const boardKpis = computed(() => {
  // PRD要求：内容数、播放量/阅读量、点赞量、评论数、收藏数、转发数
  return [
    { key: 'content_count', label: '内容数', value: '0', mom: '0%', flat: 0, mid: 0, explain: '内容数：发布的内容总数' },
    { key: 'view_count', label: '播放量/阅读量', value: '26.14亿', mom: '0%', flat: 0, mid: 0, explain: '播放量/阅读量：内容的播放或阅读次数' },
    { key: 'like_count', label: '点赞量', value: '0', mom: '0%', flat: 0, mid: 0, explain: '点赞量：内容获得的点赞数量' },
    { key: 'comment_count', label: '评论数', value: '0', mom: '0%', flat: 0, mid: 0, explain: '评论数：内容获得的评论数量' },
    { key: 'collect_count', label: '收藏数', value: '0', mom: '0%', flat: 0, mid: 0, explain: '收藏数：内容获得的收藏数量' },
    { key: 'share_count', label: '转发数', value: '0', mom: '0%', flat: 0, mid: 0, explain: '转发数：内容获得的转发数量' }
  ]
})

function handleKpiClick(key) {
  activeBoardKpi.value = key
  ElMessage.info('跳转详情 - 待接入')
}

// KPI解释
const kpiExplainVisible = ref(false)
const kpiExplainTitle = ref('')
const kpiExplainContent = ref('')
function openKpiExplain(k) {
  kpiExplainTitle.value = k.label
  kpiExplainContent.value = k.explain
  kpiExplainVisible.value = true
}

// 大盘说明与全屏
const boardHelpVisible = ref(false)
const boardFullscreenVisible = ref(false)

// ========== 趋势图（ECharts） ==========
const trendChartEl = ref(null)
let trendChart = null

const trendDates = ref(['04/21', '04/22', '04/23', '04/24', '04/25'])
const trendContent = ref([0, 0, 0, 0, 0])
const trendLikes = ref([0, 0, 0, 0, 0])
const trendRangeText = computed(() => `${trendDates.value[0]} - ${trendDates.value[trendDates.value.length - 1]}`)

function renderTrendChart() {
  if (!trendChartEl.value) return
  if (!trendChart) trendChart = echarts.init(trendChartEl.value)
  trendChart.setOption({
    grid: { left: 40, right: 20, top: 26, bottom: 36 },
    tooltip: { trigger: 'axis' },
    legend: { show: false },
    xAxis: { type: 'category', data: trendDates.value, axisLine: { lineStyle: { color: '#e8e8e8' } }, axisTick: { show: false }, axisLabel: { color: '#999' } },
    yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f2f2f2' } }, axisLabel: { color: '#999' } },
    series: [
      { name: '内容数', type: 'line', data: trendContent.value, smooth: true, symbol: 'circle', symbolSize: 7, lineStyle: { width: 3, color: '#1677ff' }, itemStyle: { color: '#1677ff' } },
      { name: '点赞量', type: 'line', data: trendLikes.value, smooth: true, symbol: 'circle', symbolSize: 7, lineStyle: { width: 3, color: '#722ed1' }, itemStyle: { color: '#722ed1' } }
    ]
  })
}

// ========== 平台占比（ECharts donut） ==========
const platformRatioMode = ref('content') // content | view
const platformDonutEl = ref(null)
let platformDonut = null

const platformRankRows = computed(() => {
  return [
    { rank: 1, platform: '抖音', streamerCount: 0, value: 0, ratio: '0%' },
    { rank: 2, platform: '小红书', streamerCount: 0, value: 0, ratio: '0%' }
  ]
})

function renderPlatformDonut() {
  if (!platformDonutEl.value) return
  if (!platformDonut) platformDonut = echarts.init(platformDonutEl.value)
  const centerText = platformRatioMode.value === 'content' ? '0 内容量' : '0 播放量'
  platformDonut.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['68%', '86%'],
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 0, name: '小红书', itemStyle: { color: '#1677ff' } },
          { value: 0, name: '抖音', itemStyle: { color: '#fa8c16' } }
        ]
      }
    ],
    graphic: [
      { type: 'text', left: 'center', top: '44%', style: { text: centerText.split(' ')[0], fill: '#111', fontSize: 18, fontWeight: 800, textAlign: 'center' } },
      { type: 'text', left: 'center', top: '58%', style: { text: centerText.split(' ')[1] || '', fill: '#999', fontSize: 12, textAlign: 'center' } }
    ]
  })
}

watch(platformRatioMode, () => {
  renderPlatformDonut()
})

// ========== 预算占比（ECharts donut） ==========
const budgetDonutEl = ref(null)
let budgetDonut = null
const cpmText = computed(() => '-')
const cpeText = computed(() => '-')

const budgetRankRows = computed(() => {
  return [
    { rank: 1, name: '达人合作', amount: 0, ratio: '0%' },
    { rank: 2, name: '内容投流', amount: 0, ratio: '0%' }
  ]
})

function renderBudgetDonut() {
  if (!budgetDonutEl.value) return
  if (!budgetDonut) budgetDonut = echarts.init(budgetDonutEl.value)
  budgetDonut.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['68%', '86%'],
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 0, name: '内容投流', itemStyle: { color: '#1677ff' } },
          { value: 0, name: '达人合作', itemStyle: { color: '#fa8c16' } }
        ]
      }
    ],
    graphic: [
      { type: 'text', left: 'center', top: '44%', style: { text: '0', fill: '#111', fontSize: 18, fontWeight: 800, textAlign: 'center' } },
      { type: 'text', left: 'center', top: '58%', style: { text: '投放费用', fill: '#999', fontSize: 12, textAlign: 'center' } }
    ]
  })
}

// ========== TOP5（按PRD无数据默认空态） ==========
const productTop5 = ref([])
const contentTop5 = ref([])
const streamerTop5 = ref([])
const employeeTop5 = ref([])

// ========== 通知（默认无数据） ==========
const notifications = ref([])
const notifySettingVisible = ref(false)
const notifySetting = reactive({
  types: ['content', 'abnormal', 'system'],
  channels: ['inapp', 'email']
})

function saveNotifySetting() {
  if (notifySetting.types.length === 0) {
    ElMessage.error('通知设置至少选择一种通知类型')
    return
  }
  if (notifySetting.channels.length === 0) {
    ElMessage.error('通知设置至少选择一种通知方式')
    return
  }
  notifySettingVisible.value = false
  ElMessage.success('通知设置保存成功')
}

// ========== 更多时间弹窗 ==========
const moreTimeVisible = ref(false)
const moreTime = reactive({
  mode: 'last90days', // last90days | last180days | custom
  range: []
})

function applyMoreTime() {
  if (moreTime.mode === 'custom') {
    if (!moreTime.range || moreTime.range.length !== 2) {
      ElMessage.error('时间范围无效')
      return
    }
    if (moreTime.range[0] > moreTime.range[1]) {
      ElMessage.error('时间范围无效')
      return
    }
    filters.timeType = 'custom'
    filters.startDate = moreTime.range[0]
    filters.endDate = moreTime.range[1]
  } else {
    filters.timeType = moreTime.mode
  }
  moreTimeVisible.value = false
  ElMessage.success('筛选成功')
  refreshAll()
}

// ========== 渲染生命周期 ==========
function refreshAll() {
  // 这里后续接 API：按 filters 重新拉取各模块数据
  nextTick(() => {
    renderTrendChart()
    renderPlatformDonut()
    renderBudgetDonut()
  })
}

function handleResize() {
  trendChart?.resize()
  platformDonut?.resize()
  budgetDonut?.resize()
}

onMounted(() => {
  refreshAll()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  platformDonut?.dispose()
  budgetDonut?.dispose()
  trendChart = null
  platformDonut = null
  budgetDonut = null
})

// ========== 小组件：空态 + 排名 ==========
const EmptyBox = {
  name: 'EmptyBox',
  template: `
    <div class="empty-box">
      <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
        <path d="M10 22h44v28a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V22z" fill="#F3F4F6" stroke="#E5E7EB"/>
        <path d="M18 18h28l6 4H12l6-4z" fill="#FAFAFA" stroke="#E5E7EB"/>
        <path d="M24 34h16" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round"/>
        <path d="M22 40h20" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
        <circle cx="26" cy="30" r="2" fill="#CBD5E1"/>
        <circle cx="38" cy="30" r="2" fill="#CBD5E1"/>
      </svg>
      <div class="empty-text">暂无数据</div>
    </div>
  `
}

const RankBadge = {
  name: 'RankBadge',
  props: { rank: { type: Number, required: true } },
  computed: {
    cls() {
      if (this.rank === 1) return 'crown gold'
      if (this.rank === 2) return 'crown silver'
      if (this.rank === 3) return 'crown bronze'
      return 'num'
    }
  },
  template: `
    <div class="rank-badge" :class="cls">
      <template v-if="rank <= 3">👑</template>
      <template v-else>{{ rank }}</template>
    </div>
  `
}
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

$bg: #f5f5f5;
$white: #fff;
$border: #e8e8e8;
$text: #111;
$sub: #8c8c8c;
$orange: #fa8c16;
$blue: #1677ff;
$purple: #722ed1;

.seeding-data-overview {
  @extend .page-container;
  background: $bg;
  padding: 16px 0 24px;
}

.top-filter {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: $white;
  border: 1px solid $border;
  border-radius: 12px;
}

.left-selects {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.select {
  width: 160px;
}

.right-time-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
}

.time-tab {
  height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  border: none;
  background: #fafafa;
  color: #666;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: #f4c7a1;
    color: $orange;
    background: #fff7ed;
  }

  &.active {
    background: $white;
    border-color: $orange;
    color: $orange;
    font-weight: 700;
  }
  .arrow {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid currentColor;
    margin-top: 2px;
    opacity: 0.8;
  }
}

.card {
  background: $white;
  border: 1px solid $border;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.title {
  font-weight: 800;
  color: $text;
}
.sub {
  color: $sub;
  font-size: 12px;
}

.icon-btn {
  width: 22px;
  height: 22px;
  border-radius: 8px;
  border: none;
  background: #fafafa;
  color: #999;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: $orange;
    border-color: #f4c7a1;
    background: #fff7ed;
  }
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;

  &.fullscreen {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.kpi {
  border: none;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
    border-color: #f7d6b7;
  }

  &.highlight {
    border-top: 3px solid $purple;
  }
}

.kpi-name {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}
.qmark {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #999;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    color: $orange;
    background: #fff7ed;
  }
}
.kpi-value {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 900;
  color: $text;
}
.kpi-mom {
  margin-top: 6px;
  font-size: 12px;
  .mom.up {
    color: #52c41a;
  }
}
.kpi-bottom {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}
.pill {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: none;
  background: #fafafa;
  &.green {
    color: #52c41a;
  }
  &.orange {
    color: $orange;
  }
}

.legend-inline {
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #666;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  &.blue { background: $blue; }
  &.purple { background: $purple; }
}

.echart {
  height: 280px;
  width: 100%;
}

.ratio-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.ratio-card .card-head {
  margin-bottom: 10px;
}

.seg {
  display: inline-flex;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  background: #fafafa;
}
.seg-btn {
  padding: 4px 10px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  &:hover { color: $orange; }
  &.active {
    background: $orange;
    color: $white;
    font-weight: 700;
  }
}

.ratio-body {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 12px;
  align-items: center;
}

.donut {
  width: 220px;
  height: 200px;
}

.mini-table {
  :deep(.el-table__header th) {
    background: #fafafa;
    color: #666;
  }
}

.top-card .head-right.link {
  color: #999;
  cursor: pointer;
  user-select: none;
  &:hover { color: $orange; }
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.empty {
  padding: 30px 0;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #bfbfbf;
}
.empty-text {
  font-size: 13px;
}

.rank-badge {
  width: 30px;
  height: 22px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  background: #f2f3f5;
  color: #666;
  &.crown {
    background: #fff7ed;
    color: $orange;
  }
  &.gold { background: #fff7ed; color: #d48806; }
  &.silver { background: #f5f5f5; color: #8c8c8c; }
  &.bronze { background: #fff1f0; color: #cf1322; }
}

.cell-product {
  display: flex;
  align-items: center;
  gap: 10px;
  .img {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #f2f3f5;
    border: 1px solid #eee;
    flex-shrink: 0;
  }
  .meta {
    min-width: 0;
  }
  .name {
    font-weight: 700;
    color: #111;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 260px;
  }
  .sub {
    color: #999;
    font-size: 12px;
  }
}

.link {
  color: #999;
  cursor: pointer;
  &:hover { color: $orange; }
}
.sep {
  color: #ddd;
  margin: 0 8px;
}

.notify-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 6px 0 2px;
}
.notify-item {
  padding: 10px 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { border-color: #f7d6b7; background: #fff7ed; }
}
.n-title {
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
}
.n-time {
  color: #999;
  font-size: 12px;
}

.dialog-content {
  color: #333;
  line-height: 1.7;
}
.ol {
  margin: 8px 0 8px 18px;
  color: #333;
}

.more-time .row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.more-time .label {
  width: 110px;
  color: #666;
}

.notify-setting .block + .block {
  margin-top: 16px;
}
.block-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.fullscreen-board {
  padding: 8px 0 0;
}

@media (max-width: 1280px) {
  .board-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .ratio-row { grid-template-columns: 1fr; }
  .two-col { grid-template-columns: 1fr; }
  .ratio-body { grid-template-columns: 1fr; }
  .donut { width: 100%; height: 220px; }
  .select { width: 140px; }
}
</style>


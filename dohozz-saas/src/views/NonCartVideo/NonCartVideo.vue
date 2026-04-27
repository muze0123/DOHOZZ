<template>
  <div class="non-cart-video">
    <!-- 平台 Tab 切换栏 -->
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

    <!-- 全局时间筛选 -->
    <div class="time-filter-bar">
      <!-- 周/月/近N天/自定义 选项卡 -->
    </div>

    <!-- 分析区 -->
    <NonCartVideoStatsSection v-if="statsSectionVisible" />

    <!-- 列表区 -->
    <NonCartVideoFilterSection ref="filterSectionRef" />
    <NonCartVideoListSection
      v-if="listSectionVisible"
      :videos="videoList"
      :loading="listLoading"
      :updateTime="updateTime"
      @export="handleExport"
      @sync="handleSync"
      @add="handleAdd"
      @play="handlePlayVideo"
      @view-detail="handleViewDetail"
      @update:cooperationFee="handleUpdateCooperationFee"
      @update:employee="handleUpdateEmployee"
      @update:blueWords="handleUpdateBlueWords"
      @refresh-data="handleRefreshData"
      @selection-change="handleSelectionChange"
    />

    <!-- 分页 -->
    <div class="pagination-section">...</div>

    <!-- 弹窗 -->
    <AddNonCartVideoDialog v-model="addDialogVisible" />
    <SyncPlatformDialog v-model="syncDialogVisible" />
    <NonCartVideoDetailDialog v-model="detailDialogVisible" :video="currentDetailVideo" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import NonCartVideoStatsSection from './components/NonCartVideoStatsSection.vue'
import NonCartVideoFilterSection from './components/NonCartVideoFilterSection.vue'
import NonCartVideoListSection from './components/NonCartVideoListSection.vue'
import NonCartVideoDetailDialog from './dialogs/NonCartVideoDetailDialog.vue'
import SyncPlatformDialog from './dialogs/SyncPlatformDialog.vue'

// 平台 Tab（默认 TikTok，不含"全部"）
const platformTabs = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('tiktok')

// 时间筛选
const activeTimeKey = ref('7days')
const timeRange = ref([])

// 弹窗状态
const addDialogVisible = ref(false)
const syncDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentDetailVideo = ref(null)

// 组件引用
const filterSectionRef = ref(null)

// 状态
const statsSectionVisible = ref(true)
const listSectionVisible = ref(true)
const listLoading = ref(false)
const updateTime = ref('2026-04-26 01:00:00')

// 视频列表 - Mock 数据
const videoList = ref([
  {
    id: 'NV20260420001',
    title: '夏季清爽护肤教程',
    thumbnail: '',
    platform: 'tiktok',
    publishTime: '2026-04-20 10:30:00',
    influencer: {
      id: 'I001',
      name: '@fashionqueen_k',
      avatar: '',
      followers: '10.2w'
    },
    linkedProduct: { id: 'P001', name: '氨基酸洁面乳', image: '' },
    cooperationFee: '¥2w',
    employee: '张三',
    dataUpdateTime: '2026-04-26 01:00:00',
    stats: {
      plays: 123456, playsDelta: '+100',
      likes: 6543, likesDelta: '+50',
      comments: 321, commentsDelta: '+10',
      shares: 234, sharesDelta: '+5',
      collects: 876, collectsDelta: '+20'
    },
    hasInvestment: true,
    investmentStats: {
      consumeFee: '¥5000',
      plays: 50000, likes: 2500, comments: 120, shares: 80
    },
    blueWords: ['杭州文旅'],
    syncStatus: 'synced',
    syncInfo: {
      platform: 'TikTok',
      user: '张三',
      time: '2026-04-25 15:30:00'
    }
  },
  {
    id: 'NV20260420002',
    title: '周末探店Vlog｜发现宝藏店铺',
    thumbnail: '',
    platform: 'tiktok',
    publishTime: '2026-04-19 14:20:00',
    influencer: {
      id: 'I002',
      name: '@explorer_x',
      avatar: '',
      followers: '5.8w'
    },
    linkedProduct: null,
    cooperationFee: '¥1.5w',
    employee: '李四',
    dataUpdateTime: '2026-04-26 01:00:00',
    stats: {
      plays: 87654, playsDelta: '+200',
      likes: 4321, likesDelta: '+30',
      comments: 210, commentsDelta: '+8',
      shares: 156, sharesDelta: '+3',
      collects: 543, collectsDelta: '+15'
    },
    hasInvestment: false,
    investmentStats: null,
    blueWords: [],
    syncStatus: 'unsynced',
    syncInfo: null
  },
  {
    id: 'NV20260420003',
    title: '新品开箱测评｜美妆好物推荐',
    thumbnail: '',
    platform: 'instagram',
    publishTime: '2026-04-18 09:00:00',
    influencer: {
      id: 'I003',
      name: '@beautylab',
      avatar: '',
      followers: '25.3w'
    },
    linkedProduct: null,
    cooperationFee: '¥3w',
    employee: '王五',
    dataUpdateTime: '2026-04-26 01:00:00',
    stats: {
      plays: 234567, playsDelta: '+350',
      likes: 12345, likesDelta: '+120',
      comments: 567, commentsDelta: '+25',
      shares: 345, sharesDelta: '+12',
      collects: 1234, collectsDelta: '+50'
    },
    hasInvestment: true,
    investmentStats: {
      consumeFee: '¥8000',
      plays: 80000, likes: 5000, comments: 250, shares: 150
    },
    blueWords: ['美妆好物', '开箱测评'],
    syncStatus: 'synced',
    syncInfo: {
      platform: 'Instagram',
      user: '王五',
      time: '2026-04-24 11:20:00'
    }
  }
])

// 选中项
const selectedIds = ref([])

// 事件处理
function handleExport() {
  ElMessage.success('导出成功')
}

function handleSync() {
  syncDialogVisible.value = true
}

function handleAdd() {
  addDialogVisible.value = true
}

function handlePlayVideo(video) {
  ElMessage.info(`播放视频：${video.title}`)
}

function handleViewDetail(video) {
  currentDetailVideo.value = video
  detailDialogVisible.value = true
}

function handleUpdateCooperationFee({ id, value }) {
  const video = videoList.value.find(v => v.id === id)
  if (video) {
    video.cooperationFee = value
    ElMessage.success('合作费用已更新')
  }
}

function handleUpdateEmployee({ id, value }) {
  const video = videoList.value.find(v => v.id === id)
  if (video) {
    video.employee = value
    ElMessage.success('归属员工已更新')
  }
}

function handleUpdateBlueWords({ id, value }) {
  const video = videoList.value.find(v => v.id === id)
  if (video) {
    video.blueWords = value
    ElMessage.success('小蓝词已更新')
  }
}

function handleRefreshData(row) {
  // 模拟刷新操作
  console.log(`刷新互动数据: ${row.id}`)
}

function handleSelectionChange(ids) {
  selectedIds.value = ids
}

// 方法
function handlePlatformChange(platform) {
  activePlatform.value = platform
}

function handleTimeChange(key) {
  activeTimeKey.value = key
}
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

.non-cart-video {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}
</style>

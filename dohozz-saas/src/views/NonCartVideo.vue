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
    <div class="time-filter-section">
      <div class="time-filter-bar">
        <div
          v-for="opt in timeOptions"
          :key="opt.key"
          class="time-filter-item"
          :class="{ active: activeTimeKey === opt.key }"
          @click="handleTimeChange(opt.key)"
        >
          {{ opt.label }}
        </div>
        <div v-if="timeRange.length === 2" class="time-range-display">
          {{ timeRange[0] }} - {{ timeRange[1] }}
        </div>
      </div>
    </div>

    <!-- 视频列表 -->
    <div class="video-list-section">
      <div class="list-header">
        <h2>{{ listTitle }}</h2>
        <div class="list-actions">
          <button class="btn-add" @click="handleAdd">添加视频</button>
          <button class="btn-sync" @click="handleSync">同步平台</button>
          <button class="btn-export" @click="handleExport">导出</button>
        </div>
      </div>
      
      <div class="video-list">
        <div
          v-for="video in videoList"
          :key="video.id"
          class="video-item"
        >
          <div class="video-info">
            <h3>{{ video.title }}</h3>
            <p>平台: {{ video.platform }}</p>
            <p>发布时间: {{ video.publishTime }}</p>
            <p>达人: {{ video.influencer.name }}</p>
            <p>合作费用: {{ video.cooperationFee }}</p>
            <p>归属员工: {{ video.employee }}</p>
          </div>
          <div class="video-actions">
            <button class="btn-play" @click="handlePlayVideo(video)">播放</button>
            <button class="btn-detail" @click="handleViewDetail(video)">详情</button>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination-section">
        <p>共 {{ videoList.length }} 条视频</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 平台 Tab（默认 TikTok，不含"全部"）
const platformTabs = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('tiktok')

// 时间筛选选项
const timeOptions = [
  { key: '7days', label: '近7天' },
  { key: '30days', label: '近30天' },
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'custom', label: '自定义' }
]

// 时间筛选
const activeTimeKey = ref('7days')
const timeRange = ref([])

// 指标切换
const activeMetric = ref('all')
const listTitle = ref('非挂车视频列表-全部视频')

// 状态
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
    influencer: { id: 'I001', name: '@fashionqueen_k', avatar: '', followers: '10.2w' },
    linkedProduct: { id: 'P001', name: '氨基酸洁面乳', image: '' },
    cooperationFee: '¥2w',
    employee: '张三',
    dataUpdateTime: '2026-04-26 01:00:00',
    stats: { plays: 123456, playsDelta: '+100', likes: 6543, likesDelta: '+50', comments: 321, commentsDelta: '+10', shares: 234, sharesDelta: '+5', collects: 876, collectsDelta: '+20' },
    hasInvestment: true,
    investmentStats: { consumeFee: '¥5000', plays: 50000, likes: 2500, comments: 120, shares: 80 },
    blueWords: ['杭州文旅', '护肤推荐'],
    syncStatus: 'synced',
    syncInfo: { platform: 'TikTok', user: '张三', time: '2026-04-25 15:30:00' }
  },
  {
    id: 'NV20260420002',
    title: '粉底液测评推荐',
    thumbnail: '',
    platform: 'instagram',
    publishTime: '2026-04-19 14:00:00',
    influencer: { id: 'I002', name: '@beauty_sarah', avatar: '', followers: '25.8w' },
    linkedProduct: null,
    cooperationFee: '¥1.5w',
    employee: '李四',
    dataUpdateTime: '2026-04-26 01:00:00',
    stats: { plays: 234567, playsDelta: '+200', likes: 12345, likesDelta: '+80', comments: 654, commentsDelta: '+25', shares: 456, sharesDelta: '+15', collects: 1234, collectsDelta: '+50' },
    hasInvestment: false,
    investmentStats: null,
    blueWords: ['粉底测评'],
    syncStatus: 'unsynced',
    syncInfo: null
  },
  {
    id: 'NV20260420003',
    title: '口红色号试色',
    thumbnail: '',
    platform: 'shopee',
    publishTime: '2026-04-18 09:00:00',
    influencer: { id: 'I003', name: '@makeup_artist_m', avatar: '', followers: '8.5w' },
    linkedProduct: null,
    cooperationFee: '',
    employee: '',
    dataUpdateTime: '2026-04-25 01:00:00',
    stats: { plays: 45678, playsDelta: '-50', likes: 2345, likesDelta: '-10', comments: 123, commentsDelta: '-5', shares: 67, sharesDelta: '-2', collects: 345, collectsDelta: '-8' },
    hasInvestment: true,
    investmentStats: { consumeFee: '¥2000', plays: 10000, likes: 500, comments: 30, shares: 15 },
    blueWords: [],
    syncStatus: 'synced',
    syncInfo: { platform: 'Shopee', user: '王五', time: '2026-04-24 10:00:00' }
  }
])

// 选中项
const selectedIds = ref([])

// ---- Utility Functions ----

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}/${m}/${d}`
}

function calculateTimeRange(key) {
  const now = new Date()
  const end = formatDate(now)
  let start
  switch (key) {
    case '7days':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30days':
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'week':
      start = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000)
      break
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    default:
      return []
  }
  return [formatDate(start), end]
}

// ---- Metric Logic ----

function handleMetricChange(metric) {
  activeMetric.value = metric
  listTitle.value = metric === 'all' ? '非挂车视频列表-全部视频' : '非挂车视频列表-新发布视频'
}

// ---- Event Handlers ----

function handleExport() {
  ElMessage.success('导出成功')
}

function handleSync() {
  ElMessage.info('同步平台功能开发中')
}

function handleAdd() {
  ElMessage.info('添加视频功能开发中')
}

function handlePlayVideo(video) {
  ElMessage.info(`播放视频：${video.title}`)
}

function handleViewDetail(video) {
  ElMessage.info(`查看视频详情：${video.title}`)
}

// 方法
function handlePlatformChange(platform) {
  activePlatform.value = platform
  activeTimeKey.value = '7days'
  timeRange.value = calculateTimeRange('7days')
  handleMetricChange('all')
}

function handleTimeChange(key) {
  activeTimeKey.value = key
  if (key !== 'custom') {
    timeRange.value = calculateTimeRange(key)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.non-cart-video {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

.time-filter-section {
  background: #fff;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.time-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-filter-item {
  padding: 4px 12px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    color: #1677ff;
    background: #e6f4ff;
    font-weight: 500;
  }
}

.time-range-display {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}

.video-list-section {
  background: #fff;
  margin-top: 16px;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
    margin: 0;
  }

  .list-actions {
    display: flex;
    gap: 12px;

    button {
      padding: 6px 16px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      background: #fff;
      font-size: 14px;
      color: #595959;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }

      &.btn-add {
        background: #1890ff;
        border-color: #1890ff;
        color: #fff;

        &:hover {
          background: #40a9ff;
        }
      }
    }
  }
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  }

  .video-info {
    flex: 1;

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #262626;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #595959;
      margin: 4px 0;
    }
  }

  .video-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;

    button {
      padding: 6px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      background: #fff;
      font-size: 14px;
      color: #595959;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }

      &.btn-play {
        background: #f6ffed;
        border-color: #b7eb8f;
        color: #52c41a;

        &:hover {
          background: #d9f7be;
        }
      }
    }
  }
}

.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  p {
    font-size: 14px;
    color: #8c8c8c;
    margin: 0;
  }
}
</style>

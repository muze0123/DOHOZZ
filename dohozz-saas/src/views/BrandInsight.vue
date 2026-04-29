<template>
  <div class="brand-insight">
    <!-- Page Header -->
    <div class="brand-header">
      <div class="brand-info">
        <span class="brand-name">品牌名称XXX</span>
        <span class="breadcrumb">一级类目/二级类目/三级类目</span>
      </div>
      <div class="header-actions">
        <el-button link><el-icon><Close /></el-icon></el-button>
        <el-button link><el-icon><QuestionFilled /></el-icon></el-button>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="info-banner">
      <el-tag type="primary" effect="plain" class="assistant-tag">达人营销助手</el-tag>
      <span class="info-text">我们为你洞察到了以下与【品牌名称】品牌相关的全量抖音视频哦~</span>
    </div>

    <!-- Video Type Tabs -->
    <div class="video-type-tabs">
      <div class="tab-item active">自营视频</div>
      <div class="tab-item">
        自来水视频
        <el-icon class="tab-arrow"><ArrowDown /></el-icon>
      </div>
    </div>

    <!-- Statistics Bar -->
    <div class="stats-bar">
      <div class="stat-item" :class="{ active: videoFilter === '带了' }" @click="videoFilter = '带了'">带货视频60</div>
      <div class="stat-item" :class="{ active: videoFilter === '全部' }" @click="videoFilter = '全部'">全部100</div>
      <div class="stat-item" :class="{ active: videoFilter === '种草' }" @click="videoFilter = '种草'">种草视频40</div>
    </div>

    <!-- Search/Filter Bar -->
    <div class="search-bar">
      <div class="search-left">
        <el-select v-model="searchType" style="width: 120px">
          <el-option label="视频标题" value="title" />
          <el-option label="搜索达人" value="influencer" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          :placeholder="searchType === 'title' ? '请输入视频标题' : '请输入达人名称'"
          style="width: 220px"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-button @click="handleSearch">搜索</el-button>
      </div>
      <div class="search-right">
        <el-select v-model="videoCategory" placeholder="视频分类" style="width: 100px" clearable>
          <el-option label="带货" value="带了" />
          <el-option label="种草" value="种草" />
        </el-select>
        <el-select v-model="sortBy" placeholder="最新发布" style="width: 110px" clearable>
          <el-option label="最新发布" value="latest" />
        </el-select>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </div>
    </div>

    <!-- Video Card Grid -->
    <div class="video-grid">
      <div v-for="video in filteredVideos" :key="video.id" class="video-card">
        <!-- 封面 -->
        <div class="video-cover" @click="playVideo(video)">
          <img v-if="video.cover" :src="video.cover" alt="cover" />
          <div v-else class="cover-placeholder">
            <el-icon><VideoPlay /></el-icon>
          </div>
          <div class="play-btn"><el-icon><VideoPlay /></el-icon></div>
        </div>
        <!-- 标题 -->
        <div class="video-title" :title="video.title">{{ video.title }}</div>
        <!-- 达人信息 -->
        <div class="influencer-info">
          <img v-if="video.influencerAvatar" :src="video.influencerAvatar" class="influencer-avatar" />
          <div v-else class="influencer-avatar-placeholder" />
          <div class="influencer-detail">
            <div class="influencer-name">{{ video.influencerName }}</div>
            <div class="influencer-followers">粉丝数：{{ formatNumber(video.followers) }}</div>
          </div>
        </div>
        <!-- 数据统计 -->
        <div class="video-stats">
          <div class="stat-row">
            <span>播放：{{ formatNumber(video.playCount) }}</span>
            <span>互动：{{ formatNumber(video.interactionCount) }}</span>
          </div>
          <div class="stat-row">
            <span>预估成交：￥{{ video.estimatedSalesMin }}~{{ video.estimatedSalesMax }}</span>
          </div>
        </div>
        <!-- 底部 -->
        <div class="video-footer">
          <span class="publish-time">发布于 {{ video.publishTime }}</span>
          <el-tag :type="video.videoType === '带了' ? 'success' : 'warning'" size="small">{{ video.videoType }}</el-tag>
        </div>
      </div>
    </div>
    <div v-if="filteredVideos.length === 0" class="empty-state">
      <el-empty description="暂无数据" />
    </div>

    <!-- Video Play Dialog -->
    <el-dialog v-model="videoDialogVisible" title="视频播放" width="720px">
      <video v-if="currentVideo" :src="currentVideo.url" controls autoplay style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, QuestionFilled, ArrowDown, VideoPlay } from '@element-plus/icons-vue'

const searchType = ref('title')
const searchKeyword = ref('')
const videoFilter = ref('全部')
const videoCategory = ref('')
const sortBy = ref('latest')
const videoDialogVisible = ref(false)
const currentVideo = ref(null)

const mockVideos = [
  { id: 'V001', title: '夏季美妆新品测评，这个夏天让你美出新高度！', cover: '', url: '', influencerName: '美妆达人小王', influencerAvatar: '', followers: 125000, playCount: 123456, interactionCount: 8765, estimatedSalesMin: 250, estimatedSalesMax: 500, publishTime: '2026-03-05 14:42', videoType: '带货' },
  { id: 'V002', title: '这款面膜真的好用吗？真实测评分享', cover: '', url: '', influencerName: '护肤心得', influencerAvatar: '', followers: 89000, playCount: 65432, interactionCount: 4321, estimatedSalesMin: 120, estimatedSalesMax: 300, publishTime: '2026-03-04 10:20', videoType: '种草' },
  { id: 'V003', title: '口红试色合集，热门色号一网打尽', cover: '', url: '', influencerName: '彩妆达人', influencerAvatar: '', followers: 456000, playCount: 234567, interactionCount: 15678, estimatedSalesMin: 500, estimatedSalesMax: 1200, publishTime: '2026-03-03 16:30', videoType: '带货' },
  { id: 'V004', title: '敏感肌救星，这款精华液你值得拥有', cover: '', url: '', influencerName: '护肤博士', influencerAvatar: '', followers: 230000, playCount: 98765, interactionCount: 6543, estimatedSalesMin: 300, estimatedSalesMax: 800, publishTime: '2026-03-02 09:15', videoType: '种草' },
  { id: 'V005', title: '控油洗面奶真实测评，结果出乎意料', cover: '', url: '', influencerName: '护肤达人阿华', influencerAvatar: '', followers: 67000, playCount: 45678, interactionCount: 3210, estimatedSalesMin: 80, estimatedSalesMax: 200, publishTime: '2026-03-01 20:45', videoType: '带货' },
  { id: 'V006', title: '素颜霜对比测评，哪款才是真爱', cover: '', url: '', influencerName: '美妆小助手', influencerAvatar: '', followers: 178000, playCount: 156789, interactionCount: 9876, estimatedSalesMin: 400, estimatedSalesMax: 900, publishTime: '2026-02-28 11:30', videoType: '种草' }
]

const videos = ref([])

const filteredVideos = computed(() => {
  let result = videos.value
  // type filter
  if (videoFilter.value !== '全部') {
    result = result.filter(v => v.videoType === videoFilter.value)
  }
  // category filter
  if (videoCategory.value) {
    result = result.filter(v => v.videoType === videoCategory.value)
  }
  // search
  if (searchKeyword.value) {
    if (searchType.value === 'title') {
      result = result.filter(v => v.title.includes(searchKeyword.value))
    } else {
      result = result.filter(v => v.influencerName.includes(searchKeyword.value))
    }
  }
  return result
})

const formatNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

const handleSearch = () => {
  ElMessage.success('搜索成功')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const playVideo = (video) => {
  currentVideo.value = video
  videoDialogVisible.value = true
}

onMounted(() => {
  videos.value = mockVideos
})
</script>

<style lang="scss" scoped>
.brand-insight {
  padding: 0;
}

.brand-header {
  background: #fff;
  padding: 16px 24px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  .brand-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .brand-name { font-size: 18px; font-weight: 600; color: #262626; }
    .breadcrumb { font-size: 13px; color: #8C8C8C; }
  }
  .header-actions { display: flex; gap: 8px; }
}

.info-banner {
  background: #fff;
  padding: 16px 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  .info-text { font-size: 14px; color: #595959; }
}

.video-type-tabs {
  background: #fff;
  padding: 12px 24px;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  .tab-item {
    padding: 8px 20px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    color: #595959;
    background: #F5F5F5;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;
    &:hover { background: #E8E8E8; }
    &.active { background: #E6F4FF; color: #1677FF; font-weight: 500; }
    .tab-arrow { font-size: 12px; }
  }
}

.stats-bar {
  background: #fff;
  padding: 12px 24px;
  border-radius: 4px;
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  .stat-item {
    font-size: 14px;
    color: #595959;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;
    &:hover { background: #F5F5F5; }
    &.active { color: #1677FF; font-weight: 500; background: #E6F4FF; }
  }
}

.search-bar {
  background: #fff;
  padding: 16px 24px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  .search-left { display: flex; gap: 12px; align-items: center; }
  .search-right { display: flex; gap: 12px; align-items: center; }
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px 23px;
  padding: 4px 0;
}

.video-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  border: none;
  transition: all 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
}

.video-cover {
  position: relative;
  height: 193px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img { width: 100%; height: 100%; object-fit: cover; }
  .cover-placeholder { color: #666; .el-icon { font-size: 40px; } }
  .play-btn {
    position: absolute;
    width: 44px;
    height: 44px;
    background: rgba(255,255,255,0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon { font-size: 20px; color: #333; }
  }
  &:hover .play-btn { background: rgba(255,255,255,1); transform: scale(1.1); }
}

.video-title {
  padding: 12px 16px;
  font-size: 14px;
  color: #262626;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.influencer-info {
  padding: 0 16px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  .influencer-avatar, .influencer-avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #F5F5F5;
    flex-shrink: 0;
  }
  .influencer-name { font-size: 13px; color: #262626; font-weight: 500; }
  .influencer-followers { font-size: 12px; color: #8C8C8C; }
}

.video-stats {
  padding: 0 16px 12px;
  .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #595959;
    line-height: 1.8;
  }
}

.video-footer {
  padding: 8px 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .publish-time { font-size: 12px; color: #8C8C8C; }
}

.empty-state {
  background: #fff;
  border-radius: 4px;
  padding: 60px;
  text-align: center;
}
</style>

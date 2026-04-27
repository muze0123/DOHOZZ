<template>
  <div class="video-card-grid">
    <div v-if="!videos || videos.length === 0" class="empty-state">
      <el-empty description="暂无视频数据" />
    </div>
    <div v-else class="video-grid">
      <div
        v-for="video in videos"
        :key="video.id"
        class="video-card"
        :class="{ selected: selectedVideos.includes(video.id) }"
        @click="$emit('select-video', video.id)"
      >
        <!-- 封面图 + 播放按钮 -->
        <div class="video-cover" @click.stop="$emit('click-play', video)">
          <img v-if="video.coverUrl" :src="video.coverUrl" :alt="video.title" />
          <div v-else class="cover-placeholder">
            <i class="el-icon-video-camera"></i>
          </div>
          <div class="play-btn">
            <i class="el-icon-video-play"></i>
          </div>
        </div>

        <!-- 视频标题 -->
        <div class="video-title">{{ video.title }}</div>

        <!-- 达人信息 -->
        <div class="influencer-info">
          <img
            v-if="video.influencerAvatar"
            :src="video.influencerAvatar"
            class="influencer-avatar"
          />
          <div v-else class="influencer-avatar-placeholder">
            <i class="el-icon-user"></i>
          </div>
          <span class="influencer-name">{{ video.influencerName || '未知达人' }}</span>
          <span class="influencer-followers">{{ formatFollowers(video.followers) }}</span>
        </div>

        <!-- 成交数据摘要 -->
        <div class="video-stats">
          <div class="stat-row">
            <span>成交金额</span>
            <span>{{ video.dealAmount || '--' }}</span>
          </div>
          <div class="stat-row">
            <span>成交订单数</span>
            <span>{{ video.orderCount || '--' }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="video-actions">
          <el-button size="small" @click.stop="$emit('click-detail', video)">详情</el-button>
          <el-button size="small" @click.stop="$emit('click-play', video)">播放</el-button>
          <el-button size="small" @click.stop="$emit('click-extract-text', video)">提取文案</el-button>
          <el-button size="small" type="primary" @click.stop="$emit('click-ai-rewrite', video)">智能仿写</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoCardGrid',
  props: {
    videos: {
      type: Array,
      default: () => []
    },
    selectedVideos: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatFollowers(num) {
      if (!num) return '--'
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w'
      }
      return num
    }
  }
}
</script>

<style scoped>
.video-card-grid {
  width: 100%;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 23px;
  padding: 4px 0;
}

@media (max-width: 1200px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}

.video-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #F0F0F0;
  transition: all 0.2s;
  cursor: pointer;
}

.video-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.video-card.selected {
  border-color: #3370ff;
  box-shadow: 0 0 0 1px #3370ff;
}

.video-cover {
  position: relative;
  height: 193px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  color: #666;
}

.cover-placeholder .el-icon {
  font-size: 40px;
}

.play-btn {
  position: absolute;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.play-btn .el-icon {
  font-size: 20px;
  color: #333;
}

.video-cover:hover .play-btn {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
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
}

.influencer-avatar,
.influencer-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F5F5F5;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.influencer-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.influencer-name {
  font-size: 13px;
  color: #262626;
  font-weight: 500;
}

.influencer-followers {
  font-size: 12px;
  color: #8C8C8C;
}

.video-stats {
  padding: 0 16px 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #595959;
  line-height: 1.8;
}

.video-actions {
  padding: 8px 16px 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.video-actions .el-button {
  margin: 0;
}

.empty-state {
  background: #fff;
  border-radius: 4px;
  padding: 60px;
  text-align: center;
}
</style>

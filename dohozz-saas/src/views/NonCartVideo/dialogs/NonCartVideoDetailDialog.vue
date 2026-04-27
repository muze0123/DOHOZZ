<template>
  <el-dialog
    v-model="dialogVisible"
    title="视频详情"
    width="720px"
    @close="handleClose"
  >
    <div v-if="video" class="detail-content">
      <!-- 视频信息 -->
      <div class="detail-section">
        <div class="section-title">视频信息</div>
        <div class="video-header">
          <div class="video-thumbnail" @click="handlePlay">
            <div class="thumbnail-placeholder">
              <el-icon :size="28"><VideoPlay /></el-icon>
            </div>
          </div>
          <div class="video-header-info">
            <div class="video-title">{{ video.title }}</div>
            <div class="video-meta">
              <span class="platform-tag" :class="video.platform">{{ video.platform.toUpperCase() }}</span>
              <span class="publish-time">发布时间：{{ video.publishTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 达人信息 -->
      <div class="detail-section">
        <div class="section-title">达人信息</div>
        <div class="influencer-row">
          <div class="influencer-avatar">
            <el-icon :size="20"><User /></el-icon>
          </div>
          <div class="influencer-detail">
            <span class="influencer-name">{{ video.influencer?.name }}</span>
            <span class="influencer-followers">{{ video.influencer?.followers }} 粉丝</span>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">达人ID</span>
            <span class="info-value">{{ video.influencer?.id || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 互动数据 -->
      <div class="detail-section">
        <div class="section-title">互动数据</div>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">播放量</span>
            <span class="stat-total">{{ formatNumber(video.stats?.plays) }}</span>
            <span v-if="video.stats?.playsDelta" class="stat-delta" :class="getDeltaClass(video.stats.playsDelta)">
              <el-icon><Top v-if="video.stats.playsDelta > 0" /><Bottom v-else /></el-icon>
              {{ video.stats.playsDelta }}
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">点赞量</span>
            <span class="stat-total">{{ formatNumber(video.stats?.likes) }}</span>
            <span v-if="video.stats?.likesDelta" class="stat-delta" :class="getDeltaClass(video.stats.likesDelta)">
              <el-icon><Top v-if="video.stats.likesDelta > 0" /><Bottom v-else /></el-icon>
              {{ video.stats.likesDelta }}
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">评论数</span>
            <span class="stat-total">{{ formatNumber(video.stats?.comments) }}</span>
            <span v-if="video.stats?.commentsDelta" class="stat-delta" :class="getDeltaClass(video.stats.commentsDelta)">
              <el-icon><Top v-if="video.stats.commentsDelta > 0" /><Bottom v-else /></el-icon>
              {{ video.stats.commentsDelta }}
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">转发数</span>
            <span class="stat-total">{{ formatNumber(video.stats?.shares) }}</span>
            <span v-if="video.stats?.sharesDelta" class="stat-delta" :class="getDeltaClass(video.stats.sharesDelta)">
              <el-icon><Top v-if="video.stats.sharesDelta > 0" /><Bottom v-else /></el-icon>
              {{ video.stats.sharesDelta }}
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">收藏数</span>
            <span class="stat-total">{{ formatNumber(video.stats?.collects) }}</span>
            <span v-if="video.stats?.collectsDelta" class="stat-delta" :class="getDeltaClass(video.stats.collectsDelta)">
              <el-icon><Top v-if="video.stats.collectsDelta > 0" /><Bottom v-else /></el-icon>
              {{ video.stats.collectsDelta }}
            </span>
          </div>
        </div>
      </div>

      <!-- 投放数据 -->
      <div v-if="video.hasInvestment" class="detail-section">
        <div class="section-title">投放数据</div>
        <div class="stats-grid">
          <div class="stat-card invest">
            <span class="stat-label">消耗费用</span>
            <span class="stat-total invest-value">{{ video.investmentStats?.consumeFee || '--' }}</span>
          </div>
          <div class="stat-card invest">
            <span class="stat-label">投放播放量</span>
            <span class="stat-total">{{ formatNumber(video.investmentStats?.plays) }}</span>
          </div>
          <div class="stat-card invest">
            <span class="stat-label">投放点赞量</span>
            <span class="stat-total">{{ formatNumber(video.investmentStats?.likes) }}</span>
          </div>
          <div class="stat-card invest">
            <span class="stat-label">投放评论数</span>
            <span class="stat-total">{{ formatNumber(video.investmentStats?.comments) }}</span>
          </div>
          <div class="stat-card invest">
            <span class="stat-label">投放转发数</span>
            <span class="stat-total">{{ formatNumber(video.investmentStats?.shares) }}</span>
          </div>
        </div>
      </div>
      <div v-else class="detail-section">
        <div class="section-title">投放数据</div>
        <div class="no-data-hint">暂无投放数据</div>
      </div>

      <!-- 基本信息 -->
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">合作费用</span>
            <span class="info-value">{{ video.cooperationFee || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">归属员工</span>
            <span class="info-value">{{ video.employee || '--' }}</span>
          </div>
          <div class="info-item full">
            <span class="info-label">小蓝词</span>
            <span class="info-value">
              <template v-if="video.blueWords && video.blueWords.length > 0">
                <el-tag v-for="(word, idx) in video.blueWords" :key="idx" size="small" class="blue-word-tag">{{ word }}</el-tag>
              </template>
              <span v-else>--</span>
            </span>
          </div>
          <div class="info-item full">
            <span class="info-label">互动数据更新时间</span>
            <span class="info-value">{{ video.dataUpdateTime || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 同步状态 -->
      <div class="detail-section">
        <div class="section-title">投流同步状态</div>
        <div v-if="video.syncStatus === 'synced'" class="sync-info">
          <span class="sync-badge synced">已同步</span>
          <div class="sync-detail">
            <span>平台：{{ video.syncInfo?.platform }}</span>
            <span>同步人：{{ video.syncInfo?.user }}</span>
            <span>同步时间：{{ video.syncInfo?.time }}</span>
          </div>
        </div>
        <div v-else class="sync-info">
          <span class="sync-badge unsynced">未同步</span>
        </div>
      </div>

      <!-- 挂链商品信息 -->
      <div class="detail-section">
        <div class="section-title">挂链商品信息</div>
        <div v-if="video.linkedProduct" class="product-info">
          <div class="product-thumb">
            <el-icon :size="24"><Goods /></el-icon>
          </div>
          <div class="product-detail">
            <div class="product-name">{{ video.linkedProduct.name }}</div>
            <div class="product-id">商品ID：{{ video.linkedProduct.id }}</div>
          </div>
        </div>
        <div v-else class="no-data-hint">暂无挂链商品</div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handlePlay">
          <el-icon><VideoPlay /></el-icon>
          播放
        </el-button>
        <el-button @click="handleOpenDetail">详情</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { VideoPlay, User, Top, Bottom, Goods } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  video: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

function handlePlay() {
  if (props.video?.platform) {
    const platformUrls = {
      tiktok: `https://www.tiktok.com/@${props.video.influencer?.name || 'user'}/video/${props.video.id}`,
      instagram: `https://www.instagram.com/p/${props.video.id}`,
      shopee: `https://shopee.ph/product/${props.video.id}`,
      lazada: `https://www.lazada.com.ph/products/${props.video.id}`
    }
    const url = platformUrls[props.video.platform]
    if (url) {
      window.open(url, '_blank')
    } else {
      ElMessage.warning('暂不支持该平台播放')
    }
  }
}

function handleOpenDetail() {
  window.open(`/non-cart-video/detail/${props.video?.id}`, '_blank')
}

function formatNumber(num) {
  if (num === undefined || num === null) return '0'
  if (typeof num === 'number') {
    return num.toLocaleString()
  }
  return String(num)
}

function getDeltaClass(delta) {
  if (!delta) return ''
  const num = parseInt(delta)
  if (num > 0) return 'delta-up'
  if (num < 0) return 'delta-down'
  return 'delta-flat'
}
</script>

<style scoped lang="scss">
.detail-content {
  padding: 8px 0;
  max-height: 65vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
}

// ---- Video Header ----
.video-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  .video-thumbnail {
    width: 120px;
    height: 80px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #999;
    transition: all 0.2s;
    position: relative;

    &:hover {
      background: #e6f4ff;
      color: #1677ff;
      .thumbnail-placeholder {
        background: rgba(22, 119, 255, 0.06);
      }
    }

    .thumbnail-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .video-header-info {
    flex: 1;
    min-width: 0;

    .video-title {
      font-size: 15px;
      font-weight: 500;
      color: #333;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .video-meta {
      display: flex;
      align-items: center;
      gap: 10px;

      .platform-tag {
        font-size: 10px;
        padding: 2px 8px;
        border-radius: 3px;
        color: #fff;

        &.tiktok { background: #000; }
        &.instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
        &.shopee { background: #ee4d2d; }
        &.lazada { background: #283593; }
      }

      .publish-time {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// ---- Influencer Row ----
.influencer-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  .influencer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e6f4ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1677ff;
    flex-shrink: 0;
  }

  .influencer-detail {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .influencer-name {
      font-size: 14px;
      font-weight: 500;
      color: #1677ff;
    }

    .influencer-followers {
      font-size: 12px;
      color: #999;
    }
  }
}

// ---- Stats Grid ----
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;

  .stat-card {
    background: #fafafa;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: center;

    &.invest {
      background: #fff7e6;
    }

    .stat-label {
      font-size: 11px;
      color: #999;
    }

    .stat-total {
      font-size: 15px;
      font-weight: 600;
      color: #333;

      &.invest-value {
        color: #fa8c16;
      }
    }

    .stat-delta {
      font-size: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 2px;

      .el-icon {
        font-size: 10px;
      }

      &.delta-up {
        color: #00cc66;
      }

      &.delta-down {
        color: #ff4d4f;
      }

      &.delta-flat {
        color: #999;
      }
    }
  }
}

// ---- Info Grid ----
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  &.full {
    grid-column: 1 / -1;
  }

  .info-label {
    font-size: 12px;
    color: #999;
    display: block;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;

    .blue-word-tag {
      font-size: 11px;
    }
  }
}

// ---- Sync Status ----
.sync-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;

  .sync-badge {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 4px;
    flex-shrink: 0;

    &.synced {
      background: #e6fffb;
      color: #00b578;
      border: 1px solid #b7f0d1;
    }

    &.unsynced {
      background: #f5f5f5;
      color: #999;
    }
  }

  .sync-detail {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: #666;
    line-height: 1.6;
  }
}

// ---- No Data Hint ----
.no-data-hint {
  font-size: 13px;
  color: #ccc;
  padding: 8px 0;
}

// ---- Product Info ----
.product-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .product-thumb {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    flex-shrink: 0;
  }

  .product-detail {
    .product-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .product-id {
      font-size: 12px;
      color: #999;
    }
  }
}

// ---- Footer ----
.dialog-footer {
  display: flex;
  gap: 8px;
}
</style>

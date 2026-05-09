<template>
  <div class="video-list-section">
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <el-table
      v-else
      :data="videos"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="视频|发布时间" min-width="200">
        <template #default="{ row }">
          <div class="video-cell">
            <div class="video-thumbnail" @click="handlePlay(row)">
              <div class="thumbnail-placeholder">
                <el-icon><VideoPlay /></el-icon>
              </div>
              <div class="play-overlay">
                <el-icon><VideoPlay /></el-icon>
              </div>
            </div>
            <div class="video-info">
              <div class="video-title" @click="handleViewDetail(row)">{{ row.title }}</div>
              <div class="video-meta">
                <span class="platform-tag" :class="row.platform">{{ row.platform.toUpperCase() }}</span>
                <span class="publish-time">{{ row.publishTime }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="达人" min-width="150">
        <template #default="{ row }">
          <div class="influencer-cell">
            <div class="influencer-avatar">
              <el-icon><User /></el-icon>
            </div>
            <div class="influencer-info">
              <div class="influencer-name">{{ row.influencer.name }}</div>
              <div class="influencer-meta">
                <span class="level-tag">{{ row.influencer.level }}</span>
                <span class="followers">{{ row.influencer.followers }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="授权码" min-width="130">
        <template #default="{ row }">
          <div class="auth-code-cell">
            <span class="auth-code">{{ row.authCode || '--' }}</span>
            <el-icon v-if="row.authCode" class="copy-icon" @click="handleCopy(row.authCode)"><CopyDocument /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="视频状态" min-width="100">
        <template #default="{ row }">
          <span class="status-tag" :class="row.status">
            <span class="status-dot"></span>
            {{ getStatusText(row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="所属BD" min-width="80">
        <template #default="{ row }">
          <span class="bd-name">{{ row.bd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="挂链商品" min-width="120">
        <template #default="{ row }">
          <div class="product-cell">
            <div class="product-thumbnail">
              <el-icon><Goods /></el-icon>
            </div>
            <span class="product-name">{{ row.product.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="播放量" min-width="90" sortable :sort-orders="['ascending', 'descending']">
        <template #default="{ row }">
          <span class="stat-value" @click="$emit('sort', 'plays')">{{ formatNumber(row.stats.plays) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" min-width="80" sortable>
        <template #default="{ row }">
          <span class="stat-value">{{ formatNumber(row.stats.likes) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论数" min-width="80" sortable>
        <template #default="{ row }">
          <span class="stat-value">{{ formatNumber(row.stats.comments) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收藏数" min-width="80" sortable>
        <template #default="{ row }">
          <span class="stat-value">{{ formatNumber(row.stats.collects) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转发数" min-width="80" sortable>
        <template #default="{ row }">
          <span class="stat-value">{{ formatNumber(row.stats.shares) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="互动率" min-width="80" sortable>
        <template #default="{ row }">
          <span class="stat-value">{{ row.stats.interactionRate }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="成交金额" min-width="100" sortable>
        <template #default="{ row }">
          <span class="stat-value deal">¥{{ formatMoney(row.stats.dealAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交订单数" min-width="90" sortable>
        <template #default="{ row }">
          <span class="stat-value">{{ row.stats.dealOrders }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" min-width="90" sortable>
        <template #default="{ row }">
          <span class="stat-value warning">¥{{ formatMoney(row.stats.refundAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预估佣金" min-width="90" sortable>
        <template #default="{ row }">
          <span class="stat-value">¥{{ formatMoney(row.stats.estimatedCommission) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预估GMV" min-width="100" sortable>
        <template #default="{ row }">
          <span class="stat-value deal">¥{{ formatMoney(row.stats.estimatedGMV) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属店铺" min-width="100">
        <template #default="{ row }">
          <span class="shop-name">{{ row.shop }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" min-width="150" sortable>
        <template #default="{ row }">
          <span class="time-value">{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近出单时间" min-width="150" sortable>
        <template #default="{ row }">
          <span class="time-value">{{ row.lastOrderTime || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && videos.length === 0" description="暂无视频数据" />
  </div>
</template>

<script setup>
import { VideoPlay, User, CopyDocument, Goods, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  sortField: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: String,
    default: ''
  },
  selectedIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['play', 'view-detail', 'delete', 'sort', 'selection-change'])

function handlePlay(video) {
  emit('play', video)
}

function handleViewDetail(video) {
  emit('view-detail', video)
}

function handleDelete(video) {
  emit('delete', video)
}

function handleSort(field) {
  emit('sort', field)
}

function handleSelectionChange(selection) {
  emit('selection-change', selection.map(v => v.id))
}

function handleCopy(text) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

function getStatusText(status) {
  const map = {
    'normal': '正常',
    'offline': '下架',
    'abnormal': '异常'
  }
  return map[status] || status
}

function formatNumber(num) {
  if (!num) return '0'
  return num.toLocaleString()
}

function formatMoney(value) {
  if (!value) return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_influencer-page.scss';

.video-list-section {
  padding: 0 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
  gap: 8px;
  font-size: 14px;
}

.video-cell {
  display: flex;
  gap: 12px;
}

.video-thumbnail {
  position: relative;
  width: 64px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;

  .thumbnail-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 20px;
  }

  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .play-overlay {
    opacity: 1;
  }
}

.video-info {
  flex: 1;
  min-width: 0;

  .video-title {
    font-size: 13px;
    color: #1677ff;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }

  .video-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;

    .platform-tag {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 2px;
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

.influencer-cell {
  display: flex;
  gap: 8px;

  .influencer-avatar {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    background: #e6f4ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1677ff;
  }

  .influencer-info {
    flex: 1;
    min-width: 0;

    .influencer-name {
      font-size: 13px;
      color: #1677ff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .influencer-meta {
      display: flex;
      gap: 4px;
      margin-top: 2px;

      .level-tag {
        font-size: 10px;
        padding: 1px 4px;
        background: #fff7e6;
        color: #ff6600;
        border-radius: 2px;
      }

      .followers {
        font-size: 11px;
        color: #999;
      }
    }
  }
}

.auth-code-cell {
  display: flex;
  align-items: center;
  gap: 4px;

  .auth-code {
    font-size: 13px;
    color: #333;
  }

  .copy-icon {
    cursor: pointer;
    color: #999;
    font-size: 14px;

    &:hover {
      color: #1677ff;
    }
  }
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &.normal {
    color: #00cc66;
    .status-dot { background: #00cc66; }
  }

  &.offline {
    color: #ff4d4f;
    .status-dot { background: #ff4d4f; }
  }

  &.abnormal {
    color: #ff4d4f;
    .status-dot { background: #ff4d4f; }
  }
}

.bd-name {
  font-size: 13px;
  color: #333;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .product-thumbnail {
    width: 32px;
    height: 32px;
    background: #f5f5f5;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    flex-shrink: 0;
  }

  .product-name {
    font-size: 12px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80px;
  }
}

.stat-value {
  font-size: 13px;
  color: #333;

  &.deal {
    color: #00cc66;
    font-weight: 500;
  }

  &.warning {
    color: #ff4d4f;
  }
}

.shop-name {
  font-size: 12px;
  color: #666;
}

.time-value {
  font-size: 12px;
  color: #999;
}

.action-btns {
  display: flex;
  gap: 4px;
}

:deep(.el-table) {
  .el-table__header th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
    font-size: 13px;
  }

  .el-table__row {
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>

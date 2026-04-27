<template>
  <div class="video-table-wrapper">
    <el-table
      :data="videos"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      row-class-name="video-table-row"
      border
      stripe
      size="small"
    >
      <!-- 复选框列 -->
      <el-table-column type="selection" width="45" :selectable="checkSelectable" />

      <!-- 视频 | 发布时间 -->
      <el-table-column label="视频 | 发布时间" min-width="240">
        <template #default="{ row }">
          <div class="video-info-cell">
            <img v-if="row.coverUrl" :src="row.coverUrl" class="video-thumb" />
            <div v-else class="video-thumb-placeholder">
              <i class="el-icon-video-camera"></i>
            </div>
            <div class="video-text">
              <div class="video-title" :title="row.title">{{ row.title }}</div>
              <el-tag size="small" type="success" v-if="row.videoType === '带货'">带货</el-tag>
              <el-tag size="small" type="warning" v-else-if="row.videoType === '种草'">种草</el-tag>
              <div class="publish-time">{{ row.publishTime }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 达人 -->
      <el-table-column label="达人" min-width="180">
        <template #default="{ row }">
          <div class="influencer-cell" @click="handleInfluencerClick(row)">
            <img v-if="row.influencerAvatar" :src="row.influencerAvatar" class="influencer-avatar" />
            <div v-else class="influencer-avatar-placeholder"><i class="el-icon-user"></i></div>
            <div class="influencer-detail">
              <div class="influencer-name">{{ row.influencerName || '--' }}</div>
              <div class="influencer-followers">{{ formatNumber(row.followers) }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 挂链商品 -->
      <el-table-column label="挂链商品" width="100">
        <template #default="{ row }">
          <el-tooltip placement="top" :show-after="100">
            <template #content>
              <div class="product-tooltip">
                <img :src="row.productImage" class="tooltip-img" v-if="row.productImage" />
                <div class="tooltip-info">
                  <div>{{ row.productName }}</div>
                  <div>¥{{ row.productPrice || '--' }}</div>
                </div>
              </div>
            </template>
            <img v-if="row.productImage" :src="row.productImage" class="product-thumb" />
            <div v-else class="product-thumb-placeholder">--</div>
          </el-tooltip>
        </template>
      </el-table-column>

      <!-- 归属员工 -->
      <el-table-column label="归属员工" width="120">
        <template #default="{ row }">
          {{ row.assignee || '无所属BD' }}
        </template>
      </el-table-column>

      <!-- 成交数据 -->
      <el-table-column label="成交数据" min-width="200">
        <template #default="{ row }">
          <div class="deal-data">
            <div class="deal-item">
              <span class="deal-label">金额：</span>
              <span>¥{{ formatMoney(row.dealAmount) }}</span>
              <span v-if="row.dealIncrement" :class="row.dealIncrement >= 0 ? 'increment-up' : 'increment-down'">
                / {{ row.dealIncrement >= 0 ? '+' : '' }}{{ formatMoney(row.dealIncrement) }}
              </span>
            </div>
            <div class="deal-item">
              <span class="deal-label">销量：</span>
              <span>{{ row.salesCount || 0 }}</span>
              <span v-if="row.salesIncrement" :class="row.salesIncrement >= 0 ? 'increment-up' : 'increment-down'">
                / {{ row.salesIncrement >= 0 ? '+' : '' }}{{ row.salesIncrement }}
              </span>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 互动数据 -->
      <el-table-column label="互动数据" min-width="180">
        <template #default="{ row }">
          <div class="interaction-data">
            <div class="interaction-time" @click="handleRefreshInteraction(row)">
              播放：{{ formatNumber(row.views) }}
            </div>
            <div class="interaction-more">点赞：{{ formatNumber(row.likes) }} / 评论：{{ formatNumber(row.comments) }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 是否有投流 -->
      <el-table-column label="是否有投流" width="90">
        <template #default="{ row }">
          {{ row.hasAdDelivery ? '是' : '否' }}
        </template>
      </el-table-column>

      <!-- 退款率 -->
      <el-table-column label="退款率" width="90">
        <template #default="{ row }">
          {{ row.refundRate ? row.refundRate.toFixed(2) + '%' : '0.00%' }}
        </template>
      </el-table-column>

      <!-- 30天GMV趋势 -->
      <el-table-column label="30天GMV趋势" width="140">
        <template #default="{ row }">
          <div class="gmv-trend" @click="handleGmvTrendClick(row)">
            <span>¥{{ formatMoney(row.dealAmount) }}</span>
            <span v-if="row.gmvTrend" class="trend-sparkline">{{ row.gmvTrend }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- 投放视频专属列 -->
      <template v-if="showDeliveryColumns">
        <el-table-column label="消耗金额" width="110">
          <template #default="{ row }">¥{{ formatMoney(row.adSpend) }}</template>
        </el-table-column>
        <el-table-column label="投放成交金额" width="110">
          <template #default="{ row }">¥{{ formatMoney(row.adDealAmount) }}</template>
        </el-table-column>
        <el-table-column label="成交订单数" width="90">
          <template #default="{ row }">{{ row.adOrderCount || 0 }}</template>
        </el-table-column>
        <el-table-column label="支付ROI" width="90">
          <template #default="{ row }">{{ row.payRoi ? row.payRoi.toFixed(2) : '--' }}</template>
        </el-table-column>
      </template>

      <!-- 操作 -->
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button link type="primary" size="small" @click="$emit('click-detail', row)">详情</el-button>
            <el-button link type="primary" size="small" @click="$emit('click-play', row)">播放</el-button>
            <el-button link type="primary" size="small" @click="handleDownload(row)">下载</el-button>
            <el-button link type="primary" size="small" @click="$emit('click-extract-text', row)">提取文案</el-button>
            <el-button link type="primary" size="small" @click="$emit('click-ai-rewrite', row)">智能仿写</el-button>
            <el-tag v-if="row.syncStatus === 'synced'" type="success" size="small">已同步</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const props = defineProps({
  videos: { type: Array, default: () => [] },
  selectedVideos: { type: Array, default: () => [] },
  showDeliveryColumns: { type: Boolean, default: false }
})

const emit = defineEmits([
  'update:selectedVideos',
  'click-detail',
  'click-play',
  'click-download',
  'click-extract-text',
  'click-ai-rewrite',
  'click-influencer',
  'click-gmv-trend',
  'refresh-interaction'
])

const checkSelectable = (row) => {
  // 批量投放单次上限100条
  if (props.selectedVideos.length >= 100) {
    ElMessage.warning('单次批量投放最多100条')
    return false
  }
  return true
}

const handleSelectionChange = (selection) => {
  const ids = selection.map(v => v.id)
  emit('update:selectedVideos', ids)
}

const handleInfluencerClick = (row) => {
  emit('click-influencer', row)
}

const handleDownload = (row) => {
  ElMessage.success('下载任务已开始')
  emit('click-download', row)
}

const handleRefreshInteraction = (row) => {
  ElMessage.success('互动数据已更新')
  emit('refresh-interaction', row)
}

const handleGmvTrendClick = (row) => {
  emit('click-gmv-trend', row)
}

const formatNumber = (num) => {
  if (!num) return '--'
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}

const formatMoney = (val) => {
  if (val === undefined || val === null) return '--'
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped>
.video-table-wrapper { width: 100%; }
.video-table-row:hover { background-color: #e6f4ff !important; }
.video-info-cell { display: flex; gap: 8px; align-items: flex-start; padding: 4px 0; }
.video-thumb { width: 80px; height: 60px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
.video-thumb-placeholder { width: 80px; height: 60px; background: #f5f5f5; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #ccc; flex-shrink: 0; }
.video-text { flex: 1; min-width: 0; }
.video-title { font-size: 13px; color: #262626; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
.publish-time { font-size: 12px; color: #999; margin-top: 4px; }
.influencer-cell { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.influencer-avatar, .influencer-avatar-placeholder { width: 32px; height: 32px; border-radius: 50%; background: #f5f5f5; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #999; }
.influencer-name { font-size: 13px; color: #262626; font-weight: 500; }
.influencer-followers { font-size: 12px; color: #999; }
.product-thumb { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; cursor: pointer; }
.product-thumb-placeholder { width: 40px; height: 40px; background: #f5f5f5; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; }
.product-tooltip { display: flex; gap: 8px; padding: 4px 0; }
.tooltip-img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
.tooltip-info { font-size: 12px; line-height: 1.6; }
.deal-data { line-height: 1.8; font-size: 12px; }
.deal-item { display: flex; align-items: center; gap: 2px; flex-wrap: wrap; }
.deal-label { color: #999; }
.increment-up { color: #52c41a; }
.increment-down { color: #ff4d4f; }
.interaction-data { font-size: 12px; line-height: 1.8; cursor: pointer; }
.interaction-more { color: #999; }
.gmv-trend { cursor: pointer; font-size: 12px; }
.action-btns { display: flex; flex-wrap: wrap; gap: 0 8px; align-items: center; }
.action-btns .el-button { margin: 0; }
</style>

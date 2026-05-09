<template>
  <el-dialog
    v-model="dialogVisible"
    title="视频详情"
    width="680px"
    @close="handleClose"
  >
    <div v-if="video" class="detail-content">
      <!-- 基本信息 -->
      <div class="detail-section">
        <div class="section-title">视频信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">视频ID</span>
            <span class="info-value">{{ video.id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">视频标题</span>
            <span class="info-value">{{ video.title }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">平台</span>
            <span class="info-value">
              <span class="platform-tag" :class="video.platform">{{ video.platform.toUpperCase() }}</span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">视频状态</span>
            <span class="info-value status-tag" :class="video.status">
              <span class="status-dot"></span>
              {{ getStatusText(video.status) }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">授权码</span>
            <span class="info-value">{{ video.authCode || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发布时间</span>
            <span class="info-value">{{ video.publishTime }}</span>
          </div>
        </div>
      </div>

      <!-- 达人信息 -->
      <div class="detail-section">
        <div class="section-title">达人信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">达人ID</span>
            <span class="info-value">{{ video.influencer.id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">达人名称</span>
            <span class="info-value blue">{{ video.influencer.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">达人等级</span>
            <span class="info-value">{{ video.influencer.level }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">粉丝数</span>
            <span class="info-value">{{ video.influencer.followers }}</span>
          </div>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="detail-section">
        <div class="section-title">商品信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">商品ID</span>
            <span class="info-value">{{ video.product.id }}</span>
          </div>
          <div class="info-item full">
            <span class="info-label">商品名称</span>
            <span class="info-value">{{ video.product.name }}</span>
          </div>
        </div>
      </div>

      <!-- 履约数据 -->
      <div class="detail-section">
        <div class="section-title">履约数据</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">播放量</span>
            <span class="info-value">{{ formatNumber(video.stats.plays) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">点赞数</span>
            <span class="info-value">{{ formatNumber(video.stats.likes) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">评论数</span>
            <span class="info-value">{{ formatNumber(video.stats.comments) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">收藏数</span>
            <span class="info-value">{{ formatNumber(video.stats.collects) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">转发数</span>
            <span class="info-value">{{ formatNumber(video.stats.shares) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">互动率</span>
            <span class="info-value">{{ video.stats.interactionRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 交易数据 -->
      <div class="detail-section">
        <div class="section-title">交易数据</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">成交金额</span>
            <span class="info-value deal">¥{{ formatMoney(video.stats.dealAmount) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">成交订单数</span>
            <span class="info-value">{{ video.stats.dealOrders }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">退款金额</span>
            <span class="info-value warning">¥{{ formatMoney(video.stats.refundAmount) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预估佣金</span>
            <span class="info-value">¥{{ formatMoney(video.stats.estimatedCommission) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预估GMV</span>
            <span class="info-value deal">¥{{ formatMoney(video.stats.estimatedGMV) }}</span>
          </div>
        </div>
      </div>

      <!-- 所属信息 -->
      <div class="detail-section">
        <div class="section-title">所属信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">所属BD</span>
            <span class="info-value">{{ video.bd }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所属店铺</span>
            <span class="info-value">{{ video.shop }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">添加时间</span>
            <span class="info-value">{{ video.createTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">最近出单时间</span>
            <span class="info-value">{{ video.lastOrderTime || '--' }}</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

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

function getStatusText(status) {
  const map = { 'normal': '正常', 'offline': '下架', 'abnormal': '异常' }
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

<style scoped>
.detail-content {
  padding: 8px 0;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 20px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
}

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
    font-size: 13px;
    color: #999;
    display: block;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 14px;
    color: #333;

    &.blue {
      color: #1677ff;
    }

    &.deal {
      color: #00cc66;
      font-weight: 500;
    }

    &.warning {
      color: #ff4d4f;
    }
  }
}

.platform-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 2px;
  color: #fff;

  &.tiktok { background: #000; }
  &.instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
  &.shopee { background: #ee4d2d; }
  &.lazada { background: #283593; }
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &.normal { color: #00cc66; .status-dot { background: #00cc66; } }
  &.offline { color: #ff4d4f; .status-dot { background: #ff4d4f; } }
  &.abnormal { color: #ff4d4f; .status-dot { background: #ff4d4f; } }
}
</style>

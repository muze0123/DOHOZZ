<template>
  <el-dialog v-model="dialogVisible" title="团长详情" width="640px" @close="handleClose">
    <div v-if="leader" class="detail-content">
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">团长ID</span><span class="info-value">{{ leader.id }}</span></div>
          <div class="info-item"><span class="info-label">团长名称</span><span class="info-value blue">{{ leader.name }}</span></div>
          <div class="info-item"><span class="info-label">等级</span><span class="info-value">{{ leader.level }}</span></div>
          <div class="info-item"><span class="info-label">带货类目</span><span class="info-value">{{ leader.category }}</span></div>
          <div class="info-item full"><span class="info-label">主页链接</span><span class="info-value url">{{ leader.homeUrl }}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">合作信息</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">合作BD</span><span class="info-value">{{ leader.bdList?.join('、') }}</span></div>
          <div class="info-item"><span class="info-label">归属模式</span><span class="info-value mode-tag" :class="leader.mode">{{ getModeText(leader.mode) }}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">业绩数据</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">出单活动数</span><span class="info-value">{{ leader.activityCount }}</span></div>
          <div class="info-item"><span class="info-label">成交金额</span><span class="info-value deal">¥{{ formatMoney(leader.dealAmount) }}</span></div>
          <div class="info-item"><span class="info-label">结算金额</span><span class="info-value">¥{{ formatMoney(leader.settleAmount) }}</span></div>
          <div class="info-item"><span class="info-label">退款金额</span><span class="info-value warning">¥{{ formatMoney(leader.refundAmount) }}</span></div>
          <div class="info-item"><span class="info-label">结算服务费</span><span class="info-value">¥{{ formatMoney(leader.serviceFee) }}</span></div>
          <div class="info-item"><span class="info-label">出单达人数</span><span class="info-value">{{ leader.influencerCount }}</span></div>
          <div class="info-item"><span class="info-label">出单商品数</span><span class="info-value">{{ leader.productCount }}</span></div>
          <div class="info-item"><span class="info-label">出单视频数</span><span class="info-value">{{ leader.videoCount }}</span></div>
          <div class="info-item"><span class="info-label">出单直播数</span><span class="info-value">{{ leader.liveCount }}</span></div>
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
  leader: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])
const dialogVisible = computed({ get: () => props.modelValue, set: (val) => emit('update:modelValue', val) })

function handleClose() { dialogVisible.value = false }

function getModeText(mode) {
  return { leader: '团长归属', activity: '活动归属', influencer: '达人归属', product: '商品归属', unassigned: '未归属' }[mode] || mode
}

function formatMoney(v) { return v ? v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '0.00' }
</script>

<style scoped>
.detail-content { padding: 8px 0; max-height: 60vh; overflow-y: auto; }
.detail-section { margin-bottom: 20px; .section-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; } }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.info-item { &.full { grid-column: 1 / -1; } .info-label { font-size: 13px; color: #999; display: block; margin-bottom: 4px; } .info-value { font-size: 14px; color: #333; &.blue { color: #1677ff; } &.deal { color: #00cc66; font-weight: 500; } &.warning { color: #ff4d4f; } &.url { word-break: break-all; font-size: 12px; } } }
.mode-tag { font-size: 11px; padding: 2px 6px; border-radius: 2px; &.leader { background: #e6f4ff; color: #1677ff; } &.activity { background: #fff7e6; color: #ff6600; } &.influencer { background: #f9f0ff; color: #722ed1; } &.product { background: #e6fffb; color: #00856a; } &.unassigned { background: #f5f5f5; color: #999; } }
</style>

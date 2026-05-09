<template>
  <el-dialog v-model="dialogVisible" title="合作详情" width="640px" @close="handleClose">
    <div v-if="cooperation" class="detail-content">
      <div class="detail-section">
        <div class="section-title">合作信息</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">合作单ID</span><span class="info-value">{{ cooperation.cooperationId }}</span></div>
          <div class="info-item"><span class="info-label">团长名称</span><span class="info-value blue">{{ cooperation.leaderName }}</span></div>
          <div class="info-item"><span class="info-label">合作开始时间</span><span class="info-value">{{ cooperation.startTime }}</span></div>
          <div class="info-item"><span class="info-label">合作结束时间</span><span class="info-value">{{ cooperation.endTime || '-' }}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">归属信息</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">合作BD</span><span class="info-value">{{ cooperation.bdName }}</span></div>
          <div class="info-item"><span class="info-label">归属模式</span><span class="info-value mode-tag" :class="cooperation.mode">{{ getModeText(cooperation.mode) }}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">业绩数据</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">成交金额</span><span class="info-value deal">¥{{ formatMoney(cooperation.dealAmount) }}</span></div>
          <div class="info-item"><span class="info-label">出单达人数</span><span class="info-value">{{ cooperation.influencerCount }}</span></div>
          <div class="info-item"><span class="info-label">出单链接数</span><span class="info-value">{{ cooperation.linkCount }}</span></div>
          <div class="info-item"><span class="info-label">状态</span><span class="info-value">
            <span class="status-dot" :class="cooperation.status"></span>
            {{ getStatusText(cooperation.status) }}
          </span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">其他信息</div>
        <div class="info-grid">
          <div class="info-item full"><span class="info-label">创建时间</span><span class="info-value">{{ cooperation.createTime }}</span></div>
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
  cooperation: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

function getModeText(mode) {
  return { leader: '团长归属', activity: '活动归属', influencer: '达人归属', product: '商品归属', unassigned: '未归属' }[mode] || mode
}

function getStatusText(status) {
  return { pending: '未开始', active: '进行中', ended: '已结束', cancelled: '已取消' }[status] || status
}

function formatMoney(v) {
  return v ? v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '0.00'
}
</script>

<style scoped>
.detail-content { padding: 8px 0; max-height: 60vh; overflow-y: auto; }
.detail-section { margin-bottom: 20px; }
.section-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.info-item {
  &.full { grid-column: 1 / -1; }
  .info-label { font-size: 13px; color: #999; display: block; margin-bottom: 4px; }
  .info-value { font-size: 14px; color: #333;
    &.blue { color: #1677ff; }
    &.deal { color: #00cc66; font-weight: 500; }
  }
}
.mode-tag { font-size: 11px; padding: 2px 6px; border-radius: 2px;
  &.leader { background: #e6f4ff; color: #1677ff; }
  &.activity { background: #fff7e6; color: #ff6600; }
  &.influencer { background: #f9f0ff; color: #722ed1; }
  &.product { background: #e6fffb; color: #00856a; }
  &.unassigned { background: #f5f5f5; color: #999; }
}
.status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; vertical-align: middle; margin-right: 4px;
  &.pending { background: #999; }
  &.active { background: #52c41a; }
  &.ended { background: #ff4d4f; }
  &.cancelled { background: #999; }
}
</style>

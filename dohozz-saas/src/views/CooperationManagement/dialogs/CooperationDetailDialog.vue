<template>
  <el-dialog
    v-model="dialogVisible"
    title="合作单详情"
    width="640px"
    @close="handleClose"
  >
    <div v-if="cooperation" class="detail-content">
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">合作ID</span><span class="info-value">{{ cooperation.id }}</span></div>
          <div class="info-item"><span class="info-label">状态</span><span class="info-value status-tag" :class="cooperation.status">{{ getStatusText(cooperation.status) }}</span></div>
          <div class="info-item"><span class="info-label">平台</span><span class="info-value">{{ cooperation.platform.toUpperCase() }}</span></div>
          <div class="info-item"><span class="info-label">合作模式</span><span class="info-value">{{ getModeText(cooperation.mode) }}</span></div>
          <div class="info-item"><span class="info-label">交付时间</span><span class="info-value">{{ cooperation.deliveryStartTime }} 至 {{ cooperation.deliveryEndTime || '--' }}</span></div>
          <div class="info-item"><span class="info-label">创建类型</span><span class="info-value">{{ getCreateTypeText(cooperation.createType) }}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">达人信息</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">达人ID</span><span class="info-value">{{ cooperation.influencer.id }}</span></div>
          <div class="info-item full"><span class="info-label">达人名称</span><span class="info-value blue">{{ cooperation.influencer.name }}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">结算信息</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">成交金额</span><span class="info-value deal">¥{{ formatMoney(cooperation.dealAmount) }}</span></div>
          <div class="info-item"><span class="info-label">结算金额</span><span class="info-value">¥{{ formatMoney(cooperation.settleAmount) }}</span></div>
          <div class="info-item"><span class="info-label">坑位费</span><span class="info-value">¥{{ formatMoney(cooperation.slotFee) }}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">所属信息</div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">所属BD</span><span class="info-value">{{ cooperation.bd }}</span></div>
          <div class="info-item"><span class="info-label">所属店铺</span><span class="info-value">{{ cooperation.shop }}</span></div>
          <div class="info-item"><span class="info-label">创建时间</span><span class="info-value">{{ cooperation.createTime }}</span></div>
          <div class="info-item full"><span class="info-label">备注</span><span class="info-value">{{ cooperation.note || '--' }}</span></div>
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
const dialogVisible = computed({ get: () => props.modelValue, set: (val) => emit('update:modelValue', val) })

function handleClose() { dialogVisible.value = false }

function getStatusText(s) { return { pending: '待交付', delivering: '交付中', finished: '已结束', cancelled: '已取消' }[s] || s }
function getModeText(m) { return { commission: '佣金模式', slot_fee: '坑位费模式', mixed: '混合模式' }[m] || m }
function getCreateTypeText(t) { return { manual: '手动创建', auto: '系统自动创建' }[t] || t }
function formatMoney(v) { return v ? v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '0.00' }
</script>

<style scoped>
.detail-content { padding: 8px 0; max-height: 60vh; overflow-y: auto; }
.detail-section { margin-bottom: 20px; .section-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; } }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.info-item { &.full { grid-column: 1 / -1; } .info-label { font-size: 13px; color: #999; display: block; margin-bottom: 4px; } .info-value { font-size: 14px; color: #333; &.blue { color: #1677ff; } &.deal { color: #00cc66; font-weight: 500; } } }
.status-tag { display: inline-flex; align-items: center; gap: 4px; &.pending { color: #ff6600; } &.delivering { color: #00cc66; } &.finished { color: #999; } &.cancelled { color: #ff4d4f; } }
</style>

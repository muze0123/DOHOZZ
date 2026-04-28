<template>
  <el-dialog
    v-model="dialogVisible"
    title="样品详情"
    width="640px"
    @close="handleClose"
  >
    <div v-if="sample" class="detail-content">
      <!-- 基本信息 -->
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">样品ID</span>
            <span class="info-value">{{ sample.id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">状态</span>
            <span class="info-value status" :class="getStatusClass(sample.status)">
              {{ getStatusText(sample.status) }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">平台</span>
            <span class="info-value">{{ sample.platform.toUpperCase() }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">是否重复</span>
            <span class="info-value">{{ sample.isRepeat ? '是' : '否' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">样品来源</span>
            <span class="info-value">{{ getSourceText(sample.source) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">创建时间</span>
            <span class="info-value">{{ sample.createTime }}</span>
          </div>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="detail-section">
        <div class="section-title">商品信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">商品ID</span>
            <span class="info-value">{{ sample.product.id }}</span>
          </div>
          <div class="info-item full">
            <span class="info-label">商品名称</span>
            <span class="info-value">{{ sample.product.name }}</span>
          </div>
        </div>
      </div>

      <!-- 达人信息 -->
      <div class="detail-section">
        <div class="section-title">达人信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">达人ID</span>
            <span class="info-value">{{ sample.influencer.id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">达人名称</span>
            <span class="info-value blue">{{ sample.influencer.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">等级</span>
            <span class="info-value">{{ sample.influencer.level }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">粉丝量</span>
            <span class="info-value">{{ sample.influencer.followers }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">30天订单</span>
            <span class="info-value">{{ sample.influencer.orders30d }}</span>
          </div>
        </div>
      </div>

      <!-- 收货人信息 -->
      <div class="detail-section">
        <div class="section-title">收货人信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">收货人</span>
            <span class="info-value">{{ sample.recipient.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系电话</span>
            <span class="info-value">{{ sample.recipient.phone }}</span>
          </div>
          <div class="info-item full">
            <span class="info-label">收货地址</span>
            <span class="info-value">{{ sample.recipient.address }}</span>
          </div>
        </div>
      </div>

      <!-- 物流信息 -->
      <div v-if="sample.logisticsNo" class="detail-section">
        <div class="section-title">物流信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">物流公司</span>
            <span class="info-value">{{ sample.logisticsCompany }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">物流单号</span>
            <span class="info-value blue">{{ sample.logisticsNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发货时间</span>
            <span class="info-value">{{ sample.shipTime }}</span>
          </div>
        </div>
      </div>

      <!-- 备注 -->
      <div v-if="sample.note" class="detail-section">
        <div class="section-title">备注</div>
        <div class="note-content">{{ sample.note }}</div>
      </div>

      <!-- 操作信息 -->
      <div class="detail-section">
        <div class="section-title">操作信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">BD</span>
            <span class="info-value">{{ sample.bd }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">创建人</span>
            <span class="info-value">{{ sample.creator }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">更新时间</span>
            <span class="info-value">{{ sample.updateTime }}</span>
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
  sample: {
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
  const map = {
    'pending_approve': '待审批',
    'pending_ship': '待发货',
    'shipped': '已发货',
    'signed': '已签收',
    'rejected': '已拒绝'
  }
  return map[status] || status
}

function getStatusClass(status) {
  const map = {
    'pending_approve': 'status-warning',
    'pending_ship': 'status-info',
    'shipped': 'status-primary',
    'signed': 'status-success',
    'rejected': 'status-danger'
  }
  return map[status] || ''
}

function getSourceText(source) {
  const map = {
    'influencer_apply': '达人外部申样',
    'staff_create': '员工手动创建'
  }
  return map[source] || source
}
</script>

<style scoped>
.detail-content {
  padding: 8px 0;
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

    &.status-warning {
      color: #ff6600;
    }

    &.status-info {
      color: #1677ff;
    }

    &.status-primary {
      color: #722ed1;
    }

    &.status-success {
      color: #00cc66;
    }

    &.status-danger {
      color: #ff4d4f;
    }
  }
}

.note-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 6px;
}
</style>

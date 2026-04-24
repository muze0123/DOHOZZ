<template>
  <el-drawer v-model="dialogVisible" title="商品详情" size="1200px" direction="rtl" @close="handleClose">
    <div v-if="product" class="detail-content">
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <div class="info-grid">
          <div class="info-item full">
            <div class="product-header">
              <el-image :src="product.productImage" class="product-image" fit="cover">
                <template #error>
                  <div class="image-placeholder"><el-icon><Picture /></el-icon></div>
                </template>
              </el-image>
              <div class="product-basic">
                <div class="product-name">{{ product.productName }}</div>
                <div class="product-id">商品ID：{{ product.productId }}</div>
              </div>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">来源店铺</span>
            <span class="info-value">
              <el-image :src="product.shopImage" class="shop-image" fit="cover">
                <template #error>
                  <div class="image-placeholder small"><el-icon><Shop /></el-icon></div>
                </template>
              </el-image>
              {{ product.shopName }} ({{ product.shopRegion }})
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">商品价格</span>
            <span class="info-value price">¥{{ formatMoney(product.price) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">公开佣金率</span>
            <span class="info-value">{{ product.commissionRate }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">库存</span>
            <span class="info-value">{{ product.inventory }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">商品状态</span>
            <span class="info-value status-tag" :class="product.status">{{ getStatusText(product.status) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">同步时间</span>
            <span class="info-value">{{ product.syncTime }}</span>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">业绩数据</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">成交达人</span>
            <span class="info-value">{{ product.creatorCount || 0 }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">达人成交金额</span>
            <span class="info-value deal">¥{{ formatMoney(product.creatorAmount || 0) }}</span>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <div class="section-title">其他信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">平台</span>
            <span class="info-value">TikTok</span>
          </div>
          <div class="info-item">
            <span class="info-label">商品链接</span>
            <span class="info-value link" @click="handleCopyLink">点击复制链接</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Shop } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  product: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

function handleCopyLink() {
  if (!props.product) return
  const link = `https://shop.tiktok.com/product/${props.product.productId}`
  navigator.clipboard.writeText(link).then(() => {
    ElMessage.success('复制商品链接成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

function getStatusText(status) {
  return { online: '已上架', offline: '已下架', deleted: '已删除' }[status] || status
}

function formatMoney(v) {
  return v ? v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '0.00'
}
</script>

<style scoped>
.detail-content {
  padding: 8px 0;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  &.full {
    grid-column: 1 / -1;
  }

  .info-label {
    font-size: 13px;
    color: #999;
    display: block;
    margin-bottom: 6px;
  }

  .info-value {
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;

    &.price {
      color: #00cc66;
      font-weight: 500;
    }

    &.deal {
      color: #00cc66;
      font-weight: 500;
    }

    &.link {
      color: #1677ff;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.product-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  .product-image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    flex-shrink: 0;
    background: #f5f5f5;
  }

  .product-basic {
    flex: 1;
  }

  .product-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .product-id {
    font-size: 13px;
    color: #999;
  }
}

.shop-image {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #f5f5f5;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 24px;

  &.small {
    font-size: 16px;
  }
}

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 2px;

  &.online { background: #e6fffb; color: #00856a; }
  &.offline { background: #f5f5f5; color: #999; }
  &.deleted { background: #fff2f0; color: #ff4d4f; }
}
</style>

<template>
  <div class="sample-list-section">
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <div v-else-if="samples.length === 0" class="empty-container">
      <el-empty description="暂无样品数据" />
    </div>

    <div v-else class="sample-list">
      <div
        v-for="sample in samples"
        :key="sample.id"
        class="sample-card"
      >
        <!-- 头部：样品ID + 状态 -->
        <div class="card-header">
          <div class="sample-id">{{ sample.id }}</div>
          <div class="sample-status" :class="getStatusClass(sample.status)">
            {{ getStatusText(sample.status) }}
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="card-product">
          <div class="product-icon">
            <el-icon><Goods /></el-icon>
          </div>
          <div class="product-info">
            <div class="product-name">{{ sample.product.name }}</div>
            <div class="product-meta">
              <span class="platform-tag" :class="sample.platform">{{ sample.platform.toUpperCase() }}</span>
              <span v-if="sample.isRepeat" class="repeat-tag">重复</span>
            </div>
          </div>
        </div>

        <!-- 达人信息 -->
        <div class="card-influencer">
          <div class="influencer-avatar">
            <el-icon><User /></el-icon>
          </div>
          <div class="influencer-info">
            <div class="influencer-name">{{ sample.influencer.name }}</div>
            <div class="influencer-meta">
              <span class="level-tag">{{ sample.influencer.level }}</span>
              <span class="followers">{{ sample.influencer.followers }}</span>
            </div>
          </div>
        </div>

        <!-- 收货人信息 -->
        <div class="card-recipient">
          <div class="recipient-row">
            <span class="recipient-label">收货人</span>
            <span class="recipient-name">{{ sample.recipient.name }}</span>
            <span class="recipient-phone">{{ sample.recipient.phone }}</span>
          </div>
          <div class="recipient-address">{{ sample.recipient.address }}</div>
        </div>

        <!-- 物流信息 -->
        <div v-if="sample.logisticsNo" class="card-logistics">
          <span class="logistics-company">{{ sample.logisticsCompany }}</span>
          <span class="logistics-no">{{ sample.logisticsNo }}</span>
        </div>

        <!-- 底部信息 + 操作 -->
        <div class="card-footer">
          <div class="footer-left">
            <span class="bd-name">BD: {{ sample.bd }}</span>
            <span class="create-time">{{ sample.createTime }}</span>
          </div>
          <div class="footer-actions">
            <el-button link type="primary" size="small" @click="handleViewDetail(sample)">详情</el-button>
            <el-button
              v-if="sample.status === 'pending_approve'"
              link
              type="primary"
              size="small"
              @click="handleApprove(sample)"
            >通过</el-button>
            <el-button
              v-if="sample.status === 'pending_approve'"
              link
              type="danger"
              size="small"
              @click="handleReject(sample)"
            >拒绝</el-button>
            <el-button
              v-if="sample.status === 'pending_ship'"
              link
              type="primary"
              size="small"
              @click="handleShip(sample)"
            >发货</el-button>
            <el-button link type="primary" size="small" @click="handleEditSample(sample)">编辑</el-button>
            <el-button link type="default" size="small" @click="handleEditNote(sample)">备注</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(sample)">删除</el-button>
          </div>
        </div>

        <!-- 备注 -->
        <div v-if="sample.note" class="card-note">
          <el-icon><Comment /></el-icon>
          <span>{{ sample.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Goods, User, Comment, Loading } from '@element-plus/icons-vue'

defineProps({
  samples: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'view-detail',
  'approve',
  'reject',
  'ship',
  'delete',
  'edit-note',
  'edit-sample'
])

function handleViewDetail(sample) {
  emit('view-detail', sample)
}

function handleApprove(sample) {
  emit('approve', sample)
}

function handleReject(sample) {
  emit('reject', sample)
}

function handleShip(sample) {
  emit('ship', sample)
}

function handleDelete(sample) {
  emit('delete', sample)
}

function handleEditNote(sample) {
  emit('edit-note', sample)
}

function handleEditSample(sample) {
  emit('edit-sample', sample)
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
</script>

<style scoped lang="scss">
@import '@/assets/styles/_influencer-page.scss';

.sample-list-section {
  padding: 0 20px;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.loading-container {
  gap: 8px;
  font-size: 14px;
}

.sample-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sample-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s;

  &:hover {
    border-color: #1677ff;
    box-shadow: 0 2px 12px rgba(22, 119, 255, 0.08);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .sample-id {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .sample-status {
    font-size: 12px;
    padding: 2px 10px;
    border-radius: 4px;

    &.status-warning {
      color: #ff6600;
      background: #fff7e6;
    }

    &.status-info {
      color: #1677ff;
      background: #e6f4ff;
    }

    &.status-primary {
      color: #722ed1;
      background: #f9f0ff;
    }

    &.status-success {
      color: #00cc66;
      background: #e6f7ed;
    }

    &.status-danger {
      color: #ff4d4f;
      background: #fff2f0;
    }
  }
}

.card-product {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 12px;

  .product-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 6px;
    font-size: 24px;
    color: #666;
  }

  .product-info {
    flex: 1;

    .product-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }

    .product-meta {
      display: flex;
      gap: 8px;

      .platform-tag {
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 2px;
        color: #fff;

        &.tiktok {
          background: #000;
        }

        &.instagram {
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
        }

        &.shopee {
          background: #ee4d2d;
        }

        &.lazada {
          background: #283593;
        }
      }

      .repeat-tag {
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 2px;
        background: #fff3e6;
        color: #ff6600;
      }
    }
  }
}

.card-influencer {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  .influencer-avatar {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e6f4ff;
    border-radius: 50%;
    color: #1677ff;
  }

  .influencer-info {
    flex: 1;

    .influencer-name {
      font-size: 14px;
      color: #1677ff;
      font-weight: 500;
    }

    .influencer-meta {
      display: flex;
      gap: 8px;
      margin-top: 4px;

      .level-tag {
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 2px;
        background: #fff7e6;
        color: #ff6600;
      }

      .followers {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.card-recipient {
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 12px;

  .recipient-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;

    .recipient-label {
      font-size: 12px;
      color: #999;
    }

    .recipient-name {
      font-size: 13px;
      color: #333;
      font-weight: 500;
    }

    .recipient-phone {
      font-size: 12px;
      color: #666;
    }
  }

  .recipient-address {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.card-logistics {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;

  .logistics-company {
    color: #1677ff;
  }
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;

  .footer-left {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #999;

    .bd-name {
      color: #666;
    }
  }

  .footer-actions {
    display: flex;
    gap: 4px;
  }
}

.card-note {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 10px;
  background: #fffbe6;
  border-radius: 4px;
  font-size: 12px;
  color: #666;

  .el-icon {
    color: #ff6600;
  }
}
</style>

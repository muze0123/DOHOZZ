<template>
  <div class="cooperation-list-section">
    <!-- 区域头部 -->
    <div class="list-header">
      <div class="header-left">
        <span class="page-title">我的合作单</span>
        <div class="status-tabs">
          <span
            v-for="tab in statusTabs"
            :key="tab.key"
            class="status-tab"
            :class="{ active: activeStatus === tab.key }"
            @click="handleStatusChange(tab.key)"
          >
            {{ tab.label }}({{ tab.count }})
          </span>
        </div>
        <div class="update-time">
          <span>数据更新时间：{{ updateTime }}</span>
          <el-icon class="question-icon" @click="$emit('show-rule')"><QuestionFilled /></el-icon>
        </div>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleBatchAction">
          <el-button :disabled="!hasSelection">
            批量操作
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="cancel">批量取消</el-dropdown-item>
              <el-dropdown-item command="export">批量导出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="$emit('add')">
          <el-button type="primary">
            + 新增合作单
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>新增合作单</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 表格区域 - 支持横向滚动 -->
    <div class="table-container">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <el-table
        v-else
        :data="cooperations"
        style="width: 100%; min-width: 1600px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column label="达人信息" min-width="150" fixed="left">
          <template #default="{ row }">
            <div class="influencer-cell">
              <div class="influencer-avatar">
                <el-icon><User /></el-icon>
              </div>
              <div class="influencer-info">
                <div class="influencer-name">{{ row.influencer.name }}</div>
                <div class="influencer-meta">
                  <span class="followers">{{ row.influencer.followers }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合作ID" min-width="130">
          <template #default="{ row }">
            <div class="cooperation-id-cell">
              <span class="id-text">{{ row.id }}</span>
              <el-icon class="copy-icon" @click="$emit('copy', row.id)"><CopyDocument /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交付时间" min-width="180">
          <template #default="{ row }">
            <span class="delivery-time">
              {{ row.deliveryStartTime }} 至 {{ row.deliveryEndTime || '--' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
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
        <el-table-column label="成交金额" min-width="110" sortable :sort-orders="['ascending', 'descending']">
          <template #default="{ row }">
            <span class="amount-value deal" @click="$emit('sort', 'dealAmount')">
              ¥{{ formatMoney(row.dealAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" min-width="110" sortable>
          <template #default="{ row }">
            <span class="amount-value">¥{{ formatMoney(row.settleAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="坑位费" min-width="100" sortable>
          <template #default="{ row }">
            <span class="amount-value">¥{{ formatMoney(row.slotFee) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合作商品" min-width="120">
          <template #default="{ row }">
            <div class="product-cell" @click="$emit('show-products', row)">
              <div class="product-thumbnail">
                <el-icon><Goods /></el-icon>
              </div>
              <span class="product-count">{{ row.products.length }}个商品</span>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合作模式" min-width="100">
          <template #default="{ row }">
            <span class="mode-tag" :class="row.mode">{{ getModeText(row.mode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建类型" min-width="100">
          <template #default="{ row }">
            <div class="create-type-cell">
              <span>{{ getCreateTypeText(row.createType) }}</span>
              <el-icon class="question-icon" @click="$emit('show-create-type-rule')"><QuestionFilled /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150" sortable>
          <template #default="{ row }">
            <span class="time-value">{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="120">
          <template #default="{ row }">
            <span class="note-text">{{ row.note || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button link type="primary" size="small" @click="$emit('view-detail', row)">详情</el-button>
              <el-button
                v-if="row.status === 'pending' || row.status === 'delivering'"
                link
                type="primary"
                size="small"
                @click="$emit('edit', row)"
              >编辑</el-button>
              <el-button
                v-if="row.status !== 'pending'"
                link
                type="danger"
                size="small"
                @click="$emit('delete', row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && cooperations.length === 0" description="暂无合作单数据" />
    </div>
  </div>
</template>

<script setup>
import { QuestionFilled, ArrowDown, ArrowRight, User, CopyDocument, Goods, Loading } from '@element-plus/icons-vue'

defineProps({
  cooperations: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  activeStatus: {
    type: String,
    default: 'all'
  },
  statusTabs: {
    type: Array,
    default: () => []
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
  },
  updateTime: {
    type: String,
    default: ''
  },
  hasSelection: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'status-change', 'sort', 'selection-change', 'view-detail', 'edit', 'delete',
  'show-rule', 'batch-action', 'add', 'copy', 'show-products', 'show-create-type-rule'
])

function handleStatusChange(status) {
  emit('status-change', status)
}

function handleSort(field) {
  emit('sort', field)
}

function handleSelectionChange(selection) {
  emit('selection-change', selection.map(c => c.id))
}

function handleBatchAction(action) {
  emit('batch-action', action)
}

function getStatusText(status) {
  const map = {
    'pending': '待交付',
    'delivering': '交付中',
    'finished': '已结束',
    'cancelled': '已取消'
  }
  return map[status] || status
}

function getModeText(mode) {
  const map = {
    'commission': '佣金模式',
    'slot_fee': '坑位费模式',
    'mixed': '混合模式'
  }
  return map[mode] || mode
}

function getCreateTypeText(type) {
  const map = {
    'manual': '手动创建',
    'auto': '系统自动创建'
  }
  return map[type] || type
}

function formatMoney(value) {
  if (!value) return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.cooperation-list-section {
  background: #fff;
}

.list-header {
  @include toolbar-section;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  @include page-title;
}

.status-tabs {
  display: flex;
  gap: 16px;
}

.status-tab {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    color: #1677ff;
    background: #e6f4ff;
  }
}

.update-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;

  .question-icon {
    cursor: pointer;

    &:hover {
      color: #1677ff;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-container {
  padding: 0;
  overflow-x: auto;
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
      .followers {
        font-size: 11px;
        color: #999;
      }
    }
  }
}

.cooperation-id-cell {
  display: flex;
  align-items: center;
  gap: 4px;

  .id-text {
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

.delivery-time {
  font-size: 12px;
  color: #666;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &.pending { color: #ff6600; .status-dot { background: #ff6600; } }
  &.delivering { color: #00cc66; .status-dot { background: #00cc66; } }
  &.finished { color: #999; .status-dot { background: #999; } }
  &.cancelled { color: #ff4d4f; .status-dot { background: #ff4d4f; } }
}

.bd-name {
  font-size: 13px;
  color: #333;
}

.amount-value {
  font-size: 13px;
  color: #333;

  &.deal {
    color: #00cc66;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  .product-thumbnail {
    width: 24px;
    height: 24px;
    background: #f5f5f5;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 12px;
  }

  .product-count {
    font-size: 12px;
    color: #666;
  }

  .arrow-icon {
    color: #999;
    font-size: 12px;
  }

  &:hover .arrow-icon {
    color: #1677ff;
  }
}

.mode-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 2px;

  &.commission { background: #e6f4ff; color: #1677ff; }
  &.slot_fee { background: #fff7e6; color: #ff6600; }
  &.mixed { background: #f9f0ff; color: #722ed1; }
}

.create-type-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;

  .question-icon {
    cursor: pointer;
    color: #999;

    &:hover {
      color: #1677ff;
    }
  }
}

.time-value {
  font-size: 12px;
  color: #999;
}

.note-text {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
  display: inline-block;
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

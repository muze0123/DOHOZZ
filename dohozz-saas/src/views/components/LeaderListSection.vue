<template>
  <div class="leader-list-section">
    <div class="table-container">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <el-table
        v-else
        :data="leaders"
        style="width: 100%; min-width: 1800px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column label="团长" min-width="200" fixed="left">
          <template #default="{ row }">
            <div class="leader-cell">
              <div class="leader-avatar">
                <el-icon><User /></el-icon>
              </div>
              <div class="leader-info">
                <div class="leader-name" @click="$emit('view-detail', row)">{{ row.name }}</div>
                <div class="leader-meta">
                  <span class="leader-id">ID:{{ row.id }}</span>
                  <span class="level-tag">{{ row.level }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="带货类目" min-width="100">
          <template #default="{ row }">
            <span class="category-tag">{{ row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合作BD" min-width="120">
          <template #default="{ row }">
            <div class="bd-list">
              <span v-for="(bd, idx) in row.bdList.slice(0, 3)" :key="idx" class="bd-name">{{ bd }}</span>
              <span v-if="row.bdList.length > 3" class="bd-more">+{{ row.bdList.length - 3 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="归属模式" min-width="100">
          <template #default="{ row }">
            <span class="mode-tag" :class="row.mode">{{ getModeText(row.mode) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出单活动数" min-width="100" sortable>
          <template #default="{ row }">
            <span class="stat-link" @click="$emit('sort', 'activityCount')">{{ row.activityCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交金额" min-width="120" sortable>
          <template #default="{ row }">
            <span class="amount-value deal" @click="$emit('sort', 'dealAmount')">¥{{ formatMoney(row.dealAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算金额" min-width="120" sortable>
          <template #default="{ row }">
            <span class="amount-value">¥{{ formatMoney(row.settleAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出单达人数" min-width="100" sortable>
          <template #default="{ row }">
            <span class="stat-link" @click="$emit('sort', 'influencerCount')">{{ row.influencerCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出单商品数" min-width="100" sortable>
          <template #default="{ row }">
            <span class="stat-value">{{ row.productCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" min-width="100" sortable>
          <template #default="{ row }">
            <span class="amount-value warning">¥{{ formatMoney(row.refundAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算服务费" min-width="100" sortable>
          <template #default="{ row }">
            <span class="amount-value">¥{{ formatMoney(row.serviceFee) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出单视频数" min-width="100" sortable>
          <template #default="{ row }">
            <span class="stat-value">{{ row.videoCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出单直播数" min-width="100" sortable>
          <template #default="{ row }">
            <span class="stat-value">{{ row.liveCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新跟进记录" min-width="150">
          <template #default="{ row }">
            <span class="follow-text" :title="row.latestFollow">{{ row.latestFollow || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="120">
          <template #default="{ row }">
            <div class="remark-cell">
              <span class="remark-text" :title="row.remark">{{ row.remark || '--' }}</span>
              <el-icon class="edit-icon" @click="$emit('edit-remark', row)"><Edit /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button link type="primary" size="small" @click="$emit('edit', row)">编辑合作</el-button>
              <el-button
                v-if="row.mode !== 'unassigned'"
                link
                type="primary"
                size="small"
                @click="$emit('transfer', row)"
              >转移</el-button>
              <el-button link type="primary" size="small" @click="$emit('follow-up', row)">跟进</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && leaders.length === 0" description="暂无团长数据" />
    </div>
  </div>
</template>

<script setup>
import { User, Edit, Loading } from '@element-plus/icons-vue'

defineProps({
  leaders: {
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

const emit = defineEmits(['sort', 'selection-change', 'edit', 'transfer', 'follow-up', 'edit-remark', 'view-detail'])

function handleSelectionChange(selection) {
  emit('selection-change', selection.map(l => l.id))
}

function getModeText(mode) {
  const map = {
    'leader': '团长归属',
    'activity': '活动归属',
    'influencer': '达人归属',
    'product': '商品归属',
    'unassigned': '未归属'
  }
  return map[mode] || mode
}

function formatMoney(value) {
  if (!value) return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.leader-list-section {
  background: #fff;
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

.leader-cell {
  display: flex;
  gap: 10px;

  .leader-avatar {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background: #e6f4ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1677ff;
  }

  .leader-info {
    flex: 1;
    min-width: 0;

    .leader-name {
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

    .leader-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;

      .leader-id {
        font-size: 11px;
        color: #999;
      }

      .level-tag {
        font-size: 10px;
        padding: 1px 4px;
        background: #fff7e6;
        color: #ff6600;
        border-radius: 2px;
      }
    }
  }
}

.category-tag {
  font-size: 12px;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  color: #666;
}

.bd-list {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .bd-name {
    font-size: 12px;
    color: #333;
  }

  .bd-more {
    font-size: 11px;
    color: #999;
  }
}

.mode-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 2px;

  &.leader { background: #e6f4ff; color: #1677ff; }
  &.activity { background: #fff7e6; color: #ff6600; }
  &.influencer { background: #f9f0ff; color: #722ed1; }
  &.product { background: #e6fffb; color: #00856a; }
  &.unassigned { background: #f5f5f5; color: #999; }
}

.stat-link {
  font-size: 13px;
  color: #1677ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.stat-value {
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

  &.warning {
    color: #ff4d4f;
  }
}

.follow-text {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
  display: inline-block;
}

.remark-cell {
  display: flex;
  align-items: center;
  gap: 4px;

  .remark-text {
    font-size: 12px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80px;
    flex: 1;
  }

  .edit-icon {
    cursor: pointer;
    color: #999;
    font-size: 14px;
    flex-shrink: 0;

    &:hover {
      color: #1677ff;
    }
  }
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

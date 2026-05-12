<template>
  <div class="enterprise-influencer-list-section">
    <div class="table-container">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <el-table
        v-else
        :data="listData"
        style="width: 100%; min-width: 1400px;"
        @selection-change="handleSelectionChange"
        border
        stripe
      >
        <el-table-column type="selection" width="40" fixed="left" />
        <el-table-column label="达人" min-width="200" fixed="left">
          <template #default="{ row }">
            <div class="influencer-cell">
              <el-avatar :size="40" :src="row.streamer_avatar">
                {{ row.streamer_name ? row.streamer_name.charAt(0) : '?' }}
              </el-avatar>
              <div class="influencer-info">
                <div class="influencer-name">
                  {{ row.streamer_name }}
                  <el-icon v-if="row.is_verified" class="verified-icon"><CircleCheck /></el-icon>
                </div>
                <div class="influencer-id">ID: {{ row.streamer_id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="平均播放量" min-width="120" sortable>
          <template #default="{ row }">
            <span class="stat-value">{{ formatNumber(row.avg_view_count) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="近30天视频数" min-width="120" sortable>
          <template #default="{ row }">
            <span class="stat-value">{{ row.video_count_30days || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合作计划" min-width="100">
          <template #default="{ row }">
            <span class="stat-value">{{ row.cooperation_plan_count || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划内容" min-width="100">
          <template #default="{ row }">
            <span class="stat-value">{{ row.plan_content_count || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="播放量/阅读量" min-width="130" sortable>
          <template #default="{ row }">
            <span class="stat-value">{{ formatNumber(row.view_read_count) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="全部内容" min-width="100">
          <template #default="{ row }">
            <span class="stat-value">{{ row.all_content_count || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总播放量" min-width="130" sortable>
          <template #default="{ row }">
            <span class="stat-value">{{ formatNumber(row.total_view_count) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="160" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button
                class="relate-btn"
                size="small"
                plain
                @click="$emit('relate', row)"
              >
                关联计划
              </el-button>
              <el-button
                class="edit-btn"
                size="small"
                type="primary"
                @click="$emit('edit', row)"
              >
                编辑
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && listData.length === 0" description="暂无达人数据" />
    </div>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'
import { CircleCheck } from '@element-plus/icons-vue'

defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['selection-change', 'detail', 'edit', 'relate', 'page-change', 'size-change'])

function handleSelectionChange(selection) {
  emit('selection-change', selection.map(item => item.streamer_id))
}

function formatNumber(value) {
  if (value == null || typeof value !== 'number') return '0'
  return value.toLocaleString('zh-CN')
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.enterprise-influencer-list-section {
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

.influencer-cell {
  display: flex;
  gap: 12px;
  align-items: center;

  .influencer-info {
    flex: 1;
    min-width: 0;

    .influencer-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      gap: 4px;

      .verified-icon {
        color: #1677ff;
        font-size: 16px;
      }
    }

    .influencer-id {
      font-size: 12px;
      color: #999;
      margin-top: 2px;
    }
  }
}

.stat-value {
  font-size: 13px;
  color: #333;
}

.action-btns {
  display: flex;
  gap: 8px;

  .relate-btn {
    border-color: #ff6600;
    color: #ff6600;
    background: transparent;

    &:hover {
      background: #fff7e6;
      border-color: #ff8533;
      color: #ff8533;
    }
  }

  .edit-btn {
    background: #ff6600;
    border-color: #ff6600;

    &:hover {
      background: #ff8533;
      border-color: #ff8533;
    }
  }
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

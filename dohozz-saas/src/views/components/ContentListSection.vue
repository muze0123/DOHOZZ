<template>
  <div class="content-list-section">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          :model-value="searchKeyword"
          placeholder="搜索内容标题/达人名称"
          clearable
          size="default"
          class="search-input"
          @keyup.enter="$emit('search', searchKeyword)"
          @clear="$emit('search', '')"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="$emit('search', searchKeyword)">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="$emit('confirm')">一键确认</el-button>
        <el-button @click="$emit('export')">导出</el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <el-table
        v-else-if="contentList.length > 0"
        :data="contentList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 内容列 -->
        <el-table-column label="内容" min-width="200">
          <template #default="{ row }">
            <div class="content-cell">
              <el-image
                :src="row.coverUrl"
                :fit="'cover'"
                class="content-cover"
                :preview-src-list="[row.coverUrl]"
                :preview-teleported="true"
              >
                <template #error>
                  <div class="cover-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="content-info">
                <div class="content-title">{{ row.title }}</div>
                <div class="content-time">{{ row.publishTime || row.createTime }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 达人列 -->
        <el-table-column label="达人" min-width="150">
          <template #default="{ row }">
            <div class="streamer-cell">
              <el-avatar :size="32" :src="row.streamerAvatar" class="streamer-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="streamer-info">
                <div class="streamer-name">{{ row.streamerName }}</div>
                <div class="streamer-account">
                  {{ row.streamerAccount }}
                  <el-icon class="external-link"><TopRight /></el-icon>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 内容标签列 -->
        <el-table-column label="内容标签" min-width="120">
          <template #default="{ row }">
            <div class="tags-cell" v-if="row.tags && row.tags.length > 0">
              <span
                v-for="(tag, index) in row.tags.slice(0, 2)"
                :key="index"
                class="tag-pill"
              >
                {{ tag }}
              </span>
              <span v-if="row.tags.length > 2" class="tag-more">+{{ row.tags.length - 2 }}</span>
            </div>
            <span v-else class="no-data">-</span>
          </template>
        </el-table-column>

        <!-- 状态列 -->
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <span class="status-badge" :class="getStatusClass(row.status)">
              <span class="status-dot"></span>
              {{ getStatusText(row.status) }}
            </span>
          </template>
        </el-table-column>

        <!-- 关联计划列 -->
        <el-table-column label="关联计划" min-width="100">
          <template #default="{ row }">
            <div
              class="link-cell"
              v-if="row.planCount > 0"
              @click="$emit('view-plan', row)"
            >
              <span class="link-count">{{ row.planCount }}</span>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
            <span v-else class="no-data">-</span>
          </template>
        </el-table-column>

        <!-- 关联SPU列 -->
        <el-table-column label="关联SPU" min-width="100">
          <template #default="{ row }">
            <div
              class="link-cell"
              v-if="row.spuCount > 0"
              @click="$emit('view-spu', row)"
            >
              <span class="link-count">{{ row.spuCount }}</span>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
            <span v-else class="no-data">-</span>
          </template>
        </el-table-column>

        <!-- 所属媒介列 -->
        <el-table-column label="所属媒介" min-width="120">
          <template #default="{ row }">
            <div class="medium-cell" v-if="row.medium">
              <el-avatar :size="24" :src="row.medium.avatar" class="medium-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="medium-name">{{ row.medium.name }}</span>
            </div>
            <span v-else class="no-data">-</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button link type="primary" size="small" @click="$emit('view-detail', row)">详情</el-button>
              <el-button link type="primary" size="small" @click="$emit('edit', row)">编辑</el-button>
              <el-dropdown trigger="click" @command="(command) => handleMoreCommand(command, row)">
                <el-button link type="primary" size="small">
                  更多
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="delete">
                      <el-icon><Delete /></el-icon>
                      删除内容
                    </el-dropdown-item>
                    <el-dropdown-item command="archive">
                      <el-icon><FolderOpened /></el-icon>
                      归档内容
                    </el-dropdown-item>
                    <el-dropdown-item command="export">
                      <el-icon><Download /></el-icon>
                      导出内容
                    </el-dropdown-item>
                    <el-dropdown-item command="copy">
                      <el-icon><CopyDocument /></el-icon>
                      复制内容
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-else description="暂无内容" />
    </div>

    <!-- 分页 -->
    <div class="pagination-area" v-if="contentList.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$emit('page-size-change', currentPageSize)"
        @current-change="$emit('page-change', currentPage)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, Loading, Picture, User, TopRight, ArrowRight, ArrowDown, Delete, FolderOpened, Download, CopyDocument } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  contentList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({ page: 1, pageSize: 10, total: 0 })
  },
  searchKeyword: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'search',
  'confirm',
  'export',
  'view-detail',
  'edit',
  'delete',
  'archive',
  'copy',
  'page-change',
  'page-size-change',
  'view-plan',
  'view-spu',
  'selection-change'
])

const currentPage = computed({
  get: () => props.pagination.page,
  set: (val) => val
})

const currentPageSize = computed({
  get: () => props.pagination.pageSize,
  set: (val) => val
})

function handleSelectionChange(selection) {
  emit('selection-change', selection)
}

function getStatusText(status) {
  const map = {
    'normal': '正常',
    'abnormal': '异常',
    'deleted': '已删除'
  }
  return map[status] || status
}

function getStatusClass(status) {
  const map = {
    'normal': 'status-normal',
    'abnormal': 'status-abnormal',
    'deleted': 'status-deleted'
  }
  return map[status] || ''
}

async function handleMoreCommand(command, row) {
  switch (command) {
    case 'delete':
      try {
        await ElMessageBox.confirm('确定要删除该内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        emit('delete', row.id)
      } catch {
        // User cancelled
      }
      break
    case 'archive':
      try {
        await ElMessageBox.confirm('确定要归档该内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        emit('archive', row.id)
      } catch {
        // User cancelled
      }
      break
    case 'export':
      emit('export', row)
      break
    case 'copy':
      emit('copy', row)
      break
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.content-list-section {
  background: #fff;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.toolbar-left {
  .search-input {
    width: 280px;
    border-radius: 8px;

    :deep(.el-input__wrapper) {
      border-radius: 8px 0 0 8px;
    }

    :deep(.el-input-group__append) {
      border-radius: 0 8px 8px 0;
      background: #FF6600;
      color: #fff;
      border-color: #FF6600;

      .el-button {
        color: #fff;
        padding: 0 16px;
      }
    }
  }
}

.toolbar-right {
  display: flex;
  gap: 8px;

  :deep(.el-button--primary) {
    background: #FF6600;
    border-color: #FF6600;

    &:hover {
      background: #e65900;
      border-color: #e65900;
    }
  }
}

.table-container {
  padding: 0;
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

.content-cell {
  display: flex;
  gap: 12px;
  align-items: center;

  .content-cover {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .cover-error {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 24px;
  }

  .content-info {
    flex: 1;
    min-width: 0;

    .content-title {
      font-size: 14px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 4px;
    }

    .content-time {
      font-size: 12px;
      color: #999;
    }
  }
}

.streamer-cell {
  display: flex;
  gap: 8px;
  align-items: center;

  .streamer-avatar {
    flex-shrink: 0;
    background: #e6f4ff;
    color: #1677ff;
  }

  .streamer-info {
    flex: 1;
    min-width: 0;

    .streamer-name {
      font-size: 14px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .streamer-account {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
      gap: 2px;

      .external-link {
        font-size: 12px;
      }
    }
  }
}

.tags-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;

  .tag-pill {
    padding: 2px 8px;
    background: #FFF7ED;
    color: #FF6600;
    border-radius: 10px;
    font-size: 12px;
  }

  .tag-more {
    font-size: 12px;
    color: #999;
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #f5f7fa;
  border-radius: 12px;
  font-size: 12px;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &.status-normal {
    color: #1677ff;
    .status-dot { background: #1677ff; }
  }

  &.status-abnormal {
    color: #ff4d4f;
    .status-dot { background: #ff4d4f; }
  }

  &.status-deleted {
    color: #999;
    .status-dot { background: #999; }
  }
}

.link-cell {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #1677ff;

  &:hover {
    .arrow-icon {
      transform: translateX(2px);
    }
  }

  .link-count {
    font-size: 14px;
    font-weight: 500;
  }

  .arrow-icon {
    font-size: 14px;
    transition: transform 0.2s;
  }
}

.medium-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .medium-avatar {
    flex-shrink: 0;
    background: #f5f7fa;
    color: #999;
  }

  .medium-name {
    font-size: 13px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.no-data {
  color: #ccc;
  font-size: 13px;
}

.action-btns {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pagination-area {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

:deep(.el-table) {
  .el-table__header th {
    background: #f5f7fa;
    font-weight: 600;
    color: #333;
    font-size: 13px;
    padding: 12px 0;
  }

  .el-table__row {
    border-bottom: 1px solid #f0f0f0;

    td {
      padding: 12px 0;
    }
  }
}
</style>

<template>
  <div class="non-cart-video-list-section">
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <template v-else>
      <!-- 列表标题 + 工具栏 -->
      <div class="list-toolbar">
        <div class="toolbar-left">
          <span class="page-title">{{ listTitle }}</span>
        </div>
        <div class="toolbar-right">
          <el-button size="small" @click="$emit('export')">导出</el-button>
          <el-button size="small" @click="$emit('sync')">投流平台同步</el-button>
          <el-button type="primary" size="small" @click="$emit('add')">+ 添加非挂车视频</el-button>
        </div>
      </div>

      <!-- 数据更新时间说明 -->
      <div class="update-hint">
        <span>数据更新时间：{{ updateTime }}</span>
        <el-tooltip content="视频互动数据次日更新，视频收录后自动更新15天">
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>

      <!-- 表格 -->
      <el-table
        :data="videos"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        :row-class-name="getRowClass"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="50" />

        <!-- 视频|发布时间 -->
        <el-table-column label="视频 | 发布时间" min-width="200">
          <template #default="{ row }">
            <div class="video-cell">
              <div class="video-thumbnail" @click.stop="handlePlay(row)">
                <div class="thumbnail-placeholder">
                  <el-icon><VideoPlay /></el-icon>
                </div>
                <div class="play-overlay">
                  <el-icon><VideoPlay /></el-icon>
                </div>
              </div>
              <div class="video-info">
                <div class="video-title" @click.stop="handleViewDetail(row)">{{ row.title }}</div>
                <div class="video-meta">
                  <span class="platform-tag" :class="row.platform">{{ row.platform.toUpperCase() }}</span>
                  <span class="publish-time">{{ row.publishTime }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 达人 -->
        <el-table-column label="达人" min-width="150">
          <template #default="{ row }">
            <div class="influencer-cell">
              <div class="influencer-avatar">
                <el-icon><User /></el-icon>
              </div>
              <div class="influencer-info">
                <div class="influencer-name">{{ row.influencer?.name }}</div>
                <div class="influencer-meta">
                  <span class="followers">{{ row.influencer?.followers }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 挂链商品 -->
        <el-table-column label="挂链商品" min-width="80">
          <template #default="{ row }">
            <span class="linked-product">{{ row.linkedProduct || '--' }}</span>
          </template>
        </el-table-column>

        <!-- 合作费用（inline editable） -->
        <el-table-column label="合作费用" min-width="100">
          <template #default="{ row }">
            <div v-if="editingCell.rowId === row.id && editingCell.field === 'cooperationFee'" class="edit-cell" @click.stop>
              <el-input
                v-model="editValue"
                size="small"
                @blur="handleSaveEdit(row, 'cooperationFee')"
                @keyup.enter="handleSaveEdit(row, 'cooperationFee')"
                @keyup.esc="handleCancelEdit"
                ref="editInputRef"
              />
            </div>
            <div v-else class="cell-text" @click.stop="handleStartEdit(row, 'cooperationFee')">
              {{ row.cooperationFee || '--' }}
            </div>
          </template>
        </el-table-column>

        <!-- 归属员工（inline editable） -->
        <el-table-column label="归属员工" min-width="90">
          <template #default="{ row }">
            <div v-if="editingCell.rowId === row.id && editingCell.field === 'employee'" class="edit-cell" @click.stop>
              <el-input
                v-model="editValue"
                size="small"
                @blur="handleSaveEdit(row, 'employee')"
                @keyup.enter="handleSaveEdit(row, 'employee')"
                @keyup.esc="handleCancelEdit"
                ref="editInputRef"
              />
            </div>
            <div v-else class="cell-text" @click.stop="handleStartEdit(row, 'employee')">
              {{ row.employee || '--' }}
            </div>
          </template>
        </el-table-column>

        <!-- 互动数据更新时间 -->
        <el-table-column label="互动数据更新时间" min-width="150">
          <template #default="{ row }">
            <div class="data-update-cell" @click.stop="handleRefreshData(row)">
              <span class="update-time">{{ row.dataUpdateTime || '--' }}</span>
              <el-icon class="refresh-icon" :class="{ refreshing: refreshingIds.has(row.id) }">
                <Refresh />
              </el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- 播放量 -->
        <el-table-column label="播放量" min-width="100">
          <template #default="{ row }">
            <div class="stat-cell">
              <span class="stat-total">{{ formatNumber(row.stats?.plays) }}</span>
              <span v-if="row.stats?.playsDelta" class="stat-delta" :class="getDeltaClass(row.stats.playsDelta)">{{ row.stats.playsDelta }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 点赞量 -->
        <el-table-column label="点赞量" min-width="100">
          <template #default="{ row }">
            <div class="stat-cell">
              <span class="stat-total">{{ formatNumber(row.stats?.likes) }}</span>
              <span v-if="row.stats?.likesDelta" class="stat-delta" :class="getDeltaClass(row.stats.likesDelta)">{{ row.stats.likesDelta }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 评论数 -->
        <el-table-column label="评论数" min-width="80">
          <template #default="{ row }">
            <div class="stat-cell">
              <span class="stat-total">{{ formatNumber(row.stats?.comments) }}</span>
              <span v-if="row.stats?.commentsDelta" class="stat-delta" :class="getDeltaClass(row.stats.commentsDelta)">{{ row.stats.commentsDelta }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 转发数 -->
        <el-table-column label="转发数" min-width="80">
          <template #default="{ row }">
            <div class="stat-cell">
              <span class="stat-total">{{ formatNumber(row.stats?.shares) }}</span>
              <span v-if="row.stats?.sharesDelta" class="stat-delta" :class="getDeltaClass(row.stats.sharesDelta)">{{ row.stats.sharesDelta }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 收藏数 -->
        <el-table-column label="收藏数" min-width="80">
          <template #default="{ row }">
            <div class="stat-cell">
              <span class="stat-total">{{ formatNumber(row.stats?.collects) }}</span>
              <span v-if="row.stats?.collectsDelta" class="stat-delta" :class="getDeltaClass(row.stats.collectsDelta)">{{ row.stats.collectsDelta }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 是否有投流 -->
        <el-table-column label="是否有投流" min-width="90">
          <template #default="{ row }">
            <span class="investment-tag" :class="{ yes: row.hasInvestment, no: !row.hasInvestment }">
              {{ row.hasInvestment ? '是' : '否' }}
            </span>
          </template>
        </el-table-column>

        <!-- 投放消耗费用 -->
        <el-table-column label="投放消耗费用" min-width="100">
          <template #default="{ row }">
            <span class="invest-stat">{{ row.hasInvestment ? (row.investmentStats?.consumeFee || '--') : '--' }}</span>
          </template>
        </el-table-column>

        <!-- 投放播放量 -->
        <el-table-column label="投放播放量" min-width="100">
          <template #default="{ row }">
            <span class="invest-stat">{{ row.hasInvestment ? formatNumber(row.investmentStats?.plays) : '--' }}</span>
          </template>
        </el-table-column>

        <!-- 投放点赞量 -->
        <el-table-column label="投放点赞量" min-width="100">
          <template #default="{ row }">
            <span class="invest-stat">{{ row.hasInvestment ? formatNumber(row.investmentStats?.likes) : '--' }}</span>
          </template>
        </el-table-column>

        <!-- 投放评论数 -->
        <el-table-column label="投放评论数" min-width="80">
          <template #default="{ row }">
            <span class="invest-stat">{{ row.hasInvestment ? formatNumber(row.investmentStats?.comments) : '--' }}</span>
          </template>
        </el-table-column>

        <!-- 投放转发数 -->
        <el-table-column label="投放转发数" min-width="80">
          <template #default="{ row }">
            <span class="invest-stat">{{ row.hasInvestment ? formatNumber(row.investmentStats?.shares) : '--' }}</span>
          </template>
        </el-table-column>

        <!-- 小蓝词（inline editable） -->
        <el-table-column label="小蓝词" min-width="120">
          <template #default="{ row }">
            <div v-if="editingCell.rowId === row.id && editingCell.field === 'blueWords'" class="edit-cell" @click.stop>
              <el-input
                v-model="editValue"
                size="small"
                placeholder="多个词用逗号分隔"
                @blur="handleSaveEdit(row, 'blueWords')"
                @keyup.enter="handleSaveEdit(row, 'blueWords')"
                @keyup.esc="handleCancelEdit"
                ref="editInputRef"
              />
            </div>
            <div v-else class="blue-words-display" @click.stop="handleStartEdit(row, 'blueWords')">
              <template v-if="row.blueWords && row.blueWords.length > 0">
                <el-tag v-for="(word, idx) in row.blueWords" :key="idx" size="small" class="blue-word-tag">{{ word }}</el-tag>
              </template>
              <span v-else class="placeholder">--</span>
            </div>
          </template>
        </el-table-column>

        <!-- 投放同步 -->
        <el-table-column label="投放同步" min-width="120">
          <template #default="{ row }">
            <span v-if="row.syncStatus === 'synced'" class="sync-tag synced">
              <el-tooltip placement="top">
                <template #content>
                  <div>已同步投放平台</div>
                  <div>同步人：{{ row.syncInfo?.user }}</div>
                  <div>同步时间：{{ row.syncInfo?.time }}</div>
                </template>
                <span class="sync-badge">已同步</span>
              </el-tooltip>
            </span>
            <span v-else class="sync-tag unsynced">未同步</span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" min-width="120" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button link type="primary" size="small" @click.stop="handleViewDetail(row)">详情</el-button>
              <el-button link type="primary" size="small" @click.stop="handlePlay(row)">播放</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="videos.length === 0" description="暂无相关视频" />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Loading, VideoPlay, User, QuestionFilled, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// Props
const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  listTitle: {
    type: String,
    default: '非挂车视频列表'
  },
  updateTime: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits([
  'export',
  'sync',
  'add',
  'play',
  'view-detail',
  'selection-change',
  'refresh-data',
  'update:cooperationFee',
  'update:employee',
  'update:blueWords'
])

// ---- Inline Edit State ----
const editingCell = reactive({
  rowId: null,
  field: null
})
const editValue = ref('')
const editInputRef = ref(null)

// ---- Data Refresh Rate Limiting ----
const refreshTimestamps = new Map()
const refreshingIds = reactive(new Set())

// ---- Methods ----

function handleStartEdit(row, field) {
  editingCell.rowId = row.id
  editingCell.field = field
  if (field === 'blueWords' && Array.isArray(row.blueWords)) {
    editValue.value = row.blueWords.join(',')
  } else {
    editValue.value = row[field] || ''
  }
  // Focus input on next tick
  setTimeout(() => {
    if (editInputRef.value) {
      editInputRef.value.focus()
    }
  }, 50)
}

function handleSaveEdit(row, field) {
  if (field === 'blueWords') {
    const words = editValue.value
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0)
    emit('update:blueWords', { id: row.id, value: words })
  } else {
    emit(`update:${field}`, { id: row.id, value: editValue.value })
  }
  editingCell.rowId = null
  editingCell.field = null
  editValue.value = ''
}

function handleCancelEdit() {
  editingCell.rowId = null
  editingCell.field = null
  editValue.value = ''
}

function handleRefreshData(row) {
  const lastRefresh = refreshTimestamps.get(row.id) || 0
  const now = Date.now()
  if (now - lastRefresh < 10 * 60 * 1000) {
    ElMessage.warning('操作太频繁，请稍后再试')
    return
  }
  // Mark as refreshing
  refreshingIds.add(row.id)
  refreshTimestamps.set(row.id, now)
  ElMessage.success('互动数据已更新')

  emit('refresh-data', row)

  // Clear refreshing state after a short delay for visual feedback
  setTimeout(() => {
    refreshingIds.delete(row.id)
  }, 1500)
}

function handleSelectionChange(selection) {
  emit('selection-change', selection.map(v => v.id))
}

function handleRowClick(row) {
  // intended for future use
}

function getRowClass() {
  return ''
}

function handleViewDetail(row) {
  emit('view-detail', row)
}

function handlePlay(row) {
  emit('play', row)
}

function getDeltaClass(delta) {
  if (!delta) return ''
  const num = parseInt(delta)
  if (num > 0) return 'delta-up'
  if (num < 0) return 'delta-down'
  return 'delta-flat'
}

function formatNumber(num) {
  if (num === undefined || num === null) return '0'
  if (typeof num === 'number') {
    return num.toLocaleString()
  }
  return String(num)
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.non-cart-video-list-section {
  background: #fff;
  border-radius: 8px;
  margin: 16px;
  padding: 0 0 20px;
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

// ---- Toolbar ----
.list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;

  .toolbar-left {
    .page-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .toolbar-right {
    display: flex;
    gap: 8px;
  }
}

// ---- Update Hint ----
.update-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 20px 12px;
  font-size: 12px;
  color: #999;

  .el-icon {
    cursor: help;
    font-size: 14px;
  }
}

// ---- Video Cell ----
.video-cell {
  display: flex;
  gap: 12px;
}

.video-thumbnail {
  position: relative;
  width: 64px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;

  .thumbnail-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 20px;
  }

  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .play-overlay {
    opacity: 1;
  }
}

.video-info {
  flex: 1;
  min-width: 0;

  .video-title {
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

  .video-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;

    .platform-tag {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 2px;
      color: #fff;

      &.tiktok { background: #000; }
      &.instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
      &.shopee { background: #ee4d2d; }
      &.lazada { background: #283593; }
    }

    .publish-time {
      font-size: 12px;
      color: #999;
    }
  }
}

// ---- Influencer Cell ----
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
      margin-top: 2px;

      .followers {
        font-size: 11px;
        color: #999;
      }
    }
  }
}

// ---- Linked Product ----
.linked-product {
  font-size: 12px;
  color: #999;
}

// ---- Inline Edit ----
.edit-cell {
  width: 100%;
}

.cell-text {
  font-size: 13px;
  color: #333;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  min-height: 22px;

  &:hover {
    background: #f0f5ff;
    outline: 1px dashed #1677ff;
  }
}

// ---- Data Update Cell ----
.data-update-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #999;

  .refresh-icon {
    font-size: 14px;
    color: #1677ff;
    opacity: 0;
    transition: opacity 0.2s;

    &.refreshing {
      opacity: 1;
      animation: spin 1s linear infinite;
    }
  }

  &:hover .refresh-icon {
    opacity: 1;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ---- Stat Cell ----
.stat-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .stat-total {
    font-size: 13px;
    font-weight: 500;
    color: #333;
  }

  .stat-delta {
    font-size: 11px;

    &.delta-up {
      color: #00cc66;
    }

    &.delta-down {
      color: #ff4d4f;
    }

    &.delta-flat {
      color: #999;
    }
  }
}

// ---- Investment Tag ----
.investment-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;

  &.yes {
    background: #e6f7ff;
    color: #1677ff;
  }

  &.no {
    background: #f5f5f5;
    color: #999;
  }
}

// ---- Investment Stats ----
.invest-stat {
  font-size: 13px;
  color: #333;
}

// ---- Blue Words ----
.blue-words-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  min-height: 22px;

  &:hover {
    background: #f0f5ff;
    outline: 1px dashed #1677ff;
  }

  .blue-word-tag {
    font-size: 11px;
  }

  .placeholder {
    font-size: 12px;
    color: #ccc;
  }
}

// ---- Sync Status ----
.sync-tag {
  display: inline-flex;
  align-items: center;

  &.synced .sync-badge {
    font-size: 12px;
    padding: 2px 8px;
    background: #e6fffb;
    color: #00b578;
    border: 1px solid #b7f0d1;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #b7f0d1;
    }
  }

  &.unsynced {
    font-size: 12px;
    padding: 2px 8px;
    background: #f5f5f5;
    color: #999;
    border-radius: 4px;
  }
}

// ---- Action Buttons ----
.action-btns {
  display: flex;
  gap: 8px;
}

// ---- Empty ----
.el-empty {
  padding: 40px 0;
}

// ---- Table Header Overrides ----
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

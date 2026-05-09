<template>
  <div class="video-list-section">
    <!-- 列表标题 -->
    <div class="list-header">
      <span class="list-title">带货视频列表-{{ metricLabel }}</span>
      <span class="monitor-hint">
        带货视频自动监控中
        <el-button link type="primary" @click="$emit('click-manual-add')">手动添加视频</el-button>
      </span>
    </div>

    <!-- 子Tab + 工具栏 -->
    <div class="list-toolbar">
      <div class="sub-tabs">
        <span
          v-for="tab in subTabs"
          :key="tab.value"
          class="sub-tab"
          :class="{ active: activeSubTab === tab.value }"
          @click="handleSubTabChange(tab.value)"
        >
          {{ tab.label }}
          <span class="tab-count">({{ tab.count }})</span>
        </span>
      </div>
      <div class="toolbar-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入视频标题"
          style="width: 220px"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-button @click="handleExport">导出</el-button>
        <el-badge :value="selectedVideos.length" :hidden="selectedVideos.length === 0" class="batch-badge">
          <el-button
            type="primary"
            :disabled="selectedVideos.length === 0"
            @click="$emit('batch-publish', selectedVideos)"
          >
            批量投放
          </el-button>
        </el-badge>
        <div class="view-switch">
          <el-tooltip content="列表视图" placement="top">
            <el-button
              :type="viewMode === 'table' ? 'primary' : 'default'"
              size="small"
              @click="viewMode = 'table'"
            >
              <i class="el-icon-s-grid"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip content="卡片视图" placement="top">
            <el-button
              :type="viewMode === 'card' ? 'primary' : 'default'"
              size="small"
              @click="viewMode = 'card'"
            >
              <i class="el-icon-s-operation"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 已选标签 -->
    <div v-if="appliedFilters.length > 0" class="applied-filters">
      <el-tag
        v-for="(filter, idx) in appliedFilters"
        :key="idx"
        closable
        @close="removeFilter(idx)"
      >
        {{ filter.label }}
      </el-tag>
    </div>

    <!-- 列表/卡片视图 -->
    <VideoTable
      v-if="viewMode === 'table'"
      :videos="filteredVideos"
      :selected-videos="selectedVideos"
      :show-delivery-columns="metricType === 'delivery'"
      @update:selectedVideos="emitSelected"
      @click-detail="(v) => $emit('click-detail', v)"
      @click-play="(v) => $emit('click-play', v)"
      @click-download="(v) => $emit('click-download', v)"
      @click-extract-text="(v) => $emit('click-extract-text', v)"
      @click-ai-rewrite="(v) => $emit('click-ai-rewrite', v)"
    />
    <VideoCardGrid
      v-else
      :videos="filteredVideos"
      :selected-videos="selectedVideos"
      @select-video="handleCardSelect"
      @click-detail="(v) => $emit('click-detail', v)"
      @click-play="(v) => $emit('click-play', v)"
      @click-extract-text="(v) => $emit('click-extract-text', v)"
      @click-ai-rewrite="(v) => $emit('click-ai-rewrite', v)"
    />

    <!-- 分页 -->
    <div class="list-footer">
      <Pagination
        :total="totalCount"
        :page="currentPage"
        :page-size="pageSize"
        @update:page="handlePageChange"
        @update:pageSize="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import VideoTable from './VideoTable.vue'
import VideoCardGrid from './VideoCardGrid.vue'
import Pagination from './Pagination.vue'

const props = defineProps({
  videos: { type: Array, default: () => [] },
  metricType: { type: String, default: 'new' },
  selectedVideos: { type: Array, default: () => [] },
  viewMode: { type: String, default: 'table' }
})

const emit = defineEmits([
  'update:selectedVideos', 'update:viewMode', 'batch-publish',
  'click-detail', 'click-play', 'click-download', 'click-extract-text', 'click-ai-rewrite',
  'click-manual-add'
])

const activeSubTab = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const appliedFilters = ref([])

const metricLabel = computed(() => {
  const labels = { new: '新发布视频', selling: '动销视频', delivery: '投放视频' }
  return labels[props.metricType] || '全部视频'
})

const subTabs = computed(() => [
  { label: '全部', value: 'all', count: props.videos.length },
  { label: '有出单', value: 'hasorder', count: props.videos.filter(v => v.dealAmount > 0).length },
  { label: '未出单', value: 'noorder', count: props.videos.filter(v => !v.dealAmount || v.dealAmount === 0).length }
])

const filteredVideos = computed(() => {
  let result = [...props.videos]
  if (activeSubTab.value === 'hasorder') {
    result = result.filter(v => v.dealAmount > 0)
  } else if (activeSubTab.value === 'noorder') {
    result = result.filter(v => !v.dealAmount || v.dealAmount === 0)
  }
  if (searchKeyword.value) {
    result = result.filter(v => v.title.includes(searchKeyword.value))
  }
  return result
})

const totalCount = computed(() => filteredVideos.value.length)

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredVideos.value.slice(start, start + pageSize.value)
})

const handleSubTabChange = (tab) => { activeSubTab.value = tab; currentPage.value = 1 }

const handleSearch = () => { currentPage.value = 1; ElMessage.success('搜索完成') }

const handleExport = () => { ElMessage.success('导出成功，请查收') }

const handleCardSelect = (videoId) => {
  const ids = [...props.selectedVideos]
  const idx = ids.indexOf(videoId)
  if (idx >= 0) { ids.splice(idx, 1) }
  else if (ids.length < 100) { ids.push(videoId) }
  else { ElMessage.warning('单次批量投放最多100条'); return }
  emitSelected(ids)
}

const emitSelected = (ids) => { emit('update:selectedVideos', ids) }

const handlePageChange = (page) => { currentPage.value = page }
const handlePageSizeChange = (size) => { pageSize.value = size; currentPage.value = 1 }

const removeFilter = (idx) => { appliedFilters.value.splice(idx, 1) }

watch(() => props.metricType, () => { activeSubTab.value = 'all'; currentPage.value = 1 })
</script>

<style scoped>
.video-list-section { background: #fff; border-radius: 8px; padding: 16px; }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.list-title { font-size: 16px; font-weight: 600; color: #262626; }
.monitor-hint { font-size: 13px; color: #999; }
.list-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.sub-tabs { display: flex; gap: 4px; }
.sub-tab { padding: 6px 16px; font-size: 13px; color: #595959; cursor: pointer; border-radius: 4px; transition: all 0.2s; }
.sub-tab:hover { background: #f5f5f5; }
.sub-tab.active { color: #1677ff; background: #e6f4ff; font-weight: 500; }
.tab-count { font-size: 12px; }
.toolbar-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.view-switch { display: flex; gap: 4px; }
.view-switch .el-button { padding: 6px 8px; }
.applied-filters { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.list-footer { margin-top: 16px; display: flex; justify-content: flex-end; }
.batch-badge :deep(.el-badge__content) { background-color: #1677ff; }
</style>

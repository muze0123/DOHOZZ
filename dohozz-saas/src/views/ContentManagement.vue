<template>
  <div class="content-management">
    <!-- ==================== 平台切换栏 ==================== -->
    <ContentPlatformNav
      :platforms="store.platformTabs"
      :active="store.activePlatform"
      @change="store.setActivePlatform"
    />

    <!-- ==================== 高级筛选区 ==================== -->
    <ContentFilterSection
      :filter-params="store.filters"
      :plan-options="store.planOptions"
      :tag-options="store.tagOptions"
      :spu-options="store.spuOptions"
      :department-options="store.departmentOptions"
      :medium-options="store.mediumOptions"
      :status-options="store.statusOptions"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- ==================== 数据概览区 ==================== -->
    <ContentStatsSection
      :stats="store.stats"
      :time-range-options="store.timeRangeOptions"
      :active-time-range="store.activeTimeRange"
      @time-range-change="store.setTimeRange"
      @more-click="handleMoreClick"
    />

    <!-- ==================== 内容列表区 ==================== -->
    <ContentListSection
      :content-list="store.contentList"
      :loading="store.contentLoading"
      :pagination="store.pagination"
      :search-keyword="store.searchKeyword"
      @search="store.setSearchKeyword"
      @confirm="handleConfirm"
      @export="store.exportContents"
      @view-detail="handleViewDetail"
      @edit="handleEdit"
      @delete="handleDelete"
      @archive="handleArchive"
      @copy="handleCopy"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @selection-change="handleSelectionChange"
    />

    <!-- ==================== 弹窗组件 ==================== -->
    <EditContentDialog
      v-model="store.isEditDialogVisible"
      :content="store.currentContent"
      :plan-options="store.planOptions"
      :tag-options="store.tagOptions"
      :spu-options="store.spuOptions"
      :department-options="store.departmentOptions"
      :medium-options="store.mediumOptions"
      @confirm="handleEditConfirm"
    />

    <ContentDetailDialog
      v-model="store.isDetailDialogVisible"
      :content="store.currentContent"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useContentManagementStore } from '@/stores/contentManagement'
import ContentPlatformNav from './ContentManagement/components/ContentPlatformNav.vue'
import ContentFilterSection from '@/views/components/ContentFilterSection.vue'
import ContentStatsSection from '@/views/components/ContentStatsSection.vue'
import ContentListSection from '@/views/components/ContentListSection.vue'
import EditContentDialog from './ContentManagement/dialogs/EditContentDialog.vue'
import ContentDetailDialog from './ContentManagement/dialogs/ContentDetailDialog.vue'

const store = useContentManagementStore()

const selectedIds = ref([])

onMounted(() => {
  store.fetchContentList()
  store.fetchStats()
  store.fetchOptions()
})

// ==================== 筛选操作 ====================
function handleQuery() {
  store.fetchContentList()
  store.fetchStats()
}

function handleReset() {
  store.resetFilters()
}

// ==================== 内容操作 ====================
function handleConfirm() {
  if (selectedIds.value.length === 0) return
  store.confirmContents(selectedIds.value)
}

function handleViewDetail(content) {
  store.currentContent = content
  store.isDetailDialogVisible = true
}

function handleEdit(content) {
  store.currentContent = content
  store.isEditDialogVisible = true
}

function handleEditConfirm(formData) {
  if (!store.currentContent) return
  store.updateContent(store.currentContent.id, formData)
  store.isEditDialogVisible = false
}

function handleDelete(id) {
  store.deleteContent(id)
}

function handleArchive(id) {
  store.archiveContent(id)
}

function handleCopy(content) {
  navigator.clipboard.writeText(content.url || content.id).then(() => {
    ElMessage.success('复制成功')
  })
}

// ==================== 分页 ====================
function handlePageChange(page) {
  store.setPagination(page, store.pagination.pageSize)
}

function handlePageSizeChange(pageSize) {
  store.setPagination(1, pageSize)
}

// ==================== 多选 ====================
function handleSelectionChange(ids) {
  selectedIds.value = ids
}

// ==================== 更多操作 ====================
function handleMoreClick() {
  // 预留：时间范围更多操作
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.content-management {
  @extend .page-container;
  background: #f5f5f5;
}
</style>

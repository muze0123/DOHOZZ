<template>
  <div class="influencer-tags">
    <!-- ==================== 顶部操作区 ==================== -->
    <div class="top-bar">
      <el-button type="primary" class="add-group-btn" @click="openAddGroupDialog">
        <el-icon><Plus /></el-icon>
        + 新增标签组
      </el-button>
      <div class="search-area">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索标签组/标签名称"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearchClear"
        >
          <template #suffix>
            <el-icon class="search-icon" @click="handleSearch">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- ==================== 表格区域 ==================== -->
    <div class="table-section">
      <!-- 表头 -->
      <div class="table-header">
        <span class="col-group">标签组</span>
        <span class="col-tags">标签</span>
        <span class="col-time">最后编辑时间</span>
        <span class="col-actions">操作</span>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="4" animated />
      </div>

      <!-- 空状态 -->
      <div v-else-if="tagGroupList.length === 0" class="empty-state">
        <el-empty description="暂无数据" />
      </div>

      <!-- 数据行 -->
      <div v-else class="table-body">
        <div
          v-for="(group, index) in tagGroupList"
          :key="group.tag_group_id"
          class="table-row"
        >
          <!-- 标签组列 -->
          <div class="col-group">
            <span class="group-name">{{ group.tag_group_name }}</span>
          </div>

          <!-- 标签列 -->
          <div class="col-tags">
            <div class="tags-wrapper">
              <!-- +添加按钮 -->
              <span class="tag-add-btn" @click="openAddTagDialog(group.tag_group_id)">+添加</span>
              <!-- 标签列表 -->
              <template v-for="tag in getDisplayTags(group)" :key="tag.tag_id">
                <span
                  class="tag-item"
                  :style="{ background: tag.tag_color + '1a', color: tag.tag_color, borderColor: tag.tag_color + '4d' }"
                >{{ tag.tag_name }}</span>
              </template>
              <!-- 展开按钮 -->
              <span
                v-if="group.tags.length > MAX_VISIBLE_TAGS"
                class="expand-btn"
                @click="toggleExpand(group.tag_group_id)"
              >
                {{ expandedGroups.has(group.tag_group_id) ? '收起' : '展开' }}
                <el-icon class="expand-icon" :class="{ rotated: expandedGroups.has(group.tag_group_id) }">
                  <ArrowDown />
                </el-icon>
              </span>
            </div>
          </div>

          <!-- 最后编辑时间 -->
          <div class="col-time">
            <span>{{ group.update_time }}</span>
          </div>

          <!-- 操作列 -->
          <div class="col-actions">
            <span class="action-btn" @click="openEditGroupDialog(group)">编辑</span>
            <span class="action-btn" @click="openDeleteDialog(group.tag_group_id)">删除</span>
            <span v-if="index > 0" class="action-btn" @click="handleMoveUp(group.tag_group_id)">上移</span>
            <span v-if="index < tagGroupList.length - 1" class="action-btn" @click="handleMoveDown(group.tag_group_id)">下移</span>
          </div>

          <!-- 标签数量统计 -->
          <div class="row-footer">
            <span class="tag-count">共{{ group.tags.length }}个标签</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 分页区域 ==================== -->
    <div v-if="total > 0" class="pagination-section">
      <div class="pagination-inner">
        <Pagination
          v-model="paginationState"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
        />
      </div>
    </div>

    <!-- ==================== 弹窗 ==================== -->
    <AddTagGroupDialog
      v-model="addGroupDialogVisible"
      :create-fn="createTagGroup"
      @success="fetchData"
    />
    <EditTagGroupDialog
      v-model="editGroupDialogVisible"
      :data="editingGroup"
      :update-fn="updateTagGroup"
      @success="fetchData"
    />
    <AddTagDialog
      v-model="addTagDialogVisible"
      :group-options="tagGroupOptions"
      :default-group-id="currentGroupId"
      :add-fn="addTag"
      @success="fetchData"
    />
    <DeleteConfirmDialog
      v-model="deleteDialogVisible"
      :tag-group-id="deletingGroupId"
      :delete-fn="deleteTagGroup"
      @success="fetchData"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  getTagGroupList,
  getTagGroupOptions,
  moveTagGroupUp,
  moveTagGroupDown,
  createTagGroup,
  updateTagGroup,
  addTag,
  deleteTagGroup
} from '@/api/influencerTags'
import AddTagGroupDialog from '@/views/components/TagDialogs/AddTagGroupDialog.vue'
import EditTagGroupDialog from '@/views/components/TagDialogs/EditTagGroupDialog.vue'
import AddTagDialog from '@/views/components/TagDialogs/AddTagDialog.vue'
import DeleteConfirmDialog from '@/views/components/TagDialogs/DeleteConfirmDialog.vue'
import Pagination from '@/components/Pagination.vue'

const MAX_VISIBLE_TAGS = 7

// ==================== 状态 ====================
const loading = ref(false)
const tagGroupList = ref([])
const tagGroupOptions = ref([])
const searchKeyword = ref('')
const paginationState = ref({ page: 1, pageSize: 10 })
const total = ref(0)

// 展开/折叠
const expandedGroups = ref(new Set())

// 弹窗
const addGroupDialogVisible = ref(false)
const editGroupDialogVisible = ref(false)
const editingGroup = ref({})
const addTagDialogVisible = ref(false)
const currentGroupId = ref('')
const deleteDialogVisible = ref(false)
const deletingGroupId = ref('')

// ==================== 方法 ====================

onMounted(() => {
  fetchData()
  fetchGroupOptions()
})

async function fetchData() {
  loading.value = true
  try {
    const res = await getTagGroupList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })
    if (res.code === 0) {
      tagGroupList.value = res.data.list
      total.value = res.data.pagination.total
    } else {
      ElMessage.error('搜索失败，请重试')
    }
  } catch {
    ElMessage.error('搜索失败，请重试')
  } finally {
    loading.value = false
  }
}

async function fetchGroupOptions() {
  try {
    const res = await getTagGroupOptions()
    if (res.code === 0) {
      tagGroupOptions.value = res.data
    }
  } catch {
    // ignore
  }
}

function getDisplayTags(group) {
  if (expandedGroups.value.has(group.tag_group_id)) {
    return group.tags
  }
  return group.tags.slice(0, MAX_VISIBLE_TAGS)
}

function toggleExpand(groupId) {
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value.delete(groupId)
  } else {
    expandedGroups.value.add(groupId)
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchData()
}

function handleSearchClear() {
  searchKeyword.value = ''
  currentPage.value = 1
  fetchData()
}

function handlePageSizeChange() {
  currentPage.value = 1
  fetchData()
}

// 新增标签组
function openAddGroupDialog() {
  addGroupDialogVisible.value = true
}

// 编辑标签组
function openEditGroupDialog(group) {
  editingGroup.value = { ...group }
  editGroupDialogVisible.value = true
}

// 添加标签
function openAddTagDialog(groupId) {
  currentGroupId.value = groupId
  addTagDialogVisible.value = true
}

// 删除确认
function openDeleteDialog(groupId) {
  deletingGroupId.value = groupId
  deleteDialogVisible.value = true
}

// 上移
async function handleMoveUp(groupId) {
  try {
    const res = await moveTagGroupUp(groupId)
    ElMessage.success(res.message)
    await fetchData()
  } catch {
    ElMessage.error('操作失败，请重试')
  }
}

// 下移
async function handleMoveDown(groupId) {
  try {
    const res = await moveTagGroupDown(groupId)
    ElMessage.success(res.message)
    await fetchData()
  } catch {
    ElMessage.error('操作失败，请重试')
  }
}
</script>

<style lang="scss" scoped>
.influencer-tags {
  padding: 16px 0 24px;
  min-height: 100vh;
  background: #f5f5f5;
}

// ==================== 顶部操作区 ====================
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: none;
  border-radius: 8px 8px 0 0;
  padding: 12px 16px;
}

.add-group-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  flex-shrink: 0;
}

.search-area {
  width: 320px;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
}

.search-icon {
  cursor: pointer;
  color: #999;
  &:hover {
    color: #1677ff;
  }
}

// ==================== 表格区域 ====================
.table-section {
  background: #fff;
  border: none;
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.table-header {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.col-group {
  width: 200px;
  flex-shrink: 0;
}

.col-tags {
  flex: 1;
  min-width: 0;
}

.col-time {
  width: 180px;
  flex-shrink: 0;
  text-align: center;
}

.col-actions {
  width: 200px;
  flex-shrink: 0;
  text-align: center;
}

// ==================== 数据行 ====================
.table-body {
  .table-row {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    transition: background 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #fafafa;
    }
  }
}

.col-group {
  width: 200px;
  flex-shrink: 0;
  padding-top: 4px;

  .group-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    word-break: break-all;

    &:hover {
      color: #1677ff;
    }
  }
}

.col-tags {
  flex: 1;
  min-width: 0;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
  color: #999;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    color: #1677ff;
    border-color: #1677ff;
  }
}

.tag-item {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: #1677ff;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }
}

.expand-icon {
  font-size: 12px;
  transition: transform 0.2s;

  &.rotated {
    transform: rotate(180deg);
  }
}

.col-time {
  width: 180px;
  flex-shrink: 0;
  text-align: center;
  font-size: 13px;
  color: #999;
  padding-top: 4px;
}

.col-actions {
  width: 200px;
  flex-shrink: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 2px;
}

.action-btn {
  font-size: 13px;
  color: #1677ff;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
}

.row-footer {
  width: 100%;
  padding-top: 8px;
  padding-left: 208px;

  .tag-count {
    font-size: 12px;
    color: #999;
  }
}

// ==================== 加载/空状态 ====================
.loading-state {
  padding: 40px 16px;
}

.empty-state {
  padding: 40px 0;
}

// ==================== 分页区域 ====================
.pagination-section {
  margin-top: 16px;
  background: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
}

.pagination-inner {
  display: flex;
  justify-content: center;
}
</style>

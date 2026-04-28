<template>
  <div class="content-tags">
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

    <div class="table-section">
      <div class="table-header">
        <span class="col-group">标签组</span>
        <span class="col-tags">标签</span>
        <span class="col-time">最后编辑时间</span>
        <span class="col-actions">操作</span>
      </div>

      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="4" animated />
      </div>
      <div v-else-if="tagGroupList.length === 0" class="empty-state">
        <el-empty description="暂无数据" />
      </div>
      <div v-else class="table-body">
        <div
          v-for="(group, index) in tagGroupList"
          :key="group.tag_group_id"
          class="table-row"
        >
          <div class="col-group">
            <span class="group-name">{{ group.tag_group_name }}</span>
          </div>

          <div class="col-tags">
            <div class="tags-wrapper">
              <span class="tag-add-btn" @click="openAddTagDialog(group.tag_group_id)">+添加</span>
              <template v-for="tag in getDisplayTags(group)" :key="tag.tag_id">
                <span
                  class="tag-item"
                  :style="{ background: tag.tag_color + '1a', color: tag.tag_color, borderColor: tag.tag_color + '4d' }"
                >{{ tag.tag_name }}</span>
              </template>
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

          <div class="col-time">
            <span>{{ group.update_time }}</span>
          </div>

          <div class="col-actions">
            <span class="action-btn" @click="openEditGroupDialog(group)">编辑</span>
            <span class="action-btn" @click="openDeleteDialog(group.tag_group_id)">删除</span>
            <span v-if="index > 0" class="action-btn" @click="handleMoveUp(group.tag_group_id)">上移</span>
            <span v-if="index < tagGroupList.length - 1" class="action-btn" @click="handleMoveDown(group.tag_group_id)">下移</span>
          </div>

          <div class="row-footer">
            <span class="tag-count">共{{ group.tags.length }}个标签</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="total > 0" class="pagination-section">
      <div class="pagination-inner">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="prev, pager, next, sizes, jumper, total"
          :pager-count="5"
          @current-change="fetchData"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>

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
import { ref, onMounted } from 'vue'
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
} from '@/api/contentTags'
import AddTagGroupDialog from '@/views/components/TagDialogs/AddTagGroupDialog.vue'
import EditTagGroupDialog from '@/views/components/TagDialogs/EditTagGroupDialog.vue'
import AddTagDialog from '@/views/components/TagDialogs/AddTagDialog.vue'
import DeleteConfirmDialog from '@/views/components/TagDialogs/DeleteConfirmDialog.vue'

const MAX_VISIBLE_TAGS = 7

const loading = ref(false)
const tagGroupList = ref([])
const tagGroupOptions = ref([])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const expandedGroups = ref(new Set())

const addGroupDialogVisible = ref(false)
const editGroupDialogVisible = ref(false)
const editingGroup = ref({})
const addTagDialogVisible = ref(false)
const currentGroupId = ref('')
const deleteDialogVisible = ref(false)
const deletingGroupId = ref('')

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

function openAddGroupDialog() {
  addGroupDialogVisible.value = true
}

function openEditGroupDialog(group) {
  editingGroup.value = { ...group }
  editGroupDialogVisible.value = true
}

function openAddTagDialog(groupId) {
  currentGroupId.value = groupId
  addTagDialogVisible.value = true
}

function openDeleteDialog(groupId) {
  deletingGroupId.value = groupId
  deleteDialogVisible.value = true
}

async function handleMoveUp(groupId) {
  try {
    const res = await moveTagGroupUp(groupId)
    ElMessage.success(res.message)
    await fetchData()
  } catch {
    ElMessage.error('操作失败，请重试')
  }
}

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
.content-tags {
  padding: 16px 0 24px;
  min-height: 100vh;
  background: #f5f5f5;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #e8e8e8;
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

.table-section {
  background: #fff;
  border: 1px solid #e8e8e8;
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
  font-size: 13px;
  color: #999;
  padding-top: 4px;
}

.col-actions {
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

.loading-state {
  padding: 40px 16px;
}

.empty-state {
  padding: 40px 0;
}

.pagination-section {
  margin-top: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px 16px;
}

.pagination-inner {
  display: flex;
  justify-content: center;
}
</style>

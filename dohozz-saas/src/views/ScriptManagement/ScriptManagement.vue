<template>
  <div class="script-management">
    <!-- ==================== 顶部操作区 ==================== -->
    <div class="top-bar">
      <el-button type="primary" class="add-btn" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        新增脚本
      </el-button>
      <div class="search-area">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索脚本名称 / 达人"
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

    <!-- ==================== 数据卡片 ==================== -->
    <div class="data-card">
      <div class="card-header">
        <h3 class="card-title">脚本列表</h3>
      </div>

      <div class="card-body">
        <el-table
          v-loading="loading"
          :data="scriptList"
          stripe
          style="width: 100%"
          empty-text="暂无数据"
        >
          <!-- 文件 -->
          <el-table-column label="文件" min-width="220">
            <template #default="{ row }">
              <div class="file-cell">
                <span class="file-icon" :class="'file-icon-' + row.file_type">
                  {{ getFileIconLabel(row.file_type) }}
                </span>
                <span class="file-name" :title="row.file_name">{{ row.file_name }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- 备注信息 -->
          <el-table-column label="备注信息" min-width="200">
            <template #default="{ row }">
              <div class="remark-cell" @click.stop="startEditRemark(row)" :class="{ 'is-editing': editingRemarkId === row.id }">
                <template v-if="editingRemarkId === row.id">
                  <el-input
                    v-model="remarkInput"
                    :rows="2"
                    type="textarea"
                    maxlength="500"
                    placeholder="请输入备注"
                    @blur="saveRemark(row)"
                    @keyup.enter.ctrl="saveRemark(row)"
                    @click.stop
                  />
                </template>
                <template v-else>
                  <span class="remark-text" v-if="row.remark">{{ row.remark }}</span>
                  <span class="remark-empty" v-else>--</span>
                </template>
              </div>
            </template>
          </el-table-column>

          <!-- 达人 -->
          <el-table-column label="达人" min-width="180">
            <template #default="{ row }">
              <div class="creator-cell">
                <img :src="row.creator_avatar" class="creator-avatar" />
                <div class="creator-info">
                  <span class="creator-name">{{ row.creator_name }}</span>
                  <span class="creator-account">{{ row.creator_account }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 关联计划 -->
          <el-table-column label="关联计划" min-width="140">
            <template #default="{ row }">
              <span v-if="row.plan_name">{{ row.plan_name }}</span>
              <span v-else class="text-muted">--</span>
            </template>
          </el-table-column>

          <!-- 上传时间 -->
          <el-table-column label="上传时间" width="170">
            <template #default="{ row }">
              <span class="time-text">{{ row.upload_time }}</span>
            </template>
          </el-table-column>

          <!-- 上传成员 -->
          <el-table-column label="上传成员" width="100">
            <template #default="{ row }">
              <span>{{ row.upload_member }}</span>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <div class="action-btns">
                <el-button link type="primary" size="small" @click="handleDownload(row)">
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
                <el-button link type="primary" size="small" @click="openEditDialog(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button link type="primary" size="small" @click="handleDelete(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="card-footer" v-if="total > 0">
        <Pagination
          v-model="paginationState"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
        />
      </div>
    </div>

    <!-- ==================== 弹窗 ==================== -->
    <ScriptFormDialog
      v-model="addDialogVisible"
      @success="fetchData"
    />
    <ScriptFormDialog
      v-model="editDialogVisible"
      :edit-data="editingScript"
      @success="fetchData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Search, Download, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getScriptList,
  deleteScript,
  updateScriptRemark
} from '@/api/scriptManagement'
import ScriptFormDialog from './dialogs/ScriptFormDialog.vue'
import Pagination from '@/components/Pagination.vue'

// ==================== 状态 ====================
const loading = ref(false)
const scriptList = ref([])
const searchKeyword = ref('')
const paginationState = ref({ page: 1, pageSize: 10 })
const total = ref(0)

// 弹窗
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const editingScript = ref(null)

// 备注内联编辑
const editingRemarkId = ref(null)
const remarkInput = ref('')

// ==================== 方法 ====================
onMounted(() => { fetchData() })

async function fetchData() {
  loading.value = true
  try {
    const res = await getScriptList({
      page: paginationState.value.page,
      pageSize: paginationState.value.pageSize,
      keyword: searchKeyword.value
    })
    if (res.code === 0) {
      scriptList.value = res.data.list
      total.value = res.data.pagination.total
    } else {
      ElMessage.error('加载失败，请重试')
    }
  } catch {
    ElMessage.error('加载失败，请重试')
  } finally {
    loading.value = false
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

function getFileIconLabel(type) {
  const map = {
    word: 'W',
    txt: 'T',
    pdf: 'P',
    ppt: 'PPT',
    excel: 'X',
    image: 'IMG'
  }
  return map[type] || '?'
}

function getFileTypeClass(type) {
  return `file-icon-${type}`
}

function openAddDialog() {
  addDialogVisible.value = true
}

function openEditDialog(row) {
  editingScript.value = { ...row }
  editDialogVisible.value = true
}

function startEditRemark(row) {
  editingRemarkId.value = row.id
  remarkInput.value = row.remark || ''
}

async function saveRemark(row) {
  const newRemark = remarkInput.value.trim()
  const oldRemark = row.remark || ''
  editingRemarkId.value = null

  if (newRemark === oldRemark) return

  try {
    const res = await updateScriptRemark(row.id, newRemark)
    if (res.code === 0) {
      row.remark = newRemark
      ElMessage.success('备注已更新')
    } else {
      ElMessage.error('更新失败')
    }
  } catch {
    ElMessage.error('更新失败，请重试')
  }
}

function handleDownload(row) {
  ElMessage.success(`下载 ${row.file_name}`)
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除脚本"${row.file_name}"吗？删除后无法恢复。`,
      '确认删除',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    const res = await deleteScript(row.id)
    if (res.code === 0) {
      ElMessage.success(res.message)
      fetchData()
    } else {
      ElMessage.error('删除失败，请重试')
    }
  } catch {
    // 取消
  }
}
</script>

<style lang="scss" scoped>
.script-management {
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

.add-btn {
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

// ==================== 数据卡片 ====================
.data-card {
  background: #fff;
  border: none;
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-body {
  padding: 0;
}

.card-footer {
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

// ==================== 表格单元格 ====================
.file-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-icon-word { background: #1677ff; }
.file-icon-txt { background: #636e72; }
.file-icon-pdf { background: #ff4d4f; }
.file-icon-ppt { background: #ff9f43; }
.file-icon-excel { background: #2ed573; }
.file-icon-image { background: #5f27cd; }

.file-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.file-name {
  font-size: 13px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}

.remark-cell {
  cursor: pointer;
  min-height: 28px;
  padding: 4px 0;

  &:not(.is-editing):hover {
    .remark-text {
      color: #1677ff;
    }
  }
}

.remark-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.remark-empty {
  font-size: 13px;
  color: #ccc;
}

.creator-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.creator-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.creator-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.creator-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.creator-account {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time-text {
  font-size: 13px;
  color: #666;
}

.text-muted {
  color: #ccc;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 0;
}
</style>

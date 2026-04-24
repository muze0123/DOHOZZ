<template>
  <div class="tag-management">
    <!-- ==================== 平台Tab区 ==================== -->
    <div class="platform-section">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key }"
          @click="handlePlatformChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <!-- ==================== 检索与时间筛选栏 ==================== -->
    <div class="filter-section">
      <div class="filter-row">
        <!-- 左侧：搜索框 -->
        <div class="search-area">
          <el-input
            v-model="searchInput"
            placeholder="请输入标签组名称/标签名称进行搜索"
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearchClear"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>

        <!-- 右侧：时间筛选 -->
        <div class="time-filter-area">
          <div class="time-tabs">
            <span
              v-for="tab in timeTabs"
              :key="tab.key"
              class="time-tab"
              :class="{ active: activeTimeFilter === tab.key }"
              @click="handleTimeFilterChange(tab.key)"
            >
              {{ tab.label }}
            </span>
          </div>
          <span class="time-range-text" v-if="timeRangeText">{{ timeRangeText }}</span>
        </div>
      </div>
    </div>

    <!-- ==================== 标签列表标题区 ==================== -->
    <div class="list-header">
      <div class="header-left">
        <h3 class="list-title">标签列表</h3>
        <span class="update-time">
          数据更新时间：{{ dataUpdateTime }}
          <el-icon class="question-icon" @click="showUpdateRuleDialog"><QuestionFilled /></el-icon>
        </span>
      </div>
      <div class="header-right">
        <el-button type="primary" class="add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          添加标签组
        </el-button>
      </div>
    </div>

    <!-- ==================== 标签组卡片展示区 ==================== -->
    <div class="cards-section">
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="3" animated />
      </div>
      <div v-else-if="filteredTagGroups.length === 0" class="empty-state">
        <el-empty description="暂无标签组" />
      </div>
      <div v-else class="cards-grid">
        <div v-for="group in paginatedTagGroups" :key="group.id" class="tag-group-card">
          <!-- 卡片头部 -->
          <div class="card-header">
            <span class="group-name" :title="group.name">{{ group.name }}</span>
            <div class="card-actions">
              <el-icon class="action-icon" @click="openEditDialog(group)"><Edit /></el-icon>
              <el-icon class="action-icon" @click="openDeleteDialog(group)"><Delete /></el-icon>
            </div>
          </div>

          <!-- 卡片数据表格 -->
          <div class="card-table">
            <el-table :data="group.tags" style="width: 100%" size="small">
              <el-table-column prop="rank" label="排名" width="60" align="center" />
              <el-table-column prop="name" label="标签" min-width="100">
                <template #default="{ row }">
                  <span class="tag-name">{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="influencerCount" label="达人数" width="80" align="right">
                <template #default="{ row }">
                  <span>{{ row.influencerCount || '--' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="gmv" label="成交金额" width="100" align="right">
                <template #default="{ row }">
                  <span>{{ row.gmv ? '¥' + formatNumber(row.gmv) : '--' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 卡片底部分页 -->
          <div class="card-footer">
            <el-pagination
              v-model:current-page="group.currentPage"
              :page-size="group.pageSize"
              :total="group.totalTags"
              layout="prev, pager, next"
              @current-change="(page) => handleCardPageChange(group, page)"
            />
            <span class="total-tags">总共{{ group.totalTags }}个标签</span>
          </div>
        </div>
      </div>

      <!-- 总计分页 -->
      <div v-if="filteredTagGroups.length > 0" class="pagination-area">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="totalTagGroups"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- ==================== 添加标签组弹窗 ==================== -->
    <el-dialog v-model="addDialogVisible" title="添加标签组" width="520px">
      <el-form :model="tagGroupForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item label="标签组名称" prop="name">
          <el-input
            v-model="tagGroupForm.name"
            placeholder="请输入标签组名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="tagGroupForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="tagGroupForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述（可选）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- ==================== 编辑标签组弹窗 ==================== -->
    <el-dialog v-model="editDialogVisible" title="编辑标签组" width="520px">
      <el-form :model="tagGroupForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item label="标签组名称" prop="name">
          <el-input
            v-model="tagGroupForm.name"
            placeholder="请输入标签组名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="tagGroupForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="tagGroupForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述（可选）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- ==================== 删除确认弹窗 ==================== -->
    <el-dialog v-model="deleteDialogVisible" title="删除标签组" width="420px">
      <div class="delete-dialog-content">
        <p class="delete-tip">确定要删除该标签组吗？</p>
        <p class="delete-warning">删除后将无法恢复</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" danger @click="handleDeleteConfirm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- ==================== 数据更新规则提示弹窗 ==================== -->
    <el-dialog v-model="updateRuleDialogVisible" title="数据更新规则" width="480px">
      <div class="rule-dialog-content">
        <p>标签数据每日凌晨2:00更新前一日的统计数据。</p>
        <p>数据更新为静默更新，不影响页面正常操作。</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="updateRuleDialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Search, Plus, Edit, Delete, QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ==================== 平台Tab ====================
const platformTabs = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('tiktok')

// ==================== 时间筛选 ====================
const timeTabs = [
  { key: 'all', label: '全部' },
  { key: '7d', label: '近7天' },
  { key: '30d', label: '近30天' },
  { key: 'custom', label: '自定义' }
]
const activeTimeFilter = ref('all')
const timeRangeText = ref('')

// ==================== 搜索 ====================
const searchInput = ref('')

// ==================== 数据更新 ====================
const dataUpdateTime = ref('2026-04-24 09:00:00')
const loading = ref(false)

// ==================== 标签组数据 ====================
const tagGroups = ref([
  {
    id: 1,
    name: '高转化标签组',
    description: '高转化率标签集合',
    platform: 'tiktok',
    currentPage: 1,
    pageSize: 10,
    totalTags: 25,
    tags: [
      { rank: 1, name: '美妆教程', influencerCount: 1520, gmv: 2560000 },
      { rank: 2, name: '护肤分享', influencerCount: 1280, gmv: 1980000 },
      { rank: 3, name: '时尚穿搭', influencerCount: 980, gmv: 1650000 },
      { rank: 4, name: '发型设计', influencerCount: 860, gmv: 1200000 },
      { rank: 5, name: '彩妆技巧', influencerCount: 720, gmv: 980000 }
    ]
  },
  {
    id: 2,
    name: '家居生活标签',
    description: '家居生活类标签',
    platform: 'tiktok',
    currentPage: 1,
    pageSize: 10,
    totalTags: 18,
    tags: [
      { rank: 1, name: '家居装饰', influencerCount: 890, gmv: 1450000 },
      { rank: 2, name: '收纳技巧', influencerCount: 650, gmv: 980000 },
      { rank: 3, name: '清洁好物', influencerCount: 540, gmv: 760000 },
      { rank: 4, name: '厨房用具', influencerCount: 420, gmv: 580000 }
    ]
  },
  {
    id: 3,
    name: '数码科技标签',
    description: '数码科技类标签',
    platform: 'tiktok',
    currentPage: 1,
    pageSize: 10,
    totalTags: 12,
    tags: [
      { rank: 1, name: '手机评测', influencerCount: 760, gmv: 2100000 },
      { rank: 2, name: '电脑科技', influencerCount: 580, gmv: 1680000 },
      { rank: 3, name: '智能穿戴', influencerCount: 420, gmv: 980000 }
    ]
  },
  {
    id: 4,
    name: '食品饮料标签',
    description: '食品饮料类标签',
    platform: 'tiktok',
    currentPage: 1,
    pageSize: 10,
    totalTags: 20,
    tags: [
      { rank: 1, name: '零食推荐', influencerCount: 1100, gmv: 1890000 },
      { rank: 2, name: '健康饮食', influencerCount: 920, gmv: 1420000 },
      { rank: 3, name: '饮品制作', influencerCount: 780, gmv: 1150000 }
    ]
  }
])

// 可选标签列表
const availableTags = ref([
  { id: 1, name: '美妆教程' },
  { id: 2, name: '护肤分享' },
  { id: 3, name: '时尚穿搭' },
  { id: 4, name: '发型设计' },
  { id: 5, name: '彩妆技巧' },
  { id: 6, name: '家居装饰' },
  { id: 7, name: '收纳技巧' },
  { id: 8, name: '清洁好物' },
  { id: 9, name: '厨房用具' },
  { id: 10, name: '手机评测' },
  { id: 11, name: '电脑科技' },
  { id: 12, name: '智能穿戴' },
  { id: 13, name: '零食推荐' },
  { id: 14, name: '健康饮食' },
  { id: 15, name: '饮品制作' }
])

// ==================== 分页 ====================
const currentPage = ref(1)
const pageSize = ref(10)

const totalTagGroups = computed(() => filteredTagGroups.value.length)

const filteredTagGroups = computed(() => {
  let result = tagGroups.value.filter(g => g.platform === activePlatform.value)

  if (searchInput.value) {
    const keyword = searchInput.value.toLowerCase()
    result = result.filter(g =>
      g.name.toLowerCase().includes(keyword) ||
      g.tags.some(t => t.name.toLowerCase().includes(keyword))
    )
  }

  return result
})

const paginatedTagGroups = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTagGroups.value.slice(start, end)
})

// ==================== 弹窗状态 ====================
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const updateRuleDialogVisible = ref(false)
const submitLoading = ref(false)

// ==================== 表单数据 ====================
const tagGroupForm = reactive({
  id: null,
  name: '',
  tags: [],
  description: ''
})

const formRules = {
  name: [
    { required: true, message: '请输入标签组名称', trigger: 'blur' }
  ],
  tags: [
    { required: true, message: '请选择标签', trigger: 'change' }
  ]
}

const addFormRef = ref(null)
const editFormRef = ref(null)

// 当前操作的标签组
const currentGroup = ref(null)

// ==================== 方法 ====================

// 平台切换
function handlePlatformChange(platform) {
  activePlatform.value = platform
  currentPage.value = 1
}

// 时间筛选切换
function handleTimeFilterChange(filter) {
  activeTimeFilter.value = filter
  if (filter === 'all') {
    timeRangeText.value = ''
  } else if (filter === '7d') {
    timeRangeText.value = '近7天'
  } else if (filter === '30d') {
    timeRangeText.value = '近30天'
  }
}

// 搜索
function handleSearch() {
  currentPage.value = 1
}

// 搜索清空
function handleSearchClear() {
  searchInput.value = ''
  currentPage.value = 1
}

// 卡片内分页变化
function handleCardPageChange(group, page) {
  group.currentPage = page
}

// 打开添加弹窗
function openAddDialog() {
  tagGroupForm.id = null
  tagGroupForm.name = ''
  tagGroupForm.tags = []
  tagGroupForm.description = ''
  addDialogVisible.value = true
}

// 打开编辑弹窗
function openEditDialog(group) {
  tagGroupForm.id = group.id
  tagGroupForm.name = group.name
  tagGroupForm.tags = group.tags.map(t => t.name)
  tagGroupForm.description = group.description || ''
  currentGroup.value = group
  editDialogVisible.value = true
}

// 打开删除弹窗
function openDeleteDialog(group) {
  currentGroup.value = group
  deleteDialogVisible.value = true
}

// 显示更新规则弹窗
function showUpdateRuleDialog() {
  updateRuleDialogVisible.value = true
}

// 添加提交
function handleAddSubmit() {
  addFormRef.value.validate((valid) => {
    if (!valid) return

    // 检查名称重复
    const exists = tagGroups.value.some(g => g.name === tagGroupForm.name && g.platform === activePlatform.value)
    if (exists) {
      ElMessage.warning('标签组名称已存在')
      return
    }

    submitLoading.value = true
    setTimeout(() => {
      const newGroup = {
        id: Date.now(),
        name: tagGroupForm.name,
        description: tagGroupForm.description,
        platform: activePlatform.value,
        currentPage: 1,
        pageSize: 10,
        totalTags: tagGroupForm.tags.length,
        tags: tagGroupForm.tags.map((name, idx) => ({
          rank: idx + 1,
          name,
          influencerCount: Math.floor(Math.random() * 1000),
          gmv: Math.floor(Math.random() * 1000000)
        }))
      }
      tagGroups.value.push(newGroup)
      submitLoading.value = false
      addDialogVisible.value = false
      ElMessage.success('添加成功')
    }, 500)
  })
}

// 编辑提交
function handleEditSubmit() {
  editFormRef.value.validate((valid) => {
    if (!valid) return

    // 检查名称重复（排除自身）
    const exists = tagGroups.value.some(g =>
      g.id !== tagGroupForm.id &&
      g.name === tagGroupForm.name &&
      g.platform === activePlatform.value
    )
    if (exists) {
      ElMessage.warning('标签组名称已存在')
      return
    }

    submitLoading.value = true
    setTimeout(() => {
      const group = tagGroups.value.find(g => g.id === tagGroupForm.id)
      if (group) {
        group.name = tagGroupForm.name
        group.description = tagGroupForm.description
        group.totalTags = tagGroupForm.tags.length
        group.tags = tagGroupForm.tags.map((name, idx) => ({
          rank: idx + 1,
          name,
          influencerCount: Math.floor(Math.random() * 1000),
          gmv: Math.floor(Math.random() * 1000000)
        }))
      }
      submitLoading.value = false
      editDialogVisible.value = false
      ElMessage.success('编辑成功')
    }, 500)
  })
}

// 删除确认
function handleDeleteConfirm() {
  submitLoading.value = true
  setTimeout(() => {
    const index = tagGroups.value.findIndex(g => g.id === currentGroup.value.id)
    if (index > -1) {
      tagGroups.value.splice(index, 1)
    }
    submitLoading.value = false
    deleteDialogVisible.value = false
    ElMessage.success('删除成功')
  }, 500)
}

// 格式化金额
function formatNumber(num) {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toLocaleString()
}
</script>

<style lang="scss" scoped>
.tag-management {
  padding: 16px 0 24px;
  min-height: 100vh;
  background: #f5f5f5;
}

// ==================== 平台Tab区 ====================
.platform-section {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px 8px 0 0;
  padding: 0 16px;
}

.platform-tabs {
  display: flex;
  gap: 24px;
}

.platform-tab {
  display: flex;
  align-items: center;
  padding: 12px 0;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    color: #333;
  }

  &.active {
    color: #1677ff;
    font-weight: 500;
    border-bottom-color: #1677ff;
  }
}

// ==================== 检索与时间筛选栏 ====================
.filter-section {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-top: none;
  padding: 12px 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.search-area {
  flex: 0 0 400px;
}

.search-input {
  width: 100%;
}

.time-filter-area {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.time-tabs {
  display: flex;
  gap: 8px;
}

.time-tab {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  background: #f5f5f5;
  transition: all 0.2s;

  &:hover {
    color: #1677ff;
  }

  &.active {
    color: #fff;
    background: #1677ff;
  }
}

.time-range-text {
  font-size: 13px;
  color: #666;
}

// ==================== 标签列表标题区 ====================
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-top: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.update-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #999;
}

.question-icon {
  cursor: pointer;
  color: #999;
  &:hover {
    color: #1677ff;
  }
}

.add-btn {
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

// ==================== 标签组卡片展示区 ====================
.cards-section {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 16px;
}

.loading-state {
  padding: 40px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 16px;
}

.tag-group-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.group-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-icon {
  cursor: pointer;
  color: #999;
  font-size: 16px;
  transition: color 0.2s;

  &:hover {
    color: #1677ff;
  }
}

.card-table {
  padding: 0;
}

.tag-name {
  color: #1677ff;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.total-tags {
  font-size: 13px;
  color: #999;
}

.pagination-area {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

// ==================== 弹窗样式 ====================
.delete-dialog-content {
  text-align: center;
  padding: 20px 0;
}

.delete-tip {
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
}

.delete-warning {
  font-size: 13px;
  color: #ff4d4f;
}

.rule-dialog-content {
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.8;
    margin: 0 0 8px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

// ==================== 表格样式 ====================
:deep(.el-table) {
  .el-table__header th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
    font-size: 13px;
  }

  .el-table__row {
    &:last-child td {
      border-bottom: none;
    }
  }
}
</style>

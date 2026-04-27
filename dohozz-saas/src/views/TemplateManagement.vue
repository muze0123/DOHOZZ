<template>
  <div class="template-management-page">
    <!-- 搜索和新增区域 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入模板名称搜索"
        style="width: 280px"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" :icon="Plus" @click="openAddDialog">新增</el-button>
    </div>

    <!-- Tab导航 -->
    <div class="tab-bar">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="handleTabChange(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="id" label="模板ID" width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="模板名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="scripts" label="话术内容" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.scripts[0] }}
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="封面图" width="100" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.imageUrl" class="image-icon" @click="handlePreviewImage(row.imageUrl)"><Picture /></el-icon>
            <span v-else class="no-image">暂无</span>
          </template>
        </el-table-column>
        <el-table-column prop="productId" label="关联商品ID" width="140" show-overflow-tooltip />
        <el-table-column prop="creatorName" label="创建人" width="100" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="useCount" label="使用次数" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <span :class="row.status === 1 ? 'status-active' : 'status-inactive'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-text">暂无数据</div>
        </template>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑模板' : '新增模板'"
      width="600px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="dialog-form">
        <div class="form-row">
          <span class="form-label">模板名称：</span>
          <el-input v-model="form.name" placeholder="请输入模板名称" style="width: 400px" />
        </div>
        <div class="form-row">
          <span class="form-label">话术内容：</span>
          <el-input
            v-model="form.scripts[0]"
            type="textarea"
            :rows="4"
            placeholder="请输入话术内容"
            style="width: 400px"
          />
        </div>
        <div class="form-row">
          <span class="form-label">封面图：</span>
          <el-input v-model="form.imageUrl" placeholder="请输入封面图URL" style="width: 400px" />
        </div>
        <div class="form-row">
          <span class="form-label">关联商品ID：</span>
          <el-input v-model="form.productId" placeholder="请输入关联商品ID" style="width: 400px" />
        </div>
        <div class="form-row">
          <span class="form-label">备注：</span>
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" style="width: 400px" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片预览弹窗 -->
    <el-dialog
      v-model="imagePreviewVisible"
      title="图片预览"
      width="600px"
    >
      <div class="image-preview-container">
        <img :src="previewImageUrl" alt="预览图片" style="max-width: 100%" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus, Picture, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ==== State ====
const activeTab = ref('contact')
const searchKeyword = ref('')
const loading = ref(false)
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const tabs = [
  { label: '触达模板', value: 'contact' },
  { label: '邀约模板', value: 'invite' },
  { label: '邮件模板', value: 'email' }
]

// Dialog state
const dialogVisible = ref(false)
const detailVisible = ref(false)
const imagePreviewVisible = ref(false)
const previewImageUrl = ref('')
const isEdit = ref(false)
const currentRow = ref(null)
const form = reactive({ name: '', scripts: [''], imageUrl: '', productId: '', remark: '' })

// Mock data
const mockTemplates = [
  { id: '2312312', name: '模板名称模板名称模板名称模板名称模板名称', scripts: ['话术内容话术内容话术内容话术内容话术内容话术内容话术内容话术内...'], imageUrl: '', productId: '3423123123122', creatorName: '张三', createTime: '2025-08-06 17:28:40', useCount: 1, status: 1, remark: '测试备注' },
  { id: '2312313', name: '夏季促销模板', scripts: ['亲，我们店铺现在有夏季促销活动，点击查看更多优惠', '您好，我们是XXX品牌官方旗舰店'], imageUrl: '', productId: '1234567890', creatorName: '李四', createTime: '2025-08-10 10:00:00', useCount: 15, status: 1, remark: '' },
  { id: '2312314', name: '新品推广模板', scripts: ['尊敬的用户，我们新品上线啦'], imageUrl: '', productId: '', creatorName: '王五', createTime: '2025-08-12 14:30:00', useCount: 0, status: 0, remark: '暂未启用' }
]

// ==== Handlers ====
const handleTabChange = (tab) => {
  activeTab.value = tab
  searchKeyword.value = ''
  pagination.page = 1
  loadData()
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = mockTemplates
    pagination.total = mockTemplates.length
    loading.value = false
  }, 300)
}

const openAddDialog = () => {
  isEdit.value = false
  currentRow.value = null
  form.name = ''
  form.scripts = ['']
  form.imageUrl = ''
  form.productId = ''
  form.remark = ''
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentRow.value = row
  form.name = row.name
  form.scripts = [...row.scripts]
  form.imageUrl = row.imageUrl
  form.productId = row.productId
  form.remark = row.remark
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessage.info(`删除模板: ${row.name}`)
}

const handleSave = () => {
  ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
  dialogVisible.value = false
  loadData()
}

const handlePreviewImage = (url) => {
  previewImageUrl.value = url
  imagePreviewVisible.value = true
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
  loadData()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  loadData()
}

// ==== Init ====
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.template-management-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Tab导航 */
.tab-bar {
  background: #FFFFFF;
  padding: 12px 24px;
  display: flex;
  gap: 8px;
  border-radius: 4px;

  .tab-item {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    background: #F5F5F5;
    color: #595959;

    &:hover {
      color: #1677FF;
    }

    &.active {
      background: #E6F4FF;
      color: #1677FF;
      font-weight: 500;
    }
  }
}

/* 搜索栏 */
.search-bar {
  background: #FFFFFF;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
}

/* 表格容器 */
.table-container {
  background: #FFFFFF;
  border-radius: 4px;
  padding: 0 0 16px;
}

.image-icon {
  font-size: 18px;
  color: #1677FF;
  cursor: pointer;
}

.no-image {
  color: #8C8C8C;
  font-size: 13px;
}

.status-active {
  color: #52C41A;
  font-size: 13px;
}

.status-inactive {
  color: #8C8C8C;
  font-size: 13px;
}

.empty-text {
  padding: 30px;
  color: #8C8C8C;
}

/* 分页栏 */
.pagination-bar {
  background: #FFFFFF;
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  border-radius: 4px;
}

/* 弹窗表单 */
.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .form-row {
    display: flex;
    align-items: flex-start;

    .form-label {
      width: 100px;
      font-size: 14px;
      color: #595959;
      flex-shrink: 0;
      line-height: 32px;
    }
  }
}

.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 400px;
  }
}

/* 弹窗通用样式 */
:deep(.custom-dialog) {
  .el-dialog__header {
    border-bottom: 1px solid #F0F0F0;
    margin-right: 0;
    padding: 16px 24px;

    .el-dialog__title {
      font-size: 15px;
      font-weight: 600;
      color: #262626;
    }
  }
  .el-dialog__body {
    padding: 24px;
  }
  .el-dialog__footer {
    border-top: 1px solid #F0F0F0;
    padding: 12px 24px;
  }
}
</style>

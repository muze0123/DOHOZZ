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
        <el-table-column prop="name" label="模板名称" min-width="160">
          <template #default="{ row }">
            <div class="template-name-cell">{{ row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="useCount" label="使用次数" width="100" sortable />
        <el-table-column prop="scripts" label="触达话术" min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.scripts.join('\n')" :show-after="300">
              <div class="script-preview">
                {{ row.scripts[0] }}{{ row.scripts.length > 1 ? '...' : '' }}
                <span v-if="row.scripts.length > 1" class="script-count">+{{ row.scripts.length - 1 }}</span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="图片" width="80">
          <template #default="{ row }">
            <div v-if="row.imageUrl" class="image-thumb" @click="previewImage(row.imageUrl)">
              <el-icon><Picture /></el-icon>
            </div>
            <span v-else class="no-image">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="productId" label="商品ID" width="160">
          <template #default="{ row }">
            <span v-if="row.productId" class="product-id-cell">{{ row.productId }}</span>
            <el-icon v-if="row.productId" class="copy-icon" @click="copyProductId(row.productId)"><DocumentCopy /></el-icon>
            <span v-else class="no-image">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="170" sortable />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetailDialog(row)">详情</el-button>
            <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
            <el-button type="primary" link @click="handleCopy(row)">复制</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增/编辑模板弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑触达模板' : '新增触达模板'"
      width="600px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="dialog-form">
        <!-- 模板名称 -->
        <div class="form-row">
          <span class="required-star">*</span>
          <span class="form-label">模板名称：</span>
          <el-input
            v-model="form.name"
            :maxlength="50"
            show-word-limit
            placeholder="请输入模板名称"
            style="width: 400px"
          />
        </div>

        <!-- 触达话术 (支持多个) -->
        <div class="form-row align-start">
          <span class="required-star">*</span>
          <span class="form-label">触达话术：</span>
          <div class="scripts-list">
            <div v-for="(script, idx) in form.scripts" :key="idx" class="script-row">
              <el-input
                v-model="form.scripts[idx]"
                type="textarea"
                :rows="2"
                placeholder="请输入触达话术"
                style="width: 340px; margin-right: 8px"
              />
              <el-button link type="danger" @click="removeScript(idx)" :disabled="form.scripts.length <= 1">删除</el-button>
            </div>
            <el-button link type="primary" @click="addScript" :disabled="form.scripts.length >= 10">
              + 添加触达话术
            </el-button>
          </div>
        </div>

        <!-- 图片上传 -->
        <div class="form-row align-start">
          <span class="form-label">图片：</span>
          <div class="image-upload-area">
            <div v-if="form.imageUrl" class="image-preview">
              <img :src="form.imageUrl" alt="preview" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />
              <div style="display: flex; gap: 8px; margin-top: 8px;">
                <el-button link type="primary" size="small" @click="previewImage(form.imageUrl)">查看</el-button>
                <el-button link type="danger" size="small" @click="form.imageUrl = ''">删除</el-button>
              </div>
            </div>
            <el-input v-else v-model="form.imageUrl" placeholder="请输入图片URL" style="width: 300px" />
          </div>
        </div>

        <!-- 商品ID -->
        <div class="form-row">
          <span class="form-label">商品ID：</span>
          <el-input v-model="form.productId" placeholder="请输入商品ID" style="width: 400px" />
        </div>

        <!-- 备注 -->
        <div class="form-row align-start">
          <span class="form-label">备注：</span>
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            :maxlength="100"
            show-word-limit
            placeholder="请输入备注"
            style="width: 400px"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 模板详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="模板详情"
      width="560px"
      class="custom-dialog"
    >
      <div class="detail-list">
        <div class="detail-row">
          <span class="detail-label">模板ID：</span>
          <span class="detail-value">{{ currentRow?.id || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">模板名称：</span>
          <span class="detail-value">{{ currentRow?.name || '-' }}</span>
        </div>
        <div class="detail-row align-start">
          <span class="detail-label">触达话术：</span>
          <div class="detail-scripts">
            <div v-for="(s, i) in (currentRow?.scripts || [])" :key="i">
              话术{{ i + 1 }}：{{ s }}
            </div>
          </div>
        </div>
        <div class="detail-row" v-if="currentRow?.imageUrl">
          <span class="detail-label">图片：</span>
          <img :src="currentRow.imageUrl" class="detail-thumb" @click="previewImage(currentRow.imageUrl)" />
        </div>
        <div class="detail-row">
          <span class="detail-label">商品ID：</span>
          <span class="detail-value">{{ currentRow?.productId || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">创建人：</span>
          <span class="detail-value">{{ currentRow?.creatorName || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">创建时间：</span>
          <span class="detail-value">{{ currentRow?.createTime || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">使用次数：</span>
          <span class="detail-value">{{ currentRow?.useCount ?? '-' }}</span>
        </div>
        <div class="detail-row" v-if="currentRow?.remark">
          <span class="detail-label">备注：</span>
          <span class="detail-value">{{ currentRow.remark }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片预览弹窗 -->
    <el-dialog
      v-model="imagePreviewVisible"
      width="800px"
    >
      <div class="image-preview-container">
        <img :src="previewImageUrl" alt="预览图片" style="max-width: 100%; display: block; margin: 0 auto;" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus, Picture, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

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
  ElMessageBox.confirm('删除后，该模板将无法恢复，请谨慎操作。', '确认删除该模板吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

const handleCopy = (row) => {
  ElMessage.success('复制成功')
}

const handleStatusChange = (row) => {
  ElMessage.success('状态已更新')
}

const copyProductId = (id) => {
  navigator.clipboard.writeText(id)
  ElMessage.success('复制成功')
}

const openDetailDialog = (row) => {
  currentRow.value = row
  detailVisible.value = true
}

const openEditDialog = (row) => {
  isEdit.value = true
  currentRow.value = row
  form.name = row.name
  form.scripts = [...row.scripts]
  form.imageUrl = row.imageUrl
  form.productId = row.productId
  form.remark = row.remark || ''
  dialogVisible.value = true
}

const previewImage = (url) => {
  previewImageUrl.value = url
  imagePreviewVisible.value = true
}

const addScript = () => {
  form.scripts.push('')
}

const removeScript = (idx) => {
  form.scripts.splice(idx, 1)
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
  gap: 20px;

  .form-row {
    display: flex;
    align-items: center;
    &.align-start { align-items: flex-start; }
    .required-star { color: #FF4D4F; margin-right: 4px; font-size: 14px; line-height: 32px; }
    .form-label { width: 90px; font-size: 14px; color: #595959; flex-shrink: 0; line-height: 32px; }
  }
}

.scripts-list { display: flex; flex-direction: column; gap: 8px; }
.script-row { display: flex; align-items: flex-start; }

.image-upload-area { display: flex; flex-direction: column; }
.image-preview { display: flex; flex-direction: column; }

.detail-list { display: flex; flex-direction: column; gap: 14px; }
.detail-row { display: flex; font-size: 14px; align-items: center; &.align-start { align-items: flex-start; } .detail-label { width: 80px; color: #595959; flex-shrink: 0; } .detail-value { color: #262626; flex: 1; } }
.detail-scripts { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
.detail-thumb { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; cursor: pointer; }

.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 400px;
  }
}

.script-count {
  color: #1677FF;
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

.template-name-cell {
  font-size: 14px;
  color: #262626;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.script-preview {
  font-size: 13px;
  color: #595959;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.image-thumb {
  width: 40px;
  height: 40px;
  background: #F5F5F5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8C8C8C;
  &:hover { background: #E8E8E8; }
}

.product-id-cell { margin-right: 4px; }
.copy-icon {
  cursor: pointer;
  color: #8C8C8C;
  &:hover { color: #1677FF; }
}

.no-image { color: #D9D9D9; }
</style>

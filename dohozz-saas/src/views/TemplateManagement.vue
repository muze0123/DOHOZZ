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
      <el-button type="primary" :icon="Plus" @click="openAddDialog">+ 新增{{ activeTab === 'contact' ? '触达' : activeTab === 'invite' ? '邀约' : '邮件' }}模板</el-button>
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

        <!-- 触达模板列 -->
        <template v-if="activeTab === 'contact'">
          <el-table-column prop="name" label="模板名称" min-width="160">
            <template #default="{ row }">
              <div class="template-name-cell">{{ row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="useCount" label="使用次数" width="100" sortable />
          <el-table-column prop="scripts" label="触达话术" min-width="200">
            <template #default="{ row }">
              <el-tooltip :content="(row.scripts || []).join('\n')" :show-after="300">
                <div class="script-preview">
                  {{ row.scripts?.[0] }}{{ (row.scripts?.length || 0) > 1 ? '...' : '' }}
                  <span v-if="(row.scripts?.length || 0) > 1" class="script-count">+{{ row.scripts.length - 1 }}</span>
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
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="(val) => handleStatusChange(val)" />
            </template>
          </el-table-column>
        </template>

        <!-- 邀约模板列 -->
        <template v-else-if="activeTab === 'invite'">
          <el-table-column prop="name" label="邀约名称" min-width="160">
            <template #default="{ row }">
              <div class="template-name-cell">{{ row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="useCount" label="使用次数" width="100" sortable />
          <el-table-column prop="deadline" label="截止日期" width="120" />
          <el-table-column prop="contactMethods" label="联系方式" min-width="140">
            <template #default="{ row }">
              <div class="contact-methods-cell">
                <div v-for="(cm, i) in (row.contactMethods || [])" :key="i" class="contact-method-item">
                  {{ cm.type }}：{{ cm.account }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="inviteScripts" label="邀约信息" min-width="200">
            <template #default="{ row }">
              <el-tooltip :content="(row.inviteScripts || []).join('\n')" :show-after="300">
                <div class="script-preview">
                  {{ row.inviteScripts?.[0] }}{{ (row.inviteScripts?.length || 0) > 1 ? '...' : '' }}
                  <span v-if="(row.inviteScripts?.length || 0) > 1" class="script-count">+{{ row.inviteScripts.length - 1 }}</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="cooperationPreference" label="合作偏好" width="120">
            <template #default="{ row }">
              <span class="preference-tag">{{ row.cooperationPreference || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="products" label="合作商品" width="100">
            <template #default="{ row }">
              <div v-if="row.products?.length" class="products-cell">
                <div class="product-thumb">
                  <el-icon><Picture /></el-icon>
                </div>
                <span>{{ row.products.length }}个</span>
                <span class="view-more" @click="openInviteDetailDialog(row)">></span>
              </div>
              <span v-else class="no-image">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="freeSample" label="免费样品" width="120">
            <template #default="{ row }">
              <div class="free-sample-cell" :class="row.freeSampleEnabled ? 'enabled' : 'disabled'">
                <span v-if="row.freeSampleEnabled">
                  已开启
                  <span class="sample-sub">自动批准申请</span>
                </span>
                <span v-else>已关闭</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="170" sortable />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="(val) => handleStatusChange(val)" />
            </template>
          </el-table-column>
        </template>

        <!-- 公共操作列 -->
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetailDialog(row)">详情</el-button>
            <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
            <el-button type="primary" link @click="openCopyDialog(row)">复制</el-button>
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
      :title="isEdit ? (activeTab === 'invite' ? '编辑邀约模板' : '编辑触达模板') : (activeTab === 'invite' ? '新增邀约模板' : '新增触达模板')"
      width="640px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="dialog-form">
        <!-- ===== 触达模板表单 ===== -->
        <template v-if="activeTab === 'contact'">
          <div class="form-row">
            <span class="required-star">*</span>
            <span class="form-label">模板名称：</span>
            <el-input v-model="form.name" :maxlength="50" show-word-limit placeholder="请输入模板名称" style="width: 400px" />
          </div>
          <div class="form-row align-start">
            <span class="required-star">*</span>
            <span class="form-label">触达话术：</span>
            <div class="scripts-list">
              <div v-for="(script, idx) in form.scripts" :key="idx" class="script-row">
                <el-input v-model="form.scripts[idx]" type="textarea" :rows="2" placeholder="请输入触达话术" style="width: 340px; margin-right: 8px" />
                <el-button link type="danger" @click="removeScript(idx)" :disabled="form.scripts.length <= 1">删除</el-button>
              </div>
              <el-button link type="primary" @click="addScript" :disabled="form.scripts.length >= 10">+ 添加触达话术</el-button>
            </div>
          </div>
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
          <div class="form-row">
            <span class="form-label">商品ID：</span>
            <el-input v-model="form.productId" placeholder="请输入商品ID" style="width: 400px" />
          </div>
          <div class="form-row align-start">
            <span class="form-label">备注：</span>
            <el-input v-model="form.remark" type="textarea" :rows="2" :maxlength="100" show-word-limit placeholder="请输入备注" style="width: 400px" />
          </div>
        </template>

        <!-- ===== 邀约模板表单 ===== -->
        <template v-else-if="activeTab === 'invite'">
          <div class="form-row">
            <span class="required-star">*</span>
            <span class="form-label">邀约名称：</span>
            <el-input v-model="form.name" :maxlength="50" show-word-limit placeholder="请输入邀约名称" style="width: 400px" />
          </div>
          <div class="form-row align-start">
            <span class="required-star">*</span>
            <span class="form-label">邀约话术：</span>
            <div class="scripts-list">
              <div v-for="(script, idx) in form.scripts" :key="idx" class="script-row">
                <el-input v-model="form.scripts[idx]" type="textarea" :rows="2" placeholder="请输入邀约话术" style="width: 340px; margin-right: 8px" />
                <el-button link type="danger" @click="removeScript(idx)" :disabled="form.scripts.length <= 1">删除</el-button>
              </div>
              <el-button link type="primary" @click="addScript" :disabled="form.scripts.length >= 10">+ 添加邀约话术</el-button>
            </div>
          </div>
          <div class="form-row">
            <span class="required-star">*</span>
            <span class="form-label">截止日期：</span>
            <el-date-picker v-model="form.deadline" type="date" placeholder="请选择截止日期" value-format="YYYY-MM-DD" style="width: 400px" />
          </div>
          <div class="form-row align-start">
            <span class="form-label">联系方式：</span>
            <div class="contact-list">
              <div v-for="(cm, idx) in form.contactMethods" :key="idx" class="contact-row">
                <el-select v-model="form.contactMethods[idx].type" placeholder="请选择" style="width: 120px; margin-right: 8px">
                  <el-option label="Viber" value="Viber" />
                  <el-option label="Facebook" value="Facebook" />
                  <el-option label="WhatsApp" value="WhatsApp" />
                  <el-option label="Instagram" value="Instagram" />
                </el-select>
                <el-input v-model="form.contactMethods[idx].account" placeholder="请输入账号" style="width: 200px; margin-right: 8px" />
                <el-button link type="danger" @click="removeContactMethod(idx)" :disabled="form.contactMethods.length <= 1">删除</el-button>
              </div>
              <el-button link type="primary" @click="addContactMethod" :disabled="form.contactMethods.length >= 5">+ 添加联系方式</el-button>
            </div>
          </div>
          <div class="form-row">
            <span class="required-star">*</span>
            <span class="form-label">合作偏好：</span>
            <el-select v-model="form.cooperationPreference" placeholder="请选择合作偏好" style="width: 400px">
              <el-option label="可购物视频" value="可购物视频" />
              <el-option label="可购物直播" value="可购物直播" />
              <el-option label="暂无偏好" value="暂无偏好" />
            </el-select>
          </div>
          <div class="form-row align-start">
            <span class="form-label">合作商品：</span>
            <div class="products-selected">
              <el-tag v-for="(p, idx) in form.products" :key="idx" closable @close="removeProduct(idx)" style="margin-right: 8px; margin-bottom: 4px;">
                {{ p.name }}
              </el-tag>
              <el-button link type="primary" @click="addProduct">+ 选择商品</el-button>
            </div>
          </div>
          <div class="form-row">
            <span class="form-label">免费样品：</span>
            <div class="free-sample-config">
              <el-switch v-model="form.freeSampleEnabled" />
              <span style="margin-left: 8px; font-size: 14px; color: #595959;">{{ form.freeSampleEnabled ? '已开启' : '已关闭' }}</span>
              <template v-if="form.freeSampleEnabled">
                <el-radio-group v-model="form.freeSampleAutoApprove" style="margin-left: 16px">
                  <el-radio :value="true">自动批准申请</el-radio>
                  <el-radio :value="false">手动审核申请</el-radio>
                </el-radio-group>
              </template>
            </div>
          </div>
          <div class="form-row align-start">
            <span class="form-label">备注：</span>
            <el-input v-model="form.remark" type="textarea" :rows="2" :maxlength="100" show-word-limit placeholder="请输入备注" style="width: 400px" />
          </div>
        </template>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 复制模板弹窗 -->
    <el-dialog
      v-model="copyDialogVisible"
      :title="activeTab === 'invite' ? '复制邀约模板' : '复制触达模板'"
      width="560px"
      class="custom-dialog"
    >
      <div class="dialog-form">
        <div class="form-row">
          <span class="form-label">{{ activeTab === 'invite' ? '邀约名称' : '模板名称' }}：</span>
          <el-input v-model="form.name" :maxlength="50" show-word-limit style="width: 380px" />
        </div>
        <div class="form-row">
          <span class="form-label">备注：</span>
          <el-input v-model="form.remark" type="textarea" :rows="2" :maxlength="100" show-word-limit placeholder="请输入备注" style="width: 380px" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="copyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="executeCopy">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 模板详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      :title="activeTab === 'invite' ? '邀约模板详情' : '触达模板详情'"
      width="560px"
      class="custom-dialog"
    >
      <div class="detail-list">
        <!-- 触达模板详情 -->
        <template v-if="activeTab === 'contact'">
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
              <div v-for="(s, i) in (currentRow?.scripts || [])" :key="i">话术{{ i + 1 }}：{{ s }}</div>
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
        </template>

        <!-- 邀约模板详情 -->
        <template v-else-if="activeTab === 'invite'">
          <div class="detail-row">
            <span class="detail-label">模板ID：</span>
            <span class="detail-value">{{ currentRow?.id || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">邀约名称：</span>
            <span class="detail-value">{{ currentRow?.name || '-' }}</span>
          </div>
          <div class="detail-row align-start">
            <span class="detail-label">邀约话术：</span>
            <div class="detail-scripts">
              <div v-for="(s, i) in (currentRow?.inviteScripts || [])" :key="i">话术{{ i + 1 }}：{{ s }}</div>
            </div>
          </div>
          <div class="detail-row">
            <span class="detail-label">截止日期：</span>
            <span class="detail-value">{{ currentRow?.deadline || '-' }}</span>
          </div>
          <div class="detail-row align-start">
            <span class="detail-label">联系方式：</span>
            <div class="detail-scripts">
              <div v-for="(cm, i) in (currentRow?.contactMethods || [])" :key="i">{{ cm.type }}：{{ cm.account }}</div>
            </div>
          </div>
          <div class="detail-row">
            <span class="detail-label">合作偏好：</span>
            <span class="detail-value">{{ currentRow?.cooperationPreference || '-' }}</span>
          </div>
          <div class="detail-row align-start">
            <span class="detail-label">合作商品：</span>
            <div class="detail-products">
              <div v-for="(p, i) in (currentRow?.products || [])" :key="i" class="detail-product-item">
                <el-icon><Picture /></el-icon>
                <span>{{ p.name }}</span>
              </div>
            </div>
          </div>
          <div class="detail-row">
            <span class="detail-label">免费样品：</span>
            <span class="detail-value" :style="{ color: currentRow?.freeSampleEnabled ? '#52C41A' : '#8C8C8C' }">
              {{ currentRow?.freeSampleEnabled ? `已开启，${currentRow?.freeSampleAutoApprove ? '自动批准申请' : '手动审核申请'}` : '已关闭' }}
            </span>
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
        </template>
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
const form = reactive({
  name: '',
  scripts: [''],
  imageUrl: '',
  productId: '',
  remark: '',
  // 邀约模板专用字段
  deadline: '',
  contactMethods: [{ type: 'Viber', account: '' }],
  cooperationPreference: '',
  products: [],
  freeSampleEnabled: false,
  freeSampleAutoApprove: false
})

// Mock data
const mockTemplates = [
  // 触达模板
  { id: '2312312', name: '模板名称模板名称模板名称模板名称模板名称', scripts: ['话术内容话术内容话术内容话术内容话术内容话术内容话术内容话术内...'], imageUrl: '', productId: '3423123123122', creatorName: '张三', createTime: '2025-08-06 17:28:40', useCount: 1, status: 1, remark: '测试备注' },
  { id: '2312313', name: '夏季促销模板', scripts: ['亲，我们店铺现在有夏季促销活动，点击查看更多优惠', '您好，我们是XXX品牌官方旗舰店'], imageUrl: '', productId: '1234567890', creatorName: '李四', createTime: '2025-08-10 10:00:00', useCount: 15, status: 1, remark: '' },
  { id: '2312314', name: '新品推广模板', scripts: ['尊敬的用户，我们新品上线啦'], imageUrl: '', productId: '', creatorName: '王五', createTime: '2025-08-12 14:30:00', useCount: 0, status: 0, remark: '暂未启用' },
  // 邀约模板
  { id: '3412341', name: '邀约模板示例', useCount: 3, deadline: '2025-09-04', contactMethods: [{ type: 'Viber', account: '123123' }, { type: 'Facebook', account: '456456' }], inviteScripts: ['邀约话术内容邀约话术内容话术内容话术内容...'], cooperationPreference: '可购物视频', products: [{ id: 'P001', name: '商品A' }, { id: 'P002', name: '商品B' }], freeSampleEnabled: true, freeSampleAutoApprove: true, creatorName: '张三', createTime: '2025-08-06 17:28:40', status: 1, remark: '邀约测试' },
  { id: '3412342', name: '直播合作邀约', useCount: 8, deadline: '2025-10-01', contactMethods: [{ type: 'WhatsApp', account: '987654' }], inviteScripts: ['您好，我们希望与您合作直播带货'], cooperationPreference: '可购物直播', products: [{ id: 'P003', name: '商品C' }], freeSampleEnabled: true, freeSampleAutoApprove: false, creatorName: '李四', createTime: '2025-08-15 09:00:00', status: 1, remark: '' }
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
    let data = mockTemplates.filter(t => {
      if (activeTab.value === 'contact') return !t.inviteScripts
      if (activeTab.value === 'invite') return !!t.inviteScripts
      return false
    })
    if (searchKeyword.value) {
      data = data.filter(t => t.name.includes(searchKeyword.value))
    }
    pagination.total = data.length
    tableData.value = data
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
  if (activeTab.value === 'invite') {
    form.deadline = ''
    form.contactMethods = [{ type: 'Viber', account: '' }]
    form.cooperationPreference = ''
    form.products = []
    form.freeSampleEnabled = false
    form.freeSampleAutoApprove = false
  }
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

const handleStatusChange = (newStatus) => {
  ElMessage.success(newStatus ? '启用成功' : '禁用成功')
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
  form.scripts = [...(row.scripts || row.inviteScripts || [''])]
  form.imageUrl = row.imageUrl || ''
  form.productId = row.productId || ''
  form.remark = row.remark || ''
  if (activeTab.value === 'invite') {
    form.deadline = row.deadline || ''
    form.contactMethods = row.contactMethods ? [...row.contactMethods] : [{ type: 'Viber', account: '' }]
    form.cooperationPreference = row.cooperationPreference || ''
    form.products = row.products ? [...row.products] : []
    form.freeSampleEnabled = row.freeSampleEnabled || false
    form.freeSampleAutoApprove = row.freeSampleAutoApprove || false
  }
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

const addContactMethod = () => { form.contactMethods.push({ type: 'Viber', account: '' }) }
const removeContactMethod = (idx) => { form.contactMethods.splice(idx, 1) }
const addProduct = () => { form.products.push({ id: 'P999', name: '新增商品' }) }
const removeProduct = (idx) => { form.products.splice(idx, 1) }

const copyDialogVisible = ref(false)
const openCopyDialog = (row) => {
  isEdit.value = false
  currentRow.value = row
  form.name = row.name + '-副本'
  form.scripts = [...(row.scripts || row.inviteScripts || [''])]
  form.imageUrl = row.imageUrl || ''
  form.productId = row.productId || ''
  form.remark = row.remark || ''
  // invite fields
  form.deadline = row.deadline || ''
  form.contactMethods = row.contactMethods ? [...row.contactMethods] : [{ type: 'Viber', account: '' }]
  form.cooperationPreference = row.cooperationPreference || ''
  form.products = row.products ? [...row.products] : []
  form.freeSampleEnabled = row.freeSampleEnabled || false
  form.freeSampleAutoApprove = row.freeSampleAutoApprove || false
  copyDialogVisible.value = true
}

const executeCopy = () => {
  ElMessage.success('复制成功')
  copyDialogVisible.value = false
  loadData()
}

const openInviteDetailDialog = (row) => {
  currentRow.value = row
  detailVisible.value = true
}

const handleSave = () => {
  if (!form.name || !form.name.trim()) {
    ElMessage.error('请输入模板名称')
    return
  }
  if (!form.scripts.some(s => s && s.trim())) {
    ElMessage.error('请输入触达话术')
    return
  }
  ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
  dialogVisible.value = false
  loadData()
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
  padding: 16px 0 24px;
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

/* 邀约模板相关样式 */
.contact-methods-cell {
  .contact-method-item {
    font-size: 13px;
    color: #595959;
    line-height: 1.5;
  }
}

.preference-tag {
  font-size: 13px;
  color: #1677FF;
  background: #E6F4FF;
  padding: 2px 8px;
  border-radius: 4px;
}

.products-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #595959;

  .product-thumb {
    width: 24px;
    height: 24px;
    background: #F5F5F5;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8C8C8C;
  }

  .view-more {
    cursor: pointer;
    color: #1677FF;
    font-weight: bold;
    &:hover { text-decoration: underline; }
  }
}

.free-sample-cell {
  font-size: 13px;
  color: #8C8C8C;
  line-height: 1.5;

  &.enabled { color: #52C41A; }
  &.disabled { color: #8C8C8C; }

  .sample-sub {
    display: block;
    font-size: 12px;
  }
}

.contact-list { display: flex; flex-direction: column; gap: 8px; }
.contact-row { display: flex; align-items: center; }
.products-selected { display: flex; flex-wrap: wrap; align-items: center; }
.free-sample-config { display: flex; align-items: center; }
</style>

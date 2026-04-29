<template>
  <div class="outreach-task-page">
    <!-- 区域一：顶部 Tab 切换栏 -->
    <div class="tabs-header">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '站内信' }"
        @click="handleTabChange('站内信')"
      >
        站内信
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '定向邀约' }"
        @click="handleTabChange('定向邀约')"
      >
        定向邀约
      </div>
      <div 
        class="tab-item disabled" 
        @click="handleTabChange('邮件')"
      >
        邮件
      </div>
    </div>

    <!-- 区域二：筛选条件区 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item" style="width: 220px;">
          <span class="filter-label">任务搜索</span>
          <el-input v-model="filters.taskSearch" placeholder="请输入任务名称/任务ID" clearable />
        </div>
        <div class="filter-item" style="width: 220px;">
          <span class="filter-label">达人搜索</span>
          <el-input v-model="filters.influencerSearch" placeholder="请输入达人名称/达人ID" clearable />
        </div>
        <div class="filter-item" style="width: 180px;">
          <span class="filter-label">任务状态</span>
          <el-select v-model="filters.status" placeholder="全部">
            <template v-if="activeTab === '站内信'">
              <el-option label="全部" value="全部" />
              <el-option label="待开始" value="待开始" />
              <el-option label="待执行" value="待执行" />
              <el-option label="执行中" value="执行中" />
              <el-option label="已暂停" value="已暂停" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已终止" value="已终止" />
            </template>
            <template v-else-if="activeTab === '定向邀约'">
              <el-option label="全部" value="全部" />
              <el-option label="待发送" value="待发送" />
              <el-option label="已发送" value="已发送" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已取消" value="已取消" />
            </template>
          </el-select>
        </div>
        <div class="filter-item" style="width: 220px;">
          <span class="filter-label">店铺</span>
          <el-select v-model="filters.shop" placeholder="所有店铺" filterable>
            <el-option label="所有店铺" value="所有店铺" />
            <el-option label="DOHOZZ旗舰店" value="DOHOZZ旗舰店" />
            <el-option label="DOHOZZ官方店" value="DOHOZZ官方店" />
            <el-option label="测试店铺" value="测试店铺" />
          </el-select>
        </div>
      </div>
      
      <div class="filter-row">
        <div class="filter-item" style="width: 260px;">
          <span class="filter-label">任务完成时间</span>
          <el-date-picker
            v-model="filters.finishTime"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div class="filter-item" style="width: 200px;">
          <span class="filter-label">创建人</span>
          <el-select v-model="filters.creator" placeholder="全部" filterable>
            <el-option label="全部" value="全部" />
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
          </el-select>
        </div>
        <div class="filter-item" style="width: 260px;">
          <span class="filter-label">创建时间</span>
          <el-date-picker
            v-model="filters.createTime"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        
        <div class="filter-actions">
          <el-button @click="resetFilters" class="btn-reset">重置</el-button>
          <el-button type="primary" @click="applyFilters" class="btn-search">查询</el-button>
        </div>
      </div>
    </div>

    <!-- 区域三：任务列表区 -->
    <div class="list-section">
      <div class="list-header">
        <div class="list-title">任务列表</div>
        <el-button type="primary" @click="handleCreateTask" class="btn-create">
          {{ activeTab === '站内信' ? '+ 新增私信任务' : '+ 新增邀约任务' }}
        </el-button>
      </div>
      
      <div class="overview-banner" v-if="activeTab === '站内信'">
        <div class="overview-item">
          <div class="overview-label">私信任务</div>
          <div class="overview-value">30</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">私信达人数</div>
          <div class="overview-value">666</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">私信达人中有回复的达人数</div>
          <div class="overview-value">100</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">所有回复的达人数</div>
          <div class="overview-value">100</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">回复率</div>
          <div class="overview-value">15.02%</div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table" v-if="activeTab === '站内信'">
          <thead>
            <tr>
              <th style="flex: 2">任务</th>
              <th style="width: 120px">店铺</th>
              <th style="width: 100px">任务状态</th>
              <th style="width: 130px">计划触达达人数</th>
              <th style="width: 120px">成功触达达人数</th>
              <th style="width: 150px">任务开始时间</th>
              <th style="width: 150px">任务完成时间</th>
              <th style="width: 70px">创建人</th>
              <th style="width: 150px" class="sortable">创建时间 <span class="sort-icon">↕</span></th>
              <th style="width: 120px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredList.length === 0">
              <td colspan="10">
                <div class="empty-state">
                  <svg class="empty-icon" viewBox="0 0 64 64" width="64" height="64" fill="#E8E8E8">
                    <path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2zm0 56C17.664 58 6 46.336 6 32S17.664 6 32 6s26 11.664 26 26-11.664 26-26 26zm14-28H18v-4h28v4z"/>
                  </svg>
                  <p>暂无相关任务，请调整筛选条件</p>
                </div>
              </td>
            </tr>
            <tr v-for="item in filteredList" :key="item.id">
              <td style="flex: 2">
                <div class="task-name" @click="handleTaskDetail(item)">{{ item.name }}</div>
                <div class="task-id">
                  ID：{{ item.id }} 
                  <span class="copy-icon" @click="handleCopy(item.id)">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  </span>
                </div>
              </td>
              <td style="width: 120px">{{ item.shop }}</td>
              <td style="width: 100px">
                <div class="status-tag" :class="getStatusClass(item.status)">
                  <span class="status-dot"></span>
                  {{ item.status }}
                </div>
              </td>
              <td style="width: 130px">
                <div class="plan-count">{{ item.planCount }}</div>
                <div v-if="item.status === '执行中'" class="progress-bar-wrapper">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (item.successCount / item.planCount * 100) + '%' }"></div>
                  </div>
                </div>
              </td>
              <td style="width: 120px">{{ item.successCount }}</td>
              <td style="width: 150px" class="time-col">{{ item.startTime }}</td>
              <td style="width: 150px" class="time-col">{{ item.endTime }}</td>
              <td style="width: 70px">{{ item.creator }}</td>
              <td style="width: 150px" class="time-col">{{ item.createTime }}</td>
              <td style="width: 120px">
                <div class="action-links">
                  <span @click="handleTaskDetail(item)">详情</span>
                  <span v-if="item.status === '待开始'" @click="handleEdit(item)">编辑</span>
                  <span v-if="['待开始', '待执行', '执行中'].includes(item.status)" @click="handlePause(item)">暂停</span>
                  <span v-if="item.status === '已暂停'" @click="handleResume(item)">恢复</span>
                  <span v-if="['待开始', '待执行', '执行中', '已暂停'].includes(item.status)" @click="handleTerminateDialog(item)">终止</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table class="data-table" v-if="activeTab === '定向邀约'">
          <thead>
            <tr>
              <th style="width: 150px">任务ID</th>
              <th style="flex: 2">任务名称</th>
              <th style="width: 150px">达人名称</th>
              <th style="width: 100px">状态</th>
              <th style="width: 180px">创建时间</th>
              <th style="width: 250px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredList.length === 0">
              <td colspan="6">
                <div class="empty-state">
                  <svg class="empty-icon" viewBox="0 0 64 64" width="64" height="64" fill="#E8E8E8">
                    <path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2zm0 56C17.664 58 6 46.336 6 32S17.664 6 32 6s26 11.664 26 26-11.664 26-26 26zm14-28H18v-4h28v4z"/>
                  </svg>
                  <p>暂无相关任务，请调整筛选条件</p>
                </div>
              </td>
            </tr>
            <tr v-for="item in filteredList" :key="item.id">
              <td style="width: 150px">{{ item.id }}</td>
              <td style="flex: 2">
                <div class="task-name" @click="handleTaskDetail(item)">{{ item.name }}</div>
              </td>
              <td style="width: 150px">{{ item.talentName }}</td>
              <td style="width: 100px">
                <div class="status-tag" :class="getInviteStatusClass(item.status)">
                  <span class="status-dot"></span>
                  {{ item.status }}
                </div>
              </td>
              <td style="width: 180px" class="time-col">{{ item.createTime }}</td>
              <td style="width: 250px">
                <div class="action-links">
                  <span @click="handleTaskDetail(item)">查看详情</span>
                  <span @click="handleSendDM(item)">发送站内信</span>
                  <span @click="handleSendEmail(item)">发送邮件</span>
                  <span @click="handleEdit(item)">编辑</span>
                  <span @click="handleDeleteDialog(item)">删除</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <!-- 区域四：分页栏 -->
    <div class="pagination-section" v-if="filteredList.length > 0">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="pagination.total"
        layout="prev, pager, next, sizes, jumper, total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      >
        <template #total>
          <span class="custom-total">共{{ pagination.total }}条记录 第{{ pagination.page }}/{{ Math.ceil(pagination.total / pagination.pageSize) }}页</span>
        </template>
      </el-pagination>
    </div>

    <!-- 终止任务确认弹窗 (站内信) -->
    <el-dialog
      v-model="showTerminateModal"
      title="确认终止该站内信任务吗？"
      width="400px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="terminate-content">
        终止后不可恢复，请谨慎操作。
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTerminateModal = false">取消</el-button>
          <el-button type="primary" @click="confirmTerminate">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 1. 新增/编辑邀约任务弹窗 (定向邀约) -->
    <el-dialog
      v-model="showInviteFormModal"
      :title="inviteFormState.isEdit ? '编辑邀约任务' : '新增邀约任务'"
      width="500px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <el-form ref="inviteFormRef" :model="inviteFormState" :rules="inviteFormRules" label-width="110px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="inviteFormState.name" placeholder="请输入任务名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="达人名称" prop="talentName">
          <el-select v-model="inviteFormState.talentName" placeholder="请选择达人" style="width: 100%">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input v-model="inviteFormState.content" type="textarea" :rows="3" placeholder="请输入任务内容" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="任务完成时间" prop="finishTime">
          <el-date-picker v-model="inviteFormState.finishTime" type="date" placeholder="请选择完成时间" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="店铺" prop="shop">
          <el-select v-model="inviteFormState.shop" placeholder="请选择店铺" style="width: 100%">
            <el-option label="店铺1" value="店铺1" />
            <el-option label="店铺2" value="店铺2" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="inviteFormState.remark" type="textarea" :rows="2" placeholder="请输入备注" maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showInviteFormModal = false">取消</el-button>
          <el-button type="primary" @click="submitInviteForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 2. 删除任务确认弹窗 (定向邀约) -->
    <el-dialog
      v-model="showDeleteModal"
      title="确认删除该任务吗？"
      width="400px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="terminate-content">
        删除后，该任务将无法恢复，请谨慎操作。
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDeleteModal = false">取消</el-button>
          <el-button type="primary" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 3. 发送站内信弹窗 (定向邀约) -->
    <el-dialog
      v-model="showSendDMModal"
      title="发送站内信"
      width="500px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <el-form ref="sendDMFormRef" :model="sendDMForm" :rules="sendRules" label-width="80px">
        <el-form-item label="收件人">
          <div class="readonly-text">{{ activeItem?.talentName }}（达人ID：123456）</div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="sendDMForm.title" placeholder="请输入标题" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="sendDMForm.content" type="textarea" :rows="5" placeholder="请输入内容" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSendDMModal = false">取消</el-button>
          <el-button type="primary" @click="submitSendDM">发送</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 4. 发送邮件弹窗 (定向邀约) -->
    <el-dialog
      v-model="showSendEmailModal"
      title="发送邮件"
      width="500px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <el-form ref="sendEmailFormRef" :model="sendEmailForm" :rules="sendRules" label-width="80px">
        <el-form-item label="收件人">
          <div class="readonly-text">{{ activeItem?.talentName }}（达人ID：123456）</div>
        </el-form-item>
        <el-form-item label="邮箱">
          <div class="readonly-text">test@example.com</div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="sendEmailForm.title" placeholder="请输入标题" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="sendEmailForm.content" type="textarea" :rows="5" placeholder="请输入内容" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSendEmailModal = false">取消</el-button>
          <el-button type="primary" @click="submitSendEmail">发送</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 5. 任务详情弹窗 (定向邀约) -->
    <el-dialog
      v-model="showDetailModal"
      title="任务详情"
      width="500px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="任务ID">{{ activeItem?.id }}</el-descriptions-item>
        <el-descriptions-item label="任务名称">{{ activeItem?.name }}</el-descriptions-item>
        <el-descriptions-item label="达人名称">{{ activeItem?.talentName }}</el-descriptions-item>
        <el-descriptions-item label="任务内容">{{ activeItem?.content || '暂无内容' }}</el-descriptions-item>
        <el-descriptions-item label="任务状态">{{ activeItem?.status }}</el-descriptions-item>
        <el-descriptions-item label="任务完成时间">{{ activeItem?.finishTime || '– –' }}</el-descriptions-item>
        <el-descriptions-item label="店铺">{{ activeItem?.shop || '所有店铺' }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ activeItem?.creator || '张三' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ activeItem?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ activeItem?.remark || '暂无备注' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailModal = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('定向邀约')

const filters = reactive({
  taskSearch: '',
  influencerSearch: '',
  status: '全部',
  shop: '所有店铺',
  finishTime: [],
  creator: '全部',
  createTime: []
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 40
})

// === Mock Data for 站内信 ===
const tableData = ref([
  { id: '10001', name: '双十一站内信任务', shop: 'DOHOZZ旗舰店', status: '待开始', planCount: 100, successCount: 0, startTime: '– –', endTime: '– –', creator: '张三', createTime: '2025-10-01 10:00:00' },
  { id: '10002', name: '新品上市触达', shop: 'DOHOZZ官方店', status: '待执行', planCount: 200, successCount: 0, startTime: '2025-10-10 12:00:00', endTime: '– –', creator: '李四', createTime: '2025-10-02 11:30:00' },
  { id: '10003', name: '日常沟通任务A', shop: 'DOHOZZ旗舰店', status: '执行中', planCount: 500, successCount: 150, startTime: '2025-10-05 09:00:00', endTime: '– –', creator: '王五', createTime: '2025-10-03 14:20:00' },
])

// === Mock Data for 定向邀约 ===
const inviteTableData = ref([
  { id: '2312312', name: '测试任务名称', talentName: '张三', status: '待发送', createTime: '2025-08-08 18:26:25', content: '测试任务内容', finishTime: '2025-09-02', shop: '店铺1', remark: '测试备注', creator: '李四' },
  { id: '2312313', name: '五一邀约活动', talentName: '李四', status: '已发送', createTime: '2025-08-09 10:20:00', content: '五一活动邀请', finishTime: '2025-09-10', shop: '店铺2', remark: '尽快回复', creator: '王五' },
  { id: '2312314', name: '品牌入驻邀请', talentName: '王五', status: '已完成', createTime: '2025-08-10 09:15:00', content: '品牌入驻', finishTime: '2025-08-20', shop: '店铺1', remark: '', creator: '李四' },
  { id: '2312315', name: '下架商品沟通', talentName: '赵六', status: '已取消', createTime: '2025-08-11 11:30:00', content: '下架通知', finishTime: '', shop: '所有店铺', remark: '取消任务', creator: '王五' },
])

const filteredList = computed(() => {
  let result = []
  if (activeTab.value === '站内信') {
    result = tableData.value
  } else if (activeTab.value === '定向邀约') {
    result = inviteTableData.value
  }
  
  if (filters.status !== '全部') {
    result = result.filter(item => item.status === filters.status)
  }
  if (filters.taskSearch) {
    result = result.filter(item => item.name.includes(filters.taskSearch) || item.id === filters.taskSearch)
  }
  // more filters logic...
  
  return result
})

const handleTabChange = (tabName) => {
  if (tabName === '邮件') {
    ElMessage.info('功能建设中，敬请期待')
    return
  }
  activeTab.value = tabName
  resetFilters()
}

const resetFilters = () => {
  filters.taskSearch = ''
  filters.influencerSearch = ''
  filters.status = '全部'
  filters.shop = '所有店铺'
  filters.finishTime = []
  filters.creator = '全部'
  filters.createTime = []
  pagination.page = 1
}

const applyFilters = () => {
  pagination.page = 1
}

// ==== Common Item Handling ====
const activeItem = ref(null)

// ==== DM Actions ====
const showTerminateModal = ref(false)
const terminatingItem = ref(null)

const handleTerminateDialog = (item) => {
  terminatingItem.value = item
  showTerminateModal.value = true
}

const confirmTerminate = () => {
  if (terminatingItem.value) {
    terminatingItem.value.status = '已终止'
    ElMessage.success('终止任务成功')
  }
  showTerminateModal.value = false
  terminatingItem.value = null
}

const handlePause = (item) => {
  item.status = '已暂停'
  ElMessage.success('暂停成功')
}

const handleResume = (item) => {
  item.status = '执行中' 
  ElMessage.success('恢复成功')
}

const handleCopy = (id) => {
  navigator.clipboard.writeText(id).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

// ==== Invite Actions ====
const showInviteFormModal = ref(false)
const showDeleteModal = ref(false)
const showSendDMModal = ref(false)
const showSendEmailModal = ref(false)
const showDetailModal = ref(false)

const inviteFormRef = ref(null)
const sendDMFormRef = ref(null)
const sendEmailFormRef = ref(null)

const inviteFormState = reactive({
  isEdit: false,
  id: '',
  name: '',
  talentName: '',
  content: '',
  finishTime: '',
  shop: '',
  remark: ''
})

const sendDMForm = reactive({
  title: '',
  content: ''
})

const sendEmailForm = reactive({
  title: '',
  content: ''
})

// Validation Rules
const inviteFormRules = {
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { max: 50, message: '任务名称不能超过50字', trigger: 'blur' }
  ],
  talentName: [
    { required: true, message: '请选择达人', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入任务内容', trigger: 'blur' },
    { max: 200, message: '任务内容不能超过200字', trigger: 'blur' }
  ]
}

const sendRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 50, message: '标题不能超过50字', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { max: 500, message: '内容不能超过500字', trigger: 'blur' }
  ]
}

// Handlers
const handleCreateTask = () => {
  if (activeTab.value === '站内信') {
    ElMessage.success('跳转新增私信任务...')
  } else {
    inviteFormState.isEdit = false
    inviteFormState.id = ''
    inviteFormState.name = ''
    inviteFormState.talentName = ''
    inviteFormState.content = ''
    inviteFormState.finishTime = ''
    inviteFormState.shop = ''
    inviteFormState.remark = ''
    showInviteFormModal.value = true
    nextTick(() => inviteFormRef.value?.clearValidate())
  }
}

const handleEdit = (item) => {
  if (activeTab.value === '站内信') {
    ElMessage.success(`编辑任务: ${item.name}`)
  } else {
    inviteFormState.isEdit = true
    inviteFormState.id = item.id
    inviteFormState.name = item.name
    inviteFormState.talentName = item.talentName
    inviteFormState.content = item.content || ''
    inviteFormState.finishTime = item.finishTime || ''
    inviteFormState.shop = item.shop || ''
    inviteFormState.remark = item.remark || ''
    showInviteFormModal.value = true
    nextTick(() => inviteFormRef.value?.clearValidate())
  }
}

const submitInviteForm = () => {
  inviteFormRef.value?.validate((valid) => {
    if (valid) {
      if (!inviteFormState.isEdit) {
        inviteTableData.value.unshift({
          id: String(Date.now()).slice(-7),
          name: inviteFormState.name,
          talentName: inviteFormState.talentName,
          status: '待发送',
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          content: inviteFormState.content,
          finishTime: inviteFormState.finishTime,
          shop: inviteFormState.shop,
          remark: inviteFormState.remark,
          creator: '当前用户'
        })
      } else {
        const idx = inviteTableData.value.findIndex(t => t.id === inviteFormState.id)
        if (idx !== -1) {
          inviteTableData.value[idx].name = inviteFormState.name
          inviteTableData.value[idx].talentName = inviteFormState.talentName
          inviteTableData.value[idx].content = inviteFormState.content
          inviteTableData.value[idx].finishTime = inviteFormState.finishTime
          inviteTableData.value[idx].shop = inviteFormState.shop
          inviteTableData.value[idx].remark = inviteFormState.remark
        }
      }
      ElMessage.success('保存成功')
      showInviteFormModal.value = false
    } else {
      ElMessage.error('保存失败，请重试')
    }
  })
}

const handleTaskDetail = (item) => {
  if (activeTab.value === '站内信') {
    ElMessage.success(`打开任务详情: ${item.name}`)
  } else {
    activeItem.value = item
    showDetailModal.value = true
  }
}

const handleDeleteDialog = (item) => {
  if (item.status === '已完成') {
    ElMessage.warning('已完成的任务不能删除')
    return
  }
  activeItem.value = item
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (activeItem.value) {
    const idx = inviteTableData.value.findIndex(t => t.id === activeItem.value.id)
    if (idx !== -1) {
      inviteTableData.value.splice(idx, 1)
      ElMessage.success('删除成功')
    }
  }
  showDeleteModal.value = false
  activeItem.value = null
}

const handleSendDM = (item) => {
  activeItem.value = item
  sendDMForm.title = ''
  sendDMForm.content = ''
  showSendDMModal.value = true
  nextTick(() => sendDMFormRef.value?.clearValidate())
}

const submitSendDM = () => {
  sendDMFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('发送成功')
      if (activeItem.value) activeItem.value.status = '已发送'
      showSendDMModal.value = false
    } else {
      ElMessage.error('发送失败，请重试')
    }
  })
}

const handleSendEmail = (item) => {
  activeItem.value = item
  sendEmailForm.title = ''
  sendEmailForm.content = ''
  showSendEmailModal.value = true
  nextTick(() => sendEmailFormRef.value?.clearValidate())
}

const submitSendEmail = () => {
  sendEmailFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('发送成功')
      if (activeItem.value) activeItem.value.status = '已发送'
      showSendEmailModal.value = false
    } else {
      ElMessage.error('发送失败，请重试')
    }
  })
}

const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
}

const handlePageChange = (page) => {
  pagination.page = page
}

const getStatusClass = (status) => {
  const map = {
    '待开始': 'status-pending',
    '待执行': 'status-waiting',
    '执行中': 'status-running',
    '已暂停': 'status-paused',
    '已完成': 'status-completed',
    '已终止': 'status-terminated'
  }
  return map[status] || ''
}

const getInviteStatusClass = (status) => {
  const map = {
    '待发送': 'status-pending',
    '已发送': 'status-running',
    '已完成': 'status-completed',
    '已取消': 'status-terminated'
  }
  return map[status] || ''
}
</script>

<style lang="scss" scoped>
.outreach-task-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
}

/* 区域一：顶部 Tab */
.tabs-header {
  display: flex;
  height: 52px;
  background: #FFFFFF;
  border-bottom: 1px solid #F0F0F0;
  padding: 0 24px;
  gap: 32px;
  margin-bottom: 16px;
}

.tab-item {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 15px;
  font-weight: 400;
  color: #595959;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: #262626;
  }

  &.active {
    font-size: 16px;
    font-weight: 700;
    color: #262626;
    border-bottom: 2px solid #262626;
  }

  &.disabled {
    color: #BFBFBF;
    cursor: not-allowed;
    
    &:hover {
      color: #BFBFBF;
    }
  }
}

/* 区域二：筛选条件 */
.filter-section {
  background: #FFFFFF;
  padding: 16px 24px;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row {
  display: flex;
  align-items: center;
  height: 44px;
  gap: 24px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .filter-label {
    flex-shrink: 0;
    font-size: 13px;
    color: #595959;
    text-align: right;
  }
  
  :deep(.el-input__wrapper), :deep(.el-select__wrapper) {
    box-shadow: 0 0 0 1px #D9D9D9 inset;
    height: 32px;
    border-radius: 4px;
    
    &.is-focus {
      box-shadow: 0 0 0 1px #1677FF inset;
    }
  }

  :deep(.el-input__inner) {
    font-size: 13px;
    &::placeholder {
      color: #BFBFBF;
    }
  }

  :deep(.el-date-editor) {
    width: 100%;
    height: 32px;
    .el-range-input {
      font-size: 13px;
    }
  }
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;

  .el-button {
    height: 32px;
    width: 72px;
    padding: 0;
    border-radius: 4px;
    font-size: 13px;
  }

  .btn-search {
    background: #1677FF;
    border-color: #1677FF;
  }

  .btn-reset {
    background: #FFFFFF;
    border-color: #D9D9D9;
    color: #595959;
  }
}

/* 区域三：任务列表 */
.list-section {
  background: #FFFFFF;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 0 24px;

  .list-title {
    font-size: 15px;
    font-weight: 600;
    color: #262626;
  }

  .btn-create {
    height: 32px;
    padding: 0 16px;
    border-radius: 4px;
    background: #1677FF;
    font-size: 13px;
  }
}

.overview-banner {
  display: flex;
  background: #F7F8FA;
  padding: 16px 24px;
  
  .overview-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #E8E8E8;
    padding-left: 16px;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      border-right: none;
    }

    .overview-label {
      font-size: 12px;
      color: #8C8C8C;
      margin-bottom: 6px;
    }

    .overview-value {
      font-size: 20px;
      font-weight: 600;
      color: #262626;
    }
  }
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th, td {
    text-align: left;
    padding: 12px 16px;
    box-sizing: border-box;
  }

  th {
    height: 44px;
    background: #FAFAFA;
    font-size: 13px;
    color: #8C8C8C;
    font-weight: 400;
    border-bottom: 1px solid #F0F0F0;

    &.sortable {
      cursor: pointer;
      .sort-icon {
        font-size: 10px;
        margin-left: 2px;
      }
    }
  }

  td {
    min-height: 56px;
    border-bottom: 1px solid #F5F5F5;
    font-size: 14px;
    color: #262626;
    vertical-align: middle;
  }

  tr:hover td {
    background-color: #FAFAFA;
  }
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  cursor: pointer;
  margin-bottom: 4px;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #1677FF;
  }
}

.task-id {
  font-size: 12px;
  color: #8C8C8C;
  display: flex;
  align-items: center;

  .copy-icon {
    margin-left: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #BFBFBF;
    
    &:hover {
      color: #1677FF;
    }
  }
}

.time-col {
  font-size: 13px;
  color: #595959;
}

/* 状态标签 */
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  white-space: nowrap;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
  }

  &.status-pending {
    background: #F5F5F5;
    color: #595959;
    .status-dot { background: #D9D9D9; }
  }
  &.status-waiting {
    background: #FFF7E6;
    color: #FA8C16;
    .status-dot { background: #FA8C16; }
  }
  &.status-running {
    background: #E6F4FF;
    color: #1677FF;
    .status-dot { background: #1677FF; }
  }
  &.status-paused {
    background: #FFF7E6;
    color: #FA8C16;
    .status-dot { background: #FA8C16; }
  }
  &.status-completed {
    background: #F6FFED;
    color: #52C41A;
    .status-dot { background: #52C41A; }
  }
  &.status-terminated {
    background: #FFF2F0;
    color: #FF4D4F;
    .status-dot { background: #FF4D4F; }
  }
}

/* 进度条 */
.plan-count {
  margin-bottom: 4px;
}

.progress-bar-wrapper {
  margin-top: 4px;
}

.progress-bar {
  width: 140px;
  height: 6px;
  background: #E8E8E8;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1677FF;
  border-radius: 3px;
}

/* 操作链接 */
.action-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  span {
    color: #1677FF;
    font-size: 13px;
    cursor: pointer;
    
    &:hover {
      color: #4096FF;
      text-decoration: underline;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #8C8C8C;
  font-size: 14px;
  
  .empty-icon {
    margin-bottom: 16px;
  }
}

/* 区域四：分页栏 */
.pagination-section {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  padding: 12px 24px;
  border-top: 1px solid #F0F0F0;
  margin-top: 16px;

  :deep(.el-pagination) {
    justify-content: center;
    
    .el-pager li {
      background: #FFFFFF;
      border: none;
      border-radius: 4px;
      margin: 0 4px;
      min-width: 32px;
      height: 32px;
      color: #595959;
      font-weight: 400;

      &:hover {
        border-color: #1677FF;
        color: #1677FF;
      }
      
      &.is-active {
        background: #1677FF;
        border-color: #1677FF;
        color: #FFFFFF;
      }
    }

    button {
      background: #FFFFFF;
      border: none;
      border-radius: 4px;
      height: 32px;
      min-width: 32px;
      margin: 0 4px;

      &:hover:not(:disabled) {
        border-color: #1677FF;
        color: #1677FF;
      }
    }

    .el-select .el-input {
      width: 100px;
    }
  }

  .custom-total {
    margin-left: 16px;
    font-size: 13px;
    color: #595959;
  }
}

/* 弹窗通用 */
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
  .terminate-content {
    font-size: 13px;
    color: #595959;
  }
  .readonly-text {
    font-size: 14px;
    color: #262626;
  }
}
</style>

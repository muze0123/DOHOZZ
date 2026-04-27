<template>
  <div class="plan-management-page">
    <!-- 平台切换栏 -->
    <div class="platform-bar">
      <div
        v-for="tab in platformTabs"
        :key="tab.key"
        class="platform-tab"
        :class="{ active: filters.platform === tab.key }"
        @click="handlePlatformChange(tab.key)"
      >
        <span v-if="tab.key === 'douyin'" class="platform-icon douyin"></span>
        <span v-else-if="tab.key === 'xiaohongshu'" class="platform-icon xiaohongshu"></span>
        <span>{{ tab.label }}</span>
      </div>
    </div>

    <!-- 计划分组标签栏 -->
    <div class="group-tabs-bar">
      <div class="group-tabs-scroll">
        <div
          v-for="group in planGroups"
          :key="group.id"
          class="group-tab"
          :class="{ active: filters.groupId === group.id }"
          @click="handleGroupChange(group.id)"
        >
          {{ group.name }}({{ group.planCount }})
        </div>
        <div class="group-tab manage-btn" @click="showGroupDialog = true">
          <span class="plus-icon">+</span> 管理计划分组
        </div>
      </div>
    </div>

    <!-- 列表操作栏 -->
    <div class="list-action-bar">
      <div class="action-title">计划列表</div>
      <div class="action-controls">
        <el-input
          v-model="filters.keyword"
          placeholder="输入计划名称"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filters.status" placeholder="计划状态" clearable class="status-select">
          <el-option label="全部状态" value="" />
          <el-option label="进行中" value="ongoing" />
          <el-option label="已完成" value="completed" />
          <el-option label="已暂停" value="paused" />
        </el-select>
        <el-dropdown trigger="click" @command="handleSortChange">
          <el-button class="sort-btn">
            <el-icon><Sort /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="createTime" :class="{ 'is-active': sortBy === 'createTime' }">按创建时间</el-dropdown-item>
              <el-dropdown-item command="updateTime" :class="{ 'is-active': sortBy === 'updateTime' }">按更新时间</el-dropdown-item>
              <el-dropdown-item command="progress" :class="{ 'is-active': sortBy === 'progress' }">按进度</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleAddPlan">
          <el-button type="primary" class="add-btn">
            + 新增计划
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="add">新增普通计划</el-dropdown-item>
              <el-dropdown-item command="copy">复制计划</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 计划卡片列表 -->
    <div v-if="!loading && pagedPlans.length > 0" class="plan-cards-grid">
      <div
        v-for="plan in pagedPlans"
        :key="plan.id"
        class="plan-card"
        :class="getCardClass(plan.status)"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="header-left">
            <span class="plan-name" @click="handleViewDetail(plan)">{{ plan.name }}</span>
            <span class="status-tag" :class="plan.status">
              <span class="status-dot"></span>
              {{ plan.statusLabel }}
            </span>
            <span class="plan-time">{{ plan.startTime }} ~ {{ plan.endTime }}</span>
          </div>
          <div class="header-right">
            <el-button link class="edit-btn" @click="handleEditPlan(plan)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-dropdown trigger="click" @command="(cmd) => handleMoreAction(cmd, plan)">
              <el-button link class="more-btn">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="copy">复制计划</el-dropdown-item>
                  <el-dropdown-item command="archive">归档计划</el-dropdown-item>
                  <el-dropdown-item command="export">导出报告</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除计划</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 卡片主体 -->
        <div class="card-body">
          <div class="progress-ring-container" @click="handleViewDetail(plan)">
            <el-progress
              type="circle"
              :percentage="plan.viewProgress"
              :color="getProgressColor(plan.status, plan.viewProgress)"
              :stroke-width="10"
              :width="100"
            >
              <template #default>
                <span class="progress-percent">{{ plan.viewProgress }}%</span>
              </template>
            </el-progress>
          </div>
          <div class="progress-bars">
            <div class="progress-item" @click="handleViewDetail(plan)">
              <div class="progress-label">
                <span>播放量</span>
                <el-icon class="info-icon" @click.stop="showMetricDialog('view')"><QuestionFilled /></el-icon>
              </div>
              <el-progress
                :percentage="plan.viewProgress"
                :color="getProgressColor(plan.status, plan.viewProgress)"
                :stroke-width="8"
              />
              <div class="progress-values">{{ formatNumber(plan.viewCurrent) }} / {{ formatNumber(plan.viewTarget) }}</div>
            </div>
            <div class="progress-item" @click="handleViewDetail(plan)">
              <div class="progress-label">
                <span>互动数</span>
                <el-icon class="info-icon" @click.stop="showMetricDialog('interaction')"><QuestionFilled /></el-icon>
              </div>
              <el-progress
                :percentage="plan.interactionProgress"
                :color="getProgressColor(plan.status, plan.interactionProgress)"
                :stroke-width="8"
              />
              <div class="progress-values">{{ formatNumber(plan.interactionCurrent) }} / {{ formatNumber(plan.interactionTarget) }}</div>
            </div>
            <div class="progress-item" @click="handleViewDetail(plan)">
              <div class="progress-label">
                <span>达人合作目标</span>
                <el-icon class="info-icon" @click.stop="showMetricDialog('streamer')"><QuestionFilled /></el-icon>
              </div>
              <el-progress
                :percentage="plan.streamerProgress"
                :color="getProgressColor(plan.status, plan.streamerProgress)"
                :stroke-width="8"
              />
              <div class="progress-values">{{ plan.streamerCurrent }} / {{ plan.streamerTarget }}</div>
            </div>
          </div>
        </div>

        <!-- 卡片底部 -->
        <div class="card-footer">
          <div class="footer-left">
            <span class="content-label">内容种草</span>
            <span class="content-count">{{ plan.contentCount }}</span>
            <span class="platform-badge" :class="plan.platform">{{ plan.platformLabel }}</span>
          </div>
          <div class="footer-right">
            <span class="member-info" @click.stop="showMemberDialog(plan)">{{ plan.memberRange }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="empty-state">
      <el-empty description="暂无计划" />
    </div>

    <!-- 分页 -->
    <div v-if="filteredPlans.length > 0" class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="filteredPlans.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- 新增/编辑计划弹窗 -->
    <el-dialog
      v-model="planDialogVisible"
      :title="isEditMode ? '编辑计划' : '新增计划'"
      width="560px"
      :destroy-on-close="true"
    >
      <el-form :model="planForm" label-width="120px" class="plan-form">
        <el-form-item label="计划名称" required>
          <el-input v-model="planForm.name" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="平台" required>
          <el-select v-model="planForm.platform" placeholder="选择平台" style="width: 100%">
            <el-option label="全部" value="all" />
            <el-option label="抖音" value="douyin" />
            <el-option label="小红书" value="xiaohongshu" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组" required>
          <el-select v-model="planForm.groupId" placeholder="选择分组" style="width: 100%">
            <el-option
              v-for="g in planGroups"
              :key="g.id"
              :label="`${g.name}(${g.planCount})`"
              :value="g.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划状态" required>
          <el-select v-model="planForm.status" placeholder="选择状态" style="width: 100%">
            <el-option label="进行中" value="ongoing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已暂停" value="paused" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-date-picker
            v-model="planForm.startTime"
            type="date"
            placeholder="选择开始时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker
            v-model="planForm.endTime"
            type="date"
            placeholder="选择结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="播放量目标" required>
          <el-input-number v-model="planForm.viewTarget" :min="0" :step="1000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="互动数目标" required>
          <el-input-number v-model="planForm.interactionTarget" :min="0" :step="100" style="width: 100%" />
        </el-form-item>
        <el-form-item label="达人合作目标" required>
          <el-input-number v-model="planForm.streamerTarget" :min="0" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="planForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="planDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmPlan">确定</el-button>
      </template>
    </el-dialog>

    <!-- 计划分组管理弹窗 -->
    <el-dialog v-model="showGroupDialog" title="计划分组管理" width="600px" :destroy-on-close="true">
      <div class="group-toolbar">
        <el-button type="primary" @click="handleAddGroup">+ 新增分组</el-button>
      </div>
      <el-table :data="pagedGroups" class="group-table">
        <el-table-column prop="name" label="分组名称" min-width="200" />
        <el-table-column prop="planCount" label="计划数量" width="120" align="center" />
        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditGroup(row)">编辑</el-button>
            <el-button
              v-if="row.id !== 'group_all'"
              link
              type="danger"
              @click="handleDeleteGroup(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="groupPagination.page"
          v-model:page-size="groupPagination.pageSize"
          :page-sizes="[10, 20]"
          :total="planGroups.length"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-dialog>

    <!-- 新增/编辑分组弹窗 -->
    <el-dialog
      v-model="groupEditDialogVisible"
      :title="isEditGroup ? '编辑分组' : '新增分组'"
      width="400px"
      :destroy-on-close="true"
    >
      <el-form :model="groupForm" label-width="80px">
        <el-form-item label="分组名称" required>
          <el-input v-model="groupForm.name" placeholder="请输入分组名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupEditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmGroup">确定</el-button>
      </template>
    </el-dialog>

    <!-- 指标说明弹窗 -->
    <el-dialog v-model="showMetricDialogVisible" :title="metricDialogTitle" width="480px" :destroy-on-close="true">
      <div class="metric-content">
        <p v-if="metricType === 'view'">
          播放量是指内容在平台上的播放次数总和。<br><br>
          <strong>计算方式：</strong><br>
          1. 抖音平台：视频播放次数<br>
          2. 小红书平台：笔记阅读次数<br><br>
          <strong>注意事项：</strong><br>
          1. 播放量数据每日更新一次<br>
          2. 播放量数据仅供参考，不作为唯一标准
        </p>
        <p v-else-if="metricType === 'interaction'">
          互动数是指用户对内容的互动行为总和，包括点赞、评论、收藏、分享等。<br><br>
          <strong>计算方式：</strong><br>
          1. 抖音平台：点赞 + 评论 + 收藏 + 分享<br>
          2. 小红书平台：点赞 + 收藏 + 评论<br><br>
          <strong>注意事项：</strong><br>
          1. 互动数数据每日更新一次<br>
          2. 互动数反映用户参与度，是内容质量的重要指标
        </p>
        <p v-else-if="metricType === 'streamer'">
          达人合作目标是指计划内需要合作的达人数量。<br><br>
          <strong>计算方式：</strong><br>
          1. 统计已确认合作的达人数量<br>
          2. 每个达人在合作期内只计算一次<br><br>
          <strong>注意事项：</strong><br>
          1. 达人合作数量按合作周期统计<br>
          2. 同一达人多个合作项目分开计算
        </p>
      </div>
      <template #footer>
        <el-button type="primary" @click="showMetricDialogVisible = false">确定</el-button>
      </template>
    </el-dialog>

    <!-- 项目成员弹窗 -->
    <el-dialog v-model="showMemberDialogVisible" title="项目成员" width="400px" :destroy-on-close="true">
      <div class="member-content">
        <p>{{ currentPlan?.memberRange }}</p>
      </div>
      <template #footer>
        <el-button @click="showMemberDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Sort, Edit, MoreFilled, QuestionFilled, ArrowDown } from '@element-plus/icons-vue'
import {
  getPlans,
  getPlanGroups,
  addPlan,
  updatePlan,
  deletePlan,
  copyPlan,
  archivePlan,
  addGroup,
  updateGroup,
  deleteGroup
} from '@/api/planManagement'

const loading = ref(false)

// 平台选项
const platformTabs = [
  { key: 'all', label: '全部' },
  { key: 'douyin', label: '抖音' },
  { key: 'xiaohongshu', label: '小红书' }
]

// 筛选条件
const filters = reactive({
  platform: 'all',
  groupId: 'group_all',
  keyword: '',
  status: ''
})

// 排序
const sortBy = ref('createTime')

// 分页
const pagination = reactive({ page: 1, pageSize: 10 })

// 数据
const planGroups = ref([])
const plans = ref([])

// 过滤后的计划
const filteredPlans = computed(() => {
  let result = plans.value

  if (filters.platform !== 'all') {
    result = result.filter(p => p.platform === filters.platform)
  }
  if (filters.groupId !== 'group_all') {
    result = result.filter(p => p.groupId === filters.groupId)
  }
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(kw))
  }
  if (filters.status) {
    result = result.filter(p => p.status === filters.status)
  }

  // 排序
  if (sortBy.value === 'createTime') {
    result = [...result].sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  } else if (sortBy.value === 'updateTime') {
    result = [...result].sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))
  } else if (sortBy.value === 'progress') {
    result = [...result].sort((a, b) => b.viewProgress - a.viewProgress)
  }

  return result
})

const pagedPlans = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredPlans.value.slice(start, end)
})

// 分组管理
const showGroupDialog = ref(false)
const groupPagination = reactive({ page: 1, pageSize: 10 })
const pagedGroups = computed(() => {
  const start = (groupPagination.page - 1) * groupPagination.pageSize
  const end = start + groupPagination.pageSize
  return planGroups.value.slice(start, end)
})

// 计划弹窗
const planDialogVisible = ref(false)
const isEditMode = ref(false)
const currentPlanId = ref(null)
const planForm = reactive({
  name: '',
  platform: 'all',
  groupId: 'group_all',
  status: 'ongoing',
  startTime: '',
  endTime: '',
  viewTarget: 0,
  interactionTarget: 0,
  streamerTarget: 0,
  remark: ''
})

// 分组编辑弹窗
const groupEditDialogVisible = ref(false)
const isEditGroup = ref(false)
const currentGroupId = ref(null)
const groupForm = reactive({ name: '' })

// 指标说明弹窗
const showMetricDialogVisible = ref(false)
const metricType = ref('')
const metricDialogTitle = computed(() => {
  const titles = { view: '播放量说明', interaction: '互动数说明', streamer: '达人合作目标说明' }
  return titles[metricType.value] || ''
})

// 成员弹窗
const showMemberDialogVisible = ref(false)
const currentPlan = ref(null)

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const [groupsRes, plansRes] = await Promise.all([
      getPlanGroups(),
      getPlans({ page: 1, pageSize: 100 })
    ])
    if (groupsRes.code === 0) {
      planGroups.value = groupsRes.data
    }
    if (plansRes.code === 0) {
      plans.value = plansRes.data.list
    }
  } catch (e) {
    console.error('加载数据失败', e)
  } finally {
    loading.value = false
  }
}

// 平台切换
function handlePlatformChange(key) {
  filters.platform = key
  pagination.page = 1
  ElMessage.success('平台切换成功')
}

// 分组切换
function handleGroupChange(groupId) {
  filters.groupId = groupId
  pagination.page = 1
}

// 搜索
function handleSearch() {
  pagination.page = 1
  if (filteredPlans.value.length === 0) {
    ElMessage.info('暂无搜索结果')
  } else {
    ElMessage.success('搜索成功')
  }
}

// 排序
function handleSortChange(command) {
  sortBy.value = command
  ElMessage.success('排序已更新')
}

// 新增计划
function handleAddPlan(command) {
  if (command === 'copy') {
    ElMessage.info('请先选择一个计划进行复制')
    return
  }
  isEditMode.value = false
  currentPlanId.value = null
  resetPlanForm()
  planDialogVisible.value = true
}

// 编辑计划
function handleEditPlan(plan) {
  isEditMode.value = true
  currentPlanId.value = plan.id
  Object.assign(planForm, {
    name: plan.name,
    platform: plan.platform,
    groupId: plan.groupId,
    status: plan.status,
    startTime: plan.startTime,
    endTime: plan.endTime,
    viewTarget: plan.viewTarget,
    interactionTarget: plan.interactionTarget,
    streamerTarget: plan.streamerTarget,
    remark: plan.remark
  })
  planDialogVisible.value = true
}

// 确认计划
async function handleConfirmPlan() {
  if (!planForm.name.trim()) {
    ElMessage.warning('请输入计划名称')
    return
  }
  if (!planForm.startTime) {
    ElMessage.warning('请选择开始时间')
    return
  }
  if (!planForm.endTime) {
    ElMessage.warning('请选择结束时间')
    return
  }
  if (new Date(planForm.endTime) < new Date(planForm.startTime)) {
    ElMessage.warning('结束时间不能早于开始时间')
    return
  }

  const group = planGroups.value.find(g => g.id === planForm.groupId)
  const groupName = group?.name || '全部计划'

  try {
    if (isEditMode.value) {
      const res = await updatePlan(currentPlanId.value, { ...planForm, groupName })
      if (res.code === 0) {
        ElMessage.success('编辑计划成功')
        planDialogVisible.value = false
        await loadData()
      }
    } else {
      const res = await addPlan({ ...planForm, groupName })
      if (res.code === 0) {
        ElMessage.success('新增计划成功')
        planDialogVisible.value = false
        await loadData()
      }
    }
  } catch (e) {
    ElMessage.error('操作失败，请重试')
  }
}

// 更多操作
async function handleMoreAction(command, plan) {
  switch (command) {
    case 'copy':
      try {
        await ElMessageBox.confirm(`确认复制计划「${plan.name}」？`, '复制计划', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info'
        })
        const res = await copyPlan(plan.id)
        if (res.code === 0) {
          ElMessage.success('复制计划成功')
          await loadData()
        }
      } catch {}
      break
    case 'archive':
      try {
        await ElMessageBox.confirm(`确认归档计划「${plan.name}」？`, '归档计划', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await archivePlan(plan.id)
        if (res.code === 0) {
          ElMessage.success('归档计划成功')
          await loadData()
        }
      } catch {}
      break
    case 'export':
      ElMessage.info('导出报告功能开发中')
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(`确认删除计划「${plan.name}」？删除后不可恢复。`, '删除计划', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deletePlan(plan.id)
        if (res.code === 0) {
          ElMessage.success('删除计划成功')
          await loadData()
        }
      } catch {}
      break
  }
}

// 重置计划表单
function resetPlanForm() {
  Object.assign(planForm, {
    name: '',
    platform: 'all',
    groupId: 'group_all',
    status: 'ongoing',
    startTime: '',
    endTime: '',
    viewTarget: 0,
    interactionTarget: 0,
    streamerTarget: 0,
    remark: ''
  })
}

// 分组管理
function handleAddGroup() {
  isEditGroup.value = false
  currentGroupId.value = null
  groupForm.name = ''
  groupEditDialogVisible.value = true
}

function handleEditGroup(group) {
  isEditGroup.value = true
  currentGroupId.value = group.id
  groupForm.name = group.name
  groupEditDialogVisible.value = true
}

async function handleDeleteGroup(group) {
  if (group.id === 'group_all') {
    ElMessage.warning('默认分组不能删除')
    return
  }
  try {
    await ElMessageBox.confirm(`确认删除分组「${group.name}」？`, '删除分组', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await deleteGroup(group.id)
    if (res.code === 0) {
      ElMessage.success('删除分组成功')
      await loadData()
    } else {
      ElMessage.error(res.message)
    }
  } catch {}
}

async function handleConfirmGroup() {
  if (!groupForm.name.trim()) {
    ElMessage.warning('请输入分组名称')
    return
  }
  try {
    if (isEditGroup.value) {
      const res = await updateGroup(currentGroupId.value, groupForm)
      if (res.code === 0) {
        ElMessage.success('编辑分组成功')
        groupEditDialogVisible.value = false
        await loadData()
      }
    } else {
      const res = await addGroup(groupForm)
      if (res.code === 0) {
        ElMessage.success('新增分组成功')
        groupEditDialogVisible.value = false
        await loadData()
      }
    }
  } catch (e) {
    ElMessage.error('操作失败，请重试')
  }
}

// 指标说明弹窗
function showMetricDialog(type) {
  metricType.value = type
  showMetricDialogVisible.value = true
}

// 项目成员弹窗
function showMemberDialog(plan) {
  currentPlan.value = plan
  showMemberDialogVisible.value = true
}

// 查看详情
function handleViewDetail(plan) {
  ElMessage.info(`跳转到计划详情：${plan.name}`)
}

// 工具函数
function getCardClass(status) {
  return {
    ongoing: status === 'ongoing',
    completed: status === 'completed',
    paused: status === 'paused'
  }
}

function getProgressColor(status, progress) {
  if (status === 'completed' || progress >= 100) return '#31a24c'
  if (status === 'paused') return '#999'
  return '#ff6a00'
}

function formatNumber(num) {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿'
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num.toLocaleString()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.plan-management-page {
  padding: 16px 0 24px;
  background: #f5f5f5;
  min-height: 100%;
}

// 平台切换栏
.platform-bar {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  margin-bottom: 12px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;

  &:hover {
    color: #333;
  }

  &.active {
    color: #111;
    font-weight: 600;
    border-bottom-color: #111;
  }

  .platform-icon {
    width: 16px;
    height: 16px;
    border-radius: 4px;

    &.douyin {
      background: #000;
    }

    &.xiaohongshu {
      background: #fe2c55;
    }
  }
}

// 计划分组标签栏
.group-tabs-bar {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.group-tabs-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.group-tab {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 20px;
  background: #f5f6f7;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;

  &:hover {
    background: #eef4ff;
  }

  &.active {
    background: #fff0e6;
    color: #ff6a00;
    border-color: #ff6a00;
  }

  &.manage-btn {
    background: #fff;
    border-color: #e8e8e8;
    color: #666;

    .plus-icon {
      margin-right: 4px;
    }

    &:hover {
      border-color: #ff6a00;
      color: #ff6a00;
    }
  }
}

// 列表操作栏
.list-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.action-title {
  font-size: 16px;
  font-weight: 700;
  color: #111;
}

.action-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: 200px;
}

.status-select {
  width: 120px;
}

.sort-btn {
  padding: 8px;
}

.add-btn {
  background: #ff6a00;
  border-color: #ff6a00;

  &:hover {
    background: #ff8533;
    border-color: #ff8533;
  }
}

// 计划卡片网格
.plan-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.plan-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &.completed {
    .progress-ring-container :deep(.el-progress__text) {
      color: #31a24c;
    }
  }

  &.paused {
    opacity: 0.7;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.plan-name {
  font-size: 14px;
  font-weight: 700;
  color: #111;
  cursor: pointer;

  &:hover {
    color: #ff6a00;
  }
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  background: #fff;
  border: 1px solid currentColor;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  &.ongoing {
    color: #ff6a00;
  }

  &.completed {
    color: #31a24c;
  }

  &.paused {
    color: #999;
  }
}

.plan-time {
  font-size: 12px;
  color: #999;
  width: 100%;
  margin-top: 4px;
}

.header-right {
  display: flex;
  gap: 4px;
}

.edit-btn,
.more-btn {
  padding: 4px;
  color: #666;

  &:hover {
    color: #ff6a00;
  }
}

.card-body {
  display: flex;
  padding: 16px;
  gap: 16px;
}

.progress-ring-container {
  flex-shrink: 0;
  cursor: pointer;

  .progress-percent {
    font-size: 20px;
    font-weight: 700;
    color: #111;
  }
}

.progress-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-item {
  cursor: pointer;

  .progress-label {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
    font-size: 12px;
    color: #666;

    .info-icon {
      cursor: pointer;
      color: #999;

      &:hover {
        color: #ff6a00;
      }
    }
  }

  .progress-values {
    margin-top: 2px;
    font-size: 11px;
    color: #999;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-label {
  font-size: 12px;
  color: #666;
}

.content-count {
  font-size: 14px;
  font-weight: 700;
  color: #111;
}

.platform-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  color: #fff;

  &.douyin {
    background: #000;
  }

  &.xiaohongshu {
    background: #fe2c55;
  }
}

.footer-right {
  .member-info {
    font-size: 12px;
    color: #666;
    cursor: pointer;

    &:hover {
      color: #ff6a00;
    }
  }
}

.empty-state {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 60px 0;
}

.pagination-section {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

// 表单
.plan-form {
  padding-right: 16px;
}

.group-toolbar {
  margin-bottom: 12px;
}

.group-table {
  margin-top: 0;
}

.metric-content {
  padding: 8px 0;
  line-height: 1.8;
  color: #666;

  strong {
    color: #333;
  }
}

.member-content {
  padding: 8px 0;
  color: #666;
}

@media (max-width: 1280px) {
  .plan-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>

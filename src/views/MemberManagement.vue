<template>
  <div class="member-management">
    <div class="member-layout">
      <!-- 左侧组织架构区 -->
      <div class="dept-tree-section">
        <div class="section-header">
          <span class="section-title">组织架构</span>
        </div>
        <div class="dept-tree">
          <el-tree
            ref="deptTreeRef"
            :data="deptTreeData"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleDeptSelect"
          >
            <template #default="{ node, data }">
              <div class="dept-node" :class="{ active: selectedDeptId === data.id }">
                <span class="dept-name">{{ data.name }}</span>
                <span class="dept-count">({{ data.memberCount }})</span>
                <el-dropdown trigger="click" @command="(cmd) => handleDeptCommand(cmd, data)">
                  <span class="dept-more" @click.stop>
                    <el-icon><MoreFilled /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                      <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧成员列表区 -->
      <div class="member-list-section">
        <!-- 标题栏 -->
        <div class="list-header">
          <div class="header-left">
            <span class="dept-title">{{ currentDeptName }}</span>
            <span class="member-count">部门人数：{{ currentDeptMemberCount }} / {{ totalMemberCount }}</span>
          </div>
          <div class="header-right">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索成员"
              clearable
              style="width: 200px; margin-right: 12px"
              @input="handleSearchInput"
              @clear="handleSearchClear"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleAddMember">+ 添加成员</el-button>
          </div>
        </div>

        <!-- 成员列表 -->
        <div class="list-content">
          <el-table :data="filteredMemberList" style="width: 100%">
            <el-table-column prop="name" label="成员名称" min-width="120">
              <template #default="{ row }">
                <span class="member-name">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" min-width="100">
              <template #default="{ row }">
                <span>{{ row.nickname || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="roleName" label="所属角色" min-width="120" />
            <el-table-column prop="phone" label="手机号" min-width="140">
              <template #default="{ row }">
                <el-tooltip :content="row.phone" placement="top" :show-after="300">
                  <span>{{ formatPhone(row.phone) }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="country" label="国家" min-width="80" />
            <el-table-column prop="deptName" label="所在部门" min-width="140">
              <template #default="{ row }">
                <el-tooltip :content="row.deptPath" placement="top" :show-after="300">
                  <span>{{ row.deptName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="fixedAssets" label="固定资产" min-width="100">
              <template #default="{ row }">
                <span>{{ row.fixedAssets ? '￥' + row.fixedAssets.toFixed(2) : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="添加日期" min-width="120">
              <template #default="{ row }">
                <span>{{ row.createDate || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="entryDate" label="入职时间/工龄" min-width="160">
              <template #default="{ row }">
                <span v-if="row.entryDate">{{ row.entryDate }} | {{ calculateWorkDays(row.entryDate) }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="lastUpdateTime" label="最近修改时间" min-width="160">
              <template #default="{ row }">
                <span>{{ row.lastUpdateTime || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch
                  :model-value="row.status"
                  @change="handleStatusChange(row, $event)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <span class="action-link" @click="handleEditMember(row)">编辑</span>
                <span class="action-link delete" @click="handleDeleteMember(row)">删除</span>
              </template>
            </el-table-column>
          </el-table>

          <!-- 空状态 -->
          <div v-if="filteredMemberList.length === 0" class="empty-state">
            <el-empty description="暂无成员" />
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑部门弹窗 -->
    <el-dialog v-model="deptDialogVisible" :title="deptDialogTitle" width="500px" @close="handleDeptDialogClose">
      <div class="dept-form">
        <div class="form-item">
          <label><span class="required">*</span>部门名称</label>
          <el-input v-model="deptForm.name" :placeholder="'请输入部门名称'" maxlength="20" show-word-limit />
          <span v-if="deptFormError.name" class="error-tip">{{ deptFormError.name }}</span>
        </div>
        <div class="form-item">
          <label><span class="required">*</span>上级部门</label>
          <el-tree-select
            v-model="deptForm.parentId"
            :data="deptTreeData"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级部门"
            check-strictly
            filterable
            style="width: 100%"
          />
        </div>
        <div class="form-item">
          <label>负责人</label>
          <el-select v-model="deptForm.leaderIds" multiple placeholder="请选择负责人" style="width: 100%">
            <el-option v-for="member in allMembers" :key="member.id" :label="member.name" :value="member.id" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleDeptDialogClose">取消</el-button>
        <el-button type="primary" @click="handleDeptDialogConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 删除部门确认弹窗 -->
    <el-dialog v-model="deleteDeptDialogVisible" title="确认删除该部门吗？" width="440px" @close="deleteDeptDialogVisible = false">
      <div class="delete-tip">
        <p>删除后，该部门及其所有子部门将被删除</p>
        <p>该部门的成员将被移除。</p>
      </div>
      <template #footer>
        <el-button @click="deleteDeptDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmDeleteDept">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑成员弹窗 -->
    <el-dialog v-model="memberDialogVisible" :title="memberDialogTitle" width="500px" @close="handleMemberDialogClose">
      <div class="member-form">
        <div class="form-item">
          <label><span class="required">*</span>成员名称</label>
          <el-input v-model="memberForm.name" placeholder="请输入成员名称" maxlength="50" />
          <span v-if="memberFormError.name" class="error-tip">{{ memberFormError.name }}</span>
        </div>
        <div class="form-item">
          <label>昵称</label>
          <el-input v-model="memberForm.nickname" placeholder="请输入昵称" maxlength="50" />
        </div>
        <div class="form-item">
          <label><span class="required">*</span>手机号</label>
          <el-input v-model="memberForm.phone" placeholder="请输入手机号" maxlength="11" />
          <span v-if="memberFormError.phone" class="error-tip">{{ memberFormError.phone }}</span>
        </div>
        <div class="form-item">
          <label>国家</label>
          <el-select v-model="memberForm.country" placeholder="请选择国家" style="width: 100%">
            <el-option label="中国" value="中国" />
            <el-option label="美国" value="美国" />
            <el-option label="英国" value="英国" />
            <el-option label="日本" value="日本" />
          </el-select>
        </div>
        <div class="form-item">
          <label><span class="required">*</span>所属部门</label>
          <el-tree-select
            v-model="memberForm.deptId"
            :data="deptTreeData"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择所属部门"
            check-strictly
            filterable
            style="width: 100%"
          />
          <span v-if="memberFormError.deptId" class="error-tip">{{ memberFormError.deptId }}</span>
        </div>
        <div class="form-item">
          <label><span class="required">*</span>所属角色</label>
          <el-select v-model="memberForm.roleId" placeholder="请选择所属角色" style="width: 100%">
            <el-option v-for="role in roleOptions" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
          <span v-if="memberFormError.roleId" class="error-tip">{{ memberFormError.roleId }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleMemberDialogClose">取消</el-button>
        <el-button type="primary" @click="handleMemberDialogConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 删除成员确认弹窗 -->
    <el-dialog v-model="deleteMemberDialogVisible" title="确认删除该成员吗？" width="440px" @close="deleteMemberDialogVisible = false">
      <div class="delete-tip">
        <p>删除后，该成员的所有权限将被收回。</p>
      </div>
      <template #footer>
        <el-button @click="deleteMemberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmDeleteMember">确定</el-button>
      </template>
    </el-dialog>

    <!-- 功能开发中提示 -->
    <el-dialog v-model="developingDialogVisible" title="提示" width="400px">
      <div class="developing-tip">
        <el-icon class="info-icon"><InfoFilled /></el-icon>
        <span>功能开发中</span>
      </div>
      <template #footer>
        <el-button type="primary" @click="developingDialogVisible = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, MoreFilled, InfoFilled } from '@element-plus/icons-vue'

// 模拟部门数据
const mockDeptData = [
  {
    id: 'dept0',
    name: 'XXX科技有限公司',
    memberCount: 12,
    children: [
      {
        id: 'dept1',
        name: '销售部',
        memberCount: 5,
        children: [
          { id: 'dept1-1', name: '销售一组', memberCount: 2, children: [] },
          { id: 'dept1-2', name: '销售二组', memberCount: 3, children: [] }
        ]
      },
      {
        id: 'dept2',
        name: '市场部',
        memberCount: 3,
        children: [
          { id: 'dept2-1', name: '市场策划组', memberCount: 3, children: [] }
        ]
      },
      {
        id: 'dept3',
        name: '技术部',
        memberCount: 4,
        children: []
      }
    ]
  }
]

const deptTreeData = ref(mockDeptData)
const selectedDeptId = ref('dept0')

// 模拟成员数据
const mockMemberData = [
  { id: 'm1', name: '张三', nickname: '小张', phone: '13812345678', roleId: 'r1', roleName: '超级管理员', country: '中国', deptId: 'dept1', deptName: '销售部', deptPath: 'XXX科技有限公司 > 销售部', fixedAssets: 0, createDate: '2026-04-01', entryDate: '2026-04-01', lastUpdateTime: '2026-04-27 10:30:00', status: true },
  { id: 'm2', name: '李四', nickname: '小李', phone: '13923456789', roleId: 'r2', roleName: '普通成员', country: '中国', deptId: 'dept1', deptName: '销售部', deptPath: 'XXX科技有限公司 > 销售部', fixedAssets: 5000.00, createDate: '2026-04-05', entryDate: '2026-04-05', lastUpdateTime: '2026-04-27 11:20:00', status: true },
  { id: 'm3', name: '王五', nickname: '老王', phone: '13734567890', roleId: 'r2', roleName: '普通成员', country: '中国', deptId: 'dept1-1', deptName: '销售一组', deptPath: 'XXX科技有限公司 > 销售部 > 销售一组', fixedAssets: 0, createDate: '2026-04-10', entryDate: '2026-04-10', lastUpdateTime: '2026-04-27 09:15:00', status: false },
  { id: 'm4', name: '赵六', nickname: '小赵', phone: '13645678901', roleId: 'r2', roleName: '普通成员', country: '中国', deptId: 'dept1-2', deptName: '销售二组', deptPath: 'XXX科技有限公司 > 销售部 > 销售二组', fixedAssets: 1200.00, createDate: '2026-04-12', entryDate: '2026-04-12', lastUpdateTime: '2026-04-27 14:45:00', status: true },
  { id: 'm5', name: '钱七', nickname: '钱多多', phone: '13556789012', roleId: 'r2', roleName: '普通成员', country: '美国', deptId: 'dept2', deptName: '市场部', deptPath: 'XXX科技有限公司 > 市场部', fixedAssets: 0, createDate: '2026-04-15', entryDate: '2026-04-15', lastUpdateTime: '2026-04-27 16:30:00', status: true },
  { id: 'm6', name: '孙八', nickname: '小孙', phone: '13467890123', roleId: 'r2', roleName: '普通成员', country: '中国', deptId: 'dept2-1', deptName: '市场策划组', deptPath: 'XXX科技有限公司 > 市场部 > 市场策划组', fixedAssets: 3000.00, createDate: '2026-04-18', entryDate: '2026-04-18', lastUpdateTime: '2026-04-27 13:00:00', status: false },
  { id: 'm7', name: '周九', nickname: '老周', phone: '13378901234', roleId: 'r1', roleName: '超级管理员', country: '中国', deptId: 'dept3', deptName: '技术部', deptPath: 'XXX科技有限公司 > 技术部', fixedAssets: 0, createDate: '2026-04-20', entryDate: '2026-04-20', lastUpdateTime: '2026-04-27 08:00:00', status: true },
  { id: 'm8', name: '吴十', nickname: '小吴', phone: '13289012345', roleId: 'r2', roleName: '普通成员', country: '中国', deptId: 'dept3', deptName: '技术部', deptPath: 'XXX科技有限公司 > 技术部', fixedAssets: 8000.00, createDate: '2026-04-22', entryDate: '2026-04-22', lastUpdateTime: '2026-04-27 17:00:00', status: true }
]

const allMembers = ref(mockMemberData)

// 角色选项
const roleOptions = [
  { id: 'r1', name: '超级管理员' },
  { id: 'r2', name: '普通成员' },
  { id: 'r3', name: '部门管理员' }
]

// 搜索
const searchKeyword = ref('')

// 当前选中部门信息
const currentDeptName = computed(() => {
  const dept = findDeptById(deptTreeData.value, selectedDeptId.value)
  return dept ? dept.name : '全部'
})

const currentDeptMemberCount = computed(() => {
  if (selectedDeptId.value === 'dept0') {
    return allMembers.value.length
  }
  return allMembers.value.filter(m => m.deptId === selectedDeptId.value).length
})

const totalMemberCount = computed(() => allMembers.value.length)

// 筛选后的成员列表
const filteredMemberList = computed(() => {
  let list = allMembers.value

  if (selectedDeptId.value !== 'dept0') {
    list = list.filter(m => {
      const deptIds = getDeptAndChildrenIds(selectedDeptId.value)
      return deptIds.includes(m.deptId)
    })
  }

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(m =>
      m.name.toLowerCase().includes(kw) ||
      m.nickname.toLowerCase().includes(kw) ||
      m.phone.includes(kw)
    )
  }

  return list
})

// 查找部门
function findDeptById(depts, id) {
  for (const dept of depts) {
    if (dept.id === id) return dept
    if (dept.children) {
      const found = findDeptById(dept.children, id)
      if (found) return found
    }
  }
  return null
}

// 获取部门及子部门ID
function getDeptAndChildrenIds(deptId) {
  const ids = [deptId]
  const dept = findDeptById(deptTreeData.value, deptId)
  if (dept && dept.children) {
    dept.children.forEach(child => {
      ids.push(...getDeptAndChildrenIds(child.id))
    })
  }
  return ids
}

// 部门树点击
function handleDeptSelect(data) {
  selectedDeptId.value = data.id
}

// 部门操作
function handleDeptCommand(command, data) {
  if (command === 'edit') {
    openDeptDialog('edit', data)
  } else if (command === 'add') {
    openDeptDialog('add', data)
  } else if (command === 'delete') {
    if (data.id === 'dept0') {
      ElMessage.warning('根目录不能删除')
      return
    }
    currentDeleteDept = data
    deleteDeptDialogVisible.value = true
  }
}

// 部门弹窗
const deptDialogVisible = ref(false)
const deptDialogTitle = ref('')
const deptForm = reactive({ id: '', name: '', parentId: '', leaderIds: [] })
const deptFormError = reactive({ name: '' })
const currentEditDept = ref(null)

function openDeptDialog(type, data) {
  deptDialogTitle.value = type === 'edit' ? '编辑部门' : '添加子部门'
  if (type === 'edit') {
    currentEditDept.value = data
    deptForm.id = data.id
    deptForm.name = data.name
    deptForm.parentId = findParentDeptId(deptTreeData.value, data.id)
    deptForm.leaderIds = data.leaderIds || []
  } else {
    currentEditDept.value = null
    deptForm.id = ''
    deptForm.name = ''
    deptForm.parentId = data.id
    deptForm.leaderIds = []
  }
  deptFormError.name = ''
  deptDialogVisible.value = true
}

function findParentDeptId(depts, childId, parentId = null) {
  for (const dept of depts) {
    if (dept.id === childId) return parentId
    if (dept.children) {
      const found = findParentDeptId(dept.children, childId, dept.id)
      if (found !== null) return found
    }
  }
  return null
}

function handleDeptDialogClose() {
  deptDialogVisible.value = false
}

function handleDeptDialogConfirm() {
  // 校验
  if (!deptForm.name.trim()) {
    deptFormError.name = '请输入部门名称'
    return
  }
  if (deptForm.name.length > 20) {
    deptFormError.name = '部门名称不能超过20字'
    return
  }
  if (!deptForm.parentId) {
    ElMessage.warning('请选择上级部门')
    return
  }

  if (deptDialogTitle.value === '编辑部门') {
    // 更新部门
    const dept = findDeptById(deptTreeData.value, deptForm.id)
    if (dept) {
      dept.name = deptForm.name
      dept.leaderIds = deptForm.leaderIds
    }
    ElMessage.success('编辑成功')
  } else {
    // 添加子部门
    const parentDept = findDeptById(deptTreeData.value, deptForm.parentId)
    if (parentDept) {
      if (!parentDept.children) parentDept.children = []
      const newDept = {
        id: 'dept' + Date.now(),
        name: deptForm.name,
        memberCount: 0,
        children: [],
        leaderIds: deptForm.leaderIds
      }
      parentDept.children.push(newDept)
    }
    ElMessage.success('添加成功')
  }

  handleDeptDialogClose()
}

// 删除部门
const deleteDeptDialogVisible = ref(false)
let currentDeleteDept = ref(null)

function handleConfirmDeleteDept() {
  // 实际应递归删除所有子部门
  deleteDeptFromTree(deptTreeData.value, currentDeleteDept.value.id)
  deleteMemberByDeptId(currentDeleteDept.value.id)

  ElMessage.success('删除成功')
  deleteDeptDialogVisible.value = false
}

function deleteDeptFromTree(depts, deptId) {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].id === deptId) {
      depts.splice(i, 1)
      return true
    }
    if (depts[i].children) {
      if (deleteDeptFromTree(depts[i].children, deptId)) return true
    }
  }
  return false
}

function deleteMemberByDeptId(deptId) {
  const ids = getDeptAndChildrenIds(deptId)
  allMembers.value = allMembers.value.filter(m => !ids.includes(m.deptId))
}

// 搜索处理
function handleSearchInput() {
  // 搜索时不需要额外处理
}

function handleSearchClear() {
  searchKeyword.value = ''
}

function calculateWorkDays(entryDate) {
  if (!entryDate) return '-'
  const entry = new Date(entryDate)
  const today = new Date()
  const diffTime = today.getTime() - entry.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return '0天'
  if (diffDays === 1) return '1天'
  return diffDays + '天'
}

function handleStatusChange(row, newStatus) {
  const member = allMembers.value.find(m => m.id === row.id)
  if (member) {
    member.status = newStatus
    member.lastUpdateTime = formatDateTime(new Date())
    ElMessage.success(newStatus ? '已启用' : '已禁用')
  }
}

function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 成员操作
const memberDialogVisible = ref(false)
const memberDialogTitle = ref('')
const memberForm = reactive({ id: '', name: '', nickname: '', phone: '', country: '', deptId: '', roleId: '' })
const memberFormError = reactive({ name: '', phone: '', deptId: '', roleId: '' })
const currentEditMember = ref(null)

function handleAddMember() {
  memberDialogTitle.value = '添加成员'
  currentEditMember.value = null
  memberForm.id = ''
  memberForm.name = ''
  memberForm.nickname = ''
  memberForm.phone = ''
  memberForm.country = '中国'
  memberForm.deptId = selectedDeptId.value === 'dept0' ? '' : selectedDeptId.value
  memberForm.roleId = ''
  clearMemberFormError()
  memberDialogVisible.value = true
}

function handleEditMember(row) {
  memberDialogTitle.value = '编辑成员'
  currentEditMember.value = row
  memberForm.id = row.id
  memberForm.name = row.name
  memberForm.nickname = row.nickname
  memberForm.phone = row.phone
  memberForm.country = row.country
  memberForm.deptId = row.deptId
  memberForm.roleId = row.roleId
  clearMemberFormError()
  memberDialogVisible.value = true
}

function clearMemberFormError() {
  memberFormError.name = ''
  memberFormError.phone = ''
  memberFormError.deptId = ''
  memberFormError.roleId = ''
}

function handleMemberDialogClose() {
  memberDialogVisible.value = false
}

function handleMemberDialogConfirm() {
  let hasError = false

  if (!memberForm.name.trim()) {
    memberFormError.name = '请输入成员名称'
    hasError = true
  }

  if (!memberForm.phone.trim()) {
    memberFormError.phone = '请输入手机号'
    hasError = true
  } else if (!/^1[3-9]\d{9}$/.test(memberForm.phone)) {
    memberFormError.phone = '手机号格式错误'
    hasError = true
  }

  if (!memberForm.deptId) {
    memberFormError.deptId = '请选择所属部门'
    hasError = true
  }

  if (!memberForm.roleId) {
    memberFormError.roleId = '请选择所属角色'
    hasError = true
  }

  if (hasError) return

  const role = roleOptions.find(r => r.id === memberForm.roleId)
  const dept = findDeptById(deptTreeData.value, memberForm.deptId)

  if (memberDialogTitle.value === '编辑成员') {
    const index = allMembers.value.findIndex(m => m.id === memberForm.id)
    if (index !== -1) {
      allMembers.value[index] = {
        ...allMembers.value[index],
        name: memberForm.name,
        nickname: memberForm.nickname,
        phone: memberForm.phone,
        country: memberForm.country,
        deptId: memberForm.deptId,
        deptName: dept ? dept.name : '',
        deptPath: dept ? dept.name : '',
        roleId: memberForm.roleId,
        roleName: role ? role.name : ''
      }
    }
    ElMessage.success('编辑成功')
  } else {
    const newMember = {
      id: 'm' + Date.now(),
      name: memberForm.name,
      nickname: memberForm.nickname,
      phone: memberForm.phone,
      country: memberForm.country,
      deptId: memberForm.deptId,
      deptName: dept ? dept.name : '',
      deptPath: dept ? dept.name : '',
      roleId: memberForm.roleId,
      roleName: role ? role.name : '',
      fixedAssets: 0
    }
    allMembers.value.push(newMember)
    // 更新部门人数
    updateDeptMemberCount(deptTreeData.value, memberForm.deptId, 1)
    ElMessage.success('添加成功')
  }

  handleMemberDialogClose()
}

// 更新部门人数
function updateDeptMemberCount(depts, deptId, delta) {
  for (const dept of depts) {
    if (dept.id === deptId) {
      dept.memberCount += delta
      return
    }
    if (dept.children) {
      updateDeptMemberCount(dept.children, deptId, delta)
    }
  }
}

// 删除成员
const deleteMemberDialogVisible = ref(false)
const currentDeleteMember = ref(null)

function handleDeleteMember(row) {
  currentDeleteMember.value = row
  deleteMemberDialogVisible.value = true
}

function handleConfirmDeleteMember() {
  const index = allMembers.value.findIndex(m => m.id === currentDeleteMember.value.id)
  if (index !== -1) {
    const deptId = allMembers.value[index].deptId
    allMembers.value.splice(index, 1)
    updateDeptMemberCount(deptTreeData.value, deptId, -1)
  }
  ElMessage.success('删除成功')
  deleteMemberDialogVisible.value = false
}

// 手机号格式化
function formatPhone(phone) {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 开发中弹窗
const developingDialogVisible = ref(false)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.member-management {
  padding: 0;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.member-layout {
  display: flex;
  gap: 16px;
  height: calc(100vh - 100px);
}

.dept-tree-section {
  width: 260px;
  background: #fff;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  .section-header {
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }

  .dept-tree {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }
}

.dept-node {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f5f6f7;
  }

  &.active {
    background: #e6f0ff;
  }

  .dept-name {
    flex: 1;
    font-size: 13px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dept-count {
    font-size: 12px;
    color: #999;
    margin-right: 8px;
  }

  .dept-more {
    opacity: 0;
    cursor: pointer;
    padding: 4px;
    color: #666;

    &:hover {
      color: #0064E0;
    }
  }

  &:hover .dept-more {
    opacity: 1;
  }
}

.member-list-section {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .dept-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .member-count {
      font-size: 13px;
      color: #999;
    }
  }
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.member-name {
  color: #1677ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.action-link {
  color: #1677ff;
  cursor: pointer;
  margin-right: 12px;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }

  &.delete {
    color: #ff4d4f;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.dept-form,
.member-form {
  .form-item {
    margin-bottom: 16px;

    label {
      display: block;
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
    }

    .required {
      color: #ff4d4f;
      margin-right: 4px;
    }

    .error-tip {
      display: block;
      color: #ff4d4f;
      font-size: 12px;
      margin-top: 4px;
    }
  }
}

.delete-tip {
  font-size: 14px;
  color: #666;
  line-height: 1.8;

  p {
    margin: 0;
  }
}

.developing-tip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;

  .info-icon {
    font-size: 24px;
    color: #1677ff;
  }

  span {
    font-size: 14px;
    color: #333;
  }
}

:deep(.el-tree) {
  .el-tree-node__content {
    padding: 0 8px;
  }
}
</style>
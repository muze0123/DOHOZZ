<template>
  <div class="role-management">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">角色管理</h2>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAddRole">+ 新增角色</el-button>
      </div>
    </div>

    <div class="content-layout">
      <!-- 左侧角色列表区 -->
      <div class="role-list-section">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索角色"
            clearable
            @input="handleSearch"
            @clear="handleSearchClear"
            @keyup.enter="handleRoleSearchEnter"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="role-list">
          <div
            v-for="role in filteredRoleList"
            :key="role.id"
            class="role-item"
            :class="{ active: selectedRoleId === role.id }"
            @click="handleRoleSelect(role)"
          >
            <div class="role-icon">
              <el-icon v-if="role.isSystem"><Lock /></el-icon>
              <el-icon v-else><User /></el-icon>
            </div>
            <div class="role-info">
              <span class="role-name">{{ role.name }}</span>
              <span class="role-count">({{ role.memberCount }}人)</span>
            </div>
            <el-dropdown trigger="click" @command="(cmd) => handleRoleCommand(cmd, role)">
              <span class="role-more" @click.stop>
                <el-icon><MoreFilled /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item v-if="!role.isSystem" command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-if="filteredRoleList.length === 0" class="search-empty">
            <el-empty description="暂无搜索结果" :image-size="60" />
          </div>
        </div>
      </div>

      <!-- 右侧角色详情区 -->
      <div class="role-detail-section">
        <template v-if="selectedRole">
          <!-- 角色详情头部 -->
          <div class="detail-header">
            <div class="header-info">
              <span class="role-name">{{ selectedRole.name }}</span>
              <span class="role-status">
                <span class="status-dot" :class="selectedRole.status === 1 ? 'active' : 'inactive'"></span>
                {{ selectedRole.status === 1 ? '已启用' : '已停用' }}
              </span>
            </div>
            <div class="header-actions">
              <el-button type="primary" link @click="handleEditRole">编辑</el-button>
              <el-button v-if="!selectedRole.isSystem" type="primary" link @click="handleDeleteRole">删除</el-button>
            </div>
          </div>

          <!-- 角色基本信息 -->
          <div class="role-base-info">
            <div class="info-item">
              <span class="label">创建人</span>
              <span class="value">{{ selectedRole.creator }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间</span>
              <span class="value">{{ selectedRole.createTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">备注</span>
              <span class="value">{{ selectedRole.remark || '- -' }}</span>
            </div>
          </div>

          <!-- Tab区 -->
          <div class="detail-tabs">
            <div
              class="tab-item"
              :class="{ active: activeTab === 'member' }"
              @click="activeTab = 'member'"
            >角色成员</div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'permission' }"
              @click="activeTab = 'permission'"
            >功能权限</div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'data' }"
              @click="activeTab = 'data'"
            >数据权限</div>
          </div>

          <!-- 角色成员内容 -->
          <div v-if="activeTab === 'member'" class="tab-content">
            <!-- 成员操作区 -->
            <div class="member-actions">
              <div class="search-box">
                <el-input
                  v-model="memberSearchKeyword"
                  placeholder="请输入成员名称/昵称/手机号搜索"
                  clearable
                  @input="handleMemberSearch"
                  @clear="handleMemberSearchClear"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
              <div class="action-buttons">
                <el-button type="primary" @click="handleAddMember">添加成员</el-button>
                <el-button @click="handleBatchRemoveMember">移除成员</el-button>
              </div>
            </div>

            <!-- 成员列表 -->
            <div class="member-list">
              <el-table
                ref="memberTableRef"
                :data="filteredMemberList"
                style="width: 100%"
                row-key="id"
                @selection-change="handleMemberSelectionChange"
              >
                <el-table-column type="selection" width="50" />
                <el-table-column prop="name" label="成员名称" min-width="120" />
                <el-table-column prop="nickname" label="昵称" min-width="100" />
                <el-table-column prop="phone" label="手机号" min-width="140">
                  <template #default="{ row }">
                    <span>{{ formatPhone(row.phone) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="deptName" label="所在部门" min-width="120" />
                <el-table-column label="操作" width="80" fixed="right">
                  <template #default="{ row }">
                    <span class="action-link" @click="handleRemoveMember(row)">移除</span>
                  </template>
                </el-table-column>
              </el-table>

              <div v-if="filteredMemberList.length === 0" class="empty-state">
                <el-empty :description="memberSearchKeyword ? '暂无搜索结果' : '该角色暂无成员'" />
              </div>
            </div>

            <!-- 分页器 -->
            <div class="pagination-wrapper">
              <el-pagination
                v-model:current-page="pagination.page"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="currentRoleMembers.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </div>

          <!-- 功能权限内容 -->
          <div v-if="activeTab === 'permission'" class="tab-content">
            <!-- 功能权限说明 -->
            <div class="permission-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>功能权限说明：若拥有该菜单模块下所有功能权限则显示"所有权限"，若没有全部拥有则将有的功能权限以"、"隔开显示</span>
            </div>

            <!-- 功能权限列表 -->
            <div class="permission-list">
              <el-table :data="permissionList" style="width: 100%">
                <el-table-column prop="menuName" label="菜单功能" min-width="150" />
                <el-table-column prop="permissionText" label="权限" min-width="400">
                  <template #default="{ row }">
                    <span class="permission-text" :class="{ 'all-permission': row.isAllPermission }">
                      {{ row.permissionText }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>

              <div v-if="permissionList.length === 0" class="empty-state">
                <el-empty description="该角色暂无功能权限" />
              </div>
            </div>
          </div>

          <!-- 数据权限内容 -->
          <div v-if="activeTab === 'data'" class="tab-content">
            <!-- 数据权限说明 -->
            <div class="data-permission-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>数据权限说明：数据权限用于控制角色可见的数据范围</span>
            </div>

            <!-- 数据权限列表 -->
            <div class="data-permission-list">
              <el-table :data="dataPermissionList" style="width: 100%">
                <el-table-column prop="permissionName" label="权限" min-width="200" />
              </el-table>

              <div v-if="dataPermissionList.length === 0" class="empty-state">
                <el-empty description="该角色暂无数据权限" />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="empty-state">
            <el-empty description="请选择角色查看详情" />
          </div>
        </template>
      </div>
    </div>

    <!-- 新增角色弹窗 -->
    <el-dialog v-model="addDialogVisible" title="新增角色" width="500px" @close="handleAddDialogClose">
      <div class="role-form">
        <div class="form-item">
          <label><span class="required">*</span>角色名称</label>
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" maxlength="20" show-word-limit />
          <span v-if="formError.name" class="error-tip">{{ formError.name }}</span>
        </div>
        <div class="form-item">
          <label>角色描述</label>
          <el-input
            v-model="roleForm.description"
            type="textarea"
            placeholder="请输入角色描述"
            maxlength="100"
            show-word-limit
            :rows="3"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑角色弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑角色" width="500px" @close="handleEditDialogClose">
      <div class="role-form">
        <div class="form-item">
          <label><span class="required">*</span>角色名称</label>
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" maxlength="20" show-word-limit :disabled="currentEditRole?.isSystem" />
          <span v-if="formError.name" class="error-tip">{{ formError.name }}</span>
        </div>
        <div class="form-item">
          <label>角色描述</label>
          <el-input
            v-model="roleForm.description"
            type="textarea"
            placeholder="请输入角色描述"
            maxlength="100"
            show-word-limit
            :rows="3"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="handleEditDialogClose">取消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除该角色吗？" width="440px" @close="deleteDialogVisible = false">
      <div class="delete-tip">
        <p>删除后，该角色的所有成员将失去该角色的权限，</p>
        <p>请谨慎操作。</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmDelete">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加成员弹窗 -->
    <el-dialog v-model="addMemberDialogVisible" title="添加成员" width="600px" @close="handleAddMemberDialogClose">
      <div class="add-member-form">
        <div class="search-row">
          <el-input
            v-model="addMemberSearchKeyword"
            placeholder="请输入成员名称搜索"
            clearable
            style="width: 300px"
            @input="handleAddMemberSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleAddMemberSearch">搜索</el-button>
        </div>
        <div class="member-table">
          <el-table :data="availableMemberList" style="width: 100%">
            <el-table-column prop="name" label="成员名称" min-width="120" />
            <el-table-column prop="deptName" label="所属部门" min-width="120" />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <template v-if="row.added">
                  <span class="added-tag">已添加</span>
                </template>
                <template v-else>
                  <span class="action-link" @click="handleAddSingleMember(row)">添加</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleAddMemberDialogClose">取消</el-button>
        <el-button type="primary" @click="handleConfirmAddMembers">已添加{{ selectedAddMembers.length }}人</el-button>
      </template>
    </el-dialog>

    <!-- 移除成员确认弹窗 -->
    <el-dialog v-model="removeMemberDialogVisible" title="确认移除该成员吗？" width="440px" @close="removeMemberDialogVisible = false">
      <div class="delete-tip">
        <p>移除后，该成员将失去该角色的权限。</p>
      </div>
      <template #footer>
        <el-button @click="removeMemberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmRemoveMember">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量移除确认弹窗 -->
    <el-dialog v-model="batchRemoveDialogVisible" title="确定要移除选中的成员吗？" width="440px" @close="batchRemoveDialogVisible = false">
      <div class="delete-tip">
        <p>已选择{{ batchSelectedMembers.length }}个成员，移除后这些成员将失去该角色的权限，</p>
        <p>请谨慎操作。</p>
      </div>
      <template #footer>
        <el-button @click="batchRemoveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmBatchRemove">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, MoreFilled, User, Lock, InfoFilled } from '@element-plus/icons-vue'

// Mock角色数据
const mockRoleList = [
  {
    id: 'role1',
    name: '超级管理员',
    description: '系统内置超级管理员，拥有所有权限',
    status: 1,
    creator: '系统',
    createTime: '2023-01-01 10:00:00',
    remark: '- -',
    memberCount: 2,
    isSystem: true
  },
  {
    id: 'role2',
    name: '部门管理员',
    description: '部门管理员，拥有部门管理权限',
    status: 1,
    creator: '张三',
    createTime: '2023-02-01 10:00:00',
    remark: '负责日常部门管理工作',
    memberCount: 3,
    isSystem: false
  },
  {
    id: 'role3',
    name: '普通成员',
    description: '普通成员，拥有基础操作权限',
    status: 1,
    creator: '张三',
    createTime: '2023-03-01 10:00:00',
    remark: '- -',
    memberCount: 5,
    isSystem: false
  },
  {
    id: 'role4',
    name: '运营专员',
    description: '运营专员，负责日常运营工作',
    status: 1,
    creator: '李四',
    createTime: '2023-04-01 10:00:00',
    remark: '运营部门核心成员',
    memberCount: 4,
    isSystem: false
  },
  {
    id: 'role5',
    name: '数据分析师',
    description: '数据分析师，拥有数据查看权限',
    status: 0,
    creator: '王五',
    createTime: '2023-05-01 10:00:00',
    remark: '已停用',
    memberCount: 1,
    isSystem: false
  }
]

// Mock成员数据
const mockMemberList = [
  { id: 'm1', name: '张三', nickname: '小张', phone: '13812345678', deptName: '技术部', roleId: 'role1' },
  { id: 'm2', name: '李四', nickname: '小李', phone: '13923456789', deptName: '销售部', roleId: 'role1' },
  { id: 'm3', name: '王五', nickname: '老王', phone: '13734567890', deptName: '市场部', roleId: 'role2' },
  { id: 'm4', name: '赵六', nickname: '小赵', phone: '13645678901', deptName: '技术部', roleId: 'role2' },
  { id: 'm5', name: '钱七', nickname: '钱多多', phone: '13556789012', deptName: '市场部', roleId: 'role2' },
  { id: 'm6', name: '孙八', nickname: '小孙', phone: '13467890123', deptName: '财务部', roleId: 'role3' },
  { id: 'm7', name: '周九', nickname: '老周', phone: '13378901234', deptName: '技术部', roleId: 'role3' },
  { id: 'm8', name: '吴十', nickname: '小吴', phone: '13289012345', deptName: '运营部', roleId: 'role3' },
  { id: 'm9', name: '郑十一', nickname: '小郑', phone: '13190123456', deptName: '技术部', roleId: 'role4' },
  { id: 'm10', name: '冯十二', nickname: '老冯', phone: '13091234567', deptName: '运营部', roleId: 'role4' }
]

// Mock可用成员（未被添加到当前角色的成员）
const mockAvailableMembers = [
  { id: 'am1', name: '刘测试', nickname: '测试', phone: '18812345678', deptName: '技术部' },
  { id: 'am2', name: '陈开发', nickname: '开发', phone: '18923456789', deptName: '技术部' },
  { id: 'am3', name: '邓产品', nickname: '产品', phone: '18734567890', deptName: '产品部' },
  { id: 'am4', name: '何设计', nickname: '设计', phone: '18645678901', deptName: '设计部' },
  { id: 'am5', name: '林运营', nickname: '运营', phone: '18556789012', deptName: '运营部' }
]

const roleList = ref(JSON.parse(JSON.stringify(mockRoleList)))
const memberList = ref(JSON.parse(JSON.stringify(mockMemberList)))

// 搜索
const searchKeyword = ref('')
const memberSearchKeyword = ref('')
const addMemberSearchKeyword = ref('')

// 选中角色
const selectedRoleId = ref(null)
const selectedRole = computed(() => roleList.value.find(r => r.id === selectedRoleId.value))
const activeTab = ref('member')

// Mock功能权限数据
const permissionList = ref([
  { id: 'p1', menuName: '工作台', permissionText: '所有权限', isAllPermission: true },
  { id: 'p2', menuName: '找达人', permissionText: '查看、导出', isAllPermission: false },
  { id: 'p3', menuName: '达人库', permissionText: '所有权限', isAllPermission: true },
  { id: 'p4', menuName: '商家管理', permissionText: '查看、新增', isAllPermission: false },
  { id: 'p5', menuName: '订单管理', permissionText: '所有权限', isAllPermission: true },
  { id: 'p6', menuName: '成员管理', permissionText: '查看、新增、编辑、删除', isAllPermission: false },
  { id: 'p7', menuName: '部门管理', permissionText: '查看、新增、编辑', isAllPermission: false },
  { id: 'p8', menuName: '角色管理', permissionText: '所有权限', isAllPermission: true }
])

// 数据权限类型映射
const dataPermissionMap = {
  role1: [ // 超级管理员 - 全部数据权限
    { id: 'dp1', permissionName: '全部数据权限' },
    { id: 'dp2', permissionName: '本部门及下级部门数据权限' },
    { id: 'dp3', permissionName: '本部门数据权限' },
    { id: 'dp4', permissionName: '仅本人数据权限' }
  ],
  role2: [ // 部门管理员 - 本部门及下级部门数据权限
    { id: 'dp1', permissionName: '全部数据权限' },
    { id: 'dp2', permissionName: '本部门及下级部门数据权限' },
    { id: 'dp3', permissionName: '本部门数据权限' },
    { id: 'dp4', permissionName: '仅本人数据权限' }
  ],
  role3: [ // 普通成员 - 仅本人数据权限
    { id: 'dp1', permissionName: '全部数据权限' },
    { id: 'dp2', permissionName: '本部门及下级部门数据权限' },
    { id: 'dp3', permissionName: '本部门数据权限' },
    { id: 'dp4', permissionName: '仅本人数据权限' }
  ]
}

// 当前角色的数据权限列表
const dataPermissionList = computed(() => {
  if (!selectedRoleId.value) return []
  return dataPermissionMap[selectedRoleId.value] || []
})

// 当前角色的成员列表
const currentRoleMembers = computed(() => {
  if (!selectedRoleId.value) return []
  return memberList.value.filter(m => m.roleId === selectedRoleId.value)
})

// 过滤后的角色列表
const filteredRoleList = computed(() => {
  if (!searchKeyword.value) {
    return roleList.value
  }
  return roleList.value.filter(role =>
    role.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 过滤后的成员列表
const filteredMemberList = computed(() => {
  if (!memberSearchKeyword.value) {
    return currentRoleMembers.value
  }
  const kw = memberSearchKeyword.value.toLowerCase()
  return currentRoleMembers.value.filter(m =>
    m.name.toLowerCase().includes(kw) ||
    m.nickname.toLowerCase().includes(kw) ||
    m.phone.includes(kw)
  )
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: computed(() => currentRoleMembers.value.length)
})

// 成员选择
const memberTableRef = ref(null)
const selectedMembers = ref([])

// 可添加的成员列表
const availableMemberList = ref([...mockAvailableMembers])
const selectedAddMembers = ref([])

// 搜索处理
function handleSearch() {}

function handleSearchClear() {
  searchKeyword.value = ''
}

// 角色搜索（回车触发）
function handleRoleSearchEnter() {
  // 搜索由 computed 属性 filteredRoleList 自动处理
}

function handleMemberSearch() {}

function handleMemberSearchClear() {
  memberSearchKeyword.value = ''
}

function handleAddMemberSearch() {
  if (!addMemberSearchKeyword.value) {
    availableMemberList.value = [...mockAvailableMembers]
    return
  }
  const kw = addMemberSearchKeyword.value.toLowerCase()
  availableMemberList.value = mockAvailableMembers.filter(m =>
    m.name.toLowerCase().includes(kw)
  )
}

// 角色选择
function handleRoleSelect(role) {
  selectedRoleId.value = role.id
  memberSearchKeyword.value = ''
  pagination.page = 1
}

// 角色操作
function handleRoleCommand(command, role) {
  if (command === 'edit') {
    handleEditRole(role)
  } else if (command === 'delete') {
    if (role.isSystem) {
      ElMessage.warning('系统角色不可删除')
      return
    }
    selectedRoleId.value = role.id
    deleteDialogVisible.value = true
  }
}

// 新增角色
const addDialogVisible = ref(false)
const roleForm = reactive({ name: '', description: '' })
const formError = reactive({ name: '' })

function handleAddRole() {
  roleForm.name = ''
  roleForm.description = ''
  formError.name = ''
  addDialogVisible.value = true
}

function handleAddDialogClose() {
  addDialogVisible.value = false
}

function handleAddConfirm() {
  if (!roleForm.name.trim()) {
    formError.name = '请输入角色名称'
    return
  }
  if (roleForm.name.length > 20) {
    formError.name = '角色名称不能超过20字'
    return
  }
  const exists = roleList.value.some(r => r.name === roleForm.name)
  if (exists) {
    formError.name = '角色名称已存在'
    return
  }

  const newRole = {
    id: 'role' + Date.now(),
    name: roleForm.name,
    description: roleForm.description,
    status: 1,
    creator: '当前用户',
    createTime: new Date().toLocaleString('zh-CN'),
    remark: '- -',
    memberCount: 0,
    isSystem: false
  }
  roleList.value.push(newRole)
  ElMessage.success('添加成功')
  handleAddDialogClose()
}

// 编辑角色
const editDialogVisible = ref(false)
const currentEditRole = ref(null)

function handleEditRole() {
  if (!selectedRole.value) return
  currentEditRole.value = selectedRole.value
  roleForm.name = selectedRole.value.name
  roleForm.description = selectedRole.value.description || ''
  formError.name = ''
  editDialogVisible.value = true
}

function handleEditDialogClose() {
  editDialogVisible.value = false
}

function handleEditConfirm() {
  if (!roleForm.name.trim()) {
    formError.name = '请输入角色名称'
    return
  }
  if (roleForm.name.length > 20) {
    formError.name = '角色名称不能超过20字'
    return
  }
  const exists = roleList.value.some(r => r.id !== currentEditRole.value.id && r.name === roleForm.name)
  if (exists) {
    formError.name = '角色名称已存在'
    return
  }

  const role = roleList.value.find(r => r.id === currentEditRole.value.id)
  if (role) {
    role.name = roleForm.name
    role.description = roleForm.description
  }
  ElMessage.success('编辑成功')
  handleEditDialogClose()
}

// 删除角色
const deleteDialogVisible = ref(false)

function handleDeleteRole() {
  if (selectedRole.value?.isSystem) {
    ElMessage.warning('系统角色不可删除')
    return
  }
  deleteDialogVisible.value = true
}

function handleConfirmDelete() {
  const index = roleList.value.findIndex(r => r.id === selectedRoleId.value)
  if (index !== -1) {
    roleList.value.splice(index, 1)
    // 同时移除该角色的成员
    memberList.value = memberList.value.filter(m => m.roleId !== selectedRoleId.value)
  }
  selectedRoleId.value = null
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
}

// 添加成员
const addMemberDialogVisible = ref(false)

function handleAddMember() {
  addMemberSearchKeyword.value = ''
  availableMemberList.value = mockAvailableMembers.map(m => ({ ...m, added: false }))
  selectedAddMembers.value = []
  addMemberDialogVisible.value = true
}

function handleAddMemberDialogClose() {
  addMemberDialogVisible.value = false
}

function handleAddSingleMember(member) {
  member.added = true
  selectedAddMembers.value.push(member.id)
}

function handleConfirmAddMembers() {
  if (selectedAddMembers.value.length === 0) {
    ElMessage.warning('请先添加成员')
    return
  }
  // 将选中的成员添加到当前角色
  const newMembers = mockAvailableMembers
    .filter(m => selectedAddMembers.value.includes(m.id))
    .map(m => ({ ...m, roleId: selectedRoleId.value }))
  memberList.value.push(...newMembers)

  // 更新角色成员数量
  const role = roleList.value.find(r => r.id === selectedRoleId.value)
  if (role) {
    role.memberCount = memberList.value.filter(m => m.roleId === selectedRoleId.value).length
  }

  ElMessage.success('添加成功')
  handleAddMemberDialogClose()
}

// 移除单个成员
const removeMemberDialogVisible = ref(false)
const currentRemoveMember = ref(null)

function handleRemoveMember(member) {
  // 检查是否是最后一个成员
  if (currentRoleMembers.value.length === 1) {
    ElMessage.warning('该角色至少保留一个成员')
    return
  }
  currentRemoveMember.value = member
  removeMemberDialogVisible.value = true
}

function handleConfirmRemoveMember() {
  const index = memberList.value.findIndex(m => m.id === currentRemoveMember.value.id)
  if (index !== -1) {
    memberList.value.splice(index, 1)
    // 更新角色成员数量
    const role = roleList.value.find(r => r.id === selectedRoleId.value)
    if (role) {
      role.memberCount = memberList.value.filter(m => m.roleId === selectedRoleId.value).length
    }
  }
  ElMessage.success('移除成功')
  removeMemberDialogVisible.value = false
}

// 批量移除成员
const batchRemoveDialogVisible = ref(false)

function handleMemberSelectionChange(selection) {
  selectedMembers.value = selection
}

function handleBatchRemoveMember() {
  if (selectedMembers.value.length === 0) {
    ElMessage.warning('请先选择要移除的成员')
    return
  }
  // 检查移除后是否还有成员
  if (currentRoleMembers.value.length - selectedMembers.value.length === 0) {
    ElMessage.warning('该角色至少保留一个成员')
    return
  }
  batchRemoveDialogVisible.value = true
}

function handleConfirmBatchRemove() {
  const removeIds = selectedMembers.value.map(m => m.id)
  memberList.value = memberList.value.filter(m => !removeIds.includes(m.id))

  // 更新角色成员数量
  const role = roleList.value.find(r => r.id === selectedRoleId.value)
  if (role) {
    role.memberCount = memberList.value.filter(m => m.roleId === selectedRoleId.value).length
  }

  selectedMembers.value = []
  ElMessage.success('移除成功')
  batchRemoveDialogVisible.value = false
}

// 分页
function handlePageSizeChange(val) {
  pagination.pageSize = val
  pagination.page = 1
}

function handlePageChange(val) {
  pagination.page = val
}

// 手机号格式化
function formatPhone(phone) {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
</script>

<style lang="scss" scoped>
.role-management {
  padding: 16px 0 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px 8px 0 0;

  .header-left {
    .page-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }
}

.content-layout {
  display: flex;
  gap: 16px;
  min-height: calc(100vh - 120px);
}

.role-list-section {
  width: 280px;
  background: #fff;
  border-radius: 0 0 8px 8px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .search-box {
    padding: 12px 16px;
    border-bottom: 1px solid #e8e8e8;
  }

  .role-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .search-empty {
    padding: 40px 0;
  }
}

.role-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 4px;

  &:hover {
    background: #f5f6f7;
  }

  &.active {
    background: #e6f0ff;
  }

  .role-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: #f0f5ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0064E0;
    margin-right: 10px;
  }

  .role-info {
    flex: 1;
    min-width: 0;

    .role-name {
      display: block;
      font-size: 14px;
      color: #333;
      margin-bottom: 2px;
    }

    .role-count {
      font-size: 12px;
      color: #999;
    }
  }

  .role-more {
    opacity: 0;
    cursor: pointer;
    color: #666;
    padding: 4px;

    &:hover {
      color: #0064E0;
    }
  }

  &:hover .role-more {
    opacity: 1;
  }
}

.role-detail-section {
  flex: 1;
  background: #fff;
  border-radius: 0 0 8px 8px;
  padding: 24px;
  overflow-y: auto;

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .header-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .role-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      .role-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #666;

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.active {
            background: #52c41a;
          }

          &.inactive {
            background: #999;
          }
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 16px;
    }
  }

  .role-base-info {
    display: flex;
    gap: 24px;
    padding: 16px 0;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 20px;

    .info-item {
      .label {
        font-size: 13px;
        color: #999;
        margin-right: 8px;
      }

      .value {
        font-size: 14px;
        color: #333;
      }
    }
  }

  .detail-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 20px;

    .tab-item {
      padding: 10px 20px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;

      &.active {
        color: #0064E0;
        font-weight: 600;
        border-bottom-color: #0064E0;
      }

      &.disabled {
        color: #ccc;
        cursor: not-allowed;
      }
    }
  }

  .member-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .search-box {
      width: 300px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }
  }

  .member-list {
    min-height: 200px;
  }

  .empty-state {
    padding: 40px 0;
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .tab-content {
    padding: 0;
  }

  .permission-tip {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background: #f6f8fa;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #666;

    .el-icon {
      color: #0064E0;
      margin-top: 2px;
    }
  }

  .permission-list {
    min-height: 200px;
  }

  .permission-text {
    font-size: 14px;
    color: #333;

    &.all-permission {
      color: #52c41a;
      font-weight: 500;
    }
  }

  .data-permission-tip {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background: #f6f8fa;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #666;

    .el-icon {
      color: #0064E0;
      margin-top: 2px;
    }
  }

  .data-permission-list {
    min-height: 200px;
  }
}

.role-form {
  .form-item {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;

      .required {
        color: #ff4d4f;
        margin-right: 4px;
      }
    }

    .error-tip {
      display: block;
      color: #ff4d4f;
      font-size: 12px;
      margin-top: 4px;
    }

    :deep(.el-textarea__inner) {
      resize: none;
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

.add-member-form {
  .search-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .member-table {
    max-height: 300px;
    overflow-y: auto;
  }
}

.action-link {
  color: #1677ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.added-tag {
  color: #52c41a;
  font-size: 12px;
}
</style>
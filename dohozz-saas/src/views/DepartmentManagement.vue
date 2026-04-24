<template>
  <div class="department-management">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">部门管理</h2>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAddDept">+ 添加部门</el-button>
      </div>
    </div>

    <!-- 组织架构区 -->
    <div class="dept-tree-section">
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="部门名称"
          clearable
          @input="handleSearch"
          @clear="handleSearchClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="dept-tree">
        <el-tree
          ref="deptTreeRef"
          :data="filteredDeptTree"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleDeptSelect"
        >
          <template #default="{ node, data }">
            <div class="dept-node" :class="{ active: selectedDeptId === data.id }">
              <span class="dept-icon">
                <svg v-if="node.expanded" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M10 17l5-5-5-5z"/>
                </svg>
              </span>
              <span class="dept-name">{{ data.name }}</span>
              <span class="dept-count">({{ data.memberCount }}人)</span>
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
        <div v-if="filteredDeptTree.length === 0" class="search-empty">
          <el-empty description="暂无搜索结果" :image-size="60" />
        </div>
      </div>
    </div>

    <!-- 添加部门弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加部门" width="500px" @close="handleAddDialogClose">
      <div class="dept-form">
        <div class="form-item">
          <label><span class="required">*</span>部门名称</label>
          <el-input v-model="deptForm.name" placeholder="请输入部门名称" maxlength="20" show-word-limit />
          <span v-if="formError.name" class="error-tip">{{ formError.name }}</span>
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
            <el-option v-for="member in memberOptions" :key="member.id" :label="member.name" :value="member.id" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑部门弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑部门" width="500px" @close="handleEditDialogClose">
      <div class="dept-form">
        <div class="form-item">
          <label><span class="required">*</span>部门名称</label>
          <el-input v-model="deptForm.name" placeholder="请输入部门名称" maxlength="20" show-word-limit />
          <span v-if="formError.name" class="error-tip">{{ formError.name }}</span>
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
            <el-option v-for="member in memberOptions" :key="member.id" :label="member.name" :value="member.id" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleEditDialogClose">取消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除该部门吗？" width="440px" @close="deleteDialogVisible = false">
      <div class="delete-tip">
        <p>删除后，该部门及其所有子部门将被删除</p>
        <p>该部门的成员将被移除。</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmDelete">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, MoreFilled } from '@element-plus/icons-vue'

// Mock部门数据
const mockDeptData = [
  {
    id: 'dept0',
    name: 'XXX科技有限公司',
    parentId: null,
    memberCount: 15,
    createTime: '2023-01-01 10:00:00',
    leaders: '张三',
    children: [
      {
        id: 'dept1',
        name: '销售部',
        parentId: 'dept0',
        memberCount: 5,
        createTime: '2023-02-01 10:00:00',
        leaders: '李四',
        children: [
          { id: 'dept1-1', name: '销售一组', parentId: 'dept1', memberCount: 2, createTime: '2023-03-01 10:00:00', leaders: '', children: [] },
          { id: 'dept1-2', name: '销售二组', parentId: 'dept1', memberCount: 3, createTime: '2023-03-15 10:00:00', leaders: '', children: [] }
        ]
      },
      {
        id: 'dept2',
        name: '市场部',
        parentId: 'dept0',
        memberCount: 4,
        createTime: '2023-02-15 10:00:00',
        leaders: '王五',
        children: [
          { id: 'dept2-1', name: '市场策划组', parentId: 'dept2', memberCount: 4, createTime: '2023-04-01 10:00:00', leaders: '', children: [] }
        ]
      },
      {
        id: 'dept3',
        name: '技术部',
        parentId: 'dept0',
        memberCount: 6,
        createTime: '2023-03-01 10:00:00',
        leaders: '赵六',
        children: []
      }
    ]
  }
]

const deptTreeData = ref(JSON.parse(JSON.stringify(mockDeptData)))

// 成员选项
const memberOptions = [
  { id: 'm1', name: '张三' },
  { id: 'm2', name: '李四' },
  { id: 'm3', name: '王五' },
  { id: 'm4', name: '赵六' }
]

// 搜索
const searchKeyword = ref('')
const deptTreeRef = ref(null)

// 选中部门
const selectedDeptId = ref(null)

// 过滤后的部门树
const filteredDeptTree = computed(() => {
  if (!searchKeyword.value) {
    return deptTreeData.value
  }
  return filterTreeData(deptTreeData.value, searchKeyword.value)
})

function filterTreeData(data, keyword) {
  const result = []
  for (const item of data) {
    const children = item.children ? filterTreeData(item.children, keyword) : []
    if (item.name.toLowerCase().includes(keyword.toLowerCase()) || children.length > 0) {
      result.push({
        ...item,
        children
      })
    }
  }
  return result
}

// 搜索处理
function handleSearch() {
  // Tree filter handled naturally by computed
}

function handleSearchClear() {
  searchKeyword.value = ''
}

// 部门选择
function handleDeptSelect(data) {
  selectedDeptId.value = data.id
}

// 部门操作
function handleDeptCommand(command, data) {
  if (command === 'edit') {
    handleEditDept(data)
  } else if (command === 'add') {
    handleAddSubDept(data)
  } else if (command === 'delete') {
    if (data.id === 'dept0') {
      ElMessage.warning('根目录不能删除')
      return
    }
    selectedDeptId.value = data.id
    deleteDialogVisible.value = true
  }
}

// 添加部门
const addDialogVisible = ref(false)
const deptForm = reactive({ name: '', parentId: '', leaderIds: [] })
const formError = reactive({ name: '' })
const isAddingSubDept = ref(false)

function handleAddDept() {
  deptForm.name = ''
  deptForm.parentId = 'dept0'
  deptForm.leaderIds = []
  formError.name = ''
  isAddingSubDept.value = false
  addDialogVisible.value = true
}

function handleAddSubDept(data) {
  deptForm.name = ''
  deptForm.parentId = data.id
  deptForm.leaderIds = []
  formError.name = ''
  isAddingSubDept.value = true
  addDialogVisible.value = true
}

function handleAddDialogClose() {
  addDialogVisible.value = false
}

function handleAddConfirm() {
  // 校验
  if (!deptForm.name.trim()) {
    formError.name = '请输入部门名称'
    return
  }
  if (deptForm.name.length > 20) {
    formError.name = '部门名称不能超过20字'
    return
  }

  // 检查部门名是否重复
  const exists = checkDeptNameExists(deptTreeData.value, deptForm.name, null)
  if (exists) {
    formError.name = '部门名称已存在'
    return
  }

  // 添加部门
  const parent = findDeptById(deptTreeData.value, deptForm.parentId)
  if (parent) {
    if (!parent.children) parent.children = []
    const newDept = {
      id: 'dept' + Date.now(),
      name: deptForm.name,
      parentId: deptForm.parentId,
      memberCount: 0,
      createTime: new Date().toLocaleString('zh-CN'),
      leaders: getLeaderNames(deptForm.leaderIds),
      children: []
    }
    parent.children.push(newDept)
  }

  ElMessage.success('添加成功')
  handleAddDialogClose()
}

function checkDeptNameExists(depts, name, excludeId) {
  for (const dept of depts) {
    if (dept.id !== excludeId && dept.name === name) return true
    if (dept.children && checkDeptNameExists(dept.children, name, excludeId)) return true
  }
  return false
}

function getLeaderNames(ids) {
  return ids.map(id => memberOptions.find(m => m.id === id)?.name).filter(Boolean).join('、')
}

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

// 编辑部门
const editDialogVisible = ref(false)
const currentEditDept = ref(null)

function handleEditDept(data) {
  currentEditDept.value = data
  deptForm.name = data.name
  deptForm.parentId = data.parentId || 'dept0'
  deptForm.leaderIds = getLeaderIds(data.leaders)
  formError.name = ''
  editDialogVisible.value = true
}

function getLeaderIds(leadersStr) {
  if (!leadersStr || leadersStr === '未设置') return []
  return memberOptions.filter(m => leadersStr.includes(m.name)).map(m => m.id)
}

function handleEditDialogClose() {
  editDialogVisible.value = false
}

function handleEditConfirm() {
  // 校验
  if (!deptForm.name.trim()) {
    formError.name = '请输入部门名称'
    return
  }
  if (deptForm.name.length > 20) {
    formError.name = '部门名称不能超过20字'
    return
  }

  // 检查部门名是否重复（排除自身）
  const exists = checkDeptNameExists(deptTreeData.value, deptForm.name, currentEditDept.value.id)
  if (exists) {
    formError.name = '部门名称已存在'
    return
  }

  // 更新部门
  const dept = findDeptById(deptTreeData.value, currentEditDept.value.id)
  if (dept) {
    dept.name = deptForm.name
    dept.parentId = deptForm.parentId
    dept.leaders = getLeaderNames(deptForm.leaderIds)
  }

  ElMessage.success('编辑成功')
  handleEditDialogClose()
}

// 删除部门
const deleteDialogVisible = ref(false)

function handleConfirmDelete() {
  // 递归删除
  deleteDeptFromTree(deptTreeData.value, selectedDeptId.value)
  selectedDeptId.value = null
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
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
</script>

<style lang="scss" scoped>
.department-management {
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

.dept-tree-section {
  background: #fff;
  border-radius: 0 0 8px 8px;
  min-height: calc(100vh - 120px);

  .search-box {
    padding: 12px 16px;
    border-bottom: 1px solid #e8e8e8;
  }

  .dept-tree {
    padding: 8px 16px 16px;

    :deep(.el-tree-node__content) {
      height: 36px;
    }
  }

  .search-empty {
    padding: 40px 0;
  }
}

.dept-node {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 8px;
  height: 36px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f5f6f7;
  }

  &.active {
    background: #e6f0ff;
  }

  .dept-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: #999;
    margin-right: 4px;
  }

  .dept-name {
    flex: 1;
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dept-count {
    font-size: 12px;
    color: #999;
    margin: 0 8px;
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

.dept-form {
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

:deep(.el-tree) {
  .el-tree-node__content {
    padding: 0 8px;
  }
}
</style>
//业绩目标明细和业绩设置弹窗
<template>
  <el-drawer
    title="业绩目标"
    :model-value="visible"
    @update:model-value="handleClose"
    size="90%"
    class="performance-drawer"
  >
    <div class="drawer-content">
      <!-- Tab标签区 -->
      <div class="drawer-tabs">
        <div
          class="drawer-tab"
          :class="{ active: activeTab === 'detail' }"
          @click="activeTab = 'detail'"
        >
          业绩明细
        </div>
        <div
          class="drawer-tab"
          :class="{ active: activeTab === 'setting' }"
          @click="activeTab = 'setting'"
        >
          绩效设置
        </div>
      </div>

      <!-- 绩效设置Tab内容 -->
      <div v-if="activeTab === 'setting'" class="setting-content">
        <!-- 平台选择 -->
        <div class="platform-section">
          <span class="section-label">选择平台:</span>
          <div class="platform-buttons">
            <button
              v-for="platform in platforms"
              :key="platform.value"
              class="platform-btn"
              :class="{ active: selectedPlatform === platform.value }"
              @click="selectedPlatform = platform.value"
            >
              <span class="platform-icon">{{ platform.icon }}</span>
              <span class="platform-name">{{ platform.name }}</span>
            </button>
          </div>
        </div>

        <!-- 绩效月份 -->
        <div class="config-row">
          <div class="config-item">
            <span class="config-label">绩效月份:</span>
            <el-date-picker
              v-model="settingForm.month"
              type="month"
              value-format="YYYY-MM"
              placeholder="选择月份"
              style="width: 140px"
              placement="bottom-start"
              teleported
            />
          </div>
        </div>

        <!-- 绩效方式 -->
        <div class="config-row">
          <div class="config-item">
            <span class="config-label">绩效方式:</span>
            <div class="radio-group">
              <label class="radio-item">
                <input
                  type="radio"
                  name="performanceType"
                  :value="'department'"
                  v-model="settingForm.type"
                />
                <span class="radio-dot"></span>
                <span>部门业绩</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  name="performanceType"
                  :value="'member'"
                  v-model="settingForm.type"
                />
                <span class="radio-dot"></span>
                <span>员工业绩</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 主体内容区 -->
        <div class="main-content">
          <!-- 左侧部门树 -->
          <div class="left-panel">
            <div class="panel-title">选择部门</div>
            <div class="org-tree">
              <div class="tree-node" v-for="node in orgTreeData" :key="node.id">
                <div class="tree-node-header" @click="toggleNode(node.id)">
                  <span class="expand-icon" :class="{ expanded: expandedNodes.includes(node.id) }">▶</span>
                  <span>{{ node.name }}</span>
                  <span class="member-count">({{ node.memberCount }}人)</span>
                </div>
                <div class="tree-children" v-if="expandedNodes.includes(node.id)" v-for="child in node.children" :key="child.id">
                  <div 
                    class="tree-child"
                    :class="{ selected: selectedDept === child.id }"
                    @click="selectDept(child)"
                  >
                    <span class="expand-icon" :class="{ expanded: expandedNodes.includes(child.id) }" v-if="child.children">▶</span>
                    <span v-else class="child-indent"></span>
                    <span>{{ child.name }}</span>
                    <span class="member-count" v-if="child.memberCount">({{ child.memberCount }}人)</span>
                  </div>
                  <div class="tree-grandchildren" v-if="expandedNodes.includes(child.id)" v-for="grandchild in child.children" :key="grandchild.id">
                    <div 
                      class="tree-child"
                      :class="{ selected: selectedDept === grandchild.id }"
                      @click="selectDept(grandchild)"
                    >
                      <span class="grandchild-indent"></span>
                      <span>{{ grandchild.name }}</span>
                      <span class="member-count">({{ grandchild.memberCount }}人)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧表格 -->
          <div class="right-panel">
            <!-- 部门目标显示 -->
            <div class="dept-target" v-if="selectedDeptNode">
              <div class="dept-target-title">{{ selectedDeptNode.name }}目标</div>
              <div class="dept-target-values">
                <span class="target-item">达人成交金额 ¥20.00w</span>
                <span class="target-item">建联达人数 10</span>
                <span class="target-item">寄样达人数 10</span>
                <span class="target-item">出单达人数 10</span>
                <span class="target-item">交付视频数 10</span>
                <span class="target-item">出单视频数 10</span>
              </div>
            </div>

            <!-- 表格 -->
            <div class="target-table-wrapper">
              <table class="target-table">
                <thead>
                  <tr>
                    <th>成员</th>
                    <th>所属部门</th>
                    <th>达人成交金额 <span class="help-icon">◎</span></th>
                    <th>建联达人数 <span class="help-icon">◎</span></th>
                    <th>寄样达人数 <span class="help-icon">◎</span></th>
                    <th>出单达人数 <span class="help-icon">◎</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(member, index) in memberList" :key="index">
                    <td>{{ member.name }}</td>
                    <td>{{ member.department }}</td>
                    <td>
                      <div class="input-with-controls">
                        <button class="control-btn">-</button>
                        <input type="number" v-model="member.dealAmount" class="target-input" />
                        <button class="control-btn">+</button>
                      </div>
                    </td>
                    <td>
                      <div class="input-with-controls">
                        <button class="control-btn">-</button>
                        <input type="number" v-model="member.contactCount" class="target-input" />
                        <button class="control-btn">+</button>
                      </div>
                    </td>
                    <td>
                      <div class="input-with-controls">
                        <button class="control-btn">-</button>
                        <input type="number" v-model="member.sampleCount" class="target-input" />
                        <button class="control-btn">+</button>
                      </div>
                    </td>
                    <td>
                      <div class="input-with-controls">
                        <button class="control-btn">-</button>
                        <input type="number" v-model="member.orderCount" class="target-input" />
                        <button class="control-btn">+</button>
                      </div>
                    </td>
                  </tr>
                  <tr class="total-row">
                    <td>合计</td>
                    <td></td>
                    <td>¥{{ totalDealAmount }}</td>
                    <td>{{ totalContactCount }}</td>
                    <td>{{ totalSampleCount }}</td>
                    <td>{{ totalOrderCount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 分页 -->
            <Pagination
              v-model="settingPagination"
              :total="40"
              :page-sizes="pageSizeOptions"
              @change="handleSettingPageChange"
            />
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="bottom-buttons">
          <button class="btn-cancel" @click="handleClose">取消</button>
          <button 
            class="btn-save" 
            @click="handleSave"
          >
            {{ settingForm.type === 'department' ? '保存部门业绩目标' : '保存员工业绩目标' }}
          </button>
        </div>
      </div>

      <!-- 业绩明细Tab内容 -->
      <div v-if="activeTab === 'detail'" class="detail-content">
        <!-- 平台选择 -->
        <div class="platform-section">
          <span class="section-label">选择平台:</span>
          <div class="platform-buttons">
            <button
              v-for="platform in platforms"
              :key="platform.value"
              class="platform-btn"
              :class="{ active: detailForm.platform === platform.value }"
              @click="detailForm.platform = platform.value"
            >
              <span class="platform-icon">{{ platform.icon }}</span>
              <span class="platform-name">{{ platform.name }}</span>
            </button>
          </div>
        </div>

        <!-- 主体内容区 -->
        <div class="detail-main-content">
          <!-- 左侧部门树 -->
          <div class="left-panel">
            <div class="panel-title">选择部门</div>
            <div class="org-tree">
              <div class="tree-node" v-for="node in orgTreeData" :key="node.id">
                <div class="tree-node-header" @click="toggleDetailNode(node.id)">
                  <span class="expand-icon" :class="{ expanded: detailExpandedNodes.includes(node.id) }">▶</span>
                  <span>{{ node.name }}</span>
                  <span class="member-count">({{ node.memberCount }}人)</span>
                </div>
                <div v-if="detailExpandedNodes.includes(node.id)">
                  <div 
                    v-for="child in node.children" 
                    :key="child.id"
                    class="tree-child"
                    :class="{ selected: selectedDetailDept === child.id }"
                    @click="selectDetailDept(child)"
                  >
                    <span class="expand-icon" :class="{ expanded: detailExpandedNodes.includes(child.id) }" v-if="child.children">▶</span>
                    <span v-else class="child-indent"></span>
                    <span>{{ child.name }}</span>
                    <span class="member-count">({{ child.memberCount }}人)</span>
                  </div>
                  <div v-if="child.children && detailExpandedNodes.includes(child.id)" v-for="grandchild in child.children" :key="grandchild.id">
                    <div 
                      class="tree-child"
                      :class="{ selected: selectedDetailDept === grandchild.id }"
                      @click="selectDetailDept(grandchild)"
                    >
                      <span class="grandchild-indent"></span>
                      <span>{{ grandchild.name }}</span>
                      <span class="member-count">({{ grandchild.memberCount }}人)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="detail-right-panel">
            <!-- 业绩报告 -->
            <div class="report-section">
              <div class="report-header">
                <span class="report-title">业绩报告</span>
                <el-date-picker
                  v-model="detailForm.month"
                  type="month"
                  value-format="YYYY-MM"
                  placeholder="选择月份"
                  style="width: 100px"
                  placement="bottom-start"
                  teleported
                />
              </div>
              <div class="chart-placeholder">
                <div class="chart-diagonal"></div>
                <div class="chart-diagonal diagonal-2"></div>
                <span class="chart-text">图表详情见上方大图</span>
              </div>
            </div>

            <!-- 成员明细 -->
            <div class="member-detail-section">
              <div class="member-header">
                <span class="member-title">成员明细</span>
                <div class="legend">
                  <span class="legend-item">
                    <span class="legend-color achieved"></span>
                    <span>达成目标</span>
                  </span>
                  <span class="legend-item">
                    <span class="legend-color not-achieved"></span>
                    <span>未达成目标</span>
                  </span>
                </div>
              </div>
              <div class="member-table-wrapper">
                <table class="member-table">
                  <thead>
                    <tr>
                      <th>成员</th>
                      <th>所属部门</th>
                      <th>成交金额</th>
                      <th>建联达人</th>
                      <th>寄样达人</th>
                      <th>出单达人</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(member, index) in detailMemberList" :key="index">
                      <td>{{ member.name }}</td>
                      <td>{{ member.department }}</td>
                      <td class="money-cell">{{ member.dealAmount }}</td>
                      <td :class="{ achieved: member.contactAchieved, 'not-achieved': !member.contactAchieved }">
                        {{ member.contactCount }}
                      </td>
                      <td :class="{ achieved: member.sampleAchieved, 'not-achieved': !member.sampleAchieved }">
                        {{ member.sampleCount }}
                      </td>
                      <td :class="{ achieved: member.orderAchieved, 'not-achieved': !member.orderAchieved }">
                        {{ member.orderCount }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 分页 -->
              <Pagination
                v-model="detailPagination"
                :total="40"
                :page-sizes="pageSizeOptions"
                @change="handleDetailPageChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Pagination from './Pagination.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:model-value'])

const platforms = [
  { name: 'TikTok', value: 'tiktok', icon: 'TT' },
  { name: 'Instagram', value: 'instagram', icon: 'IG' },
  { name: 'Shopee', value: 'shopee', icon: 'SP' },
  { name: 'Lazada', value: 'lazada', icon: 'LZ' }
]

const pageSizeOptions = [10, 20, 30, 40, 50]

const activeTab = ref('setting')
const selectedPlatform = ref('tiktok')
const expandedNodes = ref(['root'])

const settingForm = reactive({
  month: '2025-12',
  type: 'member'
})

const detailForm = reactive({
  platform: 'tiktok',
  month: '2024-07'
})

const settingPagination = ref({ page: 1, pageSize: 10 })
const detailPagination = ref({ page: 1, pageSize: 10 })

const selectedDept = ref('dept2')
const selectedDetailDept = ref('dept2')
const detailExpandedNodes = ref(['root', 'dept2'])

const orgTreeData = ref([
  {
    id: 'root',
    name: '杭州速马众科技有限公司',
    memberCount: 10,
    children: [
      {
        id: 'dept1',
        name: '部门名称1',
        memberCount: 10,
        children: []
      },
      {
        id: 'dept2',
        name: '部门名称2',
        memberCount: 7,
        children: [
          { id: 'dept2-1', name: '部门名称3', memberCount: 4, children: [] }
        ]
      }
    ]
  }
])

const selectedDeptNode = computed(() => {
  const findNode = (nodes) => {
    for (const node of nodes) {
      if (node.id === selectedDept.value) return node
      if (node.children) {
        const found = findNode(node.children)
        if (found) return found
      }
    }
    return null
  }
  return findNode(orgTreeData.value)
})

const memberList = ref([
  { name: '张三', department: '部门名称2', dealAmount: 0, contactCount: 0, sampleCount: 0, orderCount: 0 },
  { name: '李四', department: '部门名称2', dealAmount: 0, contactCount: 0, sampleCount: 0, orderCount: 0 },
  { name: '王五', department: '部门名称2', dealAmount: 0, contactCount: 0, sampleCount: 0, orderCount: 0 },
  { name: '王五', department: '部门名称2', dealAmount: 0, contactCount: 0, sampleCount: 0, orderCount: 0 },
  { name: '赵六', department: '部门名称2', dealAmount: 0, contactCount: 0, sampleCount: 0, orderCount: 0 }
])

const detailMemberList = ref([
  { name: '张三', department: '部门名称2', dealAmount: '¥2.50w/¥10w', contactCount: '5/10', contactAchieved: false, sampleCount: '10/10', sampleAchieved: true, orderCount: '5/10', orderAchieved: false },
  { name: '李四', department: '部门名称2', dealAmount: '¥12.20w/¥10w', contactCount: '12/10', contactAchieved: true, sampleCount: '5/10', sampleAchieved: false, orderCount: '5/10', orderAchieved: false },
  { name: '王五', department: '部门名称2', dealAmount: '¥5.50w/¥10w', contactCount: '5/10', contactAchieved: false, sampleCount: '5/10', sampleAchieved: false, orderCount: '10/10', orderAchieved: true },
  { name: '赵六', department: '部门名称2', dealAmount: '¥5.50w/¥10w', contactCount: '5/0', contactAchieved: false, sampleCount: '5/0', sampleAchieved: false, orderCount: '5/0', orderAchieved: false }
])

const totalDealAmount = computed(() => {
  return memberList.value.reduce((sum, m) => sum + (Number(m.dealAmount) || 0), 0)
})

const totalContactCount = computed(() => {
  return memberList.value.reduce((sum, m) => sum + (Number(m.contactCount) || 0), 0)
})

const totalSampleCount = computed(() => {
  return memberList.value.reduce((sum, m) => sum + (Number(m.sampleCount) || 0), 0)
})

const totalOrderCount = computed(() => {
  return memberList.value.reduce((sum, m) => sum + (Number(m.orderCount) || 0), 0)
})

const toggleNode = (nodeId) => {
  const index = expandedNodes.value.indexOf(nodeId)
  if (index > -1) {
    expandedNodes.value.splice(index, 1)
  } else {
    expandedNodes.value.push(nodeId)
  }
}

const selectDept = (node) => {
  selectedDept.value = node.id
}

const toggleDetailNode = (nodeId) => {
  const index = detailExpandedNodes.value.indexOf(nodeId)
  if (index > -1) {
    detailExpandedNodes.value.splice(index, 1)
  } else {
    detailExpandedNodes.value.push(nodeId)
  }
}

const selectDetailDept = (node) => {
  selectedDetailDept.value = node.id
}

const handleSettingPageChange = (pagination) => {
  settingPagination.value = pagination
}

const handleDetailPageChange = (pagination) => {
  detailPagination.value = pagination
}

const handleClose = () => {
  emit('update:model-value', false)
}

const handleSave = () => {
  if (settingForm.type === 'department') {
    ElMessage.success('部门业绩目标保存成功')
  } else {
    ElMessage.success('员工业绩目标保存成功')
  }
  handleClose()
}
</script>

<style lang="scss" scoped>
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.drawer-tabs {
  display: flex;
  gap: 32px;
  padding: 16px 20px;
  border-bottom: 1px solid #E8E8E8;
  background: #fafafa;
}

.drawer-tab {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  padding-bottom: 8px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: #333;
  }

  &.active {
    color: #1890ff;
    border-bottom-color: #1890ff;
  }
}

.setting-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.platform-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-label {
  font-size: 14px;
  color: #333;
}

.platform-buttons {
  display: flex;
  gap: 8px;
}

.platform-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
  }

  &.active {
    border-color: #1890ff;
    background: #e6f7ff;
  }
}

.platform-icon {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #1890ff;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.platform-name {
  font-size: 13px;
  color: #333;
}

.config-row {
  margin-bottom: 16px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-label {
  font-size: 14px;
  color: #333;
}

.radio-group {
  display: flex;
  gap: 24px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  input {
    display: none;
  }

  .radio-dot {
    width: 14px;
    height: 14px;
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: transparent;
      transition: background 0.2s;
    }
  }

  input:checked + .radio-dot {
    border-color: #1890ff;

    &::after {
      background: #1890ff;
    }
  }
}

.main-content {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.left-panel {
  width: 240px;
  flex-shrink: 0;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  background: #fff;
}

.panel-title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #E8E8E8;
}

.org-tree {
  padding: 8px;
}

.tree-node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  cursor: pointer;
  font-size: 13px;
  color: #333;

  &:hover {
    background: #f5f5f5;
  }
}

.tree-child {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 6px 24px;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }

  &.selected {
    background: #e6f7ff;
    color: #1890ff;
  }
}

.tree-grandchildren {
  padding-left: 16px;
}

.grandchild-indent {
  display: inline-block;
  width: 16px;
}

.child-indent {
  display: inline-block;
  width: 14px;
}

.expand-icon {
  font-size: 8px;
  color: #999;
  transition: transform 0.2s;
  transform: rotate(0deg);

  &.expanded {
    transform: rotate(90deg);
  }
}

.member-count {
  font-size: 12px;
  color: #999;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dept-target {
  padding: 12px 16px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 4px;
  margin-bottom: 16px;
}

.dept-target-title {
  font-size: 14px;
  font-weight: 500;
  color: #d46b08;
  margin-bottom: 8px;
}

.dept-target-values {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.target-item {
  font-size: 13px;
  color: #666;
}

.target-table-wrapper {
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.target-table {
  width: 100%;
  border-collapse: collapse;
}

.target-table th,
.target-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #E8E8E8;
  font-size: 13px;
}

.target-table th {
  background: #fafafa;
  font-weight: 500;
  color: #333;
}

.target-table tbody tr:hover {
  background: #fafafa;
}

.target-table .total-row {
  background: #fafafa;
  font-weight: 500;
  color: #333;
}

.help-icon {
  font-size: 10px;
  color: #999;
  cursor: help;
}

.input-with-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.control-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
}

.target-input {
  width: 60px;
  height: 24px;
  text-align: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #1890ff;
  }
}



.bottom-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E8E8E8;
}

.btn-cancel {
  padding: 8px 24px;
  border: 1px solid #d9d9d9;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
}

.btn-save {
  padding: 8px 24px;
  border: none;
  background: #1890ff;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #40a9ff;
  }
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.detail-main-content {
  display: flex;
  gap: 20px;
}

.detail-right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.report-section {
  background: #fff;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.report-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.chart-placeholder {
  height: 150px;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.chart-diagonal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 48%, #d9d9d9 48%, #d9d9d9 52%, transparent 52%);

  &.diagonal-2 {
    background: linear-gradient(225deg, transparent 48%, #d9d9d9 48%, #d9d9d9 52%, transparent 52%);
  }
}

.chart-text {
  font-size: 14px;
  color: #999;
  z-index: 1;
}

.member-detail-section {
  background: #fff;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  padding: 16px;
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.member-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;

  &.achieved {
    background: #b5e8d5;
  }

  &.not-achieved {
    background: #ffe8e8;
  }
}

.member-table-wrapper {
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.member-table {
  width: 100%;
  border-collapse: collapse;
}

.member-table th,
.member-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #E8E8E8;
  font-size: 13px;
}

.member-table th {
  background: #fafafa;
  font-weight: 500;
  color: #333;
}

.member-table tbody tr:nth-child(odd) {
  background: #fff;
}

.member-table tbody tr:nth-child(even) {
  background: #fafafa;
}

.member-table .achieved {
  background: #e6ffed;
  color: #3f8600;
  text-align: center;
}

.member-table .not-achieved {
  background: #fff2f0;
  color: #d93026;
  text-align: center;
}

.money-cell {
  color: #333;
}

:deep(.el-drawer__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #E8E8E8;
  background: #fff;
}

:deep(.el-drawer__title) {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style>
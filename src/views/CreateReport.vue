<template>
  <div class="create-report">
    <!-- 顶部导航 -->
    <div class="report-header">
      <div class="header-left">
        <span class="back-btn" @click="handleBack">
          <span class="back-icon">←</span>
          返回
        </span>
        <span class="header-title">创建报表</span>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="page-content">
      <div class="main-wrapper">
        <!-- 区块A：报表名称 + 分析对象 + 筛选条件 + 字段配置 -->
        <div class="left-panel">
          <div class="section section-a">
            <!-- 报表名称 -->
            <div class="sub-section">
              <div class="section-title">报表名称 <span class="required">*</span></div>
              <div class="report-name-input">
                <el-input
                  v-model="reportName"
                  placeholder="请输入报表名称"
                  :maxlength="30"
                  show-word-limit
                />
              </div>
            </div>

            <!-- 分析对象 -->
            <div class="sub-section">
              <div class="section-title">分析对象 <span class="required">*</span></div>
              <div class="analysis-tabs">
                <div
                  v-for="tab in analysisTabs"
                  :key="tab.value"
                  class="tab-item"
                  :class="{ active: analysisType === tab.value }"
                  @click="handleAnalysisTypeChange(tab.value)"
                >
                  {{ tab.label }}
                </div>
              </div>
            </div>

            <!-- 筛选条件 -->
            <div class="sub-section">
              <div class="section-title">筛选条件</div>
              <div class="filter-row">
                <div class="filter-item">
                  <span class="filter-label">平台</span>
                  <el-select v-model="filters.platform" placeholder="全部" style="width: 160px">
                    <el-option label="全部" value="" />
                    <el-option label="TikTok" value="tiktok" />
                    <el-option label="Shopee" value="shopee" />
                    <el-option label="Lazada" value="lazada" />
                  </el-select>
                </div>
                <div class="filter-item" v-if="analysisType === 'talent'">
                  <span class="filter-label">达人类型</span>
                  <el-select v-model="filters.talentType" placeholder="全部" style="width: 160px">
                    <el-option label="全部" value="" />
                    <el-option label="商家达人" value="merchant" />
                    <el-option label="出单达人" value="active" />
                    <el-option label="建联达人" value="contacted" />
                    <el-option label="合作达人" value="cooperating" />
                  </el-select>
                </div>
                <div class="filter-item">
                  <span class="filter-label">部门</span>
                  <el-select
                    v-model="filters.department"
                    placeholder="全部"
                    filterable
                    clearable
                    style="width: 160px"
                    @change="handleDepartmentChange"
                  >
                    <el-option label="全部" value="" />
                    <el-option label="销售部" value="sales" />
                    <el-option label="运营部" value="ops" />
                    <el-option label="市场部" value="marketing" />
                  </el-select>
                </div>
                <div class="filter-item">
                  <span class="filter-label">员工</span>
                  <el-select
                    v-model="filters.employee"
                    placeholder="全部"
                    filterable
                    clearable
                    style="width: 160px"
                  >
                    <el-option label="全部" value="" />
                    <el-option
                      v-for="emp in filteredEmployees"
                      :key="emp.value"
                      :label="emp.label"
                      :value="emp.value"
                    />
                  </el-select>
                </div>
                <div class="filter-item" v-if="analysisType === 'talent'">
                  <span class="filter-label">标签</span>
                  <el-select v-model="filters.tags" multiple placeholder="全部" style="width: 180px">
                    <el-option label="高价值" value="high_value" />
                    <el-option label="高增长" value="high_growth" />
                    <el-option label="核心" value="core" />
                    <el-option label="新锐" value="new" />
                  </el-select>
                </div>
              </div>

              <!-- 时间范围 -->
              <div class="date-section">
                <div class="filter-item">
                  <span class="filter-label">时间范围 <span class="required">*</span></span>
                  <div class="date-range-wrapper">
                    <div class="date-presets">
                      <span
                        v-for="preset in datePresets"
                        :key="preset.value"
                        class="preset-btn"
                        :class="{ active: selectedPreset === preset.value }"
                        @click="handlePresetSelect(preset.value)"
                      >
                        {{ preset.label }}
                      </span>
                    </div>
                    <el-date-picker
                      v-model="filters.dateRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="YYYY-MM-DD"
                      style="width: 280px"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 字段配置 -->
            <div class="sub-section">
              <div class="section-title">字段配置</div>
              <div class="field-section-header">
                <span>已选字段 <span class="field-count">({{ selectedFields.length }})</span></span>
                <el-button type="primary" link @click="showFieldDialog = true">+ 添加字段</el-button>
              </div>
              <div class="field-tags">
                <el-tag
                  v-for="fieldId in selectedFields"
                  :key="fieldId"
                  closable
                  :disable-transitions="false"
                  @close="handleRemoveField(fieldId)"
                >
                  {{ getFieldLabel(fieldId) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧B区：报表结构预览 + 操作按钮 -->
        <div class="right-panel">
          <div class="section-b">
            <!-- 区块B：报表结构预览 -->
            <div class="preview-section">
              <div class="section-title">报表结构预览</div>
              <div class="preview-info">
                <div class="preview-item">
                  <span class="preview-label">时间范围</span>
                  <span class="preview-value">{{ previewData.dateRange }}</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">创建人</span>
                  <span class="preview-value">{{ previewData.creator }}</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">字段数量</span>
                  <span class="preview-value">{{ previewData.fieldCount }} 个</span>
                </div>
              </div>
              <div class="preview-table">
                <div class="preview-header">
                  <div v-for="fieldId in selectedFields.slice(0, 5)" :key="fieldId" class="preview-cell header">
                    {{ getFieldLabel(fieldId) }}
                  </div>
                </div>
                <div v-for="(row, index) in previewData.mockRows" :key="index" class="preview-row">
                  <div v-for="(cell, cIndex) in row" :key="cIndex" class="preview-cell">
                    {{ cell }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 区块C：操作按钮 -->
            <div class="action-section">
              <el-button @click="handleBack">取消</el-button>
              <el-button type="primary" :loading="submitting" @click="handleSubmit">生成报表</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加字段弹窗 -->
    <el-dialog v-model="showFieldDialog" title="添加字段" width="600px">
      <div class="field-search">
        <el-input v-model="fieldSearchKeyword" placeholder="搜索字段" clearable style="width: 200px" />
      </div>
      <div class="field-groups-dialog">
        <div v-for="group in filteredFieldGroups" :key="group.name" class="field-group-dialog">
          <div class="group-title">{{ group.name }}</div>
          <div class="group-fields">
            <div
              v-for="field in group.fields"
              :key="field.id"
              class="field-item-dialog"
              :class="{ selected: selectedFields.includes(field.id), disabled: field.isDefault }"
              @click="handleFieldToggle(field)"
            >
              <el-checkbox
                :model-value="selectedFields.includes(field.id)"
                :disabled="field.isDefault || (!selectedFields.includes(field.id) && selectedFields.value.length >= 20)"
              />
              <span class="field-label">{{ field.label }}</span>
              <span v-if="field.isDefault" class="default-tag">默认</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showFieldDialog = false">取消</el-button>
        <el-button type="primary" @click="showFieldDialog = false">确定</el-button>
      </template>
    </el-dialog>

    <!-- 离开页面确认 -->
    <el-dialog v-model="showLeaveDialog" title="确认离开" width="400px" center>
      <p>当前有未保存的更改，确认离开吗？</p>
      <template #footer>
        <el-button @click="showLeaveDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmLeave">确定离开</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 报表名称
const reportName = ref('')

// 分析对象
const analysisType = ref('talent')
const analysisTabs = [
  { label: '出单达人', value: 'talent' },
  { label: '员工', value: 'employee' },
  { label: '商品链接', value: 'product' }
]

// 筛选条件
const filters = reactive({
  platform: '',
  talentType: '',
  department: '',
  employee: '',
  tags: [],
  dateRange: []
})

// 员工列表
const allEmployees = [
  { label: '张三', value: 'zhangsan', department: 'sales' },
  { label: '李四', value: 'lisi', department: 'sales' },
  { label: '王五', value: 'wangwu', department: 'ops' },
  { label: '赵六', value: 'zhaoliu', department: 'ops' },
  { label: '钱七', value: 'qianqi', department: 'marketing' }
]

// 根据部门筛选员工
const filteredEmployees = computed(() => {
  if (!filters.department) return allEmployees
  return allEmployees.filter(emp => emp.department === filters.department)
})

// 部门变化时重置员工选择
const handleDepartmentChange = () => {
  filters.employee = ''
}

// 日期预设
const selectedPreset = ref('')
const datePresets = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year' },
  { label: '上一月', value: 'lastMonth' },
  { label: '上一周', value: 'lastWeek' },
  { label: '上一年', value: 'lastYear' }
]

// 字段分组
const fieldGroups = ref([
  {
    name: '基础字段',
    fields: [
      { id: 'platform', label: '平台', isDefault: true },
      { id: 'influencerName', label: '达人用户名', isDefault: true },
      { id: 'influencerId', label: '达人名称', isDefault: true },
      { id: 'shopId', label: '店铺ID', isDefault: false },
      { id: 'shopName', label: '店铺名称', isDefault: false }
    ]
  },
  {
    name: '属性字段',
    fields: [
      { id: 'category', label: '所属类目', isDefault: false },
      { id: 'spu', label: '所属SPU', isDefault: false },
      { id: 'price', label: '商品价格', isDefault: false },
      { id: 'tags', label: '标签', isDefault: false }
    ]
  },
  {
    name: '统计字段',
    fields: [
      { id: 'gmv', label: '成交金额', isDefault: false },
      { id: 'orderCount', label: '成交订单数', isDefault: false },
      { id: 'actualGmv', label: '实际成交金额', isDefault: false },
      { id: 'refundAmount', label: '退款金额', isDefault: false }
    ]
  }
])

// 已选字段 - 出单达人默认3个基础字段
const defaultFields = ['platform', 'influencerName', 'influencerId']
const selectedFields = ref([...defaultFields])

// 字段弹窗
const showFieldDialog = ref(false)
const fieldSearchKeyword = ref('')

// 提交状态
const submitting = ref(false)

// 离开确认弹窗
const showLeaveDialog = ref(false)

// 预览数据
const previewData = reactive({
  dateRange: '',
  creator: '当前用户',
  fieldCount: 0,
  mockRows: []
})

// 获取字段标签
const getFieldLabel = (fieldId) => {
  for (const group of fieldGroups.value) {
    const field = group.fields.find(f => f.id === fieldId)
    if (field) return field.label
  }
  return fieldId
}

// 过滤后的字段分组（用于弹窗搜索）
const filteredFieldGroups = computed(() => {
  if (!fieldSearchKeyword.value) return fieldGroups.value
  const keyword = fieldSearchKeyword.value.toLowerCase()
  return fieldGroups.value.map(group => ({
    ...group,
    fields: group.fields.filter(f => f.label.toLowerCase().includes(keyword))
  })).filter(group => group.fields.length > 0)
})

// 更新预览数据
const updatePreview = () => {
  // 时间范围
  if (filters.dateRange && filters.dateRange.length === 2) {
    previewData.dateRange = `${filters.dateRange[0]} 至 ${filters.dateRange[1]}`
  } else {
    previewData.dateRange = '未选择'
  }
  previewData.fieldCount = selectedFields.value.length

  // 生成模拟数据行
  const mockData = {}
  selectedFields.value.forEach(fieldId => {
    mockData[fieldId] = getFieldLabel(fieldId)
  })

  previewData.mockRows = Array.from({ length: 5 }, (_, i) => {
    return selectedFields.value.map(fieldId => {
      const base = getFieldLabel(fieldId)
      if (fieldId === 'platform') return ['TikTok', 'Shopee', 'Lazada'][i % 3]
      if (fieldId === 'gmv' || fieldId === 'actualGmv' || fieldId === 'refundAmount') return `¥${(Math.random() * 100).toFixed(2)}w`
      if (fieldId === 'orderCount') return `${Math.floor(Math.random() * 1000)}`
      return `${base}-${i + 1}`
    })
  })
}

// 处理分析对象切换
const handleAnalysisTypeChange = (type) => {
  analysisType.value = type
  filters.platform = ''
  filters.talentType = ''
  filters.department = ''
  filters.employee = ''
  filters.tags = []
  filters.dateRange = []
  selectedPreset.value = ''

  // 根据分析对象设置不同默认字段
  if (type === 'talent') {
    selectedFields.value = ['platform', 'influencerName', 'influencerId']
  } else if (type === 'employee') {
    selectedFields.value = ['platform', 'employeeName']
  } else {
    selectedFields.value = ['platform', 'productName']
  }
  updatePreview()
}

// 处理日期预设选择
const handlePresetSelect = (preset) => {
  selectedPreset.value = preset
  const today = new Date()
  let startDate = ''
  let endDate = formatDate(today)

  switch (preset) {
    case 'week':
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      startDate = formatDate(weekStart)
      break
    case 'month':
      startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1))
      break
    case 'year':
      startDate = formatDate(new Date(today.getFullYear(), 0, 1))
      break
    case 'lastMonth':
      startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1))
      endDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0))
      break
    case 'lastWeek':
      const lastWeekStart = new Date(today)
      lastWeekStart.setDate(today.getDate() - 7)
      startDate = formatDate(lastWeekStart)
      break
    case 'lastYear':
      startDate = formatDate(new Date(today.getFullYear() - 1, 0, 1))
      endDate = formatDate(new Date(today.getFullYear() - 1, 11, 31))
      break
  }

  filters.dateRange = [startDate, endDate]
  updatePreview()
}

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 处理字段切换（弹窗中）
const handleFieldToggle = (field) => {
  if (field.isDefault) return
  if (selectedFields.value.includes(field.id)) {
    handleRemoveField(field.id)
  } else {
    if (selectedFields.value.length >= 20) {
      ElMessage.warning('最多选择20个字段')
      return
    }
    selectedFields.value.push(field.id)
  }
  updatePreview()
}

// 移除字段
const handleRemoveField = (fieldId) => {
  const field = fieldGroups.value.flatMap(g => g.fields).find(f => f.id === fieldId)
  if (field?.isDefault) {
    ElMessage.warning('默认字段不可移除')
    return
  }
  const index = selectedFields.value.indexOf(fieldId)
  if (index > -1) {
    selectedFields.value.splice(index, 1)
  }
  updatePreview()
}

// 返回
const handleBack = () => {
  router.push('/report-center')
}

// 确认离开
const confirmLeave = () => {
  showLeaveDialog.value = false
  router.push('/report-center')
}

// 提交
const handleSubmit = () => {
  if (!reportName.value.trim()) {
    ElMessage.warning('请输入报表名称')
    return
  }
  if (!filters.dateRange || filters.dateRange.length !== 2) {
    ElMessage.warning('请选择时间范围')
    return
  }

  submitting.value = true
  setTimeout(() => {
    ElMessage.success('创建报表成功')
    submitting.value = false
    router.push('/report-center')
  }, 500)
}

// 监听字段变化
watch(selectedFields, updatePreview, { deep: true })

onMounted(() => {
  // 默认选择上一月
  handlePresetSelect('lastMonth')
  updatePreview()
})
</script>

<style lang="scss" scoped>
$primary: #0064E0;
$white: #FFFFFF;
$bg: #f5f7fa;
$divider: #e5e7eb;
$text-1: #050505;
$text-2: #65676B;
$text-3: #BCC0C4;
$primary-text: #050505;
$secondary-text: #65676B;
$border-radius-lg: 12px;

.create-report {
  min-height: 100%;
  background: $bg;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  margin-left: -16px;
  margin-right: -16px;
  background: $white;
  border-bottom: 1px solid $divider;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: $text-2;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;

  &:hover {
    color: $primary;
  }
}

.back-icon {
  font-size: 16px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: $primary-text;
}

.page-content {
  padding: 16px 0 24px;
}

.main-wrapper {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.left-panel {
  flex: 2;
  min-width: 0;
}

.right-panel {
  flex: 3;
  flex-shrink: 0;
}

// 区块B：包含预览和操作按钮
.section-b {
  background: $white;
  border-radius: $border-radius-lg;
  padding: 16px;
  border: 1px solid $divider;
}

// 区块A：包含所有子区块的大区块
.section-a {
  background: $white;
  border-radius: $border-radius-lg;
  padding: 16px;
  border: 1px solid $divider;
}

.sub-section {
  padding: 16px 0;
  border-bottom: 1px solid $divider;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $primary-text;
  margin-bottom: 16px;
}

.required {
  color: #ff4d4f;
}

// 报表名称
.report-name-input {
  width: 400px;
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
}

// 分析对象
.analysis-tabs {
  display: flex;
  gap: 0;
  border: 1px solid $divider;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
}

.tab-item {
  padding: 10px 24px;
  font-size: 14px;
  color: $text-2;
  cursor: pointer;
  border-right: 1px solid $divider;
  transition: all 0.2s;
  user-select: none;

  &:last-child {
    border-right: none;
  }

  &:hover {
    color: $primary;
  }

  &.active {
    background: $primary;
    color: $white;
  }
}

// 筛选条件
.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: $secondary-text;
  white-space: nowrap;
}

.date-section {
  padding-top: 8px;
}

.date-range-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-presets {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 4px 10px;
  font-size: 12px;
  color: $text-2;
  background: $bg;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: $primary;
  }

  &.active {
    background: #e6f4ff;
    color: $primary;
  }
}

// 字段配置
.field-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: $text-2;
  margin-bottom: 12px;
}

.field-count {
  color: $primary;
  font-weight: 500;
}

.field-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  :deep(.el-tag) {
    border-radius: 4px;
  }
}

// 报表预览
.preview-section {
  .preview-info {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $divider;
  }

  .preview-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .preview-label {
    font-size: 12px;
    color: $text-3;
  }

  .preview-value {
    font-size: 13px;
    color: $primary-text;
  }
}

.preview-table {
  border: 1px solid $divider;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  background: $bg;
}

.preview-row {
  display: flex;
  border-top: 1px solid $divider;

  &:nth-child(even) {
    background: #fafafa;
  }
}

.preview-cell {
  flex: 1;
  padding: 8px 12px;
  font-size: 12px;
  color: $text-2;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.header {
    font-weight: 600;
    color: $primary-text;
  }
}

// 区块C：操作按钮
.action-section {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid $divider;
  margin-top: 0;
}

// 弹窗内字段
.field-search {
  margin-bottom: 16px;
}

.field-groups-dialog {
  max-height: 400px;
  overflow-y: auto;
}

.field-group-dialog {
  margin-bottom: 16px;

  .group-title {
    font-size: 13px;
    font-weight: 600;
    color: $primary-text;
    margin-bottom: 8px;
    padding-left: 8px;
    border-left: 3px solid $primary;
  }

  .group-fields {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.field-item-dialog {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: $bg;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:hover {
    border-color: #d6e4ff;
  }

  &.selected {
    background: #f0f7ff;
    border-color: $primary;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.field-label {
  font-size: 13px;
  color: $primary-text;
}

.default-tag {
  font-size: 10px;
  color: $text-3;
  background: $divider;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 2px;
}
</style>

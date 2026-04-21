<template>
  <div class="create-report">
    <!-- 主内容 -->
    <div class="page-content">
      <!-- 区域A：报表名称 -->
      <div class="section">
        <div class="section-title">报表名称</div>
        <div class="report-name-input">
          <el-input
            v-model="reportName"
            placeholder="请输入报表名称"
            :maxlength="100"
            show-word-limit
          />
        </div>
      </div>

      <!-- 区域B：分析对象 -->
      <div class="section">
        <div class="section-title">分析对象</div>
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

      <!-- 区域C：筛选条件 -->
      <div class="section">
        <div class="section-title">筛选条件</div>
        <div class="filter-row">
          <div class="filter-item">
            <span class="filter-label">平台</span>
            <el-select v-model="filters.platform" placeholder="请选择" style="width: 180px">
              <el-option label="全部" value="" />
              <el-option label="TikTok" value="tiktok" />
              <el-option label="Shopee" value="shopee" />
              <el-option label="Lazada" value="lazada" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">达人类型</span>
            <el-select v-model="filters.talentType" placeholder="请选择" style="width: 180px">
              <el-option label="全部" value="" />
              <el-option label="出单达人" value="active" />
              <el-option label="建联达人" value="contacted" />
              <el-option label="合作达人" value="cooperating" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">部门</span>
            <el-select v-model="filters.department" placeholder="请选择" style="width: 180px">
              <el-option label="全部" value="" />
              <el-option label="销售部" value="sales" />
              <el-option label="运营部" value="ops" />
              <el-option label="市场部" value="marketing" />
            </el-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">员工</span>
            <el-select v-model="filters.employee" placeholder="请选择" style="width: 180px">
              <el-option label="全部" value="" />
              <el-option label="张三" value="zhangsan" />
              <el-option label="李四" value="lisi" />
              <el-option label="王五" value="wangwu" />
            </el-select>
          </div>
        </div>
        <div class="date-section">
          <div class="filter-item">
            <span class="filter-label">时间范围</span>
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

      <!-- 区域D：字段配置 -->
      <div class="section">
        <div class="section-title">字段配置</div>
        <div class="field-section-header">
          <span>已选字段 <span class="field-count">({{ selectedFields.length }})</span></span>
        </div>
        <div class="field-content">
          <div class="field-groups">
            <div
              v-for="group in fieldGroups"
              :key="group.name"
              class="field-group"
            >
              <div class="group-title">{{ group.name }}</div>
              <div class="group-fields">
                <div
                  v-for="field in group.fields"
                  :key="field.id"
                  class="field-item"
                  :class="{
                    selected: selectedFields.includes(field.id),
                    disabled: field.isDefault
                  }"
                  @click="handleFieldClick(field)"
                >
                  <el-checkbox
                    :model-value="selectedFields.includes(field.id)"
                    :disabled="field.isDefault"
                    @click.stop
                    @change="(val) => handleFieldCheck(field, val)"
                  />
                  <span class="field-label">{{ field.label }}</span>
                  <el-tooltip :content="field.tooltip" placement="top" effect="light">
                    <span class="help-icon">?</span>
                  </el-tooltip>
                  <span v-if="field.isDefault" class="default-tag">默认</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 区域E：底部操作 -->
      <div class="page-footer">
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="handleSubmit">生成报表</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const setThirdLevelPage = inject('setThirdLevelPage')

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
  dateRange: []
})

// 日期预设
const selectedPreset = ref('')
const datePresets = [
  { label: '今天', value: 'today' },
  { label: '近7天', value: 'week' },
  { label: '近30天', value: 'month' },
  { label: '本月', value: 'thisMonth' },
  { label: '上月', value: 'lastMonth' },
  { label: '本季度', value: 'quarter' }
]

// 字段分组 - 完整指标
const fieldGroups = ref([
  {
    name: '交易指标',
    fields: [
      { id: 'gmv', label: '成交金额', tooltip: '支付成功订单的买家实付金额汇总（含退款）', isDefault: true },
      { id: 'orderCount', label: '成交订单数', tooltip: '支付成功订单数量汇总', isDefault: false },
      { id: 'firstOrderTalentGmv', label: '首次出单达人成交金额', tooltip: '首次出单达人的成交金额', isDefault: false },
      { id: 'actualGmv', label: '实际成交金额', tooltip: '剔除退款后的成交金额', isDefault: false },
      { id: 'settleAmount', label: '结算金额', tooltip: '已结算订单金额', isDefault: false },
      { id: 'commissionAmount', label: '计佣金额', tooltip: '计算佣金的金额', isDefault: false },
      { id: 'estimatedCommission', label: '预估达人佣金', tooltip: '预估达人佣金金额', isDefault: false },
      { id: 'refundAmount', label: '退款金额', tooltip: '退款成功订单金额汇总', isDefault: false }
    ]
  },
  {
    name: '内容指标',
    fields: [
      { id: 'contentViews', label: '内容曝光', tooltip: '内容曝光次数', isDefault: false },
      { id: 'contentLikes', label: '内容获赞', tooltip: '内容获赞数', isDefault: false },
      { id: 'contentShares', label: '内容分享', tooltip: '内容分享数', isDefault: false },
      { id: 'contentComments', label: '内容评论', tooltip: '内容评论数', isDefault: false }
    ]
  },
  {
    name: '达人指标',
    fields: [
      { id: 'orderTalentCount', label: '出单达人数', tooltip: '有成交订单的达人数', isDefault: false },
      { id: 'contactTalentCount', label: '建联达人数', tooltip: '成功建联的达人数', isDefault: false },
      { id: 'sampleTalentCount', label: '寄样达人数', tooltip: '寄样达人数', isDefault: false },
      { id: 'cooperationTalentCount', label: '合作达人数', tooltip: '合作达人数', isDefault: false }
    ]
  },
  {
    name: '寄样指标',
    fields: [
      { id: 'sampleApplyCount', label: '申请寄样数', tooltip: '申请寄样单数量', isDefault: false },
      { id: 'sampleSendCount', label: '发货寄样数', tooltip: '发货寄样单数量', isDefault: false },
      { id: 'sampleCost', label: '寄样费用', tooltip: '寄样总费用', isDefault: false }
    ]
  },
  {
    name: '提成指标',
    fields: [
      { id: 'commission', label: '预估佣金', tooltip: '预估达人佣金金额', isDefault: false },
      { id: 'commissionBase', label: '提成基数', tooltip: '计算提成的基础金额', isDefault: false },
      { id: 'commissionRatio', label: '提成比例', tooltip: '提成比例', isDefault: false }
    ]
  }
])

// 已选字段
const selectedFields = ref(['gmv'])

// 处理分析对象切换
const handleAnalysisTypeChange = (type) => {
  analysisType.value = type
  filters.platform = ''
  filters.talentType = ''
  filters.department = ''
  filters.employee = ''
  filters.dateRange = []
  selectedPreset.value = ''
  selectedFields.value = ['gmv']
}

// 处理日期预设选择
const handlePresetSelect = (preset) => {
  selectedPreset.value = preset
  const today = new Date()
  let startDate = ''
  let endDate = formatDate(today)

  switch (preset) {
    case 'today':
      startDate = endDate
      break
    case 'week':
      startDate = formatDate(new Date(today.setDate(today.getDate() - 7)))
      break
    case 'month':
      startDate = formatDate(new Date(today.setDate(today.getDate() - 30)))
      break
    case 'thisMonth':
      startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1))
      break
    case 'lastMonth':
      startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1))
      endDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0))
      break
    case 'quarter':
      const quarter = Math.floor(today.getMonth() / 3)
      startDate = formatDate(new Date(today.getFullYear(), quarter * 3, 1))
      break
  }

  filters.dateRange = [startDate, endDate]
}

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 处理字段点击
const handleFieldClick = (field) => {
  if (field.isDefault) return
  if (selectedFields.value.includes(field.id)) {
    handleFieldRemove(field)
  } else {
    handleFieldAdd(field)
  }
}

// 处理字段勾选
const handleFieldCheck = (field, checked) => {
  if (field.isDefault) return
  if (checked) {
    handleFieldAdd(field)
  } else {
    handleFieldRemove(field)
  }
}

// 添加字段
const handleFieldAdd = (field) => {
  if (selectedFields.value.length >= 20) {
    ElMessage.warning('最多选择20个字段')
    return
  }
  if (!selectedFields.value.includes(field.id)) {
    selectedFields.value.push(field.id)
  }
}

// 移除字段
const handleFieldRemove = (field) => {
  if (field.isDefault) {
    ElMessage.warning('默认字段不可移除')
    return
  }
  const index = selectedFields.value.indexOf(field.id)
  if (index > -1) {
    selectedFields.value.splice(index, 1)
  }
}

// 返回
const handleBack = () => {
  setThirdLevelPage('')
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
  if (selectedFields.value.length < 3) {
    ElMessage.warning('至少选择3个字段')
    return
  }

  ElMessage.success('创建报表成功')
  setThirdLevelPage('')
}
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

.page-content {
  padding: 16px;
  max-width: 1000px;
}

// 通用区块样式
.section {
  background: $white;
  border-radius: $border-radius-lg;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid $divider;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $primary-text;
  margin-bottom: 16px;
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
  gap: 24px;
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
  font-size: 13px;
  color: $text-2;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid $divider;
}

.field-count {
  color: $primary;
  font-weight: 500;
}

.field-content {
  max-height: 400px;
  overflow-y: auto;
}

.field-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-group {
  .group-title {
    font-size: 13px;
    font-weight: 600;
    color: $primary-text;
    margin-bottom: 10px;
    padding-left: 8px;
    border-left: 3px solid $primary;
  }
}

.group-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.field-item {
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

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e5e7eb;
  color: $text-3;
  font-size: 10px;
  cursor: help;
  margin-left: 2px;
}

.default-tag {
  font-size: 10px;
  color: $text-3;
  background: $divider;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 2px;
}

// 底部操作
.page-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0;
}

// Tooltip 样式
:deep(.el-tooltip__popper) {
  background: #fff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  max-width: 280px;
  padding: 0;
  .el-tooltip__content {
    padding: 10px 12px;
    color: #4e5969;
    font-family: PingFang SC;
    font-size: 12px;
    line-height: 20px;
    white-space: pre-line;
  }
  .el-tooltip__arrow::before {
    background: #fff;
    border-color: #e5e7eb;
  }
}
</style>

<template>
  <div class="invitation-management-page">
    <!-- 店铺选择区 -->
    <div class="shop-selector-header">
      <span class="shop-label">TikTok店铺：</span>
      <el-select v-model="activeShop" placeholder="请选择店铺" style="width: 240px" @change="handleShopChange">
        <el-option label="XXX旗舰店" value="XXX旗舰店" />
        <el-option label="DOHOZZ官方店" value="DOHOZZ官方店" />
      </el-select>
    </div>

    <!-- 功能选项卡区 -->
    <div class="function-cards-container">
      <div 
        v-for="card in functionCards" 
        :key="card.id" 
        class="function-card"
        :class="{ active: card.active }"
        @click="handleCardClick(card)"
      >
        <div class="card-icon">
          <svg viewBox="0 0 1024 1024" width="24" height="24">
            <path d="M512 170.666667l341.333333 341.333333-85.333333 85.333333-170.666667-170.666666v426.666666h-170.666666v-426.666666l-170.666667 170.666666-85.333333-85.333333 341.333333-341.333333z" fill="currentColor"></path>
          </svg>
        </div>
        <div class="card-content">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 功能配置区 -->
    <div class="config-section">
      <div class="section-title">清理定向邀约</div>
      
      <div class="config-form">
        <div class="form-row">
          <span class="form-label">清理方式：</span>
          <el-select v-model="cleanType" style="width: 380px" @change="handleCleanTypeChange">
            <el-option label="清理未接受邀约达人以及删除空邀约计划" value="remove_and_delete" />
            <el-option label="只清理邀约计划中未接受邀约达人" value="remove_only" />
            <el-option label="删除邀约计划（即使有达人接受邀约）" value="delete_all" />
          </el-select>
        </div>

        <div class="form-row align-start">
          <span class="form-label">数据范围：</span>
          <el-radio-group v-model="dataRange" class="data-range-group" @change="handleDataRangeChange">
            <el-radio value="ongoing">进行中的计划</el-radio>
            <el-radio value="expired">已到期的计划</el-radio>
            <el-radio value="custom">自定义邀约计划</el-radio>
          </el-radio-group>
        </div>

        <div class="form-row" v-if="dataRange === 'ongoing'">
          <span class="form-label">时间：</span>
          <span class="time-prefix-text">清理更新时间在</span>
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
            style="width: 260px; margin: 0 8px;"
          />
          <span class="time-suffix-text">区间内的邀约</span>
        </div>

        <div class="form-row submit-row">
          <el-button type="primary" class="btn-start-clean" @click="handleStartClean">开始清理</el-button>
        </div>
      </div>
    </div>

    <!-- 确认开始清理弹窗 -->
    <el-dialog
      v-model="showConfirmModal"
      title="确认开始清理？"
      width="480px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="confirm-preview">
        <div class="preview-item">
          <span class="preview-label">清理方式：</span>
          <span class="preview-value">{{ getCleanTypeLabel() }}</span>
        </div>
        <div class="preview-item">
          <span class="preview-label">数据范围：</span>
          <span class="preview-value">{{ getDataRangeLabel() }}</span>
        </div>
        <div class="preview-item" v-if="dataRange === 'ongoing' && timeRange && timeRange.length === 2">
          <span class="preview-label">时间范围：</span>
          <span class="preview-value">{{ timeRange[0] }} ~ {{ timeRange[1] }}</span>
        </div>
        
        <div class="preview-estimate">
          预计清理：<span class="highlight">5</span>个邀约计划中的<span class="highlight">20</span>个未接受邀约达人
        </div>

        <div class="preview-warning">
          ⚠ 清理后将无法恢复，请谨慎操作。
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showConfirmModal = false">取消</el-button>
          <el-button type="primary" @click="executeClean" :loading="isCleaning">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 选择邀约计划弹窗 -->
    <el-dialog
      v-model="showCustomPlanModal"
      title="选择邀约计划"
      width="800px"
      :close-on-click-modal="false"
      class="custom-dialog custom-plan-dialog"
    >
      <div class="custom-plan-header">
        <div class="header-row">
          <span class="header-label">数据范围：</span>
          <el-radio-group v-model="modalDataRange" disabled>
            <el-radio value="ongoing">进行中的计划</el-radio>
            <el-radio value="expired">已到期的计划</el-radio>
            <el-radio value="custom">自定义邀约计划</el-radio>
          </el-radio-group>
        </div>

        <div class="header-filters">
          <el-tabs v-model="modalTab" class="status-tabs">
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="进行中(66)" name="ongoing"></el-tab-pane>
            <el-tab-pane label="已到期(66)" name="expired"></el-tab-pane>
          </el-tabs>
          
          <el-input 
            v-model="modalSearch" 
            placeholder="请输入邀约名称/邀约ID进行搜索" 
            prefix-icon="Search"
            style="width: 280px"
            clearable
          />
        </div>
      </div>

      <div class="plan-table-wrapper">
        <el-table
          :data="filteredPlans"
          style="width: 100%"
          height="300"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="邀约名称" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="plan-name-cell">
                <div class="plan-name">{{ row.name }}</div>
                <div class="plan-id">ID: {{ row.id }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="计划状态" width="100">
            <template #default="{ row }">
              <span class="status-text" :class="row.status === '进行中' ? 'text-ongoing' : 'text-expired'">
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="最近更新时间" width="160" />
          <el-table-column prop="productCount" label="商品数量" width="100" />
          <el-table-column prop="talentCount" label="达人数量" width="100" />
          <template #empty>
            <div class="empty-text">暂无搜索结果</div>
          </template>
        </el-table>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancelCustomPlan">取消</el-button>
          <el-button type="primary" @click="confirmCustomPlan" :disabled="selectedPlans.length === 0">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ==== State ====
const activeShop = ref('XXX旗舰店')
const cleanType = ref('remove_and_delete')
const dataRange = ref('ongoing')
const timeRange = ref([])
const isCleaning = ref(false)

// Init default 30 days
onMounted(() => {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
  const formatDate = (d) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  timeRange.value = [formatDate(start), formatDate(end)]
})

// Cards Config
const functionCards = ref([
  {
    id: 1,
    title: '清理定向邀约计划',
    desc: '清理您定向邀约计划中没有接受邀约的达人',
    active: true,
    route: 'current'
  },
  {
    id: 2,
    title: '填充空余邀约计划',
    desc: '向空余的邀约计划或者达人未达上限的邀约计划中添加达人',
    active: false,
    route: 'fill'
  },
  {
    id: 3,
    title: '批量添加商品',
    desc: '向您现存的邀约计划中批量的添加商品',
    active: false,
    route: 'add_product'
  },
  {
    id: 4,
    title: '批量删除商品',
    desc: '向您现存的邀约计划中批量的删除指定商品',
    active: false,
    route: 'delete_product'
  },
  {
    id: 5,
    title: '批量修改佣金率',
    desc: '向您现存的邀约计划中批量修改商品佣金率',
    active: false,
    route: 'modify_commission'
  },
  {
    id: 6,
    title: '合并现存邀约计划',
    desc: '将现存的两个邀约计划中的达人进行合并',
    active: false,
    route: 'merge_plan'
  }
])

// Handlers
const handleShopChange = () => {
  // Reset filters
  cleanType.value = 'remove_and_delete'
  dataRange.value = 'ongoing'
  // Date resets via onMounted logic usually or reset directly
}

const handleCardClick = (card) => {
  if (card.active) return
  ElMessage.info(`Redirecting to ${card.title} page...`)
}

const handleCleanTypeChange = (val) => {
  if (val === 'delete_all') {
    ElMessageBox.confirm('确定要删除邀约计划（即使有达人接受邀约）吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(() => {
      cleanType.value = 'remove_and_delete'
    })
  }
}

const handleDataRangeChange = (val) => {
  if (val === 'custom') {
    showCustomPlanModal.value = true
  }
}

// ==== Start Clean ====
const showConfirmModal = ref(false)

const getCleanTypeLabel = () => {
  const map = {
    'remove_and_delete': '清理未接受邀约达人以及删除空邀约计划',
    'remove_only': '只清理邀约计划中未接受邀约达人',
    'delete_all': '删除邀约计划（即使有达人接受邀约）'
  }
  return map[cleanType.value]
}

const getDataRangeLabel = () => {
  const map = {
    'ongoing': '进行中的计划',
    'expired': '已到期的计划',
    'custom': '自定义邀约计划'
  }
  return map[dataRange.value]
}

const handleStartClean = () => {
  if (dataRange.value === 'ongoing' && (!timeRange.value || timeRange.value.length !== 2)) {
    ElMessage.error('请选择时间范围')
    return
  }
  if (dataRange.value === 'custom' && finalizedSelectedPlans.value.length === 0) {
    ElMessage.error('请选择邀约计划')
    showCustomPlanModal.value = true
    return
  }
  showConfirmModal.value = true
}

const executeClean = () => {
  isCleaning.value = true
  ElMessage.success('正在清理中，请稍候...')
  setTimeout(() => {
    isCleaning.value = false
    showConfirmModal.value = false
    ElMessage.success('清理成功')
  }, 1000)
}

// ==== Custom Plan Modal ====
const showCustomPlanModal = ref(false)
const modalDataRange = ref('custom')
const modalTab = ref('all')
const modalSearch = ref('')
const selectedPlans = ref([])
const finalizedSelectedPlans = ref([])

const mockPlans = ref([
  { id: '10001', name: 'Buy 1 Get 2 Free Promo', status: '进行中', updateTime: '2025-08-08 18:26', productCount: 12, talentCount: 50 },
  { id: '10002', name: 'Summer Campaign 2025', status: '进行中', updateTime: '2025-08-09 10:00', productCount: 5, talentCount: 120 },
  { id: '10003', name: 'Clearance Sale Plan', status: '已到期', updateTime: '2025-07-20 09:30', productCount: 45, talentCount: 10 },
  { id: '10004', name: 'VIP Influencer Outreach', status: '进行中', updateTime: '2025-08-10 14:15', productCount: 3, talentCount: 5 },
  { id: '10005', name: 'Flash Sale August', status: '已到期', updateTime: '2025-08-01 22:00', productCount: 1, talentCount: 200 }
])

const filteredPlans = computed(() => {
  let result = mockPlans.value
  
  if (modalTab.value === 'ongoing') {
    result = result.filter(p => p.status === '进行中')
  } else if (modalTab.value === 'expired') {
    result = result.filter(p => p.status === '已到期')
  }

  if (modalSearch.value) {
    const q = modalSearch.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.id.includes(q))
  }

  return result
})

const handleSelectionChange = (val) => {
  selectedPlans.value = val
}

const handleCancelCustomPlan = () => {
  // Revert back to previous range if they cancel without picking anything?
  // PRD doesn't specify, but let's just close
  if (finalizedSelectedPlans.value.length === 0) {
    dataRange.value = 'ongoing'
  }
  showCustomPlanModal.value = false
}

const confirmCustomPlan = () => {
  finalizedSelectedPlans.value = [...selectedPlans.value]
  showCustomPlanModal.value = false
}

</script>

<style lang="scss" scoped>
.invitation-management-page {
  background: #F5F6F7;
  min-height: calc(100vh - 48px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 店铺选择区 */
.shop-selector-header {
  background: #FFFFFF;
  padding: 16px 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  
  .shop-label {
    font-size: 14px;
    font-weight: 500;
    color: #262626;
    margin-right: 8px;
  }
}

/* 功能选项卡区 */
.function-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.function-card {
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .card-icon {
    color: #8C8C8C;
    flex-shrink: 0;
  }

  .card-content {
    .card-title {
      font-size: 15px;
      font-weight: 500;
      color: #262626;
      margin-bottom: 6px;
    }
    .card-desc {
      font-size: 13px;
      color: #8C8C8C;
      line-height: 1.5;
    }
  }

  &.active {
    border-color: #1677FF;
    background: #F0F5FF;
    
    .card-icon {
      color: #1677FF;
    }
    .card-title {
      color: #1677FF;
    }
    .card-desc {
      color: #1677FF;
      opacity: 0.8;
    }
  }
}

/* 功能配置区 */
.config-section {
  background: #FFFFFF;
  border-radius: 4px;
  padding: 24px;
  flex: 1;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #F0F0F0;
  }
}

.config-form {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  
  &.align-start {
    align-items: flex-start;
  }

  .form-label {
    width: 100px;
    font-size: 14px;
    color: #595959;
    flex-shrink: 0;
  }

  .data-range-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .time-prefix-text, .time-suffix-text {
    font-size: 14px;
    color: #262626;
  }
}

.submit-row {
  margin-top: 24px;
  padding-left: 100px;

  .btn-start-clean {
    width: 120px;
    height: 36px;
  }
}

/* 确认清理弹窗 */
.confirm-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .preview-item {
    font-size: 14px;
    .preview-label {
      color: #595959;
    }
    .preview-value {
      color: #262626;
    }
  }

  .preview-estimate {
    margin-top: 12px;
    padding: 12px;
    background: #F5F5F5;
    border-radius: 4px;
    font-size: 14px;
    color: #262626;

    .highlight {
      color: #FF4D4F;
      font-weight: 600;
      margin: 0 4px;
    }
  }

  .preview-warning {
    margin-top: 8px;
    color: #FF4D4F;
    font-size: 13px;
  }
}

/* 选择邀约计划弹窗 */
.custom-plan-dialog {
  .custom-plan-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;

    .header-row {
      display: flex;
      align-items: center;
      .header-label {
        font-size: 14px;
        color: #595959;
        margin-right: 12px;
      }
    }

    .header-filters {
      display: flex;
      justify-content: space-between;
      align-items: center;

      :deep(.el-tabs__header) {
        margin: 0;
      }
    }
  }

  .plan-name-cell {
    display: flex;
    flex-direction: column;
    
    .plan-name {
      font-size: 14px;
      color: #262626;
      font-weight: 500;
    }
    .plan-id {
      font-size: 12px;
      color: #8C8C8C;
    }
  }

  .status-text {
    font-size: 13px;
    &.text-ongoing {
      color: #1677FF;
    }
    &.text-expired {
      color: #8C8C8C;
    }
  }

  .empty-text {
    padding: 30px;
    color: #8C8C8C;
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
}
</style>

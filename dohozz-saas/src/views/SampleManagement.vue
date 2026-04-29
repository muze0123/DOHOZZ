<template>
  <div class="sample-management">
    <!-- ==================== 平台切换栏 ==================== -->
    <div class="platform-section">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key }"
          @click="handlePlatformChange(tab.key)"
        >
          <span>{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <!-- ==================== 高级筛选区 ==================== -->
    <SampleFilterSection
      ref="filterSectionRef"
      :filter-params="filterParams"
      :department-options="departmentOptions"
      :bd-options="bdOptions"
      :shop-options="shopOptions"
      :source-options="sourceOptions"
      :repeat-options="repeatOptions"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- ==================== 状态统计与快捷筛选区 ==================== -->
    <SampleStatsSection
      :active-status="activeStatus"
      :active-delivery-status="activeDeliveryStatus"
      :status-tabs="statusTabs"
      :delivery-tabs="deliveryTabs"
      :stats-data="statsData"
      @status-change="handleStatusChange"
      @delivery-status-change="handleDeliveryStatusChange"
      @stat-click="handleStatClick"
    />

    <!-- ==================== 样品列表区 ==================== -->
    <SampleListSection
      :samples="paginatedSamples"
      :loading="loading"
      @view-detail="handleViewDetail"
      @approve="handleApprove"
      @reject="handleReject"
      @ship="handleShip"
      @delete="handleDelete"
      @edit-note="handleEditNote"
      @edit-sample="handleEditSample"
    />

    <!-- ==================== 分页控制区 ==================== -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="filteredSamples.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- ==================== 弹窗组件 ==================== -->
    <ApproveDialog
      v-model="approveDialogVisible"
      :sample="currentSample"
      @success="handleApproveSuccess"
    />

    <RejectDialog
      v-model="rejectDialogVisible"
      :sample="currentSample"
      @success="handleRejectSuccess"
    />

    <ShipDialog
      v-model="shipDialogVisible"
      :sample="currentSample"
      :logistics-options="logisticsOptions"
      @success="handleShipSuccess"
    />

    <DetailDialog
      v-model="detailDialogVisible"
      :sample="currentSample"
    />

    <EditNoteDialog
      v-model="editNoteDialogVisible"
      :sample="currentSample"
      @success="handleEditNoteSuccess"
    />

    <EditSampleDialog
      v-model="editSampleDialogVisible"
      :sample="currentSample"
      :product-options="productOptions"
      :influencer-options="influencerOptions"
      @success="handleEditSampleSuccess"
    />

    <DeleteDialog
      v-model="deleteDialogVisible"
      :sample="currentSample"
      @success="handleDeleteSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SampleFilterSection from './components/SampleFilterSection.vue'
import SampleStatsSection from './components/SampleStatsSection.vue'
import SampleListSection from './components/SampleListSection.vue'
import ApproveDialog from './SampleManagement/dialogs/ApproveDialog.vue'
import RejectDialog from './SampleManagement/dialogs/RejectDialog.vue'
import ShipDialog from './SampleManagement/dialogs/ShipDialog.vue'
import DetailDialog from './SampleManagement/dialogs/DetailDialog.vue'
import EditNoteDialog from './SampleManagement/dialogs/EditNoteDialog.vue'
import EditSampleDialog from './SampleManagement/dialogs/EditSampleDialog.vue'
import DeleteDialog from './SampleManagement/dialogs/DeleteDialog.vue'

// ==================== 平台Tab ====================
const platformTabs = [
  { key: 'all', label: '全部' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('all')

// ==================== 筛选参数 ====================
const filterSectionRef = ref(null)

const filterParams = reactive({
  sampleId: '',
  productKeyword: '',
  influencerKeyword: '',
  departmentId: '',
  bdId: '',
  shopId: '',
  isRepeat: '',
  recipientKeyword: '',
  createTimeRange: [],
  logisticsNo: '',
  shipTimeRange: [],
  source: ''
})

const departmentOptions = ref([
  { id: 'dept1', name: '销售部' },
  { id: 'dept2', name: '市场部' },
  { id: 'dept3', name: '运营部' }
])

const bdOptions = ref([
  { id: 'bd1', name: '张三' },
  { id: 'bd2', name: '李四' },
  { id: 'bd3', name: '王五' }
])

const shopOptions = ref([
  { id: 'shop1', name: '官方旗舰店' },
  { id: 'shop2', name: '京东自营店' },
  { id: 'shop3', name: '天猫旗舰店' }
])

const sourceOptions = ref([
  { value: 'all', label: '全部' },
  { value: 'influencer_apply', label: '达人外部申样' },
  { value: 'staff_create', label: '员工手动创建' }
])

const repeatOptions = ref([
  { value: 'all', label: '全部' },
  { value: 'yes', label: '是' },
  { value: 'no', label: '否' }
])

// ==================== 状态统计 ====================
const activeStatus = ref('all')
const activeDeliveryStatus = ref('')

const statusTabs = ref([
  { key: 'all', label: '全部', count: 888 },
  { key: 'pending_approve', label: '待审批', count: 66 },
  { key: 'pending_ship', label: '待发货', count: 66 },
  { key: 'shipped', label: '已发货', count: 66 },
  { key: 'signed', label: '已签收', count: 66 },
  { key: 'rejected', label: '拒绝发货', count: 66 }
])

const deliveryTabs = computed(() => {
  if (activeStatus.value !== 'signed') return []
  return [
    { key: '', label: '全部', count: 66 },
    { key: 'pending_deliver', label: '待交付', count: 23 },
    { key: 'delivered', label: '已交付', count: 8 },
    { key: 'ordered', label: '已出单', count: 10 }
  ]
})

const statsData = ref({
  sampleCount: 888,
  productCount: 1234,
  influencerCount: 456,
  repeatProductCount: 89,
  sampleFee: 156000,
  repeatFee: 28000,
  deliveryRate: '85.5%',
  orderRate: '72.3%'
})

// ==================== 样品列表 ====================
const loading = ref(false)

const samples = ref([
  {
    id: 'SP20260420001',
    platform: 'tiktok',
    status: 'pending_approve',
    deliveryStatus: '',
    createTime: '2026-04-23 14:30:00',
    logisticsNo: '',
    note: '紧急样品，请尽快处理',
    isRepeat: false,
    product: {
      id: 'P001',
      name: '氨基酸洁面乳',
      image: '',
      platform: 'tiktok'
    },
    influencer: {
      id: 'I001',
      name: '@fashionqueen_k',
      avatar: '',
      level: 'LV5',
      followers: '10.2w',
      orders30d: 1234
    },
    recipient: {
      name: '张三',
      phone: '13800138000',
      address: '广东省广州市天河区珠江新城...'
    },
    bd: '李四',
    source: 'influencer_apply',
    creator: '王五',
    updateTime: '2026-04-23 14:30:00'
  },
  {
    id: 'SP20260420002',
    platform: 'tiktok',
    status: 'pending_ship',
    deliveryStatus: '',
    createTime: '2026-04-22 10:00:00',
    logisticsNo: '',
    note: '',
    isRepeat: true,
    product: {
      id: 'P002',
      name: '玻尿酸面膜',
      image: '',
      platform: 'tiktok'
    },
    influencer: {
      id: 'I002',
      name: '@techreview_mike',
      avatar: '',
      level: 'LV4',
      followers: '8.5w',
      orders30d: 856
    },
    recipient: {
      name: '李四',
      phone: '13900139000',
      address: '上海市浦东新区陆家嘴...'
    },
    bd: '王五',
    source: 'staff_create',
    creator: '张三',
    updateTime: '2026-04-23 09:00:00'
  },
  {
    id: 'SP20260420003',
    platform: 'instagram',
    status: 'shipped',
    deliveryStatus: '',
    createTime: '2026-04-21 16:00:00',
    logisticsNo: 'SF1234567890',
    logisticsCompany: '顺丰速运',
    shipTime: '2026-04-22 14:00:00',
    note: '',
    isRepeat: false,
    product: {
      id: 'P003',
      name: '维生素C精华液',
      image: '',
      platform: 'instagram'
    },
    influencer: {
      id: 'I003',
      name: '@beauty_sarah',
      avatar: '',
      level: 'LV5',
      followers: '15.6w',
      orders30d: 2100
    },
    recipient: {
      name: '王五',
      phone: '13700137000',
      address: '北京市朝阳区建国门外大街...'
    },
    bd: '张三',
    source: 'influencer_apply',
    creator: '李四',
    updateTime: '2026-04-22 14:00:00'
  },
  {
    id: 'SP20260420004',
    platform: 'shopee',
    status: 'signed',
    deliveryStatus: 'pending_deliver',
    createTime: '2026-04-20 11:00:00',
    logisticsNo: 'YT9876543210',
    logisticsCompany: '圆通速递',
    shipTime: '2026-04-21 09:00:00',
    note: '',
    isRepeat: false,
    product: {
      id: 'P004',
      name: '胶原蛋白粉',
      image: '',
      platform: 'shopee'
    },
    influencer: {
      id: 'I004',
      name: '@foodie_james',
      avatar: '',
      level: 'LV3',
      followers: '4.56w',
      orders30d: 1580
    },
    recipient: {
      name: '赵六',
      phone: '13600136000',
      address: '杭州市西湖区文三路...'
    },
    bd: '李四',
    source: 'staff_create',
    creator: '王五',
    updateTime: '2026-04-22 10:00:00'
  },
  {
    id: 'SP20260420005',
    platform: 'lazada',
    status: 'rejected',
    deliveryStatus: '',
    createTime: '2026-04-19 15:00:00',
    logisticsNo: '',
    note: '库存不足',
    isRepeat: true,
    product: {
      id: 'P005',
      name: '防晒霜SPF50+',
      image: '',
      platform: 'lazada'
    },
    influencer: {
      id: 'I005',
      name: '@sports_pro',
      avatar: '',
      level: 'LV4',
      followers: '7.8w',
      orders30d: 980
    },
    recipient: {
      name: '孙七',
      phone: '13500135000',
      address: '成都市高新区天府大道...'
    },
    bd: '张三',
    source: 'influencer_apply',
    creator: '赵六',
    rejectReason: '库存不足，无法按时发货',
    updateTime: '2026-04-20 10:00:00'
  }
])

const filteredSamples = computed(() => {
  let result = samples.value

  if (activePlatform.value !== 'all') {
    result = result.filter(s => s.platform === activePlatform.value)
  }

  if (activeStatus.value !== 'all') {
    result = result.filter(s => s.status === activeStatus.value)
    if (activeStatus.value === 'signed' && activeDeliveryStatus.value) {
      result = result.filter(s => s.deliveryStatus === activeDeliveryStatus.value)
    }
  }

  if (filterParams.sampleId) {
    result = result.filter(s => s.id.includes(filterParams.sampleId))
  }

  if (filterParams.productKeyword) {
    const kw = filterParams.productKeyword.toLowerCase()
    result = result.filter(s =>
      s.product.name.toLowerCase().includes(kw) ||
      s.product.id.toLowerCase().includes(kw)
    )
  }

  if (filterParams.influencerKeyword) {
    const kw = filterParams.influencerKeyword.toLowerCase()
    result = result.filter(s =>
      s.influencer.name.toLowerCase().includes(kw) ||
      s.influencer.id.toLowerCase().includes(kw)
    )
  }

  return result
})

const paginatedSamples = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredSamples.value.slice(start, end)
})

// ==================== 分页 ====================
const pagination = reactive({
  page: 1,
  pageSize: 10
})

// ==================== 弹窗状态 ====================
const approveDialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const shipDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const editNoteDialogVisible = ref(false)
const editSampleDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

const currentSample = ref(null)

// ==================== 下拉选项 ====================
const logisticsOptions = ref([
  { value: 'sf', label: '顺丰速运' },
  { value: 'yt', label: '圆通速递' },
  { value: 'zt', label: '中通快递' },
  { value: 'jd', label: '京东物流' },
  { value: 'ems', label: 'EMS' }
])

const productOptions = ref([
  { id: 'P001', name: '氨基酸洁面乳' },
  { id: 'P002', name: '玻尿酸面膜' },
  { id: 'P003', name: '维生素C精华液' },
  { id: 'P004', name: '胶原蛋白粉' },
  { id: 'P005', name: '防晒霜SPF50+' }
])

const influencerOptions = ref([
  { id: 'I001', name: '@fashionqueen_k' },
  { id: 'I002', name: '@techreview_mike' },
  { id: 'I003', name: '@beauty_sarah' },
  { id: 'I004', name: '@foodie_james' },
  { id: 'I005', name: '@sports_pro' }
])

// ==================== 方法 ====================

// 平台切换
function handlePlatformChange(platform) {
  activePlatform.value = platform
  pagination.page = 1
}

// 状态切换
function handleStatusChange(status) {
  activeStatus.value = status
  if (status !== 'signed') {
    activeDeliveryStatus.value = ''
  }
  pagination.page = 1
}

// 交付状态切换
function handleDeliveryStatusChange(status) {
  activeDeliveryStatus.value = status
  pagination.page = 1
}

// 统计指标点击
function handleStatClick(statKey) {
  console.log('stat click:', statKey)
}

// 查询
function handleQuery() {
  pagination.page = 1
  ElMessage.success('查询成功')
}

// 重置
function handleReset() {
  filterSectionRef.value?.reset()
  pagination.page = 1
  ElMessage.success('重置成功')
}

// 查看详情
function handleViewDetail(sample) {
  currentSample.value = sample
  detailDialogVisible.value = true
}

// 审批通过
function handleApprove(sample) {
  currentSample.value = sample
  approveDialogVisible.value = true
}

function handleApproveSuccess() {
  const idx = samples.value.findIndex(s => s.id === currentSample.value.id)
  if (idx > -1) {
    samples.value[idx].status = 'pending_ship'
    samples.value[idx].updateTime = new Date().toLocaleString()
  }
  ElMessage.success('审批通过')
  approveDialogVisible.value = false
}

// 拒绝
function handleReject(sample) {
  currentSample.value = sample
  rejectDialogVisible.value = true
}

function handleRejectSuccess() {
  const idx = samples.value.findIndex(s => s.id === currentSample.value.id)
  if (idx > -1) {
    samples.value[idx].status = 'rejected'
    samples.value[idx].updateTime = new Date().toLocaleString()
  }
  ElMessage.success('已拒绝')
  rejectDialogVisible.value = false
}

// 发货
function handleShip(sample) {
  currentSample.value = sample
  shipDialogVisible.value = true
}

function handleShipSuccess() {
  const idx = samples.value.findIndex(s => s.id === currentSample.value.id)
  if (idx > -1) {
    samples.value[idx].status = 'shipped'
    samples.value[idx].updateTime = new Date().toLocaleString()
  }
  ElMessage.success('发货成功')
  shipDialogVisible.value = false
}

// 删除
function handleDelete(sample) {
  currentSample.value = sample
  deleteDialogVisible.value = true
}

function handleDeleteSuccess() {
  const idx = samples.value.findIndex(s => s.id === currentSample.value.id)
  if (idx > -1) {
    samples.value.splice(idx, 1)
  }
  ElMessage.success('删除成功')
  deleteDialogVisible.value = false
}

// 编辑备注
function handleEditNote(sample) {
  currentSample.value = sample
  editNoteDialogVisible.value = true
}

function handleEditNoteSuccess() {
  ElMessage.success('修改成功')
  editNoteDialogVisible.value = false
}

// 编辑样品
function handleEditSample(sample) {
  currentSample.value = sample
  editSampleDialogVisible.value = true
}

function handleEditSampleSuccess() {
  const idx = samples.value.findIndex(s => s.id === currentSample.value.id)
  if (idx > -1) {
    samples.value[idx].status = 'pending_approve'
    samples.value[idx].updateTime = new Date().toLocaleString()
  }
  ElMessage.success('编辑成功')
  editSampleDialogVisible.value = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.sample-management {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}

// ==================== 平台切换栏 ====================
.platform-section {
  @extend .platform-section;
  margin-bottom: 0;
}

.platform-tabs {
  @extend .platform-tabs;
}

.platform-tab {
  @extend .platform-tab;
}

// ==================== 分页区 ====================
.pagination-section {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

// ==================== Toast提示样式 ====================
:deep(.success-toast) {
  --el-message-bg-color: #00cc66;
}

:deep(.warning-toast) {
  --el-message-bg-color: #ff6600;
}
</style>

<template>
  <div class="order-management">
    <!-- 数据Tab区 -->
    <div class="platform-tabs">
      <div
        v-for="platform in platformOptions"
        :key="platform.value"
        class="platform-tab"
        :class="{ active: activePlatform === platform.value, disabled: !platform.enabled }"
        @click="handlePlatformChange(platform)"
      >
        <span class="platform-icon">{{ platform.icon }}</span>
        <span class="platform-name">{{ platform.label }}</span>
      </div>
    </div>

    <!-- 筛选条件区 -->
    <div class="filter-section">
      <div class="filter-header" @click="toggleFilter">
        <span class="filter-title">筛选条件</span>
        <span class="filter-toggle" :class="{ collapsed: !filterExpanded }"></span>
      </div>
      <div v-show="filterExpanded" class="filter-body">
        <!-- 第一行 -->
        <div class="filter-row">
          <div class="filter-item">
            <label>订单ID</label>
            <el-input v-model="filters.orderId" placeholder="请输入订单ID" clearable style="width: 160px" @keyup.enter="handleQuery" />
          </div>
          <div class="filter-item">
            <label>时间字段</label>
            <el-select v-model="filters.timeField" placeholder="请选择" style="width: 120px">
              <el-option v-for="field in timeFieldOptions" :key="field.value" :label="field.label" :value="field.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>时间范围</label>
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="handleDateChange"
            />
          </div>
        </div>
        <!-- 第二行 -->
        <div class="filter-row">
          <div class="filter-item">
            <label>订单状态</label>
            <el-select v-model="filters.orderStatus" placeholder="全部" multiple collapse-tags style="width: 150px">
              <el-option v-for="status in orderStatusOptions" :key="status.value" :label="status.label" :value="status.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>达人搜索</label>
            <el-input v-model="filters.influencerSearch" placeholder="请输入达人用户名/达人ID" clearable style="width: 180px" @keyup.enter="handleQuery" />
          </div>
          <div class="filter-item">
            <label>商品搜索</label>
            <el-input v-model="filters.productSearch" placeholder="请输入商品名称/商品ID" clearable style="width: 180px" @keyup.enter="handleQuery" />
          </div>
        </div>
        <!-- 第三行 -->
        <div class="filter-row">
          <div class="filter-item">
            <label>所属BD</label>
            <el-select v-model="filters.bdId" placeholder="全部" filterable clearable style="width: 150px">
              <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>所属部门</label>
            <el-tree-select
              v-model="filters.departmentId"
              :data="departmentOptions"
              :props="{ label: 'name', value: 'id', children: 'children' }"
              placeholder="全部"
              check-strictly
              filterable
              clearable
              style="width: 180px"
            />
          </div>
          <div class="filter-item">
            <label>来源店铺</label>
            <el-select v-model="filters.shopIds" placeholder="全部" multiple collapse-tags style="width: 180px">
              <el-option v-for="shop in shopOptions" :key="shop.id" :label="shop.name" :value="shop.id" />
            </el-select>
          </div>
        </div>
        <!-- 第四行 -->
        <div class="filter-row">
          <div class="filter-item">
            <label>带货方式</label>
            <el-select v-model="filters.promotionTypes" placeholder="全部" multiple collapse-tags style="width: 150px">
              <el-option v-for="type in promotionTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>是否认领</label>
            <el-select v-model="filters.claimStatus" placeholder="全部" style="width: 120px">
              <el-option v-for="status in claimStatusOptions" :key="status.value" :label="status.label" :value="status.value" />
            </el-select>
          </div>
          <div class="filter-item filter-actions">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="operation-section">
      <div class="operation-right">
        <el-button :disabled="true" title="功能开发中">批量导出</el-button>
        <el-button @click="handleModifyBD">修改所属BD</el-button>
      </div>
    </div>

    <!-- 数据列表区 -->
    <div class="list-section">
      <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%; min-width: 1200px"
        row-key="orderId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" fixed="left" />
        <el-table-column label="商品信息" min-width="254" fixed="left">
          <template #default="{ row }">
            <div class="product-cell">
              <el-image :src="row.productImage" class="product-image" fit="cover">
                <template #error>
                  <div class="image-placeholder"><el-icon><Goods /></el-icon></div>
                </template>
              </el-image>
              <div class="product-detail">
                <div class="product-name" :title="row.productName">
                  <span @click="handleShowProductDetail(row)">{{ row.productName }}</span>
                  <span class="link-btn" @click.stop="handleCopyProductLink(row)">链接</span>
                </div>
                <div class="product-id" :title="row.productId">
                  ID: {{ row.productId }}
                  <span class="copy-btn" @click.stop="handleCopyProductId(row)">复制</span>
                </div>
                <div class="product-shop">{{ row.shopName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单ID" min-width="123">
          <template #default="{ row }">
            <span class="order-id-link" @click="handleShowOrderDetail(row)">{{ row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交金额" min-width="69" sortable>
          <template #default="{ row }">
            <span>{{ row.dealAmount ? '￥' + row.dealAmount.toFixed(2) : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计佣金额" min-width="83" sortable>
          <template #default="{ row }">
            <div class="commission-cell">
              <span>{{ row.commissionAmount ? '￥' + row.commissionAmount.toFixed(2) : '-' }}</span>
              <el-tooltip content="计佣金额=用户实付金额-运费-税费+主播券+平台券+平台补贴，是计算佣金的基数" placement="top" :show-after="300">
                <span class="help-icon">?</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="57" sortable>
          <template #default="{ row }">
            <span class="status-tag" :class="row.orderStatus">{{ getOrderStatusText(row.orderStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="带货达人" min-width="143">
          <template #default="{ row }">
            <div class="influencer-cell">
              <el-image :src="row.influencerAvatar" class="influencer-avatar" fit="cover">
                <template #error>
                  <div class="image-placeholder small"><el-icon><User /></el-icon></div>
                </template>
              </el-image>
              <div class="influencer-info">
                <div class="influencer-name" :title="row.influencerName">{{ row.influencerName }}</div>
                <div class="influencer-rate">佣金率: {{ row.commissionRate }}%</div>
                <div class="influencer-est">预估佣金: ￥{{ row.estimatedCommission.toFixed(2) }}</div>
                <div class="influencer-set">结算佣金: ￥{{ row.settlementCommission.toFixed(2) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="带货方式" min-width="57" sortable>
          <template #default="{ row }">
            <span>{{ getPromotionTypeText(row.promotionType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属BD" min-width="80" sortable>
          <template #default="{ row }">
            <el-tooltip :content="row.bdName" placement="top" :show-after="300">
              <span class="bd-name">{{ row.bdName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="订单时间" min-width="145" sortable :sort-orders="['ascending', 'descending']">
          <template #default="{ row }">
            <span class="order-time">{{ row.orderTime }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-section">
        <Pagination
          v-model="pagination"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
        />
      </div>
    </div>

    <!-- 修改所属BD弹窗 -->
    <el-dialog v-model="modifyBDDialogVisible" title="修改所属BD" width="440px" @close="handleModifyBDClose">
      <div class="modify-bd-form">
        <div class="form-item">
          <label><span class="required">*</span>所属BD：</label>
          <el-select v-model="modifyBDForm.bdId" placeholder="请选择BD" filterable style="width: 100%">
            <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
          </el-select>
          <span v-if="modifyBDError" class="error-tip">{{ modifyBDError }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleModifyBDClose">取消</el-button>
        <el-button type="primary" @click="handleModifyBDConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 订单详情抽屉 -->
    <el-drawer v-model="orderDetailVisible" title="订单详情" size="600px" direction="rtl">
      <div v-if="currentOrder" class="order-detail-content">
        <div class="detail-section">
          <h4 class="section-title">基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">订单ID</span>
              <span class="detail-value">{{ currentOrder.orderId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单状态</span>
              <span class="status-tag" :class="currentOrder.orderStatus">{{ getOrderStatusText(currentOrder.orderStatus) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单时间</span>
              <span class="detail-value">{{ currentOrder.orderTime }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4 class="section-title">商品信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">商品名称</span>
              <span class="detail-value">{{ currentOrder.productName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商品ID</span>
              <span class="detail-value">{{ currentOrder.productId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">来源店铺</span>
              <span class="detail-value">{{ currentOrder.shopName }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4 class="section-title">金额信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">成交金额</span>
              <span class="detail-value">￥{{ currentOrder.dealAmount.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">计佣金额</span>
              <span class="detail-value">￥{{ currentOrder.commissionAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4 class="section-title">达人信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">达人名称</span>
              <span class="detail-value">{{ currentOrder.influencerName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">达人ID</span>
              <span class="detail-value">{{ currentOrder.influencerId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">带货方式</span>
              <span class="detail-value">{{ getPromotionTypeText(currentOrder.promotionType) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">佣金率</span>
              <span class="detail-value">{{ currentOrder.commissionRate }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">预估佣金</span>
              <span class="detail-value">￥{{ currentOrder.estimatedCommission.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">结算佣金</span>
              <span class="detail-value">￥{{ currentOrder.settlementCommission.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4 class="section-title">归属信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">所属BD</span>
              <span class="detail-value">{{ currentOrder.bdName }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 商品详情抽屉 -->
    <el-drawer v-model="productDetailVisible" title="商品详情" size="600px" direction="rtl">
      <div v-if="currentProduct" class="product-detail-content">
        <div class="detail-section">
          <h4 class="section-title">商品信息</h4>
          <div class="detail-grid">
            <div class="detail-item full">
              <span class="detail-label">商品名称</span>
              <span class="detail-value">{{ currentProduct.productName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商品ID</span>
              <span class="detail-value">{{ currentProduct.productId }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">来源店铺</span>
              <span class="detail-value">{{ currentProduct.shopName }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4 class="section-title">价格信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">商品价格</span>
              <span class="detail-value">￥{{ currentProduct.price.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商品类目</span>
              <span class="detail-value">{{ currentProduct.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Goods, User } from '@element-plus/icons-vue'
import Pagination from '@/components/Pagination.vue'

// 平台选项
const platformOptions = [
  { value: 'tiktok', label: 'TikTok', icon: '🎵', enabled: true },
  { value: 'instagram', label: 'Instagram', icon: '📷', enabled: false },
  { value: 'shopee', label: 'Shopee', icon: '🛒', enabled: false },
  { value: 'lazada', label: 'Lazada', icon: '🌐', enabled: false }
]
const activePlatform = ref('tiktok')

// 时间字段选项
const timeFieldOptions = [
  { value: 'create', label: '下单时间' },
  { value: 'pay', label: '支付时间' },
  { value: 'deliver', label: '发货时间' },
  { value: 'receive', label: '收货时间' },
  { value: 'settle', label: '结算时间' }
]

// 订单状态选项
const orderStatusOptions = [
  { value: 'pending', label: '待发货' },
  { value: 'delivered', label: '已发货' },
  { value: 'completed', label: '交易成功' },
  { value: 'closed', label: '交易关闭' }
]

// 带货方式选项
const promotionTypeOptions = [
  { value: 'video', label: '视频' },
  { value: 'live', label: '直播' },
  { value: 'showcase', label: '橱窗' },
  { value: 'other', label: '其他' }
]

// 是否认领选项
const claimStatusOptions = [
  { value: '', label: '全部' },
  { value: 'claimed', label: '已认领' },
  { value: 'unclaimed', label: '未认领' }
]

// BD选项
const bdOptions = [
  { id: 'bd001', name: '张三' },
  { id: 'bd002', name: '李四' },
  { id: 'bd003', name: '王五' },
  { id: 'bd004', name: '赵六' }
]

// 部门选项
const departmentOptions = [
  { id: 'dept1', name: '销售部', children: [
    { id: 'dept1-1', name: '销售一组' },
    { id: 'dept1-2', name: '销售二组' }
  ]},
  { id: 'dept2', name: '市场部', children: [
    { id: 'dept2-1', name: '市场一组' }
  ]}
]

// 店铺选项
const shopOptions = [
  { id: 'shop001', name: '美妆个护旗舰店' },
  { id: 'shop002', name: '服饰专营店' },
  { id: 'shop003', name: '数码电子专营' },
  { id: 'shop004', name: '母婴用品商城' }
]

// 筛选条件
const filters = reactive({
  orderId: '',
  timeField: 'create',
  dateRange: null,
  orderStatus: [],
  influencerSearch: '',
  productSearch: '',
  bdId: null,
  departmentId: null,
  shopIds: [],
  promotionTypes: [],
  claimStatus: ''
})

// 筛选条件展开/收起
const filterExpanded = ref(true)
function toggleFilter() {
  filterExpanded.value = !filterExpanded.value
}

// 日期选择处理
function handleDateChange(val) {
  if (val && val.length === 2) {
    const [start, end] = val
    if (start > end) {
      ElMessage.warning('开始日期不能晚于结束日期')
      filters.dateRange = null
    }
  }
}

// 平台切换
function handlePlatformChange(platform) {
  if (!platform.enabled) return
  activePlatform.value = platform.value
}

// Mock数据
const mockTableData = [
  {
    orderId: '7300907713123456',
    productId: '7123456789012345',
    productName: '美妆个护旗舰店-新款口红-限量版',
    productImage: '',
    shopName: '美妆个护旗舰店',
    dealAmount: 100.00,
    commissionAmount: 95.00,
    orderStatus: 'completed',
    influencerId: 'inf001',
    influencerName: '达人小美',
    influencerAvatar: '',
    commissionRate: 10,
    estimatedCommission: 9.50,
    settlementCommission: 9.00,
    promotionType: 'video',
    bdId: 'bd001',
    bdName: '张三',
    orderTime: '2025-10-01 10:00:00',
    claimStatus: 'claimed'
  },
  {
    orderId: '7300907713123457',
    productId: '7123456789012346',
    productName: '服饰专营店-秋季新款外套',
    productImage: '',
    shopName: '服饰专营店',
    dealAmount: 299.00,
    commissionAmount: 280.00,
    orderStatus: 'delivered',
    influencerId: 'inf002',
    influencerName: '时尚达人小王',
    influencerAvatar: '',
    commissionRate: 8,
    estimatedCommission: 22.40,
    settlementCommission: 0,
    promotionType: 'live',
    bdId: 'bd002',
    bdName: '李四',
    orderTime: '2025-10-02 14:30:00',
    claimStatus: 'claimed'
  },
  {
    orderId: '7300907713123458',
    productId: '7123456789012347',
    productName: '数码电子专营-蓝牙耳机Pro',
    productImage: '',
    shopName: '数码电子专营',
    dealAmount: 199.00,
    commissionAmount: 180.00,
    orderStatus: 'pending',
    influencerId: 'inf003',
    influencerName: '科技小达人',
    influencerAvatar: '',
    commissionRate: 12,
    estimatedCommission: 21.60,
    settlementCommission: 0,
    promotionType: 'showcase',
    bdId: 'bd001',
    bdName: '张三',
    orderTime: '2025-10-03 09:15:00',
    claimStatus: 'unclaimed'
  },
  {
    orderId: '7300907713123459',
    productId: '7123456789012348',
    productName: '母婴用品商城-婴儿纸尿裤M码',
    productImage: '',
    shopName: '母婴用品商城',
    dealAmount: 150.00,
    commissionAmount: 140.00,
    orderStatus: 'closed',
    influencerId: 'inf004',
    influencerName: '妈咪达人',
    influencerAvatar: '',
    commissionRate: 5,
    estimatedCommission: 7.00,
    settlementCommission: 0,
    promotionType: 'video',
    bdId: 'bd003',
    bdName: '王五',
    orderTime: '2025-10-04 16:45:00',
    claimStatus: 'claimed'
  },
  {
    orderId: '7300907713123460',
    productId: '7123456789012349',
    productName: '美妆个护-护肤套装礼盒',
    productImage: '',
    shopName: '美妆个护旗舰店',
    dealAmount: 399.00,
    commissionAmount: 380.00,
    orderStatus: 'completed',
    influencerId: 'inf001',
    influencerName: '达人小美',
    influencerAvatar: '',
    commissionRate: 10,
    estimatedCommission: 38.00,
    settlementCommission: 36.00,
    promotionType: 'live',
    bdId: 'bd002',
    bdName: '李四',
    orderTime: '2025-10-05 11:20:00',
    claimStatus: 'claimed'
  }
]

const tableData = ref(mockTableData)
const tableRef = ref(null)
const selectedRows = ref([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: mockTableData.length
})

// 修改所属BD弹窗
const modifyBDDialogVisible = ref(false)
const modifyBDForm = reactive({ bdId: null })
const modifyBDError = ref('')

// 订单详情抽屉
const orderDetailVisible = ref(false)
const currentOrder = ref(null)

// 商品详情抽屉
const productDetailVisible = ref(false)
const currentProduct = ref(null)

// 方法
function handleQuery() {
  ElMessage.success('查询成功')
}

function handleReset() {
  filters.orderId = ''
  filters.timeField = 'create'
  filters.dateRange = null
  filters.orderStatus = []
  filters.influencerSearch = ''
  filters.productSearch = ''
  filters.bdId = null
  filters.departmentId = null
  filters.shopIds = []
  filters.promotionTypes = []
  filters.claimStatus = ''
  ElMessage.success('重置成功')
}

function handleSelectionChange(selection) {
  selectedRows.value = selection
}

function handleSizeChange(val) {
  pagination.pageSize = val
  pagination.page = 1
}

function handlePageChange(val) {
  pagination.page = val
}

function getOrderStatusText(status) {
  const map = { pending: '待发货', delivered: '已发货', completed: '交易成功', closed: '交易关闭' }
  return map[status] || status
}

function getPromotionTypeText(type) {
  const map = { video: '视频', live: '直播', showcase: '橱窗', other: '其他' }
  return map[type] || type
}

function handleModifyBD() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要修改所属BD的订单')
    return
  }
  modifyBDDialogVisible.value = true
  modifyBDError.value = ''
  modifyBDForm.bdId = null
}

function handleModifyBDClose() {
  modifyBDDialogVisible.value = false
  modifyBDError.value = ''
  modifyBDForm.bdId = null
}

function handleModifyBDConfirm() {
  if (!modifyBDForm.bdId) {
    modifyBDError.value = '请选择所属BD'
    return
  }
  // 实际应调用API修改
  const selectedBd = bdOptions.find(bd => bd.id === modifyBDForm.bdId)
  selectedRows.value.forEach(row => {
    row.bdId = modifyBDForm.bdId
    row.bdName = selectedBd.name
  })
  ElMessage.success('修改成功')
  handleModifyBDClose()
}

function handleShowOrderDetail(row) {
  currentOrder.value = row
  orderDetailVisible.value = true
}

function handleShowProductDetail(row) {
  currentProduct.value = row
  productDetailVisible.value = true
}

function handleCopyProductLink(row) {
  navigator.clipboard.writeText(`https://shop.com/product/${row.productId}`).then(() => {
    ElMessage.success('复制商品链接成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

function handleCopyProductId(row) {
  navigator.clipboard.writeText(row.productId).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_influencer-page.scss';

.order-management {
  padding: 16px 0 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.platform-tabs {
  background: #fff;
  padding: 0 16px;
  display: flex;
  gap: 40px;
  border-bottom: 1px solid #e8e8e8;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;

  &.active {
    color: #0064E0;
    border-bottom-color: #0064E0;
    font-weight: 600;
  }

  &.disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .platform-icon {
    font-size: 16px;
  }
}

.filter-section {
  background: #fff;
  margin-bottom: 1px;
}

.filter-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;

  .filter-title {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .filter-toggle {
    margin-left: 8px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #999;
    transition: transform 0.3s;

    &.collapsed {
      transform: rotate(-90deg);
    }
  }
}

.filter-body {
  padding: 0 16px 16px;
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 13px;
    color: #666;
    white-space: nowrap;
  }

  &.filter-actions {
    margin-left: auto;
  }
}

.required {
  color: #ff4d4f;
}

.error-tip {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.operation-section {
  background: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;

  .operation-right {
    display: flex;
    gap: 8px;
  }
}

.list-section {
  background: #fff;
  padding: 16px;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 10px;

  .product-image {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    flex-shrink: 0;
    background: #f5f5f5;
  }

  .product-detail {
    min-width: 0;
  }

  .product-name {
    font-size: 13px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    span:first-child {
      cursor: pointer;
      color: #1677ff;

      &:hover {
        text-decoration: underline;
      }
    }

    .link-btn {
      color: #1677ff;
      font-size: 12px;
      cursor: pointer;
      flex-shrink: 0;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .product-id {
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;

    .copy-btn {
      color: #1677ff;
      cursor: pointer;
      flex-shrink: 0;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .product-shop {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 20px;

  &.small {
    font-size: 14px;
  }
}

.order-id-link {
  color: #1677ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.commission-cell {
  display: flex;
  align-items: center;
  gap: 4px;

  .help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    background: #e6f0ff;
    color: #0064E0;
    border-radius: 50%;
    font-size: 10px;
    cursor: help;
  }
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  &.pending {
    background: #fff7e6;
    color: #fa8c16;
  }

  &.delivered {
    background: #e6f0ff;
    color: #1677ff;
  }

  &.completed {
    background: #f6ffed;
    color: #52c41a;
  }

  &.closed {
    background: #f5f5f5;
    color: #999;
  }
}

.influencer-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .influencer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
    background: #f5f5f5;
  }

  .influencer-info {
    min-width: 0;
  }

  .influencer-name {
    font-size: 13px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .influencer-rate,
  .influencer-est,
  .influencer-set {
    font-size: 12px;
    color: #999;
  }
}

.bd-name {
  font-size: 13px;
  color: #333;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.order-time {
  font-size: 12px;
  color: #666;
}

.pagination-section {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.modify-bd-form {
  .form-item {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    }
  }
}

// 抽屉样式
:deep(.el-drawer__header) {
  border-bottom: 1px solid #e8e8e8;
  padding: 16px;
  margin-bottom: 0;
}

:deep(.el-drawer__body) {
  padding: 0;
}

.order-detail-content,
.product-detail-content {
  padding: 16px;
}

.detail-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e8e8e8;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .detail-item {
    &.full {
      grid-column: 1 / -1;
    }

    .detail-label {
      font-size: 13px;
      color: #999;
      margin-bottom: 4px;
    }

    .detail-value {
      font-size: 14px;
      color: #333;
    }
  }
}
</style>
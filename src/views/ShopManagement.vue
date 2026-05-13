<template>
  <div class="shop-management">
    <!-- Tab区域 -->
    <div class="tab-section">
      <el-tabs v-model="activeTab" class="shop-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="店铺列表" name="shopList" />
        <el-tab-pane label="店铺分组" name="shopGroup" />
      </el-tabs>
    </div>

    <!-- 店铺列表内容 -->
    <div v-if="activeTab === 'shopList'" class="list-content">
      <!-- 筛选条件区 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label>店铺名称</label>
            <el-input v-model="filters.shopName" placeholder="请输入店铺名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
          </div>
          <div class="filter-item">
            <label>店铺来源</label>
            <el-select v-model="filters.source" placeholder="全部" filterable clearable style="width: 150px">
              <el-option v-for="source in sourceOptions" :key="source.value" :label="source.label" :value="source.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>店铺状态</label>
            <el-select v-model="filters.status" placeholder="全部" filterable clearable style="width: 150px">
              <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
            </el-select>
          </div>
          <div class="filter-actions">
            <el-button type="primary" @click="handleBindShop">+ 绑定店铺</el-button>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>

      <!-- 数据列表区 -->
      <div class="list-section">
        <el-table
          ref="tableRef"
          :data="tableData"
          style="width: 100%; min-width: 900px"
          row-key="id"
        >
          <el-table-column label="店铺信息" min-width="140" fixed="left">
            <template #default="{ row }">
              <div class="shop-info">
                <el-image :src="row.shopImage" class="shop-image" fit="cover">
                  <template #error>
                    <div class="image-placeholder"><el-icon><Shop /></el-icon></div>
                  </template>
                </el-image>
                <div class="shop-detail">
                  <div class="shop-name">{{ row.shopName }}</div>
                  <div class="shop-category">{{ row.shopCategory }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="店铺来源" min-width="100">
            <template #default="{ row }">
              <div class="source-cell">
                <span class="source-icon">{{ getSourceIcon(row.shopSource) }}</span>
                <span class="source-name">{{ row.shopSource }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="关联状态" min-width="80">
            <template #default="{ row }">
              <div class="status-cell">
                <span class="status-dot" :class="row.connectionStatus"></span>
                <span>{{ getStatusText(row.connectionStatus) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="域名" min-width="120">
            <template #default="{ row }">
              <el-tooltip :content="row.domain" placement="top" :show-after="300">
                <span class="domain-text">{{ row.domain }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="店铺类型" min-width="100">
            <template #default="{ row }">
              <el-tooltip :content="row.shopType" placement="top" :show-after="300">
                <span class="type-text">{{ row.shopType }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作人" min-width="80">
            <template #default="{ row }">
              <span>{{ row.operator }}</span>
            </template>
          </el-table-column>
          <el-table-column label="同步有效期" min-width="160" sortable :sort-orders="['ascending', 'descending']">
            <template #default="{ row }">
              <span>{{ row.syncExpiryTime || '- -' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联时间" min-width="160" sortable :sort-orders="['ascending', 'descending']">
            <template #default="{ row }">
              <span>{{ row.connectionTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <span class="action-link" @click="handleUnbind(row)">解绑</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 店铺分组内容 -->
    <div v-if="activeTab === 'shopGroup'" class="group-content">
      <!-- 页面标题和操作区 -->
      <div class="page-header">
        <div class="header-left">
          <h2 class="page-title">店铺分组</h2>
          <p class="page-desc">店铺分组后，不同组的员工可以跟进同一个达人，合作不同店铺的商品</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="handleCreateGroup">创建店铺分组 ></el-button>
        </div>
      </div>

      <!-- 业务流程说明区 -->
      <div class="process-section">
        <div class="process-cards">
          <div class="process-card">
            <div class="card-title">店铺分组前</div>
            <div class="card-desc">BD可以跟进任意店铺的商品，一名达人仅可被一名BD跟进</div>
          </div>
          <div class="process-card">
            <div class="card-title">店铺分组后</div>
            <div class="card-desc">BD可跟进所在分组内的店铺，a组BD与达人合作后，b组BD可与达人合作其他店铺商品，仅统计BD和达人合作店铺商品的业绩</div>
          </div>
        </div>

        <!-- 业务流程对比图 - Canvas实现 -->
        <div class="flow-charts">
          <div class="flow-chart-wrapper">
            <div class="flow-chart-title">店铺分组前</div>
            <canvas ref="beforeCanvas" class="flow-canvas"></canvas>
          </div>
          <div class="flow-chart-wrapper">
            <div class="flow-chart-title">店铺分组后</div>
            <canvas ref="afterCanvas" class="flow-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- 解绑确认弹窗 -->
    <el-dialog v-model="unbindDialogVisible" title="确认解绑该店铺吗？" width="440px" @close="handleUnbindClose">
      <div class="unbind-tip">
        <p>解绑后，该店铺的商品数据将不再同步，</p>
        <p>已有的商品数据将被保留，但不会更新。</p>
      </div>
      <template #footer>
        <el-button @click="handleUnbindClose">取消</el-button>
        <el-button type="primary" @click="handleUnbindConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 授权成功弹窗 -->
    <el-dialog v-model="authSuccessDialogVisible" title="感谢您对DOHOZZ的信任，您已成功授权TikTok店铺！" width="560px" @close="handleAuthSuccessClose">
      <div class="auth-success-content">
        <div class="auth-notice">
          <p>商品将自动同步到商品链接库，商品首次同步需要些许时间（3小时以内，与订单数量成正比），若长时间没有同步请联系客服。</p>
        </div>
        <div class="auth-suggest">
          <p>DOHOZZ建议您将以下授权信息同步给企业内部员工，避免员工因商品数据未完成同步而产生疑义</p>
        </div>
        <div class="auth-template">
          <p class="template-text">{{ authTemplate }}</p>
          <el-button class="copy-btn" @click="handleCopyAuth">
            <el-icon><CopyDocument /></el-icon>
            复制
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleContinueBind">继续绑定</el-button>
        <el-button type="primary" @click="handleCompleteBind">完成绑定</el-button>
      </template>
    </el-dialog>

    <!-- 功能开发中提示 -->
    <el-dialog v-model="developingDialogVisible" title="提示" width="400px">
      <div class="developing-tip">
        <el-icon class="info-icon"><InfoFilled /></el-icon>
        <span>绑定店铺功能开发中</span>
      </div>
      <template #footer>
        <el-button type="primary" @click="developingDialogVisible = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import FilterActions from '@/components/FilterActions.vue'
import { Shop, CopyDocument, InfoFilled } from '@element-plus/icons-vue'

// 筛选条件
const filters = reactive({
  shopName: '',
  source: null,
  status: null
})

const sourceOptions = [
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Shopee', label: 'Shopee' }
]

const statusOptions = [
  { value: 'normal', label: '正常' },
  { value: 'abnormal', label: '异常' }
]

// Mock数据
const mockTableData = [
  { id: 1, shopName: '美妆个护旗舰店', shopImage: '', shopCategory: '美妆个护', shopSource: 'TikTok', connectionStatus: 'normal', domain: 'beauty-makeup-store.myshopify.com', shopType: '跨境平台', operator: '张三', syncExpiryTime: '2025-08-07 10:12:36', connectionTime: '2024-02-04 15:05:36' },
  { id: 2, shopName: '服饰专营店', shopImage: '', shopCategory: '服饰鞋包', shopSource: 'Shopee', connectionStatus: 'normal', domain: 'fashion-mall.shopee.com', shopType: '本土店', operator: '李四', syncExpiryTime: '', connectionTime: '2024-02-04 15:05:36' },
  { id: 3, shopName: '数码电子专营', shopImage: '', shopCategory: '数码电子', shopSource: 'Shopee', connectionStatus: 'abnormal', domain: 'digital-tech.shopee.com', shopType: '跨境店', operator: '王五', syncExpiryTime: '', connectionTime: '2024-02-04 15:05:36' },
  { id: 4, shopName: '母婴用品商城', shopImage: '', shopCategory: '母婴用品', shopSource: 'TikTok', connectionStatus: 'normal', domain: 'baby-mart.tiktok.com', shopType: '跨境平台', operator: '赵六', syncExpiryTime: '2026-06-15 08:30:00', connectionTime: '2025-01-10 09:20:00' },
  { id: 5, shopName: '家居生活馆', shopImage: '', shopCategory: '家居用品', shopSource: 'TikTok', connectionStatus: 'normal', domain: 'home-living-store.myshopify.com', shopType: '独立站', operator: '张三', syncExpiryTime: '2026-09-20 14:00:00', connectionTime: '2025-03-15 11:30:00' }
]

const tableData = ref(mockTableData)
const tableRef = ref(null)

// 弹窗状态
const unbindDialogVisible = ref(false)
const authSuccessDialogVisible = ref(false)
const developingDialogVisible = ref(false)
const currentUnbindShop = ref(null)
const activeTab = ref('shopList')
const beforeCanvas = ref(null)
const afterCanvas = ref(null)

// 授权信息模板
const authTemplate = computed(() => {
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  return `企业管理员于${dateStr} ${timeStr}完成了"美妆个护旗舰店"的TikTok店铺授权操作。店铺商品正在自动同步到商品管理（大约3小时完成，与订单数量成正比）感谢您对DOHOZZ的信任。`
})

// 方法
function handleQuery() {
  ElMessage.success('查询成功')
}

function handleReset() {
  filters.shopName = ''
  filters.source = null
  filters.status = null
  ElMessage.success('重置成功')
}

function handleBindShop() {
  developingDialogVisible.value = true
}

function handleUnbind(row) {
  currentUnbindShop.value = row
  unbindDialogVisible.value = true
}

function handleUnbindClose() {
  unbindDialogVisible.value = false
  currentUnbindShop.value = null
}

function handleUnbindConfirm() {
  ElMessage.success('解绑成功')
  handleUnbindClose()
}

function handleAuthSuccessClose() {
  authSuccessDialogVisible.value = false
}

function handleCopyAuth() {
  navigator.clipboard.writeText(authTemplate.value).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

function handleContinueBind() {
  authSuccessDialogVisible.value = false
  developingDialogVisible.value = true
}

function handleCompleteBind() {
  authSuccessDialogVisible.value = false
  ElMessage.success('绑定完成')
}

function getSourceIcon(source) {
  const icons = { TikTok: '🎵', Shopee: '🛒' }
  return icons[source] || '🏪'
}

function getStatusText(status) {
  return { normal: '正常', abnormal: '异常' }[status] || status
}

// Tab切换处理
function handleTabChange(tabName) {
  if (tabName === 'shopGroup') {
    nextTick(() => {
      drawBeforeFlowChart()
      drawAfterFlowChart()
    })
  }
}

// 创建店铺分组
function handleCreateGroup() {
  developingDialogVisible.value = true
}

// 绘制分组前流程图
function drawBeforeFlowChart() {
  const canvas = beforeCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 定义节点位置
  const shopPositions = [
    { x: width * 0.15, y: height * 0.2, label: '店铺1' },
    { x: width * 0.15, y: height * 0.45, label: '店铺2' },
    { x: width * 0.4, y: height * 0.2, label: '店铺3' },
    { x: width * 0.4, y: height * 0.45, label: '店铺4' }
  ]

  const bdPositions = [
    { x: width * 0.65, y: height * 0.25, label: 'BD1' },
    { x: width * 0.65, y: height * 0.55, label: 'BD2' }
  ]

  const influencerPos = { x: width * 0.88, y: height * 0.4, label: '达人a' }

  // 绘制店铺节点
  ctx.fillStyle = '#E6F0FF'
  ctx.strokeStyle = '#0064E0'
  ctx.lineWidth = 1
  shopPositions.forEach(pos => {
    roundRect(ctx, pos.x - 30, pos.y - 15, 60, 30, 6)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#333'
    ctx.font = '12px PingFang SC'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pos.label, pos.x, pos.y)
    ctx.fillStyle = '#E6F0FF'
  })

  // 绘制BD节点
  ctx.fillStyle = '#FFF7E6'
  ctx.strokeStyle = '#FF9500'
  bdPositions.forEach(pos => {
    roundRect(ctx, pos.x - 30, pos.y - 15, 60, 30, 6)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#333'
    ctx.font = '12px PingFang SC'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pos.label, pos.x, pos.y)
    ctx.fillStyle = '#FFF7E6'
  })

  // 绘制达人节点
  ctx.fillStyle = '#E6F7E6'
  ctx.strokeStyle = '#31A24C'
  ctx.beginPath()
  ctx.ellipse(influencerPos.x, influencerPos.y, 35, 20, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#333'
  ctx.font = '12px PingFang SC'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(influencerPos.label, influencerPos.x, influencerPos.y)

  // 绘制连接线
  ctx.strokeStyle = '#999'
  ctx.lineWidth = 1
  ctx.setLineDash([])

  // BD连接所有店铺
  bdPositions.forEach(bd => {
    shopPositions.forEach(shop => {
      ctx.beginPath()
      ctx.moveTo(bd.x - 30, bd.y)
      ctx.lineTo(shop.x + 30, shop.y)
      ctx.stroke()
    })
  })

  // 所有店铺连接达人
  shopPositions.forEach(shop => {
    ctx.beginPath()
    ctx.moveTo(shop.x + 30, shop.y)
    ctx.lineTo(influencerPos.x - 35, influencerPos.y)
    ctx.stroke()
  })
}

// 绘制分组后流程图
function drawAfterFlowChart() {
  const canvas = afterCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 分组1
  ctx.strokeStyle = '#0064E0'
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  roundRect(ctx, width * 0.05, height * 0.15, width * 0.42, height * 0.7, 8)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#0064E0'
  ctx.font = '13px PingFang SC'
  ctx.textAlign = 'left'
  ctx.fillText('店铺跟进一组', width * 0.08, height * 0.12)

  // 分组2
  ctx.strokeStyle = '#FF9500'
  roundRect(ctx, width * 0.53, height * 0.15, width * 0.42, height * 0.7, 8)
  ctx.stroke()

  ctx.fillStyle = '#FF9500'
  ctx.fillText('店铺跟进二组', width * 0.56, height * 0.12)

  // 分组1内的节点
  const group1Shops = [
    { x: width * 0.12, y: height * 0.25, label: '店铺1' },
    { x: width * 0.12, y: height * 0.5, label: '店铺2' }
  ]
  const group1BD = { x: width * 0.32, y: height * 0.38, label: 'BD1' }

  ctx.fillStyle = '#E6F0FF'
  ctx.strokeStyle = '#0064E0'
  ctx.lineWidth = 1
  group1Shops.forEach(pos => {
    roundRect(ctx, pos.x - 30, pos.y - 15, 60, 30, 6)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#333'
    ctx.font = '12px PingFang SC'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pos.label, pos.x, pos.y)
    ctx.fillStyle = '#E6F0FF'
  })

  ctx.fillStyle = '#FFF7E6'
  ctx.strokeStyle = '#FF9500'
  roundRect(ctx, group1BD.x - 30, group1BD.y - 15, 60, 30, 6)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#333'
  ctx.fillText(group1BD.label, group1BD.x, group1BD.y)

  // 分组2内的节点
  const group2Shops = [
    { x: width * 0.6, y: height * 0.25, label: '店铺3' },
    { x: width * 0.6, y: height * 0.5, label: '店铺4' }
  ]
  const group2BD = { x: width * 0.8, y: height * 0.38, label: 'BD2' }

  ctx.fillStyle = '#E6F0FF'
  ctx.strokeStyle = '#0064E0'
  group2Shops.forEach(pos => {
    roundRect(ctx, pos.x - 30, pos.y - 15, 60, 30, 6)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#333'
    ctx.font = '12px PingFang SC'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pos.label, pos.x, pos.y)
    ctx.fillStyle = '#E6F0FF'
  })

  ctx.fillStyle = '#FFF7E6'
  ctx.strokeStyle = '#FF9500'
  roundRect(ctx, group2BD.x - 30, group2BD.y - 15, 60, 30, 6)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#333'
  ctx.fillText(group2BD.label, group2BD.x, group2BD.y)

  // 达人节点
  const influencerPos = { x: width * 0.88, y: height * 0.4, label: '达人a' }
  ctx.fillStyle = '#E6F7E6'
  ctx.strokeStyle = '#31A24C'
  ctx.beginPath()
  ctx.ellipse(influencerPos.x, influencerPos.y, 35, 20, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#333'
  ctx.font = '12px PingFang SC'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(influencerPos.label, influencerPos.x, influencerPos.y)

  // 绘制连接线 - 分组1
  ctx.strokeStyle = '#999'
  ctx.lineWidth = 1
  ctx.setLineDash([])
  group1Shops.forEach(shop => {
    ctx.beginPath()
    ctx.moveTo(group1BD.x - 30, group1BD.y)
    ctx.lineTo(shop.x + 30, shop.y)
    ctx.stroke()
  })

  // 绘制连接线 - 分组2
  group2Shops.forEach(shop => {
    ctx.beginPath()
    ctx.moveTo(group2BD.x - 30, group2BD.y)
    ctx.lineTo(shop.x + 30, shop.y)
    ctx.stroke()
  })

  // 所有店铺连接达人
  const allShops = group1Shops.concat(group2Shops)
  allShops.forEach(shop => {
    ctx.beginPath()
    ctx.moveTo(shop.x + 30, shop.y)
    ctx.lineTo(influencerPos.x - 35, influencerPos.y)
    ctx.stroke()
  })
}

// 绘制圆角矩形辅助函数
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// 监听窗口变化，重新绘制
onMounted(() => {
  if (activeTab.value === 'shopGroup') {
    nextTick(() => {
      drawBeforeFlowChart()
      drawAfterFlowChart()
    })
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

.shop-management {
  padding: 16px 0 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 48px);
}

.tab-section {
  background: #fff;
  padding: 0 16px;

  :deep(.shop-tabs) {
    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__nav-wrap::after {
      display: none;
    }

    .el-tabs__item {
      font-size: 14px;
      color: #666;
      padding: 0 20px;
      height: 44px;
      line-height: 44px;

      &.is-active {
        color: #0064E0;
        font-weight: 600;
      }
    }

    .el-tabs__active-bar {
      background-color: #0064E0;
      height: 2px;
    }
  }
}

.list-content {
  .filter-section {
    background: #fff;
    padding: 16px;
    border-radius: 0 0 8px 8px;
    margin-bottom: 1px;
  }

  .list-section {
    background: #fff;
    padding: 16px;
    border-radius: 0 0 8px 8px;
  }
}

.group-content {
  background: #fff;
  min-height: calc(100vh - 120px);
  border-radius: 0 0 8px 8px;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  .header-left {
    .page-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px;
    }

    .page-desc {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}

.process-section {
  .process-cards {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  .process-card {
    flex: 1;
    background: #f5f6f7;
    border-radius: 8px;
    padding: 16px;

    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .card-desc {
      font-size: 13px;
      color: #666;
      line-height: 1.6;
    }
  }

  .flow-charts {
    display: flex;
    gap: 24px;
  }

  .flow-chart-wrapper {
    flex: 1;
    background: #fafafa;
    border-radius: 8px;
    padding: 16px;

    .flow-chart-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      text-align: center;
    }

    .flow-canvas {
      width: 100%;
      height: 200px;
    }
  }
}

.filter-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px 8px 0 0;
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
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
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.list-section {
  background: #fff;
  padding: 16px;
}

.shop-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .shop-image {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    flex-shrink: 0;
    background: #f5f5f5;
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 20px;
  }

  .shop-detail {
    min-width: 0;
  }

  .shop-name {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .shop-category {
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.source-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .source-icon {
    font-size: 16px;
  }

  .source-name {
    font-size: 13px;
    color: #333;
  }
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #333;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.normal { background: #52c41a; }
    &.abnormal { background: #ff4d4f; }
  }
}

.domain-text,
.type-text {
  font-size: 13px;
  color: #666;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.action-link {
  color: #1677ff;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
}

.unbind-tip {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  padding: 8px 0;
}

.auth-success-content {
  .auth-notice {
    background: #f0f5ff;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;

    p {
      font-size: 13px;
      color: #333;
      line-height: 1.6;
      margin: 0;
    }
  }

  .auth-suggest {
    background: #fff7e6;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;

    p {
      font-size: 12px;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }
  }

  .auth-template {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    position: relative;

    .template-text {
      font-size: 12px;
      color: #666;
      line-height: 1.8;
      margin: 0;
      padding-right: 60px;
    }

    .copy-btn {
      position: absolute;
      right: 12px;
      top: 12px;
    }
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
</style>

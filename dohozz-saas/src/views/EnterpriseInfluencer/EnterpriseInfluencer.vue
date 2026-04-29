<template>
  <div class="enterprise-influencer">
    <!-- 平台Tab -->
    <div class="platform-tabs">
      <div
        v-for="tab in platformTabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activePlatform === tab.key }"
        @click="handlePlatformChange(tab.key)"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 企业配额信息栏 -->
    <div class="quota-bar">
      <div class="quota-info" v-show="!isQuotaCollapsed">
        <span class="quota-label">企业配额：</span>
        <span class="quota-value">
          <span class="used">{{ quota.used }}</span>
          <span class="separator">/</span>
          <span class="total">{{ quota.total }}</span>
        </span>
        <span class="quota-unit">个</span>
      </div>
      <div class="quota-toggle" @click="isQuotaCollapsed = !isQuotaCollapsed">
        {{ isQuotaCollapsed ? '展开' : '收起' }}
        <span class="toggle-arrow" :class="{ collapsed: isQuotaCollapsed }"></span>
      </div>
    </div>

    <!-- 数据统计区 (Task 4) -->
    <EnterpriseInfluencerStatsSection :stats-data="statsData" />

    <!-- 筛选区域 (Task 3) -->
    <EnterpriseInfluencerFilterSection
      v-if="!loading"
      :filter-params="filters"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- 数据卡片/功能区 -->
    <div class="data-card">
      <div class="card-header">
        <div class="header-left">
          <span class="card-title">达人列表</span>
          <span class="data-date">数据更新日期：{{ updateDate }}</span>
        </div>
        <div class="header-right">
          <!-- 时间Tab -->
          <div class="time-tabs">
            <span
              v-for="tab in timeTabs"
              :key="tab.key"
              class="time-tab"
              :class="{ active: activeTimeTab === tab.key }"
              @click="handleTimeTabChange(tab.key)"
            >
              {{ tab.label }}
            </span>
          </div>

          <!-- 添加达人下拉按钮 -->
          <el-dropdown trigger="click" @command="handleAddInfluencer">
            <el-button type="primary">
              添加达人
              <span class="dropdown-arrow"></span>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="manual">手动添加</el-dropdown-item>
                <el-dropdown-item command="import">批量导入</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <div class="card-body">
        <!-- 搜索和批量操作 -->
        <div class="search-bar">
          <div class="search-inputs">
            <el-select v-model="searchType" class="search-type-select">
              <el-option label="达人昵称" value="nickname" />
              <el-option label="平台账号" value="account" />
            </el-select>
            <el-input
              v-model="searchKeyword"
              placeholder="请输入关键词搜索"
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">搜索</el-button>
              </template>
            </el-input>
            <el-input
              v-model="planKeyword"
              placeholder="输入计划名称搜索"
              class="plan-search-input"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">搜索</el-button>
              </template>
            </el-input>
          </div>
          <div class="batch-actions">
            <el-button @click="handleBatchExport">批量导出</el-button>
            <el-button @click="handleBatchDelete" :disabled="selectedIds.length === 0">
              批量删除{{ selectedIds.length > 0 ? `(${selectedIds.length})` : '' }}
            </el-button>
          </div>
        </div>

        <!-- 列表区域 (占位 - Task 5) -->
        <EnterpriseInfluencerListSection
          v-if="!loading"
          :list-data="influencerList"
          :total="total"
          :loading="listLoading"
          @selection-change="handleSelectionChange"
          @detail="handleDetail"
          @edit="handleEdit"
          @relate="handleRelate"
        />

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="!loading && total > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 导入达人弹窗 (占位 - Task 6) -->
    <ImportInfluencerDialog
      v-if="dialogs.import.visible"
      v-model="dialogs.import.visible"
      :platform="activePlatform"
      @success="handleImportSuccess"
    />

    <!-- 添加达人弹窗 -->
    <AddInfluencerDialog
      v-if="dialogs.add.visible"
      v-model="dialogs.add.visible"
      :platform="activePlatform"
      @success="handleDialogSuccess"
    />

    <!-- 编辑达人弹窗 -->
    <EditInfluencerDialog
      v-if="dialogs.edit.visible"
      v-model="dialogs.edit.visible"
      :platform="activePlatform"
      :influencer="currentInfluencer"
      @success="handleDialogSuccess"
    />

    <!-- 关联计划弹窗 (占位 - Task 6) -->
    <RelatePlanDialog
      v-if="dialogs.relatePlan.visible"
      v-model="dialogs.relatePlan.visible"
      :influencer="currentInfluencer"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api/enterpriseInfluencer'

// ==================== 组件引用 ====================
// Task 4: 数据统计区组件
import EnterpriseInfluencerStatsSection from './components/EnterpriseInfluencerStatsSection.vue'

// Task 3: 筛选区域组件
import EnterpriseInfluencerFilterSection from './components/EnterpriseInfluencerFilterSection.vue'

// Task 5: 列表区域组件
import EnterpriseInfluencerListSection from './components/EnterpriseInfluencerListSection.vue'

// Task 6: 弹窗组件
import AddInfluencerDialog from './dialogs/AddInfluencerDialog.vue'
import EditInfluencerDialog from './dialogs/EditInfluencerDialog.vue'
import RelatePlanDialog from './dialogs/RelatePlanDialog.vue'
// Placeholder for ImportInfluencerDialog (to be implemented later)
const ImportInfluencerDialog = { template: '<div></div>' }

// ==================== 状态管理 ====================

// 平台Tab
const platformTabs = [
  { key: 'douyin', label: '抖音' },
  { key: 'xiaohongshu', label: '小红书' }
]
const activePlatform = ref('douyin')

// 企业配额
const isQuotaCollapsed = ref(false)
const quota = reactive({ used: 815, total: 10000 })

// 数据统计 (Task 4)
const statsData = [
  { key: 'totalInfluencers', label: '达人总数', value: 815 },
  { key: 'cooperating', label: '合作中', value: 123 },
  { key: 'pending', label: '待合作', value: 692 },
  { key: 'newThisMonth', label: '本月新增', value: 45 }
]

// 时间Tab
const timeTabs = [
  { key: 'all', label: '全部' },
  { key: 'yesterday', label: '昨天' },
  { key: 'today', label: '今天' },
  { key: '7days', label: '近7天' },
  { key: '30days', label: '近30天' }
]
const activeTimeTab = ref('7days')

// 搜索
const searchType = ref('nickname')
const searchKeyword = ref('')
const planKeyword = ref('')

// 筛选条件
const filters = reactive({
  cooperation_status: 'all',
  filter_tags: '',
  contact_info: '',
  streamer_category: '',
  streamer_portrait: '',
  follower_portrait: '',
  follower_level: '',
  commerce_category: '',
  commerce_method: '',
  commerce_reputation: '',
  commerce_level: '',
  avg_live_sales: '',
  commerce_price: ''
})

// 列表数据
const influencerList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const listLoading = ref(false)
const selectedIds = ref([])
const currentInfluencer = ref(null)
const updateDate = ref('')

// 弹窗状态
const dialogs = reactive({
  import: { visible: false },
  add: { visible: false },
  edit: { visible: false },
  relatePlan: { visible: false }
})

// ==================== 生命周期 ====================
onMounted(() => {
  fetchData()
})

// ==================== 数据获取 ====================
const fetchData = async () => {
  loading.value = true
  try {
    const params = buildQueryParams()
    const res = await api.getInfluencerList(params)
    if (res.code === 0) {
      influencerList.value = res.data.list
      total.value = res.data.pagination.total
      updateDate.value = new Date().toLocaleDateString('zh-CN')
    }
  } catch (error) {
    ElMessage.error('获取达人列表失败')
  } finally {
    loading.value = false
  }
}

// 构建查询参数
const buildQueryParams = () => {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    platform: activePlatform.value,
    keyword: searchKeyword.value,
    ...filters
  }
  // 移除空值
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === 'all') {
      delete params[key]
    }
  })
  return params
}

// ==================== 事件处理 ====================

// 平台切换
const handlePlatformChange = (platform) => {
  activePlatform.value = platform
  currentPage.value = 1
  fetchData()
}

// 时间Tab切换
const handleTimeTabChange = (key) => {
  activeTimeTab.value = key
  currentPage.value = 1
  fetchData()
}

// 筛选条件变化
const handleFilterChange = (newFilters) => {
  Object.assign(filters, newFilters)
  currentPage.value = 1
  fetchData()
}

// 查询 (来自筛选组件)
const handleQuery = () => {
  currentPage.value = 1
  fetchData()
}

// 重置筛选条件 (来自筛选组件)
const handleReset = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  currentPage.value = 1
  fetchData()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 添加达人
const handleAddInfluencer = (command) => {
  if (command === 'manual') {
    currentInfluencer.value = null
    dialogs.add.visible = true
  } else if (command === 'import') {
    dialogs.import.visible = true
  }
}

// 批量导出
const handleBatchExport = () => {
  ElMessage.info('开始导出达人数据')
  api.exportInfluencers({ platform: activePlatform.value })
    .then(res => {
      if (res.code === 0) {
        ElMessage.success('导出成功')
      }
    })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的达人')
    return
  }
  ElMessage.confirm(`确定要删除选中的 ${selectedIds.value.length} 个达人吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.batchDeleteInfluencers(selectedIds.value).then(res => {
      if (res.code === 0) {
        ElMessage.success('删除成功')
        selectedIds.value = []
        fetchData()
      }
    })
  }).catch(() => {})
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.streamer_id)
}

// 查看详情
const handleDetail = (row) => {
  currentInfluencer.value = row
  dialogs.add.visible = true
}

// 编辑
const handleEdit = (row) => {
  currentInfluencer.value = row
  dialogs.edit.visible = true
}

// 关联计划
const handleRelate = (row) => {
  currentInfluencer.value = row
  dialogs.relatePlan.visible = true
}

// 删除
const handleDelete = (row) => {
  ElMessage.confirm(`确定要删除达人「${row.streamer_name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.deleteInfluencer(row.streamer_id).then(res => {
      if (res.code === 0) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
  }).catch(() => {})
}

// 分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

// 页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

// 弹窗成功回调
const handleDialogSuccess = () => {
  dialogs.add.visible = false
  dialogs.edit.visible = false
  dialogs.import.visible = false
  dialogs.relatePlan.visible = false
  fetchData()
}

// 导入成功
const handleImportSuccess = () => {
  dialogs.import.visible = false
  fetchData()
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_influencer-page.scss';

.enterprise-influencer {
  padding: 16px;
  min-height: 100%;
  background: #F5F6F7;
}

// 平台Tab
.platform-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;

  .tab-item {
    padding: 8px 24px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      color: #0064E0;
    }

    &.active {
      background: #0064E0;
      color: #fff;
      font-weight: 500;
    }
  }
}

// 企业配额信息栏
.quota-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;

  .quota-info {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;

    .quota-label {
      color: #666;
    }

    .quota-value {
      .used {
        color: #0064E0;
        font-weight: 600;
      }
      .separator {
        color: #999;
        margin: 0 2px;
      }
      .total {
        color: #333;
      }
    }

    .quota-unit {
      color: #999;
    }
  }

  .quota-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #0064E0;
    font-size: 13px;
    cursor: pointer;

    .toggle-arrow {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #0064E0;
      transition: transform 0.2s;

      &.collapsed {
        transform: rotate(180deg);
      }
    }
  }
}

// 数据卡片
.data-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .data-date {
        font-size: 13px;
        color: #999;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .time-tabs {
        display: flex;
        gap: 4px;
        background: #f5f6f7;
        padding: 4px;
        border-radius: 6px;

        .time-tab {
          padding: 6px 12px;
          font-size: 13px;
          color: #666;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;

          &:hover {
            color: #0064E0;
          }

          &.active {
            background: #fff;
            color: #0064E0;
            font-weight: 500;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
        }
      }

      .el-button {
        display: flex;
        align-items: center;
        gap: 4px;

        .dropdown-arrow {
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid currentColor;
          margin-left: 4px;
        }
      }
    }
  }

  .card-body {
    padding: 16px;

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .search-inputs {
        display: flex;
        gap: 12px;

        .search-type-select {
          width: 120px;
        }

        .search-input {
          width: 240px;
        }

        .plan-search-input {
          width: 200px;
        }
      }

      .batch-actions {
        display: flex;
        gap: 8px;
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
  }
}

// 占位样式
.placeholder-filter {
  height: 100px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.placeholder-list {
  height: 300px;
  background: #fafafa;
  border-radius: 8px;
}
</style>

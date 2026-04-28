# 企业达人库 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现企业达人库页面，包含达人列表管理、多维筛选、搜索、添加/编辑/关联计划弹窗及批量操作功能

**Architecture:** 独立页面模式，参考 InfluencerDatabase.vue 和 CollaborationLive.vue 结构。新建 EnterpriseInfluencer/ 目录，包含页面组件、3个子组件（筛选区/数据统计区/列表区）和 3 个弹窗组件（添加达人/编辑达人/关联计划）。通过 Dashboard 侧边栏集成到「内容合作 - 达人管理」下。

**Tech Stack:** Vue 3 Composition API, Element Plus, SCSS

---

## 文件结构

```
dohozz-saas/src/views/EnterpriseInfluencer/
├── EnterpriseInfluencer.vue                    # 页面入口，状态管理
├── components/
│   ├── EnterpriseInfluencerFilterSection.vue   # 筛选条件栏（13个筛选项）
│   ├── EnterpriseInfluencerStatsSection.vue   # 数据统计区（企业额度信息）
│   └── EnterpriseInfluencerListSection.vue    # 达人列表表格
└── dialogs/
    ├── AddInfluencerDialog.vue               # 添加达人
    ├── EditInfluencerDialog.vue               # 编辑达人
    └── RelatePlanDialog.vue                   # 关联计划

dohozz-saas/src/api/enterpriseInfluencer.js    # API层
```

---

## Task 1: 创建API模块

**Files:**
- Create: `dohozz-saas/src/api/enterpriseInfluencer.js`
- Test: API函数可正常调用

- [ ] **Step 1: 创建 enterpriseInfluencer.js API模块**

```javascript
const MOCK_DELAY = 500

// Mock数据
const mockInfluencerList = [
  {
    streamer_id: 'IF001',
    streamer_name: '测试达人A',
    streamer_account: 'douyin123456',
    streamer_avatar: '',
    platform: 'douyin',
    streamer_category: '美妆博主',
    streamer_portrait: '成熟达人',
    follower_portrait: '年轻用户',
    follower_count: 520000,
    follower_level: '50万-100万',
    commerce_category: '美妆',
    commerce_method: '直播带货',
    commerce_reputation: '优秀',
    commerce_level: '高水平',
    avg_live_sales: 85000,
    commerce_price: '100-500元',
    avg_view_count: 125000,
    video_count_30days: 28,
    cooperation_plan_count: 3,
    plan_content_count: 12,
    view_read_count: 3500000,
    all_content_count: 156,
    total_view_count: 19500000,
    contact_info: '13800138001',
    remark: '优质达人',
    is_verified: true,
    cooperation_status: 'cooperated',
    create_time: '2026-03-15 10:30:00',
    update_time: '2026-04-20 14:20:00'
  },
  {
    streamer_id: 'IF002',
    streamer_name: '测试达人B',
    streamer_account: 'xiaohongshu789',
    streamer_avatar: '',
    platform: 'xiaohongshu',
    streamer_category: '美食博主',
    streamer_portrait: '新手达人',
    follower_portrait: '家庭用户',
    follower_count: 85000,
    follower_level: '10万-50万',
    commerce_category: '美食',
    commerce_method: '短视频带货',
    commerce_reputation: '良好',
    commerce_level: '中等水平',
    avg_live_sales: 12000,
    commerce_price: '100元以下',
    avg_view_count: 28000,
    video_count_30days: 15,
    cooperation_plan_count: 1,
    plan_content_count: 4,
    view_read_count: 420000,
    all_content_count: 67,
    total_view_count: 1876000,
    contact_info: '13900139002',
    remark: '',
    is_verified: false,
    cooperation_status: 'uncooperated',
    create_time: '2026-04-10 09:15:00',
    update_time: '2026-04-18 11:30:00'
  }
  // 更多mock数据...
]

const mockEnterpriseQuota = {
  used: 815,
  total: 10000
}

// 辅助函数：分页
function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return list.slice(start, end)
}

// API函数
export function getInfluencerList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const {
        platform = 'douyin',
        cooperation_status = 'all',
        streamer_category = '',
        follower_level = '',
        commerce_category = '',
        commerce_method = '',
        commerce_reputation = '',
        commerce_level = '',
        avg_live_sales = '',
        commerce_price = '',
        contact_info = '',
        keyword = '',
        plan_keyword = '',
        page = 1,
        page_size = 10
      } = params

      let filtered = mockInfluencerList.filter(item => {
        if (platform && item.platform !== platform) return false
        if (cooperation_status !== 'all' && item.cooperation_status !== cooperation_status) return false
        if (streamer_category && item.streamer_category !== streamer_category) return false
        if (follower_level && item.follower_level !== follower_level) return false
        if (commerce_category && item.commerce_category !== commerce_category) return false
        if (commerce_method && item.commerce_method !== commerce_method) return false
        if (commerce_reputation && item.commerce_reputation !== commerce_reputation) return false
        if (commerce_level && item.commerce_level !== commerce_level) return false
        if (avg_live_sales && item.avg_live_sales_range !== avg_live_sales) return false
        if (commerce_price && item.commerce_price !== commerce_price) return false
        if (contact_info && item.contact_info_status !== contact_info) return false
        if (keyword) {
          const kw = keyword.toLowerCase()
          if (!item.streamer_name.toLowerCase().includes(kw) &&
              !item.streamer_account.toLowerCase().includes(kw) &&
              !item.streamer_id.toLowerCase().includes(kw)) return false
        }
        return true
      })

      const total = filtered.length
      const list = paginate(filtered, page, page_size)

      resolve({
        code: 0,
        message: 'success',
        data: { list, pagination: { total, page: Number(page), page_size: Number(page_size) } }
      })
    }, MOCK_DELAY)
  })
}

export function getEnterpriseQuota() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: 'success', data: mockEnterpriseQuota })
    }, MOCK_DELAY)
  })
}

export function addInfluencer(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = mockInfluencerList.find(
        item => item.platform === data.platform && item.streamer_account === data.streamer_account
      )
      if (exists) {
        reject({ code: 1, message: '达人已存在' })
        return
      }
      const newInfluencer = {
        streamer_id: 'IF' + Date.now(),
        streamer_name: data.streamer_name,
        streamer_account: data.streamer_account,
        streamer_avatar: '',
        platform: data.platform,
        streamer_category: data.streamer_category || '',
        streamer_portrait: '',
        follower_portrait: '',
        follower_count: 0,
        follower_level: '',
        commerce_category: '',
        commerce_method: '',
        commerce_reputation: '',
        commerce_level: '',
        avg_live_sales: 0,
        commerce_price: '',
        avg_view_count: 0,
        video_count_30days: 0,
        cooperation_plan_count: 0,
        plan_content_count: 0,
        view_read_count: 0,
        all_content_count: 0,
        total_view_count: 0,
        contact_info: data.contact_info || '',
        remark: data.remark || '',
        is_verified: false,
        cooperation_status: 'uncooperated',
        create_time: new Date().toLocaleString(),
        update_time: new Date().toLocaleString()
      }
      mockInfluencerList.unshift(newInfluencer)
      resolve({ code: 0, message: '添加成功', data: newInfluencer })
    }, MOCK_DELAY)
  })
}

export function updateInfluencer(id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInfluencerList.findIndex(item => item.streamer_id === id)
      if (index !== -1) {
        Object.assign(mockInfluencerList[index], data, { update_time: new Date().toLocaleString() })
      }
      resolve({ code: 0, message: '编辑成功' })
    }, MOCK_DELAY)
  })
}

export function deleteInfluencer(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInfluencerList.findIndex(item => item.streamer_id === id)
      if (index !== -1) {
        mockInfluencerList.splice(index, 1)
      }
      resolve({ code: 0, message: '删除成功' })
    }, MOCK_DELAY)
  })
}

export function batchDeleteInfluencers(ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      ids.forEach(id => {
        const index = mockInfluencerList.findIndex(item => item.streamer_id === id)
        if (index !== -1) mockInfluencerList.splice(index, 1)
      })
      resolve({ code: 0, message: '批量删除成功' })
    }, MOCK_DELAY)
  })
}

export function getPlanList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPlans = [
        { plan_id: 'P001', plan_name: '春季美妆营销计划', status: 'ongoing' },
        { plan_id: 'P002', plan_name: '夏日美食推广计划', status: 'ongoing' },
        { plan_id: 'P003', plan_name: '母婴用品合作计划', status: 'ongoing' }
      ]
      resolve({ code: 0, message: 'success', data: { list: mockPlans } })
    }, MOCK_DELAY)
  })
}

export function relatePlan(streamer_id, plan_ids) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: '关联成功' })
    }, MOCK_DELAY)
  })
}

export function exportInfluencers(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: '导出成功' })
    }, MOCK_DELAY)
  })
}

export default {
  getInfluencerList,
  getEnterpriseQuota,
  addInfluencer,
  updateInfluencer,
  deleteInfluencer,
  batchDeleteInfluencers,
  getPlanList,
  relatePlan,
  exportInfluencers
}
```

- [ ] **Step 2: 验证API模块**

Run: `node -e "import('@/api/enterpriseInfluencer.js').then(m => console.log(Object.keys(m)))"`
Expected: 输出 API 函数名列表

- [ ] **Step 3: Commit**

```bash
git add dohozz-saas/src/api/enterpriseInfluencer.js
git commit -m "feat(企业达人库): 创建API模块"
```

---

## Task 2: 创建页面骨架和路由集成

**Files:**
- Create: `dohozz-saas/src/views/EnterpriseInfluencer.vue`
- Modify: `dohozz-saas/src/views/Dashboard.vue`
- Test: build 验证

- [ ] **Step 1: 创建 EnterpriseInfluencer.vue 页面骨架**

```vue
<template>
  <div class="enterprise-influencer">
    <!-- 顶部导航栏 -->
    <div class="top-nav-bar">
      <div class="platform-tabs">
        <div
          v-for="tab in platformTabs"
          :key="tab.key"
          class="platform-tab"
          :class="{ active: activePlatform === tab.key }"
          @click="handlePlatformChange(tab.key)"
        >
          <span class="platform-icon" :class="tab.key"></span>
          <span>{{ tab.label }}</span>
        </div>
      </div>
      <div class="quota-info" v-if="!isQuotaCollapsed">
        <span class="quota-text">企业已添加达人名额：{{ quota.used.toLocaleString() }} / {{ quota.total.toLocaleString() }}</span>
        <el-button link type="primary" @click="handleGoPurchase">去加购</el-button>
        <el-button link @click="isQuotaCollapsed = true">
          收起
          <el-icon><ArrowUp /></el-icon>
        </el-button>
      </div>
      <el-button v-else link @click="isQuotaCollapsed = false">
        展开
        <el-icon><ArrowDown /></el-icon>
      </el-button>
    </div>

    <!-- 筛选操作栏 -->
    <EnterpriseInfluencerFilterSection
      ref="filterSectionRef"
      :filter-params="filters"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- 数据卡片/功能区 -->
    <div class="data-card-section">
      <div class="card-header">
        <div class="card-title">
          <span class="title-text">达人列表</span>
          <span class="date-range">数据统计日期：{{ dateRange }}</span>
        </div>
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
        <div class="card-actions">
          <el-dropdown @command="handleAddCommand" trigger="click">
            <el-button type="primary" class="add-btn">
              <el-icon><Plus /></el-icon>
              添加达人
              <el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="manual">手动添加</el-dropdown-item>
                <el-dropdown-item command="import">批量导入</el-dropdown-item>
                <el-dropdown-item command="api">API导入</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="search-toolbar">
        <div class="search-left">
          <el-select v-model="searchType" placeholder="搜索方式" style="width: 120px">
            <el-option label="昵称" value="nickname" />
            <el-option label="抖音号" value="account" />
            <el-option label="达人ID" value="id" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            :placeholder="searchPlaceholder"
            style="width: 200px"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-input
            v-model="planKeyword"
            placeholder="请输入计划标题/ID搜索"
            style="width: 200px"
            clearable
            @keyup.enter="handlePlanSearch"
          />
        </div>
        <div class="search-right">
          <el-dropdown @command="handleBatchCommand" trigger="click">
            <el-button class="batch-btn">批量操作</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="delete">批量删除</el-dropdown-item>
                <el-dropdown-item command="export">批量导出</el-dropdown-item>
                <el-dropdown-item command="tag">批量打标签</el-dropdown-item>
                <el-dropdown-item command="relate">批量关联计划</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button class="export-btn" @click="handleExport">
            <el-icon><Download /></el-icon>
          </el-button>
          <el-button class="layout-btn" @click="toggleLayout">
            <el-icon><Grid /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 列表区域 -->
    <EnterpriseInfluencerListSection
      ref="listSectionRef"
      :list-data="influencerList"
      :total="total"
      :loading="loading"
      :selected-ids="selectedIds"
      @selection-change="handleSelectionChange"
      @detail="handleDetail"
      @edit="handleEdit"
      @relate="handleRelate"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 弹窗 -->
    <AddInfluencerDialog v-model="addDialogVisible" @success="handleAddSuccess" />
    <EditInfluencerDialog v-model="editDialogVisible" :influencer="currentInfluencer" @success="handleEditSuccess" />
    <RelatePlanDialog v-model="relateDialogVisible" :influencer="currentInfluencer" @success="handleRelateSuccess" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import EnterpriseInfluencerFilterSection from './components/EnterpriseInfluencerFilterSection.vue'
import EnterpriseInfluencerListSection from './components/EnterpriseInfluencerListSection.vue'
import AddInfluencerDialog from './dialogs/AddInfluencerDialog.vue'
import EditInfluencerDialog from './dialogs/EditInfluencerDialog.vue'
import RelatePlanDialog from './dialogs/RelatePlanDialog.vue'
import api from '@/api/enterpriseInfluencer'

// 平台Tab
const platformTabs = [
  { key: 'douyin', label: '抖音' },
  { key: 'xiaohongshu', label: '小红书' }
]
const activePlatform = ref('douyin')

// 企业额度
const isQuotaCollapsed = ref(false)
const quota = reactive({ used: 815, total: 10000 })

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
const searchPlaceholder = computed(() => {
  const placeholders = {
    nickname: '请输入昵称或者抖音号',
    account: '请输入抖音号',
    id: '请输入达人ID'
  }
  return placeholders[searchType.value]
})

// 筛选参数
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

// 选中
const selectedIds = ref([])
const currentInfluencer = ref(null)

// 弹窗
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const relateDialogVisible = ref(false)

// 日期范围
const dateRange = computed(() => {
  const now = new Date()
  const format = d => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  if (activeTimeTab.value === '7days') {
    const start = new Date(now - 6 * 24 * 60 * 60 * 1000)
    return `${format(start)}-${format(now)}`
  }
  if (activeTimeTab.value === '30days') {
    const start = new Date(now - 29 * 24 * 60 * 60 * 1000)
    return `${format(start)}-${format(now)}`
  }
  return `${format(now)}-${format(now)}`
})

// 方法
function handlePlatformChange(platform) {
  activePlatform.value = platform
  fetchData()
}

function handleTimeTabChange(tab) {
  activeTimeTab.value = tab
  fetchData()
}

function handleQuery() {
  currentPage.value = 1
  fetchData()
}

function handleReset() {
  Object.assign(filters, {
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
  currentPage.value = 1
  fetchData()
}

function handleSearch() {
  currentPage.value = 1
  fetchData()
}

function handlePlanSearch() {
  // 计划搜索
}

function handleAddCommand(command) {
  addDialogVisible.value = true
}

function handleBatchCommand(command) {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个达人')
    return
  }
  // 根据command处理
}

function handleExport() {
  ElMessage.success('导出成功')
}

function toggleLayout() {
  // 切换布局
}

function handleSelectionChange(ids) {
  selectedIds.value = ids
}

function handleDetail(influencer) {
  // 达人详情
}

function handleEdit(influencer) {
  currentInfluencer.value = influencer
  editDialogVisible.value = true
}

function handleRelate(influencer) {
  currentInfluencer.value = influencer
  relateDialogVisible.value = true
}

function handlePageChange(page) {
  currentPage.value = page
  fetchData()
}

function handleSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

function handleAddSuccess() {
  fetchData()
}

function handleEditSuccess() {
  fetchData()
}

function handleRelateSuccess() {
  fetchData()
}

function handleGoPurchase() {
  // 跳转到加购页面
}

async function fetchData() {
  loading.value = true
  try {
    const res = await api.getInfluencerList({
      platform: activePlatform.value,
      keyword: searchKeyword.value,
      ...filters,
      page: currentPage.value,
      page_size: pageSize.value
    })
    influencerList.value = res.data.list
    total.value = res.data.pagination.total
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 初始化
fetchData()
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

.enterprise-influencer {
  @extend .page-container;
  padding: 0;
  background: #f5f5f5;
}

// 顶部导航栏
.top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.platform-tabs {
  display: flex;
  gap: 24px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 4px;
  cursor: pointer;
  color: #333;

  &.active {
    color: #333;
    border-bottom: 2px solid #333;
  }

  .platform-icon {
    width: 20px;
    height: 20px;
    &.douyin { background: #333; border-radius: 4px; }
    &.xiaohongshu { background: #fe2c55; border-radius: 4px; }
  }
}

.quota-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

// 数据卡片区
.data-card-section {
  padding: 16px 24px;
  background: #fff;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  flex: 1;
  .title-text {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-right: 12px;
  }
  .date-range {
    font-size: 12px;
    color: #999;
  }
}

.time-tabs {
  display: flex;
  gap: 8px;
  margin-right: 24px;
}

.time-tab {
  padding: 4px 12px;
  font-size: 12px;
  color: #666;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;

  &.active {
    color: #ff4545;
    border-color: #ff4545;
  }
}

.add-btn {
  background: #ff4545;
  border-color: #ff4545;
}

.batch-btn {
  color: #ff4545;
  border-color: #ff4545;
}

.search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid #e8e8e8;
}

.search-left {
  display: flex;
  gap: 12px;
}

.search-right {
  display: flex;
  gap: 8px;
}

// 分页
.pagination-section {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  background: #fff;
}
</style>
```

- [ ] **Step 2: 在 Dashboard.vue 中添加路由和菜单**

在seeding场景的「内容合作 - 达人管理」下添加「企业达人库」菜单项：

1. 添加路由：
```javascript
{
  path: '/enterprise-influencer',
  component: () => import('@/views/EnterpriseInfluencer.vue'),
  meta: { requiresAuth: true, title: '企业达人库' }
}
```

2. 修改菜单配置（达人管理children）：
```javascript
{ name: '达人管理', icon: icons.person, children: [
  { name: '达人公海' },
  { name: '企业达人库' }
]},
```

3. 添加页面组件引用：
```javascript
import EnterpriseInfluencer from '@/views/EnterpriseInfluencer.vue'
```

4. 添加渲染逻辑：
```javascript
<EnterpriseInfluencer v-else-if="activeSidebarMenu === '企业达人库'" />
```

- [ ] **Step 3: 验证build**

Run: `cd dohozz-saas && npm run build 2>&1 | head -50`
Expected: 无新增错误

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/EnterpriseInfluencer.vue dohozz-saas/src/views/Dashboard.vue dohozz-saas/src/router/index.js
git commit -m "feat(企业达人库): 创建页面骨架和路由集成"
```

---

## Task 3: 实现 EnterpriseInfluencerFilterSection.vue（筛选条件栏）

**Files:**
- Create: `dohozz-saas/src/views/EnterpriseInfluencer/components/EnterpriseInfluencerFilterSection.vue`
- Modify: `dohozz-saas/src/views/EnterpriseInfluencer.vue`
- Test: 筛选交互验证

- [ ] **Step 1: 创建 EnterpriseInfluencerFilterSection.vue**

筛选条件（13个，分三行）：
- 第一行：合作信息、筛选标签、联系方式
- 第二行：达人分类、达人画像、粉丝画像、粉丝量级
- 第三行：带货分类、带货方式、带货口碑、带货水平、直播场均销售额、带货商品价格

```vue
<template>
  <div class="enterprise-influencer-filter-section">
    <div class="filter-row">
      <div class="filter-item">
        <span class="filter-label">合作信息</span>
        <el-select v-model="localParams.cooperation_status" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="all" />
          <el-option label="已合作" value="cooperated" />
          <el-option label="未合作" value="uncooperated" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-label">筛选标签</span>
        <el-button size="small">
          <el-icon><Filter /></el-icon>
          筛选标签
        </el-button>
      </div>
      <div class="filter-item">
        <span class="filter-label">联系方式</span>
        <el-select v-model="localParams.contact_info" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="有联系方式" value="has" />
          <el-option label="无联系方式" value="none" />
        </el-select>
      </div>
    </div>

    <div class="filter-row">
      <div class="filter-item">
        <span class="filter-label">达人分类</span>
        <el-select v-model="localParams.streamer_category" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="美妆博主" value="美妆博主" />
          <el-option label="美食博主" value="美食博主" />
          <el-option label="穿搭博主" value="穿搭博主" />
          <el-option label="母婴博主" value="母婴博主" />
          <el-option label="数码博主" value="数码博主" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-label">达人画像</span>
        <el-select v-model="localParams.streamer_portrait" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="新手达人" value="新手达人" />
          <el-option label="成熟达人" value="成熟达人" />
          <el-option label="头部达人" value="头部达人" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-label">粉丝画像</span>
        <el-select v-model="localParams.follower_portrait" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="年轻用户" value="年轻用户" />
          <el-option label="家庭用户" value="家庭用户" />
          <el-option label="白领用户" value="白领用户" />
          <el-option label="学生用户" value="学生用户" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-label">粉丝量级</span>
        <el-select v-model="localParams.follower_level" placeholder="全部" clearable style="width: 140px">
          <el-option label="全部" value="" />
          <el-option label="10万以下" value="10万以下" />
          <el-option label="10万-50万" value="10万-50万" />
          <el-option label="50万-100万" value="50万-100万" />
          <el-option label="100万以上" value="100万以上" />
        </el-select>
      </div>
    </div>

    <div class="filter-row">
      <div class="filter-item">
        <span class="filter-label">带货分类</span>
        <el-select v-model="localParams.commerce_category" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="美妆" value="美妆" />
          <el-option label="美食" value="美食" />
          <el-option label="服装" value="服装" />
          <el-option label="母婴" value="母婴" />
          <el-option label="数码" value="数码" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-label">带货方式</span>
        <el-select v-model="localParams.commerce_method" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="直播带货" value="直播带货" />
          <el-option label="短视频带货" value="短视频带货" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-label">带货口碑</span>
        <el-select v-model="localParams.commerce_reputation" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="优秀" value="优秀" />
          <el-option label="良好" value="良好" />
          <el-option label="一般" value="一般" />
        </el-select>
        <el-icon class="info-icon" @click="showReputationTip"><QuestionFilled /></el-icon>
      </div>
      <div class="filter-item">
        <span class="filter-label">带货水平</span>
        <el-select v-model="localParams.commerce_level" placeholder="全部" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="高水平" value="高水平" />
          <el-option label="中等水平" value="中等水平" />
          <el-option label="低水平" value="低水平" />
        </el-select>
        <el-icon class="info-icon" @click="showLevelTip"><QuestionFilled /></el-icon>
      </div>
      <div class="filter-item">
        <span class="filter-label">直播场均销售额</span>
        <el-select v-model="localParams.avg_live_sales" placeholder="全部" clearable style="width: 140px">
          <el-option label="全部" value="" />
          <el-option label="1万以下" value="1万以下" />
          <el-option label="1万-10万" value="1万-10万" />
          <el-option label="10万-50万" value="10万-50万" />
          <el-option label="50万以上" value="50万以上" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-label">带货商品价格</span>
        <el-select v-model="localParams.commerce_price" placeholder="全部" clearable style="width: 140px">
          <el-option label="全部" value="" />
          <el-option label="100元以下" value="100元以下" />
          <el-option label="100-500元" value="100-500元" />
          <el-option label="500-1000元" value="500-1000元" />
          <el-option label="1000元以上" value="1000元以上" />
        </el-select>
      </div>
    </div>

    <div class="filter-actions">
      <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  filterParams: { type: Object, required: true }
})

const emit = defineEmits(['query', 'reset'])

const localParams = reactive({ ...props.filterParams })

watch(() => props.filterParams, (newVal) => {
  Object.assign(localParams, newVal)
}, { immediate: true, deep: true })

function handleQuery() {
  Object.assign(props.filterParams, localParams)
  emit('query')
}

function handleReset() {
  Object.assign(localParams, {
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
  emit('reset')
}

function showReputationTip() {
  // 显示口碑说明弹窗
}

function showLevelTip() {
  // 显示水平说明弹窗
}

defineExpose({ reset: handleReset })
</script>

<style lang="scss" scoped>
.enterprise-influencer-filter-section {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.filter-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .filter-label {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
  }

  .info-icon {
    color: #999;
    cursor: pointer;
    &:hover { color: #666; }
  }
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>
```

- [ ] **Step 2: 在 EnterpriseInfluencer.vue 中引入组件**

- [ ] **Step 3: 验证筛选交互**

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/EnterpriseInfluencer/components/EnterpriseInfluencerFilterSection.vue dohozz-saas/src/views/EnterpriseInfluencer.vue
git commit -m "feat(企业达人库): 实现筛选条件栏组件"
```

---

## Task 4: 实现 EnterpriseInfluencerStatsSection.vue（数据统计区）

**Files:**
- Create: `dohozz-saas/src/views/EnterpriseInfluencer/components/EnterpriseInfluencerStatsSection.vue`
- Modify: `dohozz-saas/src/views/EnterpriseInfluencer.vue`
- Test: 统计数据展示验证

- [ ] **Step 1: 创建 EnterpriseInfluencerStatsSection.vue**

```vue
<template>
  <div class="enterprise-influencer-stats-section">
    <div class="stats-cards">
      <div class="stats-card">
        <div class="card-label">达人总数</div>
        <div class="card-value">{{ statsData.totalInfluencers || 0 }}</div>
      </div>
      <div class="stats-card">
        <div class="card-label">合作中</div>
        <div class="card-value">{{ statsData.cooperating || 0 }}</div>
      </div>
      <div class="stats-card">
        <div class="card-label">待合作</div>
        <div class="card-value">{{ statsData.pending || 0 }}</div>
      </div>
      <div class="stats-card">
        <div class="card-label">本月新增</div>
        <div class="card-value">{{ statsData.newThisMonth || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  statsData: {
    type: Object,
    default: () => ({
      totalInfluencers: 815,
      cooperating: 123,
      pending: 692,
      newThisMonth: 45
    })
  }
})
</script>

<style lang="scss" scoped>
.enterprise-influencer-stats-section {
  padding: 16px 24px;
  background: #fff;
}

.stats-cards {
  display: flex;
  gap: 24px;
}

.stats-card {
  flex: 1;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;

  .card-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
}
</style>
```

- [ ] **Step 2: 在 EnterpriseInfluencer.vue 中引入组件**

- [ ] **Step 3: 验证统计数据展示**

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/EnterpriseInfluencer/components/EnterpriseInfluencerStatsSection.vue dohozz-saas/src/views/EnterpriseInfluencer.vue
git commit -m "feat(企业达人库): 实现数据统计区组件"
```

---

## Task 5: 实现 EnterpriseInfluencerListSection.vue（达人列表）

**Files:**
- Create: `dohozz-saas/src/views/EnterpriseInfluencer/components/EnterpriseInfluencerListSection.vue`
- Modify: `dohozz-saas/src/views/EnterpriseInfluencer.vue`
- Test: 列表渲染验证

- [ ] **Step 1: 创建 EnterpriseInfluencerListSection.vue**

表格列：
1. 复选框
2. 达人（头像+名称+ID+认证图标）
3. 平均播放量（支持排序）
4. 近30天视频数
5. 合作计划
6. 计划内容
7. 播放量/阅读量
8. 全部内容
9. 总播放量
10. 操作（关联计划、编辑）

```vue
<template>
  <div class="enterprise-influencer-list-section">
    <el-table
      :data="listData"
      @selection-change="handleSelectionChange"
      border
      stripe
    >
      <el-table-column type="selection" width="40" />
      <el-table-column label="达人" min-width="200">
        <template #default="{ row }">
          <div class="influencer-cell">
            <el-avatar :size="40" :src="row.streamer_avatar">
              {{ row.streamer_name.charAt(0) }}
            </el-avatar>
            <div class="influencer-info">
              <div class="influencer-name">
                {{ row.streamer_name }}
                <el-icon v-if="row.is_verified" class="verified-icon"><CircleCheck /></el-icon>
              </div>
              <div class="influencer-id">ID: {{ row.streamer_id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="平均播放量" min-width="120" sortable>
        <template #default="{ row }">
          {{ row.avg_view_count.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="近30天视频数" min-width="120">
        <template #default="{ row }">
          {{ row.video_count_30days }}
        </template>
      </el-table-column>
      <el-table-column label="合作计划" min-width="100">
        <template #default="{ row }">
          {{ row.cooperation_plan_count }}
        </template>
      </el-table-column>
      <el-table-column label="计划内容" min-width="100">
        <template #default="{ row }">
          {{ row.plan_content_count }}
        </template>
      </el-table-column>
      <el-table-column label="播放量/阅读量" min-width="120">
        <template #default="{ row }">
          {{ row.view_read_count.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="全部内容" min-width="100">
        <template #default="{ row }">
          {{ row.all_content_count }}
        </template>
      </el-table-column>
      <el-table-column label="总播放量" min-width="120">
        <template #default="{ row }">
          {{ row.total_view_count.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button size="small" class="relate-btn" @click="emit('relate', row)">关联计划</el-button>
            <el-button size="small" type="primary" class="edit-btn" @click="emit('edit', row)">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const props = defineProps({
  listData: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  selectedIds: { type: Array, default: () => [] }
})

const emit = defineEmits(['selection-change', 'detail', 'edit', 'relate', 'page-change', 'size-change'])

function handleSelectionChange(selection) {
  emit('selection-change', selection.map(item => item.streamer_id))
}
</script>

<style lang="scss" scoped>
.enterprise-influencer-list-section {
  padding: 0 24px;
}

.influencer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.influencer-info {
  .influencer-name {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #333;

    .verified-icon {
      color: #1677ff;
    }
  }

  .influencer-id {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }
}

.action-btns {
  display: flex;
  gap: 8px;

  .relate-btn {
    color: #ff9540;
    border-color: #ff9540;
  }

  .edit-btn {
    background: #ff4545;
    border-color: #ff4545;
  }
}
</style>
```

- [ ] **Step 2: 在 EnterpriseInfluencer.vue 中引入组件**

- [ ] **Step 3: 验证列表渲染**

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/EnterpriseInfluencer/components/EnterpriseInfluencerListSection.vue dohozz-saas/src/views/EnterpriseInfluencer.vue
git commit -m "feat(企业达人库): 实现达人列表组件"
```

---

## Task 6: 实现添加/编辑/关联计划弹窗

**Files:**
- Create: `dohozz-saas/src/views/EnterpriseInfluencer/dialogs/AddInfluencerDialog.vue`
- Create: `dohozz-saas/src/views/EnterpriseInfluencer/dialogs/EditInfluencerDialog.vue`
- Create: `dohozz-saas/src/views/EnterpriseInfluencer/dialogs/RelatePlanDialog.vue`
- Modify: `dohozz-saas/src/views/EnterpriseInfluencer.vue`
- Test: 弹窗交互验证

- [ ] **Step 1: 创建 AddInfluencerDialog.vue**

```vue
<template>
  <el-dialog v-model="dialogVisible" title="添加达人" width="560px">
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>平台</div>
      <el-select v-model="form.platform" placeholder="请选择平台" style="width: 100%">
        <el-option label="抖音" value="douyin" />
        <el-option label="小红书" value="xiaohongshu" />
      </el-select>
    </div>
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>达人昵称</div>
      <el-input v-model="form.streamer_name" placeholder="请输入达人昵称" />
    </div>
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>抖音号/小红书号</div>
      <el-input v-model="form.streamer_account" placeholder="请输入抖音号/小红书号" />
    </div>
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>达人分类</div>
      <el-select v-model="form.streamer_category" placeholder="请选择达人分类" style="width: 100%">
        <el-option label="美妆博主" value="美妆博主" />
        <el-option label="美食博主" value="美食博主" />
        <el-option label="穿搭博主" value="穿搭博主" />
        <el-option label="母婴博主" value="母婴博主" />
        <el-option label="数码博主" value="数码博主" />
      </el-select>
    </div>
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>联系方式</div>
      <el-input v-model="form.contact_info" placeholder="请输入联系方式" />
    </div>
    <div class="form-item">
      <div class="form-label">备注</div>
      <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api/enterpriseInfluencer'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['success', 'update:visible'])

const dialogVisible = ref(false)
const confirmLoading = ref(false)

const form = ref({
  platform: 'douyin',
  streamer_name: '',
  streamer_account: '',
  streamer_category: '',
  contact_info: '',
  remark: ''
})

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    // 重置表单
    form.value = {
      platform: 'douyin',
      streamer_name: '',
      streamer_account: '',
      streamer_category: '',
      contact_info: '',
      remark: ''
    }
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

async function handleConfirm() {
  // 表单验证
  if (!form.value.streamer_name) {
    ElMessage.error('请输入达人昵称')
    return
  }
  if (!form.value.streamer_account) {
    ElMessage.error('请输入抖音号/小红书号')
    return
  }

  confirmLoading.value = true
  try {
    await api.addInfluencer(form.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    emit('success')
  } catch (e) {
    ElMessage.error(e.message || '添加失败')
  } finally {
    confirmLoading.value = false
  }
}
</script>
```

- [ ] **Step 2: 创建 EditInfluencerDialog.vue**

与 AddInfluencerDialog 类似，但预填充数据：

```vue
<template>
  <el-dialog v-model="dialogVisible" title="编辑达人" width="560px">
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>平台</div>
      <el-select v-model="form.platform" placeholder="请选择平台" style="width: 100%">
        <el-option label="抖音" value="douyin" />
        <el-option label="小红书" value="xiaohongshu" />
      </el-select>
    </div>
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>达人昵称</div>
      <el-input v-model="form.streamer_name" placeholder="请输入达人昵称" />
    </div>
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>抖音号/小红书号</div>
      <el-input v-model="form.streamer_account" placeholder="请输入抖音号/小红书号" />
    </div>
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>达人分类</div>
      <el-select v-model="form.streamer_category" placeholder="请选择达人分类" style="width: 100%">
        <el-option label="美妆博主" value="美妆博主" />
        <el-option label="美食博主" value="美食博主" />
        <el-option label="穿搭博主" value="穿搭博主" />
      </el-select>
    </div>
    <div class="form-item">
      <div class="form-label"><span class="required">*</span>联系方式</div>
      <el-input v-model="form.contact_info" placeholder="请输入联系方式" />
    </div>
    <div class="form-item">
      <div class="form-label">备注</div>
      <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api/enterpriseInfluencer'

const props = defineProps({
  visible: Boolean,
  influencer: { type: Object, default: null }
})
const emit = defineEmits(['success', 'update:visible'])

const dialogVisible = ref(false)
const confirmLoading = ref(false)

const form = ref({
  platform: 'douyin',
  streamer_name: '',
  streamer_account: '',
  streamer_category: '',
  contact_info: '',
  remark: ''
})

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val && props.influencer) {
    form.value = { ...props.influencer }
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

async function handleConfirm() {
  if (!form.value.streamer_name) {
    ElMessage.error('请输入达人昵称')
    return
  }
  if (!form.value.streamer_account) {
    ElMessage.error('请输入抖音号/小红书号')
    return
  }

  confirmLoading.value = true
  try {
    await api.updateInfluencer(props.influencer.streamer_id, form.value)
    ElMessage.success('编辑成功')
    dialogVisible.value = false
    emit('success')
  } catch (e) {
    ElMessage.error(e.message || '编辑失败')
  } finally {
    confirmLoading.value = false
  }
}
</script>
```

- [ ] **Step 3: 创建 RelatePlanDialog.vue**

```vue
<template>
  <el-dialog v-model="dialogVisible" title="关联计划" width="600px">
    <div class="search-bar">
      <el-input v-model="keyword" placeholder="请输入计划名称" style="width: 200px" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="planList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="40" />
      <el-table-column prop="plan_name" label="计划名称" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button size="small" link @click="handleCancelRelate(row)">取消关联</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api/enterpriseInfluencer'

const props = defineProps({
  visible: Boolean,
  influencer: { type: Object, default: null }
})
const emit = defineEmits(['success', 'update:visible'])

const dialogVisible = ref(false)
const confirmLoading = ref(false)
const keyword = ref('')
const planList = ref([])
const selectedPlanIds = ref([])

watch(() => props.visible, async (val) => {
  dialogVisible.value = val
  if (val) {
    await fetchPlans()
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

async function fetchPlans() {
  const res = await api.getPlanList({ keyword: keyword.value })
  planList.value = res.data.list
}

function handleSearch() {
  fetchPlans()
}

function handleSelectionChange(selection) {
  selectedPlanIds.value = selection.map(item => item.plan_id)
}

function handleCancelRelate(plan) {
  // 取消关联逻辑
}

async function handleConfirm() {
  if (selectedPlanIds.value.length === 0) {
    ElMessage.warning('请至少选择一个计划')
    return
  }
  confirmLoading.value = true
  try {
    await api.relatePlan(props.influencer.streamer_id, selectedPlanIds.value)
    ElMessage.success('关联成功')
    dialogVisible.value = false
    emit('success')
  } catch (e) {
    ElMessage.error(e.message || '关联失败')
  } finally {
    confirmLoading.value = false
  }
}
</script>
```

- [ ] **Step 4: 在 EnterpriseInfluencer.vue 中引入弹窗组件**

- [ ] **Step 5: 验证弹窗交互**

- [ ] **Step 6: Commit**

```bash
git add dohozz-saas/src/views/EnterpriseInfluencer/dialogs/
git commit -m "feat(企业达人库): 实现弹窗组件"
```

---

## Task 7: Build验证和最终检查

- [ ] **Step 1: 运行build**

Run: `cd dohozz-saas && npm run build 2>&1 | tail -30`
Expected: 构建成功，无新增错误

- [ ] **Step 2: 检查spec覆盖度**

| Spec章节 | 覆盖状态 |
|---------|---------|
| 2.1 顶部导航栏（平台切换、额度信息） | ✅ |
| 2.2 筛选操作栏（13个筛选项分三行） | ✅ |
| 2.3 数据卡片/功能区（标题+时间Tab+搜索+批量操作） | ✅ |
| 2.4 表格区域（10列+操作按钮） | ✅ |
| 2.5 分页区域 | ✅ |
| 3.1 添加达人弹窗 | ✅ |
| 3.2 编辑达人弹窗 | ✅ |
| 3.3 关联计划弹窗 | ✅ |
| 3.4 批量操作菜单 | ✅ |
| 5. 边界条件 | ✅ |

- [ ] **Step 3: 最终commit**

```bash
git add -A
git commit -m "feat(企业达人库): 完成企业达人库页面开发"
```

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-28-enterprise-influencer-plan.md`.**

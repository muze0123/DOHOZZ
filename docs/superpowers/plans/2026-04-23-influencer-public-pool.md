# 达人公海功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在达人管理菜单下添加"达人公海"子菜单，创建达人公海页面，支持多维度筛选、批量操作、分页展示等

**Architecture:** 基于 Vue 3 + Element Plus + SCSS，参考 NaturalOrderInfluencer.vue 实现结构

**Tech Stack:** Vue 3, Vue Router, Element Plus, SCSS

---

## 文件结构

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/router/index.js` | 修改 | 添加 /influencer-public-pool 路由 |
| `src/views/Dashboard.vue` | 修改 | 将"达人管理"改为带子菜单的一级菜单 |
| `src/views/InfluencerPublicPool.vue` | 创建 | 达人公海页面主组件 |
| `docs/superpowers/specs/2026-04-23-influencer-public-pool-design.md` | 参考 | 设计规格文档 |

---

## 实现任务

### Task 1: 添加路由配置

**Files:**
- Modify: `src/router/index.js:1-149`

- [ ] **Step 1: 添加达人公海路由**

在 router/index.js 的 routes 数组中，在 `/smart-recommendation` 路由之后添加：

```javascript
{
  path: '/influencer-public-pool',
  name: 'InfluencerPublicPool',
  component: () => import('@/views/InfluencerPublicPool.vue'),
  meta: {
    requiresAuth: true,
    title: '达人公海 - DOHOZZ'
  }
}
```

**完整路由列表位置参考（Task 1 完成后需确认）：**
- 路由应添加在 `/smart-recommendation` (line ~117) 之后
- 或添加在 `/influencer-database` (line ~98) 附近

- [ ] **Step 2: 提交路由更改**

```bash
git add src/router/index.js
git commit -m "feat: add /influencer-public-pool route"
```

---

### Task 2: 配置侧边栏菜单

**Files:**
- Modify: `src/views/Dashboard.vue:372-439` (sidebarMenuConfig)

- [ ] **Step 1: 修改带货场景的达人管理菜单**

将 `ecommerce['达人合作']` 中的：
```javascript
{ name: '达人管理', icon: icons.person },
```

修改为：
```javascript
{ name: '达人管理', icon: icons.person, children: [
  { name: '达人公海' }
]},
```

- [ ] **Step 2: 修改种草场景的达人管理菜单**

将 `seeding['内容合作']` 中的：
```javascript
{ name: '达人管理', icon: icons.person },
```

修改为：
```javascript
{ name: '达人管理', icon: icons.person, children: [
  { name: '达人公海' }
]},
```

- [ ] **Step 3: 提交菜单更改**

```bash
git add src/views/Dashboard.vue
git commit -m "feat: add 达人公海 submenu to 达人管理"
```

---

### Task 3: 创建达人公海页面组件

**Files:**
- Create: `src/views/InfluencerPublicPool.vue`

- [ ] **Step 1: 创建页面基础结构**

创建文件 `src/views/InfluencerPublicPool.vue`，包含以下部分：

```vue
<template>
  <div class="influencer-public-pool">
    <div class="page-container">
      <!-- 顶部平台Tab区 -->
      <div class="platform-section">
        <div class="platform-tabs">
          <!-- TikTok Tab -->
          <span class="platform-tab active">TikTok</span>
          <!-- Instagram Tab -->
          <span class="platform-tab">Instagram</span>
        </div>
        <button class="collapse-btn">收起筛选 ↑</button>
      </div>

      <!-- 搜索区（展开时显示） -->
      <div class="search-section">
        <input class="search-input" placeholder="搜索达人名称/ID或达人主页链接" />
        <button class="btn-search">搜索</button>
      </div>

      <!-- 筛选区（展开时显示） -->
      <div class="filter-section">
        <!-- 第一行：国家地区 -->
        <!-- 第二行：带货分类 -->
        <!-- 第三行：带货信息 -->
      </div>

      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="page-title">达人公海</span>
          <span class="total-count">共xxx个达人</span>
        </div>
        <div class="toolbar-right">
          <button class="btn-batch">批量操作 ▼</button>
          <button class="btn-config">⚙ 配置</button>
          <button class="btn-add">+ 添加达人</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 40px;"><input type="checkbox" /></th>
            <th style="width: 220px;">达人信息</th>
            <th style="width: 100px;">粉丝数</th>
            <th style="width: 120px;">带货类目</th>
            <th style="width: 140px;">近30日成交金额</th>
            <th style="width: 100px;">近30日销量</th>
            <th style="width: 120px;">场均成交金额</th>
            <th style="width: 100px;">跟进BD</th>
            <th style="width: 100px;">标签</th>
            <th style="width: 180px;">最近释放时间</th>
            <th style="width: 150px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- 数据行 -->
        </tbody>
      </table>

      <!-- 分页 -->
      <div class="pagination-bar">
        <!-- 分页控件 -->
      </div>
    </div>

    <!-- 批量分配弹窗 -->
    <el-dialog title="批量分配达人" width="480px">
      <div class="modal-content">
        <p>已选 X 位达人</p>
        <el-select placeholder="请选择分配BD"></el-select>
      </div>
      <div class="modal-footer">
        <button>取消</button>
        <button>确定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 平台
const selectedPlatform = ref('tiktok')

// 搜索
const searchKeyword = ref('')
const isFilterExpanded = ref(true)

// 筛选条件
const filters = reactive({
  countries: [],
  category: '',
  salesLevel: '',
  interactionRate: ''
})

// 数据
const loading = ref(false)
const influencerList = ref([])
const selectedRows = ref([])
const selectAll = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)

// 方法
const handlePlatformChange = () => {}
const toggleFilter = () => {}
const handleSearch = () => {}
const handleSelectAll = () => {}
const handleSort = () => {}
const openBatchModal = () => {}
const handleBatchAssign = () => {}
const handleBatchFollowUp = () => {}
const handleBatchDelete = () => {}
</script>

<style lang="scss" scoped>
// 样式参考 NaturalOrderInfluencer.vue
</style>
```

- [ ] **Step 2: 实现筛选区展开/收起逻辑**

```javascript
const isFilterExpanded = ref(true)

const toggleFilter = () => {
  isFilterExpanded.value = !isFilterExpanded.value
}
```

- [ ] **Step 3: 实现平台切换逻辑**

```javascript
const platforms = [
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' }
]
const selectedPlatform = ref('tiktok')

const handlePlatformChange = (platform) => {
  selectedPlatform.value = platform
  // 重新加载数据
  loadData()
}
```

- [ ] **Step 4: 实现搜索和筛选逻辑**

```javascript
const loadData = async () => {
  loading.value = true
  // 模拟API调用
  const params = {
    platform: selectedPlatform.value,
    keyword: searchKeyword.value,
    ...filters,
    page: currentPage.value,
    pageSize: pageSize.value
  }
  // API调用
  loading.value = false
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}
```

- [ ] **Step 5: 实现数据表格渲染**

达人信息列布局：
```html
<td>
  <div class="influencer-cell">
    <img :src="influencer.avatar || defaultAvatar" class="avatar" />
    <div class="info">
      <span class="name">@{{ influencer.username }} ✓ <span class="lv-tag">LV{{ influencer.lv }}</span></span>
      <span class="real-name">{{ influencer.name }}</span>
      <span class="region-tag">{{ influencer.region }}</span>
    </div>
  </div>
</td>
```

- [ ] **Step 6: 实现分页逻辑**

```javascript
const handlePageChange = (page) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}
```

- [ ] **Step 7: 实现排序逻辑**

```javascript
const sortField = ref('recentReleaseTime')
const sortOrder = ref('desc')

const handleSort = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
  loadData()
}
```

- [ ] **Step 8: 实现批量操作**

```javascript
const batchType = ref('')
const showBatchModal = ref(false)
const selectedBD = ref('')

const openBatchModal = (type) => {
  batchType.value = type
  showBatchModal.value = true
}

const handleBatchAssign = async () => {
  if (!selectedBD.value) {
    ElMessage.warning('请选择分配BD')
    return
  }
  // 调用批量分配API
  ElMessage.success('分配成功')
  showBatchModal.value = false
  loadData()
}
```

- [ ] **Step 9: 添加 Toast 提示**

使用 Element Plus 的 `ElMessage`:
```javascript
import { ElMessage } from 'element-plus'

ElMessage.success('操作成功')
ElMessage.warning('请选择分配BD')
ElMessage.error('网络异常，请稍后重试')
```

- [ ] **Step 10: 添加样式**

参考设计文档的样式规范：
- 页面边距：20px 40px
- 按钮圆角：4px
- 弹窗圆角：8px
- 主色调：#0066FF
- 表头背景：#F5F7FA
- 数据行边框：#F0F0F0

- [ ] **Step 11: 提交页面组件**

```bash
git add src/views/InfluencerPublicPool.vue
git commit -m "feat: create InfluencerPublicPool page component"
```

---

### Task 4: 验证完整功能

- [ ] **Step 1: 启动开发服务器**

```bash
cd /Users/zhangbin/Documents/DOHOZZ/dohozz-saas
npm run dev
```

- [ ] **Step 2: 验证路由**

访问 http://localhost:5173/influencer-public-pool 确认页面加载

- [ ] **Step 3: 验证侧边栏菜单**

确认"达人管理 > 达人公海"菜单项存在且可点击

- [ ] **Step 4: 验证页面布局**

对照设计文档检查：
- ✅ 平台Tab切换
- ✅ 筛选区展开/收起
- ✅ 数据表格显示
- ✅ 分页功能

- [ ] **Step 5: 验证批量操作弹窗**

点击"批量操作"按钮，确认下拉菜单和弹窗正常

- [ ] **Step 6: 提交最终更改**

```bash
git add -A
git commit -m "feat: complete 达人公海 feature"
```

---

## 验收检查清单

| 检查项 | 状态 |
|--------|------|
| 路由 /influencer-public-pool 可访问 | ⬜ |
| 侧边栏显示"达人公海"子菜单 | ⬜ |
| 平台Tab切换正常 | ⬜ |
| 筛选区收起/展开正常 | ⬜ |
| 数据表格显示11列 | ⬜ |
| 字段值右对齐 | ⬜ |
| 分页功能正常 | ⬜ |
| 批量操作弹窗正常 | ⬜ |
| Toast提示正常 | ⬜ |

# 非挂车视频页面实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现非挂车视频页面（NonCartVideo），包含分析区、筛选栏、视频列表、添加/同步弹窗及行内编辑功能

**Architecture:** 独立页面模式，参考 VideoFulfillment.vue 结构。新建 NonCartVideo/ 目录，包含页面组件、3个子组件（筛选区/分析区/列表区）和 3 个弹窗组件（添加视频/同步/详情）。通过 Dashboard 侧边栏集成。

**Tech Stack:** Vue 3 Composition API, Element Plus, SCSS, ECharts（趋势图）

---

## 文件结构

```
dohozz-saas/src/views/NonCartVideo/
├── NonCartVideo.vue                    # 页面入口，状态管理
├── components/
│   ├── NonCartVideoFilterSection.vue   # 筛选条件栏（10个筛选项）
│   ├── NonCartVideoStatsSection.vue   # 分析区（指标块 + 趋势图）
│   └── NonCartVideoListSection.vue     # 视频列表表格（含行内编辑）
└── dialogs/
    ├── AddNonCartVideoDialog.vue       # 添加非挂车视频链接
    ├── SyncPlatformDialog.vue           # 投流数据同步
    └── NonCartVideoDetailDialog.vue     # 视频详情
```

---

## Task 1: 创建页面骨架和路由集成

**Files:**
- Create: `dohozz-saas/src/views/NonCartVideo.vue`
- Modify: `dohozz-saas/src/views/Dashboard.vue`
- Test: build 验证

- [ ] **Step 1: 创建 NonCartVideo.vue 页面骨架**

```vue
<template>
  <div class="non-cart-video">
    <!-- 平台 Tab 切换栏 -->
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

    <!-- 全局时间筛选 -->
    <div class="time-filter-bar">
      <!-- 周/月/近N天/自定义 选项卡 -->
    </div>

    <!-- 分析区 -->
    <NonCartVideoStatsSection />

    <!-- 列表区 -->
    <NonCartVideoFilterSection />
    <NonCartVideoListSection />

    <!-- 分页 -->
    <div class="pagination-section">...</div>

    <!-- 弹窗 -->
    <AddNonCartVideoDialog v-model="addDialogVisible" />
    <SyncPlatformDialog v-model="syncDialogVisible" />
    <NonCartVideoDetailDialog v-model="detailDialogVisible" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 平台 Tab
const platformTabs = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]
const activePlatform = ref('tiktok')

// 弹窗状态
const addDialogVisible = ref(false)
const syncDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 方法
function handlePlatformChange(platform) { ... }
</script>

<style lang="scss" scoped>
@import '@/styles/_influencer-page.scss';

.non-cart-video {
  @extend .page-container;
  padding: 16px 0 24px;
  background: #f5f5f5;
}
</style>
```

- [ ] **Step 2: 在 Dashboard.vue 中集成侧边栏菜单**

在「内容中心 - 合作内容」下添加「非挂车视频」菜单项，指向 `/non-cart-video`。

参考现有菜单结构：
```javascript
{
  path: '/non-cart-video',
  component: () => import('@/views/NonCartVideo.vue'),
  meta: { title: '非挂车视频' }
}
```

- [ ] **Step 3: 验证 build**

Run: `cd dohozz-saas && npm run build 2>&1 | head -50`
Expected: 无新增错误

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo.vue dohozz-saas/src/views/Dashboard.vue
git commit -m "feat(非挂车视频): 创建页面骨架和路由集成"
```

---

## Task 2: 实现 NonCartVideoStatsSection.vue（分析区）

**Files:**
- Create: `dohozz-saas/src/views/NonCartVideo/components/NonCartVideoStatsSection.vue`
- Modify: `dohozz-saas/src/views/NonCartVideo.vue`（引入组件）
- Test: 页面渲染验证

- [ ] **Step 1: 创建 NonCartVideoStatsSection.vue**

```vue
<template>
  <div class="non-cart-video-stats-section">
    <!-- 数据元信息 -->
    <div class="update-info">
      <span>数据更新时间：{{ updateTime }}</span>
      <span>数据范围：{{ dataRange }}</span>
    </div>

    <!-- 指标块 -->
    <div class="stats-blocks">
      <div
        class="stats-block"
        :class="{ active: activeMetric === 'all' }"
        @click="handleMetricChange('all')"
      >
        <div class="block-label">全部视频</div>
        <div class="block-value">{{ metricsData.allVideoCount }}</div>
        <div class="block-hint">公司员工累计添加的非挂车视频数</div>
      </div>
      <div
        class="stats-block"
        :class="{ active: activeMetric === 'new' }"
        @click="handleMetricChange('new')"
      >
        <div class="block-label">新发布视频</div>
        <div class="block-value">{{ metricsData.newVideoCount }}</div>
        <div class="block-hint">视频发布时间在统计时间段内的视频数</div>
      </div>
    </div>

    <!-- 汇总子指标（仅全部视频时显示） -->
    <div v-if="activeMetric === 'all'" class="sub-metrics">
      <div class="sub-metric">
        <span class="sub-label">视频播放量</span>
        <span class="sub-value">{{ metricsData.totalPlays.toLocaleString() }}</span>
      </div>
      <!-- 同理：点赞、评论、收藏 -->
    </div>

    <!-- 折线趋势图 -->
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>
```

关键逻辑：
- 两指标块：全部视频（默认选中）/ 新发布视频
- 点击指标块 → 蓝色边框高亮，下方趋势图和列表联动
- 全部视频时显示 4 个汇总子指标
- 折线图使用 ECharts

- [ ] **Step 2: 引入组件到 NonCartVideo.vue**

```javascript
import NonCartVideoStatsSection from './components/NonCartVideoStatsSection.vue'
```

- [ ] **Step 3: 验证页面渲染**

访问页面，确认分析区正常显示。

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo/components/NonCartVideoStatsSection.vue dohozz-saas/src/views/NonCartVideo.vue
git commit -m "feat(非挂车视频): 实现分析区组件"
```

---

## Task 3: 实现 NonCartVideoFilterSection.vue（筛选条件栏）

**Files:**
- Create: `dohozz-saas/src/views/NonCartVideo/components/NonCartVideoFilterSection.vue`
- Modify: `dohozz-saas/src/views/NonCartVideo.vue`（引入组件）
- Test: 筛选交互验证

- [ ] **Step 1: 创建 NonCartVideoFilterSection.vue**

筛选条件（10个）：
1. 视频标题（输入框 + 回车搜索）
2. 发布时间（日期区间选择器）
3. 达人名称/ID（输入框 + 回车搜索）
4. 所属BD（下拉单选）
5. 所属部门（下拉单选）
6. 商品名称/ID（输入框 + 回车搜索）
7. 是否投放平台同步（下拉单选：不限/未同步）
8. 有小蓝词（开关）
9. 有投流/无投流（单选切换）

```vue
<template>
  <div class="non-cart-video-filter-section">
    <div class="filter-section">
      <!-- 第一行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">视频搜索</span>
          <el-input v-model="localParams.videoKeyword" placeholder="请输入视频标题" @keyup.enter="handleQuery" />
        </div>
        <div class="filter-item">
          <span class="filter-label">发布时间</span>
          <el-date-picker v-model="localParams.publishTimeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </div>
        <div class="filter-item">
          <span class="filter-label">达人筛选</span>
          <el-input v-model="localParams.influencerKeyword" placeholder="请输入达人名称/达人ID" @keyup.enter="handleQuery" />
        </div>
        <div class="filter-item">
          <span class="filter-label">所属BD</span>
          <el-select v-model="localParams.bdId" clearable placeholder="全部BD" />
        </div>
      </div>

      <!-- 第二行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">所属部门</span>
          <el-select v-model="localParams.departmentId" clearable placeholder="全部部门" />
        </div>
        <div class="filter-item">
          <span class="filter-label">商品搜索</span>
          <el-input v-model="localParams.productKeyword" placeholder="请输入商品名称/商品ID" @keyup.enter="handleQuery" />
        </div>
        <div class="filter-item">
          <span class="filter-label">投放平台同步</span>
          <el-select v-model="localParams.syncStatus" placeholder="不限" style="width: 120px">
            <el-option label="不限" value="" />
            <el-option label="未同步" value="unsynced" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">小蓝词</span>
          <el-switch v-model="localParams.hasBlueWord" />
        </div>
        <div class="filter-item">
          <span class="filter-label">投流</span>
          <el-radio-group v-model="localParams.hasInvestment">
            <el-radio-button value="">不限</el-radio-button>
            <el-radio-button value="yes">有投流</el-radio-button>
            <el-radio-button value="no">无投流</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-actions">
          <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
          <el-button size="small" @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
```

关键逻辑：
- 本地维护 `localParams`，emit 到父组件
- 支持 `defineExpose({ reset })` 供父组件重置
- 查询/重置按钮在第二行末尾

- [ ] **Step 2: 引入组件到 NonCartVideo.vue**

- [ ] **Step 3: 验证筛选交互**

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo/components/NonCartVideoFilterSection.vue dohozz-saas/src/views/NonCartVideo.vue
git commit -m "feat(非挂车视频): 实现筛选条件栏组件"
```

---

## Task 4: 实现 NonCartVideoListSection.vue（视频列表）

**Files:**
- Create: `dohozz-saas/src/views/NonCartVideo/components/NonCartVideoListSection.vue`
- Modify: `dohozz-saas/src/views/NonCartVideo.vue`（引入组件）
- Test: 列表渲染和行内编辑验证

- [ ] **Step 1: 创建 NonCartVideoListSection.vue**

列表列（22列）：

| 列名 | 说明 |
|------|------|
| 复选框 | 每行最左侧 |
| 视频\|发布时间 | 视频封图 + 标题 + 发布时间 |
| 达人 | 圆形头像 + 达人用户名 + 达人名称 + 粉丝数 |
| 挂链商品 | 通常显示「- -」 |
| 合作费用 | 行内可编辑（单击进入编辑态） |
| 归属员工 | 行内可编辑 |
| 互动数据更新时间 | 可点击触发手动刷新（有频率限制） |
| 播放量 | 总量 + 所选时间增量 |
| 点赞量 | 同上 |
| 评论数 | 同上 |
| 转发数 | 同上 |
| 收藏数 | 同上 |
| 是否有投流 | 「是」/「否」 |
| 投放消耗费用 | 无数据显示「- -」 |
| 投放播放量 | 同上 |
| 投放点赞量 | 同上 |
| 投放评论数 | 同上 |
| 投放转发数 | 同上 |
| 小蓝词 | 行内可编辑 |
| 投放同步 | 「已同步」绿色 / 「未同步」灰色 |
| 操作 | 详情 / 播放 |

行内编辑实现：
```vue
<el-table-column label="合作费用" min-width="100">
  <template #default="{ row }">
    <div v-if="editingCell.rowId === row.id && editingCell.field === 'cooperationFee'">
      <el-input v-model="editValue" size="small" @blur="handleSaveEdit(row, 'cooperationFee')" @keyup.enter="handleSaveEdit(row, 'cooperationFee')" />
    </div>
    <div v-else class="cell-text" @click="handleStartEdit(row, 'cooperationFee')">
      {{ row.cooperationFee || '--' }}
    </div>
  </template>
</el-table-column>
```

频率限制实现：
```javascript
const refreshTimestamps = new Map()

function handleRefreshData(row) {
  const lastRefresh = refreshTimestamps.get(row.id) || 0
  const now = Date.now()
  if (now - lastRefresh < 10 * 60 * 1000) {
    ElMessage.warning('操作太频繁，请稍后再试')
    return
  }
  // 执行刷新
  refreshTimestamps.set(row.id, now)
}
```

- [ ] **Step 2: 引入组件到 NonCartVideo.vue**

- [ ] **Step 3: 验证列表渲染和行内编辑**

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo/components/NonCartVideoListSection.vue dohozz-saas/src/views/NonCartVideo.vue
git commit -m "feat(非挂车视频): 实现视频列表组件（含行内编辑）"
```

---

## Task 5: 实现 AddNonCartVideoDialog.vue（添加非挂车视频链接）

**Files:**
- Create: `dohozz-saas/src/views/NonCartVideo/dialogs/AddNonCartVideoDialog.vue`
- Modify: `dohozz-saas/src/views/NonCartVideo.vue`（引入组件）
- Test: 弹窗交互验证

- [ ] **Step 1: 创建 AddNonCartVideoDialog.vue**

弹窗字段：
1. 视频链接（必填）— 失去焦点自动识别
2. 达人（必填/自动识别）
3. 合作费用（可选）
4. 归属员工（可选）
5. 小蓝词（可选，多个标签）

```vue
<template>
  <el-dialog v-model="dialogVisible" title="添加非挂车视频链接" width="560px">
    <div class="add-form">
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>视频链接</div>
        <el-input v-model="form.videoLink" placeholder="请输入视频链接" @blur="handleRecognizeVideo" />
        <div v-if="recognizeError" class="error-text">链接无效，请重新输入</div>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>达人</div>
        <el-select v-model="form.influencerId" filterable placeholder="请选择达人" style="width: 100%">
          <el-option v-for="inf in influencerOptions" :key="inf.id" :label="inf.name" :value="inf.id" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label">合作费用</div>
        <el-input v-model="form.cooperationFee" placeholder="如 ¥2w" />
      </div>
      <div class="form-item">
        <div class="form-label">归属员工</div>
        <el-select v-model="form.employeeId" clearable placeholder="请选择" style="width: 100%">
          <el-option v-for="emp in employeeOptions" :key="emp.id" :label="emp.name" :value="emp.id" />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label">小蓝词</div>
        <el-select v-model="form.blueWords" multiple filterable allow-create default-first-option placeholder="请输入关键词" style="width: 100%">
        </el-select>
      </div>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">确定</el-button>
    </template>
  </el-dialog>
</template>
```

关键逻辑：
- 视频链接失焦 → 尝试识别视频信息，失败显示错误，弹窗保持
- 识别成功 → 回显封图、标题、达人等信息
- 小蓝词使用 el-select multiple + allow-create

- [ ] **Step 2: 引入组件到 NonCartVideo.vue**

- [ ] **Step 3: 验证弹窗交互**

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo/dialogs/AddNonCartVideoDialog.vue dohozz-saas/src/views/NonCartVideo.vue
git commit -m "feat(非挂车视频): 实现添加非挂车视频弹窗"
```

---

## Task 6: 实现 SyncPlatformDialog.vue（投流数据同步）

**Files:**
- Create: `dohozz-saas/src/views/NonCartVideo/dialogs/SyncPlatformDialog.vue`
- Modify: `dohozz-saas/src/views/NonCartVideo.vue`（引入组件）
- Test: 同步弹窗验证

- [ ] **Step 1: 创建 SyncPlatformDialog.vue**

```vue
<template>
  <el-dialog v-model="dialogVisible" title="投流数据同步" width="480px">
    <div class="sync-form">
      <div class="form-item">
        <div class="form-label">同步视频列表</div>
        <div class="video-list">
          <div v-for="video in selectedVideos" :key="video.id" class="video-item">
            <div class="video-thumb">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="video-info">
              <div class="video-title">{{ video.title }}</div>
              <div class="video-time">{{ video.publishTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">投流平台</div>
        <el-select v-model="targetPlatform" style="width: 100%">
          <el-option :label="platformLabel" :value="activePlatform" />
        </el-select>
      </div>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSync" :loading="syncLoading">确定</el-button>
    </template>
  </el-dialog>
</template>
```

关键逻辑：
- 展示待同步视频列表（无数量上限）
- 投流平台与当前页面 Tab 对应
- 同步中按钮 loading，不可重复点击
- 同步成功 → 关闭弹窗，Toast「同步成功」

- [ ] **Step 2: 引入组件到 NonCartVideo.vue**

- [ ] **Step 3: 验证同步弹窗交互**

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo/dialogs/SyncPlatformDialog.vue dohozz-saas/src/views/NonCartVideo.vue
git commit -m "feat(非挂车视频): 实现投流平台同步弹窗"
```

---

## Task 7: 实现 NonCartVideoDetailDialog.vue（视频详情）

**Files:**
- Create: `dohozz-saas/src/views/NonCartVideo/dialogs/NonCartVideoDetailDialog.vue`
- Modify: `dohozz-saas/src/views/NonCartVideo.vue`（引入组件）
- Test: 详情弹窗验证

- [ ] **Step 1: 创建 NonCartVideoDetailDialog.vue**

展示视频完整信息：
- 视频封图、标题、发布时间
- 达人信息（头像、名称、粉丝数）
- 互动数据（播放/点赞/评论/转发/收藏）
- 投放数据（消耗费用、播放量等）
- 合作费用、归属员工、小蓝词
- 同步状态（已同步/未同步）

操作按钮：
- 【播放】→ 新标签页打开平台播放页
- 【详情】→ 跳转至视频详情页（新标签页）

- [ ] **Step 2: 引入组件到 NonCartVideo.vue**

- [ ] **Step 3: 验证详情弹窗**

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo/dialogs/NonCartVideoDetailDialog.vue dohozz-saas/src/views/NonCartVideo.vue
git commit -m "feat(非挂车视频): 实现视频详情弹窗"
```

---

## Task 8: 全局时间筛选和联动逻辑

**Files:**
- Modify: `dohozz-saas/src/views/NonCartVideo.vue`
- Modify: `dohozz-saas/src/views/NonCartVideo/components/NonCartVideoStatsSection.vue`
- Modify: `dohozz-saas/src/views/NonCartVideo/components/NonCartVideoListSection.vue`

- [ ] **Step 1: 实现全局时间筛选组件**

时间选项：近7天（默认）/ 周 / 月 / 自定义

```javascript
const timeOptions = [
  { key: '7days', label: '近7天' },
  { key: '30days', label: '近30天' },
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'custom', label: '自定义' }
]

const activeTimeKey = ref('7days')
const timeRange = ref([]) // [startDate, endDate]

function handleTimeChange(key) {
  activeTimeKey.value = key
  if (key !== 'custom') {
    // 计算日期区间
    timeRange.value = calculateTimeRange(key)
    // 触发数据刷新
    fetchData()
  }
}
```

- [ ] **Step 2: 实现分析区和列表区联动**

```javascript
// 指标块切换
function handleMetricChange(metric) {
  activeMetric.value = metric
  // 更新列表标题
  listTitle.value = metric === 'all' ? '非挂车视频列表-全部视频' : '非挂车视频列表-新发布视频'
  // 刷新数据
  fetchData()
}
```

- [ ] **Step 3: 平台 Tab 切换时重置**

```javascript
function handlePlatformChange(platform) {
  activePlatform.value = platform
  // 重置时间筛选
  activeTimeKey.value = '7days'
  timeRange.value = []
  // 重置指标块
  activeMetric.value = 'all'
  // 重置筛选条件
  filterSectionRef.value?.reset()
  // 刷新数据
  fetchData()
}
```

- [ ] **Step 4: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo.vue dohozz-saas/src/views/NonCartVideo/components/NonCartVideoStatsSection.vue dohozz-saas/src/views/NonCartVideo/components/NonCartVideoListSection.vue
git commit -m "feat(非挂车视频): 实现全局时间筛选和区域联动逻辑"
```

---

## Task 9: Mock 数据和完整流程验证

**Files:**
- Modify: `dohozz-saas/src/views/NonCartVideo.vue`（添加 mock 数据）

- [ ] **Step 1: 添加 Mock 数据**

```javascript
const mockVideos = ref([
  {
    id: 'NV20260420001',
    title: '夏季清爽护肤教程',
    thumbnail: '',
    platform: 'tiktok',
    publishTime: '2026-04-20 10:30:00',
    influencer: {
      id: 'I001',
      name: '@fashionqueen_k',
      avatar: '',
      followers: '10.2w'
    },
    linkedProduct: null, // 非挂车通常为空
    cooperationFee: '¥2w',
    employee: '张三',
    dataUpdateTime: '2026-04-26 01:00:00',
    stats: {
      plays: 123456,
      likes: 6543,
      comments: 321,
      collects: 876,
      shares: 234,
      playsDelta: '+100',
      likesDelta: '+50'
    },
    hasInvestment: true,
    investmentStats: {
      consumeFee: '¥5000',
      plays: 50000,
      likes: 2500,
      comments: 120,
      shares: 80
    },
    blueWords: ['杭州文旅', '护肤推荐'],
    syncStatus: 'synced', // synced / unsynced
    syncInfo: {
      platform: 'TikTok',
      user: '张三',
      time: '2026-04-25 15:30:00'
    }
  }
  // ... 更多 mock 数据
])
```

- [ ] **Step 2: 验证完整流程**

1. 页面加载 → 显示 TikTok Tab（默认）
2. 时间筛选切换 → 分析区和列表区数据刷新
3. 指标块切换 → 列表标题联动
4. 筛选条件输入 → 列表过滤
5. 行内编辑 → 合作费用/归属员工/小蓝词可编辑
6. 点击互动数据更新时间 → 有频率限制（10分钟）
7. 点击添加按钮 → 弹窗打开，链接识别
8. 勾选视频 → 点击投流同步 → 弹窗打开

- [ ] **Step 3: Commit**

```bash
git add dohozz-saas/src/views/NonCartVideo.vue
git commit -m "feat(非挂车视频): 添加Mock数据和完整流程验证"
```

---

## Task 10: Build 验证和最终检查

- [ ] **Step 1: 运行 build**

Run: `cd dohozz-saas && npm run build 2>&1 | tail -30`
Expected: 构建成功，无新增错误

- [ ] **Step 2: 检查 spec 覆盖度**

| Spec 章节 | 覆盖状态 |
|-----------|---------|
| 2.1 平台 Tab 切换 | ✅ |
| 2.2 全局时间筛选 | ✅ |
| 2.3 分析区（指标块+趋势图） | ✅ |
| 2.4 列表区（22列+筛选+工具栏+分页） | ✅ |
| 3.1 添加视频弹窗 | ✅ |
| 3.2 同步弹窗 | ✅ |
| 4. Toast、空状态、加载状态 | ✅ |
| 5. 行内编辑 | ✅ |
| 5. 频率限制 | ✅ |

- [ ] **Step 3: 最终 commit**

```bash
git add -A
git commit -m "feat(非挂车视频): 完成非挂车视频页面开发"
```

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-27-non-cart-video-plan.md`.**
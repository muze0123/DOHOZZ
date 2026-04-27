# 带货视频页面实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现「带货视频」页面完整功能，包括平台Tab切换、全局筛选、分析区、视频列表、批量投放、AI工具

**Architecture:** 采用复合组件架构，主组件 ShoppingVideo.vue 管理整体状态和布局，子组件负责各区域具体功能，数据通过组合式API管理，Mock数据支持前端开发

**Tech Stack:** Vue 3 + Element Plus + ECharts + Mock数据

---

## 文件结构

```
dohozz-saas/src/views/
├── ShoppingVideo.vue                              # 主页面组件

dohozz-saas/src/views/components/ShoppingVideo/
├── PlatformTabs.vue                              # 平台Tab切换
├── FilterToolbar.vue                             # 全局筛选工具栏
├── StatsBanner.vue                               # 追踪统计横幅
├── AnalysisSection.vue                           # 分析区容器
├── MetricCard.vue                                # 三指标块组件
├── TrendChart.vue                                # 折线柱状趋势图
├── GMVDistribution.vue                           # GMV分布表格
├── CategoryTop5.vue                              # 分类TOP5表格
├── VideoListSection.vue                          # 视频列表区容器
├── VideoTable.vue                                # 列表视图表格
├── VideoCardGrid.vue                             # 卡片视图
└── Pagination.vue                                # 分页组件

dohozz-saas/src/views/dialogs/
├── ManualAddVideoDialog.vue                      # 手动添加视频弹窗
├── TextExtractPanel.vue                          # 提取文案面板（复用）
└── AIRewriteDialog.vue                           # AI智能仿写弹窗（复用）

dohozz-saas/src/api/
└── shoppingVideo.js                              # API接口封装
```

---

## Task 1: 准备工作 - 创建API和Mock数据

**Files:**
- Create: `dohozz-saas/src/api/shoppingVideo.js`

```javascript
// API接口封装 - Mock数据 + 真实接口预留
import request from './request'

// 获取视频列表
export function getVideoList(params) {
  return request({
    url: '/api/shopping-video/list',
    method: 'GET',
    params
  })
}

// 获取分析区数据
export function getStats(params) {
  return request({
    url: '/api/shopping-video/stats',
    method: 'GET',
    params
  })
}

// 批量投放
export function batchSync(params) {
  return request({
    url: '/api/shopping-video/batch-sync',
    method: 'POST',
    data: params
  })
}

// 手动添加视频
export function manualAddVideo(data) {
  return request({
    url: '/api/shopping-video/manual-add',
    method: 'POST',
    data
  })
}

// 提取文案
export function extractText(videoId) {
  return request({
    url: '/api/shopping-video/extract-text',
    method: 'POST',
    data: { videoId }
  })
}

// AI仿写
export function aiRewrite(data) {
  return request({
    url: '/api/shopping-video/ai-rewrite',
    method: 'POST',
    data
  })
}
```

- [ ] **Step 1: 创建 API 文件**

```javascript
// 完整实现如下（包含Mock数据）
export function getVideoList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockVideoList(params) })
    }, 300)
  })
}

export function getStats(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockStats(params) })
    }, 300)
  })
}

// ... 其他API类似
```

- [ ] **Step 2: 创建 Mock 数据生成函数**

- [ ] **Step 3: Commit**

```bash
git add src/api/shoppingVideo.js
git commit -m "feat(shopping-video): add API and mock data
```

---

## Task 2: 创建主组件 ShoppingVideo.vue

**Files:**
- Create: `dohozz-saas/src/views/ShoppingVideo.vue`

**实现要点：**
- 引入所有子组件
- 管理筛选状态（platform, timeRange, metrics等）
- 处理指标块切换逻辑
- 处理平台Tab切换（重置所有筛选条件）
- 管理批量投放选择状态
- 管理对话框显示状态

**核心状态：**
```javascript
const state = reactive({
  platform: 'tiktok',  // tiktok/instagram/shopee/lazada
  currentMetric: 'new', // new/selling/delivery
  filters: {
    timeRange: { type: 'last7days', start: '', end: '' },
    shop: '',
    influencer: '',
    bd: '',
    department: '',
    product: '',
    salesVolume: { min: null, max: null },
    hasAssignment: null,
    hasDelivery: null
  },
  selectedVideos: [],  // 批量投放选中
  listView: 'table',   // table/card
  currentSubTab: 'all'  // all/hasorder/noorder
})
```

- [ ] **Step 1: 创建 ShoppingVideo.vue 基础结构**

- [ ] **Step 2: 实现平台切换和指标切换逻辑**

- [ ] **Step 3: 集成所有子组件**

- [ ] **Step 4: Commit**

---

## Task 3: 创建 PlatformTabs 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/PlatformTabs.vue`

**Props:**
- `modelValue`: 当前选中平台
- `platforms`: 平台列表

**Events:**
- `update:modelValue`: 平台切换

**样式：**
- TikTok（默认激活）/ Instagram / Shopee / Lazada
- 激活Tab：蓝色下划线高亮 + 文字加粗
- 平台Logo图标 + 平台名称

- [ ] **Step 1: 实现 PlatformTabs.vue**

- [ ] **Step 2: Commit**

---

## Task 4: 创建 FilterToolbar 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/FilterToolbar.vue`

**筛选控件：**
| 控件 | 类型 | 说明 |
|------|------|------|
| 时间范围 | 快捷选项+日期区间 | 周/月/自定义/近N天，默认近7天 |
| 店铺名称 | 下拉单选 | 筛选指定店铺 |
| 达人搜索 | 输入框+搜索 | placeholder「请输入达人名称/达人ID」 |
| 所属BD | 下拉单选 | - |
| 所属部门 | 下拉单选 | - |
| 商品搜索 | 输入框+搜索 | placeholder「请输入商品名称/商品ID」 |
| 销量 | 下拉面板 | 不限/快捷选项/自定义范围 |
| 有无归属 | 下拉单选 | 全部/有归属/未归属 |
| 是否有投放 | 下拉单选 | 全部/是/否 |

**交互：**
- 切换平台Tab时，所有筛选条件完全重置为默认值
- 销量自定义范围：最小值/最大值输入框，确定/重置按钮

- [ ] **Step 1: 实现筛选控件布局**

- [ ] **Step 2: 实现销量自定义范围交互**

- [ ] **Step 3: Commit**

---

## Task 5: 创建 StatsBanner 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/StatsBanner.vue`

**内容：**
- 文案：「系统已为您累计追踪到 X 位达人的 Y 个视频及 Z 场直播」
- 数字蓝色加粗，文字灰色
- 右侧快捷入口：【我的追踪达人】【监控规则】
- 列表顶部提示：「带货视频自动监控中」+ 「手动添加视频」蓝色链接

**Events:**
- `click-tracked-influencer`: 点击追踪达人
- `click-monitor-rule`: 点击监控规则
- `click-manual-add`: 点击手动添加视频

- [ ] **Step 1: 实现 StatsBanner.vue**

- [ ] **Step 2: Commit**

---

## Task 6: 创建 AnalysisSection 和 MetricCard

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/AnalysisSection.vue`
- Create: `dohozz-saas/src/views/components/ShoppingVideo/MetricCard.vue`

**MetricCard:**
- Props: `type` (new/selling/delivery), `active`
- 显示：指标名称、?图标、主数值、子指标列表

**三指标块：**
| 指标 | 子指标 |
|------|--------|
| 新发布视频 | 成交金额、退款金额、达人佣金、视频达人数 |
| 动销视频 | 成交金额、退款金额、达人佣金、视频达人数 |
| 投放视频 | 消耗金额、成交金额、成交订单数、支付ROI |

**交互：**
- 点击指标块 → 设为选中态，其他恢复默认
- 联动刷新下方：趋势图、GMV分布、分类TOP5

**AnalysisSection:**
- 整合 MetricCard + TrendChart + GMVDistribution + CategoryTop5
- 接收 currentMetric props
- 管理数据获取和传递

- [ ] **Step 1: 实现 MetricCard.vue**

- [ ] **Step 2: 实现 AnalysisSection.vue（整合子组件）**

- [ ] **Step 3: Commit**

---

## Task 7: 创建 TrendChart 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/TrendChart.vue`

**功能：**
- X轴：日期
- Y轴左：视频数量（柱状图）
- Y轴右：成交金额（折线图）
- 图例随指标动态变化
- 鼠标悬停展示Tooltip

**Props:**
- `data`: 趋势数据数组
- `metricType`: 当前指标类型

- [ ] **Step 1: 使用 ECharts 实现趋势图**

- [ ] **Step 2: 实现动态图例和数据更新**

- [ ] **Step 3: Commit**

---

## Task 8: 创建 GMVDistribution 和 CategoryTop5

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/GMVDistribution.vue`
- Create: `dohozz-saas/src/views/components/ShoppingVideo/CategoryTop5.vue`

**GMVDistribution:**
- 表格展示近30天视频GMV分层统计
- 列：GMV层级、视频数量、GMV金额
- 点击行末尾> → 跳转列表筛选

**CategoryTop5:**
- 表格展示近30天视频商品类目TOP5
- 列：类型名称、GMV金额、数量及占比、跳转入口
- 点击行末尾> → 跳转列表筛选

**Events:**
- `click-row(type, value)`: 点击跳转，传递类型和值给父组件

- [ ] **Step 1: 实现 GMVDistribution.vue**

- [ ] **Step 2: 实现 CategoryTop5.vue**

- [ ] **Step 3: Commit**

---

## Task 9: 创建 VideoListSection 和 VideoTable

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/VideoListSection.vue`
- Create: `dohozz-saas/src/views/components/ShoppingVideo/VideoTable.vue`

**VideoListSection:**
- 列表标题随指标联动
- 工具栏：视频标题搜索、导出、批量投放、视图切换
- 子Tab：全部/有出单/未出单（带数量角标）
- 整合 VideoTable 和 VideoCardGrid

**VideoTable:**
- 列：复选框、视频信息、达人、挂链商品、成交数据、互动数据、是否有投流、退款率、30天GMV趋势、操作
- 投放视频模式额外列：消耗金额、投放成交金额、投放成交订单数、支付ROI

**列表操作列：**
- 详情：跳转视频详情页（新标签页）
- 播放：跳转TikTok视频播放页
- 下载视频：下载到本地
- 提取文案：打开右侧面板
- 智能仿写：打开AI弹窗
- 已同步：只读标签

**交互：**
- 批量投放勾选超过100条 → Toast提示
- 【批量投放】按钮：未勾选置灰，勾选后激活

- [ ] **Step 1: 实现 VideoListSection.vue**

- [ ] **Step 2: 实现 VideoTable.vue（含所有列）**

- [ ] **Step 3: 实现批量投放勾选逻辑**

- [ ] **Step 4: Commit**

---

## Task 10: 创建 VideoCardGrid 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/VideoCardGrid.vue`

**卡片内容：**
- 封面图 + 播放按钮
- 视频标题
- 达人信息（头像+名称+粉丝数）
- 成交数据摘要
- 操作按钮

**样式：**
- 参考 BrandInsight 卡片布局
- 3列自适应网格

- [ ] **Step 1: 实现 VideoCardGrid.vue**

- [ ] **Step 2: Commit**

---

## Task 11: 创建 Dialog 组件

**Files:**
- Create: `dohozz-saas/src/views/dialogs/ManualAddVideoDialog.vue`
- Create: `dohozz-saas/src/views/dialogs/TextExtractPanel.vue`
- Create: `dohozz-saas/src/views/dialogs/AIRewriteDialog.vue`

**ManualAddVideoDialog:**
- 字段：视频链接（必填）、归属员工（必填）
- 视频链接失焦 → 自动识别视频信息
- 归属员工下拉：按当前用户数据权限范围

**TextExtractPanel:**
- 右侧滑入面板
- Loading/成功/失败/无文案四种状态

**AIRewriteDialog:**
- 商品选择 + AI多版本创作生成
- 弹窗形式

- [ ] **Step 1: 实现 ManualAddVideoDialog.vue**

- [ ] **Step 2: 实现 TextExtractPanel.vue**

- [ ] **Step 3: 实现 AIRewriteDialog.vue**

- [ ] **Step 4: Commit**

---

## Task 12: 创建 Pagination 组件

**Files:**
- Create: `dohozz-saas/src/views/components/ShoppingVideo/Pagination.vue`

**功能：**
- 底部分页信息：「共 N 条记录 第 X/Y 页」
- 每页条数下拉：10/20/50，默认10
- 页码导航：上一页、页码列表、下一页
- 快速跳页输入框

**交互：**
- 修改每页条数 → 页码重置至第1页
- 跳页输入超出范围 → Toast提示

- [ ] **Step 1: 实现 Pagination.vue**

- [ ] **Step 2: Commit**

---

## Task 13: 集成到 Dashboard

**Files:**
- Modify: `dohozz-saas/src/views/Dashboard.vue`

**修改内容：**
1. import ShoppingVideo 组件
2. 在左侧菜单「内容中心 > 合作内容」下添加「带货视频」子菜单
3. 在主内容区添加 ShoppingVideo 的条件渲染

**步骤：**
1. 在 sidebarMenuConfig 中添加 `合作内容` 子菜单包含 `带货视频`
2. import ShoppingVideo from './ShoppingVideo.vue'
3. 添加 `<ShoppingVideo v-else-if="activeSidebarMenu === '带货视频'" />`

- [ ] **Step 1: 添加菜单配置**

- [ ] **Step 2: 注册组件**

- [ ] **Step 3: 添加条件渲染**

- [ ] **Step 4: Commit**

---

## Task 14: 验证和测试

**测试清单：**
- [ ] 平台Tab切换正常，所有筛选条件重置
- [ ] 指标块切换联动下方所有区域
- [ ] 筛选控件交互正常（时间、销量自定义范围等）
- [ ] 批量投放勾选超过100条提示
- [ ] 视频列表操作按钮功能正常
- [ ] 提取文案、AI仿写弹窗正常打开
- [ ] 分页功能正常
- [ ] 列表视图/卡片视图切换正常
- [ ] 手动添加视频弹窗正常

- [ ] **Step 1: 运行开发服务器验证**

- [ ] **Step 2: 测试所有交互场景**

- [ ] **Step 3: Commit 最终版本**

---

## 依赖关系

```
Task 1 (API/Mock) ──┐
                    │
Task 2 (主组件) ────┼──> Task 13 (集成)
                    │
Task 3-12 (子组件) ─┘
```

**并行执行建议：**
- Task 1 (API) 可独立进行
- Task 3-6 可并行执行
- Task 7-10 可并行执行
- Task 11 (Dialog) 可独立进行
- Task 12 (Pagination) 可独立进行

---

## 设计决策备注

1. **列表视图为主**：默认使用表格视图，适合数据密集型操作
2. **Mock数据优先**：先实现完整Mock数据，前端验证后再对接真实API
3. **组件拆分**：按功能区域拆分，便于维护和复用
4. **ECharts图表**：复用项目中已有的ECharts进行图表开发
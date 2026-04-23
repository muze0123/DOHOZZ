# 智能推荐达人 - 设计规格

**版本**: v1.0
**创建日期**: 2026-04-23
**状态**: 待审核

---

## 1. 概述

| 项目 | 说明 |
|------|------|
| 页面名称 | SmartInfluencerRecommendation（智能推荐达人） |
| 路由 | `/smart-recommendation` |
| 访问权限 | requiresAuth（需登录） |
| 数据方式 | 前端 Mock 数据，预留后端 API 接口 |
| 实现方式 | 单文件 Vue 组件（SmartRecommendation.vue） |

---

## 2. 路由配置

```js
{
  path: '/smart-recommendation',
  name: 'SmartRecommendation',
  component: () => import('@/views/SmartRecommendation.vue'),
  meta: {
    requiresAuth: true,
    title: '智能推荐达人 - DOHOZZ'
  }
}
```

---

## 3. 页面布局结构

```
┌─────────────────────────────────────────────────────────────┐
│  顶部 Tab 栏（左：Tab切换  右：推荐成效统计）              │
├─────────────────────────────────────────────────────────────┤
│  店铺信息栏（左：店铺信息+策略标签  右：调整推荐方案按钮） │
├─────────────────────────────────────────────────────────────┤
│  列表标题栏（左：今日推荐标题  右：剩余/全量达人数）        │
├─────────────────────────────────────────────────────────────┤
│  推荐达人卡片列表（纵向排列，每卡：左信息区+右匹配区）     │
│  ─────────────────────────────────────────────────────────  │
│  分页栏                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Mock 数据结构

### 4.1 推荐达人卡片

```ts
interface InfluencerCard {
  id: string
  avatar: string
  name: string
  level: string          // e.g. "LV8"
  contactAvailable: boolean
  mainCategories: Array<{
    name: string
    percentage: number
  }>
  relatedCategories: string
  avgPrice: string
  recentSalesAmount: string
  stats: {
    followers: string      // e.g. "121.01w"
    followerGender: string // e.g. "女性居多"
    liveSessions: number   // e.g. 33
    avgSalesAmount: string  // e.g. "31.01w"
    avgSalesCount: number  // e.g. 222
    avgViewers: string     // e.g. "1.23w"
  }
  matchScore: number      // e.g. 96.52
  recommendReason: {
    type: 'competitor' | 'shopMatch' | 'historySimilar' | 'categoryQuality'
    title: string
    details: Array<{
      name: string
      avatar?: string
      image?: string
      count?: number
    }>
  }
  isFollowed: boolean
}
```

### 4.2 店铺信息

```ts
interface ShopInfo {
  id: string
  logo: string
  name: string
  strategy: {
    avgOrderPrice: string
    mainCategory: string
    followerGender: string
    followerAge: string
    followerRegion: string
  }
  // 可授权店铺列表
  authorizedShops: ShopInfo[]
}
```

### 4.3 推荐成效

```ts
interface RecommendationStats {
  totalInfluencers: number    // e.g. 98
  totalSalesAmount: string    // e.g. "5,932.82"
}
```

---

## 5. 组件结构

```
SmartRecommendation.vue (单文件组件)
├── Top Tab Bar（顶部 Tab 栏）
│   ├── Tab: 按店铺智能推荐达人
│   ├── Tab: 按商品智能推荐达人
│   └── 推荐成效统计
├── Shop Info Bar（店铺信息栏）
│   ├── 店铺下拉选择
│   ├── 策略标签行
│   └── 调整推荐方案按钮
├── List Header（列表标题栏）
│   ├── 标题 + 日期 + 说明
│   └── 剩余/全部计数
├── Recommendation Card（推荐达人卡片）
│   ├── 卡片主体区（Left）
│   │   ├── 达人基本信息行
│   │   ├── 主营类目标签行
│   │   ├── 关联类目信息行
│   │   └── 五项数据指标行
│   └── 卡片匹配区（Right）
│       ├── 匹配分仪表盘
│       ├── 推荐理由
│       └── 操作按钮行
├── Dislike Dialog（踩反馈弹窗）
├── Strategy Drawer（调整推荐方案抽屉）
└── Pagination（分页栏）
```

---

## 6. 区域实现细节

### 6.1 顶部 Tab 栏

- **左**：两个 Tab，点击切换 `activeTab` 状态（`shop` | `product`）
- **右**：推荐成效统计文案，数字高亮

### 6.2 店铺信息栏

- **吸顶行为**：监听 scroll，当向下滚动超过阈值时，`shop-info-bar` 添加 `is-sticky` class，隐藏策略标签行
- **店铺下拉**：点击展开 `el-popover` 气泡，显示 `authorizedShops` 列表
- **策略标签**：横向排列，使用 `|` 分隔符，高亮词用 `#1677FF`

### 6.3 推荐达人卡片

- **卡片整体**：`display: flex`，左右两列布局
- **匹配分区背景**：渐变色 `#EAF4FF → #C8E0FF`
- **仪表盘**：使用 CSS + SVG 绘制半圆形仪表盘
- **踩按钮**：点击弹出 `DislikeDialog` 弹窗
- **跟进按钮**：点击后变更为「已跟进」置灰态

### 6.4 踩反馈弹窗

- 弹窗类型：`el-popover` 或 `el-dialog`
- 反馈原因选项：单选按钮组
- 「其他原因」选中后显示输入框
- 提交时调用预留接口 `submitDislikeFeedback(influencerId, reason)`

### 6.5 调整推荐方案抽屉

- 抽屉类型：`el-drawer`（右侧滑出）
- 包含：达人来源滑块、粉丝画像配置、带货类目、竞品设置等
- 底部提示：「修改后的推荐策略将在保存第二日开始生效」

---

## 7. 交互规则

| 操作 | 行为 |
|------|------|
| 点击 Tab | 切换 `activeTab`，刷新推荐列表 |
| 点击店铺下拉 | 展开店铺列表，选择后刷新列表 |
| 点击「查看关联类目」 | 弹出 `el-popover`，展示类目表格 |
| 点击「女性居多 >」| 弹出粉丝画像 Popover |
| 点击「👎踩」| 弹出反馈弹窗 |
| 点击「跟进」| Toast提示成功，按钮变更为「已跟进」|
| 点击「分配达人」| 复用达人库分配弹窗逻辑 |
| 点击「调整推荐方案」| 右侧滑出抽屉 |
| 分页切换 | 切换页码，重新渲染当前页卡片 |

---

## 8. Toast 提示规范

| 场景 | 文案 | 类型 |
|------|------|------|
| 跟进成功 | 跟进成功，您可在"我的达人"页面继续跟进该达人 [查看] | success |
| 踩反馈未选原因 | 请选择反馈原因 | warning |
| 踩反馈提交成功 | 感谢反馈，系统将记录该操作并持续修正推荐结果 | success |
| 跳页超出范围 | 请输入有效页码 | warning |

---

## 9. 预留 API 接口

```ts
// 获取推荐列表
GET /api/recommendation/list
Query: { shopId, tab, page, pageSize }

// 提交踩反馈
POST /api/recommendation/dislike
Body: { influencerId, reason, otherReason? }

// 跟进达人
POST /api/recommendation/follow
Body: { influencerId }

// 获取推荐成效统计
GET /api/recommendation/stats
Query: { shopId }

// 获取推荐策略
GET /api/recommendation/strategy
Query: { shopId }

// 保存推荐策略
POST /api/recommendation/strategy
Body: { shopId, strategy: {...} }
```

---

## 10. 文件结构

```
src/views/SmartRecommendation.vue   # 主组件（含所有区域和弹窗）
src/router/index.js                 # 路由配置（需新增路由）
```

---

## 11. 实现优先级

| 优先级 | 功能 |
|--------|------|
| P0 | 页面框架 + Mock 数据渲染 |
| P0 | Tab 切换（按店铺/按商品）|
| P0 | 推荐达人卡片展示 |
| P0 | 分页功能 |
| P1 | 踩反馈弹窗 |
| P1 | 跟进操作 |
| P1 | 调整推荐方案抽屉 |
| P2 | 店铺下拉切换 |
| P2 | 吸顶效果 |
| P2 | Tooltip 弹窗（关联类目、粉丝画像）|
| P3 | 分配达人功能 |

---

## 12. PRD 样式对照

所有颜色值严格遵循 PRD 中定义：

```css
--color-primary: #1677FF;
--color-deep-blue: #1A4FC4;
--color-text-primary: #262626;
--color-text-secondary: #595959;
--color-text-placeholder: #8C8C8C;
--color-border: #EBEBEB;
--color-border-input: #D9D9D9;
--color-bg-page: #FAFAFA;
--color-bg-card: #FFFFFF;
--color-bg-tag: #EBF3FF;
--color-bg-match: linear-gradient(135deg, #EAF4FF, #C8E0FF);
--color-warning: #FAAD14;
```

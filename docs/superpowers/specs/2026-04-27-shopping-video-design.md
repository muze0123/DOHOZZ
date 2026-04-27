# 带货视频页面设计文档

> 版本: v1.0
> 日期: 2026-04-27
> 状态: 已确认

## 1. 概述

### 1.1 页面定位
「带货视频」是 DOHOZZ 达人营销平台「内容中心 - 合作内容」模块下的核心数据看板，面向品牌运营人员与 BD 员工。

### 1.2 核心功能
- 多平台带货视频监控（TikTok/Instagram/Shopee/Lazada）
- 三维度数据分析（新发布/动销/投放）
- 视频列表管理、批量投放
- 提取文案、AI智能仿写

## 2. 页面结构

```
ShoppingVideo.vue (主组件)
├── PlatformTabs (平台Tab切换)
├── FilterToolbar (全局筛选工具栏)
├── StatsBanner (追踪统计横幅)
├── AnalysisSection (分析区)
│   ├── MetricCards (三指标块: 新发布/动销/投放)
│   ├── TrendChart (折线柱状趋势图)
│   ├── GMVDistribution (近30天GMV分布)
│   └── CategoryTop5 (近30天分类TOP5)
├── VideoListSection (视频列表区)
│   ├── ListToolbar (搜索/导出/批量投放/视图切换)
│   ├── SubTabs (全部/有出单/未出单)
│   ├── VideoTable (列表视图) / VideoCardGrid (卡片视图)
│   └── Pagination (分页)
└── Dialogs
    ├── TextExtractPanel (提取文案侧边面板) - 复用BrandInsight
    ├── AIRewriteDialog (AI智能仿写弹窗) - 复用BrandInsight
    └── ManualAddDialog (手动添加视频弹窗)
```

## 3. 数据流设计

### 3.1 API端点

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/shopping-video/platforms` | GET | 获取平台列表 |
| `/api/shopping-video/list` | GET | 视频列表（支持分页、筛选） |
| `/api/shopping-video/stats` | GET | 分析区统计数据 |
| `/api/shopping-video/batch-sync` | POST | 批量投放同步 |
| `/api/shopping-video/extract-text` | POST | 提取文案 |
| `/api/shopping-video/ai-rewrite` | POST | AI智能仿写 |
| `/api/shopping-video/manual-add` | POST | 手动添加视频 |

### 3.2 筛选状态管理

```javascript
const filterState = reactive({
  platform: 'tiktok',      // TikTok/Instagram/Shopee/Lazada
  timeRange: { type: 'last7days', start: '', end: '' },
  shop: '',
  influencer: '',
  bd: '',
  department: '',
  product: '',
  salesVolume: { min: null, max: null },
  hasAssignment: null,     // null/true/false
  hasDelivery: null        // null/true/false
})
```

## 4. 组件清单

| 组件 | 文件路径 | 说明 |
|------|---------|------|
| ShoppingVideo | views/ShoppingVideo.vue | 主容器 |
| PlatformTabs | components/ShoppingVideo/PlatformTabs.vue | 平台Tab切换 |
| FilterToolbar | components/ShoppingVideo/FilterToolbar.vue | 9个筛选控件 |
| StatsBanner | components/ShoppingVideo/StatsBanner.vue | 追踪统计横幅 |
| AnalysisSection | components/ShoppingVideo/AnalysisSection.vue | 分析区容器 |
| MetricCard | components/ShoppingVideo/MetricCard.vue | 三指标块组件 |
| TrendChart | components/ShoppingVideo/TrendChart.vue | 折线柱状趋势图 |
| GMVDistribution | components/ShoppingVideo/GMVDistribution.vue | GMV分布表格 |
| CategoryTop5 | components/ShoppingVideo/CategoryTop5.vue | 分类TOP5表格 |
| VideoListSection | components/ShoppingVideo/VideoListSection.vue | 列表区容器 |
| VideoTable | components/ShoppingVideo/VideoTable.vue | 列表视图表格 |
| VideoCardGrid | components/ShoppingVideo/VideoCardGrid.vue | 卡片视图 |
| TextExtractPanel | views/dialogs/TextExtractPanel.vue | 提取文案（复用） |
| AIRewriteDialog | views/dialogs/AIRewriteDialog.vue | AI仿写（复用） |
| ManualAddDialog | dialogs/ManualAddDialog.vue | 手动添加视频 |

## 5. 核心交互逻辑

### 5.1 平台切换
- 点击平台Tab → 重置所有筛选条件为默认值 → 重新加载数据和图表

### 5.2 指标块切换（新发布/动销/投放）
- 点击指标块 → 联动刷新：趋势图、GMV分布、分类TOP5、列表标题
- 动销视频列表额外暴露"发布时间"筛选控件（与全局时间筛选为AND叠加关系）

### 5.3 批量投放
- 勾选视频 ≤100条 → 【批量投放】按钮可点击
- 勾选第101条 → Toast提示"单次批量投放最多100条" + 禁止继续勾选
- 点击【批量投放】 → 二次确认弹窗 → 成功后更新"已同步"标签

### 5.4 列表视图/卡片视图切换
- 右上角图标点击切换，状态保存到组件内

## 6. 复用方案

| 功能 | 复用来源 |
|------|---------|
| 提取文案 | 从 BrandInsight 复制 TextExtractPanel.vue |
| AI智能仿写 | 从 BrandInsight 复制 AIRewriteDialog.vue |
| 视频卡片样式 | 参考 BrandInsight.vue 卡片布局 |
| 图表组件 | 使用 ECharts |

## 7. 文件结构

```
dohozz-saas/src/views/
└── ShoppingVideo.vue

dohozz-saas/src/views/components/ShoppingVideo/
├── PlatformTabs.vue
├── FilterToolbar.vue
├── StatsBanner.vue
├── AnalysisSection.vue
├── MetricCard.vue
├── TrendChart.vue
├── GMVDistribution.vue
├── CategoryTop5.vue
├── VideoListSection.vue
├── VideoTable.vue
└── VideoCardGrid.vue

dohozz-saas/src/views/dialogs/
├── TextExtractPanel.vue
└── AIRewriteDialog.vue
```

## 8. 设计决策

1. **列表 vs 卡片视图**：默认列表视图（表格更适合数据密集型操作）
2. **分页**：默认10条/页，支持20/50条选项
3. **导出**：前端先导出当前筛选结果（Mock实现）
4. **互动数据刷新**：点击时间戳区域触发刷新，显示Loading状态
5. **千位分隔符**：使用千分位格式（如 1,234,567）
6. **金额格式**：保留2位小数，千分位逗号，前缀 ¥（如 ¥1,754.30）
7. **增量展示**：正增量绿色"+数字"，负增量红色"-数字"

## 9. Toast提示规范

| 触发场景 | Toast文案 | 类型 |
|---------|----------|------|
| 复制内容成功 | 复制成功 | 成功（绿） |
| 导出触发成功 | 导出成功，请查收 | 成功（绿） |
| 批量投放同步成功 | 同步成功 | 成功（绿） |
| 勾选超过100条 | 单次批量投放最多100条 | 警告（橙） |
| 互动数据手动更新成功 | 互动数据已更新 | 成功（绿） |
| 手动添加视频成功 | 视频添加成功 | 成功（绿） |
| 视频链接识别失败 | 链接无效，请重新输入 | 失败（红） |
| 销量自定义范围填写错误 | 请输入有效的销量范围 | 失败（红） |
| 跳页输入超出范围 | 请输入有效页码 | 警告（橙） |

## 10. PRD关键确认项

- 筛选条件完全重置，不保留任何条件
- 批量投放单次上限100条
- 动销视频列表「发布时间」筛选与全局时间筛选为叠加过滤（AND关系）
- 归属员工手动指定权限：具备该数据权限的员工均可操作，不限于管理员
- 互动数据手动更新暂无频率限制
- 提取文案、智能仿写与「品牌视频」完全复用同一组件
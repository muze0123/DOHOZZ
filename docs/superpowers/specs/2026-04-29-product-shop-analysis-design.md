# 商品&店铺指标分析页面设计文档

## 一、概述

本页面为商品&店铺指标分析后台页面，用于展示和分析不同平台的商品和店铺指标数据。页面位于指挥中台子模块，采用 Mock 数据开发。

## 二、页面结构

```
ProductShopAnalysis.vue (主页面)
├── 顶部导航区
│   ├── 一分钟看懂指挥中台按钮
│   └── 导出页面为图片按钮
├── 平台切换栏 (PlatformTabs)
│   └── 全部/抖音/快手/视频号/小红书
├── 时间筛选栏 (TimeFilterBar)
│   ├── 日期范围选择器
│   ├── 快捷选项 (近N天/周/月/大促/自定义)
│   └── 教程按钮
├── 基础筛选栏 (FilterBar)
│   ├── 归属筛选 (全部出单达人/团队建联达人)
│   ├── 类型筛选 (全部/达人/团长)
│   └── 店铺下拉选择
├── 核心指标概览区 (MetricsCards)
│   ├── 淡粉色卡片 (成交金额 + 订单数)
│   ├── 淡紫色卡片 (退款金额 + 退款订单数)
│   └── 淡蓝色卡片 (出单商品数 + 出单链接数)
├── 图表切换标签 (ChartTabs)
│   └── 店铺指标分析 / 商品指标分析
├── 环形图 + 折线趋势图区
│   ├── RingChart.vue (半圆环形对比图)
│   └── LineTrendChart.vue (折线趋势图)
├── 商品占比图 (ProductShareCards)
│   └── TOP15 商品卡片矩阵 (横向滚动)
├── SPU分布区 (SpuDistribution)
│   ├── SPU / 商品链接切换
│   ├── 纵轴维度下拉
│   └── 热力矩阵
└── 出单SPU表格区 (SpuTable)
    ├── 导出按钮
    ├── SPU / 商品链接切换
    ├── 搜索框
    ├── 数据表格 (可排序)
    └── 分页器
```

## 三、组件清单

| 组件名 | 文件路径 | 说明 |
|-------|---------|-----|
| ProductShopAnalysis | views/ProductShopAnalysis.vue | 主页面容器 |
| PlatformTabs | views/components/ProductShop/PlatformTabs.vue | 平台切换标签栏 |
| TimeFilterBar | views/components/ProductShop/TimeFilterBar.vue | 时间筛选栏 |
| FilterBar | views/components/ProductShop/FilterBar.vue | 基础筛选栏 |
| MetricsCards | views/components/ProductShop/MetricsCards.vue | 核心指标卡片组 |
| ChartTabs | views/components/ProductShop/ChartTabs.vue | 图表切换标签 |
| RingChart | views/components/ProductShop/RingChart.vue | 半圆环形图 (ECharts) |
| LineTrendChart | views/components/ProductShop/LineTrendChart.vue | 折线趋势图 (ECharts) |
| ProductShareCards | views/components/ProductShop/ProductShareCards.vue | 商品占比卡片矩阵 |
| SpuDistribution | views/components/ProductShop/SpuDistribution.vue | SPU分布热力矩阵 |
| SpuTable | views/components/ProductShop/SpuTable.vue | 出单SPU数据表格 |

## 四、Mock 数据结构

### 4.1 核心指标

```javascript
{
  salesAmount: { value: 185.96, unit: 'w', orderCount: 62000, mom: -6.04, orderMom: -7.18 },
  refundAmount: { value: 33.27, unit: 'w', orderCount: 9917, mom: -18.99, orderMom: -18.82 },
  productCount: { value: 74, linkCount: 703, mom: -6.33, linkMom: 2.93 }
}
```

### 4.2 商品占比 TOP15

```javascript
[
  { id: '2909', name: '示例SPU商品2909', brand: '品牌A', salesAmount: 33000, ratio: 16.57 },
  { id: '2910', name: '幼儿园午睡趴睡枕', brand: '品牌B', salesAmount: 15600, ratio: 7.82 },
  // ... 共15条
]
```

### 4.3 SPU 分布热力矩阵

```javascript
{
  xAxis: { name: '成交金额', min: 0, max: 33000 },
  yAxis: { name: '出单达人数', min: 0, max: 196 },
  data: [
    { x: 15000, y: 120, name: '示例SPU', linkCount: 5 },
    // ...
  ]
}
```

### 4.4 出单SPU表格

```javascript
{
  list: [
    { spuId: '2909', spuName: '示例SPU商品', salesAmount: 33000, settlementAmount: 6071.14, refundAmount: 5282.93, creatorCount: 196 }
  ],
  total: 74,
  pageSize: 10,
  currentPage: 1
}
```

## 五、样式规范

### 5.1 颜色规范

| 用途 | 色值 |
|-----|-----|
| 主色 | #1677ff |
| 成功/下降 | #52c41a |
| 错误/上升 | #ff4d4f |
| 文字主色 | #333 |
| 文字次要 | #999 |
| 边框 | #d9d9d9 |
| 分隔线 | #e8e8e8 |
| 卡片背景-淡粉 | #FFF1F0 |
| 卡片背景-淡紫 | #F9F0FF |
| 卡片背景-淡蓝 | #E6F4FF |

### 5.2 环比显示规则

- 上升：红色箭头 + 红色文字 (#ff4d4f)
- 下降：绿色箭头 + 绿色文字 (#52c41a)

## 六、路由配置

```javascript
{
  path: '/command-center/product-shop-analysis',
  name: 'ProductShopAnalysis',
  component: () => import('@/views/ProductShopAnalysis.vue'),
  meta: {
    requiresAuth: true,
    title: '商品&店铺指标分析 - DOHOZZ'
  }
}
```

## 七、交互行为

| 功能 | 交互 |
|-----|-----|
| 平台切换 | 点击标签 → 刷新页面数据 |
| 时间筛选 | 选择快捷选项或自定义范围 → 更新数据 |
| 指标卡片 | 点击问号图标 → 显示指标说明 |
| 图表 | 鼠标悬停 → 显示数据点 |
| 商品卡片 | 点击 → 跳转商品详情 |
| 表格排序 | 点击列头 → 升序/降序切换 |
| 搜索 | 输入商品ID → 回车/点击搜索 → 筛选 |
| 分页 | 点击页码/上一页/下一页 → 切换页码 |

## 八、开发顺序

1. 主页面骨架 + 路由配置 + Mock 数据文件
2. 平台切换 + 时间筛选组件
3. 基础筛选栏组件
4. 核心指标卡片组
5. 图表切换 + 环形图 + 折线图
6. 商品占比 TOP15 卡片矩阵
7. SPU 分布热力矩阵
8. 出单 SPU 表格 + 分页 + 搜索
9. 整体样式调优 + 交互联调

## 九、备注

- 图表使用 ECharts 库
- 表格使用 el-table sortable 属性
- 分页使用 el-pagination
- 所有 SVG 图标封装为 Icon*.vue 组件
- 样式优先使用 Tailwind CSS

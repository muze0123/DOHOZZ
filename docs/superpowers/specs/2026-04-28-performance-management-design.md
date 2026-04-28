# 绩效管理页面设计方案

## 一、需求概述

在内容种草-内容合作下开发一级菜单功能"绩效管理"，用于查看员工绩效数据。

### 1.1 页面定位
员工绩效详情管理页面，用于查看员工绩效数据，展示员工的跟进达人、建联达人、合作达人、交付达人、合作内容数、播放量/阅读量、互动数、点赞等关键指标，支持按平台、部门、媒介、时间等多维度筛选。

### 1.2 菜单结构
- 路径：内容种草 → 内容合作 → 绩效管理（三级菜单）

### 1.3 主色调
- 主色：#1677ff（蓝色）
- 标题：#333333
- 次要文字：#666666
- 页面背景：#f5f5f5
- 卡片背景：#ffffff
- 表头背景：#fafafa

---

## 二、页面结构

### 2.1 布局区域（从上到下）

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [全部]  [抖音]  [小红书]                                                              │
│  [全部部门▼]  [全部媒介▼]                                                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  [绩效详情]  数据更新时间：2026-04-26 19:50 [?]                                      │
│  [全部] [昨天] [今天] [近7天] [近30天] [更多]        [数据导出↑] [表格设置]           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  [媒介/部门] [跟进达人] [建联达人] [合作达人] [交付达人] [合作内容数] [播放量/阅读量?][互动数] [点赞] │
│  [合计]       -          -          -          -          0             0            0      0   │
│  [员工1]      0          0          0          0          0             0            0      0   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  [10条/页]  [1] [2] [3] [4] [5] ... [10]  跳至[5]页   共10条记录 第1/1页               │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 三、组件结构

```
src/views/
  PerformanceManagement.vue          # 主页面

  components/
    PerformanceMFilterSection.vue     # 筛选区组件
      - 平台Tab（全部/抖音/小红书）
      - 部门下拉框
      - 媒介下拉框

    PerformanceMStatsSection.vue      # 数据统计区组件
      - 绩效详情标题 + 数据更新时间 + 问号图标
      - 时间标签（全部/昨天/今天/近7天/近30天/更多）
      - 数据导出按钮
      - 表格设置按钮

    PerformanceMTableSection.vue       # 表格区域组件
      - 表头行（媒介/部门 + 8个数据列）
      - 合计行
      - 数据行
      - 分页区域

    dialogs/
      PerformanceMDataUpdateDialog.vue    # 数据更新说明弹窗
      PerformanceMViewReadDialog.vue       # 播放量/阅读量说明弹窗
      PerformanceMTableConfigDialog.vue    # 表格设置弹窗
      PerformanceMMoreTimeDialog.vue       # 更多时间选择弹窗
```

---

## 四、API 层

```
src/api/
  performanceManagement.js            # API 模块
```

### 接口定义（Mock）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getPerformanceList | GET | /api/performance/list | 获取绩效列表 |
| getDepartmentList | GET | /api/department/list | 获取部门列表 |
| getMediumList | GET | /api/medium/list | 获取媒介列表 |
| exportPerformance | POST | /api/performance/export | 导出绩效数据 |

---

## 五、数据字段

### 绩效数据字段

| 字段名称 | 字段类型 | 说明 | 默认值 |
|---------|---------|------|--------|
| employeeId | String | 员工ID | - |
| employeeName | String | 员工姓名 | - |
| employeeAvatar | String | 员工头像URL | - |
| employeeSurname | String | 员工姓氏（头像用） | - |
| departmentId | String | 所属部门ID | - |
| departmentName | String | 所属部门名称 | - |
| mediumId | String | 所属媒介ID | - |
| mediumName | String | 所属媒介名称 | - |
| platform | String | 平台（all/douyin/xiaohongshu） | all |
| followStreamerCount | Integer | 跟进达人数量 | 0 |
| connectStreamerCount | Integer | 建联达人数量 | 0 |
| cooperateStreamerCount | Integer | 合作达人数量 | 0 |
| deliverStreamerCount | Integer | 交付达人数量 | 0 |
| cooperationContentCount | Integer | 合作内容数 | 0 |
| viewReadCount | Integer | 播放量/阅读量 | 0 |
| interactionCount | Integer | 互动数 | 0 |
| likeCount | Integer | 点赞数 | 0 |
| dataUpdateTime | DateTime | 数据更新时间 | - |

### 分页参数

| 字段名称 | 类型 | 说明 | 默认值 |
|---------|------|------|--------|
| page | Integer | 当前页码 | 1 |
| pageSize | Integer | 每页显示条数 | 10 |
| total | Integer | 总条数 | 0 |

---

## 六、交互说明

### 6.1 平台Tab
- 全部/抖音/小红书，选中态为蓝色下划线
- 点击切换平台筛选

### 6.2 筛选下拉
- 全部部门、全部媒介下拉框
- 支持筛选后刷新表格数据

### 6.3 时间标签
- 全部/昨天/今天/近7天/近30天/更多
- 默认选中近7天
- 更多点击后弹窗：全部/自然日/自然周/自然月

### 6.4 表格列配置
- 所有列均可勾选/取消勾选
- 至少保留一列

### 6.5 数据导出
- Mock实现，点击提示"导出成功"

### 6.6 详情跳转
- 各数据列点击后弹窗提示"功能即将上线"
- 不做实际详情页

---

## 七、样式规范

### 颜色规范
- 主色：#1677ff
- 标题：#333333
- 正文：#666666
- 提示文字：#999999
- 页面背景：#f5f5f5
- 卡片背景：#ffffff
- 表头背景：#fafafa
- 边框：#e8e8e8

### 间距规范
- 页面内边距：16px
- 卡片内边距：16px
- 卡片间距：16px
- 表格行高：60px
- 头像直径：40px

### 选中态
- Tab选中：蓝色下划线 2px
- 标签选中：蓝色背景#1677ff + 白色文字
- 按钮选中：蓝色背景 + 白色文字

---

## 八、边界条件

1. 无数据时显示"暂无数据"
2. 加载失败时显示"加载失败，请重试"
3. 头像加载失败显示默认头像
4. 数据为空时显示"0"
5. 首页时上一页不可点，末页时下一页不可点
6. 跳转输入无效页码时红色提示

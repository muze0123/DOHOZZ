# 内容管理模块设计方案

## 一、模块定位

- **路由**：`/content-management`
- **菜单位置**：内容种草 → 合作内容 → 内容管理（二级菜单）
- **主色调**：橙色（主按钮、选中状态）
- **定位**：内容列表管理页面，用于查看、筛选、搜索、确认、编辑内容信息

## 二、技术架构

### 2.1 文件结构

```
src/
├── api/contentManagement.js      # API层（抖音/小红书两套端点）
├── stores/contentManagement.js  # Pinia Store
├── views/
│   ├── ContentManagement.vue    # 主页面
│   └── components/
│       ├── ContentPlatformNav.vue   # 平台切换导航
│       ├── ContentFilterSection.vue # 筛选操作栏
│       ├── ContentStatsSection.vue  # 数据概览卡片
│       └── ContentListSection.vue  # 内容表格
│   └── ContentManagement/dialogs/
│       ├── EditContentDialog.vue    # 编辑内容弹窗
│       ├── ContentDetailDialog.vue  # 内容详情弹窗
│       └── MoreActionsMenu.vue      # 更多操作菜单
└── router/index.js              # 路由配置
```

### 2.2 API 设计

#### 抖音内容 API
```javascript
getDouyinContents(params)           # 获取内容列表
getDouyinContentDetail(id)          # 获取内容详情
updateDouyinContent(id, data)      # 更新内容
deleteDouyinContent(id)             # 删除内容
archiveDouyinContent(id)            # 归档内容
confirmDouyinContents(ids)          # 一键确认
exportDouyinContents(params)        # 导出内容
```

#### 小红书内容 API
```javascript
getXiaohongshuContents(params)           # 获取内容列表
getXiaohongshuContentDetail(id)          # 获取内容详情
updateXiaohongshuContent(id, data)      # 更新内容
deleteXiaohongshuContent(id)             # 删除内容
archiveXiaohongshuContent(id)            # 归档内容
confirmXiaohongshuContents(ids)          # 一键确认
exportXiaohongshuContents(params)       # 导出内容
```

#### 统计数据 API
```javascript
getContentStats(platform, timeRange)  # 获取内容统计数据
```

### 2.3 状态管理（Store）

```javascript
// contentManagement.js
{
  // 平台相关
  platformTabs: [
    { key: 'douyin', label: '抖音', icon: 'douyin-icon' },
    { key: 'xiaohongshu', label: '小红书', icon: 'xiaohongshu-icon' }
  ],
  activePlatform: 'douyin',  // 默认选中抖音

  // 筛选条件
  filters: {
    planId: '',           // 关联计划
    streamerName: '',      // 达人昵称
    contentTag: '',        // 内容标签
    publishForm: '',       // 发布形式
    spuId: '',             // SPU标题
    productLink: '',       // 商品链接
    departmentId: '',       // 所属部门
    mediumId: '',          // 所属媒介
    contentStatus: '',     // 内容状态
    publishTimeStart: '',  // 发布时间开始
    publishTimeEnd: '',    // 发布时间结束
    createTimeStart: '',   // 创建时间开始
    createTimeEnd: ''      // 创建时间结束
  },

  // 时间范围
  timeRange: 'all',  // all | yesterday | today | last7days | last30days | more

  // 内容列表
  contentList: [],
  contentLoading: false,

  // 统计数据
  stats: {
    total: 0,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    collectCount: 0
  },

  // 分页
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  },

  // 搜索
  searchKeyword: ''
}
```

## 三、组件设计

### 3.1 ContentPlatformNav.vue

**功能**：平台切换 + 容量提示

**布局**：
```
[抖音 ✓] [小红书]                    企业已添加内容条数：4 / 3,000  [去加购]
```

**Props**：
```javascript
activePlatform: String
capacityInfo: { used: 4, total: 3000 }
```

**Events**：
- `platform-change`: 平台切换时触发

### 3.2 ContentFilterSection.vue

**功能**：多条件筛选操作栏

**布局**：3行3列网格 + 额外行

**Props**：
```javascript
filterParams: Object  // 当前筛选条件
planOptions: Array    // 关联计划选项
tagOptions: Array     // 内容标签选项
spuOptions: Array      // SPU标题选项
departmentOptions: Array  // 部门选项
mediumOptions: Array  // 媒介选项
statusOptions: Array  // 状态选项
```

**Events**：
- `query`: 搜索按钮点击
- `reset`: 重置按钮点击

**字段说明**：
| 字段 | 组件类型 | 说明 |
|------|---------|------|
| 关联计划 | 下拉选择框 | 全部 + 计划列表 |
| 达人昵称 | 文本输入框 | placeholder: "请输入昵称/抖音号" |
| 内容标签 | 下拉选择框 | 全部 + 标签列表 |
| 发布形式 | 文本输入框 | 带搜索图标 |
| SPU标题 | 下拉选择框 | 带编辑图标可跳转 |
| 商品链接 | 文本输入框 | 带搜索图标 |
| 所属部门 | 下拉选择框 | 全部 + 部门列表 |
| 所属媒介 | 下拉选择框 | 全部 + 媒介列表 |
| 内容状态 | 下拉选择框 | 全部 + 状态列表 |
| 发布时间 | 日期范围选择器 | 开始-结束 |
| 创建时间 | 日期范围选择器 | 开始-结束 |

### 3.3 ContentStatsSection.vue

**功能**：数据概览统计卡片

**布局**：
```
数据概览  [全部] [昨天] [今天] [近7天] [近30天] [更多] [?]
─────────────────────────────────────────────────────────
[内容总数] [播放量/阅读量] [点赞数] [评论数] [收藏数]
  433        26亿          2,211.09w  223.17w    206.64w
```

**Props**：
```javascript
stats: {
  total: Number,
  viewCount: Number,
  likeCount: Number,
  commentCount: Number,
  collectCount: Number
}
activeTimeRange: String
```

**Events**：
- `time-range-change`: 时间范围切换

### 3.4 ContentListSection.vue

**功能**：内容表格展示

**布局**：
```
[搜索框]  [一键确认] [导出] [列设置]
─────────────────────────────────────────────────────────
[内容] [达人] [内容标签] [状态] [关联计划] [关联SPU] [所属媒介] [操作]
[缩略图+标题+发布时间] [头像+昵称+抖音号] [标签] [状态] [数字→] [数字→] [头像+名称] [详情][编辑][...]
```

**Props**：
```javascript
contentList: Array
loading: Boolean
pagination: Object
searchKeyword: String
```

**Events**：
- `search`: 搜索
- `confirm`: 一键确认
- `export`: 导出
- `view-detail`: 查看详情
- `edit`: 编辑
- `delete`: 删除
- `archive`: 归档
- `page-change`: 分页变化
- `page-size-change`: 每页条数变化

**列定义**：
| 列名 | 宽度 | 说明 |
|------|------|------|
| 内容 | 280px | 缩略图(80x80) + 标题 + 发布时间 |
| 达人 | 180px | 头像(32x32) + 昵称 + 抖音号 |
| 内容标签 | 120px | 橙色标签 or "-" |
| 状态 | 100px | 胶囊：蓝点 + "正常" |
| 关联计划 | 80px | 数字 + → or "-" |
| 关联SPU | 80px | 数字 + → or "-" |
| 所属媒介 | 120px | 头像 + 名称 |
| 操作 | 150px | 详情、编辑、更多 |

### 3.5 Dialogs

#### EditContentDialog.vue

**功能**：编辑内容信息

**表单字段**：
| 字段 | 必填 | 组件 |
|------|------|------|
| 内容标题 | 是 | 文本输入 |
| 达人昵称 | 是 | 文本输入 |
| 内容标签 | 是 | 下拉选择（多选） |
| 发布形式 | 是 | 下拉选择 |
| 关联计划 | 是 | 下拉选择 |
| 关联SPU | 是 | 下拉选择 |
| 所属部门 | 是 | 下拉选择 |
| 所属媒介 | 是 | 下拉选择 |
| 备注 | 否 | 多行文本 |

**Events**：
- `confirm`: 确认保存
- `cancel`: 取消

#### ContentDetailDialog.vue

**功能**：展示内容详情

**展示字段**：
- 内容ID、内容标题、内容缩略图
- 达人信息（头像+昵称+抖音号）
- 内容标签、发布形式
- 关联计划、关联SPU
- 所属部门、所属媒介
- 播放量、点赞数、评论数、收藏数
- 发布时间、创建时间
- 备注

**Events**：
- `close`: 关闭

#### MoreActionsMenu.vue

**功能**：更多操作下拉菜单

**菜单项**：
1. 删除内容（二次确认）
2. 归档内容（二次确认）
3. 导出内容
4. 复制内容

**Events**：
- `delete`: 删除
- `archive`: 归档
- `export`: 导出
- `copy`: 复制

## 四、样式规范

### 4.1 颜色规范
```scss
$primary-color: #FF6600;      // 主色-橙色
$bg-white: #FFFFFF;           // 白色
$bg-light-gray: #f5f7fa;     // 浅灰背景
$border-color: #E5E7EB;      // 边框色
$text-primary: #1F2937;      // 主文字
$text-secondary: #6B7280;    // 次要文字
$text-placeholder: #9CA3AF;  // 占位符
$status-blue: #3B82F6;       // 状态蓝点
```

### 4.2 圆角规范
```scss
$border-radius-sm: 6px;
$border-radius-md: 10px;
$border-radius-lg: 16px;
```

### 4.3 字体规范
- 页面标题：18px, font-weight: 600
- 卡片标题：14px, font-weight: 500
- 正文：14px, font-weight: 400
- 辅助文字：12px, font-weight: 400

### 4.4 间距规范
```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

## 五、开发顺序

1. **API 层** - contentManagement.js（Mock 数据 + API 函数）
2. **Store** - contentManagement.js（状态管理）
3. **ContentPlatformNav.vue** - 平台切换导航
4. **ContentFilterSection.vue** - 筛选操作栏
5. **ContentStatsSection.vue** - 数据概览卡片
6. **ContentListSection.vue** - 内容表格
7. **Dialogs**
   - EditContentDialog.vue
   - ContentDetailDialog.vue
   - MoreActionsMenu.vue
8. **主页面** - ContentManagement.vue 组装
9. **路由配置** - router/index.js

## 六、边界条件

1. 无内容数据时显示"暂无内容"
2. 加载失败显示"加载失败，请重试"
3. 缩略图/头像加载失败显示默认图
4. 首页时上一页不可用，末页时下一页不可用
5. 跳转输入无效页码时红色提示
6. 删除/归档需二次确认
7. 列设置至少保留一列（本期不做）

## 七、Toast 提示

| 操作 | 成功 | 失败 |
|------|------|------|
| 编辑 | "编辑成功" | "编辑失败，请重试" |
| 删除 | "删除成功" | "删除失败，请重试" |
| 归档 | "归档成功" | "归档失败，请重试" |
| 一键确认 | "一键确认成功" | "一键确认失败，请重试" |
| 导出 | "导出成功" | "导出失败，请重试" |
| 复制 | "复制成功" | "复制失败，请重试" |
| 筛选/搜索 | - | "筛选失败，请重试" / "暂无搜索结果" |

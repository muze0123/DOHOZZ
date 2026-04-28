# 寄样管理页面设计方案

## 一、需求概述

将现有"达人带货-样品管理"功能模块复制到"内容种草-内容合作-营销计划-寄样管理"路径下，作为新的独立页面，调用新的 API 数据。

### 1.1 页面定位
在内容种草业务场景下，管理达人寄样流程，包括样品申请审批、发货、签收、交付等全流程管理。

### 1.2 菜单结构
- 路径：内容种草 → 内容合作 → 营销计划 → 寄样管理（四级子菜单）

### 1.3 主色调
- 主色：#1677ff（与项目一致）

---

## 二、文件结构

### 新建文件

```
src/views/
  SeedingSampleManagement.vue                    # 主页面
  SeedingSampleManagement/
    components/
      SeedingSampleFilterSection.vue             # 筛选区组件
      SeedingSampleStatsSection.vue             # 统计区组件
      SeedingSampleListSection.vue              # 列表区组件
    dialogs/
      SeedingApproveDialog.vue                  # 审批弹窗
      SeedingRejectDialog.vue                   # 拒绝弹窗
      SeedingShipDialog.vue                     # 发货弹窗
      SeedingDetailDialog.vue                   # 详情弹窗
      SeedingEditNoteDialog.vue                  # 备注编辑弹窗
      SeedingEditSampleDialog.vue               # 样品编辑弹窗
      SeedingDeleteDialog.vue                   # 删除弹窗

src/api/
  seedingSampleManagement.js                     # API 模块
```

### 修改文件

```
src/views/Dashboard.vue                          # 菜单集成
src/api/index.js                                # API 注册
```

---

## 三、功能模块

### 3.1 平台切换栏
- Tab：全部 / TikTok / Instagram / Shopee / Lazada
- 切换平台筛选数据

### 3.2 高级筛选区
- 样品ID
- 商品关键词
- 达人关键词
- 部门筛选
- BD筛选
- 店铺筛选
- 是否重复样品
- 收件人信息
- 创建时间范围
- 物流单号
- 发货时间范围
- 来源

### 3.3 状态统计区
- 状态 Tab：全部 / 待审批 / 待发货 / 已发货 / 已签收 / 拒绝发货
- 交付状态 Tab（已签收时显示）：全部 / 待交付 / 已交付 / 已出单
- 统计数据：样品数量、商品数量、达人数量、重复样品数、样品费用、重复费用、交付率、出单率

### 3.4 样品列表区
- 表格展示：样品ID、平台图标、商品信息、达人信息、收件人信息、BD、状态、操作按钮
- 操作：查看详情、审批、拒绝、发货、删除、编辑备注、编辑样品

### 3.5 弹窗组件
| 弹窗 | 说明 |
|------|------|
| ApproveDialog | 审批通过弹窗 |
| RejectDialog | 拒绝发货弹窗 |
| ShipDialog | 发货弹窗（含物流信息） |
| DetailDialog | 样品详情弹窗 |
| EditNoteDialog | 编辑备注弹窗 |
| EditSampleDialog | 编辑样品信息弹窗 |
| DeleteDialog | 删除确认弹窗 |

---

## 四、API 模块

```javascript
// src/api/seedingSampleManagement.js

// 获取样品列表
export function getSeedingSampleList(params) {
  return request({
    url: '/api/seeding/sample/list',
    method: 'GET',
    params
  })
}

// 获取统计数据
export function getSeedingSampleStats(params) {
  return request({
    url: '/api/seeding/sample/stats',
    method: 'GET',
    params
  })
}

// 审批样品
export function approveSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/approve',
    method: 'POST',
    data
  })
}

// 拒绝样品
export function rejectSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/reject',
    method: 'POST',
    data
  })
}

// 发货
export function shipSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/ship',
    method: 'POST',
    data
  })
}

// 删除样品
export function deleteSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/delete',
    method: 'POST',
    data
  })
}

// 更新备注
export function updateSeedingSampleNote(data) {
  return request({
    url: '/api/seeding/sample/note',
    method: 'POST',
    data
  })
}

// 编辑样品
export function updateSeedingSample(data) {
  return request({
    url: '/api/seeding/sample/update',
    method: 'POST',
    data
  })
}
```

---

## 五、菜单集成

### Dashboard.vue 修改

1. 添加导入：
```javascript
import SeedingSampleManagement from './SeedingSampleManagement.vue'
```

2. 菜单配置修改：
```javascript
seeding: {
  '内容合作': [
    // ... 其他菜单
    { name: '营销计划', icon: icons.plan, children: [
      { name: '计划管理' },
      { name: '寄样管理' }  // 新增
    ]},
    // ...
  ]
}
```

3. 条件渲染添加：
```vue
<SeedingSampleManagement v-else-if="activeSidebarMenu === '寄样管理' && currentScenario === 'seeding'" />
```

---

## 六、技术规范

### 颜色规范
- 主色：#1677ff
- 标题：#333333
- 正文：#666666
- 页面背景：#f5f6f7
- 卡片背景：#ffffff

### 技术栈
- Vue 3 (Composition API + `<script setup>`)
- Element Plus
- SCSS
- API Mock 实现

---

## 七、与原样品管理的差异

| 项目 | 原样品管理 | 寄样管理 |
|------|-----------|---------|
| 菜单路径 | 达人带货→样品管理 | 内容种草→营销计划→寄样管理 |
| API 端点 | /api/sample/... | /api/seeding/sample/... |
| 文件前缀 | Sample* | SeedingSample* |
| 场景 | 带货场景 | 种草场景 |

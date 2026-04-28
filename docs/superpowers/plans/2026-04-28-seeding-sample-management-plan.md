# 寄样管理页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有样品管理复制到新路径"内容种草→营销计划→寄样管理"，调用新 API 模块。

**Architecture:** 完全复制现有 SampleManagement 结构和组件，仅修改文件名前缀为"SeedingSample"，并调用新的 API 模块。Dashboard 中通过 `currentScenario === 'seeding'` 条件渲染新页面。

**Tech Stack:** Vue 3 (Composition API + `<script setup>`), Element Plus, SCSS

---

## 文件结构

```
src/views/
  SeedingSampleManagement.vue                    # 新建 - 主页面（复制自 SampleManagement.vue）
  SeedingSampleManagement/
    components/
      SeedingSampleFilterSection.vue             # 新建 - 筛选区（复制自 SampleFilterSection.vue）
      SeedingSampleStatsSection.vue             # 新建 - 统计区（复制自 SampleStatsSection.vue）
      SeedingSampleListSection.vue              # 新建 - 列表区（复制自 SampleListSection.vue）
    dialogs/
      SeedingApproveDialog.vue                  # 新建 - 审批弹窗（复制自 ApproveDialog.vue）
      SeedingRejectDialog.vue                   # 新建 - 拒绝弹窗（复制自 RejectDialog.vue）
      SeedingShipDialog.vue                     # 新建 - 发货弹窗（复制自 ShipDialog.vue）
      SeedingDetailDialog.vue                   # 新建 - 详情弹窗（复制自 DetailDialog.vue）
      SeedingEditNoteDialog.vue                  # 新建 - 备注编辑弹窗（复制自 EditNoteDialog.vue）
      SeedingEditSampleDialog.vue               # 新建 - 样品编辑弹窗（复制自 EditSampleDialog.vue）
      SeedingDeleteDialog.vue                   # 新建 - 删除弹窗（复制自 DeleteDialog.vue）

src/api/
  seedingSampleManagement.js                    # 新建 - API 模块

src/views/Dashboard.vue                         # 修改 - 菜单集成
src/api/index.js                              # 修改 - API 注册
```

---

## Task 1: 创建 API 模块

**Files:**
- Create: `src/api/seedingSampleManagement.js`

- [ ] **Step 1: 创建 API 模块文件**

```javascript
// src/api/seedingSampleManagement.js
import request from './request'

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

- [ ] **Step 2: 在 api/index.js 中注册**

修改 `src/api/index.js`，添加：
```javascript
export * from './seedingSampleManagement'
```

- [ ] **Step 3: Commit**

```bash
git add src/api/seedingSampleManagement.js src/api/index.js
git commit -m "feat(api): 添加寄样管理 API 模块"
```

---

## Task 2: 创建主页面组件

**Files:**
- Create: `src/views/SeedingSampleManagement.vue`

- [ ] **Step 1: 读取原 SampleManagement.vue 内容**

读取 `src/views/SampleManagement.vue` 的完整内容，作为模板。

- [ ] **Step 2: 创建 SeedingSampleManagement.vue**

将 SampleManagement.vue 内容复制并修改：
1. 文件名改为 `SeedingSampleManagement.vue`
2. 组件名改为 `SeedingSampleManagement`
3. 所有 import 路径中的 `Sample*` 改为 `SeedingSample*`
4. 所有 dialog import 路径改为 `./SeedingSampleManagement/dialogs/Seeding*`
5. API 调用暂时使用 Mock（保持与原页面一致的 mock 数据结构）

关键修改点：
```javascript
// 导入修改
import SeedingSampleFilterSection from './components/SeedingSampleFilterSection.vue'
import SeedingSampleStatsSection from './components/SeedingSampleStatsSection.vue'
import SeedingSampleListSection from './components/SeedingSampleListSection.vue'
import SeedingApproveDialog from './dialogs/SeedingApproveDialog.vue'
// ... 其他 dialog 类似
```

- [ ] **Step 3: Commit**

```bash
git add src/views/SeedingSampleManagement.vue
git commit -m "feat: 创建寄样管理主页面"
```

---

## Task 3: 创建筛选区组件

**Files:**
- Create: `src/views/SeedingSampleManagement/components/SeedingSampleFilterSection.vue`

- [ ] **Step 1: 读取原 SampleFilterSection.vue 内容**

读取 `src/views/components/SampleFilterSection.vue` 的完整内容。

- [ ] **Step 2: 创建 SeedingSampleFilterSection.vue**

将内容复制并修改：
1. 文件名改为 `SeedingSampleFilterSection.vue`
2. 组件名改为 `SeedingSampleFilterSection`
3. 导入路径调整

- [ ] **Step 3: Commit**

```bash
git add src/views/SeedingSampleManagement/components/SeedingSampleFilterSection.vue
git commit -m "feat: 创建寄样管理筛选区组件"
```

---

## Task 4: 创建统计区组件

**Files:**
- Create: `src/views/SeedingSampleManagement/components/SeedingSampleStatsSection.vue`

- [ ] **Step 1: 读取原 SampleStatsSection.vue 内容**

读取 `src/views/components/SampleStatsSection.vue` 的完整内容。

- [ ] **Step 2: 创建 SeedingSampleStatsSection.vue**

将内容复制并修改：
1. 文件名改为 `SeedingSampleStatsSection.vue`
2. 组件名改为 `SeedingSampleStatsSection`

- [ ] **Step 3: Commit**

```bash
git add src/views/SeedingSampleManagement/components/SeedingSampleStatsSection.vue
git commit -m "feat: 创建寄样管理统计区组件"
```

---

## Task 5: 创建列表区组件

**Files:**
- Create: `src/views/SeedingSampleManagement/components/SeedingSampleListSection.vue`

- [ ] **Step 1: 读取原 SampleListSection.vue 内容**

读取 `src/views/components/SampleListSection.vue` 的完整内容。

- [ ] **Step 2: 创建 SeedingSampleListSection.vue**

将内容复制并修改：
1. 文件名改为 `SeedingSampleListSection.vue`
2. 组件名改为 `SeedingSampleListSection`

- [ ] **Step 3: Commit**

```bash
git add src/views/SeedingSampleManagement/components/SeedingSampleListSection.vue
git commit -m "feat: 创建寄样管理列表区组件"
```

---

## Task 6: 创建弹窗组件集

**Files:**
- Create: `src/views/SeedingSampleManagement/dialogs/SeedingApproveDialog.vue`
- Create: `src/views/SeedingSampleManagement/dialogs/SeedingRejectDialog.vue`
- Create: `src/views/SeedingSampleManagement/dialogs/SeedingShipDialog.vue`
- Create: `src/views/SeedingSampleManagement/dialogs/SeedingDetailDialog.vue`
- Create: `src/views/SeedingSampleManagement/dialogs/SeedingEditNoteDialog.vue`
- Create: `src/views/SeedingSampleManagement/dialogs/SeedingEditSampleDialog.vue`
- Create: `src/views/SeedingSampleManagement/dialogs/SeedingDeleteDialog.vue`

- [ ] **Step 1: 创建目录**

```bash
mkdir -p src/views/SeedingSampleManagement/dialogs
```

- [ ] **Step 2: 读取原 dialog 文件**

读取 `src/views/SampleManagement/dialogs/` 下的所有 7 个 dialog 文件内容。

原文件列表：
- ApproveDialog.vue
- RejectDialog.vue
- ShipDialog.vue
- DetailDialog.vue
- EditNoteDialog.vue
- EditSampleDialog.vue
- DeleteDialog.vue

- [ ] **Step 3: 创建所有 Seeding*Dialog.vue 文件**

将每个 dialog 复制并修改：
1. 文件名前缀改为 `Seeding`
2. 组件名改为 `SeedingApproveDialog` 等
3. 导入路径调整（如有需要）

- [ ] **Step 4: Commit**

```bash
git add src/views/SeedingSampleManagement/dialogs/
git commit -m "feat: 创建寄样管理弹窗组件集"
```

---

## Task 7: Dashboard 菜单集成

**Files:**
- Modify: `src/views/Dashboard.vue`
- Modify: `src/api/index.js`

- [ ] **Step 1: 添加 API 注册**

确认 `src/api/index.js` 已有 `export * from './seedingSampleManagement'`

- [ ] **Step 2: 添加导入**

在 `Dashboard.vue` 的 import 区添加：
```javascript
import SeedingSampleManagement from './SeedingSampleManagement.vue'
```

- [ ] **Step 3: 修改菜单配置**

找到 `seeding` 场景的 `营销计划` 配置，添加子菜单：
```javascript
{ name: '营销计划', icon: icons.plan, children: [
  { name: '计划管理' },
  { name: '寄样管理' }  // 新增
]},
```

- [ ] **Step 4: 添加条件渲染**

在 Dashboard.vue 的主内容区，添加：
```vue
<SeedingSampleManagement v-else-if="activeSidebarMenu === '寄样管理' && currentScenario === 'seeding'" />
```

注意：需要确保 `SeedingSampleManagement` 的 import 放在 `SampleManagement` import 之后，避免命名冲突。

- [ ] **Step 5: Commit**

```bash
git add src/views/Dashboard.vue
git commit -m "feat: 集成寄样管理页面到Dashboard"
```

---

## 自检清单

**Spec Coverage:**
- [x] 主页面结构（复制自 SampleManagement）
- [x] 筛选区组件
- [x] 统计区组件
- [x] 列表区组件
- [x] 7个弹窗组件
- [x] API 模块（8个接口）
- [x] Dashboard 菜单集成（四级菜单）
- [x] 条件渲染

**Placeholder Scan:** 无 TBD/TODO/placeholder

**文件复制完整性:**
- [x] SampleManagement.vue → SeedingSampleManagement.vue
- [x] SampleFilterSection.vue → SeedingSampleFilterSection.vue
- [x] SampleStatsSection.vue → SeedingSampleStatsSection.vue
- [x] SampleListSection.vue → SeedingSampleListSection.vue
- [x] 7个 Dialog 文件 → Seeding*Dialog.vue

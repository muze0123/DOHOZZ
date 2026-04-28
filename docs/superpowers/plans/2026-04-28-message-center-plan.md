# 消息中心 (Message Center) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将消息中心页面按照 PRD v1.0 重新开发，实现通知消息与系统公告两大模块，包含分类筛选、消息列表、展开折叠、一键已读等完整交互。

**Architecture:** 基于 Vue 3 Composition API + `<script setup>` + Tailwind CSS。主页面 `MessageCenter.vue` 作为容器管理状态，子组件 `MsgTopBar.vue`、`FilterSection.vue`、`MsgItem.vue`、`NoticeItem.vue`、`WechatBindModal.vue`、`VersionUpgradeModal.vue` 等独立拆分。Mock 数据直接以内联方式提供。

**Tech Stack:** Vue 3, Tailwind CSS, Element Plus (仅分页组件复用), SCSS for any complex nested selectors

---

## File Structure

```
dohozz-saas/src/
  views/
    MessageCenter.vue                   # 主容器页面（重写）
    dialogs/
      WechatBindModal.vue               # 绑定公众号弹窗（新建）
      VersionUpgradeModal.vue           # 版本升级弹窗（新建）
  views/components/
    msg/
      MsgTopBar.vue                    # 顶部Tab栏（新建）
      FilterSection.vue                # 分类筛选区（新建）
      MsgList.vue                      # 消息列表容器（新建）
      MsgItem.vue                      # 通知消息行（新建）
      NoticeItem.vue                   # 系统公告行（新建）
      NoticeList.vue                   # 系统公告列表（新建）
      MsgPagination.vue                # 分页栏（新建）
  api/
    messageCenter.js                   # Mock API（新建）
```

---

## Task 1: 创建消息中心 Mock API

**Files:**
- Create: `dohozz-saas/src/api/messageCenter.js`

- [ ] **Step 1: 创建 Mock API 文件**

```javascript
// dohozz-saas/src/api/messageCenter.js

// 通知消息分类配置
export const EXCEPTION_TABS = [
  { key: 'all', label: '全部' },
  { key: 'logistics_exception', label: '寄样物流异常' },
  { key: 'sign_timeout', label: '签收超时未交付' },
  { key: 'coop_timeout', label: '合作单超时未交付' },
  { key: 'will_release', label: '达人即将释放公海' }
]

export const REMINDER_TABS = [
  { key: 'all', label: '全部' },
  { key: 'sample_deliver', label: '样品发货' },
  { key: 'sample_sign', label: '样品签收' },
  { key: 'sample_review', label: '样品审核' },
  { key: 'coop_review', label: '合作单审核' },
  { key: 'live_start', label: '直播开播' },
  { key: 'video_publish', label: '视频发布' },
  { key: 'influencer_assign', label: '达人分配' },
  { key: 'influencer_transfer', label: '达人转移' },
  { key: 'influencer_release', label: '达人释放公海' }
]

// 跳转路由映射
export const JUMP_ROUTE_MAP = {
  'influencer_assign': '/my-influencer?filter=assigned',
  'influencer_transfer': '/my-influencer?filter=transferred',
  'influencer_release': '/influencer-public-pool',
  'sample_deliver': '/seeding-sample?filter=delivered',
  'sample_sign': '/seeding-sample?filter=signed',
  'sample_review': '/seeding-sample?filter=review',
  'coop_review': '/cooperation?filter=review',
  'logistics_exception': '/seeding-sample?filter=exception',
  'sign_timeout': '/seeding-sample?filter=sign_timeout',
  'coop_timeout': '/cooperation?filter=overtime',
  'will_release': '/influencer-public-pool?filter=will_release',
  'live_start': '/collaboration-live',
  'video_publish': '/shopping-video'
}

// Mock 通知消息数据
export const mockNotifications = [
  {
    id: 'n001',
    title: '【达人分配】张三、李四、王五等10位抖音达人分配给你了，请及时跟进',
    category: 'reminder',
    subCategory: 'influencer_assign',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 14:00'
  },
  {
    id: 'n002',
    title: '【样品发货】达人「李小龙」购买的样品已发货，请注意查收',
    category: 'reminder',
    subCategory: 'sample_deliver',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 13:30'
  },
  {
    id: 'n003',
    title: '【样品审核】您提交的「春季新品」样品待审核，请准备样品',
    category: 'reminder',
    subCategory: 'sample_review',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 12:00'
  },
  {
    id: 'n004',
    title: '【寄样物流异常】达人「张小泉」收件地址无效，样品退回',
    category: 'exception',
    subCategory: 'logistics_exception',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 11:00'
  },
  {
    id: 'n005',
    title: '【签收超时未交付】达人「王小二」已签收样品15天未提交内容',
    category: 'exception',
    subCategory: 'sign_timeout',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-28 10:00'
  },
  {
    id: 'n006',
    title: '【合作单超时未交付】合作单「CO202604001」超时30天未交付视频',
    category: 'exception',
    subCategory: 'coop_timeout',
    platform: 'tiktok',
    isRead: true,
    createdAt: '2026-04-27 18:00'
  },
  {
    id: 'n007',
    title: '【达人转移】达人「赵六」从其他BD转移给你，请及时跟进',
    category: 'reminder',
    subCategory: 'influencer_transfer',
    platform: 'tiktok',
    isRead: true,
    createdAt: '2026-04-27 16:00'
  },
  {
    id: 'n008',
    title: '【直播开播】达人「孙七」直播间已开播，正在进行带货直播',
    category: 'reminder',
    subCategory: 'live_start',
    platform: 'tiktok',
    isRead: true,
    createdAt: '2026-04-27 15:00'
  },
  {
    id: 'n009',
    title: '【视频发布】达人「周八」已发布合作视频「春季穿搭」，请审核',
    category: 'reminder',
    subCategory: 'video_publish',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-27 14:00'
  },
  {
    id: 'n010',
    title: '【达人释放公海】达人「吴九」连续30天未跟进，即将释放公海',
    category: 'exception',
    subCategory: 'will_release',
    platform: 'tiktok',
    isRead: false,
    createdAt: '2026-04-27 12:00'
  }
]

// Mock 系统公告数据
export const mockAnnouncements = [
  {
    id: 'a001',
    title: '版本升级',
    content: `1、【达人管理】新增达人批量分配功能，支持批量转移达人给其他BD
2、【样品管理】优化样品审核流程，新增自动催发提醒
3、【数据看板】全新上线数据大屏，支持自定义配置指标
4、【消息中心】全新消息中心上线，支持分类筛选和一键已读
5、【合作管理】新增合作单评价功能，支持BD互相评分
6、【业绩管理】优化业绩统计逻辑，支持按时间段自定义查询
7、【系统优化】修复若干已知问题，提升系统稳定性`,
    isRead: false,
    createdAt: '2026-04-28 09:00'
  },
  {
    id: '“a002',
    title: '版本升级',
    content: `1、【达人管理】优化达人列表加载速度，支持虚拟滚动
2、【样品管理】新增样品图片水印功能，防止盗用`,
    isRead: true,
    createdAt: '2026-04-20 09:00'
  }
]

// 工具函数：计算各分类未读数
export function getExceptionBadgeMap(notifications) {
  const map = {}
  EXCEPTION_TABS.forEach(tab => {
    if (tab.key === 'all') {
      map[tab.key] = notifications.filter(n => n.category === 'exception' && !n.isRead).length
    } else {
      map[tab.key] = notifications.filter(n => n.subCategory === tab.key && !n.isRead).length
    }
  })
  return map
}

export function getReminderBadgeMap(notifications) {
  const map = {}
  REMINDER_TABS.forEach(tab => {
    if (tab.key === 'all') {
      map[tab.key] = notifications.filter(n => n.category === 'reminder' && !n.isRead).length
    } else {
      map[tab.key] = notifications.filter(n => n.subCategory === tab.key && !n.isRead).length
    }
  })
  return map
}
```

- [ ] **Step 2: Commit**

```bash
git add dohozz-saas/src/api/messageCenter.js
git commit -m "feat(message-center): add mock API with notification and announcement data"
```

---

## Task 2: 创建 MsgTopBar 顶部 Tab 栏组件

**Files:**
- Create: `dohozz-saas/src/views/components/msg/MsgTopBar.vue`

- [ ] **Step 1: 创建 MsgTopBar.vue**

```vue
<template>
  <header class="msg-top-bar">
    <div class="msg-tabs">
      <div
        class="msg-tab"
        :class="{ active: activeTab === 'notification' }"
        @click="$emit('update:activeTab', 'notification')"
      >
        消息通知
        <span v-if="notificationUnreadCount > 0" class="tab-badge">{{ notificationUnreadCount }}</span>
      </div>
      <div
        class="msg-tab"
        :class="{ active: activeTab === 'announcement' }"
        @click="$emit('update:activeTab', 'announcement')"
      >
        系统公告
        <span v-if="announcementUnreadCount > 0" class="tab-badge">{{ announcementUnreadCount }}</span>
      </div>
    </div>
    <div class="msg-top-right">
      <span class="wechat-bind-link" @click="$emit('openWechatBind')">绑定公众号，随时掌握达人动态 ></span>
      <button class="btn-msg-setting" @click="$emit('openMsgSettings')">消息设置</button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  activeTab: { type: String, default: 'notification' },
  notificationUnreadCount: { type: Number, default: 0 },
  announcementUnreadCount: { type: Number, default: 0 }
})

defineEmits(['update:activeTab', 'openWechatBind', 'openMsgSettings'])
</script>

<style scoped>
.msg-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.msg-tabs {
  display: flex;
  align-items: flex-end;
  height: 100%;
  gap: 32px;
}

.msg-tab {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #595959;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  padding-bottom: 1px;
  white-space: nowrap;
  transition: color 0.2s;
}

.msg-tab:hover { color: #1677FF; }
.msg-tab.active {
  color: #1677FF;
  font-weight: 600;
  border-bottom: 2px solid #1677FF;
}

.tab-badge {
  position: absolute;
  top: 8px;
  right: -14px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #FF4D4F;
  border-radius: 8px;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.msg-top-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.wechat-bind-link {
  font-size: 13px;
  color: #8C8C8C;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s;
}

.wechat-bind-link:hover { color: #1677FF; }

.btn-msg-setting {
  height: 30px;
  padding: 0 14px;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
}

.btn-msg-setting:hover {
  border-color: #1677FF;
  color: #1677FF;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add dohozz-saas/src/views/components/msg/MsgTopBar.vue
git commit -m "feat(message-center): add MsgTopBar component with tabs and badges"
```

---

## Task 3: 创建 FilterSection 分类筛选区组件

**Files:**
- Create: `dohozz-saas/src/views/components/msg/FilterSection.vue`

- [ ] **Step 1: 创建 FilterSection.vue**

```vue
<template>
  <div class="filter-section">
    <!-- 异常监控行 -->
    <div class="filter-row">
      <div class="filter-row-label">异常监控</div>
      <div class="filter-options">
        <div
          v-for="tab in exceptionTabs"
          :key="tab.key"
          class="filter-option"
          :class="{ active: selectedExceptionTab === tab.key }"
          @click="$emit('update:selectedExceptionTab', tab.key)"
        >
          {{ tab.label }}
          <span v-if="exceptionBadgeMap[tab.key] > 0" class="filter-badge">
            {{ exceptionBadgeMap[tab.key] }}
          </span>
        </div>
      </div>
    </div>
    <!-- 消息提醒行 -->
    <div class="filter-row">
      <div class="filter-row-label">消息提醒</div>
      <div class="filter-options">
        <div
          v-for="tab in reminderTabs"
          :key="tab.key"
          class="filter-option"
          :class="{ active: selectedReminderTab === tab.key }"
          @click="$emit('update:selectedReminderTab', tab.key)"
        >
          {{ tab.label }}
          <span v-if="reminderBadgeMap[tab.key] > 0" class="filter-badge">
            {{ reminderBadgeMap[tab.key] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EXCEPTION_TABS, REMINDER_TABS } from '@/api/messageCenter'

defineProps({
  selectedExceptionTab: { type: String, default: 'all' },
  selectedReminderTab: { type: String, default: 'all' },
  exceptionBadgeMap: { type: Object, default: () => ({}) },
  reminderBadgeMap: { type: Object, default: () => ({}) }
})

defineEmits(['update:selectedExceptionTab', 'update:selectedReminderTab'])

const exceptionTabs = EXCEPTION_TABS
const reminderTabs = REMINDER_TABS
</script>

<style scoped>
.filter-section {
  background: #fff;
  padding: 4px 24px 0;
  border-bottom: 1px solid #F0F0F0;
}

.filter-row {
  display: flex;
  align-items: center;
  height: 40px;
}

.filter-row-label {
  width: 56px;
  flex-shrink: 0;
  font-size: 13px;
  color: #8C8C8C;
  white-space: nowrap;
}

.filter-options {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.filter-option {
  position: relative;
  padding: 4px 0;
  margin-right: 24px;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
  white-space: nowrap;
}

.filter-option:hover { color: #1677FF; }

.filter-option.active {
  color: #1677FF;
  font-weight: 500;
  border-bottom: 2px solid #1677FF;
}

.filter-badge {
  position: absolute;
  top: -2px;
  right: -12px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  background: #FF4D4F;
  border-radius: 7px;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add dohozz-saas/src/views/components/msg/FilterSection.vue
git commit -m "feat(message-center): add FilterSection component with two filter rows"
```

---

## Task 4: 创建 NoticeFilterRow 系统公告筛选行

**Files:**
- Create: `dohozz-saas/src/views/components/msg/NoticeFilterRow.vue`

- [ ] **Step 1: 创建 NoticeFilterRow.vue**

```vue
<template>
  <div class="notice-filter-row">
    <span class="notice-filter-label">系统公告</span>
    <div class="notice-type-tag active">版本升级</div>
  </div>
</template>

<style scoped>
.notice-filter-row {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;
  gap: 16px;
}

.notice-filter-label {
  font-size: 13px;
  color: #8C8C8C;
}

.notice-type-tag {
  height: 24px;
  padding: 0 10px;
  background: #E6F4FF;
  border: 1px solid #91CAFF;
  border-radius: 4px;
  color: #1677FF;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add dohozz-saas/src/views/components/msg/NoticeFilterRow.vue
git commit -m "feat(message-center): add NoticeFilterRow for announcement tab"
```

---

## Task 5: 创建 MsgItem 通知消息行组件

**Files:**
- Create: `dohozz-saas/src/views/components/msg/MsgItem.vue`

- [ ] **Step 1: 创建 MsgItem.vue**

```vue
<template>
  <div
    class="msg-item"
    :class="{ read: item.isRead }"
    @click="handleClick"
  >
    <div class="msg-item-inner">
      <!-- 平台Logo -->
      <div class="msg-platform-logo">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v1.89a4.35 4.35 0 0 1-1.76 3.66c-2.15 1.65-4.67-.31-4.67-2.96 0-1.65 1.35-3.09 3.07-3.37V.06c-4.02.34-7.25 3.73-6.61 7.76 1.2 7.46 10.21 7.58 10.87.51.37-.3 1.17-.73 1.88-.84-.05.02-.09.04-.15.05-.08 0-.15-.01-.22-.01.04.13.07.27.09.41 1.34-.08 2.48-.87 2.89-2.02a4.23 4.23 0 0 1 3.08 3.04 3.93 3.93 0 0 1-.51.17h.01c-1.27.61-2.74.3-3.63-.71z"/>
        </svg>
      </div>
      <!-- 消息标签 -->
      <div class="msg-tag">消息</div>
      <!-- 消息正文 -->
      <div class="msg-body-text">{{ item.title }}</div>
      <!-- 发送时间 -->
      <div class="msg-time">{{ item.createdAt }}</div>
      <!-- 未读圆点 -->
      <div class="msg-unread-dot" v-if="!item.isRead"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { JUMP_ROUTE_MAP } from '@/api/messageCenter'

const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['markRead'])
const router = useRouter()

function handleClick() {
  if (!props.item.isRead) {
    emit('markRead', props.item.id)
  }
  if (props.item.subCategory && JUMP_ROUTE_MAP[props.item.subCategory]) {
    router.push(JUMP_ROUTE_MAP[props.item.subCategory])
  }
}
</script>

<style scoped>
.msg-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F5F5F5;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.msg-item:hover { background: #F8FBFF; }
.msg-item:last-child { border-bottom: none; }

.msg-item-inner {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.msg-platform-logo {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}

.msg-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 6px;
  background: #E6FFFB;
  border: 1px solid #87E8DE;
  border-radius: 3px;
  color: #13C2C2;
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
}

.msg-body-text {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #262626;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s;
}

.msg-item:hover .msg-body-text { color: #1677FF; }

.msg-item.read .msg-body-text { color: #8C8C8C; }

.msg-time {
  font-size: 12px;
  color: #8C8C8C;
  white-space: nowrap;
  flex-shrink: 0;
}

.msg-unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FA8C16;
  flex-shrink: 0;
}

.msg-item.read .msg-unread-dot { display: none; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add dohozz-saas/src/views/components/msg/MsgItem.vue
git commit -m "feat(message-center): add MsgItem component for notification rows"
```

---

## Task 6: 创建 NoticeItem 系统公告行组件

**Files:**
- Create: `dohozz-saas/src/views/components/msg/NoticeItem.vue`

- [ ] **Step 1: 创建 NoticeItem.vue**

```vue
<template>
  <div class="notice-item" :class="{ read: item.isRead }">
    <!-- 公告标签 -->
    <div class="notice-tag">公告</div>
    <!-- 公告内容 -->
    <div class="notice-body">
      <div
        class="notice-content"
        :class="{ expanded: isExpanded }"
      >{{ item.content }}</div>
      <div class="notice-expand-btn" @click="toggleExpand">
        {{ isExpanded ? '收起全部 >' : '展开全部 >' }}
      </div>
    </div>
    <!-- 右侧时间+状态 -->
    <div class="notice-item-right">
      <div class="notice-time">{{ item.createdAt }}</div>
      <div class="notice-unread-dot" v-if="!item.isRead"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['markRead'])
const isExpanded = ref(false)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
  if (!props.item.isRead) {
    emit('markRead', props.item.id)
  }
}
</script>

<style scoped>
.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 24px;
  border-bottom: 1px solid #F5F5F5;
  gap: 12px;
}

.notice-item:last-child { border-bottom: none; }

.notice-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 6px;
  background: #FFF7E6;
  border: 1px solid #FFD591;
  border-radius: 3px;
  color: #FA8C16;
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

.notice-body {
  flex: 1;
  min-width: 0;
}

.notice-content {
  font-size: 13px;
  color: #262626;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-content.expanded {
  display: block;
  overflow: visible;
  -webkit-line-clamp: unset;
}

.notice-expand-btn {
  display: inline-block;
  margin-top: 6px;
  font-size: 13px;
  color: #1677FF;
  cursor: pointer;
}

.notice-expand-btn:hover { color: #4096FF; }

.notice-item-right {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  padding-top: 2px;
}

.notice-time {
  font-size: 12px;
  color: #8C8C8C;
  white-space: nowrap;
}

.notice-unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FA8C16;
  flex-shrink: 0;
  margin-top: 4px;
}

.notice-item.read .notice-unread-dot { display: none; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add dohozz-saas/src/views/components/msg/NoticeItem.vue
git commit -m "feat(message-center): add NoticeItem component with expand/collapse"
```

---

## Task 7: 创建 MsgList 和 NoticeList 列表容器组件

**Files:**
- Create: `dohozz-saas/src/views/components/msg/MsgList.vue`
- Create: `dohozz-saas/src/views/components/msg/NoticeList.vue`

- [ ] **Step 1: 创建 MsgList.vue**

```vue
<template>
  <div class="msg-list">
    <div v-if="items.length > 0">
      <MsgItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @mark-read="$emit('markRead', $event)"
      />
    </div>
    <div v-else class="msg-empty">
      <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" class="msg-empty-icon">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
      </svg>
      <p>暂无消息</p>
    </div>
  </div>
</template>

<script setup>
import MsgItem from './MsgItem.vue'

defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['markRead'])
</script>

<style scoped>
.msg-list {
  background: #fff;
  padding: 0 24px;
}

.msg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #8C8C8C;
  font-size: 14px;
  gap: 12px;
}

.msg-empty-icon {
  opacity: 0.4;
}
</style>
```

- [ ] **Step 2: 创建 NoticeList.vue**

```vue
<template>
  <div class="notice-list">
    <div v-if="items.length > 0">
      <NoticeItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @mark-read="$emit('markRead', $event)"
      />
    </div>
    <div v-else class="notice-empty">
      <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" class="notice-empty-icon">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
      </svg>
      <p>暂无消息</p>
    </div>
  </div>
</template>

<script setup>
import NoticeItem from './NoticeItem.vue'

defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['markRead'])
</script>

<style scoped>
.notice-list {
  background: #fff;
}

.notice-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #8C8C8C;
  font-size: 14px;
  gap: 12px;
}

.notice-empty-icon {
  opacity: 0.4;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add dohozz-saas/src/views/components/msg/MsgList.vue dohozz-saas/src/views/components/msg/NoticeList.vue
git commit -m "feat(message-center): add MsgList and NoticeList container components"
```

---

## Task 8: 创建 MsgPagination 分页栏组件

**Files:**
- Create: `dohozz-saas/src/views/components/msg/MsgPagination.vue`

- [ ] **Step 1: 创建 MsgPagination.vue**

```vue
<template>
  <div class="msg-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ElPagination } from 'element-plus'

const props = defineProps({
  total: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'change'])

const currentPage = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

const pageSize = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

function handleSizeChange() {
  emit('change', { page: 1, pageSize: props.pageSize })
}

function handleCurrentChange() {
  emit('change', { page: props.currentPage, pageSize: props.pageSize })
}
</script>

<style scoped>
.msg-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  gap: 8px;
  background: #fff;
  border-top: 1px solid #F0F0F0;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add dohozz-saas/src/views/components/msg/MsgPagination.vue
git commit -m "feat(message-center): add MsgPagination component"
```

---

## Task 9: 创建 WechatBindModal 和 VersionUpgradeModal 弹窗组件

**Files:**
- Create: `dohozz-saas/src/views/dialogs/WechatBindModal.vue`
- Create: `dohozz-saas/src/views/dialogs/VersionUpgradeModal.vue`

- [ ] **Step 1: 创建 WechatBindModal.vue**

```vue
<template>
  <el-dialog
    :model-value="visible"
    title="微信提醒设置"
    width="340px"
    @close="$emit('update:visible', false)"
  >
    <div class="wechat-modal">
      <div class="wechat-qrcode">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <rect width="120" height="120" fill="#f5f5f5"/>
          <text x="60" y="65" text-anchor="middle" font-size="12" fill="#8c8c8c">DOHOZZ</text>
        </svg>
      </div>
      <p class="wechat-scan-tip">请用微信"扫一扫"</p>
      <p class="wechat-scan-tip">微信扫码关注"DOHOZZ"微信公众号</p>
      <div class="wechat-benefits">
        <div class="wechat-benefit-item">达人释放、达人交付等消息通知</div>
        <div class="wechat-benefit-item">达人爆单、跟进异常等消息通知</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElDialog } from 'element-plus'

defineProps({
  visible: { type: Boolean, default: false }
})

defineEmits(['update:visible'])
</script>

<style scoped>
.wechat-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.wechat-qrcode {
  width: 120px;
  height: 120px;
  border: 1px solid #F0F0F0;
  border-radius: 4px;
  overflow: hidden;
}

.wechat-scan-tip {
  font-size: 13px;
  color: #595959;
  text-align: center;
  margin: 0;
}

.wechat-benefits {
  font-size: 12px;
  color: #595959;
  line-height: 2;
  text-align: left;
  width: 100%;
}

.wechat-benefit-item::before {
  content: '✓ ';
  color: #52C41A;
}
</style>
```

- [ ] **Step 2: 创建 VersionUpgradeModal.vue**

```vue
<template>
  <el-dialog
    :model-value="visible"
    title="产品动态"
    width="480px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="version-modal-content">
      <div v-for="(line, idx) in contentLines" :key="idx" class="version-line">
        {{ line }}
      </div>
    </div>
    <template #footer>
      <div class="version-modal-footer">
        <button class="btn-know" @click="handleClose">我知道了</button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { ElDialog } from 'element-plus'

const props = defineProps({
  visible: { type: Boolean, default: false },
  content: { type: String, default: '' }
})

const emit = defineEmits(['update:visible', 'close'])

const contentLines = computed(() => {
  return props.content.split('\n').filter(line => line.trim())
})

function handleClose() {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
.version-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  font-size: 13px;
  color: #262626;
  line-height: 2;
}

.version-line {
  margin-bottom: 4px;
}

.version-modal-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #F0F0F0;
}

.btn-know {
  width: 100px;
  height: 32px;
  background: #1677FF;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.btn-know:hover {
  background: #4096FF;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add dohozz-saas/src/views/dialogs/WechatBindModal.vue dohozz-saas/src/views/dialogs/VersionUpgradeModal.vue
git commit -m "feat(message-center): add WechatBindModal and VersionUpgradeModal dialogs"
```

---

## Task 10: 重写 MessageCenter.vue 主页面

**Files:**
- Modify: `dohozz-saas/src/views/MessageCenter.vue`

- [ ] **Step 1: 重写 MessageCenter.vue**

```vue
<template>
  <div class="message-center">
    <!-- 顶部 Tab 栏 -->
    <MsgTopBar
      :active-tab="activeTab"
      :notification-unread-count="notificationUnreadCount"
      :announcement-unread-count="announcementUnreadCount"
      @update:active-tab="handleTabChange"
      @open-wechat-bind="showWechatBindModal = true"
      @open-msg-settings="handleMsgSettings"
    />

    <!-- 分类筛选区 -->
    <FilterSection
      v-if="activeTab === 'notification'"
      v-model:selected-exception-tab="filterState.exceptionTab"
      v-model:selected-reminder-tab="filterState.reminderTab"
      :exception-badge-map="exceptionBadgeMap"
      :reminder-badge-map="reminderBadgeMap"
    />
    <NoticeFilterRow v-else />

    <!-- 消息列表标题栏 -->
    <div class="msg-list-header">
      <div>
        <span class="msg-list-title">{{ activeTab === 'notification' ? '消息列表' : '系统公告' }}</span>
        <span class="msg-list-count">共计 {{ displayList.length }} 条消息</span>
      </div>
      <div class="msg-list-right" v-if="activeTab === 'notification'">
        <label class="unread-only-checkbox">
          <input type="checkbox" v-model="filterState.unreadOnly" />
          只看未读消息
        </label>
        <button
          v-if="currentUnreadCount > 0"
          class="btn-mark-all-read"
          @click="handleMarkAllRead"
        >
          一键已读({{ currentUnreadCount }})
        </button>
      </div>
    </div>

    <!-- 消息列表 -->
    <MsgList
      v-if="activeTab === 'notification'"
      :items="displayList"
      @mark-read="handleMarkRead"
    />
    <NoticeList
      v-else
      :items="displayList"
      @mark-read="handleMarkRead"
    />

    <!-- 分页栏 -->
    <MsgPagination
      v-if="activeTab === 'notification'"
      :total="filteredNotifications.length"
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      @change="handlePageChange"
    />

    <!-- 绑定公众号弹窗 -->
    <WechatBindModal v-model:visible="showWechatBindModal" />

    <!-- 版本升级弹窗 -->
    <VersionUpgradeModal
      v-model:visible="showVersionModal"
      :content="latestAnnouncementContent"
      @close="handleVersionModalClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MsgTopBar from './components/msg/MsgTopBar.vue'
import FilterSection from './components/msg/FilterSection.vue'
import NoticeFilterRow from './components/msg/NoticeFilterRow.vue'
import MsgList from './components/msg/MsgList.vue'
import NoticeList from './components/msg/NoticeList.vue'
import MsgPagination from './components/msg/MsgPagination.vue'
import WechatBindModal from './dialogs/WechatBindModal.vue'
import VersionUpgradeModal from './dialogs/VersionUpgradeModal.vue'
import {
  mockNotifications,
  mockAnnouncements,
  getExceptionBadgeMap,
  getReminderBadgeMap
} from '@/api/messageCenter'

const router = useRouter()

// 状态
const activeTab = ref('notification')
const filterState = ref({
  exceptionTab: 'all',
  reminderTab: 'all',
  unreadOnly: false
})
const pagination = ref({ page: 1, pageSize: 10 })
const showWechatBindModal = ref(false)
const showVersionModal = ref(false)

// 数据
const notifications = ref([...mockNotifications])
const announcements = ref([...mockAnnouncements])

// 计算属性
const notificationUnreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
const announcementUnreadCount = computed(() => announcements.value.filter(a => !a.isRead).length)

const exceptionBadgeMap = computed(() => getExceptionBadgeMap(notifications.value))
const reminderBadgeMap = computed(() => getReminderBadgeMap(notifications.value))

const filteredNotifications = computed(() => {
  let result = notifications.value

  // 异常监控筛选
  if (filterState.value.exceptionTab !== 'all') {
    result = result.filter(n => n.category === 'exception' && n.subCategory === filterState.value.exceptionTab)
  }

  // 消息提醒筛选
  if (filterState.value.reminderTab !== 'all') {
    const reminderFiltered = notifications.value.filter(n => n.category === 'reminder' && n.subCategory === filterState.value.reminderTab)
    if (filterState.value.exceptionTab === 'all') {
      result = reminderFiltered
    } else {
      // 并集：两个分类都选了，合并结果
      result = [...result, ...reminderFiltered]
    }
  }

  // 只看未读
  if (filterState.value.unreadOnly) {
    result = result.filter(n => !n.isRead)
  }

  return result
})

const displayList = computed(() => {
  if (activeTab.value === 'notification') {
    const start = (pagination.value.page - 1) * pagination.value.pageSize
    return filteredNotifications.value.slice(start, start + pagination.value.pageSize)
  }
  return announcements.value
})

const currentUnreadCount = computed(() => {
  if (activeTab.value === 'notification') {
    return filteredNotifications.value.filter(n => !n.isRead).length
  }
  return 0
})

const latestAnnouncementContent = computed(() => {
  const latest = announcements.value.find(a => a.title === '版本升级' && !a.isRead)
  return latest ? latest.content : ''
})

// 方法
function handleTabChange(tab) {
  activeTab.value = tab
  filterState.value = { exceptionTab: 'all', reminderTab: 'all', unreadOnly: false }
  pagination.value.page = 1
}

function handleMarkRead(id) {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) { notif.isRead = true; return }
  const ann = announcements.value.find(a => a.id === id)
  if (ann) { ann.isRead = true }
}

function handleMarkAllRead() {
  filteredNotifications.value.forEach(n => { n.isRead = true })
}

function handlePageChange() {}

function handleMsgSettings() {
  router.push('/message-settings')
}

function handleVersionModalClose() {
  activeTab.value = 'announcement'
  const latest = announcements.value.find(a => a.title === '版本升级' && !a.isRead)
  if (latest) { latest.isRead = true }
}

onMounted(() => {
  const hasSeenVersion = localStorage.getItem('hasSeenVersionPopup_v2')
  if (!hasSeenVersion && latestAnnouncementContent.value) {
    setTimeout(() => {
      showVersionModal.value = true
      localStorage.setItem('hasSeenVersionPopup_v2', 'true')
    }, 500)
  }
})
</script>

<style lang="scss" scoped>
.message-center {
  min-height: 100vh;
  background: #F5F6F7;
}

.msg-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;
}

.msg-list-title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
}

.msg-list-count {
  font-size: 13px;
  color: #8C8C8C;
  margin-left: 8px;
}

.msg-list-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.unread-only-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
}

.unread-only-checkbox input[type='checkbox'] {
  accent-color: #1677FF;
  width: 14px;
  height: 14px;
}

.btn-mark-all-read {
  height: 30px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid #1677FF;
  border-radius: 4px;
  color: #1677FF;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-mark-all-read:hover {
  background: #E6F4FF;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add dohozz-saas/src/views/MessageCenter.vue
git commit -m "feat(message-center): rewrite MessageCenter.vue with full PRD implementation"
```

---

## Task 11: 构建验证

- [ ] **Step 1: 运行构建验证**

```bash
cd /Users/zhangbin/Documents/DOHOZZ/dohozz-saas && npm run build 2>&1 | head -50
```

- [ ] **Step 2: 确认构建成功**

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(message-center): complete MessageCenter feature with all sub-components"
```

---

## Self-Review Checklist

- [x] Spec 覆盖检查：所有 PRD 章节（顶部Tab栏、分类筛选、消息列表、公告列表、分页、弹窗）均有对应 Task
- [x] Placeholder 扫描：无 TBD/TODO/placeholder 代码
- [x] 类型一致性：FilterState、JUMP_ROUTE_MAP、badgeMap 等类型在 Task 间保持一致
- [x] 组件拆分：MsgItem、NoticeItem、MsgList、NoticeList 等独立组件边界清晰
- [x] Mock 数据：notification 和 announcement 完整，未读数配置合理

---

## 执行方式

**Plan complete and saved to `docs/superpowers/plans/2026-04-28-message-center-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**

# 消息中心 (Message Center) — 设计规格书

**版本**: v1.0
**日期**: 2026-04-28
**状态**: 已批准

---

## 1. 页面概述

消息中心是 DOHOZZ 平台的全局独立页面，汇聚平台内所有系统通知与公告，帮助 BD 及时感知达人动态、样品审批、合作单状态等关键业务事件。

**两大主模块：**
- **消息通知**：业务类消息（异常监控 + 消息提醒两维度分类）
- **系统公告**：版本升级等平台级公告

---

## 2. 页面布局

```
┌───────────────────────────────────────────────────────────────────┐
│  顶部 Tab 栏（左：消息通知 / 系统公告  右：公众号入口 + 消息设置）│  48px
├───────────────────────────────────────────────────────────────────┤
│  分类筛选区（仅消息通知 Tab 下显示，两行）                        │  ~80px
├───────────────────────────────────────────────────────────────────┤
│  消息列表标题栏（左：标题+总数  右：只看未读 + 一键已读）          │  52px
├───────────────────────────────────────────────────────────────────┤
│  消息列表（可滚动）                                               │
├───────────────────────────────────────────────────────────────────┤
│  分页栏（消息通知 Tab 下）                                        │  52px
└───────────────────────────────────────────────────────────────────┘
```

- 页面背景色：`#F5F6F7`
- 内容主体区域背景：`#FFFFFF`
- 内容区宽度 `100%`，左右 `padding: 0 24px`

---

## 3. 组件结构

| 组件 | 文件路径 | 职责 |
|------|---------|------|
| `MessageCenter.vue` | `views/MessageCenter.vue` | 主容器，管理 Tab 状态、筛选条件、消息数据 |
| `WechatBindModal.vue` | `views/dialogs/WechatBindModal.vue` | 绑定公众号弹窗 |
| `VersionUpgradeModal.vue` | `views/dialogs/VersionUpgradeModal.vue` | 版本升级弹窗 |
| `MsgItem.vue` | `views/components/msg/MsgItem.vue` | 单条通知消息行 |
| `NoticeItem.vue` | `views/components/msg/NoticeItem.vue` | 单条系统公告行（可折叠） |

---

## 4. 顶部 Tab 栏

### 4.1 布局

水平 flex 布局，`justify-content: space-between`，高度 `48px`，底部 `border-bottom: 1px solid #F0F0F0`，背景 `#FFFFFF`，`position: sticky`。

- **左侧**：消息通知 Tab + 系统公告 Tab，间距 `32px`
- **右侧**：「绑定公众号，随时掌握达人动态 >」文字链接 + 【消息设置】按钮

### 4.2 Tab 样式

```css
.msg-tab {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #595959;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s;
}
.msg-tab:hover { color: #1677FF; }
.msg-tab.active { color: #1677FF; font-weight: 600; border-bottom: 2px solid #1677FF; }
```

### 4.3 Tab 角标（红色徽标）

```css
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
}
```

### 4.4 右侧操作区

```css
.wechat-bind-link { font-size: 13px; color: #8C8C8C; cursor: pointer; }
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
}
.btn-msg-setting:hover { border-color: #1677FF; color: #1677FF; }
```

---

## 5. 分类筛选区（消息通知 Tab 专属）

### 5.1 布局

固定两行，每行左侧为分类标签名（`56px` 固定宽度），右侧为横向滚动的分类选项。

```css
.filter-section { background: #fff; padding: 4px 24px 0; border-bottom: 1px solid #F0F0F0; }
.filter-row { display: flex; align-items: center; height: 40px; }
.filter-row-label { width: 56px; flex-shrink: 0; font-size: 13px; color: #8C8C8C; }
.filter-options { display: flex; align-items: center; flex: 1; overflow: hidden; }
```

### 5.2 第一行：异常监控

```
异常监控   全部   寄样物流异常   签收超时未交付   合作单超时未交付   达人即将释放公海
```

### 5.3 第二行：消息提醒

```
消息提醒   全部⁹   样品发货¹   样品签收   样品审核²   合作单审核   直播开播   视频发布   达人分配   达人转移   达人释放公海⁶
```

### 5.4 分类选项样式

```css
.filter-option {
  position: relative;
  padding: 4px 0;
  margin-right: 24px;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
}
.filter-option:hover { color: #1677FF; }
.filter-option.active { color: #1677FF; font-weight: 500; border-bottom: 2px solid #1677FF; }
```

**未读数角标：**
```css
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
```

### 5.5 筛选交互规则

| 操作 | 行为 |
|------|------|
| 点击某分类选项 | 激活该选项（蓝色下划线）；该行其他选项取消激活 |
| 点击「全部」| 激活「全部」选项 |
| 两行筛选关系 | 各自独立单选；最终列表取两行选中条件的并集 |
| 分类下无未读消息 | 角标不显示 |

---

## 6. 系统公告 Tab 的分类筛选区

系统公告 Tab 下只有一行，默认选中「版本升级」：

```css
.notice-filter-row { display: flex; align-items: center; height: 40px; padding: 0 24px; background: #fff; border-bottom: 1px solid #F0F0F0; gap: 16px; }
.notice-type-tag {
  height: 24px;
  padding: 0 10px;
  background: #E6F4FF;
  border: 1px solid #91CAFF;
  border-radius: 4px;
  color: #1677FF;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
```

---

## 7. 消息列表标题栏

```css
.msg-list-header { display: flex; align-items: center; justify-content: space-between; height: 52px; padding: 0 24px; background: #fff; border-bottom: 1px solid #F0F0F0; }
.msg-list-title { font-size: 15px; font-weight: 600; color: #262626; }
.msg-list-count { font-size: 13px; color: #8C8C8C; margin-left: 8px; }
.msg-list-right { display: flex; align-items: center; gap: 16px; }
.unread-only-checkbox { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #595959; cursor: pointer; }
.unread-only-checkbox input[type='checkbox'] { accent-color: #1677FF; width: 14px; height: 14px; }
.btn-mark-all-read {
  height: 30px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid #1677FF;
  border-radius: 4px;
  color: #1677FF;
  font-size: 13px;
  cursor: pointer;
}
.btn-mark-all-read:hover { background: #E6F4FF; }
```

### 「只看未读」交互

勾选后，列表过滤为只展示未读消息；消息总数更新为未读数。可与分类筛选叠加（AND 关系）。

### 「一键已读」交互

- 当前列表有未读消息时显示 `【一键已读(N)】`，N = 当前列表未读数量
- 全部已读后按钮不展示

---

## 8. 消息通知 — 消息列表

### 8.1 列表容器

```css
.msg-list { background: #fff; padding: 0 24px; }
.msg-item { display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #F5F5F5; gap: 10px; cursor: pointer; transition: background 0.15s; }
.msg-item:hover { background: #F8FBFF; }
.msg-item:last-child { border-bottom: none; }
```

### 8.2 消息行内部结构

```
[平台Logo 20×20] [消息标签] [消息正文 flex:1] .............. [发送时间] [未读圆点●]
```

- **平台 Logo**：TikTok 黑底白图标，16×16 实际尺寸，外层容器 20×20，`border-radius: 4px`
- **「消息」标签**：背景 `#E6FFFB`，边框 `#87E8DE`，字色 `#13C2C2`，圆角 3px，`padding: 0 6px`，高 20px，字号 11px
- **消息正文**：字号 13px，颜色 `#262626`（未读）/ `#8C8C8C`（已读），单行截断
- **发送时间**：字号 12px，颜色 `#8C8C8C`，格式 `2025-08-08 17:00`
- **未读圆点**：橙色 `#FA8C16`，直径 8px，圆形

### 8.3 已读 vs 未读

| 属性 | 未读 | 已读 |
|------|------|------|
| 正文颜色 | `#262626` | `#8C8C8C` |
| 右侧圆点 | 显示橙色圆点 | 不显示 |

### 8.4 消息点击行为

点击消息内容区 → 标记该消息为已读 → 跳转至该消息所属功能页面（router.push）

---

## 9. 系统公告 — 消息列表

### 9.1 公告行内部结构

```
[公告标签]  [公告内容（多行，默认折叠3行）]  .....  [发送时间] [未读圆点●]
                展开全部 >
```

```css
.notice-item { display: flex; align-items: flex-start; padding: 16px 24px; border-bottom: 1px solid #F5F5F5; gap: 12px; }
.notice-item:last-child { border-bottom: none; }
```

### 9.2 「公告」标签

背景 `#FFF7E6`，边框 `#FFD591`，字色 `#FA8C16`，圆角 3px，字号 11px。

### 9.3 公告内容区（可折叠）

```css
.notice-content {
  font-size: 13px;
  color: #262626;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.notice-content.expanded { display: block; overflow: visible; }
.notice-expand-btn { display: inline-block; margin-top: 6px; font-size: 13px; color: #1677FF; cursor: pointer; }
.notice-expand-btn:hover { color: #4096FF; }
```

**展开/收起交互：**

| 操作 | 行为 |
|------|------|
| 默认状态 | 展示前 3 行内容，末尾显示「展开全部 >」 |
| 点击「展开全部 >」| 展示全部内容；按钮文字变为「收起全部 >」；该消息标记为已读 |
| 点击「收起全部 >」| 折叠回前 3 行 |

---

## 10. 无数据状态

```css
.msg-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; color: #8C8C8C; font-size: 14px; gap: 12px; }
```

文案：「暂无消息」

---

## 11. 分页栏（消息通知 Tab 下）

```
[ < ] [1] [2] [3] [4] [5] [...] [43] [ > ]   10条/页▼   跳至 [5] 页   共40条记录 第1/8页
```

- 水平居中布局，`padding: 12px 24px`，背景 `#FFFFFF`，顶部 `border-top: 1px solid #F0F0F0`
- 系统公告 Tab **不需要分页**，直接全量展示

---

## 12. 绑定公众号弹窗

```css
.wechat-modal { width: 340px; padding: 24px; background: #fff; border-radius: 8px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); display: flex; flex-direction: column; align-items: center; gap: 16px; }
.wechat-qrcode { width: 120px; height: 120px; border: 1px solid #F0F0F0; border-radius: 4px; }
```

- 点击顶部右侧「绑定公众号」链接触发
- 内容：DOHOZZ 公众号二维码 + 「请用微信扫一扫」+ 绑定权益列表

---

## 13. 版本升级弹窗

- 触发时机：用户登录时自动弹出（仅首次）
- 关闭后自动跳转至「系统公告」Tab

```css
.version-modal { width: 480px; max-height: 600px; background: #fff; border-radius: 8px; box-shadow: 0 6px 24px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; }
.version-modal-title { padding: 16px 20px; font-size: 15px; font-weight: 600; color: #262626; border-bottom: 1px solid #F0F0F0; }
.version-modal-content { flex: 1; overflow-y: auto; padding: 16px 20px; font-size: 13px; color: #262626; line-height: 2; }
.version-modal-footer { padding: 12px 20px; display: flex; justify-content: center; border-top: 1px solid #F0F0F0; }
.btn-know { width: 100px; height: 32px; background: #1677FF; border: none; border-radius: 4px; color: #fff; font-size: 13px; cursor: pointer; }
```

---

## 14. 数据模型

```typescript
interface NotificationItem {
  id: string
  title: string                           // e.g. "【达人分配】XXXX等10位抖音达人分配给你了"
  category: 'exception' | 'reminder'      // 大分类
  subCategory: string                     // e.g. "达人分配", "样品发货", "寄样物流异常"
  platform: 'tiktok' | 'douyin' | 'kuaishou' | 'all'
  isRead: boolean
  createdAt: string                       // "2025-08-08 17:00"
  jumpRoute?: string                       // 跳转路由
}

interface AnnouncementItem {
  id: string
  title: string                           // "版本升级"
  content: string                          // 多行内容，支持折叠
  isRead: boolean
  createdAt: string
}

interface FilterState {
  exceptionTab: string    // 'all' | 'logistics_exception' | 'sign_timeout' | 'coop_timeout' | 'will_release'
  reminderTab: string     // 'all' | 'sample_deliver' | 'sample_sign' | 'sample_review' | 'coop_review' | 'live_start' | 'video_publish' | 'influencer_assign' | 'influencer_transfer' | 'influencer_release'
  unreadOnly: boolean
}
```

### 消息跳转路由配置

| subCategory | jumpRoute |
|-------------|-----------|
| 达人分配 | `/my-influencer?filter=assigned` |
| 达人转移 | `/my-influencer?filter=transferred` |
| 达人释放公海 | `/influencer-public-pool` |
| 样品发货 | `/seeding-sample?filter=delivered` |
| 样品签收 | `/seeding-sample?filter=signed` |
| 样品审核 | `/seeding-sample?filter=review` |
| 合作单审核 | `/cooperation?filter=review` |
| 寄样物流异常 | `/seeding-sample?filter=exception` |
| 合作单超时未交付 | `/cooperation?filter=overtime` |
| 签收超时未交付 | `/seeding-sample?filter=sign_timeout` |
| 达人即将释放公海 | `/influencer-public-pool?filter=will_release` |
| 直播开播 | `/collaboration-live` |
| 视频发布 | `/shopping-video` |

---

## 15. 状态联动规则

| 操作 | 联动更新 |
|------|---------|
| 点击单条消息 | 该条消息标为已读 → 圆点消失 → 对应分类角标 -1 → Tab 角标 -1 |
| 点击「一键已读」| 当前筛选列表所有未读消息标为已读 → 所有圆点消失 → 按钮隐藏 → 角标清零 |
| 点击展开公告 | 公告标为已读 → 圆点消失 → Tab 角标 -1 |
| Tab 切换 | 分类筛选区切换；消息列表刷新；「只看未读」复选框重置为未勾选；页码重置回第 1 页 |

---

## 16. 颜色规范

| Token | 色值 | 用途 |
|-------|------|------|
| Primary Blue | `#1677FF` | Tab 激活、链接、按钮 |
| Light Blue BG | `#E6F4FF` | 公告类型激活标签背景 |
| 消息 Tag BG | `#E6FFFB` | 「消息」标签背景 |
| 消息 Tag Border | `#87E8DE` | 「消息」标签边框 |
| 消息 Tag Text | `#13C2C2` | 「消息」标签字色 |
| 公告 Tag BG | `#FFF7E6` | 「公告」标签背景 |
| 公告 Tag Border | `#FFD591` | 「公告」标签边框 |
| 公告 Tag Text | `#FA8C16` | 「公告」标签字色 |
| Unread Dot | `#FA8C16` | 未读橙色圆点 |
| Badge Red | `#FF4D4F` | Tab/分类未读角标 |
| Text Primary | `#262626` | 未读消息正文 |
| Text Read | `#8C8C8C` | 已读消息正文 |
| Border | `#F5F5F5` | 消息行分割线 |

---

## 17. 变更记录

| 版本 | 日期 | 修改说明 |
|------|------|---------|
| v1.0 | 2026-04-28 | 基于 Axure RP 原型 + 两张截图标注全量解析输出 |

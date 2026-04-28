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
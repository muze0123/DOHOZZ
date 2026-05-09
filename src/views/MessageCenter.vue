<template>
  <div class="message-center">
    <!-- 顶部 Tab + 筛选区 -->
    <div class="notice-header">
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
    </div>

    <!-- 消息列表内容区 -->
    <div class="msg-content">
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
    </div>

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
import { useRouter, useRoute } from 'vue-router'
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
const route = useRoute()

// 状态
const activeTab = ref('notification')
const filterState = ref({
  exceptionTab: '',
  reminderTab: '',
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
  if (filterState.value.exceptionTab) {
    result = result.filter(n => n.category === 'exception' && n.subCategory === filterState.value.exceptionTab)
  }

  // 消息提醒筛选
  if (filterState.value.reminderTab) {
    const reminderFiltered = notifications.value.filter(n => n.category === 'reminder' && n.subCategory === filterState.value.reminderTab)
    if (!filterState.value.exceptionTab) {
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
  filterState.value = { exceptionTab: '', reminderTab: '', unreadOnly: false }
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
  // 从 URL query 参数读取初始 tab
  const tabParam = route.query.tab
  if (tabParam === 'notification' || tabParam === 'announcement') {
    activeTab.value = tabParam
  }

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
  width: 1200px;
  height: auto;
  margin: 0 auto;
  border-radius: 12px;
  padding: 0;
  background: transparent;
}

.notice-header {
  border-radius: 12px;
  overflow: hidden;
}

.msg-content {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.msg-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 63px;
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
  height: 32px;
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
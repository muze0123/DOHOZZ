<template>
  <div class="message-center">
    <!-- 消息中心顶部导航 -->
    <header class="msg-top-bar">
      <div class="msg-tabs">
        <div
          class="msg-tab"
          :class="{ active: activeTab === 'notification' }"
          @click="activeTab = 'notification'"
        >
          通知消息
          <span v-if="notificationUnreadCount > 0" class="msg-badge">{{ notificationUnreadCount }}</span>
        </div>
        <div
          class="msg-tab"
          :class="{ active: activeTab === 'announcement' }"
          @click="activeTab = 'announcement'"
        >
          系统公告
          <span v-if="announcementUnreadCount > 0" class="msg-badge">{{ announcementUnreadCount }}</span>
        </div>
      </div>
      <div class="msg-actions">
        <button class="action-btn" @click="handleMarkAllRead">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          全部已读
        </button>
        <button class="action-btn primary" @click="handleExport">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          导出
        </button>
      </div>
    </header>

    <!-- 消息内容区 -->
    <main class="msg-content">
      <!-- 通知消息 -->
      <div v-if="activeTab === 'notification'" class="msg-section">
        <!-- 搜索栏 -->
        <div class="msg-search">
          <div class="search-input">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索消息内容"
              class="search-field"
            />
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="msg-list">
          <div
            v-for="item in filteredNotifications"
            :key="item.id"
            class="msg-item"
            :class="{ unread: !item.isRead }"
            @click="handleNotificationClick(item)"
          >
            <div class="msg-item-header">
              <div class="msg-item-title">{{ item.title }}</div>
              <div class="msg-item-time">{{ item.time }}</div>
            </div>
            <div class="msg-item-content">{{ item.content }}</div>
            <div class="msg-item-footer">
              <span class="msg-item-type">{{ item.type }}</span>
              <button class="msg-item-action" @click.stop="handleMarkAsRead(item.id)">
                {{ item.isRead ? '已读' : '标记已读' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredNotifications.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
          </svg>
          <p>暂无通知消息</p>
        </div>

        <!-- 分页 -->
        <div v-if="filteredNotifications.length > 0" class="msg-pagination">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredNotifications.length"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>

      <!-- 系统公告 -->
      <div v-else-if="activeTab === 'announcement'" class="msg-section">
        <!-- 公告列表 -->
        <div class="announcement-list">
          <div
            v-for="item in announcements"
            :key="item.id"
            class="announcement-item"
            :class="{ unread: !item.isRead }"
            @click="handleAnnouncementClick(item)"
          >
            <div class="announcement-item-header">
              <div class="announcement-item-title">{{ item.title }}</div>
              <div class="announcement-item-time">{{ item.time }}</div>
            </div>
            <div class="announcement-item-content">{{ item.content }}</div>
            <div class="announcement-item-footer">
              <span class="announcement-item-author">{{ item.author }}</span>
              <button class="announcement-item-action" @click.stop="handleMarkAsRead(item.id)">
                {{ item.isRead ? '已读' : '标记已读' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="announcements.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h5v5H7z"/>
          </svg>
          <p>暂无系统公告</p>
        </div>

        <!-- 分页 -->
        <div v-if="announcements.length > 0" class="msg-pagination">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="announcements.length"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </main>

    <!-- 版本升级弹窗 -->
    <el-dialog
      v-model="showVersionModal"
      title="版本升级通知"
      width="400px"
      @close="handleVersionModalClose"
    >
      <div class="version-modal-content">
        <div class="version-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>
        <h3>DOHOZZ 系统已升级至 v2.0.0</h3>
        <p class="version-desc">本次更新带来了全新的用户界面和更多实用功能，提升您的使用体验。</p>
        <div class="version-features">
          <h4>新功能：</h4>
          <ul>
            <li>全新的消息中心，支持通知分类管理</li>
            <li>优化的达人管理界面，操作更便捷</li>
            <li>新增数据报表功能，数据可视化更直观</li>
            <li>支持多语言切换，满足国际化需求</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleVersionModalClose">我知道了</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { ElMessage, ElPagination, ElDialog, ElButton } from 'element-plus'
import { User } from '@element-plus/icons-vue'

const navigateToMenu = inject('navigateToMenu', null)

// 顶部导航栏相关
const UserIcon = User
const currentScenario = ref('ecommerce')
const currentLanguage = ref('中文')
const activeNavMenu = ref('')
const showTaskCenter = ref(false)

// 业务场景切换
function handleScenarioChange(scenario) {
  currentScenario.value = scenario
}

// 语言切换
function handleLanguageChange(lang) {
  currentLanguage.value = lang
  ElMessage.success(`已切换至${lang}`)
}

// 消息中心切换
function handleMessageCenterClick() {
  // 消息中心页面不需要跳转
}

// 任务中心切换
function handleTaskCenterClick() {
  showTaskCenter.value = true
}

// 导航菜单
const currentNavMenus = computed(() => {
  return []
})

// 总未读消息数
const totalUnreadCount = computed(() => {
  return notificationUnreadCount.value + announcementUnreadCount.value
})

// 激活的标签页
const activeTab = ref('notification')

// 搜索关键词
const searchKeyword = ref('')

// 分页信息
const pagination = ref({
  page: 1,
  pageSize: 10
})

// 通知消息数据
const notifications = ref([
  {
    id: 1,
    title: '达人合作邀请',
    content: '达人「张三」已接受您的合作邀请，请注意查看详情。',
    time: '2026-04-26 14:30',
    type: '合作通知',
    isRead: false
  },
  {
    id: 2,
    title: '视频审核通过',
    content: '您提交的视频「产品介绍」已审核通过，可以开始投放。',
    time: '2026-04-26 10:15',
    type: '审核通知',
    isRead: true
  },
  {
    id: 3,
    title: '系统提醒',
    content: '您的账户将于3天后到期，请及时续费。',
    time: '2026-04-25 16:45',
    type: '系统通知',
    isRead: false
  },
  {
    id: 4,
    title: '数据更新',
    content: '您的店铺数据已更新，点击查看详情。',
    time: '2026-04-25 09:30',
    type: '数据通知',
    isRead: true
  }
])

// 系统公告数据
const announcements = ref([
  {
    id: 1,
    title: '系统升级通知',
    content: 'DOHOZZ系统将于2026年4月27日进行升级维护，届时系统将暂停服务2小时，给您带来不便敬请谅解。',
    time: '2026-04-26 08:00',
    author: '系统管理员',
    isRead: false
  },
  {
    id: 2,
    title: '新功能上线',
    content: 'DOHOZZ平台新增「数据报表」功能，您可以在「指挥中台」查看详细的数据分析报告。',
    time: '2026-04-20 10:00',
    author: '产品团队',
    isRead: true
  }
])

// 未读通知数
const notificationUnreadCount = computed(() => {
  return notifications.value.filter(item => !item.isRead).length
})

// 未读公告数
const announcementUnreadCount = computed(() => {
  return announcements.value.filter(item => !item.isRead).length
})

// 过滤后的通知列表
const filteredNotifications = computed(() => {
  if (!searchKeyword.value) {
    return notifications.value
  }
  return notifications.value.filter(item => 
    item.title.includes(searchKeyword.value) || 
    item.content.includes(searchKeyword.value)
  )
})

// 标记为已读
function handleMarkAsRead(id) {
  const notification = notifications.value.find(item => item.id === id)
  if (notification) {
    notification.isRead = true
    ElMessage.success('已标记为已读')
  }
  const announcement = announcements.value.find(item => item.id === id)
  if (announcement) {
    announcement.isRead = true
    ElMessage.success('已标记为已读')
  }
}

// 全部标记为已读
function handleMarkAllRead() {
  notifications.value.forEach(item => {
    item.isRead = true
  })
  announcements.value.forEach(item => {
    item.isRead = true
  })
  ElMessage.success('已全部标记为已读')
}

// 导出
function handleExport() {
  ElMessage.success('导出成功')
}

// 点击通知
function handleNotificationClick(item) {
  if (!item.isRead) {
    item.isRead = true
  }
  // 这里可以添加点击通知后的处理逻辑
  ElMessage.info(`查看通知：${item.title}`)
}

// 点击公告
function handleAnnouncementClick(item) {
  if (!item.isRead) {
    item.isRead = true
  }
  // 这里可以添加点击公告后的处理逻辑
  ElMessage.info(`查看公告：${item.title}`)
}

// 页面大小变化
function handlePageSizeChange() {
  pagination.page = 1
}

function handlePageChange() {
  // 模拟加载
}

// 版本升级弹窗关闭
function handleVersionModalClose() {
  showVersionModal.value = false
  // 切换到系统公告tab
  activeTab.value = 'announcement'
}

// 版本升级弹窗
const showVersionModal = ref(false)

// 页面加载时检查是否需要显示版本升级弹窗
onMounted(() => {
  // 检查是否已显示过版本升级弹窗
  const hasSeenVersionPopup = localStorage.getItem('hasSeenVersionPopup')
  if (!hasSeenVersionPopup) {
    // 模拟延迟显示版本升级弹窗
    setTimeout(() => {
      showVersionModal.value = true
      localStorage.setItem('hasSeenVersionPopup', 'true')
    }, 500)
  }
})
</script>

<style lang="scss" scoped>
.message-center {
  min-height: 100vh;
  background: #F5F6F7;
}

// 消息中心顶部导航
.msg-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .msg-tabs {
    display: flex;
    align-items: center;
  }

  .msg-tab {
    padding: 0 16px;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    font-weight: 500;
    color: #595959;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;

    &:hover {
      color: #1890ff;
    }

    &.active {
      color: #1890ff;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 16px;
        right: 16px;
        height: 2px;
        background: #1890ff;
      }
    }
  }

  .msg-badge {
    display: inline-block;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    padding: 0 4px;
    margin-left: 8px;
    background: #ff4d4f;
    color: #fff;
    font-size: 12px;
    border-radius: 8px;
    text-align: center;
  }

  .msg-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background: #fff;
    font-size: 14px;
    color: #595959;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #1890ff;
      color: #1890ff;
    }

    &.primary {
      background: #1890ff;
      border-color: #1890ff;
      color: #fff;

      &:hover {
        background: #40a9ff;
      }
    }
  }

  .action-btn svg {
    width: 14px;
    height: 14px;
  }
}

// 消息内容区
.msg-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

// 消息搜索
.msg-search {
  margin-bottom: 24px;

  .search-input {
    position: relative;
    max-width: 400px;

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #8c8c8c;
    }

    .search-field {
      width: 100%;
      height: 40px;
      padding: 0 12px 0 36px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.3s;

      &:focus {
        outline: none;
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }
}

// 消息列表
.msg-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

// 消息项
.msg-item {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #fafafa;
  }

  &.unread {
    background: #f6ffed;
  }

  &:last-child {
    border-bottom: none;
  }

  .msg-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .msg-item-title {
      font-size: 16px;
      font-weight: 500;
      color: #262626;
    }

    .msg-item-time {
      font-size: 12px;
      color: #8c8c8c;
    }
  }

  .msg-item-content {
    font-size: 14px;
    color: #595959;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .msg-item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .msg-item-type {
      font-size: 12px;
      color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
      padding: 2px 8px;
      border-radius: 10px;
    }

    .msg-item-action {
      font-size: 12px;
      color: #8c8c8c;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }
}

// 公告列表
.announcement-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

// 公告项
.announcement-item {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #fafafa;
  }

  &.unread {
    background: #f6ffed;
  }

  &:last-child {
    border-bottom: none;
  }

  .announcement-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .announcement-item-title {
      font-size: 16px;
      font-weight: 500;
      color: #262626;
    }

    .announcement-item-time {
      font-size: 12px;
      color: #8c8c8c;
    }
  }

  .announcement-item-content {
    font-size: 14px;
    color: #595959;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .announcement-item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .announcement-item-author {
      font-size: 12px;
      color: #8c8c8c;
    }

    .announcement-item-action {
      font-size: 12px;
      color: #8c8c8c;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  svg {
    color: #d9d9d9;
    margin-bottom: 16px;
  }

  p {
    font-size: 14px;
    color: #8c8c8c;
    margin: 0;
  }
}

// 分页
.msg-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

// 版本升级弹窗
.version-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .version-icon {
    margin-bottom: 20px;
    color: #1890ff;
  }

  h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #262626;
  }

  .version-desc {
    margin: 0 0 20px 0;
    font-size: 14px;
    color: #595959;
    line-height: 1.5;
  }

  .version-features {
    width: 100%;
    text-align: left;

    h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 500;
      color: #262626;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      font-size: 14px;
      color: #595959;
      line-height: 1.5;

      li {
        margin-bottom: 4px;
      }
    }
  }
}
</style>
<template>
  <div class="message-center">
    <!-- 顶部导航栏 -->
    <header class="msg-top-bar">
      <div class="msg-tabs">
        <div
          class="msg-tab"
          :class="{ active: activeTab === 'notification' }"
          @click="handleTabChange('notification')"
        >
          消息通知
          <span v-if="notificationUnreadCount > 0" class="tab-badge">{{ notificationUnreadCount }}</span>
        </div>
        <div
          class="msg-tab"
          :class="{ active: activeTab === 'announcement' }"
          @click="handleTabChange('announcement')"
        >
          系统公告
          <span v-if="announcementUnreadCount > 0" class="tab-badge">{{ announcementUnreadCount }}</span>
        </div>
      </div>
      <div class="msg-top-right">
        <span class="wechat-bind-link" @click="showWechatModal = true">绑定公众号，随时掌握达人动态 ></span>
        <button class="btn-msg-setting" @click="handleGoToSettings">消息设置</button>
      </div>
    </header>

    <!-- 分类筛选区 -->
    <div v-if="activeTab === 'notification'" class="filter-section">
      <!-- 异常监控 -->
      <div class="filter-row">
        <span class="filter-row-label">异常监控</span>
        <div class="filter-options">
          <span
            v-for="item in anomalyFilters"
            :key="item.key"
            class="filter-option"
            :class="{ active: activeAnomalyFilter === item.key }"
            @click="handleAnomalyFilterChange(item.key)"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
      <!-- 消息提醒 -->
      <div class="filter-row">
        <span class="filter-row-label">消息提醒</span>
        <div class="filter-options">
          <span
            v-for="item in reminderFilters"
            :key="item.key"
            class="filter-option"
            :class="{ active: activeReminderFilter === item.key }"
            @click="handleReminderFilterChange(item.key)"
          >
            {{ item.label }}
            <span v-if="item.unread > 0 && activeReminderFilter !== item.key" class="filter-badge">{{ item.unread }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 系统公告筛选区 -->
    <div v-else class="notice-filter-row">
      <span class="notice-filter-label">系统公告</span>
      <span class="notice-type-tag active">版本升级</span>
    </div>

    <!-- 消息列表标题栏 -->
    <div class="msg-list-header">
      <div class="msg-list-title">
        消息列表
        <span class="msg-list-count">共计 {{ filteredMessageList.length }} 条消息</span>
      </div>
      <div class="msg-list-right">
        <label class="unread-only-checkbox">
          <input type="checkbox" v-model="showUnreadOnly" />
          <span>只看未读消息</span>
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
    <div class="msg-list">
      <!-- 消息通知列表 -->
      <template v-if="activeTab === 'notification'">
        <div
          v-for="msg in filteredMessageList"
          :key="msg.id"
          class="msg-item"
          :class="{ read: msg.isRead }"
          @click="handleMessageClick(msg)"
        >
          <div class="msg-item-inner">
            <span class="msg-tag">消息</span>
            <span class="msg-platform-logo" :style="{ background: getPlatformColor(msg.platform) }">
              {{ getPlatformInitial(msg.platform) }}
            </span>
            <div class="msg-item-body">
              <span class="msg-body-text">{{ msg.content }}</span>
            </div>
            <div class="msg-item-right">
              <span class="msg-time">{{ msg.time }}</span>
              <span v-if="!msg.isRead" class="msg-unread-dot"></span>
            </div>
          </div>
        </div>

        <div v-if="filteredMessageList.length === 0" class="msg-empty">
          <svg class="msg-empty-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <span>{{ showUnreadOnly ? '暂无未读消息' : '暂无消息' }}</span>
        </div>
      </template>

      <!-- 系统公告列表 -->
      <template v-else>
        <div
          v-for="notice in announcementList"
          :key="notice.id"
          class="notice-item"
          :class="{ read: notice.isRead }"
        >
          <span class="notice-tag">公告</span>
          <div class="notice-body">
            <div class="notice-content" :class="{ expanded: expandedNotices.includes(notice.id) }">
              {{ notice.content }}
            </div>
            <span
              v-if="!expandedNotices.includes(notice.id) && notice.content.length > 100"
              class="notice-expand-btn"
              @click.stop="handleExpandNotice(notice)"
            >
              展开全部 >
            </span>
            <span
              v-else-if="expandedNotices.includes(notice.id)"
              class="notice-expand-btn"
              @click.stop="handleCollapseNotice(notice)"
            >
              收起全部 >
            </span>
          </div>
          <div class="notice-item-right">
            <span class="msg-time">{{ notice.time }}</span>
            <span v-if="!notice.isRead" class="msg-unread-dot"></span>
          </div>
        </div>

        <div v-if="announcementList.length === 0" class="msg-empty">
          <svg class="msg-empty-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <span>暂无公告</span>
        </div>
      </template>
    </div>

    <!-- 分页栏 -->
    <div v-if="activeTab === 'notification' && filteredMessageList.length > 0" class="msg-pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 微信绑定弹窗 -->
    <el-dialog v-model="showWechatModal" width="340px" title="微信提醒设置" :show-close="true">
      <div class="wechat-modal">
        <div class="wechat-qrcode-placeholder">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <rect width="120" height="120" fill="#f5f5f5"/>
            <text x="60" y="65" text-anchor="middle" font-size="12" fill="#999">二维码区域</text>
          </svg>
        </div>
        <div class="wechat-scan-tip">
          <p>请用微信"扫一扫"</p>
          <p>微信扫码关注"DOHOZZ"微信公众号</p>
        </div>
        <div class="wechat-benefits">
          <div class="wechat-benefit-item">达人释放、达人交付等消息通知</div>
          <div class="wechat-benefit-item">达人爆单、跟进异常等消息通知</div>
        </div>
      </div>
    </el-dialog>

    <!-- 版本升级弹窗 -->
    <el-dialog v-model="showVersionModal" width="480px" title="产品动态" :show-close="true">
      <div class="version-modal-content">
        <div v-for="(item, index) in versionUpdates" :key="index" class="version-item">
          {{ index + 1 }}、{{ item }}
        </div>
      </div>
      <template #footer>
        <div class="version-modal-footer">
          <el-button type="primary" @click="handleVersionModalClose">我知道了</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'

const navigateToMenu = inject('navigateToMenu', null)

const handleGoToSettings = () => {
  if (navigateToMenu) {
    navigateToMenu('消息设置')
  } else {
    ElMessage.info('路由不可用')
  }
}

// Tab状态
const activeTab = ref('notification')
const notificationUnreadCount = ref(9)
const announcementUnreadCount = ref(1)

// 筛选条件
const activeAnomalyFilter = ref('all')
const activeReminderFilter = ref('all')

const anomalyFilters = [
  { key: 'all', label: '全部' },
  { key: 'logistics', label: '寄样物流异常' },
  { key: 'delivery', label: '签收超时未交付' },
  { key: 'cooperation', label: '合作单超时未交付' },
  { key: 'release', label: '达人即将释放公海' }
]

const reminderFilters = [
  { key: 'all', label: '全部', unread: 9 },
  { key: 'sample_ship', label: '样品发货', unread: 1 },
  { key: 'sample_sign', label: '样品签收', unread: 0 },
  { key: 'sample_audit', label: '样品审核', unread: 2 },
  { key: 'cooperation_audit', label: '合作单审核', unread: 0 },
  { key: 'live_start', label: '直播开播', unread: 0 },
  { key: 'video_publish', label: '视频发布', unread: 0 },
  { key: 'influencer_assign', label: '达人分配', unread: 5 },
  { key: 'influencer_transfer', label: '达人转移', unread: 0 },
  { key: 'influencer_release', label: '达人释放公海', unread: 6 }
]

// 只看未读
const showUnreadOnly = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 40
})

// 展开的公告
const expandedNotices = ref([])

// 弹窗状态
const showWechatModal = ref(false)
const showVersionModal = ref(false)

// Mock消息数据
const mockNotificationList = [
  // 异常监控 - 寄样物流异常
  { id: 1, type: 'logistics', category: 'anomaly', platform: 'tiktok', content: '【寄样物流异常】达人@张三的样品寄送后物流异常，请及时处理', time: '2025-09-02 15:30', isRead: false },
  { id: 2, type: 'logistics', category: 'anomaly', platform: 'shopee', content: '【寄样物流异常】达人@李四的样品退回，请重新寄送', time: '2025-09-02 14:20', isRead: false },
  { id: 3, type: 'logistics', category: 'anomaly', platform: 'tiktok', content: '【寄样物流异常】达人@王五的样品被拒收，请联系达人确认地址', time: '2025-09-01 10:00', isRead: true },
  { id: 4, type: 'logistics', category: 'anomaly', platform: 'shopee', content: '【寄样物流异常】达人@赵六的样品丢失，正在联系物流公司', time: '2025-08-31 16:30', isRead: true },
  { id: 5, type: 'logistics', category: 'anomaly', platform: 'tiktok', content: '【寄样物流异常】达人@钱七的样品送达但未签收，请跟进', time: '2025-08-30 09:00', isRead: true },

  // 异常监控 - 签收超时未交付
  { id: 6, type: 'delivery', category: 'anomaly', platform: 'tiktok', content: '【签收超时未交付】达人@孙八签收样品超过7天未发布视频，请跟进', time: '2025-09-02 12:00', isRead: false },
  { id: 7, type: 'delivery', category: 'anomaly', platform: 'shopee', content: '【签收超时未交付】达人@周九签收样品超过5天未开始直播', time: '2025-09-01 18:00', isRead: false },
  { id: 8, type: 'delivery', category: 'anomaly', platform: 'tiktok', content: '【签收超时未交付】达人@吴十签收样品超过10天未履约', time: '2025-08-31 14:00', isRead: true },
  { id: 9, type: 'delivery', category: 'anomaly', platform: 'shopee', content: '【签收超时未交付】达人@郑十一签收样品超过7天未发布内容', time: '2025-08-30 11:30', isRead: true },
  { id: 10, type: 'delivery', category: 'anomaly', platform: 'tiktok', content: '【签收超时未交付】达人@冯十二签收样品超过14天未完成交付', time: '2025-08-29 08:00', isRead: true },

  // 异常监控 - 合作单超时未交付
  { id: 11, type: 'cooperation', category: 'anomaly', platform: 'tiktok', content: '【合作单超时未交付】与达人@赵六的合作单超时未交付，请处理', time: '2025-09-02 10:30', isRead: false },
  { id: 12, type: 'cooperation', category: 'anomaly', platform: 'shopee', content: '【合作单超时未交付】与达人@钱七的合作单超时未交付，请处理', time: '2025-09-01 16:00', isRead: true },
  { id: 13, type: 'cooperation', category: 'anomaly', platform: 'tiktok', content: '【合作单超时未交付】与达人@孙八的合作单已超时3天', time: '2025-08-31 12:00', isRead: true },
  { id: 14, type: 'cooperation', category: 'anomaly', platform: 'shopee', content: '【合作单超时未交付】与达人@周九的合作单已超时5天', time: '2025-08-30 14:30', isRead: true },
  { id: 15, type: 'cooperation', category: 'anomaly', platform: 'tiktok', content: '【合作单超时未交付】与达人@吴十的合作单已超时7天', time: '2025-08-29 10:00', isRead: true },

  // 异常监控 - 达人即将释放公海
  { id: 16, type: 'release', category: 'anomaly', platform: 'tiktok', content: '【达人即将释放公海】达人@郑十一即将被释放至公海，请及时跟进', time: '2025-09-02 09:00', isRead: false },
  { id: 17, type: 'release', category: 'anomaly', platform: 'shopee', content: '【达人即将释放公海】达人@冯十二已超过30天未跟进，即将释放', time: '2025-09-01 14:00', isRead: false },
  { id: 18, type: 'release', category: 'anomaly', platform: 'tiktok', content: '【达人即将释放公海】达人@陈十三即将被释放，请尽快处理', time: '2025-08-31 10:00', isRead: true },
  { id: 19, type: 'release', category: 'anomaly', platform: 'shopee', content: '【达人即将释放公海】达人@刘十四已连续60天无跟进记录', time: '2025-08-30 16:00', isRead: true },
  { id: 20, type: 'release', category: 'anomaly', platform: 'tiktok', content: '【达人即将释放公海】达人@杨十五即将进入公海，请确认是否继续合作', time: '2025-08-29 11:00', isRead: true },

  // 消息提醒 - 样品发货
  { id: 21, type: 'sample_ship', category: 'reminder', platform: 'tiktok', content: '【样品发货】您寄送给达人@张三的样品已发货，请留意物流信息', time: '2025-09-02 08:00', isRead: false },
  { id: 22, type: 'sample_ship', category: 'reminder', platform: 'shopee', content: '【样品发货】您寄送给达人@李四的样品已发出，预计2天后送达', time: '2025-09-01 10:00', isRead: true },
  { id: 23, type: 'sample_ship', category: 'reminder', platform: 'tiktok', content: '【样品发货】样品已打包寄出，收件人：王五，电话：138****5678', time: '2025-08-31 15:00', isRead: true },
  { id: 24, type: 'sample_ship', category: 'reminder', platform: 'shopee', content: '【样品发货】您的样品已由顺丰寄出，单号：SF1234567890', time: '2025-08-30 09:30', isRead: true },
  { id: 25, type: 'sample_ship', category: 'reminder', platform: 'tiktok', content: '【样品发货】寄送给达人@钱七的样品已发出，请保持手机畅通', time: '2025-08-29 14:00', isRead: true },

  // 消息提醒 - 样品签收
  { id: 26, type: 'sample_sign', category: 'reminder', platform: 'tiktok', content: '【样品签收】达人@孙八已签收您的样品，请跟进后续合作', time: '2025-09-02 16:00', isRead: true },
  { id: 27, type: 'sample_sign', category: 'reminder', platform: 'shopee', content: '【样品签收】达人@周九已签收样品，物流信息显示正常', time: '2025-09-01 11:00', isRead: true },
  { id: 28, type: 'sample_sign', category: 'reminder', platform: 'tiktok', content: '【样品签收】您的样品已被达人@吴十签收，等待达人反馈', time: '2025-08-31 14:30', isRead: true },
  { id: 29, type: 'sample_sign', category: 'reminder', platform: 'shopee', content: '【样品签收】达人@郑十一已签收，请提醒达人尽快发布内容', time: '2025-08-30 10:00', isRead: true },
  { id: 30, type: 'sample_sign', category: 'reminder', platform: 'tiktok', content: '【样品签收】您的样品已被签收，收件人确认信息无误', time: '2025-08-29 08:30', isRead: true },

  // 消息提醒 - 样品审核
  { id: 31, type: 'sample_audit', category: 'reminder', platform: 'tiktok', content: '【样品审核】达人@张三提交的样品申请需要您审核', time: '2025-09-02 14:00', isRead: false },
  { id: 32, type: 'sample_audit', category: 'reminder', platform: 'shopee', content: '【样品审核】达人@李四的样品申请待审批，请尽快处理', time: '2025-09-02 10:00', isRead: false },
  { id: 33, type: 'sample_audit', category: 'reminder', platform: 'tiktok', content: '【样品审核】您有一笔样品申请需要审批，金额：500元', time: '2025-09-01 15:00', isRead: true },
  { id: 34, type: 'sample_audit', category: 'reminder', platform: 'shopee', content: '【样品审核】样品申请单#12345需要您审批', time: '2025-08-31 09:00', isRead: true },
  { id: 35, type: 'sample_audit', category: 'reminder', platform: 'tiktok', content: '【样品审核】达人@王五的样品申请已提交，等待您的审核', time: '2025-08-30 16:00', isRead: true },

  // 消息提醒 - 合作单审核
  { id: 36, type: 'cooperation_audit', category: 'reminder', platform: 'tiktok', content: '【合作单审核】达人@赵六的合作单需要您审核确认', time: '2025-09-01 14:00', isRead: true },
  { id: 37, type: 'cooperation_audit', category: 'reminder', platform: 'shopee', content: '【合作单审核】您有一笔合作单待审批，请尽快处理', time: '2025-09-01 10:00', isRead: true },
  { id: 38, type: 'cooperation_audit', category: 'reminder', platform: 'tiktok', content: '【合作单审核】合作单#2025001需要您审批审核', time: '2025-08-31 11:00', isRead: true },
  { id: 39, type: 'cooperation_audit', category: 'reminder', platform: 'shopee', content: '【合作单审核】达人@钱七的合作单已提交，请审核', time: '2025-08-30 09:00', isRead: true },
  { id: 40, type: 'cooperation_audit', category: 'reminder', platform: 'tiktok', content: '【合作单审核】合作单审批流程待您确认，请尽快处理', time: '2025-08-29 15:00', isRead: true },

  // 消息提醒 - 直播开播
  { id: 41, type: 'live_start', category: 'reminder', platform: 'tiktok', content: '【直播开播】达人@孙八的直播已开始，请进入直播间观看', time: '2025-09-02 20:00', isRead: true },
  { id: 42, type: 'live_start', category: 'reminder', platform: 'shopee', content: '【直播开播】达人@周九将于今晚8点开始直播带货', time: '2025-09-01 18:00', isRead: true },
  { id: 43, type: 'live_start', category: 'reminder', platform: 'tiktok', content: '【直播开播】您的合作达人@吴十正在直播中，当前在线人数：1000', time: '2025-08-31 21:00', isRead: true },
  { id: 44, type: 'live_start', category: 'reminder', platform: 'shopee', content: '【直播开播】达人@郑十一已开启直播，观众正在涌入', time: '2025-08-30 20:30', isRead: true },
  { id: 45, type: 'live_start', category: 'reminder', platform: 'tiktok', content: '【直播开播】达人@冯十二的直播预告：今晚9点准时开播', time: '2025-08-29 17:00', isRead: true },

  // 消息提醒 - 视频发布
  { id: 46, type: 'video_publish', category: 'reminder', platform: 'tiktok', content: '【视频发布】达人@陈十三已发布合作视频，请查看效果', time: '2025-09-02 18:00', isRead: true },
  { id: 47, type: 'video_publish', category: 'reminder', platform: 'shopee', content: '【视频发布】达人@刘十四发布了新视频，当前播放量：5000', time: '2025-09-01 16:00', isRead: true },
  { id: 48, type: 'video_publish', category: 'reminder', platform: 'tiktok', content: '【视频发布】您的合作达人@杨十五已发布视频，点赞数：200', time: '2025-08-31 14:00', isRead: true },
  { id: 49, type: 'video_publish', category: 'reminder', platform: 'shopee', content: '【视频发布】达人@朱十六的视频已发布，请确认交付', time: '2025-08-30 12:00', isRead: true },
  { id: 50, type: 'video_publish', category: 'reminder', platform: 'tiktok', content: '【视频发布】达人@何十七发布了新视频，内容质量良好', time: '2025-08-29 10:00', isRead: true },

  // 消息提醒 - 达人分配
  { id: 51, type: 'influencer_assign', category: 'reminder', platform: 'tiktok', content: '【达人分配】达人@何十七、达人@吴十八、达人@郑十九等10位抖音达人分配给你了，请及时跟进', time: '2025-09-02 09:00', isRead: false },
  { id: 52, type: 'influencer_assign', category: 'reminder', platform: 'shopee', content: '【达人分配】您被分配了5位新的Shopee达人，请尽快查看', time: '2025-09-01 11:00', isRead: false },
  { id: 53, type: 'influencer_assign', category: 'reminder', platform: 'tiktok', content: '【达人分配】达人@冯二十被分配给你了，请及时跟进', time: '2025-09-01 10:00', isRead: false },
  { id: 54, type: 'influencer_assign', category: 'reminder', platform: 'shopee', content: '【达人分配】您的新客户@邓二十一已分配，请联系跟进', time: '2025-08-31 15:00', isRead: false },
  { id: 55, type: 'influencer_assign', category: 'reminder', platform: 'tiktok', content: '【达人分配】达人@陈二十二被分配给你了，请及时跟进', time: '2025-08-31 09:00', isRead: false },

  // 消息提醒 - 达人转移
  { id: 56, type: 'influencer_transfer', category: 'reminder', platform: 'tiktok', content: '【达人转移】达人@刘二十三已从其他BD转移给你，请确认接收', time: '2025-09-01 14:00', isRead: true },
  { id: 57, type: 'influencer_transfer', category: 'reminder', platform: 'shopee', content: '【达人转移】您有一笔达人转移待确认，请处理', time: '2025-08-31 11:00', isRead: true },
  { id: 58, type: 'influencer_transfer', category: 'reminder', platform: 'tiktok', content: '【达人转移】达人@杨二十四已成功转入你的客户列表', time: '2025-08-30 16:00', isRead: true },
  { id: 59, type: 'influencer_transfer', category: 'reminder', platform: 'shopee', content: '【达人转移】达人转移流程已完成，达人已分配给你', time: '2025-08-29 10:00', isRead: true },
  { id: 60, type: 'influencer_transfer', category: 'reminder', platform: 'tiktok', content: '【达人转移】您接收了达人@朱二十五，请及时跟进', time: '2025-08-28 14:00', isRead: true },

  // 消息提醒 - 达人释放公海
  { id: 61, type: 'influencer_release', category: 'reminder', platform: 'tiktok', content: '【达人释放公海】达人@何二十六因连续30天未跟进，已被释放至公海', time: '2025-09-02 08:00', isRead: false },
  { id: 62, type: 'influencer_release', category: 'reminder', platform: 'shopee', content: '【达人释放公海】达人@吴二十七即将被释放，请及时跟进或放弃', time: '2025-09-01 17:00', isRead: false },
  { id: 63, type: 'influencer_release', category: 'reminder', platform: 'tiktok', content: '【达人释放公海】达人@郑二十八已超过规定时间未跟进，将被释放', time: '2025-09-01 09:00', isRead: false },
  { id: 64, type: 'influencer_release', category: 'reminder', platform: 'shopee', content: '【达人释放公海】您的客户@冯二十九即将进入公海，请处理', time: '2025-08-31 14:00', isRead: false },
  { id: 65, type: 'influencer_release', category: 'reminder', platform: 'tiktok', content: '【达人释放公海】达人@陈三十即将被释放至公海，请确认是否继续合作', time: '2025-08-31 10:00', isRead: false },
  { id: 66, type: 'influencer_release', category: 'reminder', platform: 'shopee', content: '【达人释放公海】达人@刘三十一已超时未跟进，将被释放', time: '2025-08-30 11:00', isRead: false }
]

// Mock公告数据
const mockAnnouncementList = [
  {
    id: 1,
    content: `1、新增达人公海功能，支持自动回收未跟进达人
2、优化样品管理流程，缩短审批时间
3、新增数据看板，支持多维度分析达人数据
4、优化消息通知机制，减少打扰
5、修复已知问题，提升系统稳定性
6、新增批量导入功能，支持Excel批量导入达人
7、优化搜索性能，搜索速度提升50%
8、新增达人标签功能，支持自定义标签分类`,
    time: '2025-09-01 10:00',
    isRead: false
  },
  {
    id: 2,
    content: `1、优化视频监控功能，支持更多平台
2、新增达人合作分析报告
3、修复部分已知问题
4、提升系统安全性
5、优化页面加载速度`,
    time: '2025-08-15 09:00',
    isRead: true
  }
]

// 版本更新内容
const versionUpdates = [
  '【达人管理】新增达人公海功能，支持自动回收未跟进达人，最长回收周期可达90天',
  '【样品管理】优化样品审批流程，新增批量审批功能，审批效率提升50%',
  '【数据看板】新增达人数据分析报告，支持多维度数据展示，包括带货GMV、转化率等核心指标',
  '【消息中心】优化消息通知机制，支持消息分类筛选，未读消息角标实时更新',
  '【系统优化】修复已知问题15项，系统稳定性提升20%',
  '【性能优化】优化页面加载速度，首屏加载时间缩短30%',
  '【新增功能】支持Excel批量导入达人数据，单次最多导入10000条记录'
]

// 计算属性
const announcementList = computed(() => mockAnnouncementList)

const filteredMessageList = computed(() => {
  let list = [...mockNotificationList]

  // 筛选异常监控
  if (activeAnomalyFilter.value !== 'all') {
    list = list.filter(msg => msg.category === 'anomaly' && msg.type === activeAnomalyFilter.value)
  }

  // 筛选消息提醒
  if (activeReminderFilter.value !== 'all') {
    list = list.filter(msg => msg.category === 'reminder' && msg.type === activeReminderFilter.value)
  }

  // 只看未读
  if (showUnreadOnly.value) {
    list = list.filter(msg => !msg.isRead)
  }

  return list
})

const currentUnreadCount = computed(() => {
  return filteredMessageList.value.filter(msg => !msg.isRead).length
})

// Tab切换
function handleTabChange(tab) {
  activeTab.value = tab
  pagination.page = 1
  showUnreadOnly.value = false
  activeAnomalyFilter.value = 'all'
  activeReminderFilter.value = 'all'
}

// 异常监控筛选
function handleAnomalyFilterChange(key) {
  activeAnomalyFilter.value = key
}

// 消息提醒筛选
function handleReminderFilterChange(key) {
  activeReminderFilter.value = key
}

// 消息点击
function handleMessageClick(msg) {
  if (!msg.isRead) {
    msg.isRead = true
    notificationUnreadCount.value--
  }
}

// 一键已读
function handleMarkAllRead() {
  filteredMessageList.value.forEach(msg => {
    if (!msg.isRead) {
      msg.isRead = true
      notificationUnreadCount.value--
    }
  })
}

// 展开公告
function handleExpandNotice(notice) {
  expandedNotices.value.push(notice.id)
  if (!notice.isRead) {
    notice.isRead = true
    announcementUnreadCount.value--
  }
}

// 收起公告
function handleCollapseNotice(notice) {
  const index = expandedNotices.value.indexOf(notice.id)
  if (index > -1) {
    expandedNotices.value.splice(index, 1)
  }
}

// 平台颜色
function getPlatformColor(platform) {
  const colors = {
    tiktok: '#000000',
    shopee: '#EE4D2D'
  }
  return colors[platform] || '#8C8C8C'
}

// 平台首字母
function getPlatformInitial(platform) {
  const initials = {
    tiktok: 'T',
    shopee: 'S'
  }
  return initials[platform] || '?'
}

// 分页
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

    &:hover {
      color: #1677FF;
    }

    &.active {
      color: #1677FF;
      font-weight: 600;
      border-bottom: 2px solid #1677FF;
    }
  }
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

  .wechat-bind-link {
    font-size: 13px;
    color: #8C8C8C;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s;

    &:hover {
      color: #1677FF;
    }
  }

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

    &:hover {
      border-color: #1677FF;
      color: #1677FF;
    }
  }
}

.filter-section {
  background: #fff;
  padding: 4px 24px 0;
  border-bottom: 1px solid #F0F0F0;

  .filter-row {
    display: flex;
    align-items: center;
    height: 40px;
    gap: 0;
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
    gap: 0;
    flex: 1;
    overflow: hidden;
  }
}

.filter-option {
  position: relative;
  padding: 4px 0;
  margin-right: 24px;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;

  &:hover {
    color: #1677FF;
  }

  &.active {
    color: #1677FF;
    font-weight: 500;
    border-bottom: 2px solid #1677FF;
  }
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

.notice-filter-row {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;
  gap: 16px;

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
    cursor: pointer;

    &.active {
      background: #1677FF;
      border-color: #1677FF;
      color: #fff;
    }
  }
}

.msg-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;

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

    input[type='checkbox'] {
      accent-color: #1677FF;
      width: 14px;
      height: 14px;
    }
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

    &:hover {
      background: #E6F4FF;
    }
  }
}

.msg-list {
  background: #fff;
  padding: 0 24px;
}

.msg-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F5F5F5;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #F8FBFF;
  }

  &:last-child {
    border-bottom: none;
  }

  &.read {
    .msg-body-text {
      color: #8C8C8C;
    }
  }

  .msg-item-inner {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;
  }

  .msg-item-body {
    flex: 1;
    min-width: 0;
  }

  .msg-item-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
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

.msg-platform-logo {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
  font-weight: 600;
}

.msg-body-text {
  font-size: 13px;
  color: #262626;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msg-item:hover .msg-body-text {
  color: #1677FF;
}

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

.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #F5F5F5;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  &.read {
    .notice-content {
      color: #8C8C8C;
    }
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

    &.expanded {
      display: block;
      overflow: visible;
      -webkit-line-clamp: unset;
    }
  }

  .notice-expand-btn {
    display: inline-block;
    margin-top: 6px;
    font-size: 13px;
    color: #1677FF;
    cursor: pointer;

    &:hover {
      color: #4096FF;
    }
  }

  .notice-item-right {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex-shrink: 0;
    padding-top: 2px;
  }
}

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

.msg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #8C8C8C;
  font-size: 14px;
  gap: 12px;

  .msg-empty-icon {
    width: 64px;
    height: 64px;
    opacity: 0.4;
  }
}

.msg-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  gap: 8px;
  background: #fff;
  border-top: 1px solid #F0F0F0;
}

.wechat-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 24px 24px;

  .wechat-qrcode-placeholder {
    width: 120px;
    height: 120px;
    border: 1px solid #F0F0F0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wechat-scan-tip {
    text-align: center;
    font-size: 13px;
    color: #595959;

    p {
      margin: 0;
      line-height: 1.6;
    }
  }

  .wechat-benefits {
    font-size: 12px;
    color: #595959;
    line-height: 2;
    text-align: left;

    .wechat-benefit-item::before {
      content: '✓ ';
      color: #52C41A;
    }
  }
}

.version-modal-content {
  padding: 0 20px 16px;
  font-size: 13px;
  color: #262626;
  line-height: 2;

  .version-item {
    margin-bottom: 8px;
  }
}

.version-modal-footer {
  display: flex;
  justify-content: center;
  padding: 12px 20px;
  border-top: 1px solid #F0F0F0;

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
}
</style>
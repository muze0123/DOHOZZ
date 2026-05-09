<template>
  <div class="influencer-info-header">
    <!-- ========== 区域A: 达人信息头部 ========== -->
    <div class="section-a">
      <!-- 第一行: 主信息 -->
      <div class="row-primary">
        <!-- 左侧: 头像 + 用户名 + LV标签 + 联系方式 -->
        <div class="left-info">
          <!-- 头像 -->
          <div class="avatar-wrapper">
            <img
              v-if="data.avatar"
              :src="data.avatar"
              :alt="data.username"
              class="avatar"
            />
            <div v-else class="avatar avatar-placeholder"></div>
          </div>

          <!-- 用户名 + LV标签 + 联系方式 -->
          <div class="user-info">
            <div class="name-row">
              <span class="username">{{ data.username }}</span>
              <span class="level-badge">{{ data.level }}</span>
            </div>
            <div class="contact-icons">
              <template v-for="contact in data.contacts" :key="contact.type">
                <el-tooltip
                  :content="getContactTooltip(contact.type)"
                  placement="top"
                >
                  <span
                    class="contact-icon"
                    :class="getContactIconClass(contact.type)"
                    @click="$emit('showContact', contact.type)"
                  >
                    <!-- Email Icon -->
                    <svg v-if="contact.type === 'email'" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <!-- Facebook Icon -->
                    <svg v-else-if="contact.type === 'facebook'" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <!-- Instagram Icon -->
                    <svg v-else-if="contact.type === 'instagram'" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </span>
                </el-tooltip>
              </template>
            </div>
          </div>
        </div>

        <!-- 右侧: 操作按钮 -->
        <div class="action-buttons">
          <el-button
            :type="data.followStatus === 'followed' ? 'default' : 'primary'"
            size="small"
            @click="$emit('follow')"
          >
            {{ data.followStatus === 'followed' ? '已跟进' : '跟进达人' }}
          </el-button>
          <el-button size="small" @click="$emit('assign')">
            {{ data.assignStatus === 'assigned' ? '已分配' : '分配达人' }}
          </el-button>
          <el-button
            :type="data.publicPoolStatus === 'in_pool' ? 'default' : 'warning'"
            size="small"
            @click="$emit('addToPool')"
          >
            {{ data.publicPoolStatus === 'in_pool' ? '已在公海' : '+达人公海' }}
          </el-button>
          <el-button size="small" circle @click="$emit('showQRCode')">
            <svg class="icon-btn" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </el-button>
          <el-button size="small" circle @click="$emit('openHomePage')">
            <svg class="icon-btn" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.47 6.3 6.3 0 001.87-4.49V8.73a8.26 8.26 0 004.71 1.53V6.86a4.84 4.84 0 01-1-.17z"/>
            </svg>
          </el-button>
        </div>
      </div>

      <!-- 第二行: 补充信息 -->
      <div class="row-secondary">
        <!-- 达人名称 + 更新时间 + 刷新按钮 -->
        <div class="meta-row">
          <span class="influencer-name">{{ data.name }}</span>
          <span class="update-time">更新时间: {{ data.updateTime }}</span>
          <el-button
            :type="isRefreshing ? 'default' : 'primary'"
            link
            size="small"
            :disabled="isRefreshing"
            @click="handleRefresh"
          >
            <span v-if="isRefreshing" class="refreshing-text">数据更新中…</span>
            <span v-else class="refresh-btn">
              <svg class="refresh-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              刷新
            </span>
          </el-button>
        </div>

        <!-- 基础字段 -->
        <div class="info-fields">
          <span class="field-item">
            <span class="field-label">所属地区:</span>
            <span class="field-value">{{ data.region }}</span>
            <span v-if="data.regionFlag" class="region-flag">{{ data.regionFlag }}</span>
          </span>
          <span class="field-divider">|</span>
          <span class="field-item">
            <span class="field-label">MCN机构:</span>
            <span class="field-value">{{ data.mcn || '暂无' }}</span>
          </span>
          <span class="field-divider">|</span>
          <span class="field-item">
            <span class="field-label">首次发布视频时间:</span>
            <el-tooltip content="该达人在平台首次发布视频的时间" placement="top">
              <span class="info-icon">
                <svg class="info-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </span>
            </el-tooltip>
            <span class="field-value">{{ data.firstVideoTime }}</span>
          </span>
        </div>

        <!-- 达人简介 -->
        <div class="bio-section">
          <span class="bio-label">简介:</span>
          <div class="bio-content" :class="{ 'is-expanded': isBioExpanded }">
            <span class="bio-text" ref="bioTextRef">{{ data.bio }}</span>
          </div>
          <span
            v-if="bioNeedExpand"
            class="expand-btn"
            @click="toggleBioExpand"
          >
            {{ isBioExpanded ? '收起' : '展开' }}
          </span>
        </div>

        <!-- 达人标签 -->
        <div class="tags-section">
          <div class="tags-wrapper">
            <span
              v-for="(tag, index) in data.tags"
              :key="index"
              class="tag-item"
            >
              {{ tag }}
            </span>
            <span v-if="data.tags.length === 0" class="no-tags">暂无标签</span>
          </div>
          <el-button link type="primary" size="small" @click="$emit('editTags')">
            <svg class="edit-icon" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            编辑
          </el-button>
        </div>
      </div>
    </div>

    <!-- ========== 区域B: 核心数据横向指标条 ========== -->
    <div class="section-b">
      <!-- 第一行: 主要数据 -->
      <div class="metrics-row">
        <div class="metric-item">
          <span class="metric-label">粉丝数</span>
          <span class="metric-value">{{ formatNumber(data.followers) }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">获赞数</span>
          <span class="metric-value">{{ formatNumber(data.likes) }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">近30日成交金额</span>
          <span class="metric-value highlight">{{ data.gmv30d }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">近30日成交订单数</span>
          <span class="metric-value">{{ formatNumber(data.orders30d) }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">近30日销量</span>
          <span class="metric-value">{{ formatSales(data.sales30d) }}</span>
        </div>
      </div>

      <!-- 第二行: 辅助数据 -->
      <div class="metrics-row secondary">
        <div class="metric-item">
          <span class="metric-label">带货类目</span>
          <span class="metric-value">{{ data.categories }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">带货方式</span>
          <span class="metric-value">{{ data.salesType }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">视频平均播放量</span>
          <span class="metric-value">{{ formatNumber(data.avgVideoViews) }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">直播场均观看人数</span>
          <span class="metric-value">{{ formatNumber(data.avgLiveViewers) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Props定义
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      avatar: '',
      username: '',
      name: '',
      level: 'LV0',
      contacts: [],
      region: '',
      regionFlag: '',
      mcn: '',
      firstVideoTime: '',
      bio: '',
      tags: [],
      followers: 0,
      likes: 0,
      gmv30d: '¥0',
      orders30d: 0,
      sales30d: 0,
      categories: '',
      salesType: '',
      avgVideoViews: 0,
      avgLiveViewers: 0,
      updateTime: '',
      followStatus: 'unfollowed',
      assignStatus: 'unassigned',
      publicPoolStatus: 'not_in_pool'
    })
  }
})

// Events
const emit = defineEmits([
  'follow',
  'assign',
  'addToPool',
  'refresh',
  'showContact',
  'editTags',
  'openHomePage',
  'showQRCode'
])

// 刷新状态
const isRefreshing = ref(false)

// 简介展开状态
const isBioExpanded = ref(false)
const bioNeedExpand = ref(false)
const bioTextRef = ref(null)

// 检查简介是否需要展开按钮
onMounted(() => {
  checkBioOverflow()
})

function checkBioOverflow() {
  if (bioTextRef.value) {
    const el = bioTextRef.value
    bioNeedExpand.value = el.scrollWidth > el.clientWidth || el.clientHeight > 24
  }
}

// 刷新处理
function handleRefresh() {
  if (isRefreshing.value) return
  isRefreshing.value = true
  emit('refresh')
  // 模拟刷新完成
  setTimeout(() => {
    isRefreshing.value = false
  }, 2000)
}

// 展开/收起简介
function toggleBioExpand() {
  isBioExpanded.value = !isBioExpanded.value
}

// 格式化数字
function formatNumber(value) {
  if (value == null || isNaN(value)) return '0'
  return Number(value).toLocaleString('zh-CN')
}

// 格式化销量
function formatSales(value) {
  if (value == null || isNaN(value)) return '0'
  return Number(value).toLocaleString('zh-CN')
}

// 获取联系方式样式类
function getContactIconClass(type) {
  const classes = {
    email: 'contact-email',
    facebook: 'contact-facebook',
    instagram: 'contact-instagram'
  }
  return classes[type] || 'contact-email'
}

// 获取联系方式提示文字
function getContactTooltip(type) {
  const tooltips = {
    email: '发送邮件',
    facebook: 'Facebook',
    instagram: 'Instagram'
  }
  return tooltips[type] || ''
}
</script>

<style scoped lang="scss">
// 颜色变量
$page-bg: #F5F6F7;
$section-bg: #FFFFFF;
$border-light: #F0F0F0;
$border-color: #E8E8E8;

$text-primary: #1A1A1A;
$text-secondary: #8C8C8C;
$text-muted: #999999;

$meta-blue: #1677FF;
$meta-blue-hover: #1668dc;
$meta-blue-light: #E6F4FF;

$warning-orange: #FA8C16;
$warning-orange-bg: #FFF7E6;
$warning-orange-border: #FFD591;

$email-orange: #FF6B35;
$facebook-blue: #1877F2;
$instagram-pink: #E4405F;

$font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

// ========== 组件容器 ==========
.influencer-info-header {
  background: $page-bg;
  border-radius: 8px;
  overflow: hidden;
}

// ========== 区域A: 达人信息头部 ==========
.section-a {
  background: $section-bg;
  padding: 16px 24px;
  border-bottom: 1px solid $border-light;
}

// 第一行: 主信息
.row-primary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.left-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background: #F5F5F5;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  background: $meta-blue;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
}

.contact-icons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  &.contact-email svg {
    color: $email-orange;
    fill: $email-orange;
  }

  &.contact-facebook svg {
    color: $facebook-blue;
    fill: $facebook-blue;
  }

  &.contact-instagram svg {
    color: $instagram-pink;
    fill: $instagram-pink;
  }
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  width: 16px;
  height: 16px;
}

// 第二行: 补充信息
.row-secondary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.influencer-name {
  font-size: 13px;
  color: $text-secondary;
}

.update-time {
  font-size: 13px;
  color: $text-muted;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: $meta-blue;
}

.refresh-icon {
  width: 14px;
  height: 14px;
}

.refreshing-text {
  color: $text-muted;
  font-size: 13px;
}

.info-fields {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-label {
  font-size: 13px;
  color: $text-secondary;
}

.field-value {
  font-size: 13px;
  color: $text-primary;
}

.region-flag {
  margin-left: 2px;
}

.field-divider {
  color: $border-color;
}

.info-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.info-svg {
  width: 14px;
  height: 14px;
  color: $text-muted;
}

// 简介
.bio-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.bio-label {
  font-size: 13px;
  color: $text-secondary;
  flex-shrink: 0;
}

.bio-content {
  flex: 1;
  max-width: 56px;
  overflow: hidden;
  position: relative;

  &.is-expanded {
    max-width: none;
    white-space: normal;
  }
}

.bio-text {
  font-size: 13px;
  color: $text-primary;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expand-btn {
  font-size: 13px;
  color: $meta-blue;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }
}

// 标签
.tags-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: $warning-orange-bg;
  border: 1px solid $warning-orange-border;
  color: $warning-orange;
  font-size: 12px;
  border-radius: 4px;
}

.no-tags {
  font-size: 13px;
  color: $text-muted;
}

.edit-icon {
  width: 14px;
  height: 14px;
  margin-right: 2px;
}

// ========== 区域B: 核心数据横向指标条 ==========
.section-b {
  background: $section-bg;
  padding: 12px 24px;
}

.metrics-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid $border-light;

  &:last-child {
    border-bottom: none;
  }

  &.secondary {
    padding: 6px 0;
  }
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 16px;

  &:first-child {
    padding-left: 0;
  }

  &:not(:last-child) {
    border-right: 1px solid $border-light;
  }
}

.metric-label {
  font-size: 12px;
  color: $text-muted;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  font-family: $font-family;

  &.highlight {
    color: $meta-blue;
  }
}
</style>

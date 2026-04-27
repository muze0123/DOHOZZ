<template>
  <div class="workspace">
    <!-- 平台Tab -->
    <div class="platform-tabs-bar">
      <div class="platform-tabs">
        <div
          v-for="platform in platforms"
          :key="platform.id"
          class="platform-tab"
          :class="{ active: activePlatform === platform.id }"
          @click="switchPlatform(platform.id)"
        >
          <div class="platform-icon" v-html="platform.icon"></div>
          <span>{{ platform.name }}</span>
        </div>
      </div>
    </div>

    <!-- 用户信息栏 -->
    <div class="user-info-bar sticky-user-bar">
      <div class="user-info-left">
        <el-avatar :size="48" :icon="UserIcon" class="user-avatar" />
        <div class="user-details">
          <div class="user-name">
            {{ userInfo.name }}
            <span class="inline-tenure">您已加入公司 <span style="color: #0064E0; font-weight: bold;">{{ userInfo.tenure }}</span> 天</span>
          </div>
          <div class="user-role">{{ userInfo.department }} | {{ userInfo.role }}</div>
        </div>
      </div>
      <div class="user-filters">
        <div class="filter-select">
          <el-select v-model="selectedDept" placeholder="全部部门">
            <el-option label="全部部门" value="all" />
            <el-option label="销售部" value="sales" />
            <el-option label="运营部" value="ops" />
          </el-select>
        </div>
        <div class="filter-select">
          <el-select v-model="selectedBD" placeholder="全部BD">
            <el-option label="本人" value="self" />
            <el-option label="张三" value="zhangsan" />
            <el-option label="李四" value="lisi" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 中上部分局: 左侧待办与工具，右侧业绩目标 -->
    <div class="middle-layout">
      <div class="middle-left">
        <!-- 待办事项区 -->
        <div class="section todo-section">
          <div class="section-header">
            <div class="section-title-group">
              <span class="section-title">待办事项</span>
              <div class="section-desc">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span>当前与跟进达人相关的待办事项，请及时处理</span>
              </div>
            </div>
          </div>
          <div class="todo-cards-grid">
            <div
              v-for="todo in todoItems"
              :key="todo.id"
              class="todo-card"
              :class="{ 'has-warning': todo.warning > 0 }"
            >
              <div class="todo-label">{{ todo.label }}</div>
              <div class="todo-value" :class="{ warning: todo.warning > 0 }">
                {{ todo.value }}
              </div>
              <div class="todo-warning" v-if="todo.warningText">
                <span :class="{ 'warning-text': todo.warning > 0 }">{{ todo.warningText }}</span>
                <span class="warning-count" v-if="todo.warning > 0">{{ todo.warning }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷工具区 -->
        <div class="section quick-tools-section">
          <div class="section-header">
            <span class="section-title">快捷工具</span>
          </div>
          <div class="quick-tools-grid">
            <div
              v-for="tool in quickTools"
              :key="tool.id"
              class="quick-tool-item"
            >
              <div class="tool-icon" v-html="tool.icon"></div>
              <span class="tool-name">{{ tool.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="middle-right">
        <!-- 业绩目标区 -->
        <div class="section performance-section">
          <div class="section-header">
            <span class="section-title">业绩目标</span>
          </div>

          <div class="performance-chart">
            <div class="chart-header">
              <div class="completion-rate success">
                <span class="rate-value">93.55%</span>
                <span class="rate-label">完成目标</span>
              </div>
              <div class="chart-date">
                <el-date-picker
                  v-model="performanceMonth"
                  type="month"
                  placeholder="选择月份"
                  format="YYYY.MM"
                  value-format="YYYY.MM"
                  :clearable="false"
                  class="performance-month-picker"
                />
              </div>
            </div>

            <div class="chart-area">
              <div class="chart-lines">
                <div class="chart-line target"></div>
                <div class="chart-line actual"></div>
              </div>
              <div class="chart-dots">
                <span class="dot success"></span>
                <span class="dot success"></span>
                <span class="dot success"></span>
                <span class="dot success"></span>
                <span class="dot success"></span>
                <span class="dot current"></span>
              </div>
              <div class="chart-labels">
                <span>02-01</span>
                <span>02-7</span>
                <span>02-13</span>
                <span>02-19</span>
                <span>02-25</span>
                <span>02-28</span>
              </div>
              <div class="chart-values">
                <div class="value-item current">
                  <span class="value-dot"></span>
                  <span>当前：16.88w元</span>
                </div>
                <div class="value-item target">
                  <span class="value-dot"></span>
                  <span>目标：20w元</span>
                </div>
              </div>
            </div>
          </div>

          <div class="performance-stats">
            <div class="stat-item">
              <span class="stat-label">达人成交金额</span>
              <div class="stat-progress">
                <div class="progress-bar orange">
                  <div class="progress-fill" style="width: 50%"></div>
                </div>
                <span class="stat-value">10/<span class="stat-gray">20</span>（<span class="stat-percent">50%</span>）</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-label">建联达人数</span>
              <div class="stat-progress">
                <div class="progress-bar green">
                  <div class="progress-fill" style="width: 75%"></div>
                </div>
                <span class="stat-value">15/<span class="stat-gray">20</span>（<span class="stat-percent">75%</span>）</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-label">寄样达人数</span>
              <div class="stat-progress">
                <div class="progress-bar blue">
                  <div class="progress-fill" style="width: 25%"></div>
                </div>
                <span class="stat-value">5/<span class="stat-gray">20</span>（<span class="stat-percent">25%</span>）</span>
              </div>
            </div>
          </div>
          <div class="expand-btn">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            <span>展开全部</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-bottom">
      <!-- 达人大盘数据区 -->
      <div class="section data-section">
        <div class="section-header">
          <span class="section-title">达人大盘数据</span>
          <div class="date-filter" style="margin-bottom: 0;">
            <div class="date-tabs">
              <span
                v-for="tab in dateTabs"
                :key="tab"
                class="date-tab"
                :class="{ active: selectedDate === tab }"
                @click="selectedDate = tab"
              >
                {{ tab }}
              </span>
            </div>
            <span class="date-range">近7天（2025/11/20 - 2025/11/26）</span>
          </div>
        </div>

        <!-- 状态 Sub-Tab -->
        <div class="status-tabs">
          <div
            v-for="status in statusFilters"
            :key="status.key"
            class="status-tab"
            :class="{ active: selectedStatus === status.key }"
            @click="selectedStatus = status.key"
          >
            {{ status.label }}{{ status.count }}
          </div>
        </div>

        <!-- 数据列表 -->
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>达人</th>
                <th>跟进BD</th>
                <th>达人来源</th>
                <th>流转时间</th>
                <th>当前状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in tableData" :key="index">
                <td>
                  <div class="talent-info">
                    <el-avatar :size="32" :icon="UserIcon" />
                    <div class="talent-detail">
                      <span class="talent-name">{{ row.username }}</span>
                      <span class="talent-nickname">{{ row.name }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="bd-info">
                    <el-avatar :size="24" :icon="UserIcon" />
                    <span>{{ row.bd }}</span>
                  </div>
                </td>
                <td><span class="source-tag">{{ row.source }}</span></td>
                <td>{{ row.transferTime }}</td>
                <td>
                  <span class="status-tag" :class="getStatusClass(row.status)">
                    {{ row.statusText }}
                  </span>
                </td>
                <td>
                  <span class="action-link">跟进记录</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <span class="pagination-info">共40条记录 第1/8页</span>
          <div class="pagination-controls">
            <div class="page-btn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </div>
            <div class="page-btn active">1</div>
            <div class="page-btn">2</div>
            <div class="page-btn">3</div>
            <div class="page-btn">4</div>
            <div class="page-btn">5</div>
            <div class="page-btn">…</div>
            <div class="page-btn">43</div>
            <div class="page-btn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </div>
          </div>
          <div class="page-jump">
            <span>跳至</span>
            <input type="number" class="page-input" value="5" min="1" max="8" />
            <span>页</span>
            <span class="page-size">10条/页</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 动态提醒区 -->
    <div class="section notification-section">
      <div class="notification-tabs">
        <span
          class="notif-tab"
          :class="{ active: notifTab === 'reminder' }"
          @click="notifTab = 'reminder'"
        >
          动态提醒
        </span>
        <span
          class="notif-tab"
          :class="{ active: notifTab === 'announce' }"
          @click="notifTab = 'announce'"
        >
          系统公告
        </span>
        <span class="more-link">更多 ></span>
      </div>
      <div class="notification-list">
        <div
          v-for="item in currentNotifications"
          :key="item.id"
          class="notification-item"
        >
          <div class="notif-tag" :class="item.typeClass">{{ item.type }}</div>
          <div class="notif-content" v-html="item.content"></div>
          <div class="notif-time">{{ item.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, h } from 'vue'
import { ElMessage, ElAvatar } from 'element-plus'

const UserIcon = {
  render() {
    return h('i', { class: 'iconfont icon-yonghu' })
  },
  h
}

const activePlatform = ref('tiktok')
const selectedDept = ref('')
const selectedBD = ref('')
const selectedDate = ref('近N天')
const selectedStatus = ref('all')
const notifTab = ref('reminder')

const platforms = [
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
  },
  {
    id: 'shopee',
    name: 'Shopee',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.006 4.295c-1.61 0-3.145.55-4.332 1.45l-.247.194c-.617.475-1.118 1.07-1.49 1.747-.37.676-.563 1.43-.563 2.23 0 .78.18 1.54.527 2.2.347.66.837 1.22 1.44 1.64l.16.11c.35.24.74.41 1.16.51.42.1.85.15 1.29.15h2.9c.75 0 1.47-.12 2.13-.36.66-.24 1.25-.58 1.75-1.01l.03-.02c.47-.42.85-.93 1.11-1.51.27-.58.41-1.22.41-1.89 0-.67-.14-1.3-.41-1.89-.27-.58-.64-1.09-1.11-1.51l-.03-.02c-.5-.43-1.09-.77-1.75-1.01-.66-.24-1.38-.36-2.13-.36H13.4l-.63-1.06-.64 1.06h-2.9l-.55-.39c-.5-.35-1.05-.63-1.65-.82-.6-.19-1.24-.29-1.9-.29-.55 0-1.1.08-1.62.23-.53.15-1.02.38-1.45.68l-.13.09c-.39.29-.73.64-1.01 1.05-.28.41-.43.87-.43 1.36 0 .49.15.95.43 1.36.28.41.62.76 1.01 1.05l.13.09c.43.3.92.53 1.45.68.52.15 1.07.23 1.62.23.66 0 1.3-.1 1.9-.29.6-.19 1.15-.47 1.65-.82l.55-.39h3.79l.63 1.06.64-1.06h2.27c1.08 0 2.1.28 2.98.79.88.51 1.58 1.24 2.04 2.13.46.89.7 1.91.7 2.98 0 1.07-.24 2.09-.7 2.98-.46.89-1.16 1.62-2.04 2.13-.88.51-1.9.79-2.98.79H8.17c-.82 0-1.61.16-2.33.46-.73.3-1.37.74-1.91 1.29-.54.55-.96 1.21-1.24 1.95-.28.74-.42 1.55-.42 2.39 0 .84.14 1.65.42 2.39.28.74.7 1.4 1.24 1.95.54.55 1.18.99 1.91 1.29.72.3 1.51.46 2.33.46h13.65c1.64 0 3.19-.34 4.56-.98 1.37-.64 2.52-1.54 3.37-2.63.85-1.09 1.38-2.38 1.53-3.79.15-1.41-.05-2.83-.58-4.14-.53-1.31-1.38-2.43-2.48-3.28-1.1-.85-2.4-1.38-3.81-1.53-1.41-.15-2.83.05-4.14.58-1.31.53-2.43 1.38-3.28 2.48l-.16.21-.24-.33z"/></svg>'
  },
  {
    id: 'lazada',
    name: 'Lazada',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.91 6.18c-.02-.39-.35-.7-.74-.7H2.83c-.39 0-.72.31-.74.7l-.99 14.64c-.02.39.27.71.66.71h18.68c.39 0 .68-.32.66-.71l-.09-14.64zm-8.84 6.1l-3.4 3.4H3.7l4.37-5.58 3.4 3.4 1.4-1.4-3.4-3.4 2.86-3.72c.18-.23.5-.3.74-.15l3.02 1.87 2.45-3.17c.16-.2.46-.24.68-.1l2.6 1.63c.22.14.29.42.16.64l-2.9 4.83-2.45 3.17c-.16.2-.46.24-.68.1l-2.61-1.63c-.22-.14-.29-.42-.16-.64l.86-1.42-1.4 1.4-1.42.86z"/></svg>'
  }
]

const joinDateStr = '2025-01-01'
const diffTime = Math.abs(new Date() - new Date(joinDateStr))
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

const userInfo = reactive({
  name: '张三',
  tenure: diffDays,
  department: '部门名称XXX',
  role: '角色名称XXX'
})

const today = new Date()
const currentMonthStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`
const performanceMonth = ref(currentMonthStr)

const todoItems = reactive([
  { id: 1, label: '待建联', value: 3, warning: 0, warningText: '待触达 1  待邀约 2' },
  { id: 2, label: '待寄样', value: 3, warning: 0, warningText: '超过三天未寄样达人 1' },
  { id: 3, label: '待审核样品', value: 3, warning: 0, warningText: '超过两天未审核样品 0' },
  { id: 4, label: '待发货样品', value: 3, warning: 0, warningText: '超过两天未发货样品 0' },
  { id: 5, label: '待签收样品', value: 0, warning: 0, warningText: '超过7天未签收样品 0' },
  { id: 6, label: '寄样签收待履约', value: 0, warning: 0, warningText: '超过15天未履约 0' },
  { id: 7, label: '寄样签收待交付', value: 0, warning: 0, warningText: '超过15天未交付 0' },
  { id: 8, label: '待合作', value: 0, warning: 0, warningText: '超过15天未合作 0' },
  { id: 9, label: '合作单待交付', value: 0, warning: 0, warningText: '超过15天未交付 0' },
  { id: 10, label: '3天内将释放公海达人', value: 0, warning: 0, warningText: '临期未建联 0  临期未出单 0' }
])

const quickTools = reactive([
  { id: 1, name: '找达人', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/></svg>' },
  { id: 2, name: '批量导入达人线索', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>' },
  { id: 3, name: '批量建联', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>' },
  { id: 4, name: '申请寄样', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/></svg>' },
  { id: 5, name: '达人履约', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>' },
  { id: 6, name: '跟进合作', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>' }
])

const dateTabs = ['周', '月', '自定义', '近N天']

const statusFilters = reactive([
  { key: 'all', label: '全部', count: 100 },
  { key: 'pending_reach', label: '待触达', count: 10 },
  { key: 'pending_invite', label: '待邀约', count: 6 },
  { key: 'pending_sample', label: '待申样', count: 2 },
  { key: 'pending_order', label: '待出单', count: 6 },
  { key: 'ordered', label: '已出单', count: 8 },
  { key: 'released', label: '释放公海', count: 30 }
])

const tableData = reactive([
  { username: '达人用户名', name: '达人名称', bd: '张三', source: '达人库', transferTime: '2025-12-01', status: 'pending_reach', statusText: '待触达' },
  { username: '达人用户名', name: '达人名称', bd: '张三', source: '达人库', transferTime: '2025-12-01', status: 'pending_reach', statusText: '待触达' },
  { username: '达人用户名', name: '达人名称', bd: '张三', source: '达人库', transferTime: '2025-12-01', status: 'pending_reach', statusText: '待触达' },
  { username: '达人用户名', name: '达人名称', bd: '张三', source: '达人库', transferTime: '2025-12-01', status: 'pending_reach', statusText: '待触达' }
])

const reminderNotifications = reactive([
  { id: 1, type: '达人释放', typeClass: 'orange', content: '您的达人【XXX】因跟进后7天未未创建合作单/未出单被释放回公海', time: '11-11' },
  { id: 2, type: '样品审批', typeClass: 'purple', content: '张三给【XXX达人名称】申请的样品已提交，请及时审批', time: '11-11' },
  { id: 3, type: '样品签收', typeClass: 'green', content: '您给【XXX达人名称】申请的样品显示已签收，可跟进达人履约', time: '11-11' },
  { id: 4, type: '样品审批通过', typeClass: 'green-dark', content: '您给【XXX达人名称】申请的样品已审批通过，等待发货中', time: '11-11' },
  { id: 5, type: '达人转移', typeClass: 'orange', content: '【XXX达人名称】转移给你了，请及时跟进', time: '11-11' },
  { id: 6, type: '达人分配', typeClass: 'orange', content: '【XXX达人名称】分配给你了，请及时跟进', time: '11-11' }
])

const announceNotifications = reactive([
  { id: 1, type: '达人分配', typeClass: 'orange', content: '【XXX达人名称】分配给你了，请及时跟进', time: '11-11' },
  { id: 2, type: '达人分配', typeClass: 'orange', content: '【XXX达人名称】分配给你了，请及时跟进', time: '11-11' },
  { id: 3, type: '达人分配', typeClass: 'orange', content: '【XXX达人名称】分配给你了，请及时跟进', time: '11-11' },
  { id: 4, type: '达人分配', typeClass: 'orange', content: '【XXX达人名称】分配给你了，请及时跟进', time: '11-11' }
])

const currentNotifications = computed(() => {
  return notifTab.value === 'reminder' ? reminderNotifications : announceNotifications
})

const switchPlatform = (platformId) => {
  activePlatform.value = platformId
  ElMessage.info(`已切换至 ${platforms.find(p => p.id === platformId)?.name}`)
}

const getStatusClass = (status) => {
  const classMap = {
    'pending_reach': 'warning',
    'pending_invite': 'info',
    'pending_order': 'primary',
    'ordered': 'success',
    'released': 'danger',
    'pending_sample': ''
  }
  return classMap[status] || ''
}
</script>

<style lang="scss" scoped>
$meta-blue: #0064E0;
$meta-blue-hover: #0143B5;
$meta-blue-light: #47A5FA;
$white: #FFFFFF;
$soft-gray: #F5F6F7;
$warm-gray: #F7F8FA;
$web-wash: #F0F2F5;
$primary-text: #050505;
$secondary-text: #65676B;
$disabled-text: #BCC0C4;
$divider: #E8E8E8;
$success-green: #31A24C;
$error-red: #E41E3F;
$warning-amber: #F7B928;
$purple: #8B5CF6;
$orange: #FF9500;

$font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;

$transition-fast: 150ms ease;

.workspace {
  min-height: 100%;
}

// 平台Tab与用户信息区
.platform-tabs-bar {
  background: $white;
  border: 1px solid $divider;
  border-bottom: none;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  padding: 0 16px;
  margin-top: 16px;
}

.platform-tabs {
  display: flex;
  gap: 24px;
}

.platform-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: $secondary-text;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all $transition-fast;
  position: relative;
  top: 1px;

  &:hover {
    color: $primary-text;
  }

  &.active {
    color: $meta-blue;
    font-weight: 500;
    border-bottom-color: $meta-blue;
  }

  .platform-icon {
    width: 20px;
    height: 20px;

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
}

// 用户信息栏
.user-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid $divider;
  border-radius: 0 0 $border-radius-lg $border-radius-lg;
  background: $white;
  margin-bottom: 16px;
  transition: box-shadow 0.3s ease, border-radius 0.3s ease;
}

.sticky-user-bar {
  position: sticky;
  top: 48px;
  z-index: 90;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.user-info-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  flex-shrink: 0;

  :deep(.iconfont) {
    font-family: 'iconfont', sans-serif;
    font-size: 20px;
  }
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: $primary-text;
}

.user-role {
  font-size: 12px;
  color: $secondary-text;
}

.inline-tenure {
  font-size: 12px;
  color: #65676B;
  background: rgba(0, 100, 224, 0.08);
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
  font-weight: normal;
}

.user-filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  :deep(.el-select) {
    width: 120px;
  }
  
  :deep(.el-select__selected-item span) {
    color: #000000 !important;
  }
}

// 中间层布局
.middle-layout {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.middle-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.middle-right {
  width: 500px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.middle-left .section:last-child {
  margin-bottom: 0;
}
.middle-right .section {
  flex: 1;
  margin-bottom: 0;
}

// 通用区块样式
.section {
  background: $white;
  border-radius: $border-radius-lg;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid $divider;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $primary-text;
}

.section-desc {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
  margin-left: 12px;
}

// 待办事项区
.todo-cards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.todo-card {
  background: $warm-gray;
  border: 1px solid $divider;
  border-radius: $border-radius-md;
  padding: 12px;
  transition: all $transition-fast;
  cursor: pointer;

  &:hover {
    border-color: $meta-blue;
  }

  &.has-warning {
    background: rgba($warning-amber, 0.05);
  }
}

.todo-label {
  font-size: 12px;
  color: $secondary-text;
  margin-bottom: 8px;
}

.todo-value {
  font-size: 24px;
  font-weight: 600;
  color: $primary-text;
  margin-bottom: 4px;

  &.warning {
    color: $warning-amber;
  }
}

.todo-warning {
  font-size: 11px;
  color: #999;
  line-height: 1.4;
}

.warning-text {
  color: $warning-amber;
}

.warning-count {
  color: $warning-amber;
  font-weight: 500;
}

// 快捷工具区
.quick-tools-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.quick-tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: $warm-gray;
  border: 1px solid $divider;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $meta-blue;
    background: rgba($meta-blue, 0.05);
  }

  .tool-icon {
    width: 24px;
    height: 24px;
    color: $meta-blue;
  }

  .tool-name {
    font-size: 12px;
    color: $secondary-text;
    text-align: center;
  }
}

// 业绩目标区
.performance-section {
  .section-header {
    margin-bottom: 12px;
  }
}

.performance-chart {
  margin-bottom: 16px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.completion-rate {
  display: flex;
  flex-direction: column;

  .rate-value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
  }

  .rate-label {
    font-size: 12px;
    color: $secondary-text;
    margin-top: 4px;
  }

  &.success .rate-value {
    color: $success-green;
  }
}

.performance-month-picker {
  :deep(.el-input__wrapper) {
    border-radius: $border-radius-sm;
    width: 180px;
  }
}

.chart-area {
  position: relative;
  height: 120px;
  padding: 0 8px;
}

.chart-lines {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 60px;
}

.chart-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;

  &.target {
    top: 0;
    background: repeating-linear-gradient(
      90deg,
      $divider 0px,
      $divider 4px,
      transparent 4px,
      transparent 8px
    );
  }

  &.actual {
    top: 30px;
    background: linear-gradient(90deg, $success-green 0%, $success-green 70%, transparent 70%);
  }
}

.chart-dots {
  position: absolute;
  top: 12px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $divider;

    &.success {
      background: $success-green;
    }

    &.current {
      background: $meta-blue;
      box-shadow: 0 0 0 3px rgba($meta-blue, 0.2);
    }
  }
}

.chart-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: $disabled-text;
}

.chart-values {
  position: absolute;
  top: 45px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
}

.value-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;

  .value-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  &.current {
    color: $meta-blue;
    .value-dot {
      background: $meta-blue;
    }
  }

  &.target {
    color: $secondary-text;
    .value-dot {
      background: $divider;
    }
  }
}

.performance-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;

  .stat-label {
    width: 100px;
    font-size: 13px;
    color: #000000;
    flex-shrink: 0;
  }

  .stat-progress {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: $web-wash;
    border-radius: 4px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    &.orange .progress-fill {
      background: $orange;
    }

    &.green .progress-fill {
      background: $success-green;
    }

    &.blue .progress-fill {
      background: $meta-blue-light;
    }
  }

  .stat-value {
    font-size: 12px;
    color: $primary-text;
    white-space: nowrap;
  }

  .stat-gray {
    color: $disabled-text;
  }

  .stat-percent {
    color: $success-green;
  }
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  margin-top: 12px;
  color: $secondary-text;
  font-size: 12px;
  cursor: pointer;
  border-radius: $border-radius-sm;
  transition: all $transition-fast;

  &:hover {
    background: $web-wash;
    color: $meta-blue;
  }
}

// 达人大盘数据区
.data-section {
  .section-header {
    flex-wrap: wrap;
    gap: 12px;
  }
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-tabs {
  display: flex;
  gap: 4px;
}

.date-tab {
  padding: 4px 12px;
  font-size: 13px;
  color: $secondary-text;
  cursor: pointer;
  border-radius: $border-radius-sm;
  transition: all $transition-fast;

  &:hover {
    color: $primary-text;
  }

  &.active {
    background: $meta-blue;
    color: $white;
  }
}

.date-range {
  font-size: 12px;
  color: $disabled-text;
}

.status-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.status-tab {
  padding: 6px 12px;
  font-size: 13px;
  color: $secondary-text;
  cursor: pointer;
  border: 1px solid $divider;
  border-radius: $border-radius-sm;
  transition: all $transition-fast;

  &:hover {
    border-color: $meta-blue;
    color: $meta-blue;
  }

  &.active {
    background: rgba($meta-blue, 0.1);
    border-color: $meta-blue;
    color: $meta-blue;
  }
}

.data-table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th, td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid $divider;
  }

  th {
    color: $secondary-text;
    font-weight: 500;
    font-size: 12px;
  }

  tbody tr:hover {
    background: $web-wash;
  }
}

.talent-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.talent-detail {
  display: flex;
  flex-direction: column;
}

.talent-name {
  font-weight: 500;
  color: $primary-text;
}

.talent-nickname {
  font-size: 12px;
  color: $secondary-text;
}

.bd-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.source-tag {
  padding: 2px 8px;
  background: $web-wash;
  border-radius: $border-radius-sm;
  font-size: 12px;
  color: $secondary-text;
}

.status-tag {
  padding: 2px 8px;
  border-radius: $border-radius-sm;
  font-size: 12px;

  &.warning {
    background: rgba($warning-amber, 0.1);
    color: $warning-amber;
  }

  &.info {
    background: rgba($meta-blue-light, 0.1);
    color: $meta-blue-light;
  }

  &.primary {
    background: rgba($purple, 0.1);
    color: $purple;
  }

  &.success {
    background: rgba($success-green, 0.1);
    color: $success-green;
  }

  &.danger {
    background: rgba($error-red, 0.1);
    color: $error-red;
  }
}

.action-link {
  color: $meta-blue;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
}

// 分页
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-info {
  font-size: 12px;
  color: $secondary-text;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $divider;
  border-radius: $border-radius-sm;
  font-size: 13px;
  color: $secondary-text;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $meta-blue;
    color: $meta-blue;
  }

  &.active {
    background: $meta-blue;
    border-color: $meta-blue;
    color: $white;
  }
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: $secondary-text;
}

.page-input {
  width: 48px;
  height: 28px;
  border: 1px solid $divider;
  border-radius: $border-radius-sm;
  text-align: center;
  outline: none;

  &:focus {
    border-color: $meta-blue;
  }
}

.page-size {
  color: $disabled-text;
}

// 动态提醒区
.notification-section {
  margin-top: 16px;
}

.notification-tabs {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid $divider;
  padding-bottom: 12px;
}

.notif-tab {
  font-size: 14px;
  color: $secondary-text;
  cursor: pointer;
  padding-bottom: 12px;
  position: relative;
  transition: all $transition-fast;

  &:hover {
    color: $primary-text;
  }

  &.active {
    color: $primary-text;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: $meta-blue;
      border-radius: 2px 2px 0 0;
    }
  }
}

.more-link {
  margin-left: auto;
  font-size: 12px;
  color: $meta-blue;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: $warm-gray;
  border-radius: $border-radius-md;
}

.notif-tag {
  padding: 2px 8px;
  border-radius: $border-radius-sm;
  font-size: 12px;
  flex-shrink: 0;

  &.orange {
    background: rgba($orange, 0.1);
    color: $orange;
  }

  &.purple {
    background: rgba($purple, 0.1);
    color: $purple;
  }

  &.green {
    background: rgba($success-green, 0.1);
    color: $success-green;
  }

  &.green-dark {
    background: rgba($success-green, 0.2);
    color: darken($success-green, 10%);
  }
}

.notif-content {
  flex: 1;
  font-size: 13px;
  color: $primary-text;
  line-height: 1.5;
}

.notif-time {
  font-size: 12px;
  color: $disabled-text;
  flex-shrink: 0;
}
</style>

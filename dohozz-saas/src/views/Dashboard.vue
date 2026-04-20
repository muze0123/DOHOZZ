<template>
  <div class="dashboard-container">
    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-left">
        <!-- A区：logo、系统名、业务场景选择 -->
        <div class="logo-area">
          <img src="@/assets/DOHOZZ_LOOGO.png" alt="DOHOZZ" class="logo-img" />
          <span class="logo-text">DOHOZZ</span>
        </div>
        
        <el-dropdown class="scenario-dropdown" trigger="click" @command="handleScenarioChange">
          <div class="scenario-selector">
            <span class="scenario-text">{{ currentScenario === 'ecommerce' ? '带货' : '种草' }}</span>
            <span class="scenario-arrow"></span>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="scenario-dropdown-menu">
              <el-dropdown-item command="ecommerce" :class="{ active: currentScenario === 'ecommerce' }">达人带货</el-dropdown-item>
              <el-dropdown-item command="seeding" :class="{ active: currentScenario === 'seeding' }">内容种草</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="nav-divider"></div>

        <!-- B区：动态菜单 -->
        <nav class="b-nav-menu">
          <span
            v-for="menu in currentNavMenus"
            :key="menu"
            class="nav-item"
            :class="{ active: activeNavMenu === menu }"
            @click="activeNavMenu = menu"
          >
            {{ menu }}
          </span>
        </nav>
      </div>

      <div class="header-right">
        <!-- C区：基础服务功能图标 -->
        <div class="c-icons-area">
          <!-- 下载插件 -->
          <div class="c-btn-pill">
            <svg class="c-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            <span>下载插件</span>
          </div>

          <!-- 多语言选择 -->
          <el-dropdown trigger="hover" @command="handleLanguageChange">
            <div class="c-btn-lang">
              <svg class="c-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
              </svg>
              <span class="lang-text">{{ currentLanguage }}</span>
              <svg class="c-icon-arrow" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="中文" :class="{ 'is-active': currentLanguage === '中文' }">中文</el-dropdown-item>
                <el-dropdown-item command="English" :class="{ 'is-active': currentLanguage === 'English' }">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 任务列表 -->
          <el-tooltip content="任务列表" placement="bottom" :show-after="300">
            <div class="c-btn-circle">
              <svg class="c-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path d="M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"/>
              </svg>
            </div>
          </el-tooltip>

          <!-- 消息中心 -->
          <el-tooltip content="消息中心" placement="bottom" :show-after="300">
            <div class="c-btn-circle has-badge">
              <svg class="c-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <span class="badge">99</span>
            </div>
          </el-tooltip>

          <!-- 个人中心 -->
          <el-tooltip content="个人中心" placement="bottom" :show-after="300">
            <div class="c-btn-avatar">
              <el-avatar :size="32" :icon="UserIcon" class="header-avatar" />
            </div>
          </el-tooltip>
        </div>
      </div>
    </header>

    <div class="main-wrapper">
      <!-- 左侧导航栏 -->
      <aside class="left-sidebar">
        <div class="sidebar-menu">
          <template v-for="item in sidebarMenuItems" :key="item.name">
            <!-- 带子菜单的项 -->
            <template v-if="item.children && item.children.length">
              <div
                class="menu-item has-submenu"
                :class="{ active: activeSidebarMenu === item.name }"
                @click="toggleSubmenu(item.name)"
              >
                <div class="menu-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" v-html="item.icon"></svg>
                </div>
                <span>{{ item.name }}</span>
                <div class="submenu-arrow" :style="{ transform: openSubmenus[item.name] ? 'rotate(90deg)' : 'rotate(0deg)' }"></div>
              </div>
              <div class="submenu-container" v-show="openSubmenus[item.name]">
                <div
                  v-for="child in item.children"
                  :key="child.name"
                  class="menu-item submenu-item"
                  :class="{ active: activeSidebarMenu === child.name }"
                  @click="activeSidebarMenu = child.name"
                >
                  <span>{{ child.name }}</span>
                  <span v-if="child.tag" class="new-tag">{{ child.tag }}</span>
                </div>
              </div>
            </template>
            <!-- 无子菜单的项 -->
            <template v-else>
              <div
                class="menu-item"
                :class="{ active: activeSidebarMenu === item.name }"
                @click="activeSidebarMenu = item.name"
              >
                <div class="menu-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" v-html="item.icon"></svg>
                </div>
                <span>{{ item.name }}</span>
              </div>
            </template>
          </template>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 平台与用户信息合并区 -->
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
          
        <!-- 用户信息栏 (悬浮置顶) -->
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
            <span class="section-title">待办事项</span>
            <div class="section-desc">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span>当前与跟进达人相关的待办事项，请及时处理</span>
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
              <!-- 时间筛选 -->
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, h } from 'vue'
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
const currentLanguage = ref('中文')

const handleLanguageChange = (lang) => {
  currentLanguage.value = lang
  ElMessage.success(`语言已切换为 ${lang}`)
}

const currentScenario = ref('ecommerce')
const activeNavMenu = ref('达人合作')
const activeSidebarMenu = ref('工作台')
const openSubmenus = reactive({})

const toggleSubmenu = (name) => {
  openSubmenus[name] = !openSubmenus[name]
}

// B区导航菜单配置
const navMenuConfig = {
  ecommerce: ['达人合作', '内容中心', '指挥中台', '系统设置'],
  seeding: ['内容合作', '系统设置']
}

const currentNavMenus = computed(() => {
  return navMenuConfig[currentScenario.value] || []
})

const handleScenarioChange = (command) => {
  currentScenario.value = command
}

// 当业务场景切换时，重置B区菜单和左侧菜单
watch(currentScenario, (newVal) => {
  const menus = navMenuConfig[newVal]
  activeNavMenu.value = menus[0]
})

// 当B区菜单切换时，重置左侧激活菜单
watch(activeNavMenu, (newVal) => {
  const items = sidebarMenuItems.value
  if (items.length > 0) {
    activeSidebarMenu.value = items[0].name
  }
  // 重置子菜单展开状态
  Object.keys(openSubmenus).forEach(key => {
    openSubmenus[key] = false
  })
})

// SVG icon paths
const icons = {
  dashboard: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>',
  dataOps: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
  search: '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>',
  person: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
  group: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
  sample: '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/>',
  video: '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>',
  cooperation: '<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>',
  shop: '<path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>',
  order: '<path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8zM4 19h16v2H4v-2z"/>',
  globe: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',
  insight: '<path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>',
  ai: '<path d="M21 11.18V9.72c0-.47-.16-.92-.46-1.28L16.6 3.72c-.38-.46-.94-.72-1.54-.72H8.94c-.6 0-1.16.26-1.54.72L3.46 8.44c-.3.36-.46.81-.46 1.28v1.46c0 .65.23 1.25.62 1.71-.01.09-.02.17-.02.26v1.85c0 .83.34 1.58.88 2.12L6 18.65V21h12v-2.35l1.52-1.53c.54-.54.88-1.29.88-2.12v-1.85c0-.09-.01-.17-.02-.26.39-.46.62-1.06.62-1.71zm-2 4.82c0 .28-.11.54-.31.71l-1.69 1.7v1.59H7v-1.59l-1.69-1.7c-.2-.17-.31-.43-.31-.71v-1.85c0-.09.01-.17.02-.26.23.11.48.17.73.17h.25c.64 0 1.23-.27 1.65-.71l.71-.71.71.71c.42.44 1.01.71 1.65.71h.65c.64 0 1.23-.27 1.65-.71l.71-.71.71.71c.42.44 1.01.71 1.65.71H17c.25 0 .5-.06.73-.17.01.09.02.17.02.26v1.85zM19 11.18c0 .28-.11.54-.31.71l-.69.69-1.06-1.06-.71.71-.29.29c-.19.19-.44.29-.71.29h-.65c-.27 0-.52-.1-.71-.29L13.58 12l-.71.71-1.29 1.29c-.19.19-.44.29-.71.29h-.65c-.27 0-.52-.1-.71-.29L9.22 12.71l-.71-.71-1.06 1.06-.69-.69c-.2-.17-.31-.43-.31-.71V9.72c0-.12.04-.23.11-.32l3.94-4.72c.09-.12.24-.18.39-.18h6.12c.15 0 .3.06.39.18l3.94 4.72c.07.09.11.2.11.32v1.46z"/>',
  content: '<path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>',
  asset: '<path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"/>',
  launch: '<path d="M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm18-7c0-1.1-.9-2-2-2H7v1.63c3.96 1.28 7.09 4.41 8.37 8.37H19V7zm-2 7c0 1.1-.9 2-2 2h-.37C13.64 12.38 10.62 9.36 7 8.37V7h10v7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.07-4.93-11-11-11z"/>',
  bigscreen: '<path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>',
  team: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
  live: '<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>',
  product: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2V9h-2v8zm-4 0h2v-5H8v5zm8 0h2v-3h-2v3z"/>',
  members: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>',
  department: '<path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>',
  role: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>',
  config: '<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>',
  exchange: '<path d="M12.89 11.1c-1.78-.59-2.64-.96-2.64-1.9 0-1.02 1.11-1.39 1.81-1.39 1.31 0 1.79.99 1.9 1.34l1.58-.67c-.15-.45-.82-1.92-2.54-2.16V5h-2v1.3c-2.44.54-2.47 2.74-2.47 2.9 0 2.47 2.3 3.2 3.26 3.53 1.57.54 2.26 1.01 2.26 2.05 0 1.31-1.27 1.71-1.98 1.71-1.22 0-2.15-.95-2.39-1.98l-1.66.5c.52 1.96 1.97 2.5 2.98 2.69V19h2v-1.33c.78-.15 2.65-.84 2.65-3.15 0-2.27-1.94-3.09-2.76-3.42z"/><path d="M2 2h20v2H2V2zm0 18h20v2H2v-2z"/>',
  permission: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
  account: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/>',
  overview: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
  plan: '<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/>',
  performance: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2v-3h2v3zm0-5h-2V9h2v3zm4 5h-2V7h2v10z"/>'
}

// 左侧菜单数据配置
const sidebarMenuConfig = {
  // 带货场景
  ecommerce: {
    '达人合作': [
      { name: '工作台', icon: icons.dashboard },
      { name: '数据运营', icon: icons.dataOps },
      { name: '找达人', icon: icons.search, children: [
        { name: '达人库', tag: 'New' },
        { name: '智能推荐达人', tag: 'New' },
        { name: '商品找达人', tag: 'New' },
        { name: '达人榜单', tag: 'New' }
      ]},
      { name: '达人管理', icon: icons.person },
      { name: '批量建联', icon: icons.group },
      { name: '样品管理', icon: icons.sample },
      { name: '视频履约', icon: icons.video },
      { name: '合作管理', icon: icons.cooperation },
      { name: '团长管理', icon: icons.globe },
      { name: '店铺商品', icon: icons.shop },
      { name: '订单管理', icon: icons.order }
    ],
    '内容中心': [
      { name: '内容洞察', icon: icons.insight },
      { name: 'AI创作', icon: icons.ai },
      { name: '合作内容', icon: icons.content },
      { name: '内容资产', icon: icons.asset },
      { name: '投放管理', icon: icons.launch }
    ],
    '指挥中台': [
      { name: '大盘', icon: icons.dataOps },
      { name: '达播', icon: icons.live },
      { name: '商品', icon: icons.product },
      { name: '团队', icon: icons.team },
      { name: '内容', icon: icons.content },
      { name: '大屏', icon: icons.bigscreen }
    ],
    '系统设置': [
      { name: '成员管理', icon: icons.members },
      { name: '部门管理', icon: icons.department },
      { name: '角色管理', icon: icons.role },
      { name: '业务配置', icon: icons.config },
      { name: '汇率设置', icon: icons.exchange },
      { name: '权限管理', icon: icons.permission },
      { name: '账号信息', icon: icons.account }
    ]
  },
  // 种草场景
  seeding: {
    '内容合作': [
      { name: '数据概览', icon: icons.overview },
      { name: '营销计划', icon: icons.plan },
      { name: '达人管理', icon: icons.person },
      { name: '合作内容', icon: icons.content },
      { name: '绩效管理', icon: icons.performance },
      { name: '店铺商品', icon: icons.shop }
    ],
    '系统设置': [
      { name: '成员管理', icon: icons.members },
      { name: '部门管理', icon: icons.department },
      { name: '角色管理', icon: icons.role },
      { name: '业务配置', icon: icons.config },
      { name: '汇率设置', icon: icons.exchange },
      { name: '权限管理', icon: icons.permission },
      { name: '账号信息', icon: icons.account }
    ]
  }
}

const sidebarMenuItems = computed(() => {
  const scenarioConfig = sidebarMenuConfig[currentScenario.value]
  if (!scenarioConfig) return []
  return scenarioConfig[activeNavMenu.value] || []
})

const today = new Date()
const currentMonthStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`
const performanceMonth = ref(currentMonthStr)

const joinDateStr = '2025-01-01'
const diffTime = Math.abs(new Date() - new Date(joinDateStr))
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

const userInfo = reactive({
  name: '张三',
  tenure: diffDays,
  department: '部门名称XXX',
  role: '角色名称XXX'
})

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

$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

$transition-fast: 150ms ease;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  min-height: 100vh;
  background: $soft-gray;
  font-family: $font-family;
  color: $primary-text;
  font-size: 14px;
}

// 顶部导航栏
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background: $white;
  border-bottom: 1px solid $divider;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-img {
  width: 24px;
  height: 24px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: $primary-text;
}

.nav-divider {
  width: 1px;
  height: 16px;
  background: $divider;
  margin: 0 8px;
}

.scenario-dropdown {
  margin-left: 12px;
}

.scenario-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: $border-radius-sm;
  transition: background $transition-fast;

  &:hover {
    background: $web-wash;
  }
}

.scenario-text {
  font-size: 15px;
  color: $primary-text;
  font-weight: 500;
}

.scenario-arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #333;
  margin-top: 2px;
}

.b-nav-menu {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 8px;
}

.nav-item {
  font-size: 14px;
  color: $secondary-text;
  cursor: pointer;
  padding: 4px 0;
  position: relative;
  transition: color $transition-fast;

  &:hover {
    color: $primary-text;
  }

  &.active {
    color: $primary-text;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background: $primary-text;
      border-radius: 2px;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.c-icons-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.c-icon-svg {
  flex-shrink: 0;
}

.c-btn-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid #1677ff;
  color: #1677ff;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  background: white;
  transition: all $transition-fast;
  
  &:hover {
    background: #f0f5ff;
  }
}

.c-btn-lang {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: $border-radius-sm;
  cursor: pointer;
  color: $secondary-text;
  transition: all $transition-fast;

  &:hover {
    background: $web-wash;
    color: $primary-text;
  }

  .lang-text {
    font-size: 13px;
    white-space: nowrap;
  }

  .c-icon-arrow {
    margin-top: 1px;
    opacity: 0.6;
  }
}

.c-btn-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  color: $secondary-text;
  background: $white;
  transition: all $transition-fast;

  &:hover {
    border-color: #bfbfbf;
    color: $primary-text;
  }
  
  &.has-badge {
    .badge {
      position: absolute;
      top: -4px;
      right: -8px;
      background: #ff4d4f;
      color: $white;
      font-size: 11px;
      border-radius: 10px;
      padding: 0 5px;
      height: 16px;
      line-height: 16px;
      transform: scale(0.9);
    }
  }
}

.c-btn-avatar {
  cursor: pointer;

  .header-avatar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: $white;
    transition: box-shadow $transition-fast;

    &:hover {
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
    }
  }
}

:deep(.scenario-dropdown-menu .el-dropdown-menu__item.active) {
  color: $meta-blue;
  background-color: #f0f5ff;
}

// 主内容包装
.main-wrapper {
  display: flex;
}

// 左侧导航栏
.left-sidebar {
  width: 210px;
  background: $white;
  border-right: 1px solid $divider;
  padding: 8px 0;
  flex-shrink: 0;
  position: sticky;
  top: 48px;
  height: calc(100vh - 48px);
  overflow-y: auto;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: $secondary-text;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  margin: 2px 8px;
  border-radius: 8px;

  &:hover {
    background: #f0f5ff;
    color: $meta-blue;
    transform: translateX(4px);
  }
  
  &:active {
    transform: scale(0.98);
  }

  &.active, &.selected {
    background: #e6f0ff;
    color: $meta-blue;
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: $meta-blue;
      border-radius: 0 4px 4px 0;
    }

    .menu-icon {
      color: $meta-blue;
    }
  }

  .submenu-arrow {
    margin-left: auto;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid currentColor;
    transition: transform 0.3s ease;
  }

  .new-tag {
    margin-left: auto;
    padding: 1px 6px;
    background: $error-red;
    color: $white;
    font-size: 10px;
    border-radius: 4px;
  }

  .submenu-arrow {
    margin-left: auto;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid currentColor;
  }
}

.menu-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;

  svg {
    width: 100%;
    height: 100%;
  }
}

.menu-divider {
  height: 1px;
  background: $divider;
  margin: 8px 16px;
}

.submenu-container {
  display: flex;
  flex-direction: column;
  padding-left: 36px;
  margin-bottom: 8px;
}

.submenu-item {
  padding: 8px 16px;
  margin: 2px 0 2px 8px;
  font-size: 13px;
  border-radius: 6px;
  position: relative;
  
  &::before {
    display: none !important; /* cancel the active left border for submenus */
  }
  
  &:hover {
    transform: translateX(2px);
  }
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

// 主内容区
.main-content {
  flex: 1;
  padding: 0 16px 24px;
  min-width: 0;
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
  
  /* When stuck, a nice shadow gives floating illusion */
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

.user-tenure {
  font-size: 12px;
  color: #999;

  .tenure-value {
    color: $primary-text;
    font-weight: 500;
  }
}

.user-filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  :deep(.el-select) {
    width: 120px;
  }
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
  gap: 8px;
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

    .tool-icon {
      color: $meta-blue;
    }
  }
}

.tool-icon {
  width: 24px;
  height: 24px;
  color: $secondary-text;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.tool-name {
  font-size: 12px;
  color: $secondary-text;
  text-align: center;
}

// 内容底部
.content-bottom {
  display: flex;
  gap: 16px;
}

// 达人大盘数据区
.data-section {
  flex: 1;
  min-width: 0;
}

.status-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.status-tab {
  padding: 6px 12px;
  background: $white;
  border: 1px solid $divider;
  border-radius: $border-radius-sm;
  font-size: 12px;
  color: $secondary-text;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    color: $meta-blue;
    border-color: $meta-blue;
  }

  &.active {
    background: $meta-blue;
    border-color: $meta-blue;
    color: $white;
  }
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.date-tabs {
  display: flex;
  gap: 4px;
}

.date-tab {
  padding: 4px 12px;
  background: $white;
  border: 1px solid $divider;
  border-radius: $border-radius-sm;
  font-size: 12px;
  color: $secondary-text;
  cursor: pointer;

  &.active {
    background: $meta-blue;
    border-color: $meta-blue;
    color: $white;
  }
}

.date-range {
  font-size: 12px;
  color: $secondary-text;
}

.data-table-wrapper {
  overflow-x: auto;
  border: 1px solid $divider;
  border-radius: $border-radius-md;
  margin-bottom: 16px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th, td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid $divider;
  }

  th {
    background: $soft-gray;
    color: $secondary-text;
    font-weight: 500;
  }

  td {
    color: $primary-text;
  }

  tr:last-child td {
    border-bottom: none;
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
}

.talent-nickname {
  font-size: 11px;
  color: $secondary-text;
}

.bd-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.source-tag {
  padding: 2px 6px;
  background: $web-wash;
  border-radius: 4px;
  font-size: 11px;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;

  &.warning {
    background: rgba($warning-amber, 0.1);
    color: $warning-amber;
  }

  &.success {
    background: rgba($success-green, 0.1);
    color: $success-green;
  }

  &.danger {
    background: rgba($error-red, 0.1);
    color: $error-red;
  }

  &.info {
    background: rgba($meta-blue, 0.1);
    color: $meta-blue;
  }

  &.primary {
    background: rgba($meta-blue-light, 0.1);
    color: $meta-blue;
  }
}

.action-link {
  color: $meta-blue;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pagination-info {
  font-size: 12px;
  color: $secondary-text;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.page-btn {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $divider;
  border-radius: $border-radius-sm;
  font-size: 12px;
  color: $secondary-text;
  cursor: pointer;
  background: $white;

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
  width: 40px;
  height: 28px;
  padding: 0 6px;
  border: 1px solid $divider;
  border-radius: $border-radius-sm;
  font-size: 12px;
  text-align: center;
}

.page-size {
  margin-left: 8px;
}

// 业绩目标区
.performance-section {
  /* width is controlled by upper layout */
}

/* 适配日期选择器 */
.performance-month-picker {
  width: 110px !important;
}
.performance-month-picker :deep(.el-input__wrapper) {
  box-shadow: none !important;
  background: transparent;
  padding: 0;
  cursor: pointer;
}
.performance-month-picker :deep(.el-input__inner) {
  color: #65676B;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  cursor: pointer;
}
.performance-month-picker :deep(.el-input__suffix) {
  display: none;
}

.performance-chart {
  margin-bottom: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.completion-rate {
  &.success {
    .rate-value {
      font-size: 24px;
      font-weight: 600;
      color: $success-green;
    }
    .rate-label {
      font-size: 12px;
      color: $secondary-text;
    }
  }
}

.chart-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: $secondary-text;
  cursor: pointer;
}

.chart-area {
  position: relative;
  height: 100px;
  padding: 0 20px;
}

.chart-lines {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 60px;
  height: 60px;
}

.chart-line {
  position: absolute;
  height: 2px;
  left: 0;
  right: 0;

  &.target {
    top: 0;
    background: linear-gradient(90deg, transparent 0%, $warning-amber 100%);
    opacity: 0.3;
  }

  &.actual {
    top: 10px;
    background: linear-gradient(90deg, transparent 0%, $success-green 100%);
    height: 3px;
  }
}

.chart-dots {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 60px;
  display: flex;
  justify-content: space-between;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.success {
    background: $success-green;
  }

  &.current {
    width: 10px;
    height: 10px;
    background: $success-green;
    box-shadow: 0 0 0 2px rgba($success-green, 0.3);
  }
}

.chart-labels {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 60px;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: $disabled-text;
}

.chart-values {
  position: absolute;
  right: 0;
  top: 30px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.value-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;

  .value-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &.current {
    color: $success-green;
    .value-dot {
      background: $success-green;
    }
  }

  &.target {
    color: $disabled-text;
    .value-dot {
      background: $warning-amber;
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
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 12px;
  color: $secondary-text;
}

.stat-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: $web-wash;
  border-radius: 3px;
  overflow: hidden;

  &.orange .progress-fill {
    background: $warning-amber;
  }

  &.green .progress-fill {
    background: $success-green;
  }

  &.blue .progress-fill {
    background: $meta-blue;
  }
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
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
  color: $meta-blue;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px;
  margin-top: 12px;
  border: 1px dashed $divider;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-size: 12px;
  color: $secondary-text;
  transition: all $transition-fast;

  &:hover {
    border-color: $meta-blue;
    color: $meta-blue;
  }
}

// 动态提醒区
.notification-section {
  margin-top: 0;
}

.notification-tabs {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid $divider;
}

.notif-tab {
  font-size: 14px;
  color: $secondary-text;
  cursor: pointer;
  padding: 4px 0;
  border-bottom: 2px solid transparent;

  &.active {
    color: $primary-text;
    font-weight: 500;
    border-bottom-color: $meta-blue;
  }
}

.more-link {
  margin-left: auto;
  font-size: 12px;
  color: $meta-blue;
  cursor: pointer;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: $warm-gray;
  border-radius: $border-radius-md;
  border-left: 3px solid transparent;
}

.notif-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  width: fit-content;

  &.orange {
    background: rgba($orange, 0.1);
    color: $orange;
    border-left-color: $orange;
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
    background: rgba(darken($success-green, 10%), 0.1);
    color: darken($success-green, 10%);
  }
}

.notif-content {
  font-size: 12px;
  color: $secondary-text;
  line-height: 1.5;
}

.notif-time {
  font-size: 11px;
  color: $disabled-text;
}

// Responsive
@media (max-width: 1400px) {
  .content-bottom {
    flex-direction: column;
  }

  .performance-section {
    width: 100%;
  }
}

@media (max-width: 1200px) {
  .left-sidebar {
    width: 180px;
  }

  .todo-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .quick-tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .left-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .user-info-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .todo-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .guide-cards {
    grid-template-columns: 1fr;
  }
}
</style>

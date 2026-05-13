<template>
  <div class="com-layout">
    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-left">
        <!-- A区：logo、系统名、业务场景选择 -->
        <div class="logo-area">
          <img src="@/assets/images/DOHOZZ_LOOGO.png" alt="DOHOZZ" class="logo-img" />
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
            <div class="c-btn-circle" @click="showTaskCenter = true">
              <svg class="c-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                <path d="M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"/>
              </svg>
            </div>
          </el-tooltip>

          <!-- 消息中心 -->
          <el-tooltip content="消息中心" placement="bottom" :show-after="300">
            <div class="c-btn-circle has-badge" @click="handleMessageCenterClick">
              <svg class="c-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <span class="badge">99</span>
            </div>
          </el-tooltip>

          <!-- 个人中心 -->
          <el-dropdown
            trigger="hover"
            :show-timeout="100"
            :hide-timeout="200"
            @command="handleUserCommand"
          >
            <div class="c-btn-avatar">
              <el-avatar :size="32" :icon="UserIcon" class="header-avatar" />
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown-menu">
                <!-- 用户信息区域 -->
                <div class="user-info-section">
                  <el-avatar :size="60" :icon="UserIcon" class="user-avatar-large" />
                  <div class="user-name-row">
                    <span class="user-name-text">张三</span>
                    <span class="edit-btn" @click="handleEditProfile">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </span>
                  </div>
                </div>
                <el-dropdown-item command="accountInfo">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.93 0 3.5 1.57 3.5 3.5S13.93 12 12 12s-3.5-1.57-3.5-3.5S10.07 5 12 5zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/>
                  </svg>
                  <span>账号信息</span>
                  <svg class="arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </el-dropdown-item>
                <el-dropdown-item command="myData">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                  <span>我的数据</span>
                  <svg class="arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </el-dropdown-item>
                <el-dropdown-item command="operationLog">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <span>操作日志</span>
                  <svg class="arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </el-dropdown-item>
                <div class="dropdown-divider"></div>
                <el-dropdown-item command="logout">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  <span>退出登录</span>
                  <svg class="arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <div :class="['main-wrapper', { fullscreen: isFullscreenMainWrapper }]">
      <!-- 左侧导航栏 -->
      <aside class="left-sidebar" v-if="!isMessageCenterPage && !isFullscreenMainWrapper">
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
                  @click="handleSubmenuItemClick(child.name, item.name)"
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
                @click="handleMenuItemClick(item.name)"
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
        <router-view />
      </main>
    </div>

    <!-- 任务中心抽屉 -->
    <TaskCenter v-model="showTaskCenter" />

    <!-- 个人信息弹窗 -->
    <ProfileDialog v-model="showProfileDialog" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, h, provide, onMounted, nextTick } from 'vue'
import { ElMessage, ElAvatar } from 'element-plus'
import router from '@/router'
import DataOverview from './DataOverview.vue'
import SeedingDataOverview from './SeedingDataOverview.vue'
import Workspace from './Workspace.vue'
import Performance from './Performance.vue'
import PerformanceManagement from './PerformanceManagement.vue'
import PerformanceTarget from './PerformanceTarget.vue'
import ReportCenter from './ReportCenter.vue'
import CreateReport from './CreateReport.vue'
import Commission from './Commission.vue'
import CommissionHelp from './CommissionHelp.vue'
import InfluencerDatabase from './InfluencerDatabase.vue'
import BrandDiscovery from './BrandDiscovery.vue'
import NaturalOrderInfluencer from './NaturalOrderInfluencer.vue'
import ProductSearchInfluencer from './ProductSearchInfluencer.vue'
import SmartRecommendation from './SmartRecommendation.vue'
import ImportInfluencerLeads from './ImportInfluencerLeads.vue'
import InfluencerPublicPool from './InfluencerPublicPool.vue'
import MyInfluencer from './MyInfluencer.vue'
import WhiteList from './WhiteList.vue'
import BlackList from './BlackList.vue'
import AccountInfo from './AccountInfo.vue'
import TagManagement from './TagManagement.vue'
import FollowUpRecords from './FollowUpRecords.vue'
import SampleManagement from './SampleManagement.vue'
import VideoFulfillment from './VideoFulfillment.vue'
import CooperationManagement from './CooperationManagement.vue'
import LiveRecording from './LiveRecording.vue'
import OutreachTask from './OutreachTask.vue'
import InvitationManagement from './InvitationManagement.vue'
import TemplateManagement from './TemplateManagement.vue'
import CollaborationLive from './CollaborationLive.vue'
import ShoppingVideo from './ShoppingVideo.vue'
import NonCartVideo from './NonCartVideo.vue'
import MyTrackedInfluencers from './MyTrackedInfluencers.vue'
import PlanManagement from './PlanManagement.vue'
import SeedingSampleManagement from './SeedingSampleManagement.vue'
import ContentManagement from './ContentManagement.vue'
import EnterpriseInfluencer from './EnterpriseInfluencer/EnterpriseInfluencer.vue'
import InfluencerTags from './InfluencerTags/InfluencerTags.vue'
import ContentTags from './ContentTags/ContentTags.vue'
import ScriptManagement from './ScriptManagement/ScriptManagement.vue'
import BrandInsight from './BrandInsight.vue'
import IndustryHot from './IndustryHot.vue'
import LeaderList from './LeaderList.vue'
import LeaderCooperation from './LeaderCooperation.vue'
import ProductLibrary from './ProductLibrary.vue'
import ProductAnalysis from './ProductAnalysis.vue'
import ShopManagement from './ShopManagement.vue'
import OrderManagement from './OrderManagement.vue'
import MemberManagement from './MemberManagement.vue'
import DepartmentManagement from './DepartmentManagement.vue'
import RoleManagement from './RoleManagement.vue'
import BusinessConfig from './BusinessConfig.vue'
import MessageSettings from './MessageSettings.vue'
import ExchangeRate from './ExchangeRate.vue'
import TaskCenter from './components/TaskCenter.vue'
import SpuManagement from './SpuManagement.vue'
import ProductLink from './ProductLink.vue'
import ProductShopAnalysis from './ProductShopAnalysis.vue'
import AIFilmAnalysis from './AIFilmAnalysis.vue'
import AIRewrite from './AIRewrite.vue'
import ExtractScript from './ExtractScript.vue'
import CommandCenter from './CommandCenter.vue'
import LiveStreamAnalysis from './LiveStreamAnalysis.vue'
import TeamAnalysis from './TeamAnalysis.vue'
import ContentAnalysis from './ContentAnalysis.vue'
import BigScreen from './BigScreen.vue'
import IconCamera from '@/components/icons/IconCamera.vue'
import ProfileDialog from './components/ProfileDialog.vue'

const UserIcon = {
  render() {
    return h('i', { class: 'iconfont icon-yonghu' })
  },
  h
}

const currentLanguage = ref('中文')

const handleLanguageChange = (lang) => {
  currentLanguage.value = lang
  ElMessage.success(`语言已切换为 ${lang}`)
}

const currentScenario = ref('ecommerce')
const activeNavMenu = ref('达人合作')
const activeSidebarMenu = ref(localStorage.getItem('lastActiveMenu') || '工作台')
const thirdLevelPage = ref(localStorage.getItem('lastThirdLevelPage') || '') // 用于第三层级页面，如创建报表
const openSubmenus = reactive({})
const isRestoring = ref(false) // 标记是否正在恢复保存的菜单状态
const isRouteNavigation = ref(false) // 标记是否为路由变化导致的菜单切换
const showTaskCenter = ref(false) // 控制任务中心抽屉显示
const showMessageCenter = ref(false) // 控制消息中心显示
const showProfileDialog = ref(false) // 控制个人信息弹窗显示

// 判断是否为消息中心页面
const isMessageCenterPage = computed(() => router.currentRoute.value.path === '/message-center')

// 判断是否为全屏主内容区（消息中心等独立页面）
const isFullscreenMainWrapper = computed(() => router.currentRoute.value.path === '/message-center')

// 用户下拉菜单命令处理
const handleUserCommand = (command) => {
  switch (command) {
    case 'accountInfo':
      // 跳转到系统设置-账号信息
      activeNavMenu.value = '系统设置'
      activeSidebarMenu.value = '账号信息'
      openSubmenus['系统设置'] = true
      break
    case 'myData':
      // TODO: 跳转到BD数据页面
      ElMessage.info('我的数据 - 功能开发中')
      break
    case 'operationLog':
      // TODO: 跳转到操作日志页面
      ElMessage.info('操作日志 - 功能开发中')
      break
    case 'logout':
      // 退出登录
      localStorage.removeItem('auth_token')
      localStorage.removeItem('lastActiveMenu')
      localStorage.removeItem('lastThirdLevelPage')
      router.push('/login')
      break
  }
}

// 编辑个人信息弹窗
const handleEditProfile = () => {
  showProfileDialog.value = true
}

// 消息中心点击处理
const handleMessageCenterClick = () => {
  // 新开标签页打开消息中心
  window.open('/message-center', '_blank')
}

// 提供给子组件的方法
const setThirdLevelPage = (page) => {
  thirdLevelPage.value = page
}

provide('setThirdLevelPage', setThirdLevelPage)
provide('thirdLevelPage', thirdLevelPage)

const navigateToMenu = (menuName) => {
  showMessageCenter.value = false
  activeSidebarMenu.value = menuName
  thirdLevelPage.value = ''
  
  // 确保侧边栏菜单展开
  if (menuName === '消息设置' || menuName === '成员管理' || menuName === '部门管理' || menuName === '角色管理' || menuName === '业务配置' || menuName === '汇率设置' || menuName === '账号信息') {
    openSubmenus['系统设置'] = true
  }
}
provide('navigateToMenu', navigateToMenu)
provide('toggleMessageCenter', handleMessageCenterClick)

watch(activeSidebarMenu, (newVal) => {
  localStorage.setItem('lastActiveMenu', newVal)
})

watch(thirdLevelPage, (newVal) => {
  localStorage.setItem('lastThirdLevelPage', newVal)
})

// 根据路由路径同步侧边栏菜单
const syncSidebarFromRoute = (path) => {
  // 标记为路由变化导致的菜单切换，防止 watch activeNavMenu 重置菜单
  isRouteNavigation.value = true

  // 去掉查询参数，只保留路径进行匹配
  const pathWithoutQuery = path.split('?')[0]

  // 消息中心页面不选中任何菜单
  if (pathWithoutQuery === '/message-center') {
    activeNavMenu.value = ''
    activeSidebarMenu.value = ''
    isRouteNavigation.value = false
    return
  }

  const config = sidebarMenuConfig[currentScenario.value]
  if (!config) {
    isRouteNavigation.value = false
    return
  }

  for (const [navMenuName, parent] of Object.entries(config)) {
    for (const item of parent) {
      if (item.path === pathWithoutQuery) {
        activeNavMenu.value = navMenuName
        activeSidebarMenu.value = item.name
        isRouteNavigation.value = false
        return
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === pathWithoutQuery) {
            activeNavMenu.value = navMenuName
            activeSidebarMenu.value = child.name
            // 展开对应的父级菜单
            for (const key of Object.keys(openSubmenus)) {
              openSubmenus[key] = false
            }
            const parentName = item.name
            if (openSubmenus.hasOwnProperty(parentName)) {
              openSubmenus[parentName] = true
            }
            isRouteNavigation.value = false
            return
          }
        }
      }
    }
  }

  // 如果没找到匹配的路由，重置标记
  isRouteNavigation.value = false
}

// 监听路由变化，同步侧边栏菜单选中状态
watch(() => router.currentRoute.value.path, (newPath) => {
  syncSidebarFromRoute(newPath)
})

const restoreComplete = ref(false)

onMounted(() => {
  // 初始化同步侧边栏菜单状态
  syncSidebarFromRoute(router.currentRoute.value.path)

  // 如果是消息中心页面，不恢复之前保存的菜单状态
  if (router.currentRoute.value.path === '/message-center') {
    return
  }

  const lastMenu = localStorage.getItem('lastActiveMenu')
  if (lastMenu) {
    // 标记为恢复状态，防止 watch ActiveNavMenu 重置菜单
    isRestoring.value = true

    // 先根据保存的菜单找到对应的 nav menu
    const scenarioConfig = sidebarMenuConfig[currentScenario.value]
    for (const navMenu of Object.keys(scenarioConfig)) {
      const items = scenarioConfig[navMenu]
      const found = items.find(item =>
        item.name === lastMenu || (item.children && item.children.some(child => child.name === lastMenu))
      )
      if (found) {
        activeNavMenu.value = navMenu
        break
      }
    }

    // 再打开对应的子菜单并设置选中菜单
    nextTick(() => {
      // 先打开子菜单
      sidebarMenuItems.value.forEach(item => {
        if (item.children && item.children.some(child => child.name === lastMenu)) {
          openSubmenus[item.name] = true
        }
      })
      // 最后设置选中的侧边栏菜单
      activeSidebarMenu.value = lastMenu

      // 延迟标记恢复完成，确保 DOM 已更新
      setTimeout(() => {
        isRestoring.value = false
        restoreComplete.value = true
      }, 100)
    })
  } else {
    restoreComplete.value = true
  }

  // 立即标记恢复完成，不等待 setTimeout
  // 这样可以确保在路由切换时，watch(activeNavMenu) 能正确判断是否为用户点击
  restoreComplete.value = true
})

const toggleSubmenu = (name) => {
  // 如果当前菜单已展开，则收起
  if (openSubmenus[name]) {
    openSubmenus[name] = false
    return
  }
  // 否则展开所选菜单，收起其他所有菜单
  Object.keys(openSubmenus).forEach(key => {
    openSubmenus[key] = false
  })
  openSubmenus[name] = true
}

// 查找菜单项的路径
const findMenuItemPath = (menuName) => {
  const config = sidebarMenuConfig[currentScenario.value]
  if (!config) return null

  for (const parent of Object.values(config)) {
    for (const item of parent) {
      if (item.name === menuName && item.path) {
        return item.path
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.name === menuName && child.path) {
            return child.path
          }
        }
      }
    }
  }
  return null
}

const handleSubmenuItemClick = (childName, parentName) => {
  const path = findMenuItemPath(childName)
  if (path) {
    router.push(path)
  }
  activeSidebarMenu.value = childName
  thirdLevelPage.value = ''
  showMessageCenter.value = false
  Object.keys(openSubmenus).forEach(key => {
    if (key !== parentName) {
      openSubmenus[key] = false
    }
  })
}

const handleMenuItemClick = (itemName) => {
  // 查找菜单项是否有直接路径
  const path = findMenuItemPath(itemName)
  if (path) {
    router.push(path)
  }
  activeSidebarMenu.value = itemName
  thirdLevelPage.value = ''
  showMessageCenter.value = false
  // 收起所有展开的子菜单
  Object.keys(openSubmenus).forEach(key => {
    openSubmenus[key] = false
  })
  // 如果点击的是系统设置，展开子菜单并选中第一个
  if (itemName === '系统设置') {
    openSubmenus['系统设置'] = true
    activeSidebarMenu.value = '成员管理'
  }
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

// 当B区菜单切换时，重置左侧激活菜单并导航到第一个页面
watch(activeNavMenu, (newVal, oldVal) => {
  // 如果正在恢复保存的菜单状态，跳过用户点击逻辑
  if (isRestoring.value) {
    return
  }

  // 如果新的 nav menu 已经包含了当前选中的 sidebar item，不重置（保持路由对应的选中状态）
  if (newVal && oldVal && newVal !== oldVal) {
    const config = sidebarMenuConfig[currentScenario.value]
    if (config && config[newVal]) {
      const navItems = config[newVal]
      const isCurrentItemInNav = navItems.some(item => {
        if (item.name === activeSidebarMenu.value) return true
        if (item.children) {
          return item.children.some(child => child.name === activeSidebarMenu.value)
        }
        return false
      })
      if (isCurrentItemInNav) {
        return
      }
    }
  }

  // 用户点击后标记恢复完成
  restoreComplete.value = true

  // 检查当前 sidebar item 是否已经属于新的 nav menu，如果是则不重置
  const currentSidebarItem = activeSidebarMenu.value
  if (currentSidebarItem) {
    const config = sidebarMenuConfig[currentScenario.value]
    if (config && config[newVal]) {
      const navItems = config[newVal]
      const isCurrentItemInNav = navItems.some(item => {
        if (item.name === currentSidebarItem) return true
        if (item.children) {
          return item.children.some(child => child.name === currentSidebarItem)
        }
        return false
      })
      if (isCurrentItemInNav) {
        // 当前选中项已属于新 nav menu，保持不变
        return
      }
    }
  }

  const items = sidebarMenuItems.value
  if (items.length > 0) {
    // 内容中心默认展开内容洞察，并选中品牌洞察
    if (newVal === '内容中心') {
      activeSidebarMenu.value = '品牌洞察'
      // 展开内容洞察子菜单
      Object.keys(openSubmenus).forEach(key => {
        openSubmenus[key] = false
      })
      openSubmenus['内容洞察'] = true
      // 导航到品牌洞察页面
      router.push('/brand-insight')
    } else if (newVal === '系统设置') {
      // 系统设置默认选中成员管理
      activeSidebarMenu.value = '成员管理'
      // 展开系统设置子菜单
      Object.keys(openSubmenus).forEach(key => {
        openSubmenus[key] = false
      })
      openSubmenus['系统设置'] = true
      // 导航到成员管理页面
      router.push('/member-management')
    } else {
      activeSidebarMenu.value = items[0].name
      // 重置子菜单展开状态
      Object.keys(openSubmenus).forEach(key => {
        openSubmenus[key] = false
      })
      // 如果有子菜单，展开第一个子菜单并导航到其页面
      if (items[0].children && items[0].children.length > 0) {
        const firstChild = items[0].children[0]
        activeSidebarMenu.value = firstChild.name
        openSubmenus[items[0].name] = true
        if (firstChild.path) {
          router.push(firstChild.path)
        }
      } else if (items[0].path) {
        // 一级菜单直接导航
        router.push(items[0].path)
      }
    }
  }
  thirdLevelPage.value = ''
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
  messageSettings: '<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>',
  exchange: '<path d="M12.89 11.1c-1.78-.59-2.64-.96-2.64-1.9 0-1.02 1.11-1.39 1.81-1.39 1.31 0 1.79.99 1.9 1.34l1.58-.67c-.15-.45-.82-1.92-2.54-2.16V5h-2v1.3c-2.44.54-2.47 2.74-2.47 2.9 0 2.47 2.3 3.2 3.26 3.53 1.57.54 2.26 1.01 2.26 2.05 0 1.31-1.27 1.71-1.98 1.71-1.22 0-2.15-.95-2.39-1.98l-1.66.5c.52 1.96 1.97 2.5 2.98 2.69V19h2v-1.33c.78-.15 2.65-.84 2.65-3.15 0-2.27-1.94-3.09-2.76-3.42z"/><path d="M2 2h20v2H2V2zm0 18h20v2H2v-2z"/>',
  permission: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
  account: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/>',
  overview: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
  plan: '<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/>',
  performance: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2V7h2v10zm4 5h-2v-3h2v3z"/>'
}

// 左侧菜单数据配置
const sidebarMenuConfig = {
  // 带货场景
  ecommerce: {
    '达人合作': [
      { name: '工作台', icon: icons.dashboard, path: '/workspace' },
      { name: '数据运营', icon: icons.dataOps, children: [
        { name: '数据概览', path: '/data-overview' },
        { name: '绩效管理', path: '/performance' },
        { name: '提成管理', path: '/commission' },
        { name: '报表中心', path: '/report-center' },
        { name: '业绩目标', path: '/performance-target' }
      ]},
      { name: '找达人', icon: icons.search, children: [
        { name: '达人库', path: '/influencer-database' },
        { name: '智能推荐达人', path: '/smart-recommendation' },
        { name: '品牌找达人', path: '/brand-discovery' },
        { name: '商品找达人', path: '/product-search-influencer' },
        { name: '自然出单达人', path: '/natural-order-influencer' },
        { name: '导入达人线索', path: '/import-influencer-leads' }
      ]},
      { name: '达人管理', icon: icons.person, children: [
        { name: '达人公海', path: '/influencer-public-pool' },
        { name: '我的达人', path: '/my-influencer' },
        { name: '白名单', path: '/white-list' },
        { name: '黑名单', path: '/black-list' },
        { name: '标签管理', path: '/tag-management' },
        { name: '跟进记录', path: '/follow-up-records' }
      ]},
      { name: '批量建联', icon: icons.group, children: [
        { name: '建联任务', path: '/outreach-task' },
        { name: '邀约管理', path: '/invitation-management' },
        { name: '模板管理', path: '/template-management' }
      ]},
      { name: '样品管理', icon: icons.sample, path: '/sample-management' },
      { name: '视频履约', icon: icons.video, path: '/video-fulfillment' },
      { name: '合作管理', icon: icons.cooperation, path: '/cooperation-management' },
      { name: '团长管理', icon: icons.globe, children: [
        { name: '团长列表', path: '/leader-list' },
        { name: '团长合作', path: '/leader-cooperation' }
      ]},
      { name: '店铺商品', icon: icons.shop, children: [
        { name: '商品库', path: '/product-library' },
        { name: '商品分析', path: '/product-analysis' },
        { name: '店铺管理', path: '/shop-management' }
      ]},
      { name: '订单管理', icon: icons.order, path: '/order-management' }
    ],
    '内容中心': [
      { name: '内容洞察', icon: icons.insight, children: [
        { name: '品牌洞察', path: '/brand-insight' },
        { name: '行业热点', path: '/industry-hot' }
      ]},
      { name: 'AI创作', icon: icons.ai, children: [
        { name: 'AI拉片', path: '/ai-film-analysis' },
        { name: '提取脚本', path: '/extract-script' },
        { name: 'AI仿写', path: '/ai-rewrite' }
      ]},
      { name: '合作内容', icon: icons.content, children: [
        { name: '带货视频', path: '/shopping-video' },
        { name: '非挂车视频', path: '/non-cart-video' },
        { name: '合作直播', path: '/collaboration-live' },
        { name: '直播录屏', path: '/live-recording', tag: 'New' },
        { name: '追踪达人', path: '/my-tracked-influencers' }
      ]},
      { name: '内容资产', icon: icons.asset, path: '/content-asset' },
      { name: '投放管理', icon: icons.launch, path: '/launch-management' }
    ],
    '指挥中台': [
      { name: '大盘', icon: icons.dataOps, path: '/command-center' },
      { name: '达播', icon: icons.live, path: '/live-stream-analysis' },
      { name: '商品', icon: icons.product, path: '/command-center/product-shop-analysis' },
      { name: '团队', icon: icons.team, path: '/team-analysis' },
      { name: '内容', icon: icons.content, path: '/content-analysis' },
      { name: '大屏', icon: icons.bigscreen, path: '/big-screen' }
    ],
    '系统设置': [
      { name: '成员管理', icon: icons.members, path: '/member-management' },
      { name: '部门管理', icon: icons.department, path: '/department-management' },
      { name: '角色管理', icon: icons.role, path: '/role-management' },
      { name: '业务配置', icon: icons.config, path: '/business-config' },
      { name: '消息设置', icon: icons.messageSettings, path: '/message-settings' },
      { name: '汇率设置', icon: icons.exchange, path: '/exchange-rate' },
      { name: '账号信息', icon: icons.account, path: '/account-info' }
    ]
  },
  // 种草场景
  seeding: {
    '内容合作': [
      { name: '数据概览', icon: icons.overview, path: '/data-overview' },
      { name: '营销计划', icon: icons.plan, children: [
        { name: '计划管理', path: '/plan-management' },
        { name: '寄样管理', path: '/seeding-sample-management' }
      ]},
      { name: '达人管理', icon: icons.person, children: [
        { name: '达人公海', path: '/influencer-public-pool' },
        { name: '企业达人库', path: '/enterprise-influencer' },
        { name: '达人标签', path: '/influencer-tags' }
      ]},
      { name: '合作内容', icon: icons.content, children: [
        { name: '内容管理', path: '/content-management' },
        { name: '内容标签', path: '/content-tags' },
        { name: '脚本管理', path: '/script-management' }
      ]},
      { name: '绩效管理', icon: icons.performance, path: '/performance-management' },
      { name: '店铺商品', icon: icons.shop, children: [
        { name: 'SPU管理', path: '/spu-management' },
        { name: '商品链接', path: '/product-link' },
        { name: '店铺管理', path: '/shop-management' }
      ]}
    ],
    '系统设置': [
      { name: '成员管理', icon: icons.members, path: '/member-management' },
      { name: '部门管理', icon: icons.department, path: '/department-management' },
      { name: '角色管理', icon: icons.role, path: '/role-management' },
      { name: '业务配置', icon: icons.config, path: '/business-config' },
      { name: '消息设置', icon: icons.messageSettings, path: '/message-settings' },
      { name: '汇率设置', icon: icons.exchange, path: '/exchange-rate' },
      { name: '账号信息', icon: icons.account, path: '/account-info' }
    ]
  }
}

const sidebarMenuItems = computed(() => {
  const scenarioConfig = sidebarMenuConfig[currentScenario.value]
  if (!scenarioConfig) return []
  return scenarioConfig[activeNavMenu.value] || []
})
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.com-layout {
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
  height: 60px;
  padding: 0 16px;
  background: $white;
  border-bottom: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.com-layout {
  padding-top: 60px;
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
  gap: 32px;
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
  border-width: 1px;
  border-style: solid;
  border-color: #1677ff;
  color: #1677ff;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  background: transparent;
  transition: all $transition-fast;

  &:hover {
    background: #F6F6F6;
  }
}

.c-btn-lang {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px;
  border-radius: 16px;
  border-width: 1px;
  border-style: solid;
  border-color: #d7d7d7;
  cursor: pointer;
  color: $secondary-text;
  background: $white;
  transition: all $transition-fast;

  &:hover {
    border-color: #bfbfbf;
    color: $primary-text;
    background: #F6F6F6;
  }

  &:focus {
    outline: none;
    border-color: #bfbfbf;
  }

  &:focus-within {
    border-color: #bfbfbf;
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
  border-width: 1px;
  border-style: solid;
  border-color: #d7d7d7;
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
    background: #F6F6F6;
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

// 用户下拉菜单样式
:deep(.user-dropdown-menu) {
  padding: 0;
  min-width: 220px;

  .user-info-section {
    padding: 20px 16px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid #E8E8E8;
    margin-bottom: 8px;

    .user-avatar-large {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      margin-bottom: 12px;
    }

    .user-name-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .user-name-text {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }

      .edit-btn {
        padding: 2px;
        color: #999;
        cursor: pointer;

        &:hover {
          color: #1677FF;
        }
      }
    }
  }

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    height: 44px;
    color: #333;

    svg {
      color: #666;
      flex-shrink: 0;
    }

    .arrow-icon {
      margin-left: auto;
      color: #ccc;
    }

    &:hover {
      background: #f0f5ff;

      svg {
        color: #1677FF;
      }
    }
  }

  .dropdown-divider {
    height: 1px;
    background: #E8E8E8;
    margin: 8px 0;
  }
}

// 主内容包装
.main-wrapper {
  display: flex;
  flex: 1;
  margin: 0 auto;
  padding: 0 0 0 210px;
  min-width: 0;

  &.fullscreen {
    margin: 0;
    padding: 0;
    min-width: auto;
    width: 100%;
  }
}

// 左侧导航栏
.left-sidebar {
  width: 210px;
  background: $white;
  border-right: none;
  padding: 8px 0;
  flex-shrink: 0;
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
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
    display: none !important;
  }

  &:hover {
    transform: translateX(2px);
  }
}

// 主内容区
.main-content {
  flex: 1;
  min-width: 0;
  padding: 16px;
  width: 100%;
}

.main-wrapper.fullscreen .main-content {
  flex: none;
  width: 100%;
}

// 其他菜单页面占位
.empty-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px - 60px);
}

.empty-content {
  text-align: center;
  color: $disabled-text;

  svg {
    margin-bottom: 16px;
  }

  p {
    font-size: 14px;
  }
}
</style>

<template>
  <div class="influencer-detail-basic-analysis">
    <!-- 固定顶部信息条(滚动后显示) -->
    <StickyHeader v-if="showStickyHeader" :data="influencerData" />

    <!-- 主内容 -->
    <div class="flex min-h-screen bg-[#F5F6F7]">
      <!-- 左侧导航 -->
      <LeftNavigation
        :active-menu="activeMenu"
        :class="{ 'sticky top-[48px]': isNavSticky }"
        @menu-change="handleMenuChange"
      />

      <!-- 右侧内容 -->
      <main class="flex-1 bg-white">
        <!-- 区域A: 达人信息头部 -->
        <InfluencerInfoHeader :data="influencerData" />

        <!-- 区域B: 核心数据横向指标条 -->
        <CoreMetricsBar :data="coreMetrics" />

        <!-- 区域D: 数据概览 -->
        <DataOverviewSection class="pt-5" />

        <!-- 区域E: 带货概览 -->
        <CommerceOverviewSection class="mt-4" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import StickyHeader from './components/StickyHeader.vue'
import LeftNavigation from './components/LeftNavigation.vue'
import InfluencerInfoHeader from './components/InfluencerInfoHeader.vue'
import CoreMetricsBar from './components/CoreMetricsBar.vue'
import DataOverviewSection from './components/DataOverviewSection.vue'
import CommerceOverviewSection from './components/CommerceOverviewSection.vue'

// 获取路由参数
const route = useRoute()

// 当前激活的菜单
const activeMenu = ref('基础分析')

// 滚动状态
const scrollY = ref(0)
const showStickyHeader = ref(false)
const isNavSticky = ref(false)

// 吸顶阈值 (区域A + 区域B 的高度)
const STICKY_THRESHOLD = 240

// 模拟达人数据
const influencerData = ref({
  id: route.query.id || '1001',
  avatar: '',
  username: '@fashion_influencer',
  name: '时尚达人小美',
  level: 'LV8',
  bio: '专注时尚穿搭分享，带货直播达人，合作品牌包括Nike、Adidas等知名品牌',
  updateTime: '2026-04-30 12:00:00',
  firstVideoTime: '2023-05-15 18:30:00',
  region: '广东广州',
  regionFlag: '🇨🇳',
  mcn: '星辰MCN机构',
  tags: ['时尚', '穿搭', '美妆', '直播达人'],
  followers: 1234567,
  likes: 5678901,
  gmv30d: '¥132.32w',
  orders30d: 6666,
  sales30d: 12345,
  categories: '美妆护肤、服饰内衣、食品饮料',
  salesType: '视频带货为主',
  avgVideoViews: 123456,
  avgLiveViewers: 88888,
  followStatus: 'unfollowed',
  assignStatus: 'unassigned',
  publicPoolStatus: 'not_in_pool',
  contacts: [
    { type: 'email', label: '发送邮件' },
    { type: 'facebook', label: 'Facebook' },
    { type: 'instagram', label: 'Instagram' }
  ]
})

// 核心指标数据
const coreMetrics = ref([
  { key: 'fans', label: '粉丝数', value: '1,234,567' },
  { key: 'likes', label: '获赞数', value: '5,678,901' },
  { key: 'gmv', label: '近30日成交金额', value: '¥132.32w', sub: '直播占88.65%' },
  { key: 'sales', label: '近30日销量', value: '66,666' },
  { key: 'videos', label: '视频数量', value: '43', sub: '历史总视频数2,332' },
  { key: 'liveSessions', label: '直播场次', value: '66', sub: '历史总场次1,256' },
  { key: 'avgViews', label: '视频平均播放量', value: '123,456' },
  { key: 'avgLiveViewers', label: '直播场均观看人数', value: '88,888' }
])

// 菜单切换处理
const handleMenuChange = (menu) => {
  activeMenu.value = menu
}

// 滚动监听
const handleScroll = () => {
  scrollY.value = window.scrollY

  // 当滚动超过阈值时，显示吸顶header
  showStickyHeader.value = scrollY.value > STICKY_THRESHOLD

  // 当滚动超过阈值时，左侧导航变为sticky
  isNavSticky.value = scrollY.value > STICKY_THRESHOLD
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化状态
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.influencer-detail-basic-analysis {
  min-height: 100vh;
}

.sticky {
  position: sticky;
  top: 48px;
  z-index: 50;
}
</style>

<template>
  <div class="commerce-overview-section bg-white p-4">
    <!-- ==================== 6.2 标题行 ==================== -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-[#262626] m-0">带货概览</h3>
      <div class="flex items-center gap-3">
        <!-- 时间筛选Tab组 -->
        <div class="flex border border-[#E8E8E8] rounded overflow-hidden">
          <span
            v-for="tab in timeTabs"
            :key="tab.key"
            class="px-4 py-1.5 text-[13px] cursor-pointer transition-all border-r border-[#E8E8E8] last:border-r-0"
            :class="activeTimeTab === tab.key ? 'bg-[#1677FF] text-white rounded' : 'text-[#595959] hover:text-[#1677FF]'"
            @click="activeTimeTab = tab.key"
          >
            {{ tab.label }}
          </span>
        </div>
        <!-- 全部链接 -->
        <span class="text-[13px] text-[#1677FF] cursor-pointer hover:text-[#4096ff]">全部 ></span>
      </div>
    </div>

    <!-- ==================== 6.3 统计摘要行 ==================== -->
    <div class="flex items-center gap-4 mb-4 px-4 py-3 bg-[#FAFAFA] rounded">
      <div class="flex items-center gap-2">
        <span class="text-[13px] text-[#8C8C8C]">上架商品数</span>
        <span class="text-[14px] font-semibold text-[#262626]">2,010</span>
      </div>
      <div class="w-px h-4 bg-[#E8E8E8]"></div>
      <div class="flex items-center gap-2">
        <span class="text-[13px] text-[#8C8C8C]">直播带货</span>
        <span class="text-[14px] font-semibold text-[#262626]">97.25%</span>
      </div>
      <div class="w-px h-4 bg-[#E8E8E8]"></div>
      <div class="flex items-center gap-2">
        <span class="text-[13px] text-[#8C8C8C]">推广品类</span>
        <span class="text-[14px] font-semibold text-[#262626]">23</span>
      </div>
      <div class="w-px h-4 bg-[#E8E8E8]"></div>
      <div class="flex items-center gap-2">
        <span class="text-[13px] text-[#8C8C8C]">推广品牌</span>
        <span class="text-[14px] font-semibold text-[#262626]">518</span>
      </div>
      <div class="w-px h-4 bg-[#E8E8E8]"></div>
      <div class="flex items-center gap-2">
        <span class="text-[13px] text-[#8C8C8C]">推广小店</span>
        <span class="text-[14px] font-semibold text-[#262626]">62</span>
      </div>
    </div>

    <!-- ==================== 6.4 维度Tab行 ==================== -->
    <div class="flex items-center justify-between mb-4">
      <!-- 左侧维度切换 -->
      <div class="flex gap-1">
        <span
          v-for="tab in dimensionTabs"
          :key="tab.key"
          class="px-3 py-1 text-[13px] cursor-pointer rounded transition-all"
          :class="activeDimension === tab.key
            ? 'bg-[#1677FF] text-white'
            : 'bg-[#F5F5F5] text-[#595959] hover:bg-[#E8E8E8]'"
          @click="activeDimension = tab.key"
        >
          {{ tab.label }}
        </span>
      </div>

      <!-- 右侧品类级别Tab（仅在品类维度时显示） -->
      <div v-if="activeDimension === 'category'" class="flex gap-1">
        <span
          v-for="level in categoryLevels"
          :key="level.key"
          class="px-2.5 py-1 text-[13px] cursor-pointer rounded transition-all border"
          :class="activeCategoryLevel === level.key
            ? 'border-[#1677FF] text-[#1677FF] bg-[#F0F7FF]'
            : 'border-[#E8E8E8] text-[#595959] hover:border-[#1677FF] hover:text-[#1677FF]'"
          @click="activeCategoryLevel = level.key"
        >
          {{ level.label }}
        </span>
      </div>
    </div>

    <!-- ==================== 6.5 环形图区块 ==================== -->
    <div class="flex gap-6">
      <!-- 品类/品牌/小店模式：3个图表 -->
      <template v-if="activeDimension !== 'channel'">
        <CategoryDonutChart
          v-for="(chart, index) in currentCharts"
          :key="`${activeDimension}-${index}`"
          :title="chart.title"
          :data="chart.data"
        />
      </template>
      <!-- 渠道模式：2个图表 -->
      <template v-else>
        <CategoryDonutChart
          v-for="(chart, index) in channelCharts"
          :key="`channel-${index}`"
          :title="chart.title"
          :data="chart.data"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CategoryDonutChart from './CategoryDonutChart.vue'

defineProps<{
  // 使用内部模拟数据
}>()

// 时间筛选Tab
const timeTabs = [
  { key: 'all', label: '全部' },
  { key: 'recent', label: '近7天' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'custom', label: '自定义' }
]
const activeTimeTab = ref('recent')

// 维度Tab
const dimensionTabs = [
  { key: 'category', label: '品类' },
  { key: 'brand', label: '品牌' },
  { key: 'shop', label: '小店' },
  { key: 'channel', label: '渠道' }
]
const activeDimension = ref('category')

// 品类级别Tab
const categoryLevels = [
  { key: 'level1', label: '一级品类' },
  { key: 'level2', label: '二级品类' },
  { key: 'level3', label: '三级品类' }
]
const activeCategoryLevel = ref('level1')

// 模拟数据
const categoryData = [
  { name: '美妆护肤', value: 850 },
  { name: '服装鞋帽', value: 420 },
  { name: '食品饮料', value: 310 },
  { name: '家居用品', value: 230 },
  { name: '其他', value: 200 }
]

const brandData = [
  { name: '品牌A', value: 680 },
  { name: '品牌B', value: 450 },
  { name: '品牌C', value: 320 },
  { name: '品牌D', value: 180 },
  { name: '其他', value: 380 }
]

const shopData = [
  { name: '旗舰店', value: 720 },
  { name: '专营店', value: 480 },
  { name: '专卖店', value: 290 },
  { name: '集合店', value: 220 },
  { name: '其他', value: 300 }
]

const channelData = [
  { name: '直播', value: 1250 },
  { name: '视频', value: 480 },
  { name: '商品卡', value: 280 }
]

// 根据维度获取图表数据
const currentCharts = computed(() => {
  const baseData = activeDimension.value === 'category' ? categoryData
    : activeDimension.value === 'brand' ? brandData
    : shopData

  return [
    {
      title: activeDimension.value === 'category' ? '上架商品最多品类TOP5'
        : activeDimension.value === 'brand' ? '上架商品最多品牌TOP5'
        : '上架商品最多小店TOP5',
      data: baseData
    },
    {
      title: activeDimension.value === 'category' ? '成交订单数最佳品类TOP5'
        : activeDimension.value === 'brand' ? '成交订单数最佳品牌TOP5'
        : '成交订单数最佳小店TOP5',
      data: baseData.map(item => ({ ...item, value: Math.floor(item.value * 0.8 + Math.random() * 200) }))
    },
    {
      title: activeDimension.value === 'category' ? '成交金额最佳品类TOP5'
        : activeDimension.value === 'brand' ? '成交金额最佳品牌TOP5'
        : '成交金额最佳小店TOP5',
      data: baseData.map(item => ({ ...item, value: Math.floor(item.value * 1.2 + Math.random() * 300) }))
    }
  ]
})

// 渠道模式图表
const channelCharts = [
  { title: '成交金额各渠道占比', data: channelData },
  { title: '成交订单数各渠道占比', data: channelData.map(item => ({ ...item, value: Math.floor(item.value * 0.7) })) }
]
</script>

<style scoped>
.commerce-overview-section {
  /* 容器样式 */
}
</style>

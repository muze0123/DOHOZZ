<template>
  <div class="smart-recommendation">
    <!-- Top Tab Bar -->
    <div class="top-tab-bar">
      <div class="tab-left">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'shop' }"
          @click="handleTabChange('shop')"
        >
          按店铺智能推荐达人
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'product' }"
          @click="handleTabChange('product')"
        >
          按商品智能推荐达人
        </div>
      </div>
      <div class="tab-right">
        <span class="stats-label">推荐成效</span>
        <span class="stats-value">{{ recommendationStats.totalSalesAmount }}万</span>
        <span class="stats-label">已带来成交</span>
      </div>
    </div>

    <!-- Shop Info Bar -->
    <div class="shop-info-bar" :class="{ 'is-sticky': isSticky }">
      <div class="shop-info-left">
        <el-popover
          placement="bottom-start"
          :width="320"
          trigger="click"
          v-model:visible="shopPopoverVisible"
        >
          <template #reference>
            <div class="shop-selector">
              <img :src="currentShop.logo" alt="logo" class="shop-logo" />
              <span class="shop-name">{{ currentShop.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
          </template>
          <div class="shop-list">
            <div
              v-for="shop in authorizedShops"
              :key="shop.id"
              class="shop-item"
              :class="{ active: shop.id === currentShop.id }"
              @click="handleShopChange(shop)"
            >
              <img :src="shop.logo" alt="logo" class="shop-logo" />
              <span class="shop-name">{{ shop.name }}</span>
            </div>
          </div>
        </el-popover>
        <div class="strategy-tags" v-if="!isSticky">
          <span class="strategy-text">
            策略：客单价 <span class="highlight">¥{{ currentShop.strategy.avgOrderPrice }}</span> |
            主营类目 <span class="highlight">{{ currentShop.strategy.mainCategory }}</span> |
            粉丝 <span class="highlight">{{ currentShop.strategy.followerGender }}</span>
            <span v-if="currentShop.strategy.followerAge">、{{ currentShop.strategy.followerAge }}</span>
            <span v-if="currentShop.strategy.followerRegion">、{{ currentShop.strategy.followerRegion }}</span>
          </span>
        </div>
      </div>
      <div class="shop-info-right">
        <el-button type="primary" plain @click="showStrategyDrawer = true">
          调整推荐方案
        </el-button>
      </div>
    </div>

    <!-- List Header -->
    <div class="list-header">
      <div class="list-title">
        <span class="title-text">今日推荐</span>
        <span class="title-date">{{ todayDate }}</span>
        <el-tooltip content="根据店铺信息和历史数据智能匹配">
          <el-icon class="title-tip"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="list-count">
        <span class="count-text">
          剩余 <span class="highlight">{{ recommendationStats.totalInfluencers - displayedCount }}</span> / 全量
          {{ recommendationStats.totalInfluencers }} 达人
        </span>
      </div>
    </div>

    <!-- Recommendation Cards -->
    <div class="card-list">
      <div
        v-for="card in cardList"
        :key="card.id"
        class="recommendation-card"
      >
        <!-- Card Main Area -->
        <div class="card-main">
          <!-- Row 1: Avatar + Name + Contact icon + Level tag -->
          <div class="card-row1">
            <div class="influencer-info">
              <el-avatar :src="card.avatar" :size="48" class="influencer-avatar" />
              <div class="influencer-name-row">
                <span class="influencer-name">{{ card.name }}</span>
                <span v-if="card.contactAvailable" class="contact-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 7a2 2 0 100-4 2 2 0 000 4z" fill="#FFD700"/>
                    <path d="M7 5v4M5 7h4" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </span>
                <span class="level-tag">LV{{ card.level }}</span>
              </div>
            </div>
          </div>

          <!-- Row 2: Main categories tags -->
          <div class="card-row2">
            <div class="category-tags">
              <span
                v-for="(cat, index) in card.mainCategories"
                :key="index"
                class="category-tag"
              >
                {{ cat.name }} {{ cat.percentage }}%
              </span>
            </div>
          </div>

          <!-- Row 3: Related category info bar -->
          <div class="card-row3">
            <div class="related-info-bar">
              <div class="related-categories">
                <span class="related-label">关联类目：</span>
                <span class="related-value">{{ card.relatedCategories }}</span>
              </div>
              <div class="related-stats">
                <span class="stat-item">均价 <span class="highlight">¥{{ card.avgPrice }}</span></span>
                <span class="stat-divider">|</span>
                <span class="stat-item">近30天销量 <span class="highlight">{{ card.recentSalesAmount }}</span></span>
              </div>
              <el-popover
                placement="bottom"
                :width="400"
                trigger="click"
              >
                <template #reference>
                  <span class="view-link">查看关联类目 ></span>
                </template>
                <div class="category-table">
                  <p class="table-title">关联类目详情</p>
                  <el-table :data="[]" border>
                    <el-table-column prop="category" label="类目" />
                    <el-table-column prop="percentage" label="占比" />
                    <el-table-column prop="avgPrice" label="均价" />
                    <el-table-column prop="salesAmount" label="30天销售额" />
                  </el-table>
                </div>
              </el-popover>
            </div>
          </div>

          <!-- Row 4: Five stats columns -->
          <div class="card-row4">
            <div class="stats-columns">
              <div class="stat-column">
                <div class="stat-value">{{ card.stats.followers }}</div>
                <div class="stat-label">粉丝量</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-column">
                <div class="stat-value">{{ card.stats.liveSessions }}</div>
                <div class="stat-label">直播场次</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-column">
                <div class="stat-value">{{ card.stats.avgSalesAmount }}</div>
                <div class="stat-label">场均销售额</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-column">
                <div class="stat-value">{{ card.stats.avgSalesCount }}</div>
                <div class="stat-label">场均销量</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-column">
                <div class="stat-value">{{ card.stats.avgViewers }}</div>
                <div class="stat-label">平均场观</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Match Area -->
        <div class="card-match">
          <!-- Match score gauge -->
          <div class="match-gauge">
            <svg width="120" height="70" viewBox="0 0 120 70">
              <!-- Background arc -->
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke="#E8E8E8"
                stroke-width="10"
                stroke-linecap="round"
              />
              <!-- Score arc -->
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                :stroke="getGaugeColor(card.matchScore)"
                stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="getGaugeDash(card.matchScore)"
              />
            </svg>
            <div class="gauge-value">
              <span class="gauge-score">{{ card.matchScore }}</span>
              <span class="gauge-label">匹配分</span>
            </div>
          </div>

          <!-- Recommend reason section -->
          <div class="recommend-reason">
            <div class="reason-title">{{ card.recommendReason.title }}</div>
            <div class="reason-content">
              <template v-if="card.recommendReason.type === 'historySimilar'">
                <div class="reason-detail">
                  <span class="reason-text">历史相似达人</span>
                  <div class="reason-avatars">
                    <el-avatar
                      v-for="(detail, idx) in card.recommendReason.details"
                      :key="idx"
                      :src="detail.avatar"
                      :size="24"
                    />
                  </div>
                </div>
              </template>
              <template v-else-if="card.recommendReason.type === 'competitor'">
                <div class="reason-detail">
                  <span class="reason-text">竞品合作达人</span>
                  <div class="reason-avatars">
                    <el-avatar
                      v-for="(detail, idx) in card.recommendReason.details"
                      :key="idx"
                      :src="detail.avatar"
                      :size="24"
                    />
                  </div>
                </div>
              </template>
              <template v-else-if="card.recommendReason.type === 'shopMatch'">
                <div class="reason-detail">
                  <span class="reason-text">店铺匹配达人</span>
                  <div class="reason-images">
                    <el-image
                      v-for="(detail, idx) in card.recommendReason.details"
                      :key="idx"
                      :src="detail.image"
                      :width="32"
                      :height="32"
                      fit="cover"
                    />
                  </div>
                </div>
              </template>
              <template v-else-if="card.recommendReason.type === 'categoryQuality'">
                <div class="reason-detail">
                  <span class="reason-text">类目优质达人</span>
                  <span class="reason-count">{{ card.recommendReason.details[0]?.count }}位达人都在带</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Action buttons row -->
          <div class="action-buttons">
            <el-button
              class="dislike-btn"
              @click="handleDislike(card)"
            >
              <span class="btn-icon">👎</span>
              踩
            </el-button>
            <el-button
              type="primary"
              class="assign-btn"
              @click="handleAssign(card)"
            >
              分配达人
            </el-button>
            <el-button
              :type="card.isFollowed ? 'info' : 'primary'"
              :disabled="card.isFollowed"
              class="follow-btn"
              @click="handleFollow(card)"
            >
              {{ card.isFollowed ? '已跟进' : '跟进' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="recommendationStats.totalInfluencers"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <el-popover
      v-model:visible="dislikePopoverVisible"
      placement="top"
      :width="280"
      trigger="click"
    >
      <div class="dislike-popover">
        <div class="dislike-title">不推荐该达人的主要原因是？</div>
        <div
          v-for="option in dislikeOptions"
          :key="option.value"
          class="dislike-option"
          :class="{ selected: selectedDislike === option.value }"
          @click="selectedDislike = option.value"
        >
          {{ option.label }}
        </div>
        <textarea
          v-if="selectedDislike === 'other'"
          v-model="dislikeOtherReason"
          class="other-reason-input"
          placeholder="请输入原因（限200字）"
          maxlength="200"
        />
        <el-button
          class="btn-submit-dislike"
          type="primary"
          @click="submitDislike"
        >
          提交
        </el-button>
      </div>
    </el-popover>

    <!-- Strategy Drawer -->
    <el-drawer
      v-model="showStrategyDrawer"
      title="调整推荐方案"
      direction="rtl"
      size="480px"
    >
      <div class="strategy-drawer-content">
        <!-- 达人来源占比 -->
        <div class="drawer-section">
          <div class="section-title">达人来源占比</div>
          <div class="section-desc">拖动手柄可调节偏好达人的推荐强度</div>
          <div class="source-sliders">
            <div v-for="source in sourceTypes" :key="source.key" class="source-item">
              <span class="source-label">{{ source.label }}</span>
              <el-slider v-model="source.weight" :min="0" :max="100" :show-input="true" />
            </div>
          </div>
        </div>

        <!-- 达人粉丝量级 -->
        <div class="drawer-section">
          <div class="section-title">达人粉丝量级</div>
          <div class="follower-levels">
            <div v-for="level in followerLevels" :key="level.range" class="level-bar">
              <span class="level-range">{{ level.range }}</span>
              <div class="level-progress">
                <div class="level-fill" :style="{ width: level.percent + '%' }"></div>
              </div>
              <span class="level-percent">{{ level.percent }}%</span>
            </div>
          </div>
        </div>

        <!-- 潜在竞品 -->
        <div class="drawer-section">
          <div class="section-title">潜在竞品</div>
          <div class="competitor-tags">
            <el-tag
              v-for="(comp, idx) in competitors"
              :key="idx"
              closable
              @close="removeCompetitor(idx)"
            >
              {{ comp.name }}
            </el-tag>
          </div>
          <el-button size="small" @click="addCompetitor">+ 添加竞品</el-button>
        </div>

        <!-- 达人带货表现 -->
        <div class="drawer-section">
          <div class="section-title">达人带货表现</div>
          <div class="performance-inputs">
            <div class="input-row">
              <span class="input-label">直播达人场均GMV：超过</span>
              <el-input v-model="performance.liveGmv" placeholder="请输入" style="width: 120px" />
              <span class="input-unit">万</span>
            </div>
            <div class="input-row">
              <span class="input-label">视频达人平均成交金额：超过</span>
              <el-input v-model="performance.videoSales" placeholder="请输入" style="width: 120px" />
              <span class="input-unit">万</span>
            </div>
          </div>
        </div>

        <div class="drawer-footer-tip">
          <el-icon><Warning /></el-icon>
          修改后的推荐策略将在保存第二日开始生效
        </div>

        <div class="drawer-actions">
          <el-button link @click="resetToDefault">采用默认策略</el-button>
          <el-button @click="showStrategyDrawer = false">取消</el-button>
          <el-button type="primary" @click="saveStrategy">保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, QuestionFilled, Warning } from '@element-plus/icons-vue'

// Tab state
const activeTab = ref('shop')
const todayDate = computed(() => {
  const now = new Date()
  return `${now.getMonth() + 1}月${now.getDate()}日`
})

// Shop info
const currentShop = ref({
  id: '1',
  logo: 'https://via.placeholder.com/32',
  name: '示例店铺',
  strategy: {
    avgOrderPrice: '89',
    mainCategory: '食品饮料',
    followerGender: '女性居多',
    followerAge: '25-35岁',
    followerRegion: '江浙沪'
  }
})

const authorizedShops = ref([
  {
    id: '1',
    logo: 'https://via.placeholder.com/32',
    name: '示例店铺',
    strategy: {
      avgOrderPrice: '89',
      mainCategory: '食品饮料',
      followerGender: '女性居多',
      followerAge: '25-35岁',
      followerRegion: '江浙沪'
    }
  },
  {
    id: '2',
    logo: 'https://via.placeholder.com/32',
    name: '示例店铺2',
    strategy: {
      avgOrderPrice: '120',
      mainCategory: '生鲜蔬果',
      followerGender: '男性居多',
      followerAge: '30-40岁',
      followerRegion: '广东'
    }
  }
])

const shopPopoverVisible = ref(false)
const isSticky = ref(false)

// Recommendation stats
const recommendationStats = reactive({
  totalInfluencers: 98,
  totalSalesAmount: '5,932.82'
})

const displayedCount = ref(6)

// Pagination
const currentPage = ref(1)
const pageSize = ref(6)

// Card list with mock data
const cardList = ref([
  {
    id: '1',
    avatar: 'https://via.placeholder.com/48',
    name: '美食推荐小王',
    level: '8',
    contactAvailable: true,
    mainCategories: [
      { name: '食品饮料', percentage: 96.62 },
      { name: '生鲜蔬果', percentage: 1.9 }
    ],
    relatedCategories: '零食/坚果/特产 > 饼干/威化 > 夹心饼干',
    avgPrice: '35.8',
    recentSalesAmount: '12,580',
    stats: {
      followers: '121.01w',
      followerGender: '女性居多',
      liveSessions: 33,
      avgSalesAmount: '31.01w',
      avgSalesCount: 222,
      avgViewers: '1.23w'
    },
    matchScore: 96.52,
    recommendReason: {
      type: 'historySimilar',
      title: '推荐理由',
      details: [
        { name: '达人A', avatar: 'https://via.placeholder.com/24' },
        { name: '达人B', avatar: 'https://via.placeholder.com/24' }
      ]
    },
    isFollowed: false
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/48',
    name: '吃货小妹',
    level: '7',
    contactAvailable: true,
    mainCategories: [
      { name: '食品饮料', percentage: 88.5 },
      { name: '生鲜蔬果', percentage: 8.2 }
    ],
    relatedCategories: '零食/坚果/特产 > 肉类零食 > 牛肉干',
    avgPrice: '48.5',
    recentSalesAmount: '18,320',
    stats: {
      followers: '89.56w',
      followerGender: '女性居多',
      liveSessions: 45,
      avgSalesAmount: '22.36w',
      avgSalesCount: 156,
      avgViewers: '2.15w'
    },
    matchScore: 92.18,
    recommendReason: {
      type: 'competitor',
      title: '推荐理由',
      details: [
        { name: '竞品A', avatar: 'https://via.placeholder.com/24' },
        { name: '竞品B', avatar: 'https://via.placeholder.com/24' }
      ]
    },
    isFollowed: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/48',
    name: '源头好货',
    level: '8',
    contactAvailable: false,
    mainCategories: [
      { name: '生鲜蔬果', percentage: 75.3 },
      { name: '食品饮料', percentage: 20.1 }
    ],
    relatedCategories: '生鲜 > 水果 > 新鲜水果',
    avgPrice: '28.9',
    recentSalesAmount: '25,680',
    stats: {
      followers: '156.23w',
      followerGender: '女性居多',
      liveSessions: 62,
      avgSalesAmount: '45.28w',
      avgSalesCount: 380,
      avgViewers: '3.56w'
    },
    matchScore: 88.45,
    recommendReason: {
      type: 'shopMatch',
      title: '推荐理由',
      details: [
        { name: '店铺A', image: 'https://via.placeholder.com/32' },
        { name: '店铺B', image: 'https://via.placeholder.com/32' }
      ]
    },
    isFollowed: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/48',
    name: '源头好物',
    level: '6',
    contactAvailable: true,
    mainCategories: [
      { name: '食品饮料', percentage: 65.8 },
      { name: '生鲜蔬果', percentage: 30.2 }
    ],
    relatedCategories: '饮料 > 矿泉水 > 天然矿泉水',
    avgPrice: '18.5',
    recentSalesAmount: '32,150',
    stats: {
      followers: '78.92w',
      followerGender: '男性居多',
      liveSessions: 28,
      avgSalesAmount: '15.67w',
      avgSalesCount: 98,
      avgViewers: '0.89w'
    },
    matchScore: 76.32,
    recommendReason: {
      type: 'categoryQuality',
      title: '推荐理由',
      details: [
        { name: '类目优质', count: 156 }
      ]
    },
    isFollowed: false
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/48',
    name: '健康生活家',
    level: '7',
    contactAvailable: true,
    mainCategories: [
      { name: '食品饮料', percentage: 55.6 },
      { name: '生鲜蔬果', percentage: 40.2 }
    ],
    relatedCategories: '营养食品 > 维生素 > 维生素片',
    avgPrice: '68.0',
    recentSalesAmount: '8,920',
    stats: {
      followers: '102.45w',
      followerGender: '女性居多',
      liveSessions: 38,
      avgSalesAmount: '28.45w',
      avgSalesCount: 185,
      avgViewers: '1.78w'
    },
    matchScore: 71.85,
    recommendReason: {
      type: 'historySimilar',
      title: '推荐理由',
      details: [
        { name: '达人C', avatar: 'https://via.placeholder.com/24' },
        { name: '达人D', avatar: 'https://via.placeholder.com/24' }
      ]
    },
    isFollowed: false
  },
  {
    id: '6',
    avatar: 'https://via.placeholder.com/48',
    name: '乡村美食汇',
    level: '8',
    contactAvailable: false,
    mainCategories: [
      { name: '生鲜蔬果', percentage: 82.5 },
      { name: '食品饮料', percentage: 15.3 }
    ],
    relatedCategories: '生鲜 > 蔬菜 > 有机蔬菜',
    avgPrice: '42.3',
    recentSalesAmount: '15,780',
    stats: {
      followers: '189.34w',
      followerGender: '女性居多',
      liveSessions: 55,
      avgSalesAmount: '38.92w',
      avgSalesCount: 265,
      avgViewers: '2.89w'
    },
    matchScore: 68.92,
    recommendReason: {
      type: 'competitor',
      title: '推荐理由',
      details: [
        { name: '竞品C', avatar: 'https://via.placeholder.com/24' }
      ]
    },
    isFollowed: false
  }
])

// Dislike popover
const dislikePopoverVisible = ref(false)
const selectedDislike = ref('')
const dislikeOtherReason = ref('')
const currentDislikeCard = ref(null)

const dislikeOptions = [
  { label: '视频搬运', value: 'video_pirated' },
  { label: '视频质量差', value: 'low_quality' },
  { label: '不与品牌方合作', value: 'no_brand_coop' },
  { label: '创作能力不足', value: 'low_creativity' },
  { label: '不是目标达人', value: 'not_target' },
  { label: '其他原因', value: 'other' }
]

// Strategy drawer
const showStrategyDrawer = ref(false)
const sourceTypes = reactive([
  { key: 'shop_match', label: '店铺画像匹配达人', weight: 50 },
  { key: 'default', label: '默认推荐', weight: 50 },
  { key: 'competitor', label: '竞品优质合作达人', weight: 30 },
  { key: 'category', label: '商品类目优质达人', weight: 30 }
])

const followerLevels = ref([
  { range: '0-1w', percent: 54 },
  { range: '1-10w', percent: 28 },
  { range: '10-100w', percent: 13 },
  { range: '100-500w', percent: 4 },
  { range: '500w+', percent: 1 }
])

const competitors = ref([
  { name: 'PLANNER/珀兰娜' },
  { name: 'BEINIDAR' },
  { name: 'sellion/雪尔妮兰' },
  { name: 'Florasis/花西子' }
])

const performance = reactive({
  liveGmv: '',
  videoSales: ''
})

// Methods
const handleTabChange = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
}

const handleShopChange = (shop) => {
  currentShop.value = shop
  shopPopoverVisible.value = false
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const getGaugeDash = (score) => {
  // SVG arc length is approximately 157 for semicircle
  const arcLength = 157
  const fillLength = (score / 100) * arcLength
  return `${fillLength} ${arcLength}`
}

const getGaugeColor = (score) => {
  if (score >= 90) return '#1A4FC4' // Deep blue
  if (score >= 70) return '#1677FF' // Primary blue
  return '#FAAD14' // Warning
}

const handleFollow = (card) => {
  card.isFollowed = true
  ElMessage.success({
    message: '跟进成功，您可在"我的达人"页面继续跟进该达人 [查看]',
    duration: 3000
  })
}

const handleDislike = (card) => {
  currentDislikeCard.value = card
  selectedDislike.value = ''
  dislikeOtherReason.value = ''
  dislikePopoverVisible.value = true
}

const submitDislike = () => {
  if (!selectedDislike.value) {
    ElMessage.warning('请选择反馈原因')
    return
  }
  if (selectedDislike.value === 'other' && !dislikeOtherReason.value.trim()) {
    ElMessage.warning('请输入原因')
    return
  }
  // API placeholder
  console.log('提交踩反馈:', {
    influencerId: currentDislikeCard.value.id,
    reason: selectedDislike.value,
    otherReason: dislikeOtherReason.value
  })
  ElMessage.success('感谢反馈，系统将记录该操作并持续修正推荐结果')
  dislikePopoverVisible.value = false
}

const handleAssign = (card) => {
  // Placeholder for assign functionality
  console.log('Assign influencer:', card.id)
}

const saveStrategy = () => {
  console.log('保存推荐策略:', {
    shopId: currentShop.value?.id,
    sourceTypes: sourceTypes.map(s => ({ key: s.key, weight: s.weight })),
    performance: performance
  })
  ElMessage.success('策略保存成功')
  showStrategyDrawer.value = false
}

const removeCompetitor = (idx) => {
  competitors.value.splice(idx, 1)
}

const addCompetitor = () => {
  // placeholder - could open an input dialog
}

const resetToDefault = () => {
  sourceTypes.forEach(s => s.weight = 50)
}

// Sticky scroll handling
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  isSticky.value = scrollTop > 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.smart-recommendation {
  background: #FAFAFA;
  min-height: 100vh;
  padding: 16px 24px;
}

/* Colors per PRD */
:root {
  --color-primary: #1677FF;
  --color-deep-blue: #1A4FC4;
  --color-text-primary: #262626;
  --color-text-secondary: #595959;
  --color-text-placeholder: #8C8C8C;
  --color-border: #EBEBEB;
  --color-border-input: #D9D9D9;
  --color-bg-page: #FAFAFA;
  --color-bg-card: #FFFFFF;
  --color-bg-tag: #EBF3FF;
  --color-bg-match: linear-gradient(135deg, #EAF4FF, #C8E0FF);
  --color-warning: #FAAD14;
}

/* Top Tab Bar */
.top-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.tab-left {
  display: flex;
  gap: 24px;
}

.tab-item {
  font-size: 15px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 500;
}

.tab-right {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.stats-label {
  color: var(--color-text-secondary);
}

.stats-value {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 16px;
}

/* Shop Info Bar */
.shop-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.shop-info-bar.is-sticky {
  position: fixed;
  top: 0;
  left: 24px;
  right: 24px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.shop-info-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.shop-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.shop-selector:hover {
  background: #f5f5f5;
}

.shop-logo {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.shop-name {
  font-size: 15px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.shop-item:hover {
  background: #f5f5f5;
}

.shop-item.active {
  background: var(--color-bg-tag);
}

.strategy-tags {
  display: flex;
  align-items: center;
}

.strategy-text {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.strategy-text .highlight {
  color: var(--color-primary);
}

/* List Header */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.list-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.title-date {
  font-size: 13px;
  color: var(--color-text-placeholder);
}

.title-tip {
  color: var(--color-text-placeholder);
  cursor: help;
}

.list-count {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.list-count .highlight {
  color: var(--color-primary);
  font-weight: 500;
}

/* Recommendation Card */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-card {
  display: flex;
  background: var(--color-bg-card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-main {
  flex: 1;
  padding: 20px;
}

.card-row1 {
  margin-bottom: 12px;
}

.influencer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.influencer-avatar {
  border-radius: 50%;
}

.influencer-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.influencer-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.contact-icon {
  display: flex;
  align-items: center;
}

.level-tag {
  padding: 2px 8px;
  background: linear-gradient(135deg, #1677FF, #1A4FC4);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}

.card-row2 {
  margin-bottom: 12px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  padding: 4px 10px;
  background: var(--color-bg-tag);
  color: var(--color-primary);
  font-size: 12px;
  border-radius: 4px;
}

.card-row3 {
  margin-bottom: 12px;
}

.related-info-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 6px;
  font-size: 13px;
}

.related-categories {
  display: flex;
  align-items: center;
  gap: 4px;
}

.related-label {
  color: var(--color-text-secondary);
}

.related-value {
  color: var(--color-text-primary);
}

.related-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item {
  color: var(--color-text-secondary);
}

.stat-item .highlight {
  color: var(--color-text-primary);
}

.stat-divider {
  color: #d9d9d9;
}

.view-link {
  color: var(--color-primary);
  cursor: pointer;
  white-space: nowrap;
}

.view-link:hover {
  text-decoration: underline;
}

.card-row4 {
  margin-top: 16px;
}

.stats-columns {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-column {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.card-row4 .stat-divider {
  width: 1px;
  height: 32px;
  background: #e8e8e8;
}

/* Card Match Area */
.card-match {
  width: 280px;
  padding: 20px;
  background: var(--color-bg-match);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.match-gauge {
  position: relative;
  margin-bottom: 12px;
}

.gauge-value {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.gauge-score {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-deep-blue);
}

.gauge-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.recommend-reason {
  width: 100%;
  margin-bottom: 16px;
}

.reason-title {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.reason-content {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  padding: 10px;
}

.reason-detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reason-text {
  font-size: 13px;
  color: var(--color-text-primary);
}

.reason-avatars {
  display: flex;
  gap: 4px;
}

.reason-images {
  display: flex;
  gap: 4px;
}

.reason-count {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.action-buttons {
  display: flex;
  gap: 8px;
  width: 100%;
}

.dislike-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.btn-icon {
  font-size: 14px;
}

.assign-btn {
  flex: 2;
}

.follow-btn {
  flex: 1;
}

/* Pagination */
.pagination-bar {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* Dislike Popover */
.dislike-popover {
  padding: 16px;
}

.dislike-title {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.dislike-option {
  padding: 8px 10px;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  margin-bottom: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #595959;
  transition: all 0.15s;

  &:hover {
    border-color: #1677FF;
  }

  &.selected {
    border-color: #1677FF;
    background: #EBF3FF;
    color: #1677FF;
  }
}

.other-reason-input {
  width: 100%;
  height: 64px;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  resize: none;
  margin-top: 8px;

  &:focus {
    outline: none;
    border-color: #1677FF;
  }
}

.btn-submit-dislike {
  width: 100%;
  height: 32px;
  background: #1677FF;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  margin-top: 12px;
}

/* Strategy Drawer */
.strategy-drawer-content {
  padding: 0 16px;
}

.drawer-section {
  margin-bottom: 24px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
  }

  .section-desc {
    font-size: 12px;
    color: #8C8C8C;
    margin-bottom: 12px;
  }
}

.source-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  .source-label {
    width: 120px;
    font-size: 12px;
    color: #595959;
    flex-shrink: 0;
  }
}

.follower-levels {
  .level-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .level-range {
    width: 60px;
    font-size: 12px;
    color: #595959;
  }

  .level-progress {
    flex: 1;
    height: 8px;
    background: #F0F0F0;
    border-radius: 4px;
    overflow: hidden;
  }

  .level-fill {
    height: 100%;
    background: linear-gradient(90deg, #5B8DEF, #3B6EE8);
    border-radius: 4px;
  }

  .level-percent {
    width: 40px;
    font-size: 12px;
    color: #1677FF;
    text-align: right;
  }
}

.competitor-tags {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.performance-inputs {
  .input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .input-label {
    font-size: 12px;
    color: #595959;
  }

  .input-unit {
    font-size: 12px;
    color: #595959;
  }
}

.drawer-footer-tip {
  font-size: 11px;
  color: #FAAD14;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: #FFFBF0;
  border-radius: 4px;
}

.drawer-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}
</style>

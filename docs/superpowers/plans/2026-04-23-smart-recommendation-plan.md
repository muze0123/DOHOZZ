# 智能推荐达人 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 DOHOZZ SaaS 平台上实现「智能推荐达人」页面，包含按店铺/商品 Tab 切换、推荐达人卡片展示、踩反馈、跟进、调整推荐方案抽屉等完整功能

**Architecture:** 单文件 Vue 组件（SmartRecommendation.vue），所有区域逻辑内聚管理，使用 reactive/cputed 管理状态，Mock 数据内置，预留 API 接口便于后续对接

**Tech Stack:** Vue 3 + Element Plus + SCSS

---

## 文件结构

```
src/views/SmartRecommendation.vue    # 主组件（新建）
src/router/index.js                # 路由配置（需新增路由）
docs/superpowers/specs/2026-04-23-smart-recommendation-design.md  # 设计稿
```

---

## 任务分解

### Task 1: 路由配置

**Files:**
- Modify: `src/router/index.js:1-10`（在 routes 数组中添加新路由）

- [ ] **Step 1: 添加智能推荐达人的路由配置**

在 `src/router/index.js` 的 routes 数组中添加：

```js
{
  path: '/smart-recommendation',
  name: 'SmartRecommendation',
  component: () => import('@/views/SmartRecommendation.vue'),
  meta: {
    requiresAuth: true,
    title: '智能推荐达人 - DOHOZZ'
  }
}
```

找到路由数组中 `/influencer-database` 的位置，在其后添加新路由。

---

### Task 2: 页面基础框架和 Mock 数据

**Files:**
- Create: `src/views/SmartRecommendation.vue`（新建）

- [ ] **Step 1: 创建 SmartRecommendation.vue 文件**

在 `src/views/SmartRecommendation.vue` 创建文件，包含以下基础结构：

```vue
<template>
  <div class="smart-recommendation">
    <!-- 顶部 Tab 栏 -->
    <!-- 店铺信息栏 -->
    <!-- 列表标题栏 -->
    <!-- 推荐达人卡片列表 -->
    <!-- 分页栏 -->
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Mock 达人数据
const mockInfluencers = [...]
// Mock 店铺数据
const mockShops = [...]
// Mock 推荐成效
const recommendationStats = reactive({
  totalInfluencers: 98,
  totalSalesAmount: '5,932.82'
})
</script>

<style lang="scss" scoped>
.smart-recommendation {
  min-height: 100vh;
  background: #FAFAFA;
}
</style>
```

- [ ] **Step 2: 添加顶部 Tab 栏区域**

在 template 中添加顶部 Tab 栏，包含左 Tab 切换和右推荐成效统计：

```vue
<!-- 顶部 Tab 栏 -->
<div class="top-tab-bar">
  <div class="tab-left">
    <div
      class="tab-item"
      :class="{ active: activeTab === 'shop' }"
      @click="activeTab = 'shop'"
    >
      按店铺智能推荐达人
    </div>
    <div
      class="tab-item"
      :class="{ active: activeTab === 'product' }"
      @click="activeTab = 'product'"
    >
      按商品智能推荐达人
    </div>
  </div>
  <div class="tab-right">
    推荐系统已帮助您成功合作
    <span class="highlight">{{ recommendationStats.totalInfluencers }}</span> 个优质达人，带来
    <span class="highlight">{{ recommendationStats.totalSalesAmount }}</span> 的达播金额
  </div>
</div>
```

并添加基础样式变量。

- [ ] **Step 3: 添加店铺信息栏区域**

```vue
<!-- 店铺信息栏 -->
<div class="shop-info-bar">
  <div class="shop-info-left">
    <div class="shop-name-row" @click="showShopPopover = !showShopPopover">
      <img :src="currentShop.logo" class="shop-logo" />
      <span class="shop-name">{{ currentShop.name }}</span>
      <el-icon><ArrowDown /></el-icon>
    </div>
    <div class="strategy-row">
      <span class="strategy-label">达人推荐策略</span>
      <span class="strategy-divider">|</span>
      <span class="strategy-item">订单均价：<span class="strategy-value">{{ currentShop.strategy.avgOrderPrice }}</span></span>
      <span class="strategy-divider">|</span>
      <span class="strategy-item">带货类目：<span class="strategy-value">{{ currentShop.strategy.mainCategory }}</span> <span class="strategy-highlight">居多</span></span>
      <!-- 更多策略标签... -->
    </div>
  </div>
  <el-button class="btn-adjust-strategy" @click="showStrategyDrawer = true">
    <span>≡</span> 调整推荐方案
  </el-button>
</div>
```

- [ ] **Step 4: 添加列表标题栏和卡片列表区域**

```vue
<!-- 列表标题栏 -->
<div class="recommend-header">
  <div class="header-left">
    <span class="header-title">今日推荐</span>
    <span class="header-count">（{{ pagination.total }}）</span>
    <span class="header-date">2023/12/25（统计近30天的数据...）</span>
  </div>
  <div class="header-right">
    剩余/全部推荐达人：
    <span class="highlight">{{ pagination.total }}/{{ pagination.total }}</span>
  </div>
</div>

<!-- 推荐达人卡片列表 -->
<div class="influencer-list">
  <div
    v-for="card in paginatedInfluencers"
    :key="card.id"
    class="influencer-card"
  >
    <!-- 卡片主体区 -->
    <div class="card-main">
      <div class="card-info-row">
        <img :src="card.avatar" class="avatar" />
        <span class="influencer-name">{{ card.name }}</span>
        <el-icon class="contact-icon"><Message /></el-icon>
        <span class="level-tag">{{ card.level }}</span>
      </div>
      <!-- 更多卡片内容... -->
    </div>
    <!-- 卡片匹配区 -->
    <div class="card-match">
      <!-- 匹配分、推荐理由、操作按钮... -->
    </div>
  </div>
</div>
```

- [ ] **Step 5: 添加分页栏**

```vue
<!-- 分页栏 -->
<div class="pagination-bar">
  <el-pagination
    v-model:current-page="pagination.page"
    :page-size="pagination.pageSize"
    :total="pagination.total"
    layout="prev, pager, next, jumper, slot"
  />
</div>
```

- [ ] **Step 6: 定义完整 Mock 数据**

在 script setup 中添加完整的 Mock 数据，包含 6 条推荐达人数据，每条包含：
- id, avatar, name, level, contactAvailable
- mainCategories（主营类目数组）
- relatedCategories（关联类目字符串）
- avgPrice, recentSalesAmount
- stats（粉丝量、直播场次、场均销售额、场均销量、平均场观）
- matchScore（匹配分）
- recommendReason（推荐理由类型和详情）
- isFollowed（是否已跟进）

以及 3 个可授权店铺的 Mock 数据。

- [ ] **Step 7: 实现 Tab 切换逻辑**

```js
const activeTab = ref('shop')
const paginatedInfluencers = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return mockInfluencers.slice(start, start + pagination.pageSize)
})
```

- [ ] **Step 8: 添加 SCSS 样式（基础框架）**

按照 PRD 颜色规范定义 CSS 变量和基础样式。

- [ ] **Step 9: 提交**

```bash
git add src/views/SmartRecommendation.vue src/router/index.js
git commit -m "feat: 添加智能推荐达人页面基础框架和Mock数据"
```

---

### Task 3: 推荐达人卡片完整实现

**Files:**
- Modify: `src/views/SmartRecommendation.vue`（完善卡片内容）

- [ ] **Step 1: 实现卡片左侧主体区的完整结构**

达人基本信息行：
```vue
<div class="card-info-row">
  <img :src="card.avatar" class="avatar" />
  <span class="influencer-name" @click="handleNameClick(card)">{{ card.name }}</span>
  <el-icon class="contact-icon" @click="handleContactClick(card)"><Message /></el-icon>
  <span class="level-tag">{{ card.level }}</span>
</div>
```

主营类目标签行：
```vue
<div class="category-row">
  <span class="category-label">主营类目：</span>
  <span
    v-for="(cat, idx) in card.mainCategories"
    :key="idx"
    class="category-tag"
  >
    {{ cat.name }} {{ cat.percentage }}%
  </span>
</div>
```

关联类目信息行：
```vue
<div class="category-info-row">
  <span>{{ card.relatedCategories }}</span>
  <span class="category-info-divider">|</span>
  <span>均价：{{ card.avgPrice }}</span>
  <span class="category-info-divider">|</span>
  <span>近30日成交金额：{{ card.recentSalesAmount }}</span>
  <span class="view-category-link" @click="showCategoryPopover(card, $event)">查看关联类目 ></span>
</div>
```

五项数据指标行：
```vue
<div class="stats-row">
  <div class="stat-item">
    <div class="stat-label">粉丝量</div>
    <div class="stat-value">
      {{ card.stats.followers }}
      <span class="stat-sub" @click="showFollowerPopover(card, $event)">{{ card.stats.followerGender }} ></span>
    </div>
  </div>
  <div class="stat-item">
    <div class="stat-label">直播场次</div>
    <div class="stat-value">{{ card.stats.liveSessions }}</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">场均销售额</div>
    <div class="stat-value">{{ card.stats.avgSalesAmount }}</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">场均销量</div>
    <div class="stat-value">{{ card.stats.avgSalesCount }}</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">平均场观</div>
    <div class="stat-value">{{ card.stats.avgViewers }}</div>
  </div>
</div>
```

- [ ] **Step 2: 实现卡片右侧匹配分区**

匹配分仪表盘（SVG 半圆）：
```vue
<div class="match-score-section">
  <div class="match-score-gauge">
    <svg viewBox="0 0 80 50" class="gauge-svg">
      <path
        d="M 5 45 A 35 35 0 0 1 75 45"
        fill="none"
        stroke="#E8E8E8"
        stroke-width="6"
        stroke-linecap="round"
      />
      <path
        d="M 5 45 A 35 35 0 0 1 75 45"
        fill="none"
        :stroke="getGaugeColor(card.matchScore)"
        stroke-width="6"
        stroke-linecap="round"
        :stroke-dasharray="getGaugeDash(card.matchScore)"
      />
    </svg>
  </div>
  <div class="match-score-value">{{ card.matchScore }}</div>
  <div class="match-score-label">匹配分 <el-icon><QuestionFilled /></el-icon></div>
</div>
```

推荐理由区域，根据类型显示不同内容：
```vue
<div class="recommend-reason">
  <div class="reason-title">推荐理由：</div>
  <div class="reason-type">{{ card.recommendReason.title }}</div>
  <div class="reason-detail" v-if="card.recommendReason.details?.length">
    <template v-if="card.recommendReason.type === 'historySimilar'">
      <img
        v-for="(detail, idx) in card.recommendReason.details"
        :key="idx"
        :src="detail.avatar"
        class="reason-avatar"
      />
      <span>{{ card.recommendReason.details[0].name }} <span class="reason-count">+{{ card.recommendReason.details[0].count }}</span></span>
    </template>
  </div>
</div>
```

操作按钮行：
```vue
<div class="card-actions">
  <button class="btn-dislike" @click="handleDislike(card)" title="踩">👎</button>
  <el-button class="btn-assign" @click="handleAssign(card)">分配达人</el-button>
  <el-button
    class="btn-follow"
    :disabled="card.isFollowed"
    @click="handleFollow(card)"
  >
    {{ card.isFollowed ? '已跟进' : '跟进' }}
  </el-button>
</div>
```

- [ ] **Step 3: 添加卡片相关方法**

```js
const getGaugeDash = (score) => {
  const percent = score / 100
  const circumference = Math.PI * 70 // 半圆弧长
  return `${percent * circumference} ${circumference}`
}

const getGaugeColor = (score) => {
  if (score >= 90) return '#1A4FC4'
  if (score >= 70) return '#1677FF'
  return '#FAAD14'
}

const handleNameClick = (card) => { /* 预留 */ }
const handleContactClick = (card) => { /* 预留 */ }
const handleFollow = (card) => {
  card.isFollowed = true
  ElMessage.success('跟进成功，您可在"我的达人"页面继续跟进该达人 [查看]')
}
const handleAssign = (card) => { /* 预留分配达人弹窗 */ }
```

- [ ] **Step 4: 提交**

```bash
git add src/views/SmartRecommendation.vue
git commit -m "feat: 实现推荐达人卡片完整结构"
```

---

### Task 4: 踩反馈弹窗

**Files:**
- Modify: `src/views/SmartRecommendation.vue`

- [ ] **Step 1: 添加踩反馈弹窗模板**

```vue
<!-- 踩反馈弹窗 -->
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
```

- [ ] **Step 2: 添加踩反馈相关状态和方法**

```js
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

  // 预留 API 调用
  console.log('提交踩反馈:', {
    influencerId: currentDislikeCard.value.id,
    reason: selectedDislike.value,
    otherReason: dislikeOtherReason.value
  })

  ElMessage.success('感谢反馈，系统将记录该操作并持续修正推荐结果')
  dislikePopoverVisible.value = false
}
```

- [ ] **Step 3: 添加踩反馈弹窗样式**

```scss
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
```

- [ ] **Step 4: 提交**

```bash
git add src/views/SmartRecommendation.vue
git commit -m "feat: 实现踩反馈弹窗"
```

---

### Task 5: 调整推荐方案抽屉

**Files:**
- Modify: `src/views/SmartRecommendation.vue`

- [ ] **Step 1: 添加抽屉模板**

```vue
<!-- 调整推荐方案抽屉 -->
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
          <el-slider v-model="source.weight" :min="0" :max="100" show-input />
        </div>
      </div>
    </div>

    <!-- 更多配置项... -->

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
```

- [ ] **Step 2: 添加抽屉状态数据**

```js
const showStrategyDrawer = ref(false)
const sourceTypes = reactive([
  { key: 'shop_match', label: '店铺画像匹配达人', weight: 50 },
  { key: 'default', label: '默认推荐', weight: 50 },
  { key: 'competitor', label: '竞品优质合作达人', weight: 30 },
  { key: 'category', label: '商品类目优质达人', weight: 30 }
])

// 达人粉丝画像配置
const followerProfile = reactive({
  age: '',
  gender: '',
  region: ''
})

// 带货类目
const categories = ref([])

// 潜在竞品
const competitors = ref([
  { name: 'PLANNER/珀兰娜' },
  { name: 'BEINIDAR' },
  { name: 'sellion/雪尔妮兰' },
  { name: 'Florasis/花西子' }
])

// 达人粉丝量级
const followerLevels = ref([
  { range: '0-1w', percent: 54 },
  { range: '1-10w', percent: 28 },
  { range: '10-100w', percent: 13 },
  { range: '100-500w', percent: 4 },
  { range: '500w+', percent: 1 }
])

// 达人类型分布
const influencerTypes = ref([
  { name: '美妆', percent: 32 },
  { name: '时尚', percent: 22 },
  { name: '测评', percent: 12 },
  { name: '颜值达人', percent: 11 }
])

// 带货表现
const带货Performance = reactive({
  liveGmv: '',
  videoSales: ''
})
```

- [ ] **Step 3: 添加抽屉方法**

```js
const resetToDefault = () => {
  // 重置所有配置为默认值
  sourceTypes.forEach(s => s.weight = 50)
}

const saveStrategy = () => {
  // 预留 API 调用
  console.log('保存推荐策略:', {
    shopId: currentShop.value.id,
    sourceTypes: sourceTypes.map(s => ({ key: s.key, weight: s.weight })),
    followerProfile: followerProfile,
    competitors: competitors.value
  })

  ElMessage.success('策略保存成功')
  showStrategyDrawer.value = false
}
```

- [ ] **Step 4: 添加抽屉样式**

```scss
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
```

- [ ] **Step 5: 提交**

```bash
git add src/views/SmartRecommendation.vue
git commit -m "feat: 实现调整推荐方案抽屉"
```

---

### Task 6: Tooltip 弹窗（关联类目、粉丝画像）

**Files:**
- Modify: `src/views/SmartRecommendation.vue`

- [ ] **Step 1: 添加关联类目 Popover**

```vue
<el-popover
  v-model:visible="categoryPopoverVisible"
  placement="bottom"
  :width="400"
  trigger="click"
>
  <div class="category-popover">
    <table class="popover-table">
      <thead>
        <tr>
          <th>类目</th>
          <th>均价</th>
          <th>成交金额</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, idx) in categoryDetails" :key="idx">
          <td>{{ cat.name }}</td>
          <td>{{ cat.price }}</td>
          <td>{{ cat.sales }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</el-popover>
```

```js
const categoryPopoverVisible = ref(false)
const categoryDetails = ref([
  { name: '食品饮料/饮料/乳品/咖啡/麦片/冲调', price: '¥25-¥50', sales: '¥750-¥1w' },
  { name: '食品饮料/粮油米面/南北干货/调味品', price: '¥5-¥50', sales: '—' },
  { name: '食品饮料/方便速食', price: '—', sales: '—' }
])

const showCategoryPopover = (card, event) => {
  categoryPopoverVisible.value = true
}
```

- [ ] **Step 2: 添加粉丝画像 Popover**

```vue
<el-popover
  v-model:visible="followerPopoverVisible"
  placement="bottom"
  :width="280"
  trigger="click"
>
  <div class="follower-popover">
    <table class="popover-table">
      <tbody>
        <tr>
          <td class="popover-label">粉丝数量</td>
          <td>{{ currentFollowerStats.followers }}</td>
        </tr>
        <tr>
          <td class="popover-label">粉丝性别</td>
          <td>{{ currentFollowerStats.gender }}</td>
        </tr>
        <tr>
          <td class="popover-label">粉丝年龄</td>
          <td>{{ currentFollowerStats.age }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</el-popover>
```

```js
const followerPopoverVisible = ref(false)
const currentFollowerStats = ref({
  followers: '10.22w',
  gender: '女性 51%',
  age: '25-34、18-24 居多'
})

const showFollowerPopover = (card, event) => {
  currentFollowerStats.value = {
    followers: card.stats.followers,
    gender: card.stats.followerGender,
    age: '25-34、18-24 居多'
  }
  followerPopoverVisible.value = true
}
```

- [ ] **Step 3: 添加 Popover 样式**

```scss
.category-popover,
.follower-popover {
  min-width: 280px;
  background: #fff;
  border: 1px solid #E8E8E8;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  padding: 12px;
}

.popover-table {
  width: 100%;
  font-size: 12px;

  th {
    color: #8C8C8C;
    font-weight: 400;
    padding: 4px 8px;
    text-align: left;
  }

  td {
    color: #262626;
    padding: 6px 8px;
    border-top: 1px solid #F0F0F0;
  }

  .popover-label {
    color: #8C8C8C;
    width: 80px;
  }
}
```

- [ ] **Step 4: 提交**

```bash
git add src/views/SmartRecommendation.vue
git commit -m "feat: 实现关联类目和粉丝画像弹窗"
```

---

### Task 7: 店铺下拉和吸顶效果

**Files:**
- Modify: `src/views/SmartRecommendation.vue`

- [ ] **Step 1: 实现店铺下拉切换**

```vue
<el-popover
  v-model:visible="showShopPopover"
  placement="bottom-start"
  :width="280"
  trigger="click"
>
  <div class="shop-list-popover">
    <div
      v-for="shop in authorizedShops"
      :key="shop.id"
      class="shop-item"
      :class="{ active: shop.id === currentShop.id }"
      @click="selectShop(shop)"
    >
      <img :src="shop.logo" class="shop-item-logo" />
      <span class="shop-item-name">{{ shop.name }}</span>
      <el-icon v-if="shop.id === currentShop.id"><Check /></el-icon>
    </div>
  </div>
</el-popover>
```

```js
const showShopPopover = ref(false)
const authorizedShops = ref([
  { id: '1', logo: '/images/shop1.png', name: '官方旗舰店' },
  { id: '2', logo: '/images/shop2.png', name: '美妆专营店' },
  { id: '3', logo: '/images/shop3.png', name: '食品专营店' }
])
const currentShop = ref(authorizedShops.value[0])

const selectShop = (shop) => {
  currentShop.value = shop
  showShopPopover.value = false
  // 刷新推荐列表
  refreshRecommendation()
}
```

- [ ] **Step 2: 添加店铺列表 Popover 样式**

```scss
.shop-list-popover {
  padding: 8px 0;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #F5F5F5;
  }

  &.active {
    color: #1677FF;
  }

  .shop-item-logo {
    width: 32px;
    height: 32px;
    border-radius: 4px;
  }

  .shop-item-name {
    flex: 1;
    font-size: 14px;
  }
}
```

- [ ] **Step 3: 实现吸顶效果**

```js
import { ref, onMounted, onUnmounted } from 'vue'

const isSticky = ref(false)
const handleScroll = () => {
  isSticky.value = window.scrollY > 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
```

```vue
<div class="shop-info-bar" :class="{ 'is-sticky': isSticky }">
  <div class="shop-info-left">
    <div class="shop-name-row">
      <img :src="currentShop.logo" class="shop-logo" />
      <span class="shop-name">{{ currentShop.name }}</span>
    </div>
    <div class="strategy-row" v-show="!isSticky">
      <!-- 策略标签... -->
    </div>
  </div>
</div>
```

```scss
.shop-info-bar {
  &.is-sticky {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);

    .shop-info-left {
      .shop-logo {
        width: 32px;
        height: 32px;
      }
    }
  }
}
```

- [ ] **Step 4: 提交**

```bash
git add src/views/SmartRecommendation.vue
git commit -m "feat: 实现店铺下拉切换和吸顶效果"
```

---

### Task 8: 完整样式调优和 PRD 对照

**Files:**
- Modify: `src/views/SmartRecommendation.vue`

- [ ] **Step 1: 对照 PRD 颜色规范检查并修正所有颜色值**

确保所有颜色使用正确：
- Primary Blue: #1677FF
- Deep Blue: #1A4FC4
- Text Primary: #262626
- Text Secondary: #595959
- Text Placeholder: #8C8C8C
- Border: #EBEBEB
- Border Input: #D9D9D9
- BG Page: #FAFAFA
- BG Card: #FFFFFF
- BG Tag: #EBF3FF
- Match Gradient: linear-gradient(135deg, #EAF4FF, #C8E0FF)
- Warning: #FAAD14

- [ ] **Step 2: 检查间距和尺寸**

- 卡片边距: 0 24px 12px
- 卡片内边距: 16px 20px (主体区), 16px (匹配区)
- Tab 栏高度: 48px
- 店铺信息栏内边距: 16px 24px

- [ ] **Step 3: 验证交互完整性**

检查以下交互是否工作：
- Tab 切换 ✓
- 店铺下拉切换 ✓
- 踩反馈弹窗 ✓
- 跟进操作 ✓
- 分页功能 ✓
- 抽屉滑出 ✓

- [ ] **Step 4: 提交**

```bash
git add src/views/SmartRecommendation.vue
git commit -m "style: 样式调优对照PRD规范"
```

---

## 验证清单

- [ ] 路由 `/smart-recommendation` 可访问
- [ ] Tab 切换正常（按店铺/按商品）
- [ ] 店铺下拉可切换
- [ ] 吸顶效果正常
- [ ] 推荐达人卡片正确渲染（左右分区）
- [ ] 匹配分仪表盘显示正确
- [ ] 踩反馈弹窗可用
- [ ] 跟进操作成功并提示
- [ ] 分页功能正常
- [ ] 调整推荐方案抽屉可打开
- [ ] 关联类目 Popover 显示
- [ ] 粉丝画像 Popover 显示

---

**执行选项:**

**1. Subagent-Driven (recommended)** - 任务逐个执行，任务间 review

**2. Inline Execution** - 当前会话批量执行，带检查点

选择哪个方式执行？
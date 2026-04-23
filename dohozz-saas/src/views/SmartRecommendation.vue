<template>
  <div class="smart-recommendation">
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

    <!-- 店铺信息栏 -->
    <div class="shop-info-bar">
      <div class="shop-info-left">
        <div class="shop-name-row">
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
        </div>
      </div>
      <el-button class="btn-adjust-strategy" @click="showStrategyDrawer = true">
        <span>≡</span> 调整推荐方案
      </el-button>
    </div>

    <!-- 列表标题栏 -->
    <div class="recommend-header">
      <div class="header-left">
        <span class="header-title">今日推荐</span>
        <span class="header-count">（{{ pagination.total }}）</span>
        <span class="header-date">2023/12/25（统计近30天的数据，系统会根据您点击的跟进和淘汰情况为您调整最佳推荐规则）</span>
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
        <div class="card-main">
          <div class="card-info-row">
            <img :src="card.avatar" class="avatar" />
            <span class="influencer-name">{{ card.name }}</span>
            <span class="level-tag">{{ card.level }}</span>
          </div>
        </div>
        <div class="card-match">
          <div class="match-score-section">
            <div class="match-score-value">{{ card.matchScore }}</div>
            <div class="match-score-label">匹配分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页栏 -->
    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const activeTab = ref('shop')

const recommendationStats = reactive({
  totalInfluencers: 98,
  totalSalesAmount: '5,932.82'
})

const currentShop = reactive({
  id: '1',
  logo: 'https://via.placeholder.com/40',
  name: '官方旗舰店',
  strategy: {
    avgOrderPrice: '¥48.29',
    mainCategory: '美妆护肤'
  }
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 150
})

const mockInfluencers = ref([
  {
    id: '1',
    avatar: 'https://via.placeholder.com/40',
    name: '达人小美',
    level: 'LV8',
    matchScore: 96.52
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/40',
    name: '带货达人',
    level: 'LV7',
    matchScore: 89.21
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/40',
    name: '精选达人',
    level: 'LV6',
    matchScore: 82.15
  }
])

const paginatedInfluencers = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return mockInfluencers.value.slice(start, start + pagination.pageSize)
})
</script>

<style lang="scss" scoped>
.smart-recommendation {
  min-height: 100vh;
  background: #FAFAFA;
}

.top-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #EBEBEB;

  .tab-left {
    display: flex;
    gap: 32px;
  }

  .tab-item {
    font-size: 16px;
    color: #595959;
    cursor: pointer;
    padding: 12px 0;
    border-bottom: 2px solid transparent;

    &.active {
      color: #1677FF;
      font-weight: 600;
      border-bottom: 2px solid #1677FF;
    }
  }

  .tab-right {
    font-size: 13px;
    color: #595959;
  }

  .highlight {
    color: #1677FF;
    font-weight: 600;
  }
}

.shop-info-bar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;

  .shop-info-left {
    flex: 1;
  }

  .shop-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    cursor: pointer;
  }

  .shop-logo {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background: #F5F5F5;
  }

  .shop-name {
    font-size: 15px;
    font-weight: 600;
    color: #262626;
  }

  .strategy-row {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #595959;
    flex-wrap: wrap;
  }

  .strategy-divider {
    color: #D9D9D9;
  }

  .strategy-value {
    color: #262626;
  }

  .strategy-highlight {
    color: #1677FF;
  }
}

.btn-adjust-strategy {
  height: 32px;
  padding: 0 12px;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  background: #fff;
  color: #595959;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.recommend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px 12px;
  background: #FAFAFA;

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
  }

  .header-count {
    font-size: 16px;
    font-weight: 600;
    color: #1677FF;
  }

  .header-date {
    font-size: 12px;
    color: #8C8C8C;
    margin-left: 12px;
  }

  .header-right {
    font-size: 12px;
    color: #8C8C8C;
  }

  .highlight {
    font-size: 13px;
    color: #1677FF;
    font-weight: 600;
  }
}

.influencer-list {
  padding: 12px 0;
}

.influencer-card {
  display: flex;
  align-items: stretch;
  background: #fff;
  border: 1px solid #EBEBEB;
  border-radius: 8px;
  margin: 0 24px 12px;
  overflow: hidden;
}

.card-main {
  flex: 1;
  padding: 16px 20px;
}

.card-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E8E8E8;
}

.influencer-name {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
}

.level-tag {
  padding: 1px 6px;
  background: linear-gradient(90deg, #5B8DEF, #3B6EE8);
  border-radius: 3px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.card-match {
  width: 220px;
  min-width: 220px;
  background: linear-gradient(135deg, #EAF4FF 0%, #C8E4FF 100%);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.match-score-section {
  text-align: center;
}

.match-score-value {
  font-size: 22px;
  font-weight: 700;
  color: #1A4FC4;
}

.match-score-label {
  font-size: 11px;
  color: #595959;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  gap: 8px;
  background: #fff;
}
</style>

<template>
  <div class="stats-banner">
    <!-- 顶部提示区 -->
    <div class="banner-tip">
      <span class="tip-text">带货视频自动监控中</span>
      <span class="tip-link" @click="handleManualAdd">手动添加视频</span>
    </div>

    <!-- 统计信息区 -->
    <div class="banner-content">
      <div class="stats-text">
        系统已为您累计追踪到
        <span class="stats-number" @click="handleTrackedInfluencer">{{ trackedInfluencers }}</span> 位达人的
        <span class="stats-number" @click="handleTrackedInfluencer">{{ trackedVideos }}</span> 个视频及
        <span class="stats-number" @click="handleTrackedInfluencer">{{ trackedLives }}</span> 场直播
      </div>

      <div class="quick-entries">
        <span class="entry-link" @click="handleTrackedInfluencer">我的追踪达人</span>
        <span class="entry-divider">|</span>
        <span class="entry-link" @click="handleMonitorRule">监控规则</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  trackedInfluencers: {
    type: Number,
    default: 0
  },
  trackedVideos: {
    type: Number,
    default: 0
  },
  trackedLives: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click-tracked-influencer', 'click-monitor-rule', 'click-manual-add'])

function handleTrackedInfluencer() {
  emit('click-tracked-influencer')
}

function handleMonitorRule() {
  emit('click-monitor-rule')
}

function handleManualAdd() {
  emit('click-manual-add')
}
</script>

<style scoped lang="scss">
.stats-banner {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.banner-tip {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;

  .tip-text {
    font-size: 13px;
    color: #666;
    margin-right: 8px;
  }

  .tip-link {
    font-size: 13px;
    color: #1677ff;
    cursor: pointer;

    &:hover {
      color: #4096ff;
    }
  }
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.stats-text {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .stats-number {
    font-size: 20px;
    font-weight: 600;
    color: #1677ff;
    margin: 0 4px;
    cursor: pointer;

    &:hover {
      color: #4096ff;
    }
  }
}

.quick-entries {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  .entry-link {
    font-size: 14px;
    color: #1677ff;
    cursor: pointer;

    &:hover {
      color: #4096ff;
    }
  }

  .entry-divider {
    color: #d9d9d9;
  }
}
</style>

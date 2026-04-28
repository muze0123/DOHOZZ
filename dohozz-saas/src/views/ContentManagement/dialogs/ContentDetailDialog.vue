<template>
  <el-dialog
    v-model="dialogVisible"
    title="内容详情"
    width="640px"
    @close="handleClose"
  >
    <div v-if="content" class="detail-content">
      <!-- 封面预览 -->
      <div v-if="content.coverUrl" class="cover-preview">
        <el-image :src="content.coverUrl" fit="cover" style="width: 100%; max-height: 300px;" />
      </div>

      <!-- 基本信息 -->
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">内容ID</span>
            <span class="info-value">{{ content.id }}</span>
          </div>
          <div class="info-item full">
            <span class="info-label">内容标题</span>
            <span class="info-value">{{ content.title }}</span>
          </div>
          <div class="info-item full">
            <span class="info-label">达人信息</span>
            <span class="info-value influencer">
              <el-avatar v-if="content.avatar" :src="content.avatar" size="small" />
              <span>{{ content.streamerName }}</span>
              <span class="account">{{ content.account }}</span>
            </span>
          </div>
          <div class="info-item full">
            <span class="info-label">内容标签</span>
            <span class="info-value">
              <span v-for="tag in content.contentTags" :key="tag" class="tag-item">{{ tag }}</span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">发布形式</span>
            <span class="info-value">{{ getPublishFormText(content.publishForm) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关联计划</span>
            <span class="info-value">{{ content.planName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关联SPU</span>
            <span class="info-value">{{ content.spuName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所属部门</span>
            <span class="info-value">{{ content.departmentName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所属媒介</span>
            <span class="info-value medium">
              <el-avatar v-if="content.mediumAvatar" :src="content.mediumAvatar" size="small" />
              <span>{{ content.mediumName || '--' }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="detail-section stats-section">
        <div class="section-title">数据统计</div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(content.plays) }}</div>
            <div class="stat-label">播放量/阅读量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(content.likes) }}</div>
            <div class="stat-label">点赞数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(content.comments) }}</div>
            <div class="stat-label">评论数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(content.collects) }}</div>
            <div class="stat-label">收藏数</div>
          </div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="detail-section">
        <div class="section-title">时间信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">发布时间</span>
            <span class="info-value">{{ content.publishTime || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">创建时间</span>
            <span class="info-value">{{ content.createTime || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 备注 -->
      <div v-if="content.remark" class="detail-section">
        <div class="section-title">备注</div>
        <div class="remark-content">{{ content.remark }}</div>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  content: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

function getPublishFormText(form) {
  const map = {
    short_video: '短视频',
    live: '直播',
    image_text: '图文',
    recommend: '种草'
  }
  return map[form] || form || '--'
}

function formatNumber(num) {
  if (!num && num !== 0) return '--'
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num.toLocaleString()
}
</script>

<style scoped>
.detail-content {
  padding: 8px 0;
  max-height: 60vh;
  overflow-y: auto;
}

.cover-preview {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.detail-section {
  margin-bottom: 20px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.stats-section {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;

  .section-title {
    border-bottom: none;
    margin-bottom: 12px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;

  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  &.full {
    grid-column: 1 / -1;
  }

  .info-label {
    font-size: 12px;
    color: #999;
    display: block;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 14px;
    color: #333;

    &.influencer {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      .account {
        color: #999;
        font-size: 12px;
      }
    }

    &.medium {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  }

  .tag-item {
    display: inline-block;
    background: #fff2e6;
    color: #ff6600;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-right: 6px;
    margin-bottom: 4px;
  }
}

.remark-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

:deep(.el-dialog) {
  border-radius: 12px;
}
</style>

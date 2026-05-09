<template>
  <el-dialog
    v-model="visible"
    title="插件找达人"
    width="480px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="plugin-content">
      <div class="plugin-icon">
        <svg viewBox="0 0 80 80" width="80" height="80">
          <circle cx="40" cy="40" r="36" fill="#e6f4ff"/>
          <text x="40" y="50" text-anchor="middle" font-size="32">🔍</text>
        </svg>
      </div>
      <h3 class="plugin-title">浏览器插件 — 随时随地找达人</h3>
      <p class="plugin-desc">
        安装我们的浏览器插件，即可在 TikTok、Instagram 等平台上一键获取达人信息，<br />
        轻松将心仪达人添加到您的专属达人库。
      </p>

      <div class="plugin-features">
        <div class="feature-item">
          <span class="feature-icon">⚡</span>
          <span class="feature-text">一键提取页面达人数据</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📊</span>
          <span class="feature-text">自动补全达人详细信息</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">⭐</span>
          <span class="feature-text">智能分析达人质量评分</span>
        </div>
      </div>

      <div class="plugin-download">
        <el-button type="primary" size="large" class="download-btn">
          <el-icon><Download /></el-icon>
          下载插件
        </el-button>
        <p class="download-hint">支持 Chrome / Edge / Firefox 浏览器</p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { Download } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
.plugin-content {
  text-align: center;
  padding: 20px 0;
}

.plugin-icon {
  margin-bottom: 16px;
}

.plugin-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px;
}

.plugin-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px;
}

.plugin-features {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
}

.feature-icon {
  font-size: 18px;
}

.feature-text {
  font-size: 14px;
  color: #333;
}

.plugin-download {
  text-align: center;
}

.download-btn {
  min-width: 160px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.download-hint {
  font-size: 12px;
  color: #999;
  margin: 8px 0 0;
}
</style>

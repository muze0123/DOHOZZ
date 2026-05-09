<template>
  <el-dialog
    v-model="dialogVisible"
    title="视频播放"
    width="720px"
    @close="handleClose"
  >
    <div class="player-container">
      <div class="video-placeholder">
        <el-icon class="play-icon"><VideoPlay /></el-icon>
        <p>视频播放功能（Mock数据）</p>
        <p class="video-title">{{ video?.title }}</p>
      </div>
    </div>
    <div class="video-info">
      <div class="info-item">
        <span class="label">达人：</span>
        <span class="value">{{ video?.influencer?.name }}</span>
      </div>
      <div class="info-item">
        <span class="label">发布时间：</span>
        <span class="value">{{ video?.publishTime }}</span>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  video: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}
</script>

<style scoped>
.player-container {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.video-placeholder {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  gap: 12px;

  .play-icon {
    font-size: 64px;
  }

  .video-title {
    font-size: 14px;
    color: #666;
  }
}

.video-info {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;

  .info-item {
    font-size: 13px;

    .label {
      color: #999;
    }

    .value {
      color: #333;
    }
  }
}
</style>

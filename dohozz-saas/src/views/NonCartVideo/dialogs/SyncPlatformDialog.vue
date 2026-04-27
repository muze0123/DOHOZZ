<template>
  <el-dialog
    v-model="dialogVisible"
    title="投流数据同步"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="sync-content">
      <!-- 同步视频列表 -->
      <div class="sync-field">
        <div class="field-label">同步视频列表</div>
        <div class="video-list">
          <div
            v-for="video in selectedVideos"
            :key="video.id"
            class="video-item"
          >
            <div class="video-thumbnail">
              <el-icon :size="18"><VideoCamera /></el-icon>
            </div>
            <div class="video-info">
              <div class="video-title">{{ video.title }}</div>
              <div class="video-publish-time">{{ video.publishTime }}</div>
            </div>
          </div>
          <div v-if="!selectedVideos || selectedVideos.length === 0" class="empty-list">
            暂无可同步的视频
          </div>
        </div>
      </div>

      <!-- 投流平台 -->
      <div class="sync-field">
        <div class="field-label">投流平台</div>
        <el-select
          v-model="selectedPlatform"
          placeholder="请选择投流平台"
          style="width: 100%"
        >
          <el-option
            v-for="platform in platformOptions"
            :key="platform.key"
            :label="platform.label"
            :value="platform.key"
          />
        </el-select>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="syncing">取消</el-button>
        <el-button type="primary" @click="handleSync" :loading="syncing">
          确定同步
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { VideoCamera } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  selectedVideos: {
    type: Array,
    default: () => []
  },
  activePlatform: {
    type: String,
    default: 'tiktok'
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const syncing = ref(false)
const selectedPlatform = ref(props.activePlatform)

// 平台选项，与页面 Tab 对应
const platformOptions = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'shopee', label: 'Shopee' },
  { key: 'lazada', label: 'Lazada' }
]

function handleClose() {
  dialogVisible.value = false
}

function handleSync() {
  if (!selectedPlatform.value) {
    ElMessage.warning('请选择投流平台')
    return
  }

  syncing.value = true

  // 模拟同步请求
  setTimeout(() => {
    syncing.value = false

    // 模拟随机成功/失败
    const isSuccess = Math.random() > 0.3
    if (isSuccess) {
      dialogVisible.value = false
      ElMessage.success('同步成功')
    } else {
      ElMessage.error('同步失败，请稍后重试')
    }
  }, 1500)
}
</script>

<style scoped lang="scss">
.sync-content {
  padding: 8px 0;
}

.sync-field {
  margin-bottom: 20px;

  .field-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }
}

.video-list {
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid #e8e8e8;
  border-radius: 6px;

  .video-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .video-thumbnail {
      width: 64px;
      height: 44px;
      flex-shrink: 0;
      border-radius: 4px;
      overflow: hidden;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bbb;
    }

    .video-info {
      flex: 1;
      min-width: 0;

      .video-title {
        font-size: 13px;
        color: #333;
        line-height: 1.4;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .video-publish-time {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .empty-list {
    padding: 40px 0;
    text-align: center;
    color: #ccc;
    font-size: 13px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

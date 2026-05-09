<template>
  <div class="ai-rewrite-page">
    <!-- 右上角用户资产与功能入口区 -->
    <div class="top-right-area">
      <div class="points-btn" @click="showRechargeDialog = true">
        <svg class="diamond-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M12 2L2 9l10 13 10-13-10-7zm0 3.5L17.5 9 12 18.5 6.5 9 12 5.5z"/>
        </svg>
        <span class="points-value">{{ currentPoints.toLocaleString() }}</span>
        <span class="points-text">增购积分</span>
      </div>
      <div class="history-btn" @click="showHistoryDialog = true">
        <svg class="clock-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2 2.8-4.6-4.5-2.6V7z"/>
        </svg>
        <span>历史记录</span>
      </div>
    </div>

    <!-- 核心功能区域 -->
    <div class="core-function-area">
      <!-- 引导标语 -->
      <div class="guide-slogan">
        <span class="slogan-text">打品就用</span>
        <span>💥</span>
        <span class="gradient-text">爆款探测器</span>
      </div>

      <!-- 主标题 -->
      <h1 class="main-title">智能仿写 一键生成</h1>

      <!-- 输入与操作区域 -->
      <div class="input-area">
        <div class="input-wrapper" :class="{ 'has-error': errorMsg }">
          <input
            type="text"
            class="url-input"
            v-model="videoUrl"
            placeholder="请输入抖音视频链接"
            autofocus
            @keyup.enter="handleRewrite"
          />
          <button
            class="rewrite-btn"
            :class="{ disabled: !canRewrite }"
            :disabled="!canRewrite"
            @click="handleRewrite"
          >
            <span class="rewrite-icon">🔶</span>
            <span class="rewrite-points">3</span>
            <span class="rewrite-text">开始仿写</span>
          </button>
        </div>
        <div class="error-tip" v-if="errorMsg">{{ errorMsg }}</div>
      </div>
    </div>

    <!-- Loading遮罩 -->
    <div class="loading-overlay" v-if="isRewriting">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">仿写中，请稍候...</div>
      </div>
    </div>

    <!-- 历史记录弹窗 -->
    <RewriteHistoryDialog
      v-model="showHistoryDialog"
      @view="handleViewHistory"
    />

    <!-- 仿写结果弹窗 -->
    <RewriteResultDialog
      v-model="showResultDialog"
      :result="currentResult"
      @regenerate="handleRegenerate"
    />

    <!-- 积分充值弹窗 -->
    <RewriteRechargeDialog
      v-model="showRechargeDialog"
      :current-points="currentPoints"
      @recharge="handleRecharge"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import RewriteHistoryDialog from '@/views/dialogs/RewriteHistoryDialog.vue'
import RewriteResultDialog from '@/views/dialogs/RewriteResultDialog.vue'
import RewriteRechargeDialog from '@/views/dialogs/RewriteRechargeDialog.vue'
import { useRewriteHistoryStore } from '@/stores/rewriteHistory'
import { aiRewrite } from '@/api/shoppingVideo'

const historyStore = useRewriteHistoryStore()

const currentPoints = ref(1746)
const videoUrl = ref('')
const errorMsg = ref('')
const isRewriting = ref(false)
const showHistoryDialog = ref(false)
const showResultDialog = ref(false)
const showRechargeDialog = ref(false)
const currentResult = ref(null)

// 验证抖音链接格式
const isValidDouyinUrl = (url) => {
  const patterns = [
    /https:\/\/www\.douyin\.com\/video\/\d+/,
    /https:\/\/v\.douyin\.com\/\w+/,
  ]
  return patterns.some(pattern => pattern.test(url))
}

const canRewrite = computed(() => {
  return videoUrl.value.trim() !== '' && isValidDouyinUrl(videoUrl.value.trim())
})

const handleRewrite = async () => {
  errorMsg.value = ''

  if (!videoUrl.value.trim()) {
    errorMsg.value = '请输入抖音视频链接'
    return
  }

  if (!isValidDouyinUrl(videoUrl.value.trim())) {
    errorMsg.value = '请输入有效的抖音视频链接'
    return
  }

  if (currentPoints.value < 3) {
    ElMessage.error('积分不足，本次仿写需要3积分')
    showRechargeDialog.value = true
    return
  }

  // 开始仿写
  isRewriting.value = true
  currentPoints.value -= 3

  try {
    const res = await aiRewrite(videoUrl.value.trim(), { style: 'casual' })

    // 添加到历史记录
    historyStore.addRecord({
      videoUrl: videoUrl.value.trim(),
      rewriteContent: res.data.rewritten
    })

    currentResult.value = {
      original: res.data.original,
      rewritten: res.data.rewritten
    }

    showResultDialog.value = true
    ElMessage.success('仿写成功')
  } catch (error) {
    ElMessage.error('仿写失败，请重试')
    // 返还积分
    currentPoints.value += 3
  } finally {
    isRewriting.value = false
  }
}

const handleViewHistory = (item) => {
  currentResult.value = {
    original: item.videoUrl,
    rewritten: item.rewriteContent
  }
  showHistoryDialog.value = false
  showResultDialog.value = true
}

const handleRegenerate = () => {
  showResultDialog.value = false
  handleRewrite()
}

const handleRecharge = (pkg) => {
  ElMessage.success(`充值成功：${pkg.points}积分`)
  currentPoints.value += pkg.points
}
</script>

<style lang="scss" scoped>
.ai-rewrite-page {
  min-height: calc(100vh - 48px);
  background: linear-gradient(135deg, #E8F4FF 0%, #FFF0F5 50%, #F0E6FF 100%);
  position: relative;
  overflow: hidden;

  // 淡灰色网格纹理背景
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
  }
}

/* 右上角用户资产与功能入口区 */
.top-right-area {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 12px;
  z-index: 10;
}

.points-btn, .history-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  background: #F5F5F5;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: #595959;

  &:hover {
    background: #E8E8E8;
  }
}

.points-btn .diamond-icon {
  color: #FF6600;
}

.points-btn .points-value {
  color: #FF6600;
  font-weight: 600;
}

.points-btn .points-text {
  color: #262626;
}

/* 核心功能区域 */
.core-function-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  max-width: 700px;
  padding: 0 24px;
}

/* 引导标语 */
.guide-slogan {
  font-size: 16px;
  color: #262626;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  .slogan-text {
    color: #000;
  }

  .gradient-text {
    color: #FF00FF;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
  }
}

/* 主标题 */
.main-title {
  font-size: 36px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 40px 0;
  letter-spacing: 2px;
}

/* 输入与操作区域 */
.input-area {
  width: 100%;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border-radius: 24px;
  padding: 4px;
  background: #FFFFFF;
  border: 2px solid transparent;
  background-image: linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(to right, #1890ff, #ff00ff);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  &.has-error {
    background-image: linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(to right, #FF4D4F, #FF4D4F);
  }
}

.url-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 16px 24px;
  font-size: 15px;
  background: transparent;
  color: #262626;

  &::placeholder {
    color: #BFBFBF;
  }
}

.rewrite-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  background: #595959;
  color: #FFFFFF;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 4px;

  .rewrite-icon {
    font-size: 14px;
  }

  .rewrite-points {
    color: #FF6600;
    font-weight: 600;
  }

  &:hover:not(.disabled) {
    background: #262626;
  }

  &.disabled {
    background: #D9D9D9;
    cursor: not-allowed;

    .rewrite-icon, .rewrite-points, .rewrite-text {
      color: #8C8C8C;
    }
  }
}

.error-tip {
  color: #FF4D4F;
  font-size: 13px;
  text-align: left;
  padding: 8px 0 0 24px;
}

/* Loading遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-content {
  background: #FFFFFF;
  padding: 40px 60px;
  border-radius: 16px;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #E8E8E8;
  border-top-color: #1677FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-text {
  font-size: 14px;
  color: #595959;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
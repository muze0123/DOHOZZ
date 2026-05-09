<template>
  <div class="extract-script-page">
    <!-- 右上角用户资产与功能入口区 -->
    <div class="top-right-area">
      <div class="points-btn" @click="handlePointsClick">
        <svg class="diamond-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M12 2L2 9l10 13 10-13-10-7zm0 3.5L17.5 9 12 18.5 6.5 9 12 5.5z"/>
        </svg>
        <span class="points-value">{{ currentPoints.toLocaleString() }}</span>
        <span class="points-text">增购积分</span>
      </div>
      <div class="history-btn" @click="handleHistoryClick">
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
        <span class="quote-mark">"</span>
        <span class="gradient-text">爆款探测器</span>
        <span class="slogan-text">打品就用</span>
      </div>

      <!-- 主标题 -->
      <h1 class="main-title">视频文案 一键提取</h1>

      <!-- 输入与操作区域 -->
      <div class="input-area">
        <div class="input-wrapper" :class="{ 'has-error': errorMsg }">
          <input
            type="text"
            class="url-input"
            v-model="videoUrl"
            placeholder="请输入抖音视频链接"
            @keyup.enter="handleExtract"
          />
          <button
            class="extract-btn"
            :class="{ disabled: !canExtract }"
            :disabled="!canExtract"
            @click="handleExtract"
          >
            <svg class="diamond-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 2L2 9l10 13 10-13-10-7zm0 3.5L17.5 9 12 18.5 6.5 9 12 5.5z"/>
            </svg>
            <span class="extract-points">1</span>
            <span class="extract-text">开始提取</span>
          </button>
        </div>
        <div class="error-tip" v-if="errorMsg">{{ errorMsg }}</div>
      </div>
    </div>

    <!-- 历史记录弹窗 -->
    <el-dialog
      v-model="showHistoryModal"
      title="历史记录"
      width="600px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="history-content">
        <div v-if="historyList.length === 0" class="empty-history">
          暂无历史记录
        </div>
        <div v-else class="history-list">
          <div v-for="item in historyList" :key="item.id" class="history-item">
            <div class="history-info">
              <span class="history-time">{{ item.time }}</span>
              <span class="history-url">{{ item.url }}</span>
            </div>
            <div class="history-actions">
              <span @click="handleViewDetail(item)">查看详情</span>
              <span @click="handleDeleteHistory(item)">删除</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showHistoryModal = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 提取结果弹窗 -->
    <el-dialog
      v-model="showResultModal"
      title="提取结果"
      width="600px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="result-content">
        <div class="result-row">
          <span class="result-label">视频链接：</span>
          <span class="result-value">{{ currentResult.url }}</span>
        </div>
        <div class="result-row">
          <span class="result-label">视频文案：</span>
          <div class="result-text-wrapper">
            <div class="result-text">{{ currentResult.content }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCopyContent">复制内容</el-button>
          <el-button @click="handleReExtract">重新提取</el-button>
          <el-button @click="showResultModal = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 积分充值弹窗 -->
    <el-dialog
      v-model="showRechargeModal"
      title="积分充值"
      width="500px"
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <div class="recharge-content">
        <div class="current-points">
          当前积分：<span class="points-highlight">{{ currentPoints.toLocaleString() }}</span>
        </div>
        <div class="recharge-packages">
          <div v-for="pkg in rechargePackages" :key="pkg.id" class="package-item">
            <span class="package-points">{{ pkg.points }}积分</span>
            <span class="package-price">¥{{ pkg.price }}</span>
            <el-button type="primary" size="small" @click="handleRecharge(pkg)">充值</el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRechargeModal = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Loading遮罩 -->
    <div class="loading-overlay" v-if="isExtracting">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">提取中...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const currentPoints = ref(1746)
const videoUrl = ref('')
const errorMsg = ref('')
const isExtracting = ref(false)
const showHistoryModal = ref(false)
const showResultModal = ref(false)
const showRechargeModal = ref(false)
const currentResult = ref({ url: '', content: '' })

const rechargePackages = ref([
  { id: 1, points: 100, price: 10 },
  { id: 2, points: 500, price: 45 },
  { id: 3, points: 1000, price: 80 },
  { id: 4, points: 2000, price: 150 },
])

const historyList = ref([
  { id: '1', time: '2025-01-15 10:30', url: 'https://www.douyin.com/video/123456789' },
  { id: '2', time: '2025-01-14 15:20', url: 'https://v.douyin.com/abc123' },
  { id: '3', time: '2025-01-13 09:45', url: 'https://www.douyin.com/video/987654321' },
])

// Mock extracted content
const mockExtractContent = `【爆款视频文案】
嗨喽大家好，我是你们的美妆小助手~

今天来给大家分享一款我最近超爱用的护肤神器！

用了大概两周左右，皮肤真的变得超级光滑细腻，连闺蜜都问我是不是偷偷去做了医美项目！

重点是它真的超级平价！学生党也可以放心入手！

好啦不多说了，感兴趣的小姐姐们赶紧点击左下角链接看看吧~

记得点赞关注哦，爱你们~`

// 验证抖音链接格式
const isValidDouyinUrl = (url) => {
  const patterns = [
    /https:\/\/www\.douyin\.com\/video\/\d+/,
    /https:\/\/v\.douyin\.com\/\w+/,
  ]
  return patterns.some(pattern => pattern.test(url))
}

const canExtract = computed(() => {
  return videoUrl.value.trim() !== '' && isValidDouyinUrl(videoUrl.value.trim())
})

const handleExtract = () => {
  errorMsg.value = ''

  if (!videoUrl.value.trim()) {
    errorMsg.value = '请输入抖音视频链接'
    return
  }

  if (!isValidDouyinUrl(videoUrl.value.trim())) {
    errorMsg.value = '请输入有效的抖音视频链接'
    return
  }

  if (currentPoints.value < 1) {
    ElMessage.error('积分不足，请先充值')
    showRechargeModal.value = true
    return
  }

  // 开始提取
  isExtracting.value = true
  currentPoints.value -= 1

  // 模拟API调用
  setTimeout(() => {
    isExtracting.value = false
    currentResult.value = {
      url: videoUrl.value.trim(),
      content: mockExtractContent
    }
    // 添加到历史记录
    historyList.value.unshift({
      id: Date.now().toString(),
      time: new Date().toLocaleString('zh-CN'),
      url: videoUrl.value.trim()
    })
    showResultModal.value = true
    ElMessage.success('提取成功')
  }, 2000)
}

const handleCopyContent = () => {
  navigator.clipboard.writeText(currentResult.value.content).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败，请重试')
  })
}

const handleReExtract = () => {
  showResultModal.value = false
  if (currentPoints.value < 1) {
    ElMessage.error('积分不足，请先充值')
    showRechargeModal.value = true
    return
  }
  handleExtract()
}

const handleHistoryClick = () => {
  showHistoryModal.value = true
}

const handleViewDetail = (item) => {
  currentResult.value = {
    url: item.url,
    content: mockExtractContent
  }
  showHistoryModal.value = false
  showResultModal.value = true
}

const handleDeleteHistory = (item) => {
  const idx = historyList.value.findIndex(h => h.id === item.id)
  if (idx !== -1) {
    historyList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }
}

const handlePointsClick = () => {
  showRechargeModal.value = true
}

const handleRecharge = (pkg) => {
  ElMessage.success(`充值成功：${pkg.points}积分`)
  currentPoints.value += pkg.points
  showRechargeModal.value = false
}
</script>

<style lang="scss" scoped>
.extract-script-page {
  min-height: calc(100vh - 48px);
  background: #FFFFFF;
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
  font-size: 14px;
  color: #262626;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;

  .quote-mark {
    position: absolute;
    top: -8px;
    right: -16px;
    font-size: 24px;
    color: #1677FF;
    opacity: 0.3;
  }

  .slogan-text {
    color: #000;
  }

  .gradient-text {
    background: linear-gradient(to right, #1890ff, #ff00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
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

.extract-btn {
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

  .diamond-icon {
    color: #FF6600;
  }

  .extract-points {
    color: #FF6600;
    font-weight: 600;
  }

  &:hover:not(.disabled) {
    background: #262626;
  }

  &.disabled {
    background: #D9D9D9;
    cursor: not-allowed;

    .diamond-icon, .extract-points, .extract-text {
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

/* 历史记录弹窗 */
.history-content {
  max-height: 400px;
  overflow-y: auto;
}

.empty-history {
  text-align: center;
  padding: 40px 0;
  color: #8C8C8C;
  font-size: 14px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #FAFAFA;
  border-radius: 8px;

  &:hover {
    background: #F0F0F0;
  }
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.history-time {
  font-size: 12px;
  color: #8C8C8C;
}

.history-url {
  font-size: 13px;
  color: #595959;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-actions {
  display: flex;
  gap: 16px;
  flex-shrink: 0;

  span {
    color: #1677FF;
    font-size: 13px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

/* 提取结果弹窗 */
.result-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-label {
  font-size: 13px;
  color: #8C8C8C;
}

.result-value {
  font-size: 14px;
  color: #262626;
}

.result-text-wrapper {
  background: #FAFAFA;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.result-text {
  font-size: 14px;
  color: #262626;
  line-height: 1.8;
  white-space: pre-wrap;
}

/* 积分充值弹窗 */
.recharge-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.current-points {
  font-size: 14px;
  color: #595959;

  .points-highlight {
    color: #FF6600;
    font-weight: 600;
  }
}

.recharge-packages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.package-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 8px;
  gap: 16px;

  .package-points {
    font-size: 14px;
    color: #262626;
    font-weight: 500;
    flex: 1;
  }

  .package-price {
    font-size: 14px;
    color: #FF6600;
    font-weight: 600;
  }
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

/* 弹窗通用样式 */
:deep(.custom-dialog) {
  .el-dialog__header {
    border-bottom: 1px solid #F0F0F0;
    margin-right: 0;
    padding: 16px 24px;

    .el-dialog__title {
      font-size: 15px;
      font-weight: 600;
      color: #262626;
    }
  }
  .el-dialog__body {
    padding: 24px;
  }
  .el-dialog__footer {
    border-top: 1px solid #F0F0F0;
    padding: 12px 24px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

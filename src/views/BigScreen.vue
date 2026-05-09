<template>
  <div class="big-screen-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">我的大屏</h1>
      <span class="page-note">*封面为演示数据</span>
    </div>

    <!-- 主体卡片展示区 -->
    <div class="cards-grid">
      <div
        v-for="item in displayList"
        :key="item.id"
        class="screen-card"
        @click="handleCardClick(item)"
      >
        <!-- 预览区 -->
        <div class="preview-area">
          <div class="preview-top">
            <div class="preview-amount">¥99,999,999</div>
            <div class="preview-ring">
              <div class="ring-chart">
                <div class="ring-fill" style="--pct: 99%"></div>
              </div>
              <span class="ring-pct">99%</span>
            </div>
          </div>
          <div class="preview-charts">
            <div class="mini-chart bar">
              <div class="bar-item" v-for="n in 8" :key="n" :style="{ height: Math.random() * 80 + 20 + '%' }"></div>
            </div>
            <div class="mini-chart line">
              <svg viewBox="0 0 60 30" preserveAspectRatio="none">
                <polyline fill="none" stroke="#FF6B00" stroke-width="2" points="0,25 10,20 20,22 30,15 40,18 50,10 60,8" />
              </svg>
            </div>
            <div class="mini-chart rank">
              <div class="rank-item" v-for="n in 3" :key="n">
                <span class="rank-num">{{ n }}</span>
                <span class="rank-name">达人{{ n }}</span>
              </div>
            </div>
          </div>

          <!-- 编辑和更多按钮 -->
          <div class="preview-actions">
            <span class="action-btn edit-btn" @click.stop="handleEdit(item)">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </span>
            <span class="action-btn more-btn" @click.stop="handleMore(item)">✱</span>
          </div>
        </div>

        <!-- 信息标签区 -->
        <div class="info-area">
          <div class="info-left">
            <span class="screen-name">{{ item.name }}</span>
            <span class="screen-meta">{{ item.createTime }} · {{ item.creator }}</span>
          </div>
          <span class="period-tag" :class="item.periodTagClass">{{ item.periodTag }}</span>
        </div>
      </div>

      <!-- 新建大屏按钮卡片 -->
      <div class="screen-card create-card" @click="handleCreate">
        <div class="create-content">
          <span class="create-icon">+</span>
          <span class="create-text">新建数据大屏</span>
        </div>
      </div>
    </div>

    <!-- 底部分页控制区 -->
    <div class="pagination-area">
      <div class="pagination-controls">
        <span class="page-btn prev" :class="{ disabled: currentPage <= 1 }" @click="handlePrevPage">〈</span>
        <template v-for="p in displayPages" :key="p">
          <span v-if="p === '...'" class="page-ellipsis">...</span>
          <span v-else class="page-btn" :class="{ active: p === currentPage }" @click="handlePageClick(p)">{{ p }}</span>
        </template>
        <span class="page-btn next" :class="{ disabled: currentPage >= totalPages }" @click="handleNextPage">〉</span>
        <div class="jump-area">
          <span>前往</span>
          <input type="number" v-model="jumpPage" class="jump-input" @keyup.enter="handleJump" />
          <span>页</span>
        </div>
        <span class="page-info">{{ currentPage }}/{{ totalPages }}页 共{{ totalCount }}条</span>
      </div>
    </div>

    <!-- 新建大屏弹窗 -->
    <el-dialog v-model="showCreateModal" title="新建数据大屏" width="400px" class="custom-dialog">
      <el-form :model="createForm" :rules="createRules" ref="createFormRef" label-width="100px">
        <el-form-item label="大屏名称" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入大屏名称" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="大屏类型" prop="type">
          <el-select v-model="createForm.type" placeholder="请选择大屏类型" style="width: 100%;">
            <el-option label="日榜" value="daily" />
            <el-option label="周榜" value="weekly" />
            <el-option label="月榜" value="monthly" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateModal = false">取消</el-button>
          <el-button type="primary" @click="handleCreateSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 更多操作弹窗 -->
    <el-dialog v-model="showMoreModal" title="更多操作" width="300px" class="custom-dialog">
      <div class="more-actions">
        <div class="more-item" @click="handleCopy">复制大屏</div>
        <div class="more-item" @click="handleShare">分享大屏</div>
        <div class="more-item danger" @click="handleDelete">删除大屏</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const currentPage = ref(1)
const pageSize = ref(9)
const totalCount = ref(17)
const jumpPage = ref(1)
const showCreateModal = ref(false)
const showMoreModal = ref(false)
const activeItem = ref(null)

const createForm = reactive({
  name: '',
  type: ''
})

const createRules = {
  name: [
    { required: true, message: '请输入大屏名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择大屏类型', trigger: 'change' }
  ]
}

const screenList = ref([
  { id: '1', name: '达播作战月大屏', createTime: '2024/08/06 20:00', creator: '冰冰', periodTag: '月榜', periodTagClass: 'blue' },
  { id: '2', name: '达播数据大屏6', createTime: '2024/09/04 16:37', creator: '王鹏', periodTag: '日榜', periodTagClass: 'pink' },
  { id: '3', name: '达播数据大屏-C', createTime: '2024/09/14 13:56', creator: '默认', periodTag: '日榜', periodTagClass: 'pink' },
  { id: '4', name: '达播数据大屏5部门', createTime: '2024/09/19 18:35', creator: '默认', periodTag: '日榜', periodTagClass: 'pink' },
  { id: '5', name: '双十一看板', createTime: '2024/10/12 11:10', creator: '默认', periodTag: '双11', periodTagClass: 'purple' },
  { id: '6', name: '达播数据大屏-测试', createTime: '2025/03/11 12:03', creator: '默认', periodTag: '月榜', periodTagClass: 'blue' },
  { id: '7', name: '达播作战日大屏', createTime: '2025/04/11 09:09', creator: '默认', periodTag: '日榜', periodTagClass: 'pink' },
  { id: '8', name: '达播作战周大屏', createTime: '2025/04/11 09:09', creator: '默认', periodTag: '周榜', periodTagClass: 'purple' },
])

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

const displayList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return screenList.value.slice(start, end)
})

const displayPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

const handleCardClick = (item) => {
  ElMessage.info(`查看大屏: ${item.name}`)
}

const handleEdit = (item) => {
  ElMessage.info(`编辑大屏: ${item.name}`)
}

const handleMore = (item) => {
  activeItem.value = item
  showMoreModal.value = true
}

const handleCreate = () => {
  createForm.name = ''
  createForm.type = ''
  showCreateModal.value = true
}

const handleCreateSubmit = () => {
  if (!createForm.name) {
    ElMessage.error('请输入大屏名称')
    return
  }
  if (!createForm.type) {
    ElMessage.error('请选择大屏类型')
    return
  }
  ElMessage.success('新建大屏成功')
  showCreateModal.value = false
}

const handleCopy = () => {
  ElMessage.success('复制大屏成功')
  showMoreModal.value = false
}

const handleShare = () => {
  ElMessage.success('分享链接已复制')
  showMoreModal.value = false
}

const handleDelete = () => {
  ElMessage.success('删除大屏成功')
  showMoreModal.value = false
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handlePageClick = (p) => {
  if (p !== '...') {
    currentPage.value = p
  }
}

const handleJump = () => {
  const page = parseInt(jumpPage.value)
  if (isNaN(page) || page < 1 || page > totalPages.value) {
    ElMessage.error('页码超出范围')
    return
  }
  currentPage.value = page
}
</script>

<style lang="scss" scoped>
.big-screen-page {
  background: #1a1a2e;
  min-height: calc(100vh - 48px);
  padding: 24px;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
}

.page-note {
  font-size: 12px;
  color: #666;
}

/* 卡片网格 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 大屏卡片 */
.screen-card {
  background: #252542;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

    .preview-actions {
      opacity: 1;
    }
  }
}

/* 预览区 */
.preview-area {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #1e1e3f 0%, #2d1b4e 50%, #1a1a2e 100%);
  padding: 16px;
}

.preview-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.preview-amount {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B00;
  text-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
}

.preview-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ring-chart {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(#FF6B00 var(--pct), rgba(255,255,255,0.1) var(--pct));
}

.ring-pct {
  font-size: 10px;
  color: #FF6B00;
}

.preview-charts {
  display: flex;
  gap: 8px;
  height: 100px;
}

.mini-chart {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 8px;

  &.bar {
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 3px;
  }

  &.line {
    flex: 1;
  }

  &.rank {
    width: 60px;
  }
}

.bar-item {
  flex: 1;
  background: linear-gradient(to top, #FF6B00, #FF9A5C);
  border-radius: 2px;
  min-height: 2px;
}

.line-svg {
  width: 100%;
  height: 100%;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  font-size: 10px;
  color: #CCC;
}

.rank-num {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: #FF6B00;
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
}

.preview-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.action-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

/* 信息标签区 */
.info-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
}

.info-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.screen-name {
  font-size: 14px;
  font-weight: 600;
  color: #FFF;
}

.screen-meta {
  font-size: 11px;
  color: #888;
}

.period-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;

  &.blue {
    background: linear-gradient(135deg, #1890FF 0%, #40C9FF 100%);
    color: #FFF;
  }
  &.pink {
    background: linear-gradient(135deg, #FF6B9D 0%, #FFB3C6 100%);
    color: #FFF;
  }
  &.purple {
    background: linear-gradient(135deg, #9C27B0 0%, #CE93D8 100%);
    color: #FFF;
  }
}

/* 新建大屏按钮卡片 */
.create-card {
  background: #252542;
  border: 2px dashed #444;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;

  &:hover {
    border-color: #FF6B00;
    background: rgba(255, 107, 0, 0.1);
  }
}

.create-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.create-icon {
  font-size: 48px;
  color: #666;

  .create-card:hover & {
    color: #FF6B00;
  }
}

.create-text {
  font-size: 14px;
  color: #666;

  .create-card:hover & {
    color: #FF6B00;
  }
}

/* 分页控制区 */
.pagination-area {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #333;
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(.disabled) {
    background: #444;
  }

  &.active {
    background: #FF6B00;
  }

  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.prev, &.next {
    font-size: 16px;
  }
}

.page-ellipsis {
  color: #666;
  font-size: 14px;
}

.jump-area {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
  color: #888;
  font-size: 13px;
}

.jump-input {
  width: 50px;
  height: 28px;
  border-radius: 4px;
  background: #333;
  border: 1px solid #444;
  color: #FFF;
  text-align: center;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #FF6B00;
  }
}

.page-info {
  margin-left: 16px;
  color: #666;
  font-size: 13px;
}

/* 弹窗样式 */
.more-actions {
  display: flex;
  flex-direction: column;
}

.more-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;

  &:hover {
    background: #F5F5F5;
  }

  &.danger {
    color: #FF4D4F;
  }
}

:deep(.custom-dialog) {
  .el-dialog {
    background: #FFF;
    border-radius: 8px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #F0F0F0;
    padding: 16px 24px;
  }
  .el-dialog__title {
    font-size: 15px;
    font-weight: 600;
    color: #262626;
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

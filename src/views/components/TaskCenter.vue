<template>
  <el-drawer
    v-model="visible"
    title="任务列表"
    direction="rtl"
    size="1200px"
    :before-close="handleClose"
    class="task-center-drawer"
  >
    <div class="task-center">
      <!-- Tab区 -->
      <div class="task-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="task-tab"
          :class="{ active: activeTab === tab.key }"
          @click="handleTabChange(tab.key)"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
        </div>
      </div>

      <!-- 筛选区 -->
      <div class="filter-bar">
        <!-- 平台筛选 -->
        <div class="filter-item" v-if="showPlatformFilter">
          <span class="filter-label">平台：</span>
          <el-select v-model="filters.platform" placeholder="全部" clearable style="width: 100px">
            <el-option label="全部" value="" />
            <el-option label="TikTok" value="tiktok" />
            <el-option label="Shopee" value="shopee" />
          </el-select>
        </div>

        <!-- 任务模块筛选 -->
        <div class="filter-item" v-if="showModuleFilter">
          <span class="filter-label">任务模块：</span>
          <el-select v-model="filters.module" placeholder="全部" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="达人公海" value="influencer_pool" />
            <el-option label="我的达人" value="my_influencer" />
            <el-option label="样品管理" value="sample" />
            <el-option label="视频履约" value="video" />
            <el-option label="合作管理" value="cooperation" />
            <el-option label="商品库" value="product" />
            <el-option label="成员管理" value="member" />
          </el-select>
        </div>

        <!-- 操作人筛选 -->
        <div class="filter-item">
          <span class="filter-label">操作人：</span>
          <el-select
            v-model="filters.operator"
            placeholder="全部"
            clearable
            filterable
            style="width: 100px"
          >
            <el-option label="全部" value="" />
            <el-option v-for="op in operatorList" :key="op" :label="op" :value="op" />
          </el-select>
        </div>

        <!-- 操作时间筛选 -->
        <div class="filter-item">
          <span class="filter-label">操作时间：</span>
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </div>

        <!-- 搜索和重置按钮 -->
        <FilterActions queryText="搜索" @query="handleSearch" @reset="handleReset" />
      </div>

      <!-- 下载任务提示 -->
      <div v-if="activeTab === 'download'" class="table-tip">
        说明：导出数据在系统平台内记录最多保留30天，30天后自动清除
      </div>

      <!-- 表格内容区 -->
      <div class="table-scroll-area">
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <!-- 导入任务 -->
          <template v-if="activeTab === 'import'">
            <el-table-column prop="platform" label="平台" width="100">
              <template #default="{ row }">
                <div class="platform-cell">
                  <span class="platform-logo" :style="{ background: getPlatformColor(row.platform) }">
                    {{ getPlatformInitial(row.platform) }}
                  </span>
                  <span class="platform-name">{{ getPlatformName(row.platform) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="module" label="模块" width="100" />
            <el-table-column prop="fileName" label="文件名称" min-width="180">
              <template #default="{ row }">
                <el-tooltip :content="row.fileName" placement="top" :disabled="row.fileName.length < 20">
                  <span class="file-name">{{ row.fileName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作人" width="80" />
            <el-table-column prop="createTime" label="操作时间" width="140" />
            <el-table-column label="任务阶段" width="160">
              <template #default="{ row }">
                <div v-if="row.status === 'processing'" class="stage-processing">
                  <span class="stage-processing-label">处理中 {{ row.progress }}%</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: row.progress + '%' }"></div>
                  </div>
                </div>
                <div v-else-if="row.status === 'completed'" class="stage-result">
                  <span>总数{{ row.total }}条，成功{{ row.success }}条，</span>
                  <span v-if="row.fail > 0" class="fail-count">失败{{ row.fail }}条</span>
                  <span v-else class="success-all">失败0条</span>
                </div>
                <span v-else-if="row.status === 'failed'" class="stage-fail">导出失败</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <template v-if="row.status === 'completed' && row.fail > 0">
                  <span class="operation-link" @click="handleDownloadError(row)">下载错误数据</span>
                </template>
                <span v-else class="operation-none">- -</span>
              </template>
            </el-table-column>
          </template>

          <!-- 下载任务 -->
          <template v-else-if="activeTab === 'download'">
            <el-table-column prop="platform" label="平台" width="100">
              <template #default="{ row }">
                <div class="platform-cell">
                  <span class="platform-logo" :style="{ background: getPlatformColor(row.platform) }">
                    {{ getPlatformInitial(row.platform) }}
                  </span>
                  <span class="platform-name">{{ getPlatformName(row.platform) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="module" label="模块" width="100" />
            <el-table-column prop="fileName" label="文件名称" min-width="180">
              <template #default="{ row }">
                <el-tooltip :content="row.fileName" placement="top" :disabled="row.fileName.length < 20">
                  <span class="file-name">{{ row.fileName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作人" width="80" />
            <el-table-column prop="createTime" label="操作时间" width="140" />
            <el-table-column label="任务阶段" width="120">
              <template #default="{ row }">
                <span v-if="row.status === 'processing'" class="stage-processing-label">处理中 {{ row.progress }}%</span>
                <span v-else-if="row.status === 'success'" class="stage-success">导出成功</span>
                <span v-else-if="row.status === 'failed'" class="stage-fail">导出失败</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <template v-if="row.status === 'success'">
                  <span
                    class="operation-link"
                    :class="{ expired: row.expired }"
                    @click="handleDownloadFile(row)"
                  >
                    下载文件
                  </span>
                </template>
                <span v-else class="operation-none">- -</span>
              </template>
            </el-table-column>
          </template>

          <!-- 达人收录任务 -->
          <template v-else-if="activeTab === 'influencer'">
            <el-table-column prop="platform" label="平台" width="100">
              <template #default="{ row }">
                <div class="platform-cell">
                  <span class="platform-logo" :style="{ background: getPlatformColor(row.platform) }">
                    {{ getPlatformInitial(row.platform) }}
                  </span>
                  <span class="platform-name">{{ getPlatformName(row.platform) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="达人" min-width="200">
              <template #default="{ row }">
                <div class="influencer-cell" v-if="row.status === 'success'">
                  <el-tooltip :content="row.influencerName" placement="top" :disabled="row.influencerName.length < 25">
                    <span>{{ row.influencerName }}</span>
                  </el-tooltip>
                  <span v-if="!row.isLink" class="copy-btn" @click="handleCopy(row.influencerName)">复制</span>
                </div>
                <span v-else class="text-disabled">- -</span>
              </template>
            </el-table-column>
            <el-table-column prop="collectType" label="收录方式" width="100" />
            <el-table-column prop="operator" label="操作人" width="80" />
            <el-table-column prop="createTime" label="操作时间" width="140" />
            <el-table-column label="收录状态" width="100">
              <template #default="{ row }">
                <span
                  class="status-tag"
                  :class="{
                    processing: row.status === 'processing',
                    success: row.status === 'success',
                    fail: row.status === 'failed'
                  }"
                >
                  {{ getStatusText(row.status) }}
                </span>
              </template>
            </el-table-column>
          </template>

          <!-- 团长收录任务 -->
          <template v-else-if="activeTab === 'leader'">
            <el-table-column prop="platform" label="平台" width="100">
              <template #default="{ row }">
                <div class="platform-cell">
                  <span class="platform-logo" :style="{ background: getPlatformColor(row.platform) }">
                    {{ getPlatformInitial(row.platform) }}
                  </span>
                  <span class="platform-name">{{ getPlatformName(row.platform) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="leaderName" label="团长名称" width="100" />
            <el-table-column label="团长主页链接或ID" min-width="200">
              <template #default="{ row }">
                <el-tooltip :content="row.leaderId" placement="top" :disabled="row.leaderId.length < 25">
                  <span class="long-text-cell">{{ row.leaderId }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="collectType" label="收录方式" width="100" />
            <el-table-column prop="operator" label="操作人" width="80" />
            <el-table-column prop="createTime" label="操作时间" width="140" />
            <el-table-column label="收录状态" width="100">
              <template #default="{ row }">
                <span
                  class="status-tag"
                  :class="{
                    processing: row.status === 'processing',
                    success: row.status === 'success',
                    fail: row.status === 'failed'
                  }"
                >
                  {{ getStatusText(row.status) }}
                </span>
              </template>
            </el-table-column>
          </template>
        </el-table>

        <!-- 空状态 -->
        <div v-if="!loading && tableData.length === 0" class="table-empty">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="#d9d9d9">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/>
          </svg>
          <span>{{ searchKeyword ? '暂无数据' : '暂无任务记录' }}</span>
        </div>
      </div>

      <!-- 分页 -->
      <div class="modal-pagination">
        <Pagination
          v-model="pagination"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination.vue'
import FilterActions from '@/components/FilterActions.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Tab配置
const tabs = ref([
  { key: 'import', label: '导入任务', count: 0 },
  { key: 'download', label: '下载任务', count: 0 },
  { key: 'influencer', label: '达人收录任务', count: 0 },
  { key: 'leader', label: '团长收录任务', count: 0 }
])

// 当前激活Tab
const activeTab = ref('import')

// 筛选条件
const filters = reactive({
  platform: '',
  module: '',
  operator: '',
  dateRange: []
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 加载状态
const loading = ref(false)

// 操作人列表
const operatorList = ['张三', '李四', '王五', '赵六', '钱七', '孙八']

// 搜索关键词（用于空状态判断）
const searchKeyword = ref('')

// Mock数据生成函数
function generateMockData() {
  const now = new Date()
  const allData = {
    import: [],
    download: [],
    influencer: [],
    leader: []
  }

  // 导入任务 - 10条
  for (let i = 0; i < 10; i++) {
    const date = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000)
    allData.import.push({
      id: `import_${i}`,
      platform: ['tiktok', 'shopee'][Math.floor(Math.random() * 2)],
      module: ['达人公海', '我的达人', '样品管理', '视频履约', '合作管理', '商品库', '成员管理'][Math.floor(Math.random() * 7)],
      fileName: ['达人列表导入_2025.xlsx', '样品数据导入.xlsx', '商家信息导入.xlsx', '合作订单导入.xlsx'][Math.floor(Math.random() * 4)],
      operator: operatorList[Math.floor(Math.random() * operatorList.length)],
      createTime: date.toLocaleString('zh-CN'),
      status: ['processing', 'completed', 'failed'][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 100),
      total: Math.floor(Math.random() * 100) + 10,
      success: Math.floor(Math.random() * 50) + 5,
      fail: Math.floor(Math.random() * 20)
    })
  }

  // 下载任务 - 10条
  for (let i = 0; i < 10; i++) {
    const date = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const daysDiff = Math.floor((now - date) / (24 * 60 * 60 * 1000))
    allData.download.push({
      id: `download_${i}`,
      platform: ['tiktok', 'shopee'][Math.floor(Math.random() * 2)],
      module: ['达人公海', '我的达人', '样品管理', '视频履约', '合作管理'][Math.floor(Math.random() * 5)],
      fileName: ['导出样品单_20250902.xlsx', '达人数据导出.xlsx', '合作订单导出.xlsx'][Math.floor(Math.random() * 3)],
      operator: operatorList[Math.floor(Math.random() * operatorList.length)],
      createTime: date.toLocaleString('zh-CN'),
      status: ['processing', 'success', 'failed'][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 100),
      expired: daysDiff > 30
    })
  }

  // 达人收录任务 - 10条
  for (let i = 0; i < 10; i++) {
    const date = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const isLink = Math.random() > 0.5
    allData.influencer.push({
      id: `influencer_${i}`,
      platform: ['tiktok', 'shopee'][Math.floor(Math.random() * 2)],
      influencerName: isLink ? `https://www.tiktok.com/@user${i}/live` : `@influencer_${i}`,
      isLink: isLink,
      collectType: isLink ? '达人主页链接' : '达人用户名',
      operator: operatorList[Math.floor(Math.random() * operatorList.length)],
      createTime: date.toLocaleString('zh-CN'),
      status: ['processing', 'success', 'failed'][Math.floor(Math.random() * 3)]
    })
  }

  // 团长收录任务 - 10条
  for (let i = 0; i < 10; i++) {
    const date = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000)
    allData.leader.push({
      id: `leader_${i}`,
      platform: ['tiktok', 'shopee'][Math.floor(Math.random() * 2)],
      leaderName: `团长${i + 1}`,
      leaderId: `https://www.tiktok.com/@leader${i}/home`,
      collectType: '团长主页链接',
      operator: operatorList[Math.floor(Math.random() * operatorList.length)],
      createTime: date.toLocaleString('zh-CN'),
      status: ['processing', 'success', 'failed'][Math.floor(Math.random() * 3)]
    })
  }

  return allData
}

const mockData = generateMockData()

// 根据当前Tab获取表格数据
const tableData = computed(() => {
  return mockData[activeTab.value] || []
})

// 平台筛选是否显示
const showPlatformFilter = computed(() => true)
const showModuleFilter = computed(() => activeTab.value === 'import' || activeTab.value === 'download')

// Tab切换
function handleTabChange(tabKey) {
  activeTab.value = tabKey
  pagination.page = 1
  // 重置筛选条件
  filters.platform = ''
  filters.module = ''
  filters.operator = ''
  filters.dateRange = []
}

// 搜索
function handleSearch() {
  searchKeyword.value = filters.platform || filters.module || filters.operator || (filters.dateRange?.length ? 'search' : '')
  pagination.page = 1
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

// 重置
function handleReset() {
  filters.platform = ''
  filters.module = ''
  filters.operator = ''
  filters.dateRange = []
  searchKeyword.value = ''
  pagination.page = 1
}

// 分页
function handlePageSizeChange() {
  pagination.page = 1
}

function handlePageChange() {
  // 模拟加载
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

// 关闭
function handleClose() {
  visible.value = false
}

// 平台颜色
function getPlatformColor(platform) {
  const colors = {
    tiktok: '#000000',
    shopee: '#EE4D2D'
  }
  return colors[platform] || '#8C8C8C'
}

// 平台首字母
function getPlatformInitial(platform) {
  const initials = {
    tiktok: 'T',
    shopee: 'S'
  }
  return initials[platform] || '?'
}

// 平台名称
function getPlatformName(platform) {
  const names = {
    tiktok: 'TikTok',
    shopee: 'Shopee'
  }
  return names[platform] || platform
}

// 状态文字
function getStatusText(status) {
  const texts = {
    processing: '收录中',
    success: '收录成功',
    failed: '收录失败'
  }
  return texts[status] || status
}

// 下载错误数据
function handleDownloadError(row) {
  ElMessage.success('开始下载')
  // 实际下载逻辑
  const link = document.createElement('a')
  link.href = '#'
  link.download = `${row.module}导入错误数据_${new Date().toISOString().slice(0, 10)}.xlsx`
  // link.click()
}

// 下载文件
function handleDownloadFile(row) {
  if (row.expired) {
    ElMessage.warning('文件已过期，无法下载')
    return
  }
  ElMessage.success('开始下载')
  // 实际下载逻辑
}

// 复制
function handleCopy(text) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

// 初始化更新Tab计数
function updateTabCounts() {
  tabs.value[0].count = mockData.import.length
  tabs.value[1].count = mockData.download.length
  tabs.value[2].count = mockData.influencer.length
  tabs.value[3].count = mockData.leader.length
}

updateTabCounts()
</script>

<style lang="scss" scoped>
.task-center-drawer {
  :deep(.el-drawer__header) {
    padding: 0 20px;
    height: 48px;
    border-bottom: 1px solid #F0F0F0;
    margin-bottom: 0;

    .el-drawer__title {
      font-size: 15px;
      font-weight: 600;
      color: #262626;
    }
  }

  :deep(.el-drawer__body) {
    padding: 0;
    overflow: hidden;
  }
}

.task-center {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.task-tabs {
  display: flex;
  align-items: flex-end;
  padding: 0 20px;
  height: 40px;
  border-bottom: 1px solid #F0F0F0;
  flex-shrink: 0;
  gap: 28px;

  .task-tab {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #595959;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    padding-bottom: 1px;
    white-space: nowrap;
    transition: color 0.2s;

    &:hover {
      color: #1677FF;
    }

    &.active {
      color: #1677FF;
      font-weight: 600;
      border-bottom: 2px solid #1677FF;
    }

    .tab-count {
      margin-left: 4px;
      font-size: 12px;
    }
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #FAFAFA;
  border-bottom: 1px solid #F0F0F0;
  gap: 12px;
  flex-shrink: 0;
  flex-wrap: wrap;

  .filter-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #595959;
  }

  .filter-label {
    white-space: nowrap;
    color: #8C8C8C;
  }

  .filter-actions {
    margin-left: auto;
  }
}

.table-tip {
  padding: 8px 20px;
  font-size: 11px;
  color: #8C8C8C;
  background: #FFFBE6;
  border-bottom: 1px solid #FFE58F;
  flex-shrink: 0;
}

.table-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #E0E0E0;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #BFBFBF;
  }
}

.platform-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .platform-logo {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #fff;
    font-weight: 600;
  }

  .platform-name {
    font-size: 12px;
    color: #262626;
  }
}

.file-name {
  font-size: 12px;
  color: #262626;
}

.stage-processing {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .stage-processing-label {
    font-size: 12px;
    color: #1677FF;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: #E8E8E8;
    border-radius: 2px;

    .progress-fill {
      height: 100%;
      background: #1677FF;
      border-radius: 2px;
      transition: width 0.3s;
    }
  }
}

.stage-result {
  font-size: 12px;
  color: #262626;

  .fail-count {
    color: #FF4D4F;
    font-weight: 500;
  }

  .success-all {
    color: #52C41A;
  }
}

.stage-fail {
  color: #FF4D4F;
  font-size: 12px;
}

.stage-success {
  color: #52C41A;
  font-size: 12px;
}

.operation-link {
  color: #1677FF;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: #4096FF;
    text-decoration: underline;
  }

  &.expired {
    color: #D9D9D9;
    cursor: not-allowed;
    text-decoration: none;
  }
}

.operation-none {
  color: #D9D9D9;
  font-size: 12px;
}

.influencer-cell {
  display: flex;
  align-items: center;

  .copy-btn {
    display: none;
    align-items: center;
    gap: 4px;
    margin-left: 6px;
    padding: 1px 6px;
    border: none;
    border-radius: 3px;
    font-size: 11px;
    color: #595959;
    cursor: pointer;
    background: #fff;
    white-space: nowrap;

    &:hover {
      border-color: #1677FF;
      color: #1677FF;
    }
  }

  &:hover .copy-btn {
    display: inline-flex;
  }
}

.text-disabled {
  color: #BFBFBF;
  font-size: 12px;
}

.long-text-cell {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;

  &.processing {
    color: #1677FF;
  }

  &.success {
    color: #52C41A;
  }

  &.fail {
    color: #FF4D4F;
  }
}

.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0;
  color: #8C8C8C;
  font-size: 13px;
  gap: 12px;

  svg {
    opacity: 0.45;
  }
}

.modal-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  gap: 8px;
  border-top: 1px solid #F0F0F0;
  flex-shrink: 0;
  background: #fff;
}
</style>
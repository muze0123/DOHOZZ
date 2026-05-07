<template>
  <div class="performance-management-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-filter"></div>
      <div class="skeleton-stats"></div>
      <div class="skeleton-table"></div>
    </div>

    <!-- 主内容 -->
    <template v-else>
      <!-- 数据统计区 -->
      <PerformanceMStatsSection
        :update-time="updateTime"
        @show-data-update-dialog="showDataUpdateDialog = true"
        @show-more-time-dialog="showMoreTimeDialog = true"
        @show-table-config-dialog="showTableConfigDialog = true"
        @export="handleExport"
      />

      <!-- 表格区域 -->
      <PerformanceMTableSection
        :table-data="tableData"
        :total="pagination.total"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :visible-columns="visibleColumns"
        :total-data="totalData"
        @show-view-read-dialog="showViewReadDialog = true"
        @show-coming-soon="showComingSoonTip"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />

      <!-- 弹窗 -->
      <PerformanceMDataUpdateDialog v-model="showDataUpdateDialog" />
      <PerformanceMViewReadDialog v-model="showViewReadDialog" />
      <PerformanceMTableConfigDialog
        v-model="showTableConfigDialog"
        :visible-columns="visibleColumns"
        @confirm="handleTableConfigConfirm"
      />
      <PerformanceMMoreTimeDialog
        v-model="showMoreTimeDialog"
        @confirm="handleMoreTimeConfirm"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PerformanceMStatsSection from './PerformanceManagement/components/PerformanceMStatsSection.vue'
import PerformanceMTableSection from './PerformanceManagement/components/PerformanceMTableSection.vue'
import PerformanceMDataUpdateDialog from './PerformanceManagement/dialogs/PerformanceMDataUpdateDialog.vue'
import PerformanceMViewReadDialog from './PerformanceManagement/dialogs/PerformanceMViewReadDialog.vue'
import PerformanceMTableConfigDialog from './PerformanceManagement/dialogs/PerformanceMTableConfigDialog.vue'
import PerformanceMMoreTimeDialog from './PerformanceManagement/dialogs/PerformanceMMoreTimeDialog.vue'

const mockTableData = [
  {
    employeeId: 'e1',
    employeeName: '张三',
    employeeSurname: '张',
    departmentId: 'dept1',
    departmentName: '市场部',
    followStreamerCount: 120,
    connectStreamerCount: 85,
    cooperateStreamerCount: 45,
    deliverStreamerCount: 32,
    cooperationContentCount: 156,
    viewReadCount: 1256800,
    interactionCount: 45800,
    likeCount: 28600
  },
  {
    employeeId: 'e2',
    employeeName: '李四',
    employeeSurname: '李',
    departmentId: 'dept1',
    departmentName: '市场部',
    followStreamerCount: 98,
    connectStreamerCount: 72,
    cooperateStreamerCount: 38,
    deliverStreamerCount: 25,
    cooperationContentCount: 120,
    viewReadCount: 980500,
    interactionCount: 32600,
    likeCount: 19800
  },
  {
    employeeId: 'e3',
    employeeName: '王五',
    employeeSurname: '王',
    departmentId: 'dept2',
    departmentName: '销售部',
    followStreamerCount: 150,
    connectStreamerCount: 110,
    cooperateStreamerCount: 65,
    deliverStreamerCount: 48,
    cooperationContentCount: 210,
    viewReadCount: 1850000,
    interactionCount: 68500,
    likeCount: 42500
  }
]

const loading = ref(true)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const showDataUpdateDialog = ref(false)
const showViewReadDialog = ref(false)
const showTableConfigDialog = ref(false)
const showMoreTimeDialog = ref(false)

const allColumns = [
  { key: 'employee', label: '媒介/部门', sortable: false },
  { key: 'followStreamerCount', label: '跟进达人', sortable: true },
  { key: 'connectStreamerCount', label: '建联达人', sortable: true },
  { key: 'cooperateStreamerCount', label: '合作达人', sortable: true },
  { key: 'deliverStreamerCount', label: '交付达人', sortable: true },
  { key: 'cooperationContentCount', label: '合作内容数', sortable: true },
  { key: 'viewReadCount', label: '播放量/阅读量', sortable: true },
  { key: 'interactionCount', label: '互动数', sortable: true },
  { key: 'likeCount', label: '点赞', sortable: true }
]
const visibleColumns = ref([...allColumns])

const totalData = computed(() => {
  return {
    cooperationContentCount: tableData.value.reduce((sum, r) => sum + (r.cooperationContentCount || 0), 0),
    viewReadCount: tableData.value.reduce((sum, r) => sum + (r.viewReadCount || 0), 0),
    interactionCount: tableData.value.reduce((sum, r) => sum + (r.interactionCount || 0), 0),
    likeCount: tableData.value.reduce((sum, r) => sum + (r.likeCount || 0), 0)
  }
})

const updateTime = ref('')

onMounted(() => {
  fetchData()
  updateTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')
})

const fetchData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    tableData.value = mockTableData
    pagination.total = mockTableData.length
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  fetchData()
}

const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const showComingSoonTip = () => {
  ElMessage.info('功能即将上线')
}

const handleTableConfigConfirm = (columns) => {
  visibleColumns.value = columns
}

const handleMoreTimeConfirm = (params) => {
  ElMessage.success('时间范围已更新')
}
</script>

<style lang="scss" scoped>
.performance-management-page {
  padding: 16px;
  min-height: 100%;
  background: #f5f6f7;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-filter {
  height: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-stats {
  height: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-table {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

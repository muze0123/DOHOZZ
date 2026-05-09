<template>
  <el-dialog
    v-model="dialogVisible"
    title="关联计划"
    width="640px"
    @close="handleClose"
  >
    <!-- 搜索区 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="输入计划名称搜索"
        style="width: 300px"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 计划列表 -->
    <el-table
      ref="tableRef"
      :data="planList"
      style="width: 100%; margin-top: 16px"
      @selection-change="handleSelectionChange"
      :row-key="getRowKey"
    >
      <el-table-column type="selection" width="50" :reserve-selection="true" />
      <el-table-column prop="plan_name" label="计划名称" min-width="200" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.status === 'active'" type="success" size="small">进行中</el-tag>
          <el-tag v-else size="small">待开始</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="isRelated(row)"
            type="danger"
            link
            size="small"
            @click="handleCancelRelate(row)"
          >
            取消关联
          </el-button>
          <span v-else class="unrelated-text">未关联</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination
        v-model="paginationState"
        :total="total"
        :page-sizes="[10, 20, 50]"
      />
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api/enterpriseInfluencer'
import Pagination from '@/components/Pagination.vue'

const props = defineProps({
  visible: Boolean,
  influencer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['success', 'update:visible'])

const dialogVisible = ref(false)
const confirmLoading = ref(false)
const tableRef = ref(null)

const searchKeyword = ref('')
const planList = ref([])
const total = ref(0)
const paginationState = ref({ page: 1, pageSize: 10 })
const selectedPlanIds = ref([])
const relatedPlanIds = ref([])

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    // Reset state when dialog opens
    searchKeyword.value = ''
    currentPage.value = 1
    selectedPlanIds.value = []
    relatedPlanIds.value = []
    fetchPlanList()
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

const getRowKey = (row) => row.plan_id

const isRelated = (row) => relatedPlanIds.value.includes(row.plan_id)

const handleSearch = () => {
  currentPage.value = 1
  fetchPlanList()
}

const handleSelectionChange = (selection) => {
  selectedPlanIds.value = selection.map(item => item.plan_id)
}

const handleSizeChange = () => {
  currentPage.value = 1
  fetchPlanList()
}

const handleCurrentChange = () => {
  fetchPlanList()
}

const fetchPlanList = async () => {
  try {
    const res = await api.getPlanList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })

    if (res.code === 0) {
      planList.value = res.data.list
      total.value = res.data.pagination.total

      // In a real app, you would fetch the related plans for this influencer
      // For now, we'll assume no plans are related initially
    }
  } catch (error) {
    ElMessage.error('获取计划列表失败')
  }
}

const handleCancelRelate = (row) => {
  // Remove from selectedPlanIds if present
  const index = selectedPlanIds.value.indexOf(row.plan_id)
  if (index > -1) {
    selectedPlanIds.value.splice(index, 1)
  }

  // Remove from relatedPlanIds
  const relatedIndex = relatedPlanIds.value.indexOf(row.plan_id)
  if (relatedIndex > -1) {
    relatedPlanIds.value.splice(relatedIndex, 1)
  }

  // Uncheck the row in table
  tableRef.value?.toggleRowSelection(row, false)
}

const handleClose = () => {
  searchKeyword.value = ''
  currentPage.value = 1
  selectedPlanIds.value = []
  relatedPlanIds.value = []
  tableRef.value?.clearSelection()
}

const handleConfirm = async () => {
  if (!props.influencer) {
    ElMessage.error('达人信息不存在')
    return
  }

  confirmLoading.value = true

  try {
    const res = await api.relatePlan(props.influencer.streamer_id, selectedPlanIds.value)

    if (res.code === 0) {
      ElMessage.success('关联成功')
      emit('success')
      dialogVisible.value = false
    } else {
      ElMessage.error(res.message || '关联失败')
    }
  } catch (error) {
    ElMessage.error('关联失败')
  } finally {
    confirmLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.search-section {
  display: flex;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.unrelated-text {
  color: #999;
  font-size: 13px;
}
</style>

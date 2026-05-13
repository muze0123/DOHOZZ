<template>
  <div class="content-filter-section">
    <div class="filter-section">
      <!-- 第一行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">关联计划</span>
          <el-select
            v-model="localParams.planId"
            placeholder="请选择计划"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="plan in planOptions"
              :key="plan.id"
              :label="plan.name"
              :value="plan.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">达人昵称</span>
          <el-input
            v-model="localParams.streamerName"
            placeholder="请输入达人昵称"
            clearable
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">内容标签</span>
          <el-select
            v-model="localParams.contentTag"
            placeholder="请选择标签"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="tag in tagOptions"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="filter-row" style="margin-top: 12px;">
        <div class="filter-item">
          <span class="filter-label">发布形式</span>
          <el-input
            v-model="localParams.publishForm"
            placeholder="请输入发布形式"
            clearable
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">SPU标题</span>
          <el-select
            v-model="localParams.spuId"
            placeholder="请选择SPU"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="spu in spuOptions"
              :key="spu.id"
              :label="spu.title"
              :value="spu.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">商品链接</span>
          <el-input
            v-model="localParams.productLink"
            placeholder="请输入商品链接"
            clearable
            size="small"
          />
        </div>
      </div>

      <!-- 第三行 -->
      <div class="filter-row" style="margin-top: 12px;">
        <div class="filter-item">
          <span class="filter-label">所属部门</span>
          <el-select
            v-model="localParams.departmentId"
            placeholder="请选择部门"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="dept in departmentOptions"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">所属媒介</span>
          <el-select
            v-model="localParams.mediumId"
            placeholder="请选择媒介"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="medium in mediumOptions"
              :key="medium.id"
              :label="medium.name"
              :value="medium.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">内容状态</span>
          <el-select
            v-model="localParams.contentStatus"
            placeholder="请选择状态"
            clearable
            size="small"
          >
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 第四行：日期范围 -->
      <div class="filter-row" style="margin-top: 12px;">
        <div class="filter-item">
          <span class="filter-label">发布时间</span>
          <el-date-picker
            v-model="localParams.publishTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">创建时间</span>
          <el-date-picker
            v-model="localParams.createTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            size="small"
          />
        </div>
        <FilterActions ml queryText="搜索" @query="handleQuery" @reset="handleReset" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import FilterActions from '@/components/FilterActions.vue'

const props = defineProps({
  filterParams: {
    type: Object,
    required: true
  },
  planOptions: {
    type: Array,
    default: () => []
  },
  tagOptions: {
    type: Array,
    default: () => []
  },
  spuOptions: {
    type: Array,
    default: () => []
  },
  departmentOptions: {
    type: Array,
    default: () => []
  },
  mediumOptions: {
    type: Array,
    default: () => []
  },
  statusOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['query', 'reset'])

const localParams = reactive({
  planId: '',
  streamerName: '',
  contentTag: '',
  publishForm: '',
  spuId: '',
  productLink: '',
  departmentId: '',
  mediumId: '',
  contentStatus: '',
  publishTimeRange: [],
  createTimeRange: []
})

watch(() => props.filterParams, (newVal) => {
  Object.assign(localParams, newVal)
}, { immediate: true, deep: true })

function handleQuery() {
  const queryParams = { ...localParams }
  // Convert date ranges to start/end fields
  if (queryParams.publishTimeRange && queryParams.publishTimeRange.length === 2) {
    queryParams.publishTimeStart = queryParams.publishTimeRange[0]
    queryParams.publishTimeEnd = queryParams.publishTimeRange[1]
  } else {
    queryParams.publishTimeStart = ''
    queryParams.publishTimeEnd = ''
  }
  if (queryParams.createTimeRange && queryParams.createTimeRange.length === 2) {
    queryParams.createTimeStart = queryParams.createTimeRange[0]
    queryParams.createTimeEnd = queryParams.createTimeRange[1]
  } else {
    queryParams.createTimeStart = ''
    queryParams.createTimeEnd = ''
  }
  // Remove array fields
  delete queryParams.publishTimeRange
  delete queryParams.createTimeRange
  emit('query', queryParams)
}

function handleReset() {
  Object.keys(localParams).forEach(key => {
    if (Array.isArray(localParams[key])) {
      localParams[key] = []
    } else {
      localParams[key] = ''
    }
  })
  emit('reset')
}

function reset() {
  handleReset()
}

defineExpose({ reset })
</script>

<style scoped lang="scss">
.content-filter-section {
  .filter-section {
    background: #fff;
    padding: 16px 24px;
    border-bottom: 1px solid #E5E7EB;
  }

  .filter-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 32px;
  }

  .filter-item {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 200px;
  }

  .filter-label {
    margin-right: 10px;
    text-align: right;
    color: #4e5969;
    font-family: PingFang SC;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    min-width: 70px;
    flex-shrink: 0;
  }

  .filter-item :deep(.el-input),
  .filter-item :deep(.el-select) {
    flex: 1;

    .el-input__wrapper,
    .el-select__wrapper {
      height: 32px;
      border-radius: 8px;
      border: none;
      box-shadow: none;

      &:hover {
        border-color: #FF6600;
      }

      &.is-focus {
        border-color: #FF6600;
        box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.1);
      }
    }
  }

  .filter-actions {
    justify-content: flex-end;
    gap: 12px;
    flex: 0;
    min-width: auto;
  }

  .filter-actions :deep(.el-button--primary) {
    background: #FF6600;
    border-color: #FF6600;

    &:hover {
      background: #e65900;
      border-color: #e65900;
    }
  }
}
</style>

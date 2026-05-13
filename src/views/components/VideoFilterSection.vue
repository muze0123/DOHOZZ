<template>
  <div class="video-filter-section">
    <div class="filter-section">
      <!-- 第一行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">发布时间</span>
          <el-date-picker
            v-model="localParams.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">视频搜索</span>
          <el-input
            v-model="localParams.videoKeyword"
            placeholder="视频标题/视频ID"
            clearable
            style="width: 160px"
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">达人搜索</span>
          <el-input
            v-model="localParams.influencerKeyword"
            placeholder="达人名称/达人ID"
            clearable
            style="width: 160px"
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">商品搜索</span>
          <el-input
            v-model="localParams.productKeyword"
            placeholder="商品名称/商品ID"
            clearable
            style="width: 160px"
            size="small"
          />
        </div>
      </div>

      <!-- 第二行 -->
      <div class="filter-row" style="margin-top: 12px;">
        <div class="filter-item">
          <span class="filter-label">所属部门</span>
          <el-select
            v-model="localParams.departmentId"
            placeholder="全部部门"
            clearable
            filterable
            style="width: 140px"
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
          <span class="filter-label">所属BD</span>
          <el-select
            v-model="localParams.bdId"
            placeholder="全部BD"
            clearable
            filterable
            style="width: 140px"
            size="small"
          >
            <el-option
              v-for="bd in bdOptions"
              :key="bd.id"
              :label="bd.name"
              :value="bd.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">店铺名称</span>
          <el-select
            v-model="localParams.shopId"
            placeholder="所有店铺"
            clearable
            filterable
            style="width: 160px"
            size="small"
          >
            <el-option
              v-for="shop in shopOptions"
              :key="shop.id"
              :label="shop.name"
              :value="shop.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">视频状态</span>
          <el-select
            v-model="localParams.status"
            placeholder="全部"
            clearable
            style="width: 120px"
            size="small"
          >
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>
        <FilterActions ml @query="handleQuery" @reset="handleReset" />
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
  departmentOptions: {
    type: Array,
    default: () => []
  },
  bdOptions: {
    type: Array,
    default: () => []
  },
  shopOptions: {
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
  timeRange: [],
  videoKeyword: '',
  influencerKeyword: '',
  productKeyword: '',
  departmentId: '',
  bdId: '',
  shopId: '',
  status: ''
})

watch(() => props.filterParams, (newVal) => {
  Object.assign(localParams, newVal)
}, { immediate: true, deep: true })

function handleQuery() {
  Object.assign(props.filterParams, localParams)
  emit('query')
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
@import '@/styles/_influencer-page.scss';

.video-filter-section {
  .filter-section {
    @include filter-section;
    padding: 16px 20px;
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
  }

  .filter-actions {
    margin-left: auto;
  }

  :deep(.el-select__wrapper),
  :deep(.el-input__wrapper) {
    height: 32px;
  }
}
</style>

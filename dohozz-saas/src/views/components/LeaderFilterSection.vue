<template>
  <div class="leader-filter-section">
    <div class="filter-section">
      <!-- 第一行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">团长搜索</span>
          <el-input
            v-model="localParams.leaderKeyword"
            placeholder="请输入团长名称/ID"
            clearable
            style="width: 180px"
            size="small"
          />
        </div>
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
            v-model="localParams.shopIds"
            placeholder="所有店铺"
            multiple
            clearable
            filterable
            style="width: 180px"
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
      </div>

      <!-- 第二行 -->
      <div class="filter-row" style="margin-top: 12px;">
        <div class="filter-item">
          <span class="filter-label">归属模式</span>
          <el-select
            v-model="localParams.mode"
            placeholder="全部"
            clearable
            style="width: 140px"
            size="small"
          >
            <el-option
              v-for="opt in modeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">时间筛选</span>
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
        <div class="filter-item filter-actions">
          <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
          <el-button size="small" @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

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
  modeOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['query', 'reset'])

const localParams = reactive({
  leaderKeyword: '',
  departmentId: '',
  bdId: '',
  shopIds: [],
  mode: '',
  timeRange: []
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
@import '@/assets/styles/_influencer-page.scss';

.leader-filter-section {
  .filter-section {
    @include filter-section;
    padding: 16px 20px;
  }

  .filter-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-label {
    font-size: 14px;
    color: #666;
    min-width: 70px;
  }

  .filter-actions {
    margin-left: auto;
  }
}
</style>

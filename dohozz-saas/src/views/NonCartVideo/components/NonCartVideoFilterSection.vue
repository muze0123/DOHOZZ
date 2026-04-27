<template>
  <div class="non-cart-video-filter-section">
    <div class="filter-section">
      <!-- 第一行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">视频搜索</span>
          <el-input v-model="localParams.videoKeyword" placeholder="请输入视频标题" @keyup.enter="handleQuery" clearable />
        </div>
        <div class="filter-item">
          <span class="filter-label">发布时间</span>
          <el-date-picker v-model="localParams.publishTimeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 240px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">达人筛选</span>
          <el-input v-model="localParams.influencerKeyword" placeholder="请输入达人名称/达人ID" @keyup.enter="handleQuery" clearable />
        </div>
        <div class="filter-item">
          <span class="filter-label">所属BD</span>
          <el-select v-model="localParams.bdId" clearable placeholder="全部BD" style="width: 140px">
            <el-option v-for="bd in bdOptions" :key="bd.id" :label="bd.name" :value="bd.id" />
          </el-select>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="filter-row" style="margin-top: 12px;">
        <div class="filter-item">
          <span class="filter-label">所属部门</span>
          <el-select v-model="localParams.departmentId" clearable placeholder="全部部门" style="width: 140px">
            <el-option v-for="dept in departmentOptions" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">商品搜索</span>
          <el-input v-model="localParams.productKeyword" placeholder="请输入商品名称/商品ID" @keyup.enter="handleQuery" clearable />
        </div>
        <div class="filter-item">
          <span class="filter-label">投放平台同步</span>
          <el-select v-model="localParams.syncStatus" style="width: 120px">
            <el-option label="不限" value="" />
            <el-option label="未同步" value="unsynced" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">小蓝词</span>
          <el-switch v-model="localParams.hasBlueWord" />
        </div>
        <div class="filter-item">
          <span class="filter-label">投流</span>
          <el-radio-group v-model="localParams.hasInvestment">
            <el-radio-button value="">不限</el-radio-button>
            <el-radio-button value="yes">有投流</el-radio-button>
            <el-radio-button value="no">无投流</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-actions">
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
  bdOptions: {
    type: Array,
    default: () => []
  },
  departmentOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['query', 'reset'])

const localParams = reactive({
  videoKeyword: '',
  publishTimeRange: [],
  influencerKeyword: '',
  bdId: '',
  departmentId: '',
  productKeyword: '',
  syncStatus: '',
  hasBlueWord: false,
  hasInvestment: ''
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
    } else if (typeof localParams[key] === 'boolean') {
      localParams[key] = false
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

.non-cart-video-filter-section {
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

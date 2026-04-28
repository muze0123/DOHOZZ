<template>
  <div class="sample-filter-section">
    <div class="filter-section">
      <!-- 第一行 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">样品ID</span>
          <el-input
            v-model="localParams.sampleId"
            placeholder="请输入样品ID"
            clearable
            style="width: 160px"
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">商品关键词</span>
          <el-input
            v-model="localParams.productKeyword"
            placeholder="商品名称/ID"
            clearable
            style="width: 160px"
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">达人关键词</span>
          <el-input
            v-model="localParams.influencerKeyword"
            placeholder="达人名称/ID"
            clearable
            style="width: 160px"
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
      </div>

      <!-- 第二行 -->
      <div class="filter-row" style="margin-top: 12px;">
        <div class="filter-item">
          <span class="filter-label">店铺</span>
          <el-select
            v-model="localParams.shopId"
            placeholder="全部店铺"
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
          <span class="filter-label">是否重复</span>
          <el-select
            v-model="localParams.isRepeat"
            placeholder="全部"
            clearable
            style="width: 100px"
            size="small"
          >
            <el-option
              v-for="opt in repeatOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">收货人</span>
          <el-input
            v-model="localParams.recipientKeyword"
            placeholder="收货人姓名/电话"
            clearable
            style="width: 160px"
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
            style="width: 240px"
            size="small"
          />
        </div>
      </div>

      <!-- 第三行 -->
      <div class="filter-row" style="margin-top: 12px;">
        <div class="filter-item">
          <span class="filter-label">物流单号</span>
          <el-input
            v-model="localParams.logisticsNo"
            placeholder="请输入物流单号"
            clearable
            style="width: 160px"
            size="small"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">发货时间</span>
          <el-date-picker
            v-model="localParams.shipTimeRange"
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
          <span class="filter-label">样品来源</span>
          <el-select
            v-model="localParams.source"
            placeholder="全部来源"
            clearable
            style="width: 140px"
            size="small"
          >
            <el-option
              v-for="opt in sourceOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
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
  sourceOptions: {
    type: Array,
    default: () => []
  },
  repeatOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['query', 'reset'])

const localParams = reactive({
  sampleId: '',
  productKeyword: '',
  influencerKeyword: '',
  departmentId: '',
  bdId: '',
  shopId: '',
  isRepeat: '',
  recipientKeyword: '',
  createTimeRange: [],
  logisticsNo: '',
  shipTimeRange: [],
  source: ''
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

.sample-filter-section {
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

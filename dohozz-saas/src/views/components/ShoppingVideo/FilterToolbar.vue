<template>
  <div class="filter-toolbar">
    <div class="filter-row">
      <!-- 时间范围 -->
      <div class="filter-item">
        <span class="filter-label">时间范围</span>
        <el-select
          v-model="localValue.timeRangeType"
          size="small"
          class="time-select"
          @change="handleTimeRangeTypeChange"
        >
          <el-option label="近7天" value="last7days" />
          <el-option label="近30天" value="last30days" />
          <el-option label="本周" value="thisWeek" />
          <el-option label="本月" value="thisMonth" />
          <el-option label="自定义" value="custom" />
        </el-select>
        <el-date-picker
          v-if="localValue.timeRangeType === 'custom'"
          v-model="localValue.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          size="small"
          class="date-range-picker"
          @change="emitUpdate"
        />
      </div>

      <!-- 店铺名称 -->
      <div class="filter-item">
        <span class="filter-label">店铺名称</span>
        <el-select
          v-model="localValue.shopId"
          placeholder="全部店铺"
          filterable
          clearable
          size="small"
          class="filter-select"
          @change="emitUpdate"
        >
          <el-option
            v-for="shop in shopOptions"
            :key="shop.id"
            :label="shop.name"
            :value="shop.id"
          />
        </el-select>
      </div>

      <!-- 达人搜索 -->
      <div class="filter-item">
        <span class="filter-label">达人搜索</span>
        <el-input
          v-model="localValue.influencerKeyword"
          placeholder="请输入达人名称/达人ID"
          clearable
          size="small"
          class="filter-input"
          @keyup.enter="emitUpdate"
          @clear="emitUpdate"
        >
          <template #append>
            <el-button @click="emitUpdate">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 所属BD -->
      <div class="filter-item">
        <span class="filter-label">所属BD</span>
        <el-select
          v-model="localValue.bdId"
          placeholder="全部BD"
          filterable
          clearable
          size="small"
          class="filter-select"
          @change="emitUpdate"
        >
          <el-option
            v-for="bd in bdOptions"
            :key="bd.id"
            :label="bd.name"
            :value="bd.id"
          />
        </el-select>
      </div>

      <!-- 所属部门 -->
      <div class="filter-item">
        <span class="filter-label">所属部门</span>
        <el-select
          v-model="localValue.departmentId"
          placeholder="全部部门"
          filterable
          clearable
          size="small"
          class="filter-select"
          @change="emitUpdate"
        >
          <el-option
            v-for="dept in departmentOptions"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
      </div>

      <!-- 商品搜索 -->
      <div class="filter-item">
        <span class="filter-label">商品搜索</span>
        <el-input
          v-model="localValue.productKeyword"
          placeholder="请输入商品名称/商品ID"
          clearable
          size="small"
          class="filter-input"
          @keyup.enter="emitUpdate"
          @clear="emitUpdate"
        >
          <template #append>
            <el-button @click="emitUpdate">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 销量 -->
      <div class="filter-item">
        <span class="filter-label">销量</span>
        <el-popover
          :visible="salesPopoverVisible"
          placement="bottom-start"
          :width="280"
          trigger="click"
          @update:visible="salesPopoverVisible = $event"
        >
          <template #reference>
            <el-input
              :model-value="salesDisplayText"
              readonly
              placeholder="不限"
              size="small"
              class="filter-input sales-input"
              @click="salesPopoverVisible = true"
            >
              <template #suffix>
                <el-icon class="el-input__icon"><arrow-down /></el-icon>
              </template>
            </el-input>
          </template>
          <div class="sales-panel">
            <div class="sales-quick-options">
              <el-radio-group v-model="localValue.salesType" size="small">
                <el-radio-button label="unlimited">不限</el-radio-button>
                <el-radio-button label="custom">自定义</el-radio-button>
              </el-radio-group>
            </div>
            <div class="sales-presets" v-if="localValue.salesType === 'preset'">
              <el-radio-group v-model="localValue.salesPreset" size="small" @change="handleSalesPresetChange">
                <div class="preset-item">
                  <el-radio label="0-100">0-100</el-radio>
                </div>
                <div class="preset-item">
                  <el-radio label="100-500">100-500</el-radio>
                </div>
                <div class="preset-item">
                  <el-radio label="500-1000">500-1000</el-radio>
                </div>
                <div class="preset-item">
                  <el-radio label="1000+">1000+</el-radio>
                </div>
              </el-radio-group>
            </div>
            <div class="sales-custom" v-if="localValue.salesType === 'custom'">
              <div class="custom-range">
                <el-input-number
                  v-model="localValue.salesMin"
                  :min="0"
                  :precision="0"
                  size="small"
                  placeholder="最小值"
                  controls-position="right"
                />
                <span class="range-separator">-</span>
                <el-input-number
                  v-model="localValue.salesMax"
                  :min="0"
                  :precision="0"
                  size="small"
                  placeholder="最大值"
                  controls-position="right"
                />
              </div>
            </div>
            <div class="sales-actions">
              <el-button size="small" @click="handleSalesReset">重置</el-button>
              <el-button type="primary" size="small" @click="handleSalesConfirm">确定</el-button>
            </div>
          </div>
        </el-popover>
      </div>

      <!-- 有无归属 -->
      <div class="filter-item">
        <span class="filter-label">有无归属</span>
        <el-select
          v-model="localValue.hasOwner"
          placeholder="全部"
          clearable
          size="small"
          class="filter-select"
          @change="emitUpdate"
        >
          <el-option label="全部" :value="null" />
          <el-option label="有归属" :value="true" />
          <el-option label="未归属" :value="false" />
        </el-select>
      </div>

      <!-- 是否有投放 -->
      <div class="filter-item">
        <span class="filter-label">是否有投放</span>
        <el-select
          v-model="localValue.hasDelivery"
          placeholder="全部"
          clearable
          size="small"
          class="filter-select"
          @change="emitUpdate"
        >
          <el-option label="全部" :value="null" />
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { Search, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      timeRangeType: 'last7days',
      timeRange: [],
      shopId: '',
      influencerKeyword: '',
      bdId: '',
      departmentId: '',
      productKeyword: '',
      salesType: 'unlimited',
      salesPreset: '',
      salesMin: null,
      salesMax: null,
      hasOwner: null,
      hasDelivery: null
    })
  },
  shopOptions: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['update:modelValue'])

const salesPopoverVisible = ref(false)

const defaultFilter = () => ({
  timeRangeType: 'last7days',
  timeRange: [],
  shopId: '',
  influencerKeyword: '',
  bdId: '',
  departmentId: '',
  productKeyword: '',
  salesType: 'unlimited',
  salesPreset: '',
  salesMin: null,
  salesMax: null,
  hasOwner: null,
  hasDelivery: null
})

const localValue = reactive(defaultFilter())

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal)
  },
  { immediate: true, deep: true }
)

const salesDisplayText = computed(() => {
  if (localValue.salesType === 'unlimited') {
    return ''
  }
  if (localValue.salesType === 'preset' && localValue.salesPreset) {
    return localValue.salesPreset
  }
  if (localValue.salesType === 'custom') {
    if (localValue.salesMin !== null || localValue.salesMax !== null) {
      return `${localValue.salesMin ?? ''}-${localValue.salesMax ?? ''}`
    }
  }
  return ''
})

function handleTimeRangeTypeChange() {
  if (localValue.timeRangeType !== 'custom') {
    localValue.timeRange = []
  }
  emitUpdate()
}

function handleSalesPresetChange() {
  if (localValue.salesPreset) {
    const [min, max] = localValue.salesPreset.replace('+', '').split('-')
    localValue.salesMin = min ? parseInt(min) : null
    localValue.salesMax = max ? parseInt(max) : null
  }
}

function handleSalesReset() {
  localValue.salesType = 'unlimited'
  localValue.salesPreset = ''
  localValue.salesMin = null
  localValue.salesMax = null
  salesPopoverVisible.value = false
  emitUpdate()
}

function handleSalesConfirm() {
  salesPopoverVisible.value = false
  emitUpdate()
}

function emitUpdate() {
  emit('update:modelValue', { ...localValue })
}

function reset() {
  Object.assign(localValue, defaultFilter())
  emit('update:modelValue', { ...localValue })
}

defineExpose({ reset })
</script>

<style scoped lang="scss">
@import '@/assets/styles/_influencer-page.scss';

.filter-toolbar {
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid $border-light;

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
    white-space: nowrap;
  }

  .time-select {
    width: 120px;
  }

  .filter-select {
    width: 140px;
  }

  .filter-input {
    width: 180px;
  }

  .sales-input {
    width: 140px;
    cursor: pointer;
  }

  .date-range-picker {
    width: 240px;
  }

  .range-separator {
    color: #999;
    margin: 0 4px;
  }
}

.sales-panel {
  .sales-quick-options {
    margin-bottom: 12px;
  }

  .sales-presets {
    margin-bottom: 12px;

    .preset-item {
      margin-bottom: 8px;
    }
  }

  .sales-custom {
    margin-bottom: 12px;

    .custom-range {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .sales-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid $border-light;
  }
}
</style>

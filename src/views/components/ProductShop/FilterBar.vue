<template>
  <div class="filter-bar">
    <!-- 归属筛选 -->
    <div class="filter-item">
      <span class="filter-label">归属:</span>
      <div class="attr-tabs">
        <span
          v-for="a in attrOptions"
          :key="a"
          class="attr-tab"
          :class="{ active: activeAttr === a }"
          @click="handleAttrChange(a)"
        >
          {{ a }}
        </span>
      </div>
      <el-tooltip content="归属筛选说明" placement="top">
        <span class="help-icon">?</span>
      </el-tooltip>
    </div>

    <!-- 类型筛选 -->
    <div class="filter-item">
      <span class="filter-label">类型:</span>
      <div class="attr-tabs">
        <span
          v-for="t in typeOptions"
          :key="t"
          class="attr-tab"
          :class="{ active: activeType === t }"
          @click="handleTypeChange(t)"
        >
          {{ t }}
        </span>
      </div>
      <el-tooltip content="类型筛选说明" placement="top">
        <span class="help-icon">?</span>
      </el-tooltip>
    </div>

    <!-- 店铺筛选 -->
    <div class="filter-item">
      <span class="filter-label">店铺:</span>
      <el-select
        :model-value="activeShop"
        size="small"
        style="width: 140px;"
        @update:model-value="handleShopChange"
      >
        <el-option
          v-for="shop in shopOptions"
          :key="shop.value"
          :label="shop.label"
          :value="shop.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activeAttr: { type: String, default: '全部出单达人' },
  activeType: { type: String, default: '全部' },
  activeShop: { type: String, default: 'all' },
  attrOptions: { type: Array, default: () => [] },
  typeOptions: { type: Array, default: () => [] },
  shopOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:activeAttr', 'update:activeType', 'update:activeShop', 'attr-change', 'type-change', 'shop-change'])

function handleAttrChange(val) {
  emit('update:activeAttr', val)
  emit('attr-change', val)
}

function handleTypeChange(val) {
  emit('update:activeType', val)
  emit('type-change', val)
}

function handleShopChange(val) {
  emit('update:activeShop', val)
  emit('shop-change', val)
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  color: #666;
  font-size: 13px;
}

.attr-tabs {
  display: flex;
  gap: 4px;
}

.attr-tab {
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
}

.attr-tab:hover {
  background: #f5f5f5;
}

.attr-tab.active {
  background: #1677ff;
  color: #fff;
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid #d9d9d9;
  color: #8C8C8C;
  font-size: 11px;
  cursor: pointer;
}
</style>

<template>
  <div class="gmv-distribution">
    <div class="section-header">
      <span class="section-title">近30天视频GMV分布</span>
    </div>
    <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick">
      <el-table-column prop="level" label="GMV层级" min-width="120" />
      <el-table-column prop="videoCount" label="视频数量" min-width="100" align="right" />
      <el-table-column prop="gmvAmount" label="GMV金额" min-width="140" align="right">
        <template #default="{ row }">
          <span class="gmv-value">{{ formatNumber(row.gmvAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" width="50" align="center">
        <template #default="{ row }">
          <span class="row-action" @click.stop="handleRowClick(row)">
            <el-icon><ArrowRight /></el-icon>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { level: '1w+', videoCount: 0, gmvAmount: 0 },
      { level: '1000-1w', videoCount: 0, gmvAmount: 0 },
      { level: '100-1000', videoCount: 0, gmvAmount: 0 },
      { level: '0-100', videoCount: 0, gmvAmount: 0 },
      { level: '未出单', videoCount: 0, gmvAmount: 0 }
    ]
  }
})

const emit = defineEmits(['click-row'])

const tableData = props.data

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + 'w'
  }
  return num?.toLocaleString() ?? '0'
}

function handleRowClick(row) {
  emit('click-row', 'gmv_level', row.level)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/_influencer-page.scss';

.gmv-distribution {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .section-header {
    padding: 12px 20px;
    border-bottom: 1px solid $border-light;

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  :deep(.el-table) {
    .el-table__row {
      cursor: pointer;

      &:hover {
        background-color: $meta-blue-light;
      }
    }
  }

  .gmv-value {
    font-weight: 500;
    color: $meta-blue;
  }

  .row-action {
    cursor: pointer;
    color: $meta-blue;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: $meta-blue-hover;
    }
  }
}
</style>

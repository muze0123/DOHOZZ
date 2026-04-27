<template>
  <div class="category-top5">
    <div class="section-header">
      <span class="section-title">近30天视频分类TOP5</span>
    </div>
    <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick">
      <el-table-column prop="rank" label="排名" width="70" align="center">
        <template #default="{ row }">
          <span class="rank-tag" :class="getRankClass(row.rank)">{{ row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="类型名称" min-width="140" />
      <el-table-column prop="gmvAmount" label="GMV金额" min-width="120" align="right">
        <template #default="{ row }">
          <span class="gmv-value">{{ formatNumber(row.gmvAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量及占比" min-width="120" align="center">
        <template #default="{ row }">
          <span class="count-value">{{ row.videoCount }}（{{ row.percentage }}%）</span>
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
    default: () => []
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

function getRankClass(rank) {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return ''
}

function handleRowClick(row) {
  emit('click-row', 'category', row.categoryName)
}
</script>

<style scoped lang="scss">
@import '@/styles/_influencer-page.scss';

.category-top5 {
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

  .rank-tag {
    display: inline-block;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
    color: #fff;

    &.rank-gold {
      background: linear-gradient(135deg, #ffd700, #ffa500);
    }

    &.rank-silver {
      background: linear-gradient(135deg, #c0c0c0, #a8a8a8);
    }

    &.rank-bronze {
      background: linear-gradient(135deg, #cd7f32, #b87333);
    }
  }

  .gmv-value {
    font-weight: 500;
    color: $meta-blue;
  }

  .count-value {
    color: $text-secondary;
    font-size: 13px;
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

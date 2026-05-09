<template>
  <div class="enterprise-influencer-filter-section">
    <!-- Row 1: 合作信息, 筛选标签, 联系方式 -->
    <div class="filter-row">
      <div class="filter-item">
        <span class="filter-label">合作信息</span>
        <el-select
          v-model="localParams.cooperationStatus"
          placeholder="全部"
          clearable
          style="width: 120px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="已合作" value="cooperated" />
          <el-option label="未合作" value="not_cooperated" />
        </el-select>
      </div>

      <div class="filter-item">
        <span class="filter-label">筛选标签</span>
        <el-button size="small" @click="handleOpenTagFilter">
          <el-icon><Filter /></el-icon>
          标签筛选
        </el-button>
      </div>

      <div class="filter-item">
        <span class="filter-label">联系方式</span>
        <el-select
          v-model="localParams.contactInfo"
          placeholder="全部"
          clearable
          style="width: 120px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="有联系方式" value="has_contact" />
          <el-option label="无联系方式" value="no_contact" />
        </el-select>
      </div>
    </div>

    <!-- Row 2: 达人分类, 达人画像, 粉丝画像, 粉丝量级 -->
    <div class="filter-row">
      <div class="filter-item">
        <span class="filter-label">达人分类</span>
        <el-select
          v-model="localParams.streamerCategory"
          placeholder="全部"
          clearable
          style="width: 120px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="美妆博主" value="beauty" />
          <el-option label="美食博主" value="food" />
          <el-option label="穿搭博主" value="fashion" />
          <el-option label="母婴博主" value="baby" />
          <el-option label="数码博主" value="digital" />
        </el-select>
      </div>

      <div class="filter-item">
        <span class="filter-label">达人画像</span>
        <el-select
          v-model="localParams.streamerPortrait"
          placeholder="全部"
          clearable
          style="width: 120px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="新手达人" value="newbie" />
          <el-option label="成熟达人" value="mature" />
          <el-option label="头部达人" value="top" />
        </el-select>
      </div>

      <div class="filter-item">
        <span class="filter-label">粉丝画像</span>
        <el-select
          v-model="localParams.followerPortrait"
          placeholder="全部"
          clearable
          style="width: 120px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="年轻用户" value="young" />
          <el-option label="家庭用户" value="family" />
          <el-option label="白领用户" value="office" />
          <el-option label="学生用户" value="student" />
        </el-select>
      </div>

      <div class="filter-item">
        <span class="filter-label">粉丝量级</span>
        <el-select
          v-model="localParams.followerLevel"
          placeholder="全部"
          clearable
          style="width: 120px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="10万以下" value="level_1" />
          <el-option label="10万-50万" value="level_2" />
          <el-option label="50万-100万" value="level_3" />
          <el-option label="100万以上" value="level_4" />
        </el-select>
      </div>
    </div>

    <!-- Row 3: 带货分类, 带货方式, 带货口碑(+info), 带货水平(+info), 直播场均销售额, 带货商品价格 -->
    <div class="filter-row">
      <div class="filter-item">
        <span class="filter-label">带货分类</span>
        <el-select
          v-model="localParams.commerceCategory"
          placeholder="全部"
          clearable
          style="width: 100px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="美妆" value="beauty" />
          <el-option label="美食" value="food" />
          <el-option label="服装" value="clothing" />
          <el-option label="母婴" value="baby" />
          <el-option label="数码" value="digital" />
        </el-select>
      </div>

      <div class="filter-item">
        <span class="filter-label">带货方式</span>
        <el-select
          v-model="localParams.commerceMethod"
          placeholder="全部"
          clearable
          style="width: 120px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="直播带货" value="live" />
          <el-option label="短视频带货" value="video" />
        </el-select>
      </div>

      <div class="filter-item">
        <span class="filter-label">带货口碑</span>
        <el-select
          v-model="localParams.commerceReputation"
          placeholder="全部"
          clearable
          style="width: 100px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="优秀" value="excellent" />
          <el-option label="良好" value="good" />
          <el-option label="一般" value="average" />
        </el-select>
        <el-tooltip content="根据用户评价和退款率综合计算" placement="top">
          <el-icon class="info-icon"><InfoFilled /></el-icon>
        </el-tooltip>
      </div>

      <div class="filter-item">
        <span class="filter-label">带货水平</span>
        <el-select
          v-model="localParams.commerceLevel"
          placeholder="全部"
          clearable
          style="width: 100px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="高水平" value="high" />
          <el-option label="中等水平" value="medium" />
          <el-option label="低水平" value="low" />
        </el-select>
        <el-tooltip content="根据历史带货数据和转化率综合评估" placement="top">
          <el-icon class="info-icon"><InfoFilled /></el-icon>
        </el-tooltip>
      </div>

      <div class="filter-item">
        <span class="filter-label">直播场均销售额</span>
        <el-select
          v-model="localParams.avgLiveSales"
          placeholder="全部"
          clearable
          style="width: 120px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="1万以下" value="level_1" />
          <el-option label="1万-10万" value="level_2" />
          <el-option label="10万-50万" value="level_3" />
          <el-option label="50万以上" value="level_4" />
        </el-select>
      </div>

      <div class="filter-item">
        <span class="filter-label">带货商品价格</span>
        <el-select
          v-model="localParams.commercePrice"
          placeholder="全部"
          clearable
          style="width: 130px"
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="100元以下" value="price_1" />
          <el-option label="100-500元" value="price_2" />
          <el-option label="500-1000元" value="price_3" />
          <el-option label="1000元以上" value="price_4" />
        </el-select>
      </div>
    </div>

    <!-- Actions -->
    <div class="filter-actions">
      <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { Filter, InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  filterParams: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['query', 'reset'])

const localParams = reactive({
  cooperationStatus: '',
  contactInfo: '',
  streamerCategory: '',
  streamerPortrait: '',
  followerPortrait: '',
  followerLevel: '',
  commerceCategory: '',
  commerceMethod: '',
  commerceReputation: '',
  commerceLevel: '',
  avgLiveSales: '',
  commercePrice: ''
})

// 同步父组件的 filterParams
watch(() => props.filterParams, (newVal) => {
  Object.assign(localParams, newVal)
}, { immediate: true, deep: true })

// 打开标签筛选弹窗
function handleOpenTagFilter() {
  // TODO: 打开标签筛选弹窗
  console.log('open tag filter')
}

// 查询
function handleQuery() {
  Object.assign(props.filterParams, localParams)
  emit('query')
}

// 重置
function handleReset() {
  Object.keys(localParams).forEach(key => {
    localParams[key] = ''
  })
  emit('reset')
}

// 暴露 reset 方法给父组件
function reset() {
  handleReset()
}

defineExpose({ reset })
</script>

<style scoped lang="scss">
@import '@/assets/styles/_influencer-page.scss';

.enterprise-influencer-filter-section {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 32px;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }
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
  white-space: nowrap;
}

.info-icon {
  color: #999;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: #0064E0;
  }
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  height: 32px;
}
</style>
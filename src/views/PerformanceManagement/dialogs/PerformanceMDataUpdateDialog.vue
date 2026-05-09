<template>
  <el-dialog
    v-model="visible"
    title="数据更新说明"
    width="480px"
    :close-on-click-modal="false"
  >
    <div class="dialog-content">
      <div class="section">
        <div class="section-title">数据更新时间说明：</div>
        <ul class="section-list">
          <li>员工绩效数据每日凌晨自动更新一次</li>
          <li>数据更新完成后，更新时间会同步更新</li>
          <li>如遇数据更新延迟，请联系技术支持</li>
        </ul>
      </div>
      <div class="section">
        <div class="section-title">注意事项：</div>
        <ul class="section-list">
          <li>绩效数据仅供参考，不作为唯一考核标准</li>
          <li>数据可能存在1-2天的延迟</li>
        </ul>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="visible = false">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 8px 0;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.section-list {
  padding-left: 20px;
  margin: 0;

  li {
    font-size: 13px;
    color: #666;
    line-height: 1.8;
  }
}
</style>
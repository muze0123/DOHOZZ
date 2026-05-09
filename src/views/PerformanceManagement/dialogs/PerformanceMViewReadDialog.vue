<template>
  <el-dialog
    v-model="visible"
    title="播放量/阅读量说明"
    width="480px"
    :close-on-click-modal="false"
  >
    <div class="dialog-content">
      <div class="section">
        <div class="section-title">播放量/阅读量说明：</div>
        <ul class="section-list">
          <li>播放量：抖音平台视频的播放次数</li>
          <li>阅读量：小红书平台笔记的阅读次数</li>
        </ul>
      </div>
      <div class="section">
        <div class="section-title">计算方式：</div>
        <ul class="section-list">
          <li>播放量 = 所有合作内容的播放次数总和</li>
          <li>阅读量 = 所有合作内容的阅读次数总和</li>
        </ul>
      </div>
      <div class="section">
        <div class="section-title">注意事项：</div>
        <ul class="section-list">
          <li>数据每日更新一次</li>
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
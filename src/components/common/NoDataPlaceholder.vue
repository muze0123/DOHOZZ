<template>
  <div class="no-data-placeholder">
    <div class="content-wrapper">
      <img
        :src="NoDataImage"
        :alt="text"
        class="no-data-image"
      />
      <span class="no-data-text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import NoDataImage from '@/assets/images/nodata.png'

defineProps({
  text: {
    type: String,
    default: '暂无数据'
  }
})
</script>

<style scoped>
.no-data-placeholder {
  width: 1137.5px;
  max-width: 100%;
  padding: 113.75px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 内容区高度 126.141px 逻辑：
     图片高度 120px + margin-top 16px = 136px 总高
     视觉上垂直居中于 1137.5px 宽的容器 */
}

.no-data-image {
  width: 120px;
  height: auto;
}

.no-data-text {
  margin-top: 16px;
  color: #86909c;
  font-size: 14px;
  font-weight: 700;
}
</style>
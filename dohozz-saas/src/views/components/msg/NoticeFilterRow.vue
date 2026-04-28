<template>
  <div class="notice-filter-row">
    <span class="notice-filter-label">系统公告</span>
    <div class="notice-type-tag active">版本升级</div>
  </div>
</template>

<style scoped>
.notice-filter-row {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;
  gap: 16px;
}

.notice-filter-label {
  font-size: 13px;
  color: #8C8C8C;
}

.notice-type-tag {
  height: 24px;
  padding: 0 10px;
  background: #E6F4FF;
  border: 1px solid #91CAFF;
  border-radius: 4px;
  color: #1677FF;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
</style>

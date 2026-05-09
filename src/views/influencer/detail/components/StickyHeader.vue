<template>
  <div class="sticky-header">
    <div class="sticky-content">
      <!-- 头像 -->
      <el-avatar :size="32" :src="data.avatar" class="header-avatar">
        {{ data.name?.charAt(0) || 'D' }}
      </el-avatar>

      <!-- 用户名 -->
      <span class="header-name">{{ data.name || '达人名称' }}</span>

      <!-- 操作按钮 -->
      <div class="header-actions">
        <el-button size="small" type="primary">跟进达人</el-button>
        <el-button size="small">分配达人</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: {
    avatar?: string
    name?: string
    username?: string
  }
}

defineProps<Props>()
</script>

<style scoped>
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 48px;
  background: #ffffff;
  border-bottom: 1px solid #F0F0F0;
  padding: 0 24px;
}

.sticky-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 12px;
}

.header-avatar {
  flex-shrink: 0;
}

.header-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
</style>

<template>
  <div class="notice-list">
    <div v-if="items.length > 0">
      <NoticeItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @mark-read="$emit('markRead', $event)"
      />
    </div>
    <div v-else class="notice-empty">
      <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" class="notice-empty-icon">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
      </svg>
      <p>暂无消息</p>
    </div>
  </div>
</template>

<script setup>
import NoticeItem from './NoticeItem.vue'

defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['markRead'])
</script>

<style scoped>
.notice-list {
  background: #fff;
}

.notice-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #8C8C8C;
  font-size: 14px;
  gap: 12px;
}

.notice-empty-icon {
  opacity: 0.4;
}
</style>

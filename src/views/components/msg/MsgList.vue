<template>
  <div class="msg-list">
    <div v-if="items.length > 0">
      <MsgItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @mark-read="$emit('markRead', $event)"
      />
    </div>
    <div v-else class="msg-empty">
      <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" class="msg-empty-icon">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
      </svg>
      <p>暂无消息</p>
    </div>
  </div>
</template>

<script setup>
import MsgItem from './MsgItem.vue'

defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['markRead'])
</script>

<style scoped>
.msg-list {
  background: #fff;
  padding: 0 24px;
}

.msg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #8C8C8C;
  font-size: 14px;
  gap: 12px;
}

.msg-empty-icon {
  opacity: 0.4;
}
</style>

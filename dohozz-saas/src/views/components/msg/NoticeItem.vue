<template>
  <div class="notice-item" :class="{ read: item.isRead }">
    <!-- 公告标签 -->
    <div class="notice-tag">公告</div>
    <!-- 公告内容 -->
    <div class="notice-body">
      <div
        class="notice-content"
        :class="{ expanded: isExpanded }"
      >{{ item.content }}</div>
      <div class="notice-expand-btn" @click="toggleExpand">
        {{ isExpanded ? '收起全部 >' : '展开全部 >' }}
      </div>
    </div>
    <!-- 右侧时间+状态 -->
    <div class="notice-item-right">
      <div class="notice-time">{{ item.createdAt }}</div>
      <div class="notice-unread-dot" v-if="!item.isRead"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['markRead'])
const isExpanded = ref(false)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
  if (!props.item.isRead) {
    emit('markRead', props.item.id)
  }
}
</script>

<style scoped>
.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 24px;
  border-bottom: 1px solid #F5F5F5;
  gap: 12px;
}

.notice-item:last-child { border-bottom: none; }

.notice-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 6px;
  background: #FFF7E6;
  border: 1px solid #FFD591;
  border-radius: 3px;
  color: #FA8C16;
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

.notice-body {
  flex: 1;
  min-width: 0;
}

.notice-content {
  font-size: 13px;
  color: #262626;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-content.expanded {
  display: block;
  overflow: visible;
  -webkit-line-clamp: unset;
}

.notice-expand-btn {
  display: inline-block;
  margin-top: 6px;
  font-size: 13px;
  color: #1677FF;
  cursor: pointer;
}

.notice-expand-btn:hover { color: #4096FF; }

.notice-item-right {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  padding-top: 2px;
}

.notice-time {
  font-size: 12px;
  color: #8C8C8C;
  white-space: nowrap;
}

.notice-unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FA8C16;
  flex-shrink: 0;
  margin-top: 4px;
}

.notice-item.read .notice-unread-dot { display: none; }
</style>

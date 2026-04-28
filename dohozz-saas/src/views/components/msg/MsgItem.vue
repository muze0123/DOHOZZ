<template>
  <div
    class="msg-item"
    :class="{ read: item.isRead }"
    @click="handleClick"
  >
    <div class="msg-item-inner">
      <!-- 平台Logo -->
      <div class="msg-platform-logo">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v1.89a4.35 4.35 0 0 1-1.76 3.66c-2.15 1.65-4.67-.31-4.67-2.96 0-1.65 1.35-3.09 3.07-3.37V.06c-4.02.34-7.25 3.73-6.61 7.76 1.2 7.46 10.21 7.58 10.87.51.37-.3 1.17-.73 1.88-.84-.05.02-.09.04-.15.05-.08 0-.15-.01-.22-.01.04.13.07.27.09.41 1.34-.08 2.48-.87 2.89-2.02a4.23 4.23 0 0 1 3.08 3.04 3.93 3.93 0 0 1-.51.17h.01c-1.27.61-2.74.3-3.63-.71z"/>
        </svg>
      </div>
      <!-- 消息标签 -->
      <div class="msg-tag">消息</div>
      <!-- 消息正文 -->
      <div class="msg-body-text">{{ item.title }}</div>
      <!-- 发送时间 -->
      <div class="msg-time">{{ item.createdAt }}</div>
      <!-- 未读圆点 -->
      <div class="msg-unread-dot" v-if="!item.isRead"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { JUMP_ROUTE_MAP } from '@/api/messageCenter'

const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['markRead'])
const router = useRouter()

function handleClick() {
  if (!props.item.isRead) {
    emit('markRead', props.item.id)
  }
  if (props.item.subCategory && JUMP_ROUTE_MAP[props.item.subCategory]) {
    router.push(JUMP_ROUTE_MAP[props.item.subCategory])
  }
}
</script>

<style scoped>
.msg-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F5F5F5;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.msg-item:hover { background: #F8FBFF; }
.msg-item:last-child { border-bottom: none; }

.msg-item-inner {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.msg-platform-logo {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}

.msg-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 6px;
  background: #E6FFFB;
  border: 1px solid #87E8DE;
  border-radius: 3px;
  color: #13C2C2;
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
}

.msg-body-text {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #262626;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s;
}

.msg-item:hover .msg-body-text { color: #1677FF; }

.msg-item.read .msg-body-text { color: #8C8C8C; }

.msg-time {
  font-size: 12px;
  color: #8C8C8C;
  white-space: nowrap;
  flex-shrink: 0;
}

.msg-unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FA8C16;
  flex-shrink: 0;
}

.msg-item.read .msg-unread-dot { display: none; }
</style>

<template>
  <div
    class="msg-item"
    :class="{ read: item.isRead }"
    @click="handleClick"
  >
    <div class="msg-item-inner">
      <!-- 消息标签 -->
      <div class="msg-tag">消息</div>
      <!-- 平台Logo -->
      <div class="msg-platform-logo">
        <img :src="platformLogo" :alt="item.platform" />
      </div>
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
import { computed } from 'vue'
import { JUMP_ROUTE_MAP } from '@/api/messageCenter'
import TikTokLogo from '@/assets/images/TikTok.png'
import InstagramLogo from '@/assets/images/Instagram.png'
import LazadaLogo from '@/assets/images/Lazada.png'
import RedbookLogo from '@/assets/images/Redbook.png'
import ShopeeLogo from '@/assets/images/Shopee.png'

const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['markRead'])
const router = useRouter()

// 平台Logo映射
const platformLogoMap = {
  tiktok: TikTokLogo,
  instagram: InstagramLogo,
  lazada: LazadaLogo,
  redbook: RedbookLogo,
  shopee: ShopeeLogo
}

const platformLogo = computed(() => {
  return platformLogoMap[props.item.platform] || TikTokLogo
})

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
  height: 60px;
  padding: 0;
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
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.msg-platform-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.msg-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 6px;
  background: #E6FFFB;
  border: none;
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

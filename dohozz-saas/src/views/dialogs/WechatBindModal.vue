<template>
  <el-dialog
    :model-value="visible"
    title="微信提醒设置"
    width="340px"
    @close="$emit('update:visible', false)"
  >
    <div class="wechat-modal">
      <div class="wechat-qrcode">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <rect width="120" height="120" fill="#f5f5f5"/>
          <text x="60" y="65" text-anchor="middle" font-size="12" fill="#8c8c8c">DOHOZZ</text>
        </svg>
      </div>
      <p class="wechat-scan-tip">请用微信"扫一扫"</p>
      <p class="wechat-scan-tip">微信扫码关注"DOHOZZ"微信公众号</p>
      <div class="wechat-benefits">
        <div class="wechat-benefit-item">达人释放、达人交付等消息通知</div>
        <div class="wechat-benefit-item">达人爆单、跟进异常等消息通知</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElDialog } from 'element-plus'

defineProps({
  visible: { type: Boolean, default: false }
})

defineEmits(['update:visible'])
</script>

<style scoped>
.wechat-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.wechat-qrcode {
  width: 120px;
  height: 120px;
  border: 1px solid #F0F0F0;
  border-radius: 4px;
  overflow: hidden;
}

.wechat-scan-tip {
  font-size: 13px;
  color: #595959;
  text-align: center;
  margin: 0;
}

.wechat-benefits {
  font-size: 12px;
  color: #595959;
  line-height: 2;
  text-align: left;
  width: 100%;
}

.wechat-benefit-item::before {
  content: '✓ ';
  color: #52C41A;
}
</style>

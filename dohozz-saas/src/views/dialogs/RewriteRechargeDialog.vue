<template>
  <el-dialog
    v-model="visible"
    title="积分充值"
    width="480px"
    :close-on-click-modal="false"
  >
    <div class="current-points">
      当前积分：<span class="points-num">{{ currentPoints.toLocaleString() }}</span>
    </div>
    <div class="recharge-title">充值套餐：</div>
    <div class="recharge-list">
      <div v-for="pkg in packages" :key="pkg.points" class="recharge-item">
        <div class="pkg-info">
          <span class="pkg-points">{{ pkg.points }}积分</span>
          <span class="pkg-price">¥{{ pkg.price }}</span>
        </div>
        <el-button type="primary" size="small" @click="handleRecharge(pkg)">充值</el-button>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({ modelValue: Boolean, currentPoints: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue', 'recharge'])

const visible = ref(false)
watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const packages = [
  { points: 100, price: 10 },
  { points: 500, price: 45 },
  { points: 1000, price: 80 },
  { points: 2000, price: 150 }
]

const handleRecharge = (pkg) => {
  emit('recharge', pkg)
  ElMessage.success('充值成功')
  visible.value = false
}
</script>

<style scoped>
.current-points { font-size: 14px; color: #333; margin-bottom: 20px; }
.points-num { color: #FF6600; font-weight: bold; font-size: 16px; }
.recharge-title { font-size: 14px; color: #999; margin-bottom: 12px; }
.recharge-list { display: flex; flex-direction: column; gap: 12px; }
.recharge-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0; }
.pkg-info { display: flex; gap: 16px; align-items: center; }
.pkg-points { font-size: 14px; color: #333; font-weight: 500; }
.pkg-price { font-size: 14px; color: #FF6600; font-weight: bold; }
</style>

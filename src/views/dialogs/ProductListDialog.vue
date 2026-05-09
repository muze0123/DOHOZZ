<template>
  <el-dialog
    v-model="dialogVisible"
    title="合作商品"
    width="600px"
    @close="handleClose"
  >
    <div class="product-list" v-if="products.length > 0">
      <div
        v-for="product in products"
        :key="product"
        class="product-item"
        @click="handleViewProduct(product)"
      >
        <div class="product-icon">
          <el-icon><Goods /></el-icon>
        </div>
        <span class="product-name">{{ product }}</span>
      </div>
    </div>
    <el-empty v-else description="暂无商品" />
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Goods } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  products: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() {
  dialogVisible.value = false
}

function handleViewProduct(product) {
  ElMessage.info(`跳转商品详情: ${product}`)
}
</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1677ff;
    background: #fafafa;
  }
}

.product-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 24px;
  color: #666;
}

.product-name {
  font-size: 13px;
  color: #333;
  text-align: center;
}
</style>

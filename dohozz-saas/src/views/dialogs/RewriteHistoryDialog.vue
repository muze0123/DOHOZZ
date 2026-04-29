<template>
  <el-dialog
    v-model="visible"
    title="历史记录"
    width="520px"
    :close-on-click-modal="false"
  >
    <div v-if="store.historyList.length === 0" class="empty-tip">
      暂无历史记录
    </div>
    <div v-else class="history-list">
      <div
        v-for="item in store.historyList"
        :key="item.id"
        class="history-item"
      >
        <div class="history-info">
          <div class="history-time">{{ item.time }}</div>
          <div class="history-url">{{ item.videoUrl }}</div>
        </div>
        <div class="history-actions">
          <el-button type="primary" link size="small" @click="$emit('view', item)">查看详情</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(item.id)">删除</el-button>
        </div>
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
import { useRewriteHistoryStore } from '@/stores/rewriteHistory'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'view'])

const store = useRewriteHistoryStore()
const visible = ref(false)
watch(() => props.modelValue, (val) => { visible.value = val })
watch(visible, (val) => { if (!val) emit('update:modelValue', false) })

const handleDelete = (id) => {
  store.deleteRecord(id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.empty-tip { text-align: center; padding: 40px 0; color: #999; }
.history-list { max-height: 400px; overflow-y: auto; }
.history-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.history-info { flex: 1; min-width: 0; }
.history-time { color: #999; font-size: 12px; margin-bottom: 4px; }
.history-url { color: #333; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.history-actions { display: flex; gap: 8px; flex-shrink: 0; margin-left: 16px; }
</style>

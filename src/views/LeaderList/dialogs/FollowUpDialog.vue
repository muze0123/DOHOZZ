<template>
  <el-dialog v-model="dialogVisible" title="跟进记录" width="640px" @close="handleClose">
    <div class="follow-list">
      <div v-for="(record, idx) in followRecords" :key="idx" class="follow-item">
        <div class="follow-header">
          <span class="follow-time">{{ record.time }}</span>
          <span class="follow-type">{{ record.type }}</span>
        </div>
        <div class="follow-content">{{ record.content }}</div>
      </div>
      <el-empty v-if="followRecords.length === 0" description="暂无跟进记录" />
    </div>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  leader: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const followRecords = ref([
  { time: '2026-04-23 14:30:00', type: '系统记录', content: '团长合作已开始' },
  { time: '2026-04-20 10:00:00', type: '手动记录', content: '已确认合作意向，计划下周开始推广' }
])

function handleClose() { dialogVisible.value = false }
</script>

<style scoped>
.follow-list { max-height: 400px; overflow-y: auto; }
.follow-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
}
.follow-header { display: flex; gap: 12px; margin-bottom: 8px; }
.follow-time { font-size: 13px; color: #999; }
.follow-type { font-size: 12px; color: #1677ff; background: #e6f4ff; padding: 2px 8px; border-radius: 2px; }
.follow-content { font-size: 14px; color: #333; line-height: 1.6; }
</style>

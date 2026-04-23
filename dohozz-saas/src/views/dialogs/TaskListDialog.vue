<template>
  <el-dialog
    v-model="visible"
    title="收录任务"
    width="680px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="task-content">
      <el-tabs v-model="activeTab" class="task-tabs">
        <el-tab-pane label="达人收录任务" name="influencer">
          <div class="task-list">
            <el-empty v-if="tasks.length === 0" description="暂无收录任务" />
            <div v-else v-for="task in tasks" :key="task.id" class="task-item">
              <div class="task-info">
                <span class="task-name">{{ task.name }}</span>
                <el-tag :type="getStatusType(task.status)" size="small">{{ task.statusText }}</el-tag>
              </div>
              <div class="task-meta">
                <span>添加时间：{{ task.createTime }}</span>
                <span v-if="task.completedTime">完成时间：{{ task.completedTime }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="批量操作记录" name="batch">
          <el-empty description="暂无批量操作记录" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const activeTab = ref('influencer')

// Mock tasks data
const tasks = ref([
  {
    id: 1,
    name: '@sarahj_official',
    status: 'completed',
    statusText: '已完成',
    createTime: '2026-04-22 14:30:00',
    completedTime: '2026-04-22 14:35:00'
  },
  {
    id: 2,
    name: 'https://tiktok.com/@mikechen_tiktok',
    status: 'processing',
    statusText: '处理中',
    createTime: '2026-04-22 15:20:00',
    completedTime: null
  }
])

function getStatusType(status) {
  const typeMap = {
    completed: 'success',
    processing: 'warning',
    failed: 'danger',
    pending: 'info'
  }
  return typeMap[status] || 'info'
}

function handleClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
.task-content {
  padding: 8px 0;
}

.task-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }
}

.task-list {
  max-height: 400px;
  overflow-y: auto;
}

.task-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.task-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.task-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.task-meta {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #999;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <el-dropdown
    :visible="dropVisible"
    trigger="click"
    @visible-change="handleVisibleChange"
    @command="handleCommand"
  >
    <slot>
      <el-button size="small">
        <el-icon><MoreFilled /></el-icon>
      </el-button>
    </slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="delete">
          <el-icon><Delete /></el-icon>
          <span>删除内容</span>
        </el-dropdown-item>
        <el-dropdown-item command="archive">
          <el-icon><FolderOpened /></el-icon>
          <span>归档内容</span>
        </el-dropdown-item>
        <el-dropdown-item command="export">
          <el-icon><Download /></el-icon>
          <span>导出内容</span>
        </el-dropdown-item>
        <el-dropdown-item command="copy">
          <el-icon><CopyDocument /></el-icon>
          <span>复制内容</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { MoreFilled, Delete, FolderOpened, Download, CopyDocument } from '@element-plus/icons-vue'

const props = defineProps({
  contentId: {
    type: String,
    required: true
  },
  contentData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['delete', 'archive', 'export', 'copy'])

const dropVisible = ref(false)

function handleVisibleChange(visible) {
  dropVisible.value = visible
}

async function handleCommand(command) {
  dropVisible.value = false

  switch (command) {
    case 'delete':
      try {
        await ElMessageBox.confirm('确定要删除该内容吗？删除后不可恢复。', '删除内容', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        emit('delete', props.contentId)
      } catch (e) {
        // cancelled
      }
      break

    case 'archive':
      try {
        await ElMessageBox.confirm('确定要归档该内容吗？', '归档内容', {
          confirmButtonText: '确定归档',
          cancelButtonText: '取消',
          type: 'warning'
        })
        emit('archive', props.contentId)
      } catch (e) {
        // cancelled
      }
      break

    case 'export':
      emit('export', props.contentData || { id: props.contentId })
      break

    case 'copy':
      if (props.contentData) {
        try {
          await navigator.clipboard.writeText(JSON.stringify(props.contentData))
          ElMessage.success('内容信息已复制到剪贴板')
        } catch (e) {
          ElMessage.warning('复制失败，请手动复制')
        }
      }
      emit('copy', props.contentData)
      break
  }
}
</script>

<style scoped>
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

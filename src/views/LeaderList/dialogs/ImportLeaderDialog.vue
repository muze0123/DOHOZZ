<template>
  <el-dialog v-model="dialogVisible" title="批量导入合作团长" width="520px" @close="handleClose">
    <div class="import-tip">
      请下载模板文件，填写团长信息后上传。支持 Excel 格式文件。
    </div>
    <div class="upload-area">
      <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        :limit="1"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传 xlsx/xls 文件</div>
        </template>
      </el-upload>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleDownload">下载模板</el-button>
      <el-button type="primary" @click="handleConfirm">确定导入</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleClose() { dialogVisible.value = false }
function handleDownload() { ElMessage.info('模板下载功能开发中') }
function handleConfirm() { emit('success') }
</script>

<style scoped>
.import-tip {
  font-size: 14px;
  color: #666;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
}
.upload-area {
  padding: 20px 0;
}
</style>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="手动添加视频"
    width="560px"
    @close="handleClose"
  >
    <div class="add-form">
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>视频标题</div>
        <el-input
          v-model="title"
          placeholder="请输入视频标题"
          maxlength="100"
          show-word-limit
        />
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>视频链接</div>
        <el-input
          v-model="videoLink"
          placeholder="请输入视频链接"
        />
      </div>
      <div class="form-row">
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>所属平台</div>
          <el-select v-model="platform" placeholder="请选择" style="width: 100%">
            <el-option label="TikTok" value="tiktok" />
            <el-option label="Instagram" value="instagram" />
            <el-option label="Shopee" value="shopee" />
            <el-option label="Lazada" value="lazada" />
          </el-select>
        </div>
        <div class="form-item">
          <div class="form-label"><span class="required">*</span>达人</div>
          <el-select v-model="influencerId" placeholder="请选择达人" filterable style="width: 100%">
            <el-option
              v-for="inf in influencerOptions"
              :key="inf.id"
              :label="inf.name"
              :value="inf.id"
            />
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>挂链商品</div>
        <el-select v-model="productIds" multiple placeholder="请选择商品" filterable style="width: 100%">
          <el-option
            v-for="p in productOptions"
            :key="p.id"
            :label="p.name"
            :value="p.id"
          />
        </el-select>
      </div>
      <div class="form-item">
        <div class="form-label"><span class="required">*</span>授权码</div>
        <el-input
          v-model="authCode"
          placeholder="请输入授权码"
        />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  influencerOptions: {
    type: Array,
    default: () => []
  },
  productOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const title = ref('')
const videoLink = ref('')
const platform = ref('')
const influencerId = ref('')
const productIds = ref([])
const authCode = ref('')

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

function resetForm() {
  title.value = ''
  videoLink.value = ''
  platform.value = ''
  influencerId.value = ''
  productIds.value = []
  authCode.value = ''
}

function handleConfirm() {
  if (!title.value) {
    ElMessage.warning('请填写视频标题')
    return
  }
  if (!videoLink.value) {
    ElMessage.warning('请填写视频链接')
    return
  }
  if (!platform.value) {
    ElMessage.warning('请选择所属平台')
    return
  }
  if (!influencerId.value) {
    ElMessage.warning('请选择达人')
    return
  }
  if (productIds.value.length === 0) {
    ElMessage.warning('请选择挂链商品')
    return
  }
  if (!authCode.value) {
    ElMessage.warning('请输入授权码')
    return
  }
  emit('success')
}
</script>

<style scoped>
.add-form {
  padding: 8px 0;
}

.form-item {
  margin-bottom: 16px;

  .form-label {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;

    .required {
      color: #ff4d4f;
      margin-right: 4px;
    }
  }
}

.form-row {
  display: flex;
  gap: 16px;

  .form-item {
    flex: 1;
  }
}
</style>
